import { MultipleSides, Side, UserOptions } from './types.js'

// This order must match the shorthand used for CSS, e.g. for `margin: T R B L`
export const sides: Side[] = ['top', 'right', 'bottom', 'left']

export function isSide(side: string | Partial<UserOptions> | undefined): side is Side {
    return Boolean(side) && typeof side === 'string' && (sides as string[]).includes(side)
}

export function isMultipleSides(sideList: string | Partial<UserOptions> | undefined): sideList is MultipleSides {
    if (typeof sideList !== 'string') {
        return false
    }

    return sideList.split(' ').every((side) => sideList.includes(side))
}
