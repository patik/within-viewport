import { withinviewportAsync } from '../../package/modern/src/index'
import { isSide } from '../../package/modern/src/options'

const wvOptions: Record<Side, number> = {
    all: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
}

// Query function that returns a proper array
function query(selector: string, node?: HTMLElement): Array<HTMLElement> {
    if (typeof node === 'undefined') {
        node = document.body
    }

    return Array.from(node.querySelectorAll(selector))
}

function showAll(selector: string) {
    query(selector).forEach((elem) => {
        elem.style.display = 'block'
    })
}

function hideAll(selector: string) {
    query(selector).forEach((elem) => {
        elem.style.display = 'none'
    })
}

function triggerEvent(node: HTMLElement, eventName: string) {
    // Modern browsers (as of the 2020s)
    if (typeof Event !== 'undefined') {
        node.dispatchEvent(new Event(eventName, { bubbles: true, cancelable: true }))
    }
    // The first generation of standards-compliant browsers (not IE) from the 2000s
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
    // IE
    else if ('createEventObject' in document && typeof document.createEventObject === 'function') {
        const evt = document.createEventObject()

        evt.eventType = eventName

        if ('fireEvent' in node && typeof node.fireEvent === 'function') {
            node.fireEvent('on' + evt.eventType, evt)
        }
    }
}

const areViewportUnitsSupported = (function () {
    try {
        const div = document.createElement('div')
        div.style.width = '50vw'
        document.body.appendChild(div)

        const elemWidth = parseInt(getComputedStyle(div, null).width, 10)
        const halfWidth = parseInt(String(window.innerWidth / 2), 10)

        console.log('areViewportUnitsSupported ', elemWidth === halfWidth, elemWidth, halfWidth)

        return elemWidth === halfWidth
    } catch (e) {
        console.log('e ', e)
        return false
    }
})()

function determineBoxWidth() {
    if (areViewportUnitsSupported) {
        return '23vw'
    }

    let boxWidth = 20

    // Make sure the demo will be wider than the device's screen so that vertical scroll bars appear
    //    but not so wide that you can't see at least four on screen at a time with a maximized browser window
    if (screen.width >= screen.height) {
        // Screen is wide/landscape
        boxWidth = parseInt(String((screen.width + 400) / 10), 10)
    } else {
        boxWidth = parseInt(String((screen.height + 400) / 10), 10)
    }

    return `${boxWidth}px`
}

function isFlexboxSupported() {
    return document.createElement('p').style.flex === ''
}

