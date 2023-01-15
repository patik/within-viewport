type Side = 'all' | 'top' | 'right' | 'bottom' | 'left'

type Options = {
    container: HTMLElement | null
    sides: Side[]
    top: 0
    right: 0
    bottom: 0
    left: 0
}
