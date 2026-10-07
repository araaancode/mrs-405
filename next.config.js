/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        //  هر URL معتبری را قبول کن (سریع‌ترین راه‌حل)
        unoptimized: true,

        //  این دامنه‌ها هم مجاز باشند (برای بعداً اگر بهینه‌سازی خواستید)
        remotePatterns: [
            { protocol: "https", hostname: "**" },
            { protocol: "http", hostname: "**" },
        ],
    },

    reactStrictMode: true,
};

module.exports = nextConfig;