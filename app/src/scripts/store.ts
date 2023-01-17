import { createStore } from 'zustand/vanilla'
import { Config } from '../../../package/src/common/types'

interface State {
    $boxes: HTMLElement[]
    $codeOutput: HTMLElement | Element
    boundaries: Omit<Config, 'container'> // Just the boundaries
    // Which version of `withinViewport` should be called
    methodType: 'async' | 'sync'

    // These represent the (singular) container that we're using as the viewport. If it's some DOM element, these values are both the same. But if it's the whole window, then we need to use either `window` or `document.body` for certain tasks, hence the two separate variables.
    containerForDOM: HTMLElement
    containerForEvents: HTMLElement | Window
}

export default createStore<State>()(() => ({
    containerForDOM: document.body,
    containerForEvents: window,
    $codeOutput: document.body.lastElementChild ?? document.body,
    $boxes: [],
    methodType: 'async',
    boundaries: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
}))
