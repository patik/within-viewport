import { Side } from '../common/types'
import { determineConfig } from '../common/utilities'
import { AsyncOptions } from './types'

const defaultOptions: AsyncOptions = {
    container: typeof document !== 'undefined' ? document.body : null,
    sides: ['all'],
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
}

export function getConfig(elem?: AsyncOptions['container'], options?: Side | Partial<AsyncOptions>) {
    return determineConfig('async', defaultOptions, elem, options)
}

export function determineRootMargin(config: AsyncOptions): string {
    // if (config.sides.includes('all')) {
    return `${-config.top}px ${-config.right}px ${-config.bottom}px ${-config.left}px`
    // }

    // if (config.sides.includes('all')) {
}
