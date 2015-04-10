/**
 * Within Viewport jQuery Plugin
 *
 * @description Companion plugin for withinviewport.js
 * @author      Craig Patik, http://patik.com/
 * @version     0.1.0
 * @date        2015-04-10
 */

(function($) {
    /**
     * $.withinviewport()
     * @description          jQuery method
     * @param  {Object}      [settings] optional settings
     * @return {Collection}  Contains all elements that were within the viewport
    */
    $.fn.withinviewport = function(settings) {
        if (typeof settings === "string") { settings = {sides: settings}; }

        var opts = $.extend({}, settings, {sides: "all"}), elems = [];

        this.each(function() {
            if (withinviewport(this, opts)) {
              elems.push(this);
            }
        });

        return $(elems);
    };

    // Main custom selector
    $.extend($.expr[":"], {
        "within-viewport": function(element) {
            return withinviewport(element, "all");
        }
    });

    /**
     * Optional enhancements and shortcuts
     *
     * @description Uncomment or comment these pieces as they apply to your project and coding preferences
     */

    // Shorthand jQuery methods
    //
    $.fn.withinviewportTop = function(settings) {
        var opts;

        if (typeof settings === "string") { settings = {sides: settings}; }

        opts = $.extend({}, settings, {sides: "top"}), elems = [];

        this.each(function() {
            if (withinviewport(this, opts)) {
                elems.push(this);
            }
        });

        return $(elems);
    };

    $.fn.withinviewportRight = function(settings) {
        var opts;

        if (typeof settings === "string") { settings = {sides: settings}; }

        opts = $.extend({}, settings, {sides: "right"}), elems = [];

        this.each(function() {
            if (withinviewport(this, opts)) {
              elems.push(this);
            }
        });

        return $(elems);
    };

    $.fn.withinviewportBottom = function(settings) {
        var opts;

        if (typeof settings === "string") { settings = {sides: settings}; }

        opts = $.extend({}, settings, {sides: "bottom"}), elems = [];

        this.each(function() {
            if (withinviewport(this, opts)) {
                elems.push(this);
            }
        });

        return $(elems);
    };

    $.fn.withinviewportLeft = function(settings) {
        var opts;

        if (typeof settings === "string") { settings = {sides: settings}; }

        opts = $.extend({}, settings, {sides: "left"}), elems = [];

        this.each(function() {
            if (withinviewport(this, opts)) {
                elems.push(this);
            }
        });

        return $(elems);
    };

    // Custom jQuery selectors
    $.extend($.expr[":"], {
        "within-viewport-top": function(element) {
            return withinviewport(element, "top");
        },
        "within-viewport-right": function(element) {
            return withinviewport(element, "right");
        },
        "within-viewport-bottom": function(element) {
            return withinviewport(element, "bottom");
        },
        "within-viewport-left": function(element) {
            return withinviewport(element, "left");
        }
        // Example custom selector:
        //,
        // "within-viewport-top-left-45": function(element) {
        //     return withinviewport(element, {sides:'top left', top: 45, left: 45});
        // }
    });
}(jQuery));
