import { useEffect, useState } from 'react'
import useDoFStore from '../store'
import storage from './storage'

/**
 * Reads the state from local storage
 */
export function useReadFromStorage() {
    const [hasStartedReading, setHasStartedReading] = useState(false)
    const [hasFinishedReading, setHasFinishedReading] = useState(false)
    const { addLens, applyFromLocalStorage } = useDoFStore()

    // Read from localStorage
    // Note that on Next.js dev server this hook will run twice which could cause duplicate lenses to be added to state
    useEffect(() => {
        if (hasStartedReading || hasFinishedReading || typeof window === 'undefined') {
            return
        }

        // Don't try to read more than once
        setHasStartedReading(true)

        async function fetchData() {
            const stored = await storage.getItem()
            const stateFromLocalStorage: LocalStorageData | null = stored ? JSON.parse(stored)?.state : null

            if (!stateFromLocalStorage) {
                setHasFinishedReading(true)

                return
            }

            applyFromLocalStorage(stateFromLocalStorage)
            setHasFinishedReading(true)
        }

        fetchData()
    }, [addLens, applyFromLocalStorage, hasFinishedReading, hasStartedReading])

    return hasFinishedReading
}
