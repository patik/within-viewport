import { cloneDeep } from 'lodash'
import { Side, SideOption } from '../../common/common.types'
import { SyncOptions } from '../../sync/sync.types'
import { getConfig as getConfigSync } from '../../sync/options'
import { getConfig as getConfigAsync } from '../../async/options'
import { AsyncOptions } from '../../async/async.types'

const div = document.createElement('div')
document.body.appendChild(div)

// It seems to be problematic to use the actual `document.body` value within Jest, especially because it's not JSON-able (i.e. by some of the assertion methods), so we make a sort of fake version that is sufficient to test the code.
const arbitraryFakeDiv = {
    ...cloneDeep(div),
    nodeName: 'DIV',
}
const fakeBody = {
    ...cloneDeep(document.body), // This likely produces `{}`, so add `nodeName` to make it look like the actual body
    nodeName: 'BODY',
}

const syncTestCases: Array<{
    userOptions: undefined | Side | SideOption | Partial<SyncOptions>
    name: string
    result: { sides: Array<Side>; container: HTMLElement | Window | { nodeName: string } }
}> = [
    { name: 'undefined', userOptions: undefined, result: { sides: ['all'], container: window } },
    { name: '`left`', userOptions: 'left', result: { sides: ['left'], container: window } },
    { name: '`right bottom`', userOptions: 'right bottom', result: { sides: ['right', 'bottom'], container: window } },
    {
        name: 'container is the body',
        userOptions: { container: fakeBody },
        result: { sides: ['all'], container: window },
    },
    {
        name: 'container is an arbitary div',
        userOptions: { container: arbitraryFakeDiv },
        result: { sides: ['all'], container: arbitraryFakeDiv },
    },
    {
        name: 'sides=left; container is an arbitary div',
        userOptions: { sides: ['left'], container: arbitraryFakeDiv },
        result: { sides: ['left'], container: arbitraryFakeDiv },
    },
    {
        name: 'sides=right,bottom; container is an arbitary div',
        userOptions: { sides: ['right', 'bottom'], container: arbitraryFakeDiv },
        result: { sides: ['right', 'bottom'], container: arbitraryFakeDiv },
    },
]

describe.each(syncTestCases)('Synchronous getConfig', (testCase) => {
    describe.each([fakeBody, arbitraryFakeDiv])(`user options: ${testCase.name}`, (targetElem) => {
        test(`target elem: ${targetElem?.nodeName}`, () => {
            const result = getConfigSync(arbitraryFakeDiv, testCase.userOptions)

            expect(result).toStrictEqual({
                ...testCase.result,
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            })
        })
    })
})

const asyncTestCases: Array<{
    userOptions: undefined | Side | SideOption | Partial<AsyncOptions>
    name: string
    result: { sides: Array<Side>; container: HTMLElement | Window | { nodeName: string } }
}> = [
    { name: 'undefined', userOptions: undefined, result: { sides: ['all'], container: document.body } },
    { name: '`left`', userOptions: 'left', result: { sides: ['left'], container: document.body } },
    {
        name: '`right bottom`',
        userOptions: 'right bottom',
        result: { sides: ['right', 'bottom'], container: document.body },
    },
    {
        name: 'container is the body',
        userOptions: { container: fakeBody },
        result: { sides: ['all'], container: document.body },
    },
    {
        name: 'container is an arbitary div',
        userOptions: { container: arbitraryFakeDiv },
        result: { sides: ['all'], container: arbitraryFakeDiv },
    },
    {
        name: 'sides=left; container is an arbitary div',
        userOptions: { sides: ['left'], container: arbitraryFakeDiv },
        result: { sides: ['left'], container: arbitraryFakeDiv },
    },
    {
        name: 'sides=right,bottom; container is an arbitary div',
        userOptions: { sides: ['right', 'bottom'], container: arbitraryFakeDiv },
        result: { sides: ['right', 'bottom'], container: arbitraryFakeDiv },
    },
]

describe.each(asyncTestCases)('Asynchronous getConfig', (testCase) => {
    describe.each([fakeBody, arbitraryFakeDiv])(`user options: ${testCase.name}`, (targetElem) => {
        test(`target elem: ${targetElem?.nodeName}`, () => {
            const result = getConfigAsync(arbitraryFakeDiv, testCase.userOptions)

            expect(result).toStrictEqual({
                ...testCase.result,
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            })
        })
    })
})
