import { useMediaQuery, useTheme } from '@mui/material'

export default function useIsMobile() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    return isMobile
}
