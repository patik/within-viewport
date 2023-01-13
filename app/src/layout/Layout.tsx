import { ErrorBoundary } from 'react-error-boundary'
import Footer from './Footer'
import Box from '@mui/material/Box'
import Head from 'next/head'
import { PropsWithChildren, ReactElement } from 'react'
import { Divider, Typography } from '@mui/material'
import Link from 'next/link'

function FallbackComponent() {
    return <></>
}

type Props = PropsWithChildren<{
    title?: string
    hasPermalink?: boolean
    noMainHeading?: boolean
}>

export default function Layout({ title, hasPermalink, noMainHeading, children }: Props): ReactElement {
    return (
        <Box display="flex" flexDirection="column" minHeight="100%">
            <Head>
                <title>{`${
                    title ? `${title} | ` : ''
                } Depth of Field Calculator &amp; Comparison Tool for Camera Lenses`}</title>
            </Head>

            <Box width="100%" maxWidth="1020px" alignSelf="center" component="main" px={2} my={3} flexGrow={1}>
                {noMainHeading ? null : (
                    <Box mb={3}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            <Link href="/">Depth of Field Calculator &amp; Lens Comparison Tool</Link>
                        </Typography>
                        <Typography>Compare multiple camera lenses side-by-side</Typography>
                    </Box>
                )}

                <ErrorBoundary FallbackComponent={FallbackComponent}>{children}</ErrorBoundary>

                <Divider sx={{ my: 2 }} />

                <ErrorBoundary FallbackComponent={FallbackComponent}>
                    <Footer hasPermalink={hasPermalink} />
                </ErrorBoundary>
            </Box>
        </Box>
    )
}
