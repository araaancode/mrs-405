// scripts/ads_seeder.js
import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/User.js";
import Hall from "../models/Hall.js";
import Advertisement from "../models/Advertisement.js";

dotenv.config();

const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/mrsapp";

/* ============================================================
   داده‌های نمونه
   ============================================================ */
const AD_TITLES = [
    "تخفیف ویژه تابستانه",
    "جشنواره عروسی پاییزی",
    "پکیج کامل مراسم عروسی",
    "تخفیف ۳۰٪ برای رزرو زودهنگام",
    "مراسم تولد با تخفیف ویژه",
    "همایش‌های سازمانی با قیمت مناسب",
    "سالن VIP با خدمات اختصاصی",
    "شب‌های موسیقی زنده",
    "پکیج ویژه نامزدی",
    "تخفیف دانشجویی",
    "مراسم ختم با آرامش کامل",
    "جشن فارغ‌التحصیلی",
    "همایش سالانه شرکت‌ها",
    "کنسرت‌های خصوصی",
    "مراسم افتتاحیه",
    "رویدادهای ورزشی",
    "نمایشگاه‌های تجاری",
    "جشن‌های مذهبی",
    "مراسم تقدیر و تشکر",
    "شب‌های شعر و ادب",
];

const AD_DESCRIPTIONS = [
    "با بهترین امکانات و خدمات، مراسم خود را به یادماندنی کنید. تیم ما آماده‌ی پذیرایی از شما و مهمانان عزیزتان است. رزرو کنید و از تخفیف‌های ویژه بهره‌مند شوید.",
    "سالن مجلل با دکوراسیون مدرن، سیستم صوتی حرفه‌ای، تیم پذیرایی مجرب و پارکینگ اختصاصی. همه چیز برای یک مراسم بی‌نقص آماده است.",
    "با رزرو زودهنگام، از تخفیف‌های ویژه ما بهره‌مند شوید. ظرفیت محدود است، پس همین امروز رزرو کنید و از خدمات ممتاز ما لذت ببرید.",
    "پکیج کامل شامل تالار، پذیرایی، دکوراسیون، موسیقی و عکاسی. همه‌چیز در یک بسته با قیمت استثنایی. برای اطلاعات بیشتر تماس بگیرید.",
    "ما با بیش از ۱۰ سال تجربه در برگزاری مراسم، آماده‌ی خدمت‌رسانی به شما هستیم. کیفیت خدمات ما تضمین‌شده است.",
];

const CTA_TEXTS = ["مشاهده", "رزرو کنید", "بیشتر بدانید", "تماس بگیرید", "همین حالا رزرو کن"];

const AD_TYPES = ["banner", "sidebar", "popup", "featured", "home_slider"];
const PLACEMENTS = ["all", "home", "halls", "hall_detail", "user_panel"];

const STATUSES = [
    "draft",
    "pending",
    "approved",
    "active",
    "paused",
    "rejected",
    "expired",
];

/* ============================================================
   توابع کمکی
   ============================================================ */
function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function pickStatus() {
    // توزیع واقعی‌تر: بیشتر active و pending
    const weighted = [
        ...Array(3).fill("draft"),
        ...Array(5).fill("pending"),
        ...Array(2).fill("approved"),
        ...Array(8).fill("active"),
        ...Array(2).fill("paused"),
        ...Array(3).fill("rejected"),
        ...Array(2).fill("expired"),
    ];
    return pick(weighted);
}

function getDateRange(status) {
    const now = new Date();

    if (status === "expired") {
        // گذشته
        const start = new Date(now);
        start.setDate(start.getDate() - 60);
        const end = new Date(now);
        end.setDate(end.getDate() - 10);
        return { start, end };
    }

    if (status === "approved") {
        // شروع در آینده
        const start = new Date(now);
        start.setDate(start.getDate() + 5);
        const end = new Date(now);
        end.setDate(end.getDate() + 40);
        return { start, end };
    }

    // حالت عادی: گذشته تا آینده
    const start = new Date(now);
    start.setDate(start.getDate() - Math.floor(Math.random() * 20));
    const end = new Date(now);
    end.setDate(end.getDate() + 20 + Math.floor(Math.random() * 40));
    return { start, end };
}

