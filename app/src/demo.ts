/* eslint-disable @typescript-eslint/ban-ts-comment */
import { withinviewport } from '../../package/modern/src/index'
import { isSide } from '../../package/modern/src/options'

type Side = 'top' | 'right' | 'bottom' | 'left'

const wvOptions: Record<Side, number> = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
}

// Demo code
export default (function () {
    let $boxes: HTMLElement[] = []
    let showBoundsCheck: HTMLInputElement | null = null

    function init() {
        const boxCount = 100
        let boxWidth = 20
        let boxHTML = ''
        let i

        // Make sure the demo will be wider than the device's screen so that vertical scroll bars appear
        //    but not so wide that you can't see at least four on screen at a time with a maximized browser window
        if (screen.width >= screen.height) {
            // Screen is wide/landscape
            boxWidth = parseInt(String((screen.width + 400) / 10), 10)
        } else {
            boxWidth = parseInt(String((screen.height + 400) / 10), 10)
        }

        // Generate boxes which will each be tested for their viewport within-ness
        i = 0
        while (i < boxCount) {
            // Set the styles so everything is nice and proportional to this device's screen
            boxHTML +=
                '<div aria-hidden="false" style="width:' +
                boxWidth +
                'px;height:' +
                boxWidth +
                'px;line-height:' +
                boxWidth +
                'px;">&nbsp;</div>'
            i++
        }

        // Add a container and put the boxes inside
        const boxContainer = document.createElement('div')
        boxContainer.id = 'boxContainer'
        boxContainer.style.cssText = 'width:' + (boxWidth * 10 + 20) + 'px;'
        boxContainer.innerHTML = boxHTML
        document.body.appendChild(boxContainer)

        $boxes = query('div', boxContainer)
        $boxes[4].id = 'test'

        const checkbox = document.getElementById('show-boundary')

        // FIXME
        if (checkbox && (checkbox as HTMLInputElement).type === 'checkbox') {
            showBoundsCheck = checkbox as HTMLInputElement
        }

        eventsInit()

        // Update the <div>s for the first time
        updateBoxes()
    }

    // Query function
    function query(selector: string, node?: HTMLElement): Array<HTMLElement> {
        if (typeof node === 'undefined') {
            node = document.body
        }

        return [].slice.call(node.querySelectorAll(selector))
    }

    function showAll(selector: string) {
        console.log('selector ', selector, query(selector))
        query(selector).forEach((elem) => {
            elem.style.display = 'block'
        })
    }

    function hideAll(selector: string) {
        query(selector).forEach((elem) => {
            elem.style.display = 'none'
        })
    }

    function trigger(node: HTMLElement, eventName: string) {
        if (document.createEvent) {
            const evt = document.createEvent('HTMLEvents')

            evt.initEvent(eventName, true, true)

            if ('eventName' in evt) {
                evt.eventName = eventName
            }

            node.dispatchEvent(evt)
        } else if ('createEventObject' in document && typeof document.createEventObject === 'function') {
            const evt = document.createEventObject()

            evt.eventType = eventName

            if ('fireEvent' in node && typeof node.fireEvent === 'function') {
                node.fireEvent('on' + evt.eventType, evt)
            }
        }
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
        query('input[type="number"]').forEach(function (elem) {
            elem.addEventListener('keyup', onBoundaryChange)
            elem.addEventListener('change', onBoundaryChange)
            elem.addEventListener('click', onBoundaryChange) // 'click' is for spinners on input[number] control
        })

        // Boundary toggle
        // @ts-ignore
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
        // Annoying that I can't get something so basic to be typed correctly
        const target = evt.target as HTMLInputElement | null
        const val = parseInt(target?.value ?? '', 10)

        const id = target?.id

        if (!isSide(id)) {
            throw new Error('Input ID must be a valid side')
        }

        const side = id as Side

        // Positive value was entered (negative values are allowed, but the boundaries would be off screen)
        if (val > 0) {
            // @ts-ignore
            if (showBoundsCheck?.checked) {
                showAll('.boundary-' + id)

                drawBound(side, val)
            } else {
                hideAll('.boundary-' + id)
            }
        }
        // Hide boundaries
        else {
            hideAll('.boundary-' + id)
        }

        // Update the page
        wvOptions[side] = val
        updateBoxes()
        toggleBoundaryToggle()
    }

    // When the boundary toggle box is checked/unchecked
    function onBoundaryToggle(evt: Event) {
        // Annoying that I can't get something so basic to be typed correctly
        const target = evt.target as HTMLInputElement | null

        if (showBoundsCheck?.checked) {
            // Fire the change event so onBoundaryChange() will apply any values
            query('input[type="number"]').forEach(function (elem) {
                trigger(elem, 'change')
            })

            toggleBoundaryToggle()
        } else {
            hideAll('.boundary, .boundary-' + (target?.id ?? ''))
        }
    }

    // When shift + arrow key is pressed, nudge the page by 1px
    function onNudge(evt: KeyboardEvent) {
        // Annoying that I can't get something so basic to be typed correctly
        const target = evt.target as HTMLInputElement | null

        // Ignore input fields
        if (target?.nodeName === 'INPUT') {
            return true
        }

        if (evt.shiftKey && 37 <= evt.keyCode && evt.keyCode <= 40) {
            const key = 'key' + evt.keyCode
            const scrollVals: Record<string, [number, number]> = {
                key38: [0, -1],
                key37: [-1, 0],
                key39: [1, 0],
                key40: [0, 1],
            }

            window.scrollBy(scrollVals[key][0], scrollVals[key][1])

            evt.preventDefault()
        }
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
            // @ts-ignore
            showBoundsCheck.parentNode.style.display = 'block'
        } else {
            // @ts-ignore
            showBoundsCheck.parentNode.style.display = 'none'
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
                    elem.style.marginTop = '-' + distStr
                })
                break
            }

            case 'right': {
                query('.boundary-right').forEach((elem) => {
                    elem.style.right = distStr
                    elem.style.width = distStr
                    elem.style.marginRight = '-' + distStr
                })
                break
            }

            case 'bottom': {
                query('.boundary-bottom').forEach((elem) => {
                    elem.style.bottom = distStr
                    elem.style.height = distStr
                    elem.style.marginBottom = '-' + distStr
                })
                break
            }

            case 'left': {
                query('.boundary-left').forEach((elem) => {
                    elem.style.left = distStr
                    elem.style.width = distStr
                    elem.style.marginLeft = '-' + distStr
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
            if (await withinviewport(box, wvOptions)) {
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

    window.addEventListener('DOMContentLoaded', init)
})()
