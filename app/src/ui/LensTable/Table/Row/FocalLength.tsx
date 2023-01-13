import { InputAdornment, TextField } from '@mui/material'
import { ChangeEvent } from 'react'
import useDoFStore from '../../../../store'
import useIsMobile from '../../../../utilities/useIsMobile'

export default function FocalLength({ lens }: { lens: LensDefinition }) {
    const { updateLens } = useDoFStore()
    const isMobile = useIsMobile()
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        updateLens({ ...lens, focalLength: parseFloat(event.target.value) })
    }

    return (
        <TextField
            label="Focal length"
            onChange={onChange}
            value={lens.focalLength}
            type="number"
            InputProps={{
                type: 'number',
                endAdornment: <InputAdornment position="end">mm</InputAdornment>,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                min: 0,
                step: 1,
            }}
            InputLabelProps={{
                shrink: true,
            }}
            data-testid={`focal-length-${lens.id}`}
            autoComplete="off"
            size="small"
            fullWidth={isMobile}
        />
    )
}
