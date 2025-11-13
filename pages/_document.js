import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="he" dir="rtl">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#e11d48" />
      </Head>
      <body>
        <a href="#main-content" className="skip-to-content">
          דלג לתוכן הראשי
        </a>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
