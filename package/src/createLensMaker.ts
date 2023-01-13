import { Lens } from './Lens'

/**
 * Generates a lens-creator (factory) where each lens shares a common set of defaults
 */
export function createLensMaker(customDefaults?: Options): (opts?: Options) => Lens {
    return (opts: Options = {}) => {
        return new Lens(opts, customDefaults)
    }
}
