import { FormControl, InputLabel, ListSubheader, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import useDoFStore from '../../../../store'
import sensorList from '../../../../utilities/sensorList'
import { objectKeysArray } from '../../../../utilities/objectKeysArray'
import { isSensorKey } from '../../../../utilities/isSensorKey'
import useIsMobile from '../../../../utilities/useIsMobile'

const allSensorKeys = objectKeysArray(sensorList)
const commonSensorKeys: SensorKey[] = []

objectKeysArray(sensorList).forEach((sensorKey) => {
    const sensor = sensorList[sensorKey]

    if ('isCommon' in sensor && sensor.isCommon) {
        commonSensorKeys.push(sensorKey)
    }
})

export default function Sensor({ lens }: { lens: LensDefinition }) {
    const { updateLens } = useDoFStore()
    const isMobile = useIsMobile()
    const ItemComponent = isMobile ? 'option' : MenuItem
    const GroupComponent = isMobile ? 'optgroup' : ListSubheader
    const onChange = (event: SelectChangeEvent<SensorKey>) => {
        if (isSensorKey(event.target.value)) {
            updateLens({ ...lens, sensorKey: event.target.value })
        }
    }

    return (
        <FormControl fullWidth>
            <InputLabel id="sensor-size-input">Sensor size</InputLabel>
            <Select
                value={lens.sensorKey}
                onChange={onChange}
                size="small"
                data-testid={`sensor-${lens.id}`}
                label="Sensor size"
                native={isMobile}
                labelId="sensor-size-input"
            >
                <GroupComponent label="Common sizes">Common sizes</GroupComponent>
                {commonSensorKeys.map((key) => {
                    const { name } = sensorList[key]

                    return (
                        <ItemComponent value={key} key={key}>
                            {name}
                        </ItemComponent>
                    )
                })}
                <GroupComponent label="Specific cameras and mounts">Specific cameras and mounts</GroupComponent>
                {allSensorKeys.map((key) => {
                    const { name } = sensorList[key]

                    return (
                        <ItemComponent value={key} key={key}>
                            {name}
                        </ItemComponent>
                    )
                })}
            </Select>
        </FormControl>
    )
}
