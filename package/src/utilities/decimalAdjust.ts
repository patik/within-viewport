/**
 * Decimal adjustment of a number.
 * Adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round#Example:_Decimal_rounding
 *
 * @param   value   The number
 * @returns         The adjusted value
 */
export function decimalAdjust(value: number): number {
    const exp = -1 // The exponent (the 10 logarithm of the adjustment base)

    value = +value

    // If the value is not a number or the exp is not an integer...
    if (isNaN(value)) {
        return NaN
    }

    // Shift
    const parts = value.toString().split('e')

    const shifted = Math.round(+(parts[0] + 'e' + (parts[1] ? +parts[1] - exp : -exp)))

    // Shift back
    const unshifted = shifted.toString().split('e')

    return +(unshifted[0] + 'e' + (unshifted[1] ? +unshifted[1] + exp : exp))
}
