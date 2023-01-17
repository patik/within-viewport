import { CommonOptions, Side } from './common.types'
import { isSide, isSides } from './sides'

/**
 * Combines user options with default settings to produce a complete configuration object
 */
export function determineConfig<O extends CommonOptions & { container: HTMLElement | Window | null }>(
    methodType: 'sync' | 'async',
    defaultSettings: O,
    elem?: O['container'],
    userOptions?: Side | Partial<CommonOptions>,
) {
    if (typeof elem !== 'object' || (elem && 'nodeType' in elem && elem.nodeType !== 1)) {
        throw new Error('First argument must be an element')
    }

    let settings: O

    // Settings argument may be a simple string (`top`, `right`, etc)
    if (isSide(userOptions)) {
        settings = {
            ...defaultSettings,
            sides: [userOptions],
        }
    } else if (isSides(userOptions)) {
        settings = {
            ...defaultSettings,
            sides: userOptions,
        }
    } else {
        settings = Object.assign({}, defaultSettings, userOptions)
    }

    // Build configuration from defaults and user-provided settings and metadata
    const config: O = Object.assign({}, defaultSettings, settings)

    // Use the window as the container if the user specified the body or a non-element
    if (
        config.container === document.body ||
        (config.container && 'nodeType' in config.container && config.container.nodeType !== 1)
    ) {
        config.container = methodType === 'sync' ? window : null
    }

    return config
}
