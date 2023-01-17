import { cloneDeep } from 'lodash'
import { Side, SideOption } from '../../common/common.types'
import { SyncOptions } from '../../sync/sync.types'
import { getConfig as getConfigSync } from '../../sync/options'

const arbitraryDiv = document.createElement('div')
document.body.appendChild(arbitraryDiv)
const body = cloneDeep(document.body)

const userOptionsTestCases: Array<{
    value: undefined | Side | SideOption | Partial<SyncOptions>
    name: string
    result: { sides: Array<Side>; container: HTMLElement | Window | { nodeName: string } }
}> = [
    // { name: 'undefined', value: undefined, result: { sides: ['all'], container: window } },
    // { name: '`left`', value: 'left', result: { sides: ['left'], container: window } },
    // { name: '`right bottom`', value: 'right bottom', result: { sides: ['right', 'bottom'], container: window } },
    {
        name: 'container is the body',
        value: { container: body },
        result: { sides: ['all'], container: body },
    },
    // {
    //     name: 'container is an arbitary div',
    //     value: { container: arbitraryDiv },
    //     result: { sides: ['all'], container: arbitraryDiv },
    // },
    // {
    //     name: 'sides=left; container is an arbitary div',
    //     value: { sides: ['left'], container: arbitraryDiv },
    //     result: { sides: ['left'], container: arbitraryDiv },
    // },
    // {
    //     name: 'sides=right,bottom; container is an arbitary div',
    //     value: { sides: ['right', 'bottom'], container: arbitraryDiv },
    //     result: { sides: ['right', 'bottom'], container: arbitraryDiv },
    // },
]

describe.each(userOptionsTestCases)('Synchronous getConfig', (userOptions) => {
    describe.each([body, arbitraryDiv])(`user options: ${userOptions.name}`, (targetElem) => {
        test.only(`target elem: ${targetElem?.nodeName}`, () => {
            const result = getConfigSync(arbitraryDiv, userOptions.value)

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
