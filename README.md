# Within Viewport

***Determine whether elements are within the viewport***

Includes:

- A standalone, plain JavaScript function, `withinviewport()`
- AMD and Node/CommonJS support
- Optional jQuery plugin with handy selectors and shorthand methods

All of the above offer the same features.

## Note

Although this plugin is still actively maintained, it will eventually be made obsolete by the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). You can check the current state of browser compatibility at [caniuse.com](https://caniuse.com/#feat=intersectionobserver). Meanwhile, withinviewport will continue to work on current and [legacy browsers](#Browser-Support).

## Installation

### AMD, Node.js, CommonJS

#### [NPM](https://www.npmjs.com/package/withinviewport)

`npm install withinviewport`

And then:

`var withinviewport = require('withinviewport');`

#### Bower:

`bower install within-viewport`

### Traditional include

Standalone (no jQuery):

```js
<script src="withinviewport.js"></script>
```

jQuery plugin:

```js
<script src="withinviewport.js"></script>
<script src="jquery.js"></script>
<script src="jquery.withinviewport.js"></script>
```

## Usage

### Basic

```js
// Returns true if the element is entirely within view of the window
var elem = document.getElementById('#myElement');
withinviewport(elem);
```

### Advanced

```js
// Test against only some sides of the window for faster performance
withinviewport(elem, {sides: 'left'});
```

```js
// Pick another element to act as the viewport (instead of `window`)
withinviewport(elem, {container: document.getElementById('myElem')});
```

```js
// Define your own viewport crop by specifying thresholds for each side
// Example: element is at least 12px inside the top and right of the viewport
withinviewport(elem, {top: 12, right: 12});
```

For more options, see [Settings](#settings) section below.

### Shorthand notation

```js
// These will use the default thresholds; see 'Settings' section below
withinviewport(elem, 'bottom right');
withinviewport.left(elem);
```

## jQuery plugin

### Usage

#### Basic

```js
// Returns true if the element is entirely within the viewport
$('#myElement').is(':within-viewport');
```

```js
// Returns a jQuery object of all <div>s that are within the viewport
$('div').withinviewport();
```

#### Advanced

There are shorthand selectors and methods for testing against only one edge of the viewport.

```js
// Returns true if the element is within the left edge of the viewport
// Also works with 'top', 'right', and 'bottom'
$('#myElement').is(':within-viewport-left');
```

```js
// Returns a jQuery collection of all <div>s within the left edge of the viewport
$('div').withinviewportleft();
```

```js
// Same as above, but only elements that are at least 12px inside the left edge
$('div').withinviewportleft({left: 12});
```

These shortcuts will result in slightly better performance if you're testing hundreds or thousands of elements.

#### Live updating

If you're looking to keep tabs on elements' whereabouts at all times, you can bind to the `window`'s `resize` and `scroll` events. Instead of `scroll`, I recommend using [James Padolsey's `scrollStop` event](http://james.padolsey.com/javascript/special-scroll-events-for-jquery/) since firing on every `window.scroll` event will [bring your UI to its knees](http://ejohn.org/blog/learning-from-twitter/).

```js
$(window).on('resize scrollStop', function() {
    // Your code here...

    // Example:
    $('div')
        // Momentarily declare all divs out of the viewport...
        .removeClass('within-viewport');
        // Then filter them to reveal which ones are still within it
        .filter(':within-viewport')
            .addClass('within-viewport');
});
```

A future version will allow you to fire custom events when elements pass in and out of the viewport.

## Settings

This applies to both the jQuery plugin and standalone function.

Use the object `withinviewport.defaults` to define your page's practical viewport compared to the actual browser window.

### Custom viewport element

If you want to test whether an element is within a scrollable parent element (e.g. which has `overflow: auto`), assign the parent element to the `container` property:

```js
$('.child-element').withinviewport({
    container: $('.parent-element')
});
```

### Custom boundaries

For example, a fixed header with a height of 100px that spans the entire width of the page effectively lowers the viewport by 100px from the top edge of the browser window:

```js
withinviewport.defaults.top = 100;
```

If you only care about some edges of the viewport, you can specify them to improve performance:

```js
withinviewport.defaults.sides = 'left bottom';
```

You can also pass settings on the fly to temporarily override the defaults:

```js
withinviewport(elem, {sides:'left bottom', left: 40});
$('div').withinviewport({sides:'left bottom', left: 40});
```

Individual elements may have their own settings embedded in a `data` attribute using object notation. These will override both the defaults any any settings passed to the function on the fly (like the example above).

```html
<div data-withinviewport-settings="{sides: 'left', top: 40}">
```

You can specify *negative threshold values* to allow elements to reside outside the viewport.

## Browser Support

- IE 7(?) and higher
- All the others except Opera Mini
    + Tested in the latest stable Chrome, Firefox, Safari, and IE
    + No "new" JavaScript or quirky techniques are employed so it should work in all other modern browsers not specifically mentioned above

## What's Next

*Please note that the camel case `withinViewport` method name is deprecated and is no longer supported as of version 2.0.0.*

- Option to **fire events** when elements pass in and out of the viewport
- Test against Firefox 3.6, Safari 5.0.1


## Credit

Within Viewport is inspired by these similar utilities which only reflect whether an element is at least partially in view:

* Remy Sharp's [Element 'in view' Event Plugin](http://remysharp.com/2009/01/26/element-in-view-event-plugin/)
* Mike Tuupola's [Viewport Selectors for jQuery](http://www.appelsiini.net/projects/viewport)

## License

Have fun with it &mdash; [ISC](http://choosealicense.com/licenses/isc/). See included [LICENSE](LICENSE) file.

## Author

Craig Patik, [patik.com](http://patik.com/) &amp; [@craigpatik](https://twitter.com/craigpatik)
