/**
 * Within Viewport
 *
 * @description Determines whether an element is completely within the browser viewport
 * @author      Craig Patik, http://patik.com/
 * @version     0.1.0
 * @date        2015-04-10
 */
(function (root, name, factory) {
    // AMD
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    }
    // Node and CommonJS-like environments
    else if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = factory();
    }
    // Browser global
    else {
        root[name] = factory();

        // Legacy support for camelCase naming
        // DEPRECATED: will be removed in v1.0
        root.withinViewport = function (a, b) {
            try { console.warn('DEPRECATED: use lowercase `withinviewport()` instead'); } catch(e) { }
            return withinviewport(a, b);
        };
        root.withinViewport.defaults = factory().defaults;
    }
}(this, 'withinviewport', function () {

    /**
     * Determines whether an element is within the viewport
     * @param  {Object}  elem       DOM Element (required)
     * @param  {Object}  options    Optional settings
     * @return {Boolean}            Whether the element was completely within the viewport
    */
    var withinviewport = function withinviewport(elem, options) {
        var result = false;
        var metadata = {};
        var config = {};
        var settings;
        var useHtmlElem;
        var isWithin;
        var scrollOffset;
        var elemOffset;
        var arr;
        var side;
        var i;

        // If invoked by the jQuery plugin, get the actual DOM element
        if (typeof jQuery !== 'undefined' && elem instanceof jQuery) {
            elem = elem.get(0);
        }

        if (typeof elem !== 'object' || elem.nodeType !== 1) {
            throw new Error('First argument must be an element');
        }

        // Look for inline settings on the element
        if (elem.getAttribute('data-withinviewport-settings') && window.JSON) {
            metadata = JSON.parse(elem.getAttribute('data-withinviewport-settings'));
        }

        // Settings argument may be a simple string (`top`, `right`, etc)
        if (typeof options === 'string') {
            settings = {sides: options};
        }
        else {
            settings = options || {};
        }

        // Build configuration from defaults and given settings
        config.container = settings.container || metadata.container || withinviewport.defaults.container || document.body;
        config.sides = settings.sides || metadata.sides || withinviewport.defaults.sides || 'all';
        config.top = settings.top || metadata.top || withinviewport.defaults.top || 0;
        config.right = settings.right || metadata.right || withinviewport.defaults.right || 0;
        config.bottom = settings.bottom || metadata.bottom || withinviewport.defaults.bottom || 0;
        config.left = settings.left || metadata.left || withinviewport.defaults.left || 0;

        // Whether we can use the `<html`> element for `scrollTop`
        // Unfortunately at the moment I can't find a way to do this without UA-sniffing
        useHtmlElem = !/Chrome/.test(navigator.userAgent);

        // Element testing methods
        isWithin = {
            // Element is below the top edge of the viewport
            top: function _isWithin_top() {
                return elemOffset[1] >= scrollOffset[1] + config.top;
            },

            // Element is to the left of the right edge of the viewport
            right: function _isWithin_right() {
                var container = (config.container === document.body) ? window : config.container;

                return elemOffset[0] + elem.offsetWidth <= container.innerWidth + scrollOffset[0] - config.right;
            },

            // Element is above the bottom edge of the viewport
            bottom: function _isWithin_bottom() {
                var container = (config.container === document.body) ? window : config.container;

                return elemOffset[1] + elem.offsetHeight <= scrollOffset[1] + container.innerHeight - config.bottom;
            },

            // Element is to the right of the left edge of the viewport
            left: function _isWithin_left() {
                return elemOffset[0] >= scrollOffset[0] + config.left;
            },

            all: function _isWithin_all() {
                return (isWithin.top() && isWithin.right() && isWithin.bottom() && isWithin.left());
            }
        };

        // Current offset values
        scrollOffset = (function _scrollOffset() {
            var x = config.container.scrollLeft;
            var y = config.container.scrollTop;

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
        }());

        elemOffset = (function _elemOffset() {
            var el = elem;
            var x = 0;
            var y = 0;

            if (el.parentNode) {
                x = el.offsetLeft;
                y = el.offsetTop;

                el = el.parentNode;
                while (el) {
                    if (el === config.container) {
                        break;
                    }

                    x += el.offsetLeft;
                    y += el.offsetTop;

                    el = el.parentNode;
                }
            }

            return [x, y];
        })();

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
    withinviewport.prototype.defaults = {
        container: document.body,
        sides: 'all',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };

    withinviewport.defaults = withinviewport.prototype.defaults;

    /**
     * Optional enhancements and shortcuts
     *
     * @description Uncomment or comment these pieces as they apply to your project and coding preferences
     */

    // Shortcut methods for each side of the viewport
    // Example: `withinviewport.top(elem)` is the same as `withinviewport(elem, 'top')`
    withinviewport.prototype.top = function _withinviewport_top(element) {
        return withinviewport(element, 'top');
    };

    withinviewport.prototype.right = function _withinviewport_right(element) {
        return withinviewport(element, 'right');
    };

    withinviewport.prototype.bottom = function _withinviewport_bottom(element) {
        return withinviewport(element, 'bottom');
    };

    withinviewport.prototype.left = function _withinviewport_left(element) {
        return withinviewport(element, 'left');
    };

    return withinviewport;
}));
