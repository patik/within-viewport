import { Box, Typography } from '@mui/material'
import { THEME_SPACING } from '../../../styles/theme'
import useIsMobile from '../../../utilities/useIsMobile'
import Distance from './Distance'
import UnitsToggle from './UnitsToggle'

export const SPACE_BETWEEN_FIELDS = `${THEME_SPACING}px`

export default function TopToolbar() {
    const isMobile = useIsMobile()

    return (
        <Box display="flex" sx={isMobile ? { flexWrap: 'wrap' } : null}>
            <Box flexGrow={1} sx={isMobile ? { minWidth: '100%', pb: 2 } : null}>
                <Typography variant="h5" component="h2">
                    Lenses
                </Typography>
            </Box>
            <Box mr={SPACE_BETWEEN_FIELDS} sx={isMobile ? { width: '50%' } : null}>
                <Distance />
            </Box>
            <UnitsToggle />
        </Box>
    )
}
