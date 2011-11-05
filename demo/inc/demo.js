// ScrollStart/ScrollStop events: http://james.padolsey.com/javascript/special-scroll-events-for-jquery/
;(function(a){var b=a.event.special,c="D"+ +(new Date),d="D"+(+(new Date)+1);b.scrollstart={setup:function(){var d,e=function(c){var e=this,f=arguments;if(d){clearTimeout(d)}else{c.type="scrollstart";a.event.handle.apply(e,f)}d=setTimeout(function(){d=null},b.scrollstop.latency)};a(this).bind("scroll",e).data(c,e)},teardown:function(){a(this).unbind("scroll",a(this).data(c))}};b.scrollstop={latency:0,setup:function(){var c,e=function(d){var e=this,f=arguments;if(c){clearTimeout(c)}c=setTimeout(function(){c=null;d.type="scrollstop";a.event.handle.apply(e,f)},b.scrollstop.latency)};a(this).bind("scroll",e).data(d,e)},teardown:function(){a(this).unbind("scroll",a(this).data(d))}}})(jQuery);

// Demo code
(function($) {
  var wvdemo = {
    $boxes: null,
    $showBoundsCheck: null,
    
    init: function() {
      
      var $body = $("body"),
          boxCount = 100,
          boxWidth = 20,
          boxHTML = "", i;
      
      // Make sure the demo will be wider than the device's screen so that vertical scroll bars appear
      //    but not so wide that you can't see at least four on screen at a time with a maximized browser window
      if (screen.width >= screen.height) {
        // Screen is wide/landscape
        boxWidth = parseInt((screen.width + 400)/10, 10);
      }
      else {
        boxWidth = parseInt((screen.height + 400)/10, 10);
      }
      
      // Generate boxes which will each be tested for their viewport within-ness
      i = 0;
      while (i < boxCount) {
        boxHTML += '<div aria-hidden="false">&nbsp;</div>';
        i++;
      }
      
      // Add a container and put the boxes inside
      $body.append('<div id="boxContainer" style="width:' + (boxWidth * 10 + 20) + 'px;">' + boxHTML + '</div>');
      
      // Set the styles so everything is nice and proportional to this device's screen
      $body.append("<style>#boxContainer div { width:" + boxWidth + "px;height:" + boxWidth + "px;line-height:" + boxWidth + "px; }</style>");
      wvdemo.$boxes = $("#boxContainer div");
      wvdemo.$boxes.get(4).id = 'test';
      
      wvdemo.$showBoundsCheck = $("#show-boundary");
      wvdemo.events.init();
      
      // Update the <div>s for the first time
      wvdemo.updateBoxes();
    },
    
    events: {
      
      // Setup event listeners
      init: function() {
        // Scroll or window resize
        $(window).on("resize scrollstop", wvdemo.updateBoxes);
        
        // User entry
        $('input[type="number"]').on("keyup change click", wvdemo.events.onBoundaryChange); // 'click' is for spinners on input[number] control
        // Boundary toggle
        wvdemo.$showBoundsCheck.on("change", wvdemo.events.onBoundaryToggle);
        
        // Nudge controls
        // Only certain combinations of browsers/OSes allow capturing arrow key strokes, unfortunately
        // Windows: Firefox, Trident, Safari, Opera; Mac: Chrome, Safari, Opera; Not Firefox
        if ((navigator.oscpu && /Windows/.test(navigator.oscpu) && /Firefox|Trident|Safari|Presto/.test(navigator.userAgent))
            || (/Macintosh/.test(navigator.userAgent) && /Chrome|Safari|Presto/.test(navigator.userAgent))) {
          $("#thresholds p").show();
        	$("body").on("keydown", wvdemo.events.onNudge);
        }
        
        // Controls toggler
        $("#toggler").on("click", wvdemo.events.onControlsToggle);
      },
      
      // When a boundary value changes
      onBoundaryChange: function(event) {
        var target = event.target,
            val = parseInt(target.value, 10),
            id = target.id;
        
        // Positive value was entered (negative values are allowed, but the boundaries would be off screen)
        if (val > 0) {
          if (wvdemo.$showBoundsCheck.is(':checked')) {
            $(".boundary-" + id).show();
            wvdemo.drawBound(id, val);
          }
          else {
            $(".boundary-" + id).hide();
          }
        }
        // Hide boundaries
        else {
          $(".boundary-" + id).hide();
        }
        
        // Update the page
        withinViewport.defaults[id] = val;
        wvdemo.updateBoxes();
        wvdemo.toggleBoundaryToggle();
      },
      
      // When the boundary toggle box is checked/unchecked 
      onBoundaryToggle: function() {
        if (wvdemo.$showBoundsCheck.is(":checked")) {
          // Fire the change event so wvdemo.events.onBoundaryChange() will apply any values
          $('input[type="number"]').change();
          wvdemo.toggleBoundaryToggle();
        }
        else {
          $(".boundary").hide();
          $(".boundary-" + this.id).hide();
        }
      },
      
      // When shift + arrow key is pressed, nudge the page by 1px
      onNudge: function(event) {
        // Ignore input fields
        if ($(event.target).is('input')) { return true; }
        if (event.shiftKey && 37 <= event.keyCode && event.keyCode <= 40) {
          var key = "key" + event.keyCode,
              scrollVals = {
                key38: [0, -1],
                key37: [-1, 0],
                key39: [1, 0],
                key40: [0, 1]
              };
          window.scrollBy(scrollVals[key][0], scrollVals[key][1]);
          event.preventDefault();
        }
      },
      
      onControlsToggle: function(event) {
        $("#explanation").toggleClass("collapsed");
        $("#toggler").toggleClass("plus minus");
      }
    },
    
    // Display or hide the "show boundaries" check box if any values are set (non-zero)
    toggleBoundaryToggle: function() {
      var somethingEntered = false;
      $('input[type="number"]').each(function() {
        if (parseInt(this.value, 10) !== 0) {
          somethingEntered = true;
        }
      });
      if (somethingEntered) {
        wvdemo.$showBoundsCheck.parent().slideDown();
      }
      else {
        wvdemo.$showBoundsCheck.parent().slideUp();
      }
    },
    
    // Overlay a boundary line on the viewport when one is set by the user
    drawBound: function(side, dist) {
      dist += "px";
      switch (side) {
        case "top":
          $(".boundary-top").css({top: dist, height: dist, marginTop: "-" + dist});
          break;
        case "right":
          $(".boundary-right").css({right: dist, width: dist, marginRight: "-" + dist});
          break;
        case "bottom":
          $(".boundary-bottom").css({bottom:dist, height: dist, marginBottom: "-" + dist});
          break;
        case "left":
          $(".boundary-left").css({left: dist, width: dist, marginLeft: "-" + dist});
          break;
        default:
          break;
      }
    },
    
    // Update each box's class to reflect whether it was determined to be within the viewport or not
    // Uses the jQuery plugin
    updateBoxes: function() {
      // Reset all boxes to being considered out of view
      wvdemo.$boxes
        .html("out")
        .attr("aria-hidden", "true")
        .removeClass("inview");
      // Then run withinViewport() on them to reveal which ones are inside
      wvdemo.$boxes
        .withinViewport()
          .html("in")
          .attr("aria-hidden", "false")
          .addClass("inview");
    }
  };
  
  window.wvdemo = wvdemo;
  $(document).ready(wvdemo.init);
  
})(jQuery);
