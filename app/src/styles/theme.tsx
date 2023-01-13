import { CssBaseline, useMediaQuery } from '@mui/material'
import { createTheme, responsiveFontSizes, ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { PropsWithChildren, useMemo } from 'react'

export const THEME_SPACING = 8

export function ThemeProvider({ children }: PropsWithChildren) {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

    const theme = useMemo(
        () =>
            responsiveFontSizes(
                createTheme({
                    spacing: THEME_SPACING,
                    palette: {
                        mode: prefersDarkMode ? 'dark' : 'light',
                    },
                    typography: {
                        body1: {
                            fontFamily:
                                "'Open Sans', -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
                        },
                        fontSize: 16,
                        h1: {
                            // fontSize: '2rem',
                        },
                        h2: {
                            // fontSize: '1.75rem',
                        },
                        h3: {
                            // fontSize: '1.5rem',
                        },
                        h4: {
                            // fontSize: '1.25rem',
                            // fontWeight: 600,
                        },
                        h5: {
                            // fontSize: '1.25rem',
                        },
                        h6: {
                            // fontSize: '1rem',
                            // fontWeight: 600,
                        },
                    },
                })
            ),
        [prefersDarkMode]
    )

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </MuiThemeProvider>
    )
}
