import { Config, MultipleSides, Side, UserOptions } from './types.js'
import { isSide, isMultipleSides, sides } from './sides.js'

const defaultSettings = {
    container: window,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
}

// ts-prune-ignore-next
export type SyncConfig = {
    container: HTMLElement | Window
} & {
    [b in Side]: number | 'ignore'
}

// ts-prune-ignore-next
export type AsyncConfig = {
    container: HTMLElement | Document
} & {
    [b in Side]: number | 'ignore'
}

/**
 * Combines user options with default settings to produce a complete configuration object
 *
 * Reason for overloading: basically, the async method cannot work with `container:window`, and the sync method cannot work with `container:document`, and I want each of those methods to receive the correct types, so each overload has a different return type.
 */
export function getConfig(
    methodType: 'sync',
    elem: HTMLElement,
    userOptions?: Side | MultipleSides | Partial<UserOptions>,
): SyncConfig
export function getConfig(
    methodType: 'async',
    elem: HTMLElement,
    userOptions?: Side | MultipleSides | Partial<UserOptions>,
): AsyncConfig
export function getConfig(
    methodType: 'sync' | 'async',
    elem: HTMLElement,
    userOptions?: Side | MultipleSides | Partial<UserOptions>,
) {
    // Don't bother running in non-browser environments
    if (typeof window === 'undefined') {
        return
    }

    if (typeof elem !== 'object' || (elem && 'nodeType' in elem && elem.nodeType !== 1)) {
        throw new Error('First argument must be an element')
    }

    let settings: Config

    // Settings argument may be a simple string (`top`, `right`, etc)
    if (isSide(userOptions)) {
        settings = {
            ...defaultSettings,
        }

        // Ignore all the other sides
        sides.forEach((side) => {
            if (side !== userOptions) {
                settings[side] = 'ignore'
            }
        })
    } else if (isMultipleSides(userOptions)) {
        settings = {
            ...defaultSettings,
        }

        // Ignore all the other sides
        sides.forEach((side) => {
            if (!userOptions.split(' ').includes(side)) {
                settings[side] = 'ignore'
            }
        })
    } else {
        settings = Object.assign({}, defaultSettings, userOptions)
    }

    // Build configuration from defaults and user-provided settings and metadata
    const config: Config = Object.assign({}, defaultSettings, settings)

    // Use the window as the container if the user specified the body or a non-element
    if (
        config.container === document.body ||
        (config.container && 'nodeName' in config.container && config.container.nodeName === 'BODY') ||
        (config.container && 'nodeType' in config.container && config.container.nodeType !== 1)
    ) {
        config.container = methodType === 'sync' ? window : document
    }
    // For the asynchronous method, the container cannot be the window
    else if (methodType === 'async' && config.container === window) {
        config.container = document
    }

    return config
}
