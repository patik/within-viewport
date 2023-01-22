import { AsyncConfig } from '../common/options'
import { determineRootMargin } from './rootMargin'
import { strictCallbackAndRootMargin } from './strictCallbackAndRootMargin'

/**
 * Generates the arguments for IntersectionObserver()
 *
 * Loose mode uses very large (but ultimately arbitrary) values for sides that should be ignored.
 *
 * Strict mode calculates these values by measuring the screen and the target element, but that is costly and it
 * seems very unlikely that these arbitrary values will produce inaccurate results for our purposes.
 */
export function getIntersectionObserverOptions(
    mode: 'strict',
    config: AsyncConfig,
    resolve: (value: boolean | PromiseLike<boolean>) => void,
    debug: boolean,
    elem: HTMLElement,
): [callback: IntersectionObserverCallback, options: IntersectionObserverInit]
export function getIntersectionObserverOptions(
    mode: 'loose',
    config: AsyncConfig,
    resolve: (value: boolean | PromiseLike<boolean>) => void,
    debug: boolean,
    elem?: HTMLElement,
): [callback: IntersectionObserverCallback, options: IntersectionObserverInit]
export function getIntersectionObserverOptions(
    mode: 'strict' | 'loose',
    config: AsyncConfig,
    resolve: (value: boolean | PromiseLike<boolean>) => void,
    debug: boolean,
    elem?: HTMLElement,
) {
    // if (debug) {
    //     console.log('---------------', elem?.getAttribute('data-boxid'))
    // }

    if (mode === 'strict' && elem) {
        return strictCallbackAndRootMargin(elem, config, resolve, debug)
    }

    return [
        (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            entries.forEach((entry) => {
                observer.disconnect()
                const { isIntersecting } = entry

                // if (debug) {
                //     console.log('---------------', elem?.getAttribute('data-boxid'))
                //     const { boundingClientRect, intersectionRect, intersectionRatio, isIntersecting, rootBounds } =
                //         entry
                //     console.log(entry)
                //     console.log(
                //         JSON.stringify({
                //             boundingClientRect,
                //             intersectionRect,
                //             intersectionRatio,
                //             isIntersecting,
                //             rootBounds,
                //         }),
                //     )
                //     console.log('returning ', isIntersecting)
                // }

                resolve(isIntersecting)
                return
            })
        },
        {
            rootMargin: determineRootMargin(config, 'loose'),
            root: config.container,
            threshold: 1.0,
        },
    ]
}
