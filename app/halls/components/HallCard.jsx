// app/halls/components/HallCard.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    PiMapPinFill,
    PiUsersThreeFill,
    PiCalendarBlank,
    PiTagFill,
    PiCaretLeft,
    PiCaretRight,
    PiHeart,
    PiArrowLeft,
} from "react-icons/pi";

/* ============================================================
   Helpers
   ============================================================ */
function normalizeImageUrl(url, fallback = "/images/placeholder-hall.jpg") {
    if (!url || typeof url !== "string") return fallback;
    const trimmed = url.trim();
    if (!trimmed) return fallback;
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://"))
        return trimmed;
    if (trimmed.startsWith("data:")) return trimmed;
    if (trimmed.startsWith("./")) return "/" + trimmed.slice(2);
    if (!trimmed.startsWith("/")) return "/" + trimmed;
    return trimmed;
}

function getHallImages(hall, fallback = "/images/placeholder-hall.jpg") {
    if (!hall) return [fallback];
    const raw = Array.isArray(hall.images) ? hall.images : [];
    const cleaned = raw
        .filter((img) => typeof img === "string" && img.trim())
        .map((img) => normalizeImageUrl(img, fallback));

    if (cleaned.length === 0) {
        const single = hall.image || hall.thumbnail;
        return [normalizeImageUrl(single, fallback)];
    }
    return cleaned;
}

const faNum = (n) => Number(n || 0).toLocaleString("fa-IR");

/* ============================================================
   PhotoSlider — ناوبری در هاور، swipe در موبایل
   ✅ focus-visible، aria-label، انیمیشن نرم
   ============================================================ */
