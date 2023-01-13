// ScrollStart/ScrollStop events: http://james.padolsey.com/javascript/special-scroll-events-for-jquery/
;(function () {
    var e = jQuery.event.special,
        t = 'D' + +new Date(),
        n = 'D' + (+new Date() + 1)
    e.scrollstart = {
        setup: function () {
            var n,
                r = function (t) {
                    var r = this,
                        i = arguments
                    if (n) {
                        clearTimeout(n)
                    } else {
                        t.type = 'scrollstart'
                        jQuery.event.handle.apply(r, i)
                    }
                    n = setTimeout(function () {
                        n = null
                    }, e.scrollstop.latency)
                }
            jQuery(this).bind('scroll', r).data(t, r)
        },
        teardown: function () {
            jQuery(this).unbind('scroll', jQuery(this).data(t))
        },
    }
    e.scrollstop = {
        latency: 300,
        setup: function () {
            var t,
                r = function (n) {
                    var r = this,
                        i = arguments
                    if (t) {
                        clearTimeout(t)
                    }
                    t = setTimeout(function () {
                        t = null
                        n.type = 'scrollstop'
                        jQuery.event.dispatch.apply(r, i)
                    }, e.scrollstop.latency)
                }
            jQuery(this).bind('scroll', r).data(n, r)
        },
        teardown: function () {
            jQuery(this).unbind('scroll', jQuery(this).data(n))
        },
    }
})()
