import { withinViewport } from './sync/index.js'

export { withinViewportAsync } from './async/index.js'
export { withinViewport } from './sync/index.js'
export * from './shortcuts.js'

const global = (function (scope) {
    if (typeof self !== 'undefined') {
        return self
    }
    if (typeof window !== 'undefined') {
        return window
    }

    return scope
})(this)

async function setupJquery() {
    if (!global) {
        return
    }

    const setupJQueryPlugin = (await import('./jquery/plugin.js')) as unknown as (jQuery: unknown) => void

    if (typeof setupJQueryPlugin === 'function') {
        if ('jQuery' in global) {
            setupJQueryPlugin(global.jQuery)
        } else if ('$' in global) {
            setupJQueryPlugin(global.$)
        }
    }
}

setupJquery()

/**
 * Temporary shim for the old function name—please switch to the camelCase `withinViewport` name.
 *
 * @deprecated
 */
export function withinviewport(...args: Parameters<typeof withinViewport>) {
    const result = withinViewport(...args)

    try {
        // Some *really* old browsers don't have a console
        console.error(
            'The lowercase name `withinviewport` is deprecated. Instead, use the camelCase name `withinViewport`.',
        )
    } catch (e) {
        //
    }

    return result
}
