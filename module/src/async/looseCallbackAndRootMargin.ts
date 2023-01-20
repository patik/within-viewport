import { AsyncConfig } from '../common/options'
import { determineRootMarginLoose } from './options'

export function looseCallbackAndRootMargin(
    elem: HTMLElement,
    config: AsyncConfig,
    resolve: (value: boolean | PromiseLike<boolean>) => void,
    debug = elem.getAttribute('data-boxid') === '90',
) {
    return {
        rootMargin: determineRootMarginLoose(config),
        callback: (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            entries.forEach((entry) => {
                observer.disconnect()
                const { isIntersecting } = entry

                if (debug) {
                    const { boundingClientRect, intersectionRect, intersectionRatio, isIntersecting, rootBounds } =
                        entry
                    console.log(entry)
                    console.log(
                        JSON.stringify({
                            boundingClientRect,
                            intersectionRect,
                            intersectionRatio,
                            isIntersecting,
                            rootBounds,
                        }),
                    )
                }

                if (debug) {
                    console.log('returning ', isIntersecting)
                }
                resolve(isIntersecting)
                return
            })
        },
    }
}
