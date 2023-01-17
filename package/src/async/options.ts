import { Side, MultipleSides, Boundaries } from '../common/common.types'
import { determineConfig } from '../common/options'
import { AsyncOptions } from './async.types'

const defaultOptions: AsyncOptions = {
    container: document.body,
    sides: ['top', 'right', 'bottom', 'left'],
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
}

export function getConfig(elem: HTMLElement, userOptions?: Side | MultipleSides | Partial<AsyncOptions>) {
    return determineConfig('async', defaultOptions, elem, userOptions)
}

const sides: Array<keyof Boundaries> = ['top', 'right', 'bottom', 'left']

export function determineRootMargin(config: AsyncOptions): string {
    if (config.sides.length !== 4) {
        const sidesToIgnore = sides.filter((side) => !config.sides.includes(side))

        sidesToIgnore.forEach((side) => {
            config[side] = -100000
        })
    }

    return `${-config.top}px ${-config.right}px ${-config.bottom}px ${-config.left}px`
}
