// app/layout.js
import { Suspense } from "react";
import "./globals.css";

// Providers
import AuthProvider from "@/components/providers/AuthProvider";
import { NotificationProvider } from "@/contexts/NotificationContext";
import ToastProvider from "@/components/providers/ToastProvider";

// Components
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/* ============================================================
   Metadata
   ============================================================ */
export const metadata = {
    title: {
        default: "سیستم رزرو تالار",
        template: "%s | سیستم رزرو تالار",
    },
    description:
        "سیستم جامع رزرو آنلاین تالارهای عروسی، همایش و مراسم با پرداخت آنلاین",
    keywords: ["رزرو تالار", "تالار عروسی", "همایش", "مراسم", "رزرو آنلاین"],
    authors: [{ name: "MRS App" }],
    creator: "MRS App",
    publisher: "MRS App",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    ),
    openGraph: {
        type: "website",
        locale: "fa_IR",
        url: process.env.NEXT_PUBLIC_BASE_URL,
        siteName: "سیستم رزرو تالار",
        title: "سیستم رزرو تالار",
        description: "سیستم جامع رزرو آنلاین تالارها",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "سیستم رزرو تالار",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "سیستم رزرو تالار",
        description: "سیستم جامع رزرو آنلاین تالارها",
        images: ["/og-image.jpg"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },
};

/* ============================================================
   Viewport
   ============================================================ */
export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#C6A14C" },
        { media: "(prefers-color-scheme: dark)", color: "#3B2F2F" },
    ],
};

/* ============================================================
   Root Layout
   ============================================================ */
export default function RootLayout({ children }) {
    return (
        <html lang="fa" dir="rtl" suppressHydrationWarning>
            <head>
                <link
                    rel="preload"
                    href="/fonts/IranianSans.ttf"
                    as="font"
                    type="font/ttf"
                    crossOrigin="anonymous"
                />

                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta
                    name="apple-mobile-web-app-status-bar-style"
                    content="default"
                />
                <meta
                    name="apple-mobile-web-app-title"
                    content="رزرو تالار"
                />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="msapplication-TileColor" content="#C6A14C" />
                <meta name="msapplication-tap-highlight" content="no" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta
                    name="referrer"
                    content="strict-origin-when-cross-origin"
                />
            </head>

            <body
                className="antialiased bg-[#FDFCF9] text-slate-900 min-h-screen flex flex-col"
                style={{ fontFamily: "'IranianSans', system-ui, sans-serif" }}
            >
                <AuthProvider>
                    <NotificationProvider>
                        <Suspense
                            fallback={
                                <div className="h-16 bg-white border-b border-slate-100 animate-pulse" />
                            }
                        >
                            <Navbar />
                        </Suspense>

                        <main className="flex-1 w-full" role="main">
                            <Suspense
                                fallback={
                                    <div className="flex items-center justify-center min-h-[60vh]">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-full border-4 border-gold-500 border-t-transparent animate-spin" />
                                            <p className="text-slate-500 text-sm">
                                                در حال بارگذاری...
                                            </p>
                                        </div>
                                    </div>
                                }
                            >
                                {children}
                            </Suspense>
                        </main>

                        <Suspense
                            fallback={
                                <div className="h-32 bg-slate-100 animate-pulse" />
                            }
                        >
                            <Footer />
                        </Suspense>

                        {/*  ToastContainer — همه‌ی toast های برنامه */}
                        <ToastProvider />
                    </NotificationProvider>
                </AuthProvider>
            </body>
        </html>
    );
}