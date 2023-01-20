import { cloneDeep } from 'lodash'
import { AsyncConfig, getConfig, SyncConfig } from '../../common/options'
import { MultipleSides, Side, UserOptions } from '../../common/types'

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
        userOptions: { container: fakeBody },
        result: { top: 0, right: 0, bottom: 0, left: 0, container: window },
    },
    {
        name: 'container is an arbitary div',
        userOptions: { container: arbitraryFakeDiv },
        result: { top: 0, right: 0, bottom: 0, left: 0, container: arbitraryFakeDiv },
    },
    {
        name: 'sides=left; container is an arbitary div',
        userOptions: { top: 'ignore', right: 'ignore', bottom: 'ignore', left: 0, container: arbitraryFakeDiv },
        result: { top: 'ignore', right: 'ignore', bottom: 'ignore', left: 0, container: arbitraryFakeDiv },
    },
    {
        name: 'sides=right,bottom; container is an arbitary div',
        userOptions: { top: 'ignore', right: 0, bottom: 0, left: 'ignore', container: arbitraryFakeDiv },
        result: { top: 'ignore', right: 0, bottom: 0, left: 'ignore', container: arbitraryFakeDiv },
    },
]

describe.each(syncTestCases)('Synchronous getConfig', (testCase) => {
    describe.each([fakeBody, arbitraryFakeDiv])(`user options: ${testCase.name}`, (targetElem) => {
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
        userOptions: { container: fakeBody },
        result: { top: 0, right: 0, bottom: 0, left: 0, container: document },
    },
    {
        name: 'container is an arbitary div',
        userOptions: { container: arbitraryFakeDiv },
        result: { top: 0, right: 0, bottom: 0, left: 0, container: arbitraryFakeDiv },
    },
    {
        name: 'sides=left; container is an arbitary div',
        userOptions: { top: 'ignore', right: 'ignore', bottom: 'ignore', left: 0, container: arbitraryFakeDiv },
        result: { top: 'ignore', right: 'ignore', bottom: 'ignore', left: 0, container: arbitraryFakeDiv },
    },
    {
        name: 'sides=right,bottom; container is an arbitary div',
        userOptions: { top: 'ignore', right: 0, bottom: 0, left: 'ignore', container: arbitraryFakeDiv },
        result: { top: 'ignore', right: 0, bottom: 0, left: 'ignore', container: arbitraryFakeDiv },
    },
]

describe.each(asyncTestCases)('Asynchronous getConfig', (testCase) => {
    describe.each([fakeBody, arbitraryFakeDiv])(`user options: ${testCase.name}`, (targetElem) => {
        test(`target elem: ${targetElem.nodeName}`, () => {
            const result = getConfig('async', targetElem, testCase.userOptions)

            expect(result).toStrictEqual(testCase.result)
        })
    })
})
