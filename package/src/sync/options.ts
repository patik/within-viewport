import { Side, MultipleSides } from '../common/common.types'
import { determineConfig } from '../common/options'
import { SyncOptions } from './sync.types'

const defaultSettings: SyncOptions = {
    container: window,
    sides: ['top', 'right', 'bottom', 'left'],
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
}

export function getConfig(elem: HTMLElement, userOptions?: Side | MultipleSides | Partial<SyncOptions>) {
    return determineConfig('sync', defaultSettings, elem, userOptions)
}
