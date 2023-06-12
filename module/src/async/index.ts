import { getConfig } from '../common/options.js'
import { MultipleSides, Side, UserOptions } from '../common/types.js'
import { getIntersectionObserverOptions } from './options.js'

/**
 * Determines whether an element is within the viewport
 * @param  {HTMLElement}      elem           DOM Element (required)
 * @param  {String | Object}  userOptions    Optional settings
 * @return {Promise<Boolean>}                Whether the element was completely within the viewport
 */
export async function withinViewportAsync(
    elem: HTMLElement,
    userOptions?: Side | MultipleSides | Partial<UserOptions>,
): Promise<boolean> {
    return new Promise((resolve) => {
        const config = getConfig('async', elem, userOptions)
        const opts = getIntersectionObserverOptions('loose', config, resolve, elem)

        new IntersectionObserver(...opts).observe(elem)
    })
}
