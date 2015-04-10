// Demo code
var wvdemo = (function ($) {
    var $boxes = null;
    var showBoundsCheck = null;

    function init() {
        var boxCount = 100;
        var boxWidth = 20;
        var boxHTML = '';
        var boxContainer;
        var elem;
        var i;

        // Make sure the demo will be wider than the device's screen so that vertical scroll bars appear
        //    but not so wide that you can't see at least four on screen at a time with a maximized browser window
        if (screen.width >= screen.height) {
            // Screen is wide/landscape
            boxWidth = parseInt((screen.width + 400) / 10, 10);
        }
        else {
            boxWidth = parseInt((screen.height + 400) / 10, 10);
        }

        // Generate boxes which will each be tested for their viewport within-ness
        i = 0;
        while (i < boxCount) {
            // Set the styles so everything is nice and proportional to this device's screen
            boxHTML += '<div aria-hidden="false" style="width:' + boxWidth + 'px;height:' + boxWidth + 'px;line-height:' + boxWidth + 'px;">&nbsp;</div>';
            i++;
        }

        // Add a container and put the boxes inside
        boxContainer = document.createElement('div');
        boxContainer.id = 'boxContainer';
        boxContainer.style.cssText = 'width:' + (boxWidth * 10 + 20) + 'px;';
        boxContainer.innerHTML = boxHTML;
        document.body.appendChild(boxContainer);

        $boxes = query('div', boxContainer);
        $boxes[4].id = 'test';

        showBoundsCheck = document.getElementById('show-boundary');
        eventsInit();

        // Update the <div>s for the first time
        updateBoxes();
    }

    // Query function
    function query(selector, node) {
        if (typeof node === 'undefined') {
            node = document;
        }

        return [].slice.call(node.querySelectorAll(selector));
    }

    function show(selector) {
        query(selector).forEach(function (elem) {
            elem.style.display = 'block';
        });
    }

    function hide(selector) {
        query(selector).forEach(function (elem) {
            elem.style.display = 'none';
        });
    }

    function trigger(node, eventName) {
        var evt;

        if (document.createEvent) {
            evt = document.createEvent('HTMLEvents');
            evt.initEvent(eventName, true, true);
            evt.eventName = eventName;
            node.dispatchEvent(evt);
        }
        else {
            evt = document.createEventObject();
            evt.eventType = eventName;
            evt.eventName = eventName;
            node.fireEvent('on' + evt.eventType, evt);
        }
    }

    ////////////
    // Events //
    ////////////

    // Setup event listeners
    function eventsInit() {
        // Scroll or window resize
        window.addEventListener('resize', updateBoxes);
        window.addEventListener('scroll', updateBoxes);

        // User entry
        query('input[type="number"]').forEach(function (elem) {
            elem.addEventListener('keyup', onBoundaryChange);
            elem.addEventListener('change', onBoundaryChange);
            elem.addEventListener('click', onBoundaryChange); // 'click' is for spinners on input[number] control
        });

        // Boundary toggle
        showBoundsCheck.addEventListener('change', onBoundaryToggle);

        // Nudge controls
        // Only certain combinations of browsers/OSes allow capturing arrow key strokes, unfortunately
        // Windows: Firefox, Trident, Safari, Opera; Mac: Chrome, Safari, Opera; Not Firefox
        if ((navigator.oscpu && /Windows/.test(navigator.oscpu) && /Firefox|Trident|Safari|Presto/.test(navigator.userAgent)) || (/Macintosh/.test(navigator.userAgent) && /Chrome|Safari|Presto/.test(navigator.userAgent))) {
            show('#thresholds p');
            document.body.addEventListener('keydown', onNudge);
        }

        // Controls toggler
        document.getElementById('toggler').addEventListener('click', onControlsToggle);
    }

    // When a boundary value changes
    function onBoundaryChange(evt) {
        var val = parseInt(evt.target.value, 10);
        var id = evt.target.id;

        // Positive value was entered (negative values are allowed, but the boundaries would be off screen)
        if (val > 0) {
            if (showBoundsCheck.checked) {
                show('.boundary-' + id);

                drawBound(id, val);
            }
            else {
                hide('.boundary-' + id);
            }
        }
        // Hide boundaries
        else {
            hide('.boundary-' + id);
        }

        // Update the page
        withinviewport.defaults[id] = val;
        updateBoxes();
        toggleBoundaryToggle();
    }

    // When the boundary toggle box is checked/unchecked
    function onBoundaryToggle(evt) {
        if (showBoundsCheck.checked) {
            // Fire the change event so onBoundaryChange() will apply any values
            query('input[type="number"]').forEach(function (elem) {
                trigger(elem, 'change');
            });

            toggleBoundaryToggle();
        }
        else {
            hide('.boundary, .boundary-' + evt.target.id);
        }
    }

    // When shift + arrow key is pressed, nudge the page by 1px
    function onNudge(evt) {
        // Ignore input fields
        if (evt.target.nodeName === 'INPUT') {
            return true;
        }

        if (evt.shiftKey && 37 <= evt.keyCode && evt.keyCode <= 40) {
            var key = "key" + evt.keyCode,
                scrollVals = {
                    key38: [0, -1],
                    key37: [-1, 0],
                    key39: [1, 0],
                    key40: [0, 1]
                };

            window.scrollBy(scrollVals[key][0], scrollVals[key][1]);

            evt.preventDefault();
        }
    }

    function onControlsToggle() {
        var toggler = document.getElementById('toggler');

        document.getElementById('explanation').classList.toggle('collapsed');
        toggler.classList.toggle('plus');
        toggler.classList.toggle('minus');

        if (toggler.innerHTML === 'Collapse') {
            toggler.innerHTML = 'Expand';
        }
        else {
            toggler.innerHTML = 'Collapse';
        }
    }

    // Display or hide the "show boundaries" check box if any values are set (non-zero)
    function toggleBoundaryToggle() {
        var somethingEntered = false;

        query('input[type="number"]').forEach(function (elem) {
            if (parseInt(elem.value, 10) !== 0) {
                somethingEntered = true;
            }
        });

        if (somethingEntered) {
            showBoundsCheck.parentNode.style.display = 'block';
        }
        else {
            showBoundsCheck.parentNode.style.display = 'none';
        }
    }

    // Overlay a boundary line on the viewport when one is set by the user
    function drawBound(side, dist) {
        dist += 'px';

        switch (side) {
            case 'top':
                query('.boundary-top').forEach(function (elem) {
                    elem.style.top = dist;
                    elem.style.height = dist;
                    elem.style.marginTop = '-' + dist;
                });
                break;

            case 'right':
                query('.boundary-right').forEach(function (elem) {
                    elem.style.right = dist;
                    elem.style.width = dist;
                    elem.style.marginRight = '-' + dist;
                });
                break;

            case 'bottom':
                query('.boundary-bottom').forEach(function (elem) {
                    elem.style.bottom = dist;
                    elem.style.height = dist;
                    elem.style.marginBottom = '-' + dist;
                });
                break;

            case 'left':
                query('.boundary-left').forEach(function (elem) {
                    elem.style.left = dist;
                    elem.style.width = dist;
                    elem.style.marginLeft = '-' + dist;
                });
                break;

            default:
                break;
        }
    }

    // Update each box's class to reflect whether it was determined to be within the viewport or not
    function updateBoxes() {
        $boxes.forEach(function (box) {
            if (withinviewport(box)) {
                box.innerHTML = 'in';
                box.setAttribute('aria-hidden', 'false');
                box.classList.add('inview');
            }
            else {
                box.innerHTML = 'out';
                box.setAttribute('aria-hidden', 'true');
                box.classList.remove('inview');
            }
        });
    }

    window.addEventListener('DOMContentLoaded', init);
})();
