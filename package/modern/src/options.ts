const defaultOptions: Options = {
    container: typeof document !== 'undefined' ? document.body : null,
    sides: ['all'],
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
}

function isSide(side: string | Options | Partial<Options> | undefined): side is Side {
    return Boolean(side) && typeof side === 'string' && ['all', 'top', 'right', 'bottom', 'left'].includes(side)
}

function isSides(sides: string | string[] | Options | Partial<Options> | undefined): sides is Side[] {
    if (Array.isArray(sides)) {
        return sides.every((side) => ['all', 'top', 'right', 'bottom', 'left'].includes(side))
    }

    if (typeof sides !== 'string') {
        return false
    }

    return sides.split(' ').every((side) => ['all', 'top', 'right', 'bottom', 'left'].includes(side))
}

export function determineConfig(elem: HTMLElement, options?: Side | Partial<Options>) {
    if (typeof elem !== 'object' || elem.nodeType !== 1) {
        throw new Error('First argument must be an element')
    }

    let settings: Options

    // Settings argument may be a simple string (`top`, `right`, etc)
    if (isSide(options)) {
        settings = {
            ...defaultOptions,
            sides: [options],
        }
    } else if (isSides(options)) {
        settings = {
            ...defaultOptions,
            sides: options,
        }
    } else {
        settings = Object.assign({}, defaultOptions, options)
    }

    // Build configuration from defaults and user-provided settings and metadata
    const config: Options = Object.assign({}, defaultOptions, settings)

    // Use the window as the container if the user specified the body or a non-element
    if (
        config.container === document.body ||
        (config.container && 'nodeType' in config.container && config.container.nodeType !== 1)
    ) {
        config.container = null
    }

    return config
}
