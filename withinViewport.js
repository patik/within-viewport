/**
 * Within Viewport
 *
 * @description Determines whether an element is completely
 *              within the browser viewport
 * @author      Craig Patik, http://patik.com/
 * @version     0.2
 * @date        2011-11-05
 */

;(function(d) {

  /**
   * withinViewport
   * @param {Object} [elem]      DOM Element, required
   * @param {Object} [settings]  optional settings
   * @return {Boolean}           whether elem was completely within the viewport
  */
  var withinViewport = function(elem, settings)
  {
    var result = false;
    try {
      if (typeof elem !== "object" || elem.nodeType !== 1) {
        throw new Error("First argument should be a DOM element");
      }
      var arr, i, side, // Temporary variables for looping
          metadata = elem.getAttribute("data-withinviewport-settings") && window.JSON
                     ? JSON.parse(elem.getAttribute("data-withinviewport-settings"))
                     : {},
          // settings argument may be a simple: string 'top', 'right', etc
          settings = typeof settings === "string" ? {sides: settings} : settings || {},
          // Build configuration from defaults and given settings
          config = {
            sides: settings.sides || metadata.sides || withinViewport.defaults.sides || "all",
            top: settings.top || metadata.top || withinViewport.defaults.top || 0,
            right: settings.right || metadata.right || withinViewport.defaults.right || 0,
            bottom: settings.bottom || metadata.bottom || withinViewport.defaults.bottom || 0,
            left: settings.left || metadata.left || withinViewport.defaults.left || 0
          },
          // Element testing methods
          isWithin = {
            // Element is below the top edge of the viewport
            top: function() {
              return elemOffset[1]
                  >= scrollOffset[1] + config.top;
            },

            // Element is to the left of the right edge of the viewport
            right: function() {
              var width = window.innerWidth || document.documentElement.clientWidth;
              return elemOffset[0] + elem.offsetWidth
                  <= width + scrollOffset[0] - config.right;
            },

            // Element is above the bottom edge of the viewport
            bottom: function() {
              var height = window.innerHeight || document.documentElement.clientHeight;
              return elemOffset[1] + elem.offsetHeight
                  <= height + scrollOffset[1] - config.bottom;
            },

            // Element is to the right of the left edge of the viewport
            left: function() {
              return elemOffset[0]
                  >= scrollOffset[0] + config.left;
            },

            all: function() {
              return (isWithin.top() && isWithin.right() && isWithin.bottom() && isWithin.left());
            }
          },

          // Current offset values
          scrollOffset = (function() {
            var x = d.body.scrollLeft,
                y = d.body.scrollTop;
            if (y == 0) {
              if (window.pageYOffset) {
                y = window.pageYOffset;
              }
              else {
                y = (d.body.parentElement) ? d.body.parentElement.scrollTop : 0;
              }
            }
            if (x == 0) {
              if (window.pageXOffset) {
                x = window.pageXOffset;
              }
              else {
                x = (d.body.parentElement) ? d.body.parentElement.scrollLeft : 0;
              }
            }
            return [x, y];
          })(),

          elemOffset = (function() {
            var el = elem,
                x = 0,
                y = 0;
            if (el.offsetParent) {
              x = el.offsetLeft;
              y = el.offsetTop;
              while (el = el.offsetParent) {
                x += el.offsetLeft;
                y += el.offsetTop;
              }
            }
            return [x, y];
          })();

      // Test element against each side of the viewport that was requested
      arr = config.sides.split(" ");
      i = arr.length;
      while (i--) {
        side = arr[i].toLowerCase();
        if (/top|right|bottom|left|all/.test(side)) {
          if (isWithin[side]()) {
            result = true;
          }
          else {
            // Quit as soon as we find the first failure
            return false;
          }
        }
      }

      return result;
    }
    catch(e) { }
    finally {
      return result;
    }
  };

  // Default settings
  withinViewport.prototype.defaults = {
    sides: "all",
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
  // Ex: withinViewport.top(elem) is the same as withinViewport(elem, "top")
  //
  var arr = ['top', 'right', 'bottom', 'left'];
  var i = arr.length;
  while(i--) {
    var side = arr[i];
    withinViewport.prototype[side] = function(element) {
      return withinViewport(element, side);
    };
    withinViewport[side] = withinViewport.prototype[side];
  }

})(document);
