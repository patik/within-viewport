import { createStore } from 'zustand/vanilla'
import { Side } from '../../../package/src/common/common.types'

interface State {
    wvOptions: Record<Side, number>
    $boxes: HTMLElement[]
    sideStrategy: 'all' | 'independent'
    method: 'async' | 'sync'

    // This is the container that we're using as the viewport. If it's some DOM element, these are both the same. But if it's the whole window, then we need to use either `window` or `document.body` for certain tasks.
    containerForDOM: HTMLElement
    containerForEvents: Window | HTMLElement
}

export default createStore<State>()(() => ({
    containerForDOM: document.body,
    containerForEvents: window,
    $boxes: [],
    sideStrategy: 'all',
    method: 'async',
    wvOptions: {
        all: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
}))
