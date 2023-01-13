import DeleteIcon from '@mui/icons-material/Delete'
import { IconButton, Tooltip } from '@mui/material'
import useDoFStore from '../../../store'

export default function DeleteButton({ lenses }: { lenses: readonly LensDefinition['id'][] }) {
    const { deleteLenses } = useDoFStore()

    return (
        <Tooltip title="Delete">
            <IconButton onClick={() => deleteLenses(lenses)}>
                <DeleteIcon />
            </IconButton>
        </Tooltip>
    )
}
