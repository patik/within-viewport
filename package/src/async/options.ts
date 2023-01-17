import { Side } from '../common/common.types'
import { determineConfig } from '../common/options'
import { AsyncOptions } from './async.types'

const defaultOptions: AsyncOptions = {
    container: typeof document !== 'undefined' ? document.body : null,
    sides: ['all'],
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
}

export function getConfig(elem?: AsyncOptions['container'], userOptions?: Side | Partial<AsyncOptions>) {
    return determineConfig('async', defaultOptions, elem, userOptions)
}

export function determineRootMargin(config: AsyncOptions): string {
    // if (config.sides.includes('all')) {
    return `${-config.top}px ${-config.right}px ${-config.bottom}px ${-config.left}px`
    // }

    // if (config.sides.includes('all')) {
}
