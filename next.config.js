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
        // ✅ فعال‌سازی بهینه‌سازی CSS (نیاز به نصب critters)
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

        // ✅ دامنه‌های دقیق — اینجا را با دامنه‌های خودت پر کن
        remotePatterns: [
            // اگر روی Vercel هستی:
            { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
            // اگر از Cloudinary استفاده می‌کنی:
            // { protocol: "https", hostname: "res.cloudinary.com" },
            // اگر از S3 استفاده می‌کنی:
            // { protocol: "https", hostname: "*.s3.amazonaws.com" },
            // اگر از CDN خودت استفاده می‌کنی:
            // { protocol: "https", hostname: "cdn.yoursite.com" },
            // ⚠️ اگر مطمئن نیستی، این را موقتاً باز کن (ناامن):
            // { protocol: "https", hostname: "**" },
        ],

        dangerouslyAllowSVG: false,
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