import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate'
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import MuiToolbar from '@mui/material/Toolbar'
import useDoFStore from '../../../store'
import useIsMobile from '../../../utilities/useIsMobile'
import DeleteButton from './DeleteButton'

export default function BottomToolbar() {
    const { addLens, duplicateLenses, selected } = useDoFStore()
    const isMobile = useIsMobile()

    return (
        <MuiToolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
            }}
            data-testid="bottom-toolbar"
        >
            {isMobile ? null : (
                <Box flexGrow={1} display="flex" alignItems="center">
                    {selected.length > 0 ? (
                        <>
                            <Box mr={1}>
                                <Typography
                                    sx={{ flex: '1 1 100%' }}
                                    color="inherit"
                                    variant="subtitle1"
                                    component="div"
                                    data-testid="selected-count"
                                >
                                    {selected.length} selected
                                </Typography>
                            </Box>
                            <Box>
                                <DeleteButton lenses={selected} />
                                <Tooltip title="Duplicate">
                                    <IconButton onClick={() => duplicateLenses(selected)}>
                                        <ControlPointDuplicateIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </>
                    ) : null}
                </Box>
            )}
            <Box sx={isMobile ? { textAlign: 'center', flexGrow: 1 } : undefined}>
                <Button onClick={() => addLens()}>Add Lens</Button>
            </Box>
        </MuiToolbar>
    )
}
