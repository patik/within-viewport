import { Side, SideOption } from '../common/common.types'
import { determineConfig } from '../common/options'
import { SyncOptions } from './sync.types'

const defaultSettings: SyncOptions = {
    container: window,
    sides: ['all'],
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
}

export function getConfig(elem: HTMLElement, userOptions?: Side | SideOption | Partial<SyncOptions>) {
    return determineConfig('sync', defaultSettings, elem, userOptions)
}
