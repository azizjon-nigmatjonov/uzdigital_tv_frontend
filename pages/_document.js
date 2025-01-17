import Document, { Head, Html, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import { i18n } from '../i18n'
export default class MyDocument extends Document {
    static getInitialProps({ renderPage }) {
        // Step 1: Create an instance of ServerStyleSheet
        const sheet = new ServerStyleSheet()

        // Step 2: Retrieve styles from components in the page
        const page = renderPage(
            (App) => (props) => sheet.collectStyles(<App {...props} />),
        )

        // Step 3: Extract the styles as <style> tags
        const styleTags = sheet.getStyleElement()

        // Step 4: Pass styleTags as a prop
        return { ...page, styleTags }
    }

    render() {
        return (
            <Html lang={i18n.language}>
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}
