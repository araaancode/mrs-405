// components/landing/LandingAds.jsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    PiArrowLeft,
    PiArrowRight,
    PiStarFill,
    PiMapPin,
    PiMegaphone,
    PiSparkleFill,
    PiSealCheckFill,
} from "react-icons/pi";

/* ============================================================
   ثابت‌های رنگ — هاردکد برای تضمین اعمال
   ============================================================ */
const DARK_BG = "#2A1F1F";
const GOLD = "#C6A14C";
const GOLD_LIGHT = "#E0C67B";
const GOLD_DARK = "#A8853A";
const GOLD_GRADIENT =
    "linear-gradient(135deg, #D3B263 0%, #C6A14C 50%, #A8853A 100%)";

const CARD_VARIANT = "horizontal";

/* ============================================================
   helpers
   ============================================================ */
function formatPrice(n) {
    if (!n && n !== 0) return "-";
    return Number(n).toLocaleString("fa-IR");
}

/* ============================================================
   LandingAds — Ad Slider (Dark Theme, RTL Correct)
   ✅ پس‌زمینه تیره (#2A1F1F)
   ✅ اسلاید صحیح در RTL (کارت‌ها با کلیک "بعدی" به راست می‌روند)
   ✅ دریافت تا ۳۰ تبلیغ از دیتابیس
   ============================================================ */
