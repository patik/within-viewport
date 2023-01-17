import { isSide } from '../../../package/src/common/sides'
import { drawBound } from './boundaries'
import { createBoxHtml, updateBoxes } from './boxes'
import { hideAll, query, showAll } from './dom'
import { updateCodeOutput } from './output'
import store from './store'

export function triggerEvent(node: HTMLElement | null, eventName: string) {
    if (!node) {
        return
    }

    // Modern browsers (as of the 2020s)
    if (typeof Event !== 'undefined') {
        node.dispatchEvent(new Event(eventName, { bubbles: true, cancelable: true }))
    }
    // The first generation of standards-compliant browsers (not IE) from the 2010s
    else if (document.createEvent) {
        const evt = document.createEvent('HTMLEvents')

        if ('initEvent' in evt) {
            evt.initEvent(eventName, true, true)
        }

        if ('eventName' in evt) {
            evt.eventName = eventName
        }

        node.dispatchEvent(evt)
    }
    // Old IE
    else if ('createEventObject' in document && typeof document.createEventObject === 'function') {
        const evt = document.createEventObject()

        evt.eventType = eventName

        if ('fireEvent' in node && typeof node.fireEvent === 'function') {
            node.fireEvent('on' + evt.eventType, evt)
        }
    }
}

// Only certain combinations of browsers/OSes allow capturing arrow key strokes, unfortunately
// Windows: Firefox, Trident, Safari, Opera; Mac: Chrome, Safari, Opera; Not Firefox
function areNudgeControlsSupported() {
    return (
        ('oscpu' in navigator &&
            navigator.oscpu &&
            typeof navigator.oscpu === 'string' &&
            /Windows/.test(navigator.oscpu) &&
            /Firefox|Trident|Safari|Presto/.test(navigator.userAgent)) ||
        (/Macintosh/.test(navigator.userAgent) && /Chrome|Safari|Presto/.test(navigator.userAgent))
    )
}

const selectors = {
    methodRadios: '[name="method-form"]',
    containerRadios: '[name="container-form"]',
    boundaryRadios: '.boundary-form input[type="radio"]',
    boundaryNumberInputs: '.boundary-form input[type="number"]',
}

// Setup event listeners
export function addEventHandlers() {
    const { containerForEvents } = store.getState()

    // Scroll or resize the viewport
    containerForEvents.addEventListener('resize', updateBoxes)
    containerForEvents.addEventListener('scroll', updateBoxes)

    // Method radio buttons
    query(selectors.methodRadios).forEach((elem) => {
        elem.addEventListener('change', onMethodChange)
    })

    // Container radio buttons
    query(selectors.containerRadios).forEach((elem) => {
        elem.addEventListener('change', onContainerFormChange)
    })

    // Boundary radio buttons
    query(selectors.boundaryRadios).forEach((elem) => {
        elem.addEventListener('change', onBoundaryRadioChange)
    })

    // Boundary number entry
    query(selectors.boundaryNumberInputs).forEach((elem) => {
        elem.addEventListener('keyup', onBoundaryChange)
        elem.addEventListener('change', onBoundaryChange)
        // 'click' is for spinners on input[number] control
        elem.addEventListener('click', onBoundaryChange)
    })

    // Nudge controls
    if (areNudgeControlsSupported()) {
        document.body.addEventListener('keydown', onNudge)
        showAll('.nudge-instructions')
    }

    // Controls toggler
    document.getElementById('toggler')?.addEventListener('click', onControlsToggle)
}

/**
 * When we changed which element is used as the viewport, we need to 'move' the event handlers to the correct element
 */
function resetContainerEventHandlers(previousContainer: HTMLElement | Window, nextContainer: HTMLElement | Window) {
    // Remove handlers from the old container
    previousContainer.removeEventListener('resize', updateBoxes)
    previousContainer.removeEventListener('scroll', updateBoxes)

    // Add handlers to the new container
    nextContainer.addEventListener('resize', updateBoxes)
    nextContainer.addEventListener('scroll', updateBoxes)
}

// When the method/version radio buttons change
function onMethodChange(evt: Event) {
    // TODO - Make TS work properly with DOM events
    const target = evt.target as HTMLInputElement | null
    const whichRadio = target?.value ?? ''

    if (whichRadio === 'async') {
        store.setState({
            methodType: 'async',
        })
    } else {
        store.setState({
            methodType: 'sync',
        })
    }

    // Update the page
    updateBoxes()
    updateCodeOutput()
}

