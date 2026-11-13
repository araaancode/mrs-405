// next.config.js
/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
    /* ============================================================
       1. بهینه‌سازی باندل
       ============================================================ */
    experimental: {
        optimizePackageImports: [
            "react-icons",
            "react-icons/pi",
            "react-icons/fa",
            "react-icons/gi",
            "react-icons/md",
            "date-fns",
            "lodash-es",
            "framer-motion",
            "@headlessui/react",
            "@heroicons/react",
            "lucide-react",          // ← اضافه شد
        ],
        // ⚠️ optimizeCss حذف شد:
        // این گزینه فقط در Pages Router کار می‌کند و با App Router بی‌تأثیر است.
        // اگر Pages Router دارید و می‌خواهید استفاده کنید، critters را نصب کنید
        // و این خط را از کامنت خارج کنید:
        // optimizeCss: true,
    },

    /* ============================================================
       اگر Next.js 16+ دارید، این خط را فعال کنید:
       ============================================================ */
    // cacheComponents: true,

    /* ============================================================
       2. بهینه‌سازی تصاویر
       ============================================================ */
    images: {
        formats: ["image/avif", "image/webp"],
        deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 180, 256, 384],
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30 روز

        dangerouslyAllowSVG: true,
        contentDispositionType: "attachment",
        contentSecurityPolicy:
            "default-src 'self'; script-src 'none'; sandbox;",

        remotePatterns: [
            {
                protocol: "https",
                hostname: "*.public.blob.vercel-storage.com",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
            {
                protocol: "https",
                hostname: "*.s3.amazonaws.com",
            },
            {
                protocol: "https",
                hostname: "*.s3.*.amazonaws.com",
            },
            {
                protocol: "https",
                hostname: "*.supabase.co",
            },

            ...(!isProd
                ? [
                      {
                          protocol: "http",
                          hostname: "localhost",
                      },
                      {
                          protocol: "http",
                          hostname: "127.0.0.1",
                      },
                  ]
                : []),
        ],

        unoptimized: false,
    },

    /* ============================================================
       3. کامپایلر
       ============================================================ */
    compiler: {
        removeConsole: isProd
            ? { exclude: ["error", "warn"] }
            : false,
    },

    /* ============================================================
       4. فشرده‌سازی و خروجی
       ============================================================ */
    compress: true,
    poweredByHeader: false,
    productionBrowserSourceMaps: false,
    reactStrictMode: true,

    /* ============================================================
       5. هدرهای کش
       ============================================================ */
    async headers() {
        return [
            /* ---- فایل‌های استاتیک ---- */
            {
                source: "/images/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
            {
                source: "/fonts/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },

            /* ---- API Routeهای تالارها (کش CDN) ---- */
            {
                source: "/api/halls/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, s-maxage=60, stale-while-revalidate=120",
                    },
                ],
            },

            /* ---- API Routeهای عمومی دیگر (اختیاری) ---- */
            // اگر API دیگری دارید که داده‌های آن می‌تواند کمی قدیمی باشد،
            // همان الگو را برای آن تکرار کنید. مثال:
            // {
            //     source: "/api/locations/:path*",
            //     headers: [
            //         {
            //             key: "Cache-Control",
            //             value: "public, s-maxage=300, stale-while-revalidate=600",
            //         },
            //     ],
            // },
        ];
    },

    /* ============================================================
       6. Redirects
       ============================================================ */
    async redirects() {
        return [];
    },
};

module.exports = nextConfig;