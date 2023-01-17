export type Side = 'all' | 'top' | 'right' | 'bottom' | 'left'

export type SideOption = `${Side} ${Side}`

export type CommonOptions = {
    sides: Side[]
    top: number
    right: number
    bottom: number
    left: number
}
