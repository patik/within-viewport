import { isSide } from '../../../module/src/common/sides'
import { drawBound } from './boundaries'
import { createBoxHtml, updateBoxes } from './boxes'
import { hideAll, query, showAll } from './dom'
import { updateBoundaryPreview, updateCodeOutput } from './output'
import store from './store'

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
    boundaryCheckboxes: '.boundary-form input[type="checkbox"]',
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
    query(selectors.boundaryCheckboxes).forEach((elem) => {
        elem.addEventListener('change', onBoundaryCheckboxChange)
    })

    // Boundary number entry
    // Note that this `change` will also fire after `blur` the field, which is annoying
    // e.g. if this input is focused when the ignore checkbox is checked, this could fire *after* the checkbox handler, overwriting a newer state
    query(selectors.boundaryNumberInputs).forEach((elem) => {
        elem.addEventListener('keyup', onBoundaryValueChange)
        elem.addEventListener('change', onBoundaryValueChange)
        // 'click' is for spinners on input[number] control
        elem.addEventListener('click', onBoundaryValueChange)
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
    updateBoxes.cancel()

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
    const boxContainer = document.getElementById('box-container')

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
function onBoundaryCheckboxChange(evt: Event) {
    // TODO - Make TS work properly with DOM events
    const target = evt.target as HTMLInputElement | null

    if (!target) {
        throw new Error('Could not get event target')
    }

    const side = target.name.replace(/boundary-/, '')

    if (!isSide(side)) {
        throw new Error('Could not get side from input name')
    }

    const numberInput = document.querySelector<HTMLInputElement>(`input[id="boundary-${side}-value"]`)

    if (!numberInput) {
        throw new Error('Could not find numeric input')
    }

    if (target.checked) {
        store.setState((state) => ({
            boundaries: {
                ...state.boundaries,
                [side]: 'ignore',
            },
        }))

        numberInput.disabled = true
        hideAll(`.boundary-${side}`)
    } else {
        store.setState((state) => ({
            boundaries: {
                ...state.boundaries,
                [side]: parseInt(numberInput.value, 10),
            },
        }))

        numberInput.disabled = false
        showAll(`.boundary-${side}`)
    }

    // Update the page
    updateBoxes()
    updateCodeOutput()
    updateBoundaryPreview()
}

// When a boundary value changes
function onBoundaryValueChange(evt: Event) {
    // TODO - Make TS work properly with DOM events
    const target = evt.target as HTMLInputElement | null
    const val = parseInt(target?.value ?? '', 10)
    const side = target?.id.replace(/^boundary-(\w+)-value$/, '$1')

    if (!isSide(side)) {
        throw new Error('Input ID must be a valid side')
    }

    store.setState((state) => ({
        boundaries: {
            ...state.boundaries,
            [side]: val,
        },
    }))

    // Positive value was entered (negative values are allowed, but the boundaries would be off screen)
    if (val > 0) {
        showAll(`.boundary-${side}`)
        drawBound(side, val)
    }
    // Hide visual boundary, but store the negative value
    else {
        hideAll(`.boundary-${side}`)
    }

    // Update the page
    updateBoxes()
    updateCodeOutput()
    updateBoundaryPreview()
}

// When shift + arrow key is pressed, nudge the page by 1px
function onNudge(evt: KeyboardEvent) {
    // TODO - Make TS work properly with DOM events
    const target = evt.target as HTMLInputElement | null

    // Ignore this event when an input field has focus
    if (target?.nodeName === 'INPUT') {
        return true
    }

    if (!evt.shiftKey) {
        return
    }

    let code = evt.code

    // For older browsers that don't support `code`, convert the `keyCode` to a `code`
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

    if (toggler.innerHTML === 'Collapse') {
        toggler.innerHTML = 'Expand'
    } else {
        toggler.innerHTML = 'Collapse'
    }
}
