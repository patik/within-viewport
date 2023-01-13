import { StateCreator } from 'zustand'

export const createTableSlice: StateCreator<TableState & LensDataState & StorageState, [], [], TableState> = (
    set,
    get
) => ({
    order: 'asc',
    orderBy: 'id',
    selected: [],
    setSorting(orderBy: ColumnName, order?: Order) {
        set((state) => {
            // Force the order to be a certain direction, e.g. when reading the value from localStorage
            if (order) {
                return {
                    ...state,
                    order,
                    orderBy,
                }
            }

            // Determine `order` by checking whether we're sorting the same columnn for a second consecutive time (i.e. clicking on twice on the same column header)
            const isAsc = state.orderBy === orderBy && state.order === 'asc'

            return {
                ...state,
                order: isAsc ? 'desc' : 'asc',
                orderBy,
            }
        })
    },
    setSelected(newSelected: readonly SelectedItem[]) {
        set((state) => {
            return {
                ...state,
                selected: newSelected,
            }
        })
    },
    isSelected(id: SelectedItem) {
        return get().selected.indexOf(id) !== -1
    },
})
