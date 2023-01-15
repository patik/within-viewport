interface Window {
    scrollTop: HTMLElement['scrollTop']
    scrollLeft: HTMLElement['scrollLeft']
    getBoundingClientRect: HTMLElement['getBoundingClientRect']
}

type Side = 'all' | 'top' | 'right' | 'bottom' | 'left'

type Options = {
    container: HTMLElement | null
    sides: Side[]
    top: number
    right: number
    bottom: number
    left: number
}
