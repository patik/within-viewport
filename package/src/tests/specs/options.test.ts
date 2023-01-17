import { Side, SideOption } from 'src/common/common.types'
import { SyncOptions } from 'src/sync/sync.types'
import { getConfig as getConfigSync } from '../../sync/options'

const arbitraryDiv = document.createElement('div')
document.body.appendChild(arbitraryDiv)

const userOptionsTestCases: Array<{
    value: undefined | Side | SideOption | Partial<SyncOptions>
    name: string
    result: { sides: Array<Side>; container: HTMLElement | Window }
}> = [
    { name: 'undefined', value: undefined, result: { sides: ['all'], container: window } },
    { name: 'empty object', value: {}, result: { sides: ['all'], container: window } },
    { name: '`left`', value: 'left', result: { sides: ['left'], container: window } },
    { name: '`right bottom`', value: 'right bottom', result: { sides: ['right', 'bottom'], container: window } },
    {
        name: 'container is an arbitary div',
        value: { container: arbitraryDiv },
        result: { sides: ['all'], container: arbitraryDiv },
    },
]

describe.each(userOptionsTestCases)('Synchronous getConfig', (userOptions) => {
    describe.each([document.body, arbitraryDiv])(`user options: ${userOptions.name}`, (targetElem) => {
        test.only(`target elem: ${targetElem?.nodeName}`, () => {
            const result = getConfigSync(arbitraryDiv, userOptions.value)

            // DOM elements cannot be part of an assertion statement because they're not JSON-able, so they are tested separately within each test
            expect(result.container).toStrictEqual(userOptions.result.container)
            expect(result).toStrictEqual({
                ...userOptions.result,
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            })
        })
    })
})