// When the container radio buttons change
function onContainerFormChange(evt: Event) {
    // TODO - Make TS work properly with DOM events
    const target = evt.target as HTMLInputElement | null
    const whichRadio = target?.value ?? ''

    // Remove any previously-existing box containers
    const boxContainer = document.getElementById('boxContainer')

    if (boxContainer) {
        boxContainer.parentNode?.removeChild(boxContainer)
    }

    const viewportContainer = document.getElementById('arbitrary-viewport-container')

    const previousContainerForEvens = store.getState().containerForEvents

    if (whichRadio === 'window') {
        store.setState({
            containerForDOM: document.body,
            containerForEvents: window,
        })
        resetContainerEventHandlers(previousContainerForEvens, window)

        if (viewportContainer) {
            viewportContainer.style.display = 'none'
        }
    } else {
        if (viewportContainer) {
            viewportContainer.style.display = 'block'

            store.setState({
                containerForDOM: viewportContainer,
                containerForEvents: viewportContainer,
            })

            resetContainerEventHandlers(previousContainerForEvens, viewportContainer)
        }
    }

    // Update the page
    createBoxHtml()
    updateCodeOutput()
}

// When the boundary radio buttons change, e.g. choosing whether to ignore a side
function onBoundaryRadioChange(evt: Event) {
    // TODO - Make TS work properly with DOM events
    const target = evt.target as HTMLInputElement | null

    if (!target) {
        throw new Error('Could not get event target')
    }

    const side = target.name.replace(/boundary-/, '')

    if (!isSide(side)) {
        throw new Error('Could not get side from input name')
    }

    const whichRadio = target.value

    if (whichRadio === 'threshold') {
        const input = document.querySelector<HTMLInputElement>(`input[id="boundary-${side}-value"]`)

        if (!input) {
            throw new Error('Could not find numeric input')
        }

        store.setState((state) => ({
            boundaries: {
                ...state.boundaries,
                [side]: parseInt(input.value, 10),
            },
        }))
    } else {
        store.setState((state) => ({
            boundaries: {
                ...state.boundaries,
                [side]: 'ignore',
            },
        }))
    }

    // Update the page
    updateBoxes()
    updateCodeOutput()
}

// When a boundary value changes
function onBoundaryChange(evt: Event) {
    // TODO - Make TS work properly with DOM events
    const target = evt.target as HTMLInputElement | null
    const val = parseInt(target?.value ?? '', 10)
    const side = target?.id.replace(/^boundary-(\w+)-value/, '$1')

    if (!isSide(side)) {
        throw new Error('Input ID must be a valid side')
    }

    // Positive value was entered (negative values are allowed, but the boundaries would be off screen)
    if (val > 0) {
        showAll(`.boundary-${side}`)

        store.setState((state) => ({
            boundaries: {
                ...state.boundaries,
                [side]: val,
            },
        }))

        drawBound(side, val)
    }
    // Hide visual boundary, but store the negative value
    else {
        store.setState((state) => ({
            boundaries: {
                ...state.boundaries,
                [side]: val,
            },
        }))

        hideAll(`.boundary-${side}`)
    }

    // Update the page
    updateBoxes()
    updateCodeOutput()
}

// When shift + arrow key is pressed, nudge the page by 1px
function onNudge(evt: KeyboardEvent) {
    // TODO - Make TS work properly with DOM events
    const target = evt.target as HTMLInputElement | null

    // Ignore input fields
    if (target?.nodeName === 'INPUT') {
        return true
    }

    if (!evt.shiftKey) {
        return
    }

    let code = evt.code

    if (typeof code === 'undefined' && 'keyCode' in evt) {
        switch (evt.keyCode) {
            case 37: {
                code = 'ArrowLeft'
                break
            }
            case 38: {
                code = 'ArrowUp'
                break
            }
            case 39: {
                code = 'ArrowRight'
                break
            }
            case 40: {
                code = 'ArrowDown'
                break
            }
            default: {
                // Some other, non-arrow key was pressed
                break
            }
        }
    }

    if (!code || !/^Arrow\w+/.test(code)) {
        return
    }

    const scrollVals: Record<string, [number, number]> = {
        ArrowUp: [0, -1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
        ArrowDown: [0, 1],
    }

    store.getState().containerForEvents.scrollBy(scrollVals[code][0], scrollVals[code][1])

    evt.preventDefault()
}

function onControlsToggle() {
    document.querySelector('.control-panel')?.classList.toggle('collapsed')

    const toggler = document.getElementById('toggler')

    if (!toggler) {
        return
    }

    toggler.classList.toggle('plus')
    toggler.classList.toggle('minus')

    if (toggler.innerHTML === 'Collapse') {
        toggler.innerHTML = 'Expand'
    } else {
        toggler.innerHTML = 'Collapse'
    }
}
