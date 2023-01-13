import Document, { DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
        const initialProps = await Document.getInitialProps(ctx)

        return initialProps
    }

    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta charSet="utf-8" />
                    <meta name="author" content="Craig Patik" />
                    <meta name="description" content="Depth of field calculator and camera lens comparison tool" />
                    <meta
                        name="keywords"
                        content="depth of field, camera, lens, photography, calculator, compare, comparison"
                    />
                    <meta name="author" content="Craig Patik" />
                    <link rel="canonical" href="https://patik.com/dof/" />
                    <meta name="HandheldFriendly" content="True" />
                    <meta name="MobileOptimized" content="320" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="apple-touch-fullscreen" content="yes" />
                </Head>
                <body>
                    <noscript>
                        <p>
                            This tool requires <a href="https://enable-javascript.com/">JavaScript</a>
                        </p>
                    </noscript>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
