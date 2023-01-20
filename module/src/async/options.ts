import { Config } from '../common/types'
import { sides } from '../common/sides'

export function determineRootMarginLoose(config: Config): string {
    const margins = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    }

    sides.forEach((side) => {
        const value = config[side]

        if (value === 'ignore' || value === null) {
            margins[side] = -screen.width
        } else {
            margins[side] = typeof value === 'number' ? value : 0
        }
    })

    return `${-margins.top}px ${-margins.right}px ${-margins.bottom}px ${-margins.left}px`
}

export function determineRootMarginStrict(config: Config): string {
    const margins = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    }

    sides.forEach((side) => {
        const value = config[side]

        margins[side] = typeof value === 'number' ? value : 0
    })

    return `${-margins.top}px ${-margins.right}px ${-margins.bottom}px ${-margins.left}px`
}
