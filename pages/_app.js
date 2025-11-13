import '../styles/globals.css'
import { useState, useEffect } from 'react'
import Head from 'next/head'

// Cookie Consent Banner Component
function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShowBanner(true)
    } else if (consent === 'accepted') {
      loadGTM()
    }
  }, [])

  const loadGTM = () => {
    const gtmId = process.env.NEXT_PUBLIC_GTM_ID
    if (gtmId) {
      const script = document.createElement('script')
      script.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
      `
      document.head.appendChild(script)
    }
  }

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShowBanner(false)
    loadGTM()
  }

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-dark-gray/95 backdrop-blur-lg border-t border-white/10 shadow-2xl">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-300 text-center sm:text-right">
            אנחנו משתמשים בעוגיות כדי לשפר את חווית המשתמש ולנתח את התנועה באתר. 
            באישור, אתה מסכים לשימוש בעוגיות לפי{' '}
            <a href="/privacy" className="text-primary hover:underline">
              מדיניות הפרטיות
            </a>
            .
          </p>
          <div className="flex gap-3">
            <button
              onClick={declineCookies}
              className="px-6 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              aria-label="דחה עוגיות"
            >
              לא תודה
            </button>
            <button
              onClick={acceptCookies}
              className="px-6 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-white rounded-full transition-all"
              aria-label="אשר עוגיות"
            >
              אני מסכים
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
      <CookieConsent />
    </>
  )
}
