import { withAuth } from "next-auth/middleware";

export default withAuth(
    function middleware(req) {
        // توی این نسخه نیازی نیست چیزی داخلش بنویسیم
        // همه چیز در callbacks.authorized کنترل میشه
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // اگر کاربر لاگین نکرده
                if (!token) return false;

                const path = req.nextUrl.pathname;

                // مسیرهای فقط برای مدیر
                if (path.startsWith("/admin")) {
                    return token.role === "admin";
                }

                // مسیرهای تالاردار
                if (path.startsWith("/hall_owner")) {
                    return token.role === "hall_owner";
                }

                // مسیرهای راننده
                if (path.startsWith("/driver")) {
                    return token.role === "driver";
                }

                // مسیرهای تهیه‌کننده غذا
                if (path.startsWith("/food_provider")) {
                    return token.role === "food_provider";
                }

                // مسیرهای ملک دار
                if (path.startsWith("/property_owner")) {
                    return token.role === "property_owner";
                }

                // مسیرهای مخصوص user معمولی
                if (path.startsWith("/user")) {
                    return token.role === "user";
                }

                return true;
            },
        },
    }
);

export const config = {
    matcher: [
        "/admin/:path*",
        "/hall_owner/:path*",
        "/driver/:path*",
        "/food_provider/:path*",
        "/property_owner/:path*",
        "/user/:path*",
    ],
};
