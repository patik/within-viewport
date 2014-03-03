/**
 * Within Viewport
 *
 * @description Determines whether an element is completely
 *              within the browser viewport
 * @author      Craig Patik, http://patik.com/
 * @version     0.0.3
 * @date        2014-03-03
 */
;(function() {
    /**
     * withinViewport
     * @param  {Object} [elem]      DOM Element, required
     * @param  {Object} [settings]  optional settings
     * @return {Boolean}            whether elem was completely within the viewport
    */
    var withinViewport = function(elem, settings) {
        if (typeof elem !== 'object' || elem.nodeType !== 1) {
            throw new Error('First argument must be an element');
        }

        var metadata = (elem.getAttribute('data-withinviewport-settings') && window.JSON)
                                     ? JSON.parse(elem.getAttribute('data-withinviewport-settings'))
                                     : {},

            // Settings argument may be a simple string (`top`, `right`, etc)
            settings = typeof settings === 'string' ? {sides: settings} : settings || {},

            // Build configuration from defaults and given settings
            config = {
                container: settings.container || metadata.container || withinViewport.defaults.container || document.body,
                sides: settings.sides || metadata.sides || withinViewport.defaults.sides || 'all',
                top: settings.top || metadata.top || withinViewport.defaults.top || 0,
                right: settings.right || metadata.right || withinViewport.defaults.right || 0,
                bottom: settings.bottom || metadata.bottom || withinViewport.defaults.bottom || 0,
                left: settings.left || metadata.left || withinViewport.defaults.left || 0
            },

            // Whether we can use the `<html`> element for `scrollTop`
            // Unfortunately at the moment I can't find a way to do this without UA-sniffing
            useHtmlElem = !/Chrome/.test(navigator.userAgent),

            // Element testing methods
            isWithin = {
                // Element is below the top edge of the viewport
                top: function() {
                    return elemOffset[1] >= scrollOffset[1] + config.top;
                },

                // Element is to the left of the right edge of the viewport
                right: function() {
                    var container = (config.container === document.body) ? window : config.container;

                    return elemOffset[0] + elem.offsetWidth <= container.innerWidth + scrollOffset[0] - config.right;
                },

                // Element is above the bottom edge of the viewport
                bottom: function() {
                    var container = (config.container === document.body) ? window : config.container;

                    return elemOffset[1] + elem.offsetHeight <= scrollOffset[1] + container.innerHeight - config.bottom;
                },

                // Element is to the right of the left edge of the viewport
                left: function() {
                    return elemOffset[0] >= scrollOffset[0] + config.left;
                },

                all: function() {
                    return (isWithin.top() && isWithin.right() && isWithin.bottom() && isWithin.left());
                }
            },

            // Current offset values
            scrollOffset = (function() {
                var x = config.container.scrollLeft,
                    y = config.container.scrollTop;

                if (y === 0) {
                    if (config.container.pageYOffset) {
                        y = config.container.pageYOffset;
                    }
                    else if (window.pageYOffset) {
                        y = window.pageYOffset;
                    }
                    else {
                        if (config.container === document.body) {
                            if (useHtmlElem) {
                                y = (config.container.parentElement) ? config.container.parentElement.scrollTop : 0;
                            }
                            else {
                                y = (config.container.parentElement) ? config.container.parentElement.scrollTop : 0;
                            }
                        }
                        else {
                            y = (config.container.parentElement) ? config.container.parentElement.scrollTop : 0;
                        }
                    }
                }

                if (x === 0) {
                    if (config.container.pageXOffset) {
                        x = config.container.pageXOffset;
                    }
                    else if (window.pageXOffset) {
                        x = window.pageXOffset;
                    }
                    else {
                        if (config.container === document.body) {
                            x = (config.container.parentElement) ? config.container.parentElement.scrollLeft : 0;
                        }
                        else {
                            x = (config.container.parentElement) ? config.container.parentElement.scrollLeft : 0;
                        }
                    }
                }

                return [x, y];
            }()),

            elemOffset = (function() {
                var el = elem,
                    x = 0,
                    y = 0;

                if (el.parentNode) { // offsetParent
                    x = el.offsetLeft;
                    y = el.offsetTop;

                    while (el = el.parentNode) { // offsetParent
                        if (el == config.container) {
                            break;
                        }

                        x += el.offsetLeft;
                        y += el.offsetTop;
                    }
                }

                return [x, y];
            })(),

            // Return value
            result = false,

            // Temporary variables for looping
            arr, i, side;

        // Test the element against each side of the viewport that was requested
        arr = config.sides.split(' ');
        i = arr.length;
        while (i--) {
            side = arr[i].toLowerCase();
            if (/top|right|bottom|left|all/.test(side)) {
                if (isWithin[side]()) {
                    result = true;
                }
                else {
                    result = false;
                    // Quit as soon as the first failure is found
                    break;
                }
            }
        }

        return result;
    };

    // Default settings
    withinViewport.prototype.defaults = {
        container: document.body,
        sides: 'all',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };

    withinViewport.defaults = withinViewport.prototype.defaults;

    // Make function available globally
    window.withinViewport = withinViewport;

    /**
     * Optional enhancements and shortcuts
     *
     * @description Uncomment or comment these pieces as they apply to your project and coding preferences
     */

    // Shortcut methods for each side of the viewport
    // Ex: withinViewport.top(elem) is the same as withinViewport(elem, 'top')
    arr = 'top,right,bottom,left'.split(',');
    i = arr.length;
    while(i--) {
        side = arr[i];
        withinViewport.prototype[side] = function(element) {
            return withinViewport(element, side);
        };
        withinViewport[side] = withinViewport.prototype[side];
    }

})();