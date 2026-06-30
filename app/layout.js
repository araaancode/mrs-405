'use client'

import { SessionProvider } from 'next-auth/react'
import { useRef, useEffect, useState } from 'react'
import './globals.css'
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"

export default function RootLayout({ children }) {
  const headerRef = useRef(null)
  const [headerHeight, setHeaderHeight] = useState(0)

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight)
      }
    }

    updateHeaderHeight()
    window.addEventListener('resize', updateHeaderHeight)

    return () => window.removeEventListener('resize', updateHeaderHeight)
  }, [])

  return (
    <html lang="fa">
      <body >
        <SessionProvider>
          {/* هدر با ref برای اندازه‌گیری ارتفاع */}
          <div ref={headerRef}>
            <Header />
          </div>

          {/* فضای خالی به اندازه ارتفاع هدر */}
          <div style={{ height: `${headerHeight}px` }} />

          {/* محتوای اصلی */}
          <main style={{ flex: 1 }}>
            {children}
          </main>

          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}