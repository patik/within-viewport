import { useEffect } from 'react'
import useDoFStore from '../store'
import storage from './storage'
import { getNonPlaceholderLenses } from './useWriteToHash'

/**
 * Writes the state to local storage whenever it changes
 */
export function useWriteToStorage(hasReadFromStorage: boolean) {
    const { extractForLocalStorage } = useDoFStore()
    const state = extractForLocalStorage()

    useEffect(() => {
        if (!hasReadFromStorage || typeof window === 'undefined') {
            return
        }

        async function writeData() {
            const lenses = getNonPlaceholderLenses(useDoFStore.getState().lenses)

            await storage.setItem(
                JSON.stringify({
                    state: {
                        ...state,
                        lenses,
                    },
                    version: 0,
                })
            )
        }

        writeData()
    }, [hasReadFromStorage, state])
}
