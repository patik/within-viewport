export type Side = 'top' | 'right' | 'bottom' | 'left'

export type MultipleSides = `${Side} ${Side}`

export type Boundaries = {
    [b in Side]: number
}

export type CommonOptions = {
    sides: Side[]
} & Boundaries
