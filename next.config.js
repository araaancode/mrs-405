// next.config.js
/** @type {import('next').NextConfig} */

const nextConfig = {
    /* ============================================================
       1. بهینه‌سازی باندل — مهم‌ترین بخش
       ============================================================ */
    experimental: {
        // این تنظیم حیاتی است: فقط ماژول‌های استفاده‌شده در باندل می‌آیند
        // بدون این، react-icons می‌تواند صدها KB اضافه کند
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
    },

    /* ============================================================
       2. بهینه‌سازی تصاویر
       ============================================================ */
    images: {
        // فرمت‌های مدرن — مرورگر بهترین را انتخاب می‌کند
        formats: ["image/avif", "image/webp"],

        // سایزهای دستگاه — مرورگر مناسب‌ترین را دانلود می‌کند
        deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 180, 256, 384],

        // کش تصاویر به مدت ۳۰ روز
        minimumCacheTTL: 60 * 60 * 24 * 30,

        // دامنه‌های مجاز برای تصاویر remote
        // ⚠️ اگر دامنه‌ی مشخص داری، جایگزین کن برای امنیت + کش مؤثرتر
        remotePatterns: [
            { protocol: "https", hostname: "**" },
            { protocol: "http", hostname: "**" },
        ],

        // جلوگیری از SVG مخرب
        dangerouslyAllowSVG: false,
    },

    /* ============================================================
       3. حذف console در production — باندل کوچک‌تر
       ============================================================ */
    compiler: {
        removeConsole:
            process.env.NODE_ENV === "production"
                ? { exclude: ["error", "warn"] }
                : false,

        // حذف prop-types در production (چون از PropTypes استفاده می‌کردی)
        reactRemoveProperties:
            process.env.NODE_ENV === "production"
                ? { properties: ["^data-testid$"] }
                : false,
    },

    /* ============================================================
       4. فشرده‌سازی و بهینه‌سازی خروجی
       ============================================================ */
    compress: true,
    poweredByHeader: false,
    productionBrowserSourceMaps: false,
    reactStrictMode: true,

    // در Next.js 14: به جای swcMinify (که همیشه true است)
    // swcMinify به طور پیش‌فرض فعال است

    /* ============================================================
       5. هدرهای کش برای assets استاتیک
       ============================================================ */
    async headers() {
        return [
            // تصاویر — کش ۱ ساله
            {
                source: "/images/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
            // فونت‌ها — کش ۱ ساله
            {
                source: "/fonts/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
            // فایل‌های استاتیک Next.js — کش ۱ ساله
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
       6. Redirects — جلوگیری از لینک‌های قدیمی
       ============================================================ */
    async redirects() {
        return [
            // اگر /search بدون پارامتر آمد، به /halls برود
            // (اختیاری — بر اساس نیاز پروژه)
        ];
    },

    /* ============================================================
       7. Webpack — تنظیمات پیشرفته (اختیاری)
       ============================================================ */
    webpack: (config, { isServer, dev }) => {
        // در production، پکیج‌های حجیم را به chunk های جدا تقسیم می‌کنیم
        if (!isServer && !dev) {
            config.optimization.splitChunks = {
                chunks: "all",
                cacheGroups: {
                    // framer-motion در chunk جدا
                    framer: {
                        test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
                        name: "framer-motion",
                        priority: 30,
                    },
                    // react-icons در chunk جدا
                    icons: {
                        test: /[\\/]node_modules[\\/]react-icons[\\/]/,
                        name: "react-icons",
                        priority: 25,
                    },
                    // date-picker در chunk جدا (فقط در صفحاتی که لود می‌شود)
                    datepicker: {
                        test: /[\\/]node_modules[\\/](react-multi-date-picker|react-date-object)[\\/]/,
                        name: "date-picker",
                        priority: 20,
                    },
                    // toast
                    toast: {
                        test: /[\\/]node_modules[\\/]react-hot-toast[\\/]/,
                        name: "toast",
                        priority: 15,
                    },
                    // vendor عمومی
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendors",
                        priority: 10,
                    },
                },
            };
        }

        return config;
    },
};

module.exports = nextConfig;