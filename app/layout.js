// app/layout.js
import { Suspense } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';

// Providers
import AuthProvider from '@/components/providers/AuthProvider';

// Components
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
});

export const metadata = {
  title: {
    default: 'سیستم رزرو تالار',
    template: '%s | سیستم رزرو تالار'
  },
  description: 'سیستم جامع رزرو آنلاین تالارهای عروسی، همایش و مراسم با پرداخت آنلاین',
  keywords: ['رزرو تالار', 'تالار عروسی', 'همایش', 'مراسم', 'رزرو آنلاین'],
  authors: [{ name: 'MRS App' }],
  creator: 'MRS App',
  publisher: 'MRS App',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: 'سیستم رزرو تالار',
    title: 'سیستم رزرو تالار',
    description: 'سیستم جامع رزرو آنلاین تالارها',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'سیستم رزرو تالار'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'سیستم رزرو تالار',
    description: 'سیستم جامع رزرو آنلاین تالارها',
    images: ['/og-image.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#D4B06A' },
    { media: '(prefers-color-scheme: dark)', color: '#2C2418' }
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={inter.variable}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Vazirmatn Font for Persian */}
        <link
          href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"
          rel="stylesheet"
          type="text/css"
        />

        {/* Meta tags for PWA */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="رزرو تالار" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#D4B06A" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Security Headers */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>

      <body
        className={`
          ${inter.className} 
          antialiased 
          bg-gradient-to-br from-gray-50 via-white to-gray-50
          text-[#2C2418]
          min-h-screen
          flex flex-col
        `}
      >
        <AuthProvider>
          {/* Navbar */}
          <Suspense
            fallback={
              <div className="h-16 bg-white border-b border-gray-100 animate-pulse" />
            }
          >
            <Navbar />
          </Suspense>

          {/* Main Content */}
          <main
            className="flex-1 w-full"
            role="main"
          >
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-[60vh]">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-[#D4B06A] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 text-sm">در حال بارگذاری...</p>
                  </div>
                </div>
              }
            >
              {children}
            </Suspense>
          </main>

          {/* Footer */}
          <Suspense
            fallback={
              <div className="h-32 bg-gray-100 animate-pulse" />
            }
          >
            <Footer />
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}