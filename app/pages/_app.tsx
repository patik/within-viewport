import '@fontsource/open-sans'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../src/styles/globals.css'
import { ThemeProvider } from '../src/styles/theme'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width,initial-scale=1,minimal-ui,viewport-fit=cover" />
            </Head>
            <ThemeProvider>
                <Component {...pageProps} />
            </ThemeProvider>
        </>
    )
}
