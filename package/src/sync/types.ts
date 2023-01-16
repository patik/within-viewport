export type Side = 'all' | 'top' | 'right' | 'bottom' | 'left'

export type Options = {
    container: HTMLElement | null | Window
    sides: Side[]
    top: number
    right: number
    bottom: number
    left: number
}
