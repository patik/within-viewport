import { parseHash } from './useReadFromHash'

/**
 * @example https://patik.com/dof/#20,m;Lens%201,35,f-2,APSC;Lens%202,35,f-2,full;Lens%203,35,f-2,APSC;Lens%204,35,f-2,APSC;Lens%205,35,f-2,APSC
 */
describe('parseHash', () => {
    describe.each(['metric', 'imperial'])('URLs with units', (units) => {
        test('with ones lens', () => {
            // Note that `depthOfField` and `id` are not part of the hash -- they're calculated by the app at runtime -- so we extract those values from `parseHash()` and manually add them below for the sake of the test
            // The spirit of the test is to verify the parsing of the values in the string
            const result = parseHash(`20,${units.charAt(0)};Alpha%20Bravo,35,f-2,mft`)

            expect(result).toStrictEqual({
                distance: 20,
                units,
                lenses: [
                    {
                        name: 'Alpha Bravo',
                        focalLength: 35,
                        aperture: 'f/2',
                        sensorKey: 'mft',
                        depthOfField: result.lenses[0].depthOfField,
                        id: result.lenses[0].id,
                    },
                ],
            })
        })

        test('with four lenses', () => {
            const result = parseHash(
                `20,${units.charAt(
                    0
                )};Lens%201,35,f-2,APSC;Lens%203,55,f-5,APSC;Lens%204,20,f-3.6,full;Lens%205,35,f-2,mft`
            )

            expect(result).toStrictEqual({
                distance: 20,
                units,
                lenses: [
                    {
                        name: 'Lens 1',
                        focalLength: 35,
                        aperture: 'f/2',
                        sensorKey: 'APSC',
                        depthOfField: result.lenses[0].depthOfField,
                        id: result.lenses[0].id,
                    },
                    {
                        name: 'Lens 3',
                        focalLength: 55,
                        aperture: 'f/5',
                        sensorKey: 'APSC',
                        depthOfField: result.lenses[1].depthOfField,
                        id: result.lenses[1].id,
                    },
                    {
                        name: 'Lens 4',
                        focalLength: 20,
                        aperture: 'f/3.6',
                        sensorKey: 'full',
                        depthOfField: result.lenses[2].depthOfField,
                        id: result.lenses[2].id,
                    },
                    {
                        name: 'Lens 5',
                        focalLength: 35,
                        aperture: 'f/2',
                        sensorKey: 'mft',
                        depthOfField: result.lenses[3].depthOfField,
                        id: result.lenses[3].id,
                    },
                ],
            })
        })

        test('with no distance', () => {
            const result = parseHash('Alpha%20Bravo,35,f-2,mft')

            expect(result).toStrictEqual({
                distance: 5,
                units: 'metric',
                lenses: [],
            })
        })

        test('with empty distance value', () => {
            const result = parseHash(';Alpha%20Bravo,35,f-2,mft')

            expect(result).toStrictEqual({
                distance: 5,
                units: 'metric',
                lenses: [
                    {
                        name: 'Alpha Bravo',
                        focalLength: 35,
                        aperture: 'f/2',
                        sensorKey: 'mft',
                        depthOfField: result.lenses[0].depthOfField,
                        id: result.lenses[0].id,
                    },
                ],
            })
        })

        test('with an invalid distance', () => {
            const result = parseHash('wrwerwer;Alpha%20Bravo,35,f-2,mft')

            expect(result).toStrictEqual({
                distance: 5,
                units: 'metric',
                lenses: [
                    {
                        name: 'Alpha Bravo',
                        focalLength: 35,
                        aperture: 'f/2',
                        sensorKey: 'mft',
                        depthOfField: result.lenses[0].depthOfField,
                        id: result.lenses[0].id,
                    },
                ],
            })
        })
    })

    describe('Legacy URLs without units should all default to imperial if a valid distance was found', () => {
        test('with ones lens', () => {
            // Note that `depthOfField` and `id` are not part of the hash -- they're calculated by the app at runtime -- so we extract those values from `parseHash()` and manually add them below for the sake of the test
            // The spirit of the test is to verify the parsing of the values in the string
            const result = parseHash('20;Alpha%20Bravo,35,f-2,mft')

            expect(result).toStrictEqual({
                distance: 20,
                units: 'imperial',
                lenses: [
                    {
                        name: 'Alpha Bravo',
                        focalLength: 35,
                        aperture: 'f/2',
                        sensorKey: 'mft',
                        depthOfField: result.lenses[0].depthOfField,
                        id: result.lenses[0].id,
                    },
                ],
            })
        })

        test('with four lenses', () => {
            const result = parseHash(
                '20;Lens%201,35,f-2,APSC;Lens%203,55,f-5,APSC;Lens%204,20,f-3.6,full;Lens%205,35,f-2,mft'
            )

            expect(result).toStrictEqual({
                distance: 20,
                units: 'imperial',
                lenses: [
                    {
                        name: 'Lens 1',
                        focalLength: 35,
                        aperture: 'f/2',
                        sensorKey: 'APSC',
                        depthOfField: result.lenses[0].depthOfField,
                        id: result.lenses[0].id,
                    },
                    {
                        name: 'Lens 3',
                        focalLength: 55,
                        aperture: 'f/5',
                        sensorKey: 'APSC',
                        depthOfField: result.lenses[1].depthOfField,
                        id: result.lenses[1].id,
                    },
                    {
                        name: 'Lens 4',
                        focalLength: 20,
                        aperture: 'f/3.6',
                        sensorKey: 'full',
                        depthOfField: result.lenses[2].depthOfField,
                        id: result.lenses[2].id,
                    },
                    {
                        name: 'Lens 5',
                        focalLength: 35,
                        aperture: 'f/2',
                        sensorKey: 'mft',
                        depthOfField: result.lenses[3].depthOfField,
                        id: result.lenses[3].id,
                    },
                ],
            })
        })

        test('with no distance', () => {
            const result = parseHash('Alpha%20Bravo,35,f-2,mft')

            expect(result).toStrictEqual({
                distance: 5,
                units: 'metric',
                lenses: [],
            })
        })

        test('with empty distance value', () => {
            const result = parseHash(';Alpha%20Bravo,35,f-2,mft')

            expect(result).toStrictEqual({
                distance: 5,
                units: 'metric',
                lenses: [
                    {
                        name: 'Alpha Bravo',
                        focalLength: 35,
                        aperture: 'f/2',
                        sensorKey: 'mft',
                        depthOfField: result.lenses[0].depthOfField,
                        id: result.lenses[0].id,
                    },
                ],
            })
        })

        test('with an invalid distance', () => {
            const result = parseHash('wrwerwer;Alpha%20Bravo,35,f-2,mft')

            expect(result).toStrictEqual({
                distance: 5,
                units: 'metric',
                lenses: [
                    {
                        name: 'Alpha Bravo',
                        focalLength: 35,
                        aperture: 'f/2',
                        sensorKey: 'mft',
                        depthOfField: result.lenses[0].depthOfField,
                        id: result.lenses[0].id,
                    },
                ],
            })
        })
    })
})
