# Within Viewport

***Determine whether elements are within the viewport***

Includes:

- A synchronous function, `withinViewport()`
  - Also supports [legacy browsers](#browser-support)
- An asynchronous, promise-based function, `withinViewportAsync()`
  - Only for [modern browsers](https://caniuse.com/intersectionobserver) (e.g. post IE 11)
- Optional jQuery plugin with handy selectors and shorthand methods

All of the above offer the same features.

## Install

```sh
yarn add withinviewport
```

or

```sh
npm install withinviewport
```

And then in your JavaScript or TypeScript:

```js
import { withinViewport /* or withinViewportAsync */ } from 'withinviewport'
```

## Usage

### Basic

```js
// Returns true if the element is entirely within view of the window
const elem = document.getElementById('#myElement')

withinViewport(elem) // returns a boolean
```

### Advanced

```js
// Test against only some sides of the window for faster performance
withinViewport(elem, { sides: 'left' })
```

```js
// Pick another element to act as the viewport (instead of `window`)
withinViewport(elem, { container: document.getElementById('myElem') })
```

```js
// Define your own viewport crop by specifying thresholds for each side
// Example: element is at least 12px inside the top and right of the viewport
withinViewport(elem, { top: 12, right: 12 })
```

For more options, see [Settings](#settings) section below.

### Shorthand notation

```js
// These will use the default thresholds; see 'Settings' section below
withinViewport(elem, 'bottom right')
left(elem)
```

## jQuery plugin

Be sure to include the full version of the script as well

```js
<script src="withinviewport.js"></script>
<script src="jquery.js"></script>
<script src="jquery.withinviewport.js"></script>
```

### Basic usage

```js
// Returns true if the element is entirely within the viewport
$('#myElement').is(':within-viewport')
```

```js
// Returns a jQuery object of all <div>s that are within the viewport
$('div').withinViewport()
```

### Advanced usage

There are shorthand selectors and methods for testing against only one edge of the viewport.

```js
// Returns true if the element is within the left edge of the viewport
// Also works with 'top', 'right', and 'bottom'
$('#myElement').is(':within-viewport-left')
```

```js
// Returns a jQuery collection of all <div>s within the left edge of the viewport
$('div').withinViewportLeft()
```

```js
// Same as above, but only elements that are at least 12px inside the left edge
$('div').withinViewportLeft({ left: 12 })
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

## Settings

This applies to both the jQuery plugin and standalone function.

### Custom viewport element

If you want to test whether an element is within a scrollable parent element (e.g. which has `overflow: auto` or `scroll`), assign the parent element to the `container` property:

```js
$('.child-element').withinViewport({
    container: $('.parent-element')
});
```

### Custom boundaries

For example, a fixed header with a height of 100px that spans the entire width of the page effectively lowers the viewport by 100px from the top edge of the browser window:

```js
withinViewport.defaults.top = 100
```

If you only care about some edges of the viewport, you can specify them to improve performance:

```js
withinViewport.defaults.sides = 'left bottom'
```

You can also pass settings on the fly to temporarily override the defaults:

```js
withinViewport(elem, { sides: 'left bottom', left: 40 })
$('div').withinViewport({ sides: 'left bottom', left: 40 })
```

You can specify *negative threshold values* to allow elements to reside outside the viewport.

## Browser Support

For the synchronous functions:

- IE 7(?) and higher
- All the others except Opera Mini
  - Tested in the latest stable Chrome, Firefox, Safari, and Edge

The asynchronous functions work in any browser that supports promises and [IntersectionObserver](https://caniuse.com/intersectionobserver).

All functions (both versions) are transpiled to ES5.

## Credit

Within Viewport is inspired by these similar utilities which only reflect whether an element is at least partially in view:

- Remy Sharp's [Element 'in view' Event Plugin](http://remysharp.com/2009/01/26/element-in-view-event-plugin/)
- Mike Tuupola's [Viewport Selectors for jQuery](http://www.appelsiini.net/projects/viewport)

## License

Have fun with it &mdash; [BSD-3-Clause](https://choosealicense.com/licenses/bsd-3-clause/). See included [LICENSE](LICENSE) file.

## Author

[Craig Patik](https://patik.com)
