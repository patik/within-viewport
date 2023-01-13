import { createLensMaker } from './createLensMaker'

describe('Generating lenses with custom defaults using createLensMaker', () => {
    test('creates lenses with the default settings', () => {
        const lensMaker = createLensMaker()
        const lens1 = lensMaker()
        const lens2 = lensMaker()

        expect(lens1.focalLength).toBe(35)
        expect(lens1.aperture).toBe(2)
        expect(lens1.cropFactor).toBe(1)

        expect(lens2.focalLength).toBe(35)
        expect(lens2.aperture).toBe(2)
        expect(lens2.cropFactor).toBe(1)
    })

    test('creates lenses with custom default settings', () => {
        const lensMaker = createLensMaker({ focalLength: 55, aperture: 'f/3.4', cropFactor: 3 })
        const lens1 = lensMaker()
        const lens2 = lensMaker()

        expect(lens1.focalLength).toBe(55)
        expect(lens1.aperture).toBe(3.363586)
        expect(lens1.cropFactor).toBe(3)

        expect(lens2.focalLength).toBe(55)
        expect(lens2.aperture).toBe(3.363586)
        expect(lens2.cropFactor).toBe(3)
    })

    test('creates lenses with custom default settings, and keeps specific options passed to each lens', () => {
        const lensMaker = createLensMaker({ focalLength: 55, aperture: 'f/3.4', cropFactor: 3 })
        const lens1 = lensMaker({ focalLength: 65 })
        const lens2 = lensMaker({ aperture: 'f/5' })

        expect(lens1.focalLength).toBe(65) // uses the option
        expect(lens1.aperture).toBe(3.363586) // uses the custom default
        expect(lens1.cropFactor).toBe(3) // uses the custom default

        expect(lens2.focalLength).toBe(55) // uses the custom default
        expect(lens2.aperture).toBe(5.039684) // uses the option
        expect(lens2.cropFactor).toBe(3) // uses the custom default
    })
})
