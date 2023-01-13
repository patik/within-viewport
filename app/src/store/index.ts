import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { createLensDataSlice } from './lensSlice'
import { createStorageSlice } from './storageSlice'
import { createTableSlice } from './tableSlice'

const useDoFStore = create<TableState & LensDataState & StorageState>()(
    devtools((set, get, state) => ({
        ...createTableSlice(set, get, state),
        ...createLensDataSlice(set, get, state),
        ...createStorageSlice(set, get, state),
    }))
)

export default useDoFStore
