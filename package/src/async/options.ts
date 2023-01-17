import { Config } from '../common/types'
import { sides } from '../common/sides'

export function determineRootMargin(config: Config): string {
    const margins = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    }

    sides.forEach((side) => {
        const value = config[side]

        if (value === 'ignore' || value === null) {
            margins[side] = -100000
        } else {
            margins[side] = value ?? 0
        }
    })

    return `${-margins.top}px ${-margins.right}px ${-margins.bottom}px ${-margins.left}px`
}
