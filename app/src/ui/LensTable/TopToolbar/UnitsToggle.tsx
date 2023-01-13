import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import useDoFStore from '../../../store'
import useIsMobile from '../../../utilities/useIsMobile'
import { SPACE_BETWEEN_FIELDS } from './TopToolbar'

function UnitsToggleButton({
    onChange,
}: {
    onChange: (_event: React.MouseEvent<HTMLElement>, newAlignment: Units | null) => void
}) {
    const { units } = useDoFStore()
    const isMobile = useIsMobile()

    return (
        <ToggleButtonGroup
            exclusive
            color="primary"
            value={units}
            onChange={onChange}
            aria-label="Units"
            size="small"
            sx={
                isMobile
                    ? {
                          // Remove space for the `mr` on the Distance input
                          maxWidth: `calc(50% - ${SPACE_BETWEEN_FIELDS})`,
                      }
                    : undefined
            }
            fullWidth={isMobile}
        >
            <ToggleButton value="metric" title="Meters">
                Metric
            </ToggleButton>

            <ToggleButton value="imperial" title="Feet">
                Imperial
            </ToggleButton>
        </ToggleButtonGroup>
    )
}

export default function UnitsToggle() {
    const { setUnits } = useDoFStore()
    const handleUnitsChange = (_event: React.MouseEvent<HTMLElement>, newUnits: Units | null) => {
        if (newUnits !== null) {
            setUnits(newUnits)
        }
    }

    return <UnitsToggleButton onChange={handleUnitsChange} />
}
