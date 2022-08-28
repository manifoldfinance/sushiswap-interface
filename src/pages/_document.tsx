/* eslint-disable @next/next/no-document-import-in-page */
// pages/_document.js
import { Head, Html, Main, NextScript } from 'next/document'

const APP_NAME = 'Sushi'
const APP_DESCRIPTION = 'Swap, yield, lend, borrow, leverage, limit, launch all on one community driven ecosystem'

export default function Document() {
  return (
    <Html>
      <Head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, minimum-scale=1.0" />
        <title>Sushi</title>
        <meta name="description" content={APP_DESCRIPTION} />
        <meta name="theme-color" content="#0993ec" />

        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
