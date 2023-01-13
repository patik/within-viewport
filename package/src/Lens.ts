import { combineSettings } from './utilities/combineSettings'
import { calculateDepthOfField } from './utilities/calculateDepthOfField'

export const builtInDefaults: DefaultOptions = Object.freeze({
    focalLength: 35,
    aperture: 'f/2',
    cropFactor: 1,
    id: undefined,
})

const defaultDistanceMetric = 5 // Distance to the subject, when meters are used
const defaultDistanceImperial = 15 // Distance to the subject, when feet are used

/**
 * Depth of Field Lens object which can be used to calculate the depth of field at various distances
 *
 * @param  focalLength  Actual local length in millimeters (not the 35mm-equivalent)
 * @param  aperture     Aperture as a string in the format "f/2.5"
 * @param  cropFactor   Sensor crop factor
 * @param  id           Optional, arbitrary ID for tracking by the consumer
 */
export class Lens {
    readonly focalLength: Settings['focalLength']
    readonly aperture: Settings['aperture']
    readonly cropFactor: Settings['cropFactor']
    readonly id: Settings['id'] | undefined

    constructor({ focalLength, aperture, cropFactor, id }: Options = {}, customDefaults: Options = builtInDefaults) {
        const settings = combineSettings({ focalLength, aperture, cropFactor, id }, customDefaults)

        this.focalLength = settings.focalLength
        this.aperture = settings.aperture
        this.cropFactor = settings.cropFactor
        this.id = settings.id
    }

    /**
     * Determines the depth of field for the lens at the given distance
     *
     * @param distance Distance to the subject, in meters
     * @param imperialUnits Whether to use imperial units (feet) instead of metric
     */
    public dof = (distance?: number, imperialUnits = false): DoFResult => {
        if (distance === undefined || isNaN(distance)) {
            distance = imperialUnits ? defaultDistanceImperial : defaultDistanceMetric
        }

        return calculateDepthOfField(this.focalLength, this.aperture, this.cropFactor, distance, imperialUnits)
    }
}
