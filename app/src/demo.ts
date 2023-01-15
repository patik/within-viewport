/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ChangeEvent } from 'react'
import { withinviewport } from '../../package/modern/src/index'

type Side = 'top' | 'right' | 'bottom' | 'left'

// Demo code
export default (function () {
    let $boxes: HTMLElement[] = []
    let showBoundsCheck: HTMLElement | null = null

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

        showBoundsCheck = document.getElementById('show-boundary')
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

    function show(selector: string) {
        query(selector).forEach(function (elem) {
            elem.style.display = 'block'
        })
    }

    function hide(selector: string) {
        query(selector).forEach(function (elem) {
            elem.style.display = 'none'
        })
    }

    function trigger(node: HTMLElement, eventName: string) {
        if (document.createEvent) {
            const evt = document.createEvent('HTMLEvents')
            evt.initEvent(eventName, true, true)
            // @ts-ignore
            evt.eventName = eventName
            node.dispatchEvent(evt)
        } else {
            // @ts-ignore
            const evt = document.createEventObject()
            evt.eventType = eventName
            evt.eventName = eventName
            // @ts-ignore
            node.fireEvent('on' + evt.eventType, evt)
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
            show('#thresholds p')
            document.body.addEventListener('keydown', onNudge)
        }

        // Controls toggler
        document.getElementById('toggler')?.addEventListener('click', onControlsToggle)
    }

    // When a boundary value changes
    function onBoundaryChange(evt: Event) {
        // @ts-ignore
        const val = parseInt(evt.target?.getAttribute('value') ?? '', 10)
        // @ts-ignore
        const id = evt.target?.id

        // Positive value was entered (negative values are allowed, but the boundaries would be off screen)
        if (val > 0) {
            // @ts-ignore
            if (showBoundsCheck?.checked) {
                show('.boundary-' + id)

                drawBound(id, val)
            } else {
                hide('.boundary-' + id)
            }
        }
        // Hide boundaries
        else {
            hide('.boundary-' + id)
        }

        // Update the page
        // @ts-ignore
        withinviewport.defaults[id] = val
        updateBoxes()
        toggleBoundaryToggle()
    }

    // When the boundary toggle box is checked/unchecked
    function onBoundaryToggle(evt: MouseEvent | ChangeEvent | KeyboardEvent) {
        // @ts-ignore
        if (showBoundsCheck?.checked) {
            // Fire the change event so onBoundaryChange() will apply any values
            query('input[type="number"]').forEach(function (elem) {
                trigger(elem, 'change')
            })

            toggleBoundaryToggle()
        } else {
            // @ts-ignore
            hide('.boundary, .boundary-' + (evt.target?.id ?? ''))
        }
    }

    // When shift + arrow key is pressed, nudge the page by 1px
    function onNudge(evt: KeyboardEvent) {
        // Ignore input fields
        // @ts-ignore
        if (evt.target?.nodeName === 'INPUT') {
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
        $boxes.forEach(function (box) {
            // @ts-ignore
            if (withinviewport(box)) {
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
