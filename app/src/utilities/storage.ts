import { get, set } from 'idb-keyval'

const STORAGE_KEY = 'dof-storage'

const storage = {
    getItem: async (): Promise<string | null> => {
        return (await get(STORAGE_KEY)) || null
    },
    setItem: async (value: string): Promise<void> => {
        await set(STORAGE_KEY, value)
    },
}

export default storage
