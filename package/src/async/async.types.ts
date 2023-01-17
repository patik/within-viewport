import { CommonOptions } from '../common/common.types'

export type AsyncOptions = CommonOptions & {
    container: HTMLElement | Document
}
