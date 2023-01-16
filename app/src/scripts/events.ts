import { Side } from '../../../package/src/common/common.types'
import { isSide } from '../../../package/src/common/sides'
import { drawBound } from './boundaries'
import { createBoxHtml, setSideStrategy, updateBoxes } from './boxes'
import { hideAll, query, showAll, triggerEvent } from './dom'
import store from './store'

// Setup event listeners
export function eventsInit() {
    // Scroll or resize the viewport
    store.getState().containerForEvents.addEventListener('resize', updateBoxes)
    store.getState().containerForEvents.addEventListener('scroll', updateBoxes)

    // Method radio buttons
    query('[name="method-form"]').forEach((elem) => {
        elem.addEventListener('change', onMethodChange)
    })

    // Container radio buttons
    query('[name="container-form"]').forEach((elem) => {
        elem.addEventListener('change', onContainerFormChange)
    })

    // Threshold radio buttons
    query('[name="side-strategy"]').forEach((elem) => {
        elem.addEventListener('change', onSideStrategyChange)
    })

    // Threshold number entry
    query('input[type="number"]').forEach((elem) => {
        elem.addEventListener('keyup', onBoundaryChange)
        elem.addEventListener('change', onBoundaryChange)
        // 'click' is for spinners on input[number] control
        elem.addEventListener('click', onBoundaryChange)
    })

    // Nudge controls
    // Only certain combinations of browsers/OSes allow capturing arrow key strokes, unfortunately
    // Windows: Firefox, Trident, Safari, Opera; Mac: Chrome, Safari, Opera; Not Firefox
    if (
        ('oscpu' in navigator &&
            navigator.oscpu &&
            typeof navigator.oscpu === 'string' &&
            /Windows/.test(navigator.oscpu) &&
            /Firefox|Trident|Safari|Presto/.test(navigator.userAgent)) ||
        (/Macintosh/.test(navigator.userAgent) && /Chrome|Safari|Presto/.test(navigator.userAgent))
    ) {
        document.body.addEventListener('keydown', onNudge)
        showAll('.nudge-instructions')
    }

    // Controls toggler
    document.getElementById('toggler')?.addEventListener('click', onControlsToggle)
}

export function removeEvents() {
    // Scroll or resize the viewport
    store.getState().containerForEvents.removeEventListener('resize', updateBoxes)
    store.getState().containerForEvents.removeEventListener('scroll', updateBoxes)

    // Method radio buttons
    query('[name="method-form"]').forEach((elem) => {
        elem.removeEventListener('change', onMethodChange)
    })

    // Container radio buttons
    query('[name="container-form"]').forEach((elem) => {
        elem.removeEventListener('change', onContainerFormChange)
    })

    // Threshold radio buttons
    query('[name="side-strategy"]').forEach((elem) => {
        elem.removeEventListener('change', onSideStrategyChange)
    })

    // User entry
    query('input[type="number"]').forEach((elem) => {
        elem.removeEventListener('keyup', onBoundaryChange)
        elem.removeEventListener('change', onBoundaryChange)
        // 'click' is for spinners on input[number] control
        elem.removeEventListener('click', onBoundaryChange)
    })

    // Nudge controls
    // Only certain combinations of browsers/OSes allow capturing arrow key strokes, unfortunately
    // Windows: Firefox, Trident, Safari, Opera; Mac: Chrome, Safari, Opera; Not Firefox
    if (
        ('oscpu' in navigator &&
            navigator.oscpu &&
            typeof navigator.oscpu === 'string' &&
            /Windows/.test(navigator.oscpu) &&
            /Firefox|Trident|Safari|Presto/.test(navigator.userAgent)) ||
        (/Macintosh/.test(navigator.userAgent) && /Chrome|Safari|Presto/.test(navigator.userAgent))
    ) {
        document.body.removeEventListener('keydown', onNudge)
        showAll('.nudge-instructions')
    }

    // Controls toggler
    document.getElementById('toggler')?.removeEventListener('click', onControlsToggle)
}

// When the method/version radio buttons change
function onMethodChange(evt: Event) {
    // TODO - Make TS work properly with DOM events
    const target = evt.target as HTMLInputElement | null
    const whichRadio = target?.value ?? ''

    if (whichRadio === 'async') {
        store.setState({
            method: 'async',
        })
    } else {
        store.setState({
            method: 'sync',
        })
    }

    // Update the page
    updateBoxes()
}

// When the container radio buttons change
function onContainerFormChange(evt: Event) {
    // TODO - Make TS work properly with DOM events
    const target = evt.target as HTMLInputElement | null
    const whichRadio = target?.value ?? ''

    removeEvents()

    // Remove any previously-existing box containers
    const boxContainer = document.getElementById('boxContainer')

    if (boxContainer) {
        boxContainer.parentNode?.removeChild(boxContainer)
    }

    const viewportContainer = document.getElementById('container')

    if (whichRadio === 'window') {
        store.setState({
            containerForDOM: document.body,
            containerForEvents: window,
        })

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
        }
    }

    // Update the page
    createBoxHtml()
}

const sides: Side[] = ['top', 'left', 'bottom', 'right']

// When the threshold radio buttons change
function onSideStrategyChange(evt: Event) {
    // TODO - Make TS work properly with DOM events
    const target = evt.target as HTMLInputElement | null
    const whichRadio = target?.value ?? ''

    if (whichRadio === 'independent') {
        setSideStrategy('independent')
        hideAll('.all-sides-wrapper')
        showAll('.independent-sides-wrapper')
        sides.forEach((side) => {
            triggerEvent(document.getElementById(side), 'change')
        })
        query('.side-strategy-group-1')[0].classList.remove('selected')
        query('.side-strategy-group-2')[0].classList.add('selected')
    } else {
        setSideStrategy('all')
        hideAll('.independent-sides-wrapper')
        showAll('.all-sides-wrapper')
        triggerEvent(document.getElementById('all'), 'change')
        query('.side-strategy-group-2')[0].classList.remove('selected')
        query('.side-strategy-group-1')[0].classList.add('selected')
    }

    // Update the page
    updateBoxes()
}

// When a boundary value changes
function onBoundaryChange(evt: Event) {
    // TODO - Make TS work properly with DOM events
    const target = evt.target as HTMLInputElement | null
    const val = parseInt(target?.value ?? '', 10)
    const side = target?.id

    if (!isSide(side)) {
        throw new Error('Input ID must be a valid side')
    }

    // Positive value was entered (negative values are allowed, but the boundaries would be off screen)
    if (val > 0) {
        if (side === 'all') {
            showAll(`.boundary-top`)
            showAll(`.boundary-right`)
            showAll(`.boundary-bottom`)
            showAll(`.boundary-left`)
        } else {
            showAll(`.boundary-${side}`)
        }

        drawBound(side, val)
    }
    // Hide boundaries
    else {
        hideAll(`.boundary-${side}`)
    }

    // Update the page
    store.setState((state) => ({
        wvOptions: {
            ...state.wvOptions,
            [side]: val,
        },
    }))

    updateBoxes()
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
    document.querySelector('.explanation')?.classList.toggle('collapsed')

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
