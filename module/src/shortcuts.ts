import { withinViewportAsync } from './async/index.js'
import { withinViewport } from './sync/index.js'

/**
 * Shortcut methods for each side of the viewport
 */
/**
 * Test if an element is below the top edge of the viewport
 *
 * @example `topAsync(elem)` is the same as `withinViewport(elem, 'top')`
 */

export function top(element: HTMLElement): boolean {
    return withinViewport(element, 'top')
}
/**
 * Test if an element is within the right edge of the viewport
 *
 * @example `right(elem)` is the same as `withinViewport(elem, 'right')`
 */

export function right(element: HTMLElement): boolean {
    return withinViewport(element, 'right')
}
/**
 * Test if an element is above the bottom edge of the viewport
 *
 * @example `bottom(elem)` is the same as `withinViewport(elem, 'bottom')`
 */

export function bottom(element: HTMLElement): boolean {
    return withinViewport(element, 'bottom')
}
/**
 * Test if an element is within the left edge of the viewport
 *
 * @example `left(elem)` is the same as `withinViewport(elem, 'left')`
 */

export function left(element: HTMLElement): boolean {
    return withinViewport(element, 'left')
}
/**
 * Test if an element is below the top edge of the viewport
 *
 * @example `topAsync(elem)` is the same as `withinViewportAsync(elem, 'top')`
 */

export async function topAsync(element: HTMLElement): Promise<boolean> {
    return await withinViewportAsync(element, 'top')
}
/**
 * Test if an element is within the right edge of the viewport
 *
 * @example `rightAsync(elem)` is the same as `withinViewportAsync(elem, 'right')`
 */

export async function rightAsync(element: HTMLElement): Promise<boolean> {
    return withinViewportAsync(element, 'right')
}
/**
 * Test if an element is above the bottom edge of the viewport
 *
 * @example `bottomAsync(elem)` is the same as `withinViewportAsync(elem, 'bottom')`
 */

export async function bottomAsync(element: HTMLElement): Promise<boolean> {
    return withinViewportAsync(element, 'bottom')
}
/**
 * Test if an element is within the left edge of the viewport
 *
 * @example `leftAsync(elem)` is the same as `withinViewportAsync(elem, 'left')`
 */

export async function leftAsync(element: HTMLElement): Promise<boolean> {
    return withinViewportAsync(element, 'left')
}
