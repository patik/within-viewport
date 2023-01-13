import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { apertureMap } from 'dof'
import useDoFStore from '../../../../store'
import useIsMobile from '../../../../utilities/useIsMobile'

export default function Aperture({ lens }: { lens: LensDefinition }) {
    const { updateLens } = useDoFStore()
    const isMobile = useIsMobile()
    const ItemComponent = isMobile ? 'option' : MenuItem
    const onChange = (event: SelectChangeEvent<string>) => {
        updateLens({ ...lens, aperture: event.target.value })
    }

    return (
        <FormControl fullWidth>
            <InputLabel id="aperture-input">Aperture</InputLabel>
            <Select
                value={lens.aperture}
                onChange={onChange}
                size="small"
                data-testid={`aperture-${lens.id}`}
                label="Aperture"
                labelId="aperture-input"
                native={isMobile}
            >
                {Object.keys(apertureMap).map((key) => (
                    <ItemComponent value={key} key={key}>
                        {key}
                    </ItemComponent>
                ))}
            </Select>
        </FormControl>
    )
}
