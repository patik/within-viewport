import { formatFeet } from './formatFeet'

describe('formatFeet', () => {
    test('formats values correctly', () => {
        expect(formatFeet(0)).toBe(`0' 0.0"`)
        expect(formatFeet(1)).toBe(`1' 0.0"`)
        expect(formatFeet(1.1)).toBe(`1' 1.2"`)
        expect(formatFeet(2)).toBe(`2' 0.0"`)
        expect(formatFeet(12.34)).toBe(`12' 4.1"`)
        expect(formatFeet(Infinity)).toBe(`Infinity`)
    })
})
