import { CommonOptions } from '../common/types'

export type SyncOptions = CommonOptions & {
    container: HTMLElement | null | Window
}
