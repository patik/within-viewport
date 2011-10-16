var withinView, withinViewSettings;

;(function($) {
  var withinViewport = function(element, settings) {
    settings = settings || withinViewSettings;
    
    // Make sure all settings have a numeric value
    "top,right,bottom,left".split(",")
      .forEach(function (pos) {
        if (isNaN(this[pos])) {
          this[pos] = 0;
        }
      }, settings);
   	
		// Element is below the top edge of the viewport
    this.top = function(element, settings) {
      settings = settings || this.settings;
      return $(element).offset().top 
			    >= $(window).scrollTop() + settings.top;
    };
    
		// Element is to the left of the right edge of the viewport
    this.right = function(element, settings) {
      settings = settings || this.settings;
      return $(element).offset().left + $(element).outerWidth()
			    <= $(window).width() + $(window).scrollLeft() - settings.right;
    };
    
		// Element is above the bottom edge of the viewport
    this.bottom = function(element, settings) {
      settings = settings || this.settings;
			if (element.id == 'test') {
				console.log($(element).offset().top + ' >= ' + ($(window).scrollTop() + settings.bottom));
			}
      return $(element).offset().top + $(element).outerHeight()
			    <= $(window).scrollTop() + $(window).height() - settings.bottom;
    };
    
		// Element is to the right of the left edge of the viewport
    this.left = function(element, settings) {
      settings = settings || this.settings;
      return $(element).offset().left 
			    >= $(window).scrollLeft() + settings.left;
    };
  };
	
	// Create instance and default settings object
  withinView = new withinViewport();
  withinViewSettings = {top: 0, right: 0, bottom: 0, left: 0, events: false};
  
  // jQuery plugin
  $.withinViewportTop = function(element, settings) {
    return withinView.top(element, settings);
  };
  $.withinViewportRight = function(element, settings) {
    return withinView.right(element, settings);
  };
  $.withinViewportBottom = function(element, settings) {
    return withinView.bottom(element, settings);
  };
  $.withinViewportLeft = function(element, settings) {
    return withinView.left(element, settings);
  };
  $.withinViewport = function(element, settings) {
    return withinView.top(element, settings) && withinView.left(element, settings) 
        && withinView.bottom(element, settings) && withinView.right(element, settings);
  };
  
  $.extend($.expr[":"], {
		"within-viewport-top": function(element, index, meta) {
			return $.withinViewportTop(element, withinViewSettings);
		},
		"within-viewport-right": function(element, index, meta) {
			return $.withinViewportRight(element, withinViewSettings);
		},
		"within-viewport-bottom": function(element, index, meta) {
			return $.withinViewportBottom(element, withinViewSettings);
		},
		"within-viewport-left": function(element, index, meta) {
			return $.withinViewportLeft(element, withinViewSettings);
		},
		"within-viewport": function(element, index, meta) {
			return $.withinViewport(element, withinViewSettings);
		}
  });
})(jQuery);