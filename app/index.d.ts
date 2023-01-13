// https://github.com/dobriai/footinch
declare module 'footinch'

type Units = 'metric' | 'imperial'

type SensorKey = import('./src/utilities/sensorList').SensorKey

type Distance = number

interface LensInputs {
    id: string
    name: string
    focalLength: number
    aperture: string
    sensorKey: SensorKey
}

interface LensDefinition extends LensInputs {
    depthOfField: import('dof').DepthOfFieldDetails
}

type DefaultLensData = Pick<LensDefinition, 'name' | 'focalLength' | 'aperture' | 'sensorKey'>

interface LensDataState {
    units: Units
    distance: Distance
    lenses: LensDefinition[]
    addLens: (config?: Partial<DefaultLensData>, skipIfDuplicate?: boolean) => void
    updateLens: (lens: LensDefinition) => void
    deleteLenses: (lensesToDelete: readonly SelectedItem[]) => void
    duplicateLenses: (lensesToDuplicate: readonly SelectedItem[]) => void
    setDistance: (newValue: Distance) => void
    setUnits: (newValue: Units) => void
}

interface TableState {
    order: Order
    orderBy: ColumnName
    selected: readonly SelectedItem[]
    setSorting: (col: ColumnName, order?: Order) => void
    setSelected: (newSelected: readonly SelectedItem[]) => void
    isSelected: (id: LensDefinition['id']) => boolean
}

type LocalStorageData = {
    state: Pick<TableState & LensDataState, 'lenses' | 'units' | 'distance' | 'order' | 'orderBy'>
    version: number
}

interface StorageState {
    extractForLocalStorage: () => LocalStorageData
    applyFromLocalStorage: (partialState: LocalStorageData) => void
}

type ColumnName = keyof LensDefinition

interface HeadCell {
    disablePadding: boolean
    id: ColumnName
    label: string
    numeric: boolean
}

type Order = 'asc' | 'desc'

type SelectedItem = LensDefinition['id']
