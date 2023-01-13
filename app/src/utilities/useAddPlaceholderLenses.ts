import { useEffect, useState } from 'react'
import useDoFStore from '../store'
import placeholderLenses from './placeholderLenses'

/**
 * Populate the empty table with some data
 */
function addPlaceholderLenses(addLens: LensDataState['addLens']) {
    placeholderLenses.forEach((l) => addLens(l, true))
}

export function useAddPlaceholderLenses(hasReadFromHash: boolean, hasReadFromStorage: boolean) {
    const [hasFinished, setHasFinished] = useState(false)
    const { addLens } = useDoFStore()

    useEffect(() => {
        if (hasFinished || !hasReadFromHash || !hasReadFromStorage || typeof window === 'undefined') {
            return
        }

        // Don't try to read more than once
        setHasFinished(true)

        // The call above may or may not have added anything to the state (based on duplicates, validation, etc) so check the count again
        if (useDoFStore.getState().lenses.length === 0) {
            addPlaceholderLenses(addLens)
        }
    }, [addLens, hasFinished, hasReadFromHash, hasReadFromStorage])

    return hasFinished
}
