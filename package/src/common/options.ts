import { defaults } from 'lodash'
import { AsyncOptions } from '../async/async.types'
import { SyncOptions } from '../sync/sync.types'
import { CommonOptions, Side, SideOption } from './common.types'
import { isSide, isSides } from './sides'

type Options = SyncOptions | AsyncOptions

/**
 * Combines user options with default settings to produce a complete configuration object
 */
export function determineConfig<O extends Options>(
    methodType: 'sync' | 'async',
    defaultSettings: O,
    elem: HTMLElement,
    userOptions?: Side | SideOption | Partial<CommonOptions>,
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
            sides: userOptions.split(' '),
        }
    } else {
        settings = defaults({}, userOptions, defaultSettings)
    }

    // Build configuration from defaults and user-provided settings and metadata
    const config: O = defaults({}, settings, defaultSettings)
    // console.log(
    //     'config.container ',
    //     config.container && 'nodeName' in config.container
    //         ? config.container.nodeName
    //         : config.container === window
    //         ? 'window'
    //         : 'not sure',
    // )

    // Use the window as the container if the user specified the body or a non-element
    if (
        config.container === document.body ||
        (config.container && 'nodeName' in config.container && config.container.nodeName === 'BODY') ||
        (config.container && 'nodeType' in config.container && config.container.nodeType !== 1)
    ) {
        // console.log('IS THE BODY!')
        config.container = methodType === 'sync' ? window : document.body
    } else {
        // console.log('not the body ', config.container)
    }

    return config
}