function PhotoSlider({ images, alt, index }) {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);

    const total = images.length;
    const hasMultiple = total > 1;

    const goNext = useCallback(
        (e) => {
            e?.preventDefault();
            e?.stopPropagation();
            setDirection(1);
            setCurrent((c) => (c + 1) % total);
        },
        [total]
    );

    const goPrev = useCallback(
        (e) => {
            e?.preventDefault();
            e?.stopPropagation();
            setDirection(-1);
            setCurrent((c) => (c - 1 + total) % total);
        },
        [total]
    );

    /* Swipe */
    const onTouchStart = (e) => {
        touchEndX.current = null;
        touchStartX.current = e.targetTouches[0].clientX;
    };
    const onTouchMove = (e) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };
    const onTouchEnd = () => {
        if (touchStartX.current == null || touchEndX.current == null) return;
        const distance = touchStartX.current - touchEndX.current;
        if (distance > 50) goNext();
        else if (distance < -50) goPrev();
        touchStartX.current = null;
        touchEndX.current = null;
    };

    const variants = {
        enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir) => ({ x: dir < 0 ? "100%" : "-100%", opacity: 0 }),
    };

    return (
        <div
            className="relative h-52 sm:h-56 overflow-hidden rounded-t-2xl select-none bg-slate-100"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            role="region"
            aria-roledescription="carousel"
            aria-label={`تصاویر ${alt}`}
        >
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                    key={current}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                    }}
                    className="absolute inset-0"
                >
                    <Image
                        src={images[current]}
                        alt={`${alt} - تصویر ${current + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                        className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105 will-change-transform"
                        priority={index < 3}
                        loading={index < 3 ? "eager" : "lazy"}
                    />
                </motion.div>
            </AnimatePresence>

            {/* گرادیانت پایین */}
            <div
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"
                aria-hidden="true"
            />

            {/* ==================== دکمه‌های ناوبری ==================== */}
            {hasMultiple && (
                <>
                    {/* دکمه راست (تصویر بعدی) */}
                    <button
                        type="button"
                        onClick={goNext}
                        aria-label="تصویر بعدی"
                        className="
                            absolute right-2 top-1/2 -translate-y-1/2 z-20
                            w-9 h-9 rounded-full
                            flex items-center justify-center
                            bg-white/25 hover:bg-[#C6A14C]
                            backdrop-blur-md
                            text-white
                            ring-1 ring-white/40 hover:ring-[#C6A14C]
                            shadow-md hover:shadow-lg hover:shadow-[#C6A14C]/50
                            hover:scale-110 active:scale-95
                            focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/60
                            transition-all duration-200
                            cursor-pointer
                        "
                    >
                        <PiCaretRight className="w-4 h-4" strokeWidth={2.5} />
                    </button>

                    {/* دکمه چپ (تصویر قبلی) */}
                    <button
                        type="button"
                        onClick={goPrev}
                        aria-label="تصویر قبلی"
                        className="
                            absolute left-2 top-1/2 -translate-y-1/2 z-20
                            w-9 h-9 rounded-full
                            flex items-center justify-center
                            bg-white/25 hover:bg-[#C6A14C]
                            backdrop-blur-md
                            text-white
                            ring-1 ring-white/40 hover:ring-[#C6A14C]
                            shadow-md hover:shadow-lg hover:shadow-[#C6A14C]/50
                            hover:scale-110 active:scale-95
                            focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/60
                            transition-all duration-200
                            cursor-pointer
                        "
                    >
                        <PiCaretLeft className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                </>
            )}

            {/* شمارنده تصویر */}
            {hasMultiple && (
                <div
                    className="absolute bottom-3 left-3 z-20 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md text-white text-[10px] font-bold"
                    aria-hidden="true"
                >
                    {faNum(current + 1)} / {faNum(total)}
                </div>
            )}
        </div>
    );
}

/* ============================================================
   HallCard — گرید و لیست
   ============================================================ */
export default function HallCard({ hall, index = 0, viewMode = "grid" }) {
    const [isFavorite, setIsFavorite] = useState(hall?.isFavorite || false);

    if (!hall) return null;

    const images = getHallImages(hall);
    const hallUrl = `/halls/${hall._id || hall.id}`;

    const price = Number(hall.sans_price || 0);
    const discount = Number(hall.sans_discount || 0);
    const finalPrice = Math.max(price - discount, 0);
    const hasPrice = price > 0;
    const hasDiscount = discount > 0;

    /* دکمه علاقه‌مندی مشترک */
    const FavoriteButton = (
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsFavorite((v) => !v);
            }}
            aria-label={isFavorite ? "حذف از علاقه‌مندی" : "افزودن به علاقه‌مندی"}
            className={`
                absolute top-3 left-3 z-20
                w-9 h-9 rounded-full flex items-center justify-center
                backdrop-blur-md transition-all duration-300
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-300/60
                active:scale-90
                ${
                    isFavorite
                        ? "bg-rose-500 text-white shadow-lg shadow-rose-500/40"
                        : "bg-white/90 text-slate-500 hover:text-rose-500 hover:bg-white shadow-md"
                }
            `}
        >
            <PiHeart
                className={`w-4 h-4 ${isFavorite ? "fill-white" : ""}`}
                aria-hidden="true"
            />
        </button>
    );

    /* بج تخفیف */
    const DiscountBadge = hasDiscount ? (
        <div className="absolute top-3 right-3 z-20">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-500 text-white text-[11px] font-bold shadow-md">
                <PiTagFill className="w-3 h-3" aria-hidden="true" />
                {faNum(discount)}٪
            </span>
        </div>
    ) : null;

    /* ============================================================
       حالت LIST
       ============================================================ */
    if (viewMode === "list") {
        return (
            <motion.article
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.3,
                    delay: Math.min(index * 0.03, 0.3),
                }}
                className="
                    group/card bg-white rounded-2xl
                    border border-gray-100
                    shadow-sm hover:shadow-xl hover:shadow-slate-900/5
                    focus-within:ring-2 focus-within:ring-[#C6A14C]/40
                    transition-all duration-300
                    flex flex-col md:flex-row
                    overflow-hidden
                "
            >
                {/* اسلایدر */}
                <div className="relative w-full md:w-72 lg:w-80 flex-shrink-0">
                    <PhotoSlider
                        images={images}
                        alt={hall.title || "تالار"}
                        index={index}
                    />
                    {DiscountBadge}
                    {FavoriteButton}
                </div>

                {/* محتوا */}
                <div className="flex-1 p-5 flex flex-col min-w-0">
                    {/* عنوان و موقعیت */}
                    <div className="mb-3">
                        <Link
                            href={hallUrl}
                            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A14C]/40 rounded"
                        >
                            <h3 className="text-base sm:text-lg font-bold line-clamp-1 text-[#2C2418] group-hover/card:text-[#A8853A] transition-colors">
                                {hall.title}
                            </h3>
                        </Link>
                        <div className="flex items-center text-xs gap-1.5 text-gray-500 mt-1.5">
                            <PiMapPinFill
                                className="w-3.5 h-3.5 text-[#C6A14C] shrink-0"
                                aria-hidden="true"
                            />
                            <span className="truncate">
                                {hall.city}
                                {hall.province && (
                                    <span className="text-gray-400">
                                        {" "}
                                        | {hall.province}
                                    </span>
                                )}
                            </span>
                        </div>
                    </div>

                    {/* توضیحات */}
                    <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                        {hall.description ||
                            "لورم ایپسوم متن تستی برای توضیحات تالار"}
                    </p>

                    {/* ویژگی‌ها */}
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-4">
                        <span className="inline-flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg">
                            <PiUsersThreeFill
                                className="w-3.5 h-3.5 text-[#C6A14C]"
                                aria-hidden="true"
                            />
                            {faNum(hall.capacity)} نفر
                        </span>
                        {hall.duration && (
                            <span className="inline-flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg">
                                <PiCalendarBlank
                                    className="w-3.5 h-3.5 text-[#C6A14C]"
                                    aria-hidden="true"
                                />
                                {faNum(hall.duration)} ساعت
                            </span>
                        )}
                        {hall.hall_type && (
                            <span className="bg-gray-50 px-2.5 py-1 rounded-lg">
                                {hall.hall_type}
                            </span>
                        )}
                    </div>

                    {/* قیمت و دکمه */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                        <div className="flex flex-col">
                            {hasPrice ? (
                                <>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-base sm:text-lg font-black text-[#C6A14C] leading-none">
                                            {faNum(finalPrice)}
                                        </span>
                                        <span className="text-[10px] text-gray-400">
                                            تومان
                                        </span>
                                    </div>
                                    {hasDiscount && price > finalPrice && (
                                        <span className="text-[10px] text-gray-400 line-through mt-0.5">
                                            {faNum(price)} تومان
                                        </span>
                                    )}
                                </>
                            ) : (
                                <span className="text-xs text-gray-400">
                                    تماس بگیرید
                                </span>
                            )}
                        </div>

                        <Link
                            href={hallUrl}
                            className="
                                inline-flex items-center gap-1.5
                                text-xs font-bold
                                border-2 border-[#C6A14C]
                                px-4 py-2 rounded-lg
                                text-[#C6A14C]
                                hover:bg-[#C6A14C] hover:text-white hover:shadow-md
                                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/40
                                transition-all duration-200
                            "
                        >
                            <span>مشاهده و رزرو</span>
                            <PiArrowLeft
                                className="w-3.5 h-3.5"
                                aria-hidden="true"
                            />
                        </Link>
                    </div>
                </div>
            </motion.article>
        );
    }

    /* ============================================================
       حالت GRID (پیش‌فرض)
       ============================================================ */
    return (
        <motion.article
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.3,
                delay: Math.min(index * 0.03, 0.3),
            }}
            className="
                group/card bg-white rounded-2xl
                border border-gray-100
                shadow-sm hover:shadow-xl hover:shadow-slate-900/5
                focus-within:ring-2 focus-within:ring-[#C6A14C]/40
                transition-all duration-300
                flex flex-col
                hover:-translate-y-1 will-change-transform
                overflow-hidden
            "
        >
            {/* ==================== اسلایدر ==================== */}
            <div className="relative">
                <PhotoSlider
                    images={images}
                    alt={hall.title || "تالار"}
                    index={index}
                />
                {DiscountBadge}
                {FavoriteButton}
            </div>

            {/* ==================== محتوا ==================== */}
            <div className="p-4 flex flex-col flex-grow">
                {/* عنوان و موقعیت */}
                <div className="mb-2">
                    <Link
                        href={hallUrl}
                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A14C]/40 rounded"
                    >
                        <h3 className="text-base font-bold line-clamp-1 text-[#2C2418] group-hover/card:text-[#A8853A] transition-colors">
                            {hall.title}
                        </h3>
                    </Link>
                    <div className="flex items-center text-xs gap-1 text-gray-500 mt-1">
                        <PiMapPinFill
                            className="w-3 h-3 text-[#C6A14C] shrink-0"
                            aria-hidden="true"
                        />
                        <span className="truncate">
                            {hall.city}
                            {hall.province && (
                                <span className="text-gray-400">
                                    {" "}
                                    | {hall.province}
                                </span>
                            )}
                        </span>
                    </div>
                </div>

                {/* توضیحات */}
                <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                    {hall.description ||
                        "لورم ایپسوم متن تستی برای توضیحات تالار"}
                </p>

                {/* ویژگی‌ها */}
                <div className="flex flex-wrap gap-1.5 text-xs text-gray-600 mb-3">
                    <span className="inline-flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                        <PiUsersThreeFill
                            className="w-3.5 h-3.5 text-[#C6A14C]"
                            aria-hidden="true"
                        />
                        {faNum(hall.capacity)} نفر
                    </span>
                    {hall.duration && (
                        <span className="inline-flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                            <PiCalendarBlank
                                className="w-3.5 h-3.5 text-[#C6A14C]"
                                aria-hidden="true"
                            />
                            {faNum(hall.duration)} ساعت
                        </span>
                    )}
                    {hall.hall_type && (
                        <span className="bg-gray-50 px-2 py-1 rounded-lg">
                            {hall.hall_type}
                        </span>
                    )}
                </div>

                {/* قیمت و دکمه */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                    <div className="flex flex-col">
                        {hasPrice ? (
                            <>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm sm:text-base font-black text-[#C6A14C] leading-none">
                                        {faNum(finalPrice)}
                                    </span>
                                    <span className="text-[10px] text-gray-400">
                                        تومان
                                    </span>
                                </div>
                                {hasDiscount && price > finalPrice && (
                                    <span className="text-[10px] text-gray-400 line-through mt-0.5">
                                        {faNum(price)} تومان
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="text-xs text-gray-400">
                                تماس بگیرید
                            </span>
                        )}
                    </div>

                    <Link
                        href={hallUrl}
                        className="
                            inline-flex items-center gap-1
                            text-xs font-bold
                            border-2 border-[#C6A14C]
                            px-3 py-1.5 rounded-lg
                            text-[#C6A14C]
                            hover:bg-[#C6A14C] hover:text-white hover:shadow-md
                            focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/40
                            transition-all duration-200
                        "
                    >
                        <span>مشاهده و رزرو</span>
                        <PiArrowLeft className="w-3 h-3" aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </motion.article>
    );
}