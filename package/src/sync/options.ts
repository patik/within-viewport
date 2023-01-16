import { Side } from '../common/common.types'
import { determineConfig } from '../common/options'
import { SyncOptions } from './sync.types'

const defaultOptions: SyncOptions = {
    container: typeof document !== 'undefined' ? document.body : null,
    sides: ['all'],
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
}

export function getConfig(elem: SyncOptions['container'], options?: Side | Partial<SyncOptions>) {
    return determineConfig('sync', defaultOptions, elem, options)
}
