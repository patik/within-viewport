import { AsyncConfig, getConfig, SyncConfig } from '../../common/options'
import { MultipleSides, Side, UserOptions } from '../../common/types'

const div = document.createElement('div')
document.body.appendChild(div)

const syncTestCases: Array<{
    userOptions: undefined | Side | MultipleSides | Partial<UserOptions>
    name: string
    result: SyncConfig // Boundaries & { container: HTMLElement | Window | { nodeName: string } }
}> = [
    {
        name: 'undefined',
        userOptions: undefined,
        result: { top: 0, right: 0, bottom: 0, left: 0, container: window },
    },
    {
        name: '`left`',
        userOptions: 'left',
        result: { top: 'ignore', right: 'ignore', bottom: 'ignore', left: 0, container: window },
    },
    {
        name: '`right bottom`',
        userOptions: 'right bottom',
        result: { top: 'ignore', right: 0, bottom: 0, left: 'ignore', container: window },
    },
    {
        name: 'container is the body',
        userOptions: { container: document.body },
        result: { top: 0, right: 0, bottom: 0, left: 0, container: window },
    },
    {
        name: 'container is an arbitary div',
        userOptions: { container: document.createElement('div') },
        result: { top: 0, right: 0, bottom: 0, left: 0, container: document.createElement('div') },
    },
    {
        name: 'sides=left; container is an arbitary div',
        userOptions: {
            top: 'ignore',
            right: 'ignore',
            bottom: 'ignore',
            left: 0,
            container: document.createElement('div'),
        },
        result: { top: 'ignore', right: 'ignore', bottom: 'ignore', left: 0, container: document.createElement('div') },
    },
    {
        name: 'sides=right,bottom; container is an arbitary div',
        userOptions: { top: 'ignore', right: 0, bottom: 0, left: 'ignore', container: document.createElement('div') },
        result: { top: 'ignore', right: 0, bottom: 0, left: 'ignore', container: document.createElement('div') },
    },
]

describe.each(syncTestCases)('Synchronous getConfig', (testCase) => {
    describe.each([document.body, document.createElement('div')])(`user options: ${testCase.name}`, (targetElem) => {
        test(`target elem: ${targetElem.nodeName}`, () => {
            const result = getConfig('sync', targetElem, testCase.userOptions)

            expect(result).toStrictEqual(testCase.result)
        })
    })
})

const asyncTestCases: Array<{
    userOptions: undefined | Side | MultipleSides | Partial<UserOptions>
    name: string
    result: AsyncConfig
}> = [
    {
        name: 'undefined',
        userOptions: undefined,
        result: { top: 0, right: 0, bottom: 0, left: 0, container: document },
    },
    {
        name: '`left`',
        userOptions: 'left',
        result: { top: 'ignore', right: 'ignore', bottom: 'ignore', left: 0, container: document },
    },
    {
        name: '`right bottom`',
        userOptions: 'right bottom',
        result: { top: 'ignore', right: 0, bottom: 0, left: 'ignore', container: document },
    },
    {
        name: 'container is the body',
        userOptions: { container: document.body },
        result: { top: 0, right: 0, bottom: 0, left: 0, container: document },
    },
    {
        name: 'container is an arbitary div',
        userOptions: { container: document.createElement('div') },
        result: { top: 0, right: 0, bottom: 0, left: 0, container: document.createElement('div') },
    },
    {
        name: 'sides=left; container is an arbitary div',
        userOptions: {
            top: 'ignore',
            right: 'ignore',
            bottom: 'ignore',
            left: 0,
            container: document.createElement('div'),
        },
        result: { top: 'ignore', right: 'ignore', bottom: 'ignore', left: 0, container: document.createElement('div') },
    },
    {
        name: 'sides=right,bottom; container is an arbitary div',
        userOptions: { top: 'ignore', right: 0, bottom: 0, left: 'ignore', container: document.createElement('div') },
        result: { top: 'ignore', right: 0, bottom: 0, left: 'ignore', container: document.createElement('div') },
    },
]

describe.each(asyncTestCases)('Asynchronous getConfig', (testCase) => {
    describe.each([document.body, document.createElement('div')])(`user options: ${testCase.name}`, (targetElem) => {
        test(`target elem: ${targetElem.nodeName}`, () => {
            const result = getConfig('async', targetElem, testCase.userOptions)

            expect(result).toStrictEqual(testCase.result)
        })
    })
})

describe('Other getConfig use cases', () => {
    describe(`Throws an error when HTML element is missing or invalid`, () => {
        describe(`No element provided`, () => {
            test(`Synchronous getConfig, without options`, () => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore We want this to be a type error, but let's test it anyway
                expect(() => getConfig('sync')).toThrowError('First argument must be an element')
            })

            test(`Synchronous getConfig, with options`, () => {
                expect(() =>
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore We want this to be a type error, but let's test it anyway
                    getConfig('sync', undefined, {
                        top: 'ignore',
                        right: 'ignore',
                        bottom: 'ignore',
                        left: 0,
                        container: document.createElement('div'),
                    }),
                ).toThrowError('First argument must be an element')
            })

            test(`Asynchronous getConfig, without options`, () => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore We want this to be a type error, but let's test it anyway
                expect(() => getConfig('async')).toThrowError('First argument must be an element')
            })

            test(`Asynchronous getConfig, with options`, () => {
                expect(() =>
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore We want this to be a type error, but let's test it anyway
                    getConfig('async', undefined, {
                        top: 'ignore',
                        right: 'ignore',
                        bottom: 'ignore',
                        left: 0,
                        container: document.createElement('div'),
                    }),
                ).toThrowError('First argument must be an element')
            })
        })

        describe.each([document.createComment('alpha'), document.createTextNode('bravo')])(
            `Wrong type of element`,
            (badElement) => {
                describe.each(['sync', 'async'])(`${badElement.nodeName} node`, (configType) => {
                    test(`${configType}ronous getConfig, without options`, () => {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore We want this to be a type error, but let's test it anyway
                        expect(() => getConfig(configType, badElement)).toThrowError(
                            'First argument must be an element',
                        )
                    })

                    test(`${configType}, synchronous getConfig, with options`, () => {
                        expect(() =>
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore We want this to be a type error, but let's test it anyway
                            getConfig(configType, badElement, {
                                top: 'ignore',
                                right: 'ignore',
                                bottom: 'ignore',
                                left: 0,
                                container: document.createElement('div'),
                            }),
                        ).toThrowError('First argument must be an element')
                    })
                })
            },
        )
    })
})
