import { Lens as SrcLens } from './Lens'
import { Lens as BuildLens } from 'dof'

describe.each([SrcLens, BuildLens])('Class basics [%#]', (Lens) => {
    test('constructor will create an object with the default settings', () => {
        const lens = new Lens()

        expect(lens.focalLength).toBe(35)
        expect(lens.aperture).toBe(2)
        expect(lens.cropFactor).toBe(1)
    })

    test('constructor will create an object with the provided settings', () => {
        const lens = new Lens({
            focalLength: 40,
            aperture: 'f/2.5',
            cropFactor: 1.62,
            id: 'ab cd',
        })

        expect(lens.focalLength).toBe(40)
        expect(lens.aperture).toBe(2.519842)
        expect(lens.cropFactor).toBe(1.62)
        expect(lens.id).toBe('ab cd')
    })

    test('when an unknown aperture is given, the default is used instead', () => {
        const lens = new Lens({
            aperture: 'f/3.5',
        })

        expect(lens.aperture).toBe(2)

        expect(lens.focalLength).toBe(35)
        expect(lens.cropFactor).toBe(1)
        expect(lens.id).toBeUndefined()
    })

    test('default settings are used if no options are provided, otherwise the options are used', () => {
        const lens1 = new Lens()
        const lens2 = new Lens({ focalLength: 40, aperture: 'f/3.4', cropFactor: 1.62 })

        expect(lens1.focalLength).toBe(35)
        expect(lens1.aperture).toBe(2)
        expect(lens1.cropFactor).toBe(1)

        expect(lens2.focalLength).toBe(40)
        expect(lens2.aperture).toBe(3.363586)
        expect(lens2.cropFactor).toBe(1.62)
    })
})

describe.each([SrcLens, BuildLens])('Calculating the depth of field [%#]', (Lens) => {
    describe('with the default distance', () => {
        test('metric units (5 meters)', () => {
            const lens = new Lens()
            const result = lens.dof()

            expect(result.dof).toBe(2.584690961719362)
            expect(result.dof.toString()).toBe('2.584690961719362')
            expect(result.toString()).toBe('2.584690961719362')

            expect(result.eighthDof).toBe(0.32308637021492026)
            expect(result.eighthDof.toString()).toBe('0.32308637021492026')

            expect(result.hf).toBe(20.451666666666668)
            expect(result.hf.toString()).toBe('20.451666666666668')

            expect(result.near).toBe(4.021931840567339)
            expect(result.near.toString()).toBe('4.021931840567339')

            expect(result.far).toBe(6.606622802286701)
            expect(result.far.toString()).toBe('6.606622802286701')

            expect(result.coc).toBe(0.03)
            expect(result.coc.toString()).toBe('0.03')
        })

        test('imperial units (15 feet)', () => {
            const lens = new Lens()
            const result = lens.dof(undefined, true)

            expect(result.dof).toBe(7.012923816256398)
            expect(result.dof.toString()).toBe(`7.012923816256398`)
            expect(result.toString()).toBe(`7' 0.2"`)

            expect(result.eighthDof).toBe(0.8766154770320498)
            expect(result.eighthDof.toString()).toBe('0.8766154770320498')

            expect(result.hf).toBe(67.09864391951007)
            expect(result.hf.toString()).toBe('67.09864391951007')

            expect(result.near).toBe(12.27274548830499)
            expect(result.near.toString()).toBe('12.27274548830499')

            expect(result.far).toBe(19.285669304561388)
            expect(result.far.toString()).toBe('19.285669304561388')

            expect(result.coc).toBe(0.03)
            expect(result.coc.toString()).toBe('0.03')
        })
    })

    describe('with a specific distance value', () => {
        test('metric units (meters), using a number', () => {
            const lens = new Lens()
            const result = lens.dof(15)

            expect(result.dof).toBe(47.51986889872889)
            expect(result.dof.toString()).toBe('47.51986889872889')
            expect(result.toString()).toBe('47.51986889872889')

            expect(result.eighthDof).toBe(5.939983612341111)
            expect(result.eighthDof.toString()).toBe('5.939983612341111')

            expect(result.hf).toBe(20.451666666666668)
            expect(result.hf.toString()).toBe('20.451666666666668')

            expect(result.near).toBe(8.655612605398275)
            expect(result.near.toString()).toBe('8.655612605398275')

            expect(result.far).toBe(56.17548150412716)
            expect(result.far.toString()).toBe('56.17548150412716')

            expect(result.coc).toBe(0.03)
            expect(result.coc.toString()).toBe('0.03')
        })

        test('imperial units (feet)', () => {
            const lens = new Lens()
            const result = lens.dof(25, true)

            expect(result.dof).toBe(21.549811571081538)
            expect(result.dof.toString()).toBe('21.549811571081538')
            expect(result.toString()).toBe(`21' 6.6"`)

            expect(result.eighthDof).toBe(2.693726446385192)
            expect(result.eighthDof.toString()).toBe('2.693726446385192')

            expect(result.hf).toBe(67.09864391951007)
            expect(result.hf.toString()).toBe('67.09864391951007')

            expect(result.near).toBe(18.22808166180584)
            expect(result.near.toString()).toBe('18.22808166180584')

            expect(result.far).toBe(39.77789323288738)
            expect(result.far.toString()).toBe('39.77789323288738')

            expect(result.coc).toBe(0.03)
            expect(result.coc.toString()).toBe('0.03')
        })
    })
})
