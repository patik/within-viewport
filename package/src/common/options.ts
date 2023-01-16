import { CommonOptions, Side } from './common.types'
import { isSide, isSides } from './sides'

export function determineConfig<O extends CommonOptions & { container: HTMLElement | Window | null }>(
    version: 'sync' | 'async',
    defaultOptions: O,
    elem?: O['container'],
    options?: Side | Partial<CommonOptions>,
) {
    if (typeof elem !== 'object' || (elem && 'nodeType' in elem && elem.nodeType !== 1)) {
        throw new Error('First argument must be an element')
    }

    let settings: O

    // Settings argument may be a simple string (`top`, `right`, etc)
    if (isSide(options)) {
        settings = {
            ...defaultOptions,
            sides: [options],
        }
    } else if (isSides(options)) {
        settings = {
            ...defaultOptions,
            sides: options,
        }
    } else {
        settings = Object.assign({}, defaultOptions, options)
    }

    // Build configuration from defaults and user-provided settings and metadata
    const config: O = Object.assign({}, defaultOptions, settings)

    // Use the window as the container if the user specified the body or a non-element
    if (version === 'sync') {
        if (
            config.container === document.body ||
            (config.container && 'nodeType' in config.container && config.container.nodeType !== 1)
        ) {
            config.container = window
        }
    }

    return config
}
