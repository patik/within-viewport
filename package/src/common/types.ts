export type Side = 'top' | 'right' | 'bottom' | 'left'

export type MultipleSides = `${Side} ${Side}`

export type Boundaries = {
    [b in Side]?: number | 'ignore' | null
}

// What the user provides
export type UserOptions = {
    container?: HTMLElement | Window | Document
} & Boundaries

// What we use internally
export type Config = {
    container: HTMLElement | Window | Document
} & {
    [b in Side]: number | 'ignore'
}
