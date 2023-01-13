import { decimalAdjust } from './decimalAdjust'
import { formatFeet } from './formatFeet'

/**
 * Returns the depth of field characteristics for a given lens' attributes
 *
 * @param focalLength
 * @param aperture
 * @param cropFactor
 * @param distance
 * @param imperialUnits
 */
export function calculateDepthOfField(
    focalLength: number,
    aperture: number,
    cropFactor: number,
    distance: number,
    imperialUnits: boolean
): DoFResult {
    const result: DoFResult = {
        dof: 0,
        focalLengthEquiv: 0,
        eighthDof: 0,
        hf: 0,
        near: 0,
        far: 0,
        coc: 0,
    }
    // e.g. 1 foot is 30.48% of 1 meter
    const unitMultiplier = imperialUnits ? 0.3048 : 1

    // Convert to millimeters
    distance = distance * 1000 * unitMultiplier

    // Get 35mm-equivalent focal length
    result.focalLengthEquiv = decimalAdjust(cropFactor * focalLength)

    // Convert sensor crop factor to a multiplier
    cropFactor = 1 / cropFactor

    result.coc = Math.round(0.03 * cropFactor * 1000) / 1000

    result.hf = Math.pow(focalLength, 2) / (aperture * result.coc) + focalLength * 1.0
    result.near = (distance * (result.hf - focalLength)) / (result.hf + distance - 2 * focalLength)
    result.far = (distance * (result.hf - focalLength)) / (result.hf - distance)

    // Undo conversion to millimeters
    result.hf = result.hf / 1000.0 / unitMultiplier
    result.near = result.near / 1000.0 / unitMultiplier
    result.far = result.far / 1000.0 / unitMultiplier

    if (result.far <= 0) {
        result.far = Infinity
        result.dof = Infinity
    } else {
        result.dof = result.far - result.near
    }

    result.eighthDof = result.dof / 8

    if (imperialUnits) {
        result.toString = function () {
            return formatFeet(result.dof)
        }
    } else {
        result.toString = function () {
            return `${result.dof}`
        }
    }

    return result
}
