import { combineSettings } from './combineSettings'

describe('combineSettings', () => {
    describe('no options provided, and no custom default options', () => {
        test('custom default options are undefined', () => {
            expect(combineSettings({})).toStrictEqual({
                focalLength: 35,
                aperture: 2,
                cropFactor: 1,
                id: undefined,
            })
        })

        test('custom default options are an empty object', () => {
            expect(combineSettings({}, {})).toStrictEqual({
                focalLength: 35,
                aperture: 2,
                cropFactor: 1,
                id: undefined,
            })
        })
    })

    describe('no options provided, with custom default options', () => {
        test('focalLength only', () => {
            expect(
                combineSettings(
                    {},
                    {
                        focalLength: 40,
                    }
                )
            ).toStrictEqual({
                focalLength: 40,
                aperture: 2,
                cropFactor: 1,
                id: undefined,
            })
        })

        test('aperture only', () => {
            expect(
                combineSettings(
                    {},
                    {
                        aperture: 'f/3.4',
                    }
                )
            ).toStrictEqual({
                focalLength: 35,
                aperture: 3.363586,
                cropFactor: 1,
                id: undefined,
            })
        })

        test('cropFactor only', () => {
            expect(
                combineSettings(
                    {},
                    {
                        aperture: 'f/2',
                        cropFactor: 2,
                    }
                )
            ).toStrictEqual({
                focalLength: 35,
                aperture: 2,
                cropFactor: 2,
                id: undefined,
            })
        })

        test('id only', () => {
            expect(
                combineSettings(
                    {},
                    {
                        id: 'foo',
                    }
                )
            ).toStrictEqual({
                focalLength: 35,
                aperture: 2,
                cropFactor: 1,
                id: 'foo',
            })
        })

        test('all options', () => {
            expect(
                combineSettings(
                    {},
                    {
                        focalLength: 40,
                        aperture: 'f/3.4',
                        cropFactor: 2,
                        id: 'foo',
                    }
                )
            ).toStrictEqual({
                focalLength: 40,
                aperture: 3.363586,
                cropFactor: 2,
                id: 'foo',
            })
        })
    })

    describe('with options provided, but not default options', () => {
        describe('options are undefined', () => {
            test('focalLength only', () => {
                expect(
                    combineSettings({
                        focalLength: 40,
                    })
                ).toStrictEqual({
                    focalLength: 40,
                    aperture: 2,
                    cropFactor: 1,
                    id: undefined,
                })
            })

            test('aperture only', () => {
                expect(
                    combineSettings({
                        aperture: 'f/3.4',
                    })
                ).toStrictEqual({
                    focalLength: 35,
                    aperture: 3.363586,
                    cropFactor: 1,
                    id: undefined,
                })
            })

            test('cropFactor only', () => {
                expect(
                    combineSettings({
                        cropFactor: 2,
                    })
                ).toStrictEqual({
                    focalLength: 35,
                    aperture: 2,
                    cropFactor: 2,
                    id: undefined,
                })
            })

            test('id only', () => {
                expect(
                    combineSettings({
                        id: 'foo',
                    })
                ).toStrictEqual({
                    focalLength: 35,
                    aperture: 2,
                    cropFactor: 1,
                    id: 'foo',
                })
            })

            test('all options', () => {
                expect(
                    combineSettings({
                        focalLength: 40,
                        aperture: 'f/3.4',
                        cropFactor: 2,
                        id: 'foo',
                    })
                ).toStrictEqual({
                    focalLength: 40,
                    aperture: 3.363586,
                    cropFactor: 2,
                    id: 'foo',
                })
            })
        })

        describe('options are an empty object', () => {
            test('focalLength only', () => {
                expect(
                    combineSettings(
                        {
                            focalLength: 40,
                        },
                        {}
                    )
                ).toStrictEqual({
                    focalLength: 40,
                    aperture: 2,
                    cropFactor: 1,
                    id: undefined,
                })
            })

            test('aperture only', () => {
                expect(
                    combineSettings(
                        {
                            aperture: 'f/3.4',
                        },
                        {}
                    )
                ).toStrictEqual({
                    focalLength: 35,
                    aperture: 3.363586,
                    cropFactor: 1,
                    id: undefined,
                })
            })

            test('cropFactor only', () => {
                expect(
                    combineSettings(
                        {
                            cropFactor: 2,
                        },
                        {}
                    )
                ).toStrictEqual({
                    focalLength: 35,
                    aperture: 2,
                    cropFactor: 2,
                    id: undefined,
                })
            })

            test('id only', () => {
                expect(
                    combineSettings(
                        {
                            id: 'foo',
                        },
                        {}
                    )
                ).toStrictEqual({
                    focalLength: 35,
                    aperture: 2,
                    cropFactor: 1,
                    id: 'foo',
                })
            })

            test('all options', () => {
                expect(
                    combineSettings(
                        {
                            focalLength: 40,
                            aperture: 'f/3.4',
                            cropFactor: 2,
                            id: 'foo',
                        },
                        {}
                    )
                ).toStrictEqual({
                    focalLength: 40,
                    aperture: 3.363586,
                    cropFactor: 2,
                    id: 'foo',
                })
            })
        })
    })

    describe('with options provided, and with default options', () => {
        test('focalLength only', () => {
            expect(
                combineSettings(
                    {
                        focalLength: 40,
                    },
                    {
                        focalLength: 50,
                    }
                )
            ).toStrictEqual({
                focalLength: 40,
                aperture: 2,
                cropFactor: 1,
                id: undefined,
            })
        })

        test('aperture only', () => {
            expect(
                combineSettings(
                    {
                        aperture: 'f/3.4',
                    },
                    {
                        aperture: 'f/4',
                    }
                )
            ).toStrictEqual({
                focalLength: 35,
                aperture: 3.363586,
                cropFactor: 1,
                id: undefined,
            })
        })

        test('cropFactor only', () => {
            expect(
                combineSettings(
                    {
                        cropFactor: 2,
                    },
                    {
                        cropFactor: 3,
                    }
                )
            ).toStrictEqual({
                focalLength: 35,
                aperture: 2,
                cropFactor: 2,
                id: undefined,
            })
        })

        test('id only', () => {
            expect(
                combineSettings(
                    {
                        id: 'foo',
                    },
                    {
                        id: 'bar',
                    }
                )
            ).toStrictEqual({
                focalLength: 35,
                aperture: 2,
                cropFactor: 1,
                id: 'foo',
            })
        })

        test('all options', () => {
            expect(
                combineSettings(
                    {
                        focalLength: 40,
                        aperture: 'f/3.4',
                        cropFactor: 2,
                        id: 'foo',
                    },
                    {
                        focalLength: 50,
                        aperture: 'f/4',
                        cropFactor: 3,
                        id: 'bar',
                    }
                )
            ).toStrictEqual({
                focalLength: 40,
                aperture: 3.363586,
                cropFactor: 2,
                id: 'foo',
            })
        })
    })
})