function getBudget() {
    return Math.floor(Math.random() * 45 + 5) * 100000; // ۵۰۰,۰۰۰ تا ۵,۰۰۰,۰۰۰
}

function getDailyBudget() {
    return Math.floor(Math.random() * 10 + 1) * 50000; // ۵۰,۰۰۰ تا ۵۰۰,۰۰۰
}

function buildStats(status) {
    if (status === "draft" || status === "pending" || status === "rejected") {
        return { views: 0, clicks: 0, ctr: 0 };
    }
    const views = Math.floor(Math.random() * 5000) + 200;
    const clicks = Math.floor(views * (Math.random() * 0.15 + 0.02));
    const ctr = views > 0 ? (clicks / views) * 100 : 0;
    return { views, clicks, ctr: Number(ctr.toFixed(2)) };
}

function buildPaymentInfo(status, budget) {
    if (status === "active" || status === "expired" || status === "paused") {
        return {
            ref_id: `REF-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
            paid_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            amount: budget,
        };
    }
    return { ref_id: null, paid_at: null, amount: 0 };
}

function buildImages() {
    const urls = [
        "/images/landing/halls/1.jpg",
        "/images/landing/halls/2.jpg",
        "/images/landing/halls/3.jpg",
        "/images/landing/halls/4.jpg",
        "/images/landing/halls/5.jpg",
        "/images/landing/halls/6.jpg",
        "/images/landing/halls/7.jpg",
        "/images/landing/halls/8.jpg",
        "/images/landing/halls/10.jpg",
        "/images/landing/halls/13.jpg",
        "/images/landing/halls/14.png",
    ];
    const count = Math.floor(Math.random() * 3) + 1; // ۱ تا ۳ تصویر
    const shuffled = [...urls].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function buildRejectReason() {
    return pick([
        "تصاویر ارسالی با کیفیت مناسب نیستند و نیاز به بازنگری دارند.",
        "متن تبلیغ با قوانین سایت مغایرت دارد. لطفاً اصلاح کنید.",
        "عنوان تبلیغ گمراه‌کننده است. لطفاً شفاف‌سازی کنید.",
        "تبلیغ شامل اطلاعات نادرست است. لطفاً اطلاعات صحیح را وارد کنید.",
        "لینک مقصد نامعتبر است یا به سایت نامرتبط هدایت می‌کند.",
    ]);
}

/* ============================================================
   Seeder اصلی
   ============================================================ */
async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ MongoDB Connected");

        /* ============================================================
           پاک‌سازی داده‌های قبلی
           ============================================================ */
        await Advertisement.deleteMany({});
        console.log("🗑  پاک‌سازی تبلیغات قبلی انجام شد");

        /* ============================================================
           پیدا کردن تالارداران و تالارها
           ============================================================ */
        const owners = await User.find({ role: "hall_owner" })
            .select("_id full_name")
            .lean();

        if (owners.length === 0) {
            console.error("❌ هیچ تالارداری یافت نشد. ابتدا hall_seeder را اجرا کنید.");
            process.exit(1);
        }

        const halls = await Hall.find({ is_active: true })
            .select("_id title hall_owner_id")
            .lean();

        if (halls.length === 0) {
            console.error("❌ هیچ تالار فعالی یافت نشد. ابتدا hall_seeder را اجرا کنید.");
            process.exit(1);
        }

        console.log(`👥 ${owners.length} تالاردار`);
        console.log(`🏢 ${halls.length} تالار فعال`);

        /* ============================================================
           ساخت تالارهای مالک‌محور
           ============================================================ */
        // نقشه‌ای از ownerId → آرایه تالارهایش
        const hallsByOwner = new Map();
        for (const hall of halls) {
            const ownerId = String(hall.hall_owner_id);
            if (!hallsByOwner.has(ownerId)) {
                hallsByOwner.set(ownerId, []);
            }
            hallsByOwner.get(ownerId).push(hall);
        }

        const ownersWithHalls = owners.filter((o) =>
            hallsByOwner.has(String(o._id))
        );

        if (ownersWithHalls.length === 0) {
            console.error(
                "❌ هیچ تالارداری تالار فعال ندارد. ابتدا روابط را بررسی کنید."
            );
            process.exit(1);
        }

        console.log(
            `✅ ${ownersWithHalls.length} تالاردار دارای تالار فعال`
        );

        /* ============================================================
           ساخت ۵۰ تبلیغ
           ============================================================ */
        const TOTAL_ADS = 50;
        const ads = [];

        for (let i = 0; i < TOTAL_ADS; i++) {
            const owner = ownersWithHalls[i % ownersWithHalls.length];
            const ownerHalls = hallsByOwner.get(String(owner._id));
            const hall = ownerHalls[Math.floor(Math.random() * ownerHalls.length)];

            const status = pickStatus();
            const { start, end } = getDateRange(status);
            const budget = getBudget();
            const dailyBudget = getDailyBudget();

            // تبلیغات draft و rejected و pending بدون تالار یا با تالار
            const useHall = Math.random() > 0.2 ? hall._id : null;

            const ad = {
                owner_id: owner._id,
                hall_id: useHall,
                title: `${pick(AD_TITLES)} — ${i + 1}`,
                description: pick(AD_DESCRIPTIONS),
                images: buildImages(),
                ad_type: pick(AD_TYPES),
                placement: pick(PLACEMENTS),
                target_url: `https://example.com/ads/${i + 1}`,
                cta_text: pick(CTA_TEXTS),
                start_date: start,
                end_date: end,
                budget,
                daily_budget: dailyBudget,
                payment_status: ["active", "expired", "paused"].includes(status)
                    ? "paid"
                    : "unpaid",
                payment_info: buildPaymentInfo(status, budget),
                stats: buildStats(status),
                status,
                is_active: status === "active",
                reviewed_by: ["approved", "active", "paused", "rejected", "expired"].includes(
                    status
                )
                    ? owners[0]._id
                    : null,
                reviewed_at: ["approved", "active", "paused", "rejected", "expired"].includes(
                    status
                )
                    ? new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000)
                    : null,
                rejection_reason: status === "rejected" ? buildRejectReason() : "",
            };

            ads.push(ad);
        }

        /* ============================================================
           درج در دیتابیس
           ============================================================ */
        const createdAds = await Advertisement.insertMany(ads, {
            ordered: false,
            validateBeforeSave: true,
        });

        console.log(`✅ ${createdAds.length} تبلیغ با موفقیت ایجاد شد`);

        /* ============================================================
           آمار
           ============================================================ */
        const byStatus = createdAds.reduce((acc, a) => {
            acc[a.status] = (acc[a.status] || 0) + 1;
            return acc;
        }, {});

        console.log("\n📊 آمار تبلیغات:");
        Object.entries(byStatus).forEach(([status, count]) => {
            console.log(`   ${status.padEnd(10)} → ${count}`);
        });

        const totalViews = createdAds.reduce(
            (sum, a) => sum + (a.stats?.views || 0),
            0
        );
        const totalClicks = createdAds.reduce(
            (sum, a) => sum + (a.stats?.clicks || 0),
            0
        );
        console.log(`\n👁  کل بازدیدها: ${totalViews.toLocaleString("fa-IR")}`);
        console.log(`🖱  کل کلیک‌ها: ${totalClicks.toLocaleString("fa-IR")}`);

        console.log("\n🎉 Seeder تبلیغات با موفقیت اجرا شد!");
        process.exit(0);
    } catch (error) {
        console.error("❌ خطا در seeder:", error);

        if (error.writeErrors) {
            console.error(
                "خطاهای درج:",
                error.writeErrors.map((e) => ({
                    index: e.index,
                    message: e.errmsg,
                }))
            );
        }

        if (error.errors) {
            // خطاهای validation
            Object.entries(error.errors).forEach(([field, err]) => {
                console.error(`   → ${field}: ${err.message}`);
            });
        }

        process.exit(1);
    }
}

seed();