import { Boundaries } from '../../../package/src/common/types'
import store from './store'
import { highlightElement } from 'prismjs'
import 'prismjs/themes/prism-okaidia.min.css'

/**
 * Exposes type annotations to an Object.keys array
 */
function objectKeysArray<T extends Record<string | number, unknown>>(
    record: T,
): ((keyof T & string) | `${keyof T & number}`)[] {
    return Object.keys(record)
}

function getContainerName(elem: HTMLElement) {
    return `my${elem.nodeName.charAt(0)}${elem.nodeName.slice(1).toLowerCase()}`
}

type UserOptions = Partial<Boundaries & { container: string }>

// Cleanup some JSON stuff that wouldn't appear in regular JS
function getCleanJson(options: UserOptions) {
    return (
        JSON.stringify(options, null, '\t')

            // Values in the `sides` array
            .replace(/"(top|right|bottom|left)":/g, '$1:')
            // Right-hand side property names
            .replace(/"(sides|container|top|right|bottom|left)":/g, '$1:')
            //
            .replace(/"(top|right|bottom|left|ignore)"/g, `'$1'`)
            // Container element's var name
            .replace(/container:\s"(my\w+)"/g, `container: $1`)
    )
}

export function updateCodeOutput() {
    const { boundaries, methodType, $codeOutput, containerForDOM } = store.getState()
    const options: UserOptions = {}

    objectKeysArray(boundaries).forEach((side) => {
        if (boundaries[side] !== 0) {
            options[side] = boundaries[side]
        }
    })

    if (containerForDOM.nodeName !== 'BODY') {
        options.container = getContainerName(containerForDOM)
    }

    const methodName = `withinViewport${methodType === 'async' ? 'Async' : ''}`
    let optionsText = ''

    if (objectKeysArray(options).length > 0) {
        optionsText = `, ${getCleanJson(options)}`
    }

    $codeOutput.innerHTML = `${methodName}(elem${optionsText})`

    highlightElement($codeOutput)
}

export function updateBoundaryPreview() {
    const { boundaries, $boundaryPreview } = store.getState()

    const options: UserOptions = {}

    objectKeysArray(boundaries).forEach((side) => {
        if (boundaries[side] !== 0) {
            options[side] = boundaries[side]
        }
    })

    if (objectKeysArray(options).length > 0) {
        const text = getCleanJson(options)
            // Remove opening and closing braces
            .replace(/^\{|\}$/g, '')
            // Add units to numbers
            .replace(/(\d+)\b/g, '$1px')
            // Remove quotes around 'ignore'
            .replace(/'ignore'/g, 'ignore')

        $boundaryPreview.innerHTML = text
    } else {
        $boundaryPreview.innerHTML = `(defaults)`
    }
}
