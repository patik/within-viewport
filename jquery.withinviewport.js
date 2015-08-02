/**
 * Within Viewport jQuery Plugin
 *
 * @description Companion plugin for withinviewport.js - determines whether an element is completely within the browser viewport
 * @author      Craig Patik, http://patik.com/
 * @version     1.0.0
 * @date        2015-08-02
 */
(function ($) {
    /**
     * $.withinviewport()
     * @description          jQuery method
     * @param  {Object}      [settings] optional settings
     * @return {Collection}  Contains all elements that were within the viewport
    */
    $.fn.withinviewport = function (settings) {
        var opts;
        var elems;

        if (typeof settings === 'string') { settings = {sides: settings}; }

        opts = $.extend({}, settings, {sides: 'all'});
        elems = [];

        this.each(function () {
            if (withinviewport(this, opts)) {
              elems.push(this);
            }
        });

        return $(elems);
    };

    // Main custom selector
    $.extend($.expr[':'], {
        'within-viewport': function (element) {
            return withinviewport(element, 'all');
        }
    });

    /**
     * Optional enhancements and shortcuts
     *
     * @description Uncomment or comment these pieces as they apply to your project and coding preferences
     */

    // Shorthand jQuery methods

    $.fn.withinviewporttop = function (settings) {
        var opts;
        var elems;

        if (typeof settings === 'string') { settings = {sides: settings}; }

        opts = $.extend({}, settings, {sides: 'top'});
        elems = [];

        this.each(function () {
            if (withinviewport(this, opts)) {
                elems.push(this);
            }
        });

        return $(elems);
    };

    $.fn.withinviewportright = function (settings) {
        var opts;
        var elems;

        if (typeof settings === 'string') { settings = {sides: settings}; }

        opts = $.extend({}, settings, {sides: 'right'});
        elems = [];

        this.each(function () {
            if (withinviewport(this, opts)) {
              elems.push(this);
            }
        });

        return $(elems);
    };

    $.fn.withinviewportbottom = function (settings) {
        var opts;
        var elems;

        if (typeof settings === 'string') { settings = {sides: settings}; }

        opts = $.extend({}, settings, {sides: 'bottom'});
        elems = [];

        this.each(function () {
            if (withinviewport(this, opts)) {
                elems.push(this);
            }
        });

        return $(elems);
    };

    $.fn.withinviewportleft = function (settings) {
        var opts;
        var elems;

        if (typeof settings === 'string') { settings = {sides: settings}; }

        opts = $.extend({}, settings, {sides: 'left'});
        elems = [];

        this.each(function () {
            if (withinviewport(this, opts)) {
                elems.push(this);
            }
        });

        return $(elems);
    };

    // Custom jQuery selectors
    $.extend($.expr[':'], {
        'within-viewport-top': function (element) {
            return withinviewport(element, 'top');
        },
        'within-viewport-right': function (element) {
            return withinviewport(element, 'right');
        },
        'within-viewport-bottom': function (element) {
            return withinviewport(element, 'bottom');
        },
        'within-viewport-left': function (element) {
            return withinviewport(element, 'left');
        }
        // Example custom selector:
        //,
        // 'within-viewport-top-left-45': function (element) {
        //     return withinviewport(element, {sides:'top left', top: 45, left: 45});
        // }
    });

    // Legacy support for camelCase naming
    // DEPRECATED: will be removed in v1.0
    $.fn.withinViewportTop = function (settings) {
        try { console.warn('DEPRECATED: use lowercase `withinviewporttop()` instead'); } catch (e) { }
        return $.fn.withinviewporttop(settings);
    };
    $.fn.withinViewportRight = function (settings) {
        try { console.warn('DEPRECATED: use lowercase `withinviewportright()` instead'); } catch (e) { }
        return $.fn.withinviewportright(settings);
    };
    $.fn.withinViewportBottom = function (settings) {
        try { console.warn('DEPRECATED: use lowercase `withinviewportbottom()` instead'); } catch (e) { }
        return $.fn.withinviewportbottom(settings);
    };
    $.fn.withinViewportLeft = function (settings) {
        try { console.warn('DEPRECATED: use lowercase `withinviewportleft()` instead'); } catch (e) { }
        return $.fn.withinviewportleft(settings);
    };
}(jQuery));
