import { decimalAdjust } from './decimalAdjust'

describe('decimalAdjust', () => {
    test('converts values correctly', () => {
        expect(decimalAdjust(0)).toBe(0)
        expect(decimalAdjust(0.0)).toBe(0)
        expect(decimalAdjust(0.0000001)).toBe(0)
        expect(decimalAdjust(1)).toBe(1)
        expect(decimalAdjust(1.0)).toBe(1)
        expect(decimalAdjust(1.1)).toBe(1.1)
        expect(decimalAdjust(10)).toBe(10)
        expect(decimalAdjust(10.0)).toBe(10)
        expect(decimalAdjust(1e2)).toBe(100)
        expect(decimalAdjust(1.2e3)).toBe(1200)
        expect(decimalAdjust(1.0e4)).toBe(10000)
        expect(decimalAdjust(1.0e24)).toBe(1e24)
        expect(decimalAdjust(NaN)).toBe(NaN)
    })
})
