# Within Viewport

Determine whether DOM elements are entirely within the viewport. Provides both jQuery selectors and methods.

Inspired by these similar utilities which only reflect whether an element is at least partially in view:

* Remy Sharp's [Element 'in view' Event Plugin](http://remysharp.com/2009/01/26/element-in-view-event-plugin/)
* Mike Tuupola's [Viewport Selectors for jQuery](http://www.appelsiini.net/projects/viewport)

## Dependencies

For now you will need to include jQuery 1.4+. In the future, a jQuery-independent version will be provided alongside the jQuery plugin.

## Usage

### Include

jQuery and the library:

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>
    <script src="jquery.withinViewport.js"></script>

### Use it:

    // These return true if the element is entirely within view
    $("#myElement").is(":within-viewport");
    $("#myElement").withinviewport();
    
    // Returns true if the element is within the left edge of the viewport
    $("#myElement").is(":within-viewport-left");
    $("#myElement").withinViewportLeft();
    
    // Other selectors and methods work similarly
    // Just replace 'left' with 'top', 'bottom', or 'right'
    $("#otherElement").is(":within-viewport-bottom")
    $("#otherElement").withinViewportRight()
    
    
### Settings:

Use the settings object `withinViewSettings` to define your page's viewport compared to the actual browser viewport.

    // Example: a fixed positioned header with a height of 100px
    withinViewSettings.top = 100;
    // Example: 100px top banner, but elements can have up to 10px below the bottom of the viewport
    withinViewSettings = {top: 100, bottom: -10};

### Notes:

For now, the code will create an instance called `withinView` and a default settings object `inViewSettings`. This requirement will eventually be removed. If these names conflicts with other variables in your code, change them in the library with find & replace.


## What's Next

- **Standalone library** that does not require jQuery (the jQuery plugin will remain)
- A [properly written](https://github.com/addyosmani/jquery-plugin-patterns) jQuery plugin
- Option to **fire events** when elements become within/outside of the viewport
- Remove need for declaring an instance

## Change History

### 0.1 - October 15, 2011
- Initial beta version

## License

Have fun with it -- BSD, MIT, or GPL; see included LICENSE file

## Author

Craig Patik; [patik.com](http://patik.com/), [@craigpatik](https://twitter.com/craigpatik)
