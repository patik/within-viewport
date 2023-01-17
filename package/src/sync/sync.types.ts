import { CommonOptions } from '../common/common.types'

export type SyncOptions = CommonOptions & {
    container: HTMLElement | Window
}
