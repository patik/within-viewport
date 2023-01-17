import { defaults } from 'lodash'
import { Config, MultipleSides, Side, UserOptions } from './types'
import { isSide, isMultipleSides, sides } from './sides'

const defaultSettings = {
    container: window,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
}

export type SyncConfig = {
    container: HTMLElement | Window
} & {
    [b in Side]: number | 'ignore'
}

export type AsyncConfig = {
    container: HTMLElement | Document
} & {
    [b in Side]: number | 'ignore'
}

/**
 * Combines user options with default settings to produce a complete configuration object
 */
// Overloading: basically, the async method cannot work with `container:window`, and the sync method cannot work with `container:document`
export function determineConfig(
    methodType: 'sync',
    elem: HTMLElement,
    userOptions?: Side | MultipleSides | Partial<UserOptions>,
): SyncConfig
export function determineConfig(
    methodType: 'async',
    elem: HTMLElement,
    userOptions?: Side | MultipleSides | Partial<UserOptions>,
): AsyncConfig
export function determineConfig(
    methodType: string,
    elem: HTMLElement,
    userOptions?: Side | MultipleSides | Partial<UserOptions>,
) {
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
        settings = defaults({}, userOptions, defaultSettings)
    }

    // Build configuration from defaults and user-provided settings and metadata
    const config: Config = defaults({}, settings, defaultSettings)
    // console.log(
    //     'config.container ',
    //     config.container && 'nodeName' in config.container
    //         ? config.container.nodeName
    //         : config.container === window
    //         ? 'window'
    //         : 'not sure',
    // )

    // Use the window as the container if the user specified the body or a non-element
    // console.log('A')
    if (
        config.container === document.body ||
        (config.container && 'nodeName' in config.container && config.container.nodeName === 'BODY') ||
        (config.container && 'nodeType' in config.container && config.container.nodeType !== 1)
    ) {
        // console.log('B')
        config.container = methodType === 'sync' ? window : document
    }
    // For the asynchronous method, the container cannot be the window
    else if (methodType === 'async' && config.container === window) {
        // console.log('C')
        config.container = document
    }
    // console.log('D')

    return config
}
