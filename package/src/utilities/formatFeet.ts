/**
 * Converts a numeric value into standard notation for feet and inches
 *
 * @example 5.5` -> 5' 6"`
 *
 * @param  feet     Length in feet
 * @return          Length (feet/inches) as a decimal, or infinity
 */
export function formatFeet(feet: number): string {
    if (!Number.isFinite(feet)) {
        return 'Infinity'
    } else {
        return Math.floor(feet) + "' " + ((feet * 12) % 12).toFixed(1) + '"'
    }
}
