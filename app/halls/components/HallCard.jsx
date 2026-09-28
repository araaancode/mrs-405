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
   PhotoSlider — دکمه‌های طلایی در هاور
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
            className="relative h-44 overflow-hidden rounded-t-2xl select-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
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
                        sizes="300px"
                        className="object-cover transition-transform duration-500 group-hover/card:scale-105 will-change-transform"
                        priority={index < 3}
                        loading={index < 3 ? "eager" : "lazy"}
                    />
                </motion.div>
            </AnimatePresence>

            {/* گرادیانت */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

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
              w-8 h-8 rounded-full
              flex items-center justify-center
              bg-white/25 hover:bg-[#C6A14C]
              backdrop-blur-md
              text-white
              ring-1 ring-white/40 hover:ring-[#C6A14C]
              shadow-md hover:shadow-lg hover:shadow-[#C6A14C]/50
              hover:scale-110 active:scale-95
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
              w-8 h-8 rounded-full
              flex items-center justify-center
              bg-white/25 hover:bg-[#C6A14C]
              backdrop-blur-md
              text-white
              ring-1 ring-white/40 hover:ring-[#C6A14C]
              shadow-md hover:shadow-lg hover:shadow-[#C6A14C]/50
              hover:scale-110 active:scale-95
              transition-all duration-200
              cursor-pointer
            "
                    >
                        <PiCaretLeft className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                </>
            )}
        </div>
    );
}

/* ============================================================
   HallCard
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

    /* ============================================================
       حالت LIST
       ============================================================ */
    if (viewMode === "list") {
        return (
            <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
                className="
          group/card bg-white rounded-2xl
          border border-gray-100
          shadow-md hover:shadow-lg
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

                    {hasDiscount && (
                        <div className="absolute top-3 right-3 z-20">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500 text-white text-[10px] font-bold shadow-md">
                                <PiTagFill className="w-3 h-3" />
                                {faNum(discount)}٪
                            </span>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsFavorite((v) => !v);
                        }}
                        aria-label="علاقه‌مندی"
                        className={`
              absolute top-3 left-3 z-20
              w-8 h-8 rounded-full flex items-center justify-center
              backdrop-blur-md transition-all duration-300
              ${isFavorite
                                ? "bg-rose-500 text-white shadow-lg"
                                : "bg-white/90 text-slate-500 hover:text-rose-500 hover:bg-white"
                            }
            `}
                    >
                        <PiHeart
                            className={`w-4 h-4 ${isFavorite ? "fill-white" : ""}`}
                        />
                    </button>
                </div>

                {/* محتوا */}
                <div className="flex-1 p-4 flex flex-col">
                    {/* عنوان و موقعیت */}
                    <div className="mb-2">
                        <Link href={hallUrl}>
                            <h3 className="text-base font-bold line-clamp-1 text-[#2C2418] group-hover/card:text-[#B8922E] transition-colors">
                                {hall.title}
                            </h3>
                        </Link>
                        <div className="flex items-center text-xs gap-1 text-gray-500 mt-1">
                            <PiMapPinFill className="w-3 h-3 text-[#C6A14C]" />
                            <span>{hall.city}</span>
                            {hall.province && (
                                <span className="text-gray-400">| {hall.province}</span>
                            )}
                        </div>
                    </div>

                    {/* توضیحات */}
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                        {hall.description || "لورم ایپسوم متن تستی برای توضیحات تالار"}
                    </p>

                    {/* ویژگی‌ها */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                            <PiUsersThreeFill className="w-3.5 h-3.5 text-[#C6A14C]" />
                            {faNum(hall.capacity)} نفر
                        </span>
                        {hall.duration && (
                            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                                <PiCalendarBlank className="w-3.5 h-3.5 text-[#C6A14C]" />
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
                        <div>
                            {hasPrice ? (
                                <>
                                    <span className="text-sm font-black text-[#C6A14C]">
                                        {faNum(finalPrice)}
                                    </span>
                                    <span className="text-[10px] text-gray-400 mr-1">
                                        تومان
                                    </span>
                                    {hasDiscount && price > finalPrice && (
                                        <div className="text-[10px] text-gray-400 line-through">
                                            {faNum(price)} تومان
                                        </div>
                                    )}
                                </>
                            ) : (
                                <span className="text-xs text-gray-400">تماس بگیرید</span>
                            )}
                        </div>

                        <Link
                            href={hallUrl}
                            className="
                text-xs border-2 border-[#C6A14C]
                px-4 py-1.5 rounded-lg font-medium
                text-[#C6A14C]
                hover:bg-[#C6A14C] hover:text-white
                transition-all duration-200 hover:shadow-md
              "
                        >
                            مشاهده و رزرو
                        </Link>
                    </div>
                </div>
            </motion.div>
        );
    }

    /* ============================================================
       حالت GRID
       ============================================================ */
    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
            className="
        group/card bg-white rounded-2xl
        border border-gray-100
        shadow-md hover:shadow-lg
        transition-all duration-300
        flex flex-col
        hover:-translate-y-1 will-change-transform
        overflow-hidden
      "
        >
            {/* ==================== اسلایدر عکس ==================== */}
            <div className="relative">
                <PhotoSlider
                    images={images}
                    alt={hall.title || "تالار"}
                    index={index}
                />

                {/* تخفیف — بالا راست */}
                {hasDiscount && (
                    <div className="absolute top-3 right-3 z-20">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500 text-white text-[10px] font-bold shadow-md">
                            <PiTagFill className="w-3 h-3" />
                            {faNum(discount)}٪
                        </span>
                    </div>
                )}

                {/* علاقه‌مندی — بالا چپ */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsFavorite((v) => !v);
                    }}
                    aria-label={isFavorite ? "حذف از علاقه‌مندی" : "علاقه‌مندی"}
                    className={`
            absolute top-3 left-3 z-20
            w-8 h-8 rounded-full flex items-center justify-center
            backdrop-blur-md transition-all duration-300
            ${isFavorite
                            ? "bg-rose-500 text-white shadow-lg shadow-rose-500/40"
                            : "bg-white/90 text-slate-500 hover:text-rose-500 hover:bg-white"
                        }
          `}
                >
                    <PiHeart
                        className={`w-4 h-4 ${isFavorite ? "fill-white" : ""}`}
                    />
                </button>
            </div>

            {/* ==================== محتوای کارت ==================== */}
            <div className="p-4 flex flex-col flex-grow">
                {/* عنوان و موقعیت */}
                <div className="mb-2">
                    <Link href={hallUrl}>
                        <h3 className="text-base font-bold line-clamp-1 text-[#2C2418] group-hover/card:text-[#C6A14C] transition-colors">
                            {hall.title}
                        </h3>
                    </Link>
                    <div className="flex items-center text-xs gap-1 text-gray-500 mt-1">
                        <PiMapPinFill className="w-3 h-3 text-[#C6A14C]" />
                        <span>{hall.city}</span>
                        {hall.province && (
                            <span className="text-gray-400">| {hall.province}</span>
                        )}
                    </div>
                </div>

                {/* توضیحات */}
                <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                    {hall.description || "لورم ایپسوم متن تستی برای توضیحات تالار"}
                </p>

                {/* ویژگی‌ها */}
                <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                        <PiUsersThreeFill className="w-3.5 h-3.5 text-[#C6A14C]" />
                        {faNum(hall.capacity)} نفر
                    </span>
                    {hall.duration && (
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                            <PiCalendarBlank className="w-3.5 h-3.5 text-[#C6A14C]" />
                            {faNum(hall.duration)} ساعت
                        </span>
                    )}
                    {hall.hall_type && (
                        <span className="bg-gray-50 px-2 py-1 rounded-lg">
                            {hall.hall_type}
                        </span>
                    )}
                </div>

                {/* نشان تخفیف */}
                {hasDiscount && (
                    <div className="text-xs text-green-600 flex items-center gap-1 mb-2 bg-green-50 px-2 py-1 rounded-lg w-fit">
                        <PiTagFill className="w-3.5 h-3.5" />
                        <span className="font-bold">{faNum(discount)}%</span>
                        <span>تخفیف ویژه</span>
                    </div>
                )}

                {/* قیمت و دکمه */}
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                    <div>
                        {hasPrice ? (
                            <>
                                <span className="text-sm font-black text-[#C6A14C]">
                                    {faNum(finalPrice)}
                                </span>
                                <span className="text-[10px] text-gray-400 mr-1">
                                    تومان
                                </span>
                                {hasDiscount && price > finalPrice && (
                                    <div className="text-[10px] text-gray-400 line-through">
                                        {faNum(price)} تومان
                                    </div>
                                )}
                            </>
                        ) : (
                            <span className="text-xs text-gray-400">تماس بگیرید</span>
                        )}
                    </div>

                    <Link
                        href={hallUrl}
                        className="
              group/btn text-xs border-2 border-[#C6A14C]
              px-4 py-1.5 rounded-lg font-medium
              text-[#C6A14C]
              hover:bg-[#C6A14C] hover:text-white
              transition-all duration-200 hover:shadow-md
            "
                    >
                        مشاهده و رزرو
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}