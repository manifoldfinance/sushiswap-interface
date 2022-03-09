/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// @note there is no actual error here, the rule thinks _document.page.tsx is different from _document.tsx
import Document, { Head, Html, Main, NextScript } from 'next/document'
import React, { ReactElement } from 'react'
const APP_NAME = 'SushiSwap'
const APP_DESCRIPTION = 'Swap, yield, lend, borrow, leverage, limit, launch all on one community driven ecosystem'

class MyDocument extends Document {
  render(): ReactElement {
    return (
      <Html>
        <Head>
          <meta name="application-name" content={APP_NAME} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content={APP_NAME} />
          <meta name="description" content={APP_DESCRIPTION} />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#0993ec" />

          <link rel="apple-touch-icon" sizes="72x72" href="/icons/icon-72x72.png" />
          <link rel="apple-touch-icon" sizes="96x96" href="/icons/icon-96x96.png" />
          <link rel="apple-touch-icon" sizes="128x128" href="/icons/icon-128x128.png" />
          <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144x144.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
          <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
          <link rel="apple-touch-icon" sizes="384x384" href="/icons/icon-384x384.png" />
          <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png" />

          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with server-side generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets()
  const originalRenderPage = ctx.renderPage

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    })

  const initialProps = await Document.getInitialProps(ctx)

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
  }
}

export default MyDocument