// Demo code
function demo() {
    let $boxes: HTMLElement[] = []
    let showBoundsCheck: HTMLInputElement | null = null

    function init() {
        const boxCount = 200
        let boxHTML = ''
        const boxWidth = determineBoxWidth()

        // Add a container and put the boxes inside
        const boxContainer = document.createElement('div')
        boxContainer.id = 'boxContainer'

        if (isFlexboxSupported()) {
            let i = 0
            // Generate boxes which will each be tested for their viewport within-ness
            while (i < boxCount) {
                boxHTML += '<div aria-hidden="false">&nbsp;</div>'

                i++
            }

            boxContainer.classList.add('flex')
        } else {
            let i = 0
            while (i < boxCount) {
                // Set the styles so everything is nice and proportional to this device's screen
                boxHTML +=
                    '<div aria-hidden="false" style="width:' +
                    boxWidth +
                    ';height:' +
                    boxWidth +
                    ';line-height:' +
                    boxWidth +
                    ';">&nbsp;</div>'
                i++
            }

            boxContainer.classList.add('no-flex')
            boxContainer.style.cssText = 'width:' + (parseInt(boxWidth, 10) * 10 + 20) + 'px;'
        }

        boxContainer.innerHTML = boxHTML
        document.body.appendChild(boxContainer)

        $boxes = query('div', boxContainer)
        $boxes[4].id = 'test'

        const checkbox = document.getElementById('show-boundary')

        // FIXME
        if (checkbox && (checkbox as HTMLInputElement).type === 'checkbox') {
            // FIXME
            showBoundsCheck = checkbox as HTMLInputElement
        }

        eventsInit()

        // Update the <div>s for the first time
        updateBoxes()
    }

    ////////////
    // Events //
    ////////////

    // Setup event listeners
    function eventsInit() {
        // Scroll or window resize
        window.addEventListener('resize', updateBoxes)
        window.addEventListener('scroll', updateBoxes)

        // User entry
        query('input[type="number"]').forEach((elem) => {
            elem.addEventListener('keyup', onBoundaryChange)
            elem.addEventListener('change', onBoundaryChange)
            elem.addEventListener('click', onBoundaryChange) // 'click' is for spinners on input[number] control
        })

        // Boundary toggle
        showBoundsCheck?.addEventListener('change', onBoundaryToggle)

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
            showAll('#thresholds p')
            document.body.addEventListener('keydown', onNudge)
        }

        // Controls toggler
        document.getElementById('toggler')?.addEventListener('click', onControlsToggle)
    }

    // When a boundary value changes
    function onBoundaryChange(evt: Event) {
        // FIXME - Make TS work properly with DOM events
        const target = evt.target as HTMLInputElement | null
        const val = parseInt(target?.value ?? '', 10)
        const side = target?.id

        if (!isSide(side)) {
            throw new Error('Input ID must be a valid side')
        }

        // Positive value was entered (negative values are allowed, but the boundaries would be off screen)
        if (val > 0) {
            if (showBoundsCheck?.checked) {
                showAll(`.boundary-${side}`)

                drawBound(side, val)
            } else {
                hideAll(`.boundary-${side}`)
            }
        }
        // Hide boundaries
        else {
            hideAll(`.boundary-${side}`)
        }

        // Update the page
        wvOptions[side] = val
        updateBoxes()
        toggleBoundaryToggle()
    }

    // When the boundary toggle box is checked/unchecked
    function onBoundaryToggle(evt: Event) {
        // FIXME - Make TS work properly with DOM events
        const target = evt.target as HTMLInputElement | null

        if (showBoundsCheck?.checked) {
            // Fire the change event so onBoundaryChange() will apply any values
            query('input[type="number"]').forEach(function (elem) {
                triggerEvent(elem, 'change')
            })

            toggleBoundaryToggle()
        } else {
            hideAll('.boundary, .boundary-' + (target?.id ?? ''))
        }
    }

    // When shift + arrow key is pressed, nudge the page by 1px
    function onNudge(evt: KeyboardEvent) {
        // FIXME - Make TS work properly with DOM events
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

        window.scrollBy(scrollVals[code][0], scrollVals[code][1])

        evt.preventDefault()
    }

    function onControlsToggle() {
        document.getElementById('explanation')?.classList.toggle('collapsed')

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

    // Display or hide the "show boundaries" check box if any values are set (non-zero)
    function toggleBoundaryToggle() {
        if (!showBoundsCheck || !showBoundsCheck.parentNode) {
            return
        }

        const somethingEntered = query('input[type="number"]').some(
            (elem) => parseInt(elem.getAttribute('value') ?? '', 10) !== 0,
        )

        if (somethingEntered) {
            if (showBoundsCheck.parentElement) {
                showBoundsCheck.parentElement.style.display = 'block'
            }
        } else {
            if (showBoundsCheck.parentElement) {
                showBoundsCheck.parentElement.style.display = 'none'
            }
        }
    }

    // Overlay a boundary line on the viewport when one is set by the user
    function drawBound(side: Side, dist: number) {
        const distStr = `${dist}px`

        switch (side) {
            case 'top': {
                query('.boundary-top').forEach((elem) => {
                    elem.style.top = distStr
                    elem.style.height = distStr
                    elem.style.marginTop = `-${distStr}`
                })
                break
            }

            case 'right': {
                query('.boundary-right').forEach((elem) => {
                    elem.style.right = distStr
                    elem.style.width = distStr
                    elem.style.marginRight = `-${distStr}`
                })
                break
            }

            case 'bottom': {
                query('.boundary-bottom').forEach((elem) => {
                    elem.style.bottom = distStr
                    elem.style.height = distStr
                    elem.style.marginBottom = `-${distStr}`
                })
                break
            }

            case 'left': {
                query('.boundary-left').forEach((elem) => {
                    elem.style.left = distStr
                    elem.style.width = distStr
                    elem.style.marginLeft = `-${distStr}`
                })
                break
            }

            default:
                break
        }
    }

    // Update each box's class to reflect whether it was determined to be within the viewport or not
    function updateBoxes() {
        $boxes.forEach(async function (box) {
            if (await withinviewportAsync(box, wvOptions)) {
                box.innerHTML = 'in'
                box.setAttribute('aria-hidden', 'false')
                box.classList.add('inview')
            } else {
                box.innerHTML = 'out'
                box.setAttribute('aria-hidden', 'true')
                box.classList.remove('inview')
            }
        })
    }

    window.addEventListener('load', init)
}

demo()