export default function LandingAds() {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(1);
    const trackRef = useRef(null);

    /* ---------------- Fetch — دریافت تبلیغات بیشتر ---------------- */
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await fetch(
                    "/api/ads?placement=home&limit=30",
                    {
                        headers: { Accept: "application/json" },
                        cache: "no-store",
                    }
                );
                const data = await res.json();
                if (mounted && data?.success && Array.isArray(data.ads)) {
                    setAds(data.ads);
                }
            } catch (err) {
                console.error("[LandingAds] fetch error:", err);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    /* ---------------- Responsive ---------------- */
    useEffect(() => {
        const compute = () => {
            const w = window.innerWidth;
            if (w < 768) setItemsPerView(1);
            else if (w < 1280) setItemsPerView(2);
            else setItemsPerView(3);
        };
        compute();
        window.addEventListener("resize", compute);
        return () => window.removeEventListener("resize", compute);
    }, []);

    const maxIndex = Math.max(0, ads.length - itemsPerView);

    /* ---------------- Nav ---------------- */
    const goTo = useCallback(
        (idx) => {
            const clamped = Math.max(0, Math.min(idx, maxIndex));
            setCurrentIndex(clamped);
        },
        [maxIndex]
    );
    const next = useCallback(
        () => goTo(currentIndex + 1),
        [currentIndex, goTo]
    );
    const prev = useCallback(
        () => goTo(currentIndex - 1),
        [currentIndex, goTo]
    );

    /* ✅ ریست ایندکس در صورت تغییر اندازه */
    useEffect(() => {
        if (currentIndex > maxIndex) setCurrentIndex(maxIndex);
    }, [maxIndex, currentIndex]);

    /* ---------------- Track view ---------------- */
    useEffect(() => {
        const ad = ads[currentIndex];
        if (!ad?._id) return;
        fetch(`/api/ads/${ad._id}/track`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "view" }),
        }).catch(() => {});
    }, [currentIndex, ads]);

    const handleClick = (adId) => {
        if (!adId) return;
        fetch(`/api/ads/${adId}/track`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "click" }),
        }).catch(() => {});
    };

    /* ---------------- Loading ---------------- */
    if (loading) {
        return (
            <section
                className="w-full py-10 sm:py-14"
                style={{ backgroundColor: DARK_BG }}
            >
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="h-8 w-52 rounded-lg mb-6 bg-white/10 animate-pulse" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {[1, 2].map((i) => (
                            <div
                                key={i}
                                className="h-[200px] rounded-2xl bg-white/5 animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!ads.length) return null;

    const GAP = 20;

    return (
        <section
            className="relative w-full py-10 sm:py-14 overflow-hidden"
            style={{ backgroundColor: DARK_BG }}
        >
            {/* درخشش طلایی محو در پس‌زمینه */}
            <div
                className="pointer-events-none absolute inset-0 opacity-50"
                aria-hidden="true"
            >
                <div
                    className="absolute -top-24 right-0 w-96 h-96 rounded-full blur-3xl"
                    style={{ backgroundColor: "rgba(198,161,76,0.15)" }}
                />
                <div
                    className="absolute -bottom-24 left-0 w-96 h-96 rounded-full blur-3xl"
                    style={{ backgroundColor: "rgba(198,161,76,0.10)" }}
                />
            </div>

            {/* ==================== Header ==================== */}
            <div className="relative flex items-start justify-between gap-4 mb-8 px-4 sm:px-6 lg:px-8">
                {/* عنوان (راست) */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div className="relative shrink-0">
                        <div
                            className="absolute inset-0 rounded-2xl blur-md"
                            style={{ backgroundColor: "rgba(198,161,76,0.4)" }}
                        />
                        <div
                            className="relative w-12 h-12 rounded-2xl flex items-center justify-center ring-1"
                            style={{
                                backgroundImage: GOLD_GRADIENT,
                                boxShadow:
                                    "0 4px 15px rgba(198, 161, 76, 0.25)",
                                borderColor: GOLD_LIGHT,
                            }}
                        >
                            <PiMegaphone
                                className="w-6 h-6 text-white"
                                aria-hidden="true"
                            />
                        </div>
                    </div>

                    <div className="min-w-0">
                        <div
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide mb-1.5"
                            style={{
                                backgroundColor: "rgba(198,161,76,0.1)",
                                border: "1px solid rgba(198,161,76,0.3)",
                                color: "#D3B263",
                            }}
                        >
                            <PiSparkleFill
                                className="w-2.5 h-2.5"
                                aria-hidden="true"
                            />
                            پیشنهاد تبلیغاتی
                        </div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                            کمپین‌های ویژه
                        </h2>
                        <p className="text-xs sm:text-sm mt-1 text-white/60">
                            فرصت‌های محدود با تخفیف‌های استثنایی
                        </p>
                    </div>
                </div>

                {/* 
                    ✅ دکمه‌های ناوبری (چپ)
                    - دکمه راست (→) = بعدی (جلو)
                    - دکمه چپ (←) = قبلی (عقب)
                */}
                <div className="flex items-center gap-2 shrink-0">
                    <NavButton
                        onClick={next}
                        disabled={currentIndex >= maxIndex}
                        aria-label="اسلاید بعدی"
                    >
                        <PiArrowRight className="w-4 h-4" />
                    </NavButton>
                    <NavButton
                        onClick={prev}
                        disabled={currentIndex === 0}
                        aria-label="اسلاید قبلی"
                    >
                        <PiArrowLeft className="w-4 h-4" />
                    </NavButton>

                    <Link
                        href="/halls"
                        className="hidden sm:inline-flex items-center gap-2 h-10 px-5 rounded-xl text-[#2A1F1F] text-xs font-extrabold focus-visible:outline-none focus-visible:ring-4 transition-all duration-300"
                        style={{
                            backgroundImage: GOLD_GRADIENT,
                            boxShadow: "0 4px 15px rgba(198, 161, 76, 0.25)",
                        }}
                    >
                        همه پیشنهادها
                        <PiArrowLeft className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>

            {/* ==================== Slider ==================== */}
            <div className="relative w-full">
                <div className="overflow-hidden w-full pr-4 sm:pr-6 lg:pr-8">
                    {/* 
                        ✅ translateX با علامت مثبت برای RTL
                        - با افزایش currentIndex، کارت‌ها به راست می‌روند (جلو)
                        - padding از سمت راست (pr) برای نمایان شدن کارت اول
                    */}
                    <div
                        ref={trackRef}
                        className="flex transition-transform duration-500 ease-out will-change-transform"
                        style={{
                            gap: `${GAP}px`,
                            transform: `translateX(calc(${currentIndex} * (100% / ${itemsPerView}) + ${
                                currentIndex * GAP
                            }px / ${itemsPerView}))`,
                        }}
                    >
                        {ads.map((ad, idx) => (
                            <AdCardH
                                key={ad._id || `ad-${idx}`}
                                ad={ad}
                                index={idx}
                                onClick={() => handleClick(ad._id)}
                                itemsPerView={itemsPerView}
                                gap={GAP}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ==================== Pagination ==================== */}
            {ads.length > itemsPerView && (
                <div className="flex items-center justify-center gap-2 mt-8 flex-wrap px-4">
                    {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => goTo(i)}
                            aria-label={`رفتن به اسلاید ${i + 1}`}
                            aria-current={i === currentIndex ? "true" : "false"}
                            className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 ${
                                i === currentIndex
                                    ? "w-8"
                                    : "w-2 bg-white/20 hover:bg-white/40"
                            }`}
                            style={
                                i === currentIndex
                                    ? {
                                          backgroundImage: GOLD_GRADIENT,
                                          boxShadow:
                                              "0 0 20px rgba(198, 161, 76, 0.3)",
                                      }
                                    : undefined
                            }
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

/* ============================================================
   AdCardH — Horizontal Card
   ============================================================ */
function AdCardH({ ad, onClick, itemsPerView, gap, index = 0 }) {
    const image =
        ad?.images?.[0] ||
        ad?.hall_id?.images?.[0] ||
        "/placeholder.jpg";
    const rating = ad?.rating ?? 4.5;
    const reviews = ad?.reviews_count ?? 0;
    const finalPrice = ad?.price ?? 0;
    const originalPrice = ad?.original_price ?? finalPrice;
    const city = ad?.hall_id?.city || ad?.city || "";
    const province = ad?.hall_id?.province || ad?.province || "";
    const sponsorName = ad?.sponsor || ad?.hall_id?.title || "";
    const discount =
        originalPrice > finalPrice && originalPrice > 0
            ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
            : 0;

    /* ✅ فرمول دقیق عرض هر کارت */
    const cardBasis = `calc((100% - ${(itemsPerView - 1) * gap}px) / ${itemsPerView})`;

    return (
        <Link
            href={ad.target_url || "#"}
            onClick={onClick}
            style={{ flex: `0 0 ${cardBasis}` }}
            aria-label={`مشاهده ${ad.title || "تبلیغ"}`}
            className="group relative flex flex-row h-[200px] sm:h-[210px] bg-white rounded-2xl overflow-hidden ring-1 ring-[#EDDCA9] hover:ring-[#D3B263] focus-visible:outline-none focus-visible:ring-4 transition-all duration-300 hover:-translate-y-1"
        >
            {/* تصویر (راست) */}
            <div className="relative shrink-0 w-[42%] sm:w-[40%] bg-[#FBF7EC] overflow-hidden">
                <Image
                    src={image}
                    alt={ad.title || "تبلیغ"}
                    fill
                    sizes="(max-width: 768px) 45vw, 25vw"
                    priority={index < 3}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                <div
                    className="absolute inset-0 bg-gradient-to-l from-black/40 via-transparent to-transparent"
                    aria-hidden="true"
                />

                {discount > 0 && (
                    <div className="absolute top-3 left-3 flex flex-col items-center justify-center w-12 h-12 rounded-full bg-red-500 text-white shadow-lg ring-4 ring-white/90 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-sm font-extrabold leading-none">
                            {discount}٪
                        </span>
                        <span className="text-[8px] font-bold mt-0.5">
                            تخفیف
                        </span>
                    </div>
                )}

                <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 text-[10px] text-white">
                    <PiStarFill
                        className="w-3 h-3 text-[#E0C67B]"
                        aria-hidden="true"
                    />
                    <span className="font-bold">
                        {Number(rating).toFixed(1)}
                    </span>
                    <span className="text-white/60">({reviews})</span>
                </div>
            </div>

            {/* محتوا (چپ) */}
            <div className="flex flex-col flex-1 p-4 bg-white min-w-0">
                <div className="flex items-center justify-between gap-2 mb-2">
                    {sponsorName ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FBF7EC] border border-[#EDDCA9] text-[#85672C] text-[10px] font-bold max-w-[55%]">
                            <PiSealCheckFill
                                className="w-3 h-3 shrink-0"
                                aria-hidden="true"
                            />
                            <span className="line-clamp-1">{sponsorName}</span>
                        </span>
                    ) : (
                        <span />
                    )}

                    {(province || city) && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 font-medium shrink-0">
                            <PiMapPin
                                className="w-3 h-3 text-[#C6A14C]"
                                aria-hidden="true"
                            />
                            {[province, city].filter(Boolean).join("، ")}
                        </span>
                    )}
                </div>

                <h3 className="text-sm sm:text-base font-extrabold text-[#3B2F2F] line-clamp-2 leading-snug group-hover:text-[#85672C] transition-colors">
                    {ad.title}
                </h3>

                {ad.description && (
                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mt-1.5">
                        {ad.description}
                    </p>
                )}

                <div className="border-t border-dashed border-[#EDDCA9] mt-auto pt-2.5" />

                <div className="flex items-center justify-between gap-3 mt-2">
                    <div className="flex flex-col min-w-0">
                        {originalPrice > finalPrice && originalPrice > 0 && (
                            <span className="text-[10px] text-gray-400 line-through leading-none">
                                {formatPrice(originalPrice)}
                            </span>
                        )}
                        <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="text-base sm:text-lg font-extrabold text-[#85672C] leading-none">
                                {formatPrice(finalPrice)}
                            </span>
                            <span className="text-[9px] text-gray-500 font-medium whitespace-nowrap">
                                تومان / شب
                            </span>
                        </div>
                    </div>

                    <span
                        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[#2A1F1F] text-xs font-extrabold shrink-0 transition-all duration-300 group-hover:shadow-lg"
                        style={{ backgroundImage: GOLD_GRADIENT }}
                    >
                        {ad.cta_text || "رزرو کن"}
                        <PiArrowLeft className="w-3.5 h-3.5" />
                    </span>
                </div>
            </div>
        </Link>
    );
}

/* ============================================================
   NavButton — Dark Theme
   ============================================================ */
function NavButton({ onClick, disabled, children, ...rest }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            {...rest}
            className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 ${
                disabled
                    ? "border-white/10 text-white/20 bg-white/5 cursor-not-allowed"
                    : "border-[#C6A14C]/60 text-[#E0C67B] bg-white/5 hover:bg-[#C6A14C] hover:text-[#2A1F1F] hover:border-transparent active:scale-95 cursor-pointer"
            }`}
        >
            {children}
        </button>
    );
}