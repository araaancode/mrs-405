// next.config.js
/** @type {import('next').NextConfig} */

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
        ],
        optimizeCss: true,
    },

    /* ============================================================
       2. بهینه‌سازی تصاویر
       ============================================================ */
    images: {
        formats: ["image/avif", "image/webp"],
        deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 180, 256, 384],
        minimumCacheTTL: 60 * 60 * 24 * 30,

        // 🔥 برای SVG و data URLs
        dangerouslyAllowSVG: true,
        contentDispositionType: "attachment",
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

        // 🔥 دامنه‌های مجاز
        remotePatterns: [
            // Vercel Blob
            { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
            // Cloudinary
            { protocol: "https", hostname: "res.cloudinary.com" },
            // AWS S3
            { protocol: "https", hostname: "*.s3.amazonaws.com" },
            { protocol: "https", hostname: "*.s3.*.amazonaws.com" },
            // Supabase Storage
            { protocol: "https", hostname: "*.supabase.co" },
            // 🔥 توسعه محلی — برای بک‌اند روی localhost
            { protocol: "http", hostname: "localhost" },
            { protocol: "http", hostname: "127.0.0.1" },
            // 🔥 اگه روی شبکه محلی تسته
            { protocol: "http", hostname: "192.168.*.*" },
            // 🔥 اگه بک‌اند از IP مستقیم استفاده می‌کنه
            { protocol: "https", hostname: "**" }, // موقت — برای پروداکشن حذف کن
        ],

        // 🔥 برای تصاویری که از بک‌اند میان و ممکنه مشکل داشته باشن
        unoptimized: false,
    },

    /* ============================================================
       3. کامپایلر
       ============================================================ */
    compiler: {
        removeConsole:
            process.env.NODE_ENV === "production"
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
            {
                source: "/_next/static/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
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