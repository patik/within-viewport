import { objectKeysArray } from './objectKeysArray'

const apertureRegex = /^f\/(\d+(?:\.\d+)?)$/

// Map of human-friendly values to their precise numeric values
export const preciseApertureMap: Record<string, number> = {
    'f/1': 1,
    'f/1.2': 1.189207,
    'f/1.4': 1.414214,
    'f/1.6': 1.587401,
    'f/1.7': 1.681793,
    'f/1.8': 1.781797,
    'f/2': 2.0,
    'f/2.2': 2.244924,
    'f/2.4': 2.378414,
    'f/2.5': 2.519842,
    'f/2.8': 2.828427,
    'f/3.2': 3.174802,
    'f/3.4': 3.363586,
    'f/3.6': 3.563595,
    'f/4': 4.0,
    'f/4.5': 4.489848,
    'f/4.8': 4.756828,
    'f/5': 5.039684,
    'f/5.6': 5.656854,
    'f/6.4': 6.349604,
    'f/6.7': 6.727171,
    'f/7.1': 7.12719,
    'f/8': 8.0,
    'f/9': 8.979696,
    'f/9.5': 9.513657,
    'f/10': 10.07937,
    'f/11': 11.313708,
    'f/12.7': 12.699208,
    'f/13.5': 13.454343,
    'f/14.3': 14.254379,
    'f/16': 16.0,
    'f/18': 17.959393,
    'f/19': 19.027314,
    'f/20': 20.158737,
    'f/22': 22.627417,
    'f/25': 25.398417,
    'f/27': 26.908685,
    'f/28': 28.508759,
    'f/32': 32,
    'f/45': 45.254834,
    'f/64': 64,
}

// It's possible that lenses might excede what we have listed in this map, so let's give the benefit of the doubt and accept those numbers as-is. To do this, we need to know the smallest and largest values in our map.
// We need to ignore test coverage for this line, otherwise it is marked as uncovered; this happens because we're ignoring the thrown exception near the end
/* istanbul ignore next line */
const sortedValues = Object.values(preciseApertureMap).sort((a, b) => (a > b ? 1 : -1))
const smallestDocumentedAperture = sortedValues.slice(undefined, 1)[0]
const largestDocumentedAperture = sortedValues.slice(-1)[0]

/**
 * Takes a human-friendly string and returns a precise numeric value that is equivalent
 * @example 'f/5' => 5.039684
 */
function getPreciseAperture(humanValue: string): number | undefined {
    if (
        humanValue in preciseApertureMap &&
        Object.prototype.hasOwnProperty.call(preciseApertureMap, humanValue) &&
        preciseApertureMap[humanValue]
    ) {
        return preciseApertureMap[humanValue]
    }

    // Jest needs an explicit return for each code path
    return
}

/**
 * Takes a numeric value and returns a human-friendly string that is equivalent
 * @example 5.039684 => 'f/5'
 */
export function getApertureName(value: number): keyof typeof preciseApertureMap | undefined {
    return objectKeysArray(preciseApertureMap).find((key) => {
        return preciseApertureMap[key] === value
    })
}

export function isApertureString(value?: string): value is ApertureString {
    return typeof value === 'string' && apertureRegex.test(value)
}

/**
 * Turns user input into a workable aperture value that can be used for calculations
 */
export function toActualAperture({
    input,
    defaultOptionsAperture,
    customSettingsAperture,
}: {
    input?: string | number
    customSettingsAperture?: string | number
    defaultOptionsAperture: ApertureString
}): number {
    // The value is not in our map, but perhaps the user is looking for something larger or smaller than what we have documented
    if (
        typeof input === 'number' &&
        input > 0 &&
        input < Infinity &&
        (input < smallestDocumentedAperture || input > largestDocumentedAperture)
    ) {
        return input
    }

    let apertureString: ApertureString | undefined = undefined

    if (typeof input === 'number') {
        apertureString = `f/${input}`
    } else if (isApertureString(input)) {
        apertureString = input
    } else {
        if (typeof customSettingsAperture === 'number') {
            apertureString = `f/${customSettingsAperture}`
        } else if (typeof customSettingsAperture === 'string' && isApertureString(customSettingsAperture)) {
            apertureString = customSettingsAperture
        }
    }

    let preciseAperture: number | undefined = apertureString ? getPreciseAperture(apertureString) : undefined

    if (!preciseAperture) {
        // The value is not in our map, but perhaps the user is looking for something larger or smaller than what we have documented
        // We need to ignore test coverage for this line, otherwise it is marked as uncovered; this happens because we're ignoring the thrown exception near the end
        /* istanbul ignore next line */
        const inputAsNumber = typeof input === 'number' ? input : Number(input?.replace('f/', ''))

        if (
            inputAsNumber > 0 &&
            Number.isFinite(inputAsNumber) &&
            (inputAsNumber < smallestDocumentedAperture || inputAsNumber > largestDocumentedAperture)
        ) {
            return inputAsNumber
        }
    }

    // Fall back to the default value if we couldn't figure out how to extract one from the input
    if (!preciseAperture) {
        preciseAperture = getPreciseAperture(defaultOptionsAperture)
    }

    // Still did not find something. This is exceedingly unlikely (it's only possible if defaultOptionsAperture is invalid) so let's throw an exception
    // We need to ignore test coverage for this line, otherwise it is marked as uncovered; this happens because we're ignoring the thrown exception near the end
    /* istanbul ignore next line */
    if (!preciseAperture) {
        /* istanbul ignore next */
        throw new Error(`Could not find a valid aperture for this string: ${apertureString}`)
    }

    return preciseAperture
}
