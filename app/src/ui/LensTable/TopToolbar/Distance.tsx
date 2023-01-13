import { InputAdornment, TextField } from '@mui/material'
import { ChangeEvent, ChangeEventHandler } from 'react'
import useDoFStore from '../../../store'
import useIsMobile from '../../../utilities/useIsMobile'

export default function Distance() {
    const { units, distance, setDistance } = useDoFStore()
    const isMobile = useIsMobile()
    const handleDistanceChange: ChangeEventHandler<HTMLInputElement> = (event: ChangeEvent<HTMLInputElement>) => {
        if (parseFloat(event.target.value)) {
            setDistance(parseFloat(event.target.value))
        }
    }

    return (
        <TextField
            value={distance}
            label="Distance"
            onChange={handleDistanceChange}
            type="number"
            InputProps={{
                type: 'number',
                endAdornment: <InputAdornment position="end">{`${units === 'metric' ? 'm' : 'ft'}`}</InputAdornment>,
            }}
            autoComplete="off"
            size="small"
            sx={
                isMobile
                    ? undefined
                    : {
                          maxWidth: 160,
                      }
            }
            data-testid={`distance`}
            fullWidth={isMobile}
        />
    )
}
