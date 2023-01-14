import { ChangeEvent } from 'react'
// import { withinviewport } from '../../package/dist'

type Side = 'top' | 'right' | 'bottom' | 'left'

// Demo code
export default (function ($) {
    let $boxes: JQuery | null = null
    let $showBoundsCheck: JQuery | null = null
    let container: HTMLElement | null = null

    const _init = function _init() {
        const $container = $('#container')
        const boxCount = 100
        let boxWidth = 20
        let boxHTML = ''
        let i

        container = $container.get(0) ?? null

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
            boxHTML += '<div aria-hidden="false">&nbsp;</div>'
            i++
        }

        // Add a container and put the boxes inside
        $container.append('<div id="boxContainer" style="width:' + (boxWidth * 10 + 20) + 'px;">' + boxHTML + '</div>')

        // Set the styles so everything is nice and proportional to this device's screen
        $container.append(
            '<style>#boxContainer div { width:' +
                boxWidth +
                'px;height:' +
                boxWidth +
                'px;line-height:' +
                boxWidth +
                'px; }</style>',
        )
        $boxes = $('#boxContainer div')
        // Mark a couple of boxes for testing and debugging
        const fourth = $boxes.get(4)
        if (fourth) {
            fourth.id = 'test'
        }

        const twentyFifth = $boxes.get(25)

        if (twentyFifth) {
            twentyFifth.id = 'test2'
        }

        $showBoundsCheck = $('#show-boundary')

        events.init()

        // Update the <div>s for the first time
        _updateBoxes()
    }

    ////////////
    // Events //
    ////////////

    const events = {
        // Setup event listeners
        init: function () {
            // Scroll
            if (container) {
                $(container).on('scrollstop', _updateBoxes)
            }

            // User entry
            // @ts-ignore
            $('input[type="number"]').on('keyup change click', events.onBoundaryChange) // 'click' is for spinners on input[number] control
            // Boundary toggle
            if ($showBoundsCheck) {
                $showBoundsCheck.on('change', events.onBoundaryToggle)
            }

            // Nudge controls
            // Only certain combinations of browsers/OSes allow capturing arrow key strokes, unfortunately
            // Windows: Firefox, Trident, Safari, Opera; Mac: Chrome, Safari, Opera; Not Firefox
            if (
                ('oscpu' in navigator &&
                    navigator.oscpu &&
                    /Windows/.test(String(navigator.oscpu)) &&
                    /Firefox|Trident|Safari|Presto/.test(navigator.userAgent)) ||
                (/Macintosh/.test(navigator.userAgent) && /Chrome|Safari|Presto/.test(navigator.userAgent))
            ) {
                $('#thresholds p').show()
                // @ts-ignore
                $('body').on('keydown', events.onNudge)
            }

            // Controls toggler
            $('#toggler').on('click', events.onControlsToggle)
        },

        // When a boundary value changes
        onBoundaryChange(evt: ChangeEvent | MouseEvent | KeyboardEvent) {
            const target = evt.target
            const val = target && 'value' in target ? parseInt(String(target?.value ?? ''), 10) : 0
            // @ts-ignore
            const id = target?.id

            // Positive value was entered (negative values are allowed, but the boundaries would be off screen)
            if (val > 0) {
                if ($showBoundsCheck?.is(':checked')) {
                    $('.boundary-' + id).show()
                    _drawBound(id, val)
                } else {
                    $('.boundary-' + id).hide()
                }
            }
            // Hide boundaries
            else {
                $('.boundary-' + id).hide()
            }

            // Update the page
            // @ts-ignore
            withinviewport.defaults[id] = val
            _updateBoxes()
            _toggleBoundaryToggle()
        },

        // When the boundary toggle box is checked/unchecked
        onBoundaryToggle() {
            if ($showBoundsCheck?.is(':checked')) {
                // Fire the change event so events.onBoundaryChange() will apply any values
                $('input[type="number"]').change()
                _toggleBoundaryToggle()
            } else {
                $('.boundary').hide()
                // @ts-ignore
                $('.boundary-' + this.id).hide()
            }
        },

        // When shift + arrow key is pressed, nudge the page by 1px
        onNudge(evt: KeyboardEvent) {
            // Ignore input fields
            if (evt.target && $(evt.target).is('input')) {
                return true
            }

            if (evt.shiftKey && 37 <= evt.keyCode && evt.keyCode <= 40) {
                var key = 'key' + evt.keyCode
                var scrollVals: Record<string, [number, number]> = {
                    key38: [0, -1],
                    key37: [-1, 0],
                    key39: [1, 0],
                    key40: [0, 1],
                }

                window.scrollBy(scrollVals[key][0], scrollVals[key][1])
                evt.preventDefault()
            }
        },

        onControlsToggle(/* evt */) {
            var $toggler = $('#toggler')

            $('#explanation').toggleClass('collapsed')

            $toggler.toggleClass('plus minus')

            if ($toggler.html() === 'Collapse') {
                $toggler.html('Expand')
            } else {
                $toggler.html('Collapse')
            }
        },
    }

    /////////
    // GUI //
    /////////

    // Display or hide the "show boundaries" check box if any values are set (non-zero)
    const _toggleBoundaryToggle = function _toggleBoundaryToggle() {
        let somethingEntered = false

        $('input[type="number"]').each(function () {
            if (parseInt(this.getAttribute('value') ?? '', 10) !== 0) {
                somethingEntered = true
            }
        })

        if (somethingEntered) {
            $showBoundsCheck?.parent().slideDown()
        } else {
            $showBoundsCheck?.parent().slideUp()
        }
    }

    // Overlay a boundary line on the viewport when one is set by the user
    const _drawBound = function _drawBound(side: Side, dist: number) {
        const distStr = `${dist}px`

        switch (side) {
            case 'top': {
                $('.boundary-top').css({
                    top: distStr,
                    height: distStr,
                    marginTop: '-' + distStr,
                })
                break
            }

            case 'right': {
                $('.boundary-right').css({
                    right: distStr,
                    width: distStr,
                    marginRight: '-' + distStr,
                })
                break
            }

            case 'bottom': {
                $('.boundary-bottom').css({
                    bottom: distStr,
                    height: distStr,
                    marginBottom: '-' + distStr,
                })
                break
            }

            case 'left': {
                $('.boundary-left').css({
                    left: distStr,
                    width: distStr,
                    marginLeft: '-' + distStr,
                })
                break
            }

            default:
                break
        }
    }

    // Update each box's class to reflect whether it was determined to be within the viewport or not
    // Uses the jQuery plugin
    const _updateBoxes = function _updateBoxes() {
        // Reset all boxes to being considered out of view
        $boxes?.html('out').attr('aria-hidden', 'true').removeClass('inview')

        // Then run withinviewport() on them to reveal which ones are inside
        $boxes
            // @ts-ignore
            ?.withinviewport({
                container: container,
            })
            .html('in')
            .attr('aria-hidden', 'false')
            .addClass('inview')
    }

    $(document).ready(_init)
})(jQuery)
