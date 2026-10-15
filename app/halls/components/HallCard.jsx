// app/halls/components/HallCard.jsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useCallback, useEffect, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    PiMapPinFill,
    PiUsersThreeFill,
    PiCalendarBlank,
    PiTagFill,
    PiCaretLeft,
    PiCaretRight,
    PiHeart,
    PiArrowLeft,
} from 'react-icons/pi'

/* ============================================================
   Constants
   ============================================================ */
const PLACEHOLDER = '/images/placeholder-hall.jpg'
const GOLD_GRADIENT = 'linear-gradient(135deg, #D3B263 0%, #C6A14C 50%, #A8853A 100%)'

const FA_NUM = new Intl.NumberFormat('fa-IR')
const faNum = (n) => FA_NUM.format(Number(n) || 0)

/* ============================================================
   Helpers
   ============================================================ */
function normalizeImageUrl(url, fallback = PLACEHOLDER) {
    if (!url || typeof url !== 'string') return fallback
    const trimmed = url.trim()
    if (!trimmed) return fallback
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://'))
        return trimmed
    if (trimmed.startsWith('data:')) return trimmed
    if (trimmed.startsWith('./')) return '/' + trimmed.slice(2)
    if (!trimmed.startsWith('/')) return '/' + trimmed
    return trimmed
}

function getHallImages(hall, fallback = PLACEHOLDER) {
    if (!hall) return [fallback]
    const raw = Array.isArray(hall.images) ? hall.images : []
    const cleaned = raw
        .filter((img) => typeof img === 'string' && img.trim())
        .map((img) => normalizeImageUrl(img, fallback))

    if (cleaned.length === 0) {
        const single = hall.image || hall.thumbnail
        return [normalizeImageUrl(single, fallback)]
    }
    return cleaned
}

/**
 * محاسبه قیمت — سازگار با Schema (sans_discount = درصد)
 */
function computePricing(hall) {
    const price = Number(hall?.sans_price || 0)
    const discountPercent = Number(hall?.sans_discount || 0)
    const mainPrice = Number(hall?.main_price || 0)

    const discountAmount = Math.round((price * discountPercent) / 100)
    const finalPrice = Math.max(price - discountAmount, 0)

    const strikethroughPrice =
        mainPrice > price ? mainPrice : discountPercent > 0 ? price : 0

    return {
        price,
        finalPrice,
        discountPercent,
        discountAmount,
        mainPrice: strikethroughPrice,
        hasDiscount: discountPercent > 0 && price > 0,
        hasPrice: price > 0,
    }
}

/* ============================================================
   PhotoSlider
   ============================================================ */
const PhotoSlider = memo(function PhotoSlider({ images, alt, index }) {
    const [current, setCurrent] = useState(0)
    const [direction, setDirection] = useState(0)
    const [imgErrors, setImgErrors] = useState({})
    const touchStartX = useRef(null)
    const touchEndX = useRef(null)

    const total = images.length
    const hasMultiple = total > 1

    // اگر لیست تصاویر تغییر کرد، ایندکس را ریست کن
    useEffect(() => {
        setCurrent(0)
    }, [images])

    const goNext = useCallback(
        (e) => {
            e?.preventDefault()
            e?.stopPropagation()
            setDirection(1)
            setCurrent((c) => (c + 1) % total)
        },
        [total]
    )

    const goPrev = useCallback(
        (e) => {
            e?.preventDefault()
            e?.stopPropagation()
            setDirection(-1)
            setCurrent((c) => (c - 1 + total) % total)
        },
        [total]
    )

    /* Swipe */
    const onTouchStart = useCallback((e) => {
        touchEndX.current = null
        touchStartX.current = e.targetTouches[0].clientX
    }, [])

    const onTouchMove = useCallback((e) => {
        touchEndX.current = e.targetTouches[0].clientX
    }, [])

    const onTouchEnd = useCallback(() => {
        if (touchStartX.current == null || touchEndX.current == null) return
        const distance = touchStartX.current - touchEndX.current
        if (distance > 50) goNext()
        else if (distance < -50) goPrev()
        touchStartX.current = null
        touchEndX.current = null
    }, [goNext, goPrev])

    /* Keyboard */
    const onKeyDown = useCallback(
        (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault()
                goNext()
            } else if (e.key === 'ArrowRight') {
                e.preventDefault()
                goPrev()
            }
        },
        [goNext, goPrev]
    )

    const variants = {
        enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
    }

    const currentSrc = imgErrors[current] ? PLACEHOLDER : images[current]

    return (
        <div
            className="
                relative h-52 sm:h-56 overflow-hidden rounded-t-2xl select-none
                bg-slate-100
            "
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onKeyDown={hasMultiple ? onKeyDown : undefined}
            tabIndex={hasMultiple ? 0 : -1}
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
                        x: { type: 'spring', stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                    }}
                    className="absolute inset-0"
                >
                    <Image
                        src={currentSrc}
                        alt={`${alt} - تصویر ${current + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                        className="
                            object-cover
                            transition-transform duration-700 ease-out
                            group-hover/card:scale-105
                            will-change-transform
                            motion-reduce:transition-none motion-reduce:group-hover/card:scale-100
                        "
                        priority={index < 3}
                        loading={index < 3 ? 'eager' : 'lazy'}
                        onError={() =>
                            setImgErrors((prev) => ({
                                ...prev,
                                [current]: true,
                            }))
                        }
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
                            opacity-0 group-hover/card:opacity-100 focus-visible:opacity-100
                        "
                    >
                        <PiCaretRight className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
                    </button>

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
                            opacity-0 group-hover/card:opacity-100 focus-visible:opacity-100
                        "
                    >
                        <PiCaretLeft className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
                    </button>
                </>
            )}

            {/* شمارنده تصویر */}
            {hasMultiple && (
                <div
                    className="
                        absolute bottom-3 left-3 z-20
                        px-2.5 py-1 rounded-full
                        bg-black/55 backdrop-blur-md
                        text-white text-[10px] font-bold
                        tabular-nums
                    "
                    aria-hidden="true"
                >
                    {faNum(current + 1)} / {faNum(total)}
                </div>
            )}
        </div>
    )
})

/* ============================================================
   FavoriteButton
   ============================================================ */
const FavoriteButton = memo(function FavoriteButton({
    initialFavorite = false,
    hallId,
}) {
    const [isFavorite, setIsFavorite] = useState(initialFavorite)

    useEffect(() => {
        setIsFavorite(initialFavorite)
    }, [initialFavorite])

    const handleClick = useCallback(
        (e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsFavorite((v) => !v)

            // 🔔 اینجا می‌تونی API صدا بزنی
            // fetch(`/api/halls/${hallId}/favorite`, { method: 'POST' })
            //     .catch(() => setIsFavorite((v) => !v))
        },
        [hallId]
    )

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={isFavorite ? 'حذف از علاقه‌مندی' : 'افزودن به علاقه‌مندی'}
            aria-pressed={isFavorite}
            className={`
                absolute top-3 left-3 z-20
                w-9 h-9 rounded-full
                flex items-center justify-center
                backdrop-blur-md
                transition-all duration-300
                active:scale-90
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/60
                motion-reduce:transition-none
                ${
                    isFavorite
                        ? 'bg-[#C6A14C] text-white shadow-lg shadow-[#C6A14C]/40'
                        : 'bg-white/90 text-slate-500 hover:text-[#C6A14C] hover:bg-white shadow-md'
                }
            `}
        >
            <PiHeart
                className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`}
                aria-hidden="true"
            />
        </button>
    )
})

/* ============================================================
   DiscountBadge
   ============================================================ */
const DiscountBadge = memo(function DiscountBadge({ percent }) {
    if (!percent || percent <= 0) return null

    return (
        <div className="absolute top-3 right-3 z-20">
            <span
                className="
                    inline-flex items-center gap-1
                    px-2.5 py-1 rounded-lg
                    text-white text-[11px] font-bold
                    shadow-[0_4px_12px_-2px_rgba(198,161,76,0.5)]
                "
                style={{ backgroundImage: GOLD_GRADIENT }}
            >
                <PiTagFill className="w-3 h-3" aria-hidden="true" />
                {faNum(percent)}٪
            </span>
        </div>
    )
})

/* ============================================================
   Features — چیپ‌های ویژگی
   ============================================================ */
const Features = memo(function Features({ hall, size = 'sm' }) {
    const padding = size === 'lg' ? 'px-2.5 py-1' : 'px-2 py-1'
    const gap = size === 'lg' ? 'gap-2' : 'gap-1.5'

    return (
        <div className={`flex flex-wrap ${gap} text-xs text-gray-600`}>
            {hall.capacity && (
                <span
                    className={`inline-flex items-center gap-1 bg-gray-50 ${padding} rounded-lg`}
                >
                    <PiUsersThreeFill
                        className="w-3.5 h-3.5 text-[#C6A14C]"
                        aria-hidden="true"
                    />
                    {faNum(hall.capacity)} نفر
                </span>
            )}
            {hall.duration && (
                <span
                    className={`inline-flex items-center gap-1 bg-gray-50 ${padding} rounded-lg`}
                >
                    <PiCalendarBlank
                        className="w-3.5 h-3.5 text-[#C6A14C]"
                        aria-hidden="true"
                    />
                    {faNum(hall.duration)} ساعت
                </span>
            )}
            {hall.hall_type && (
                <span className={`bg-gray-50 ${padding} rounded-lg`}>
                    {hall.hall_type}
                </span>
            )}
        </div>
    )
})

/* ============================================================
   PriceBlock
   ============================================================ */
const PriceBlock = memo(function PriceBlock({ pricing, size = 'sm' }) {
    const { finalPrice, hasPrice, hasDiscount, mainPrice } = pricing
    const priceSize = size === 'lg' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'

    if (!hasPrice) {
        return <span className="text-xs text-gray-400">تماس بگیرید</span>
    }

    return (
        <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
                <span
                    className={`${priceSize} font-black text-[#C6A14C] leading-none tabular-nums`}
                >
                    {faNum(finalPrice)}
                </span>
                <span className="text-[10px] text-gray-400">تومان</span>
            </div>
            {hasDiscount && mainPrice > finalPrice && (
                <span className="text-[10px] text-gray-400 line-through mt-0.5 tabular-nums">
                    {faNum(mainPrice)} تومان
                </span>
            )}
        </div>
    )
})

/* ============================================================
   CTAButton
   ============================================================ */
const CTAButton = memo(function CTAButton({ href, size = 'sm' }) {
    const padding = size === 'lg' ? 'px-4 py-2' : 'px-3 py-1.5'
    const iconSize = size === 'lg' ? 'w-3.5 h-3.5' : 'w-3 h-3'

    return (
        <Link
            href={href}
            className={`
                inline-flex items-center gap-1.5
                text-xs font-bold
                border-2 border-[#C6A14C]
                ${padding} rounded-lg
                text-[#C6A14C]
                hover:bg-[#C6A14C] hover:text-white
                hover:shadow-[0_4px_12px_-2px_rgba(198,161,76,0.5)]
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/40
                transition-all duration-200
                motion-reduce:transition-none
            `}
        >
            <span>مشاهده و رزرو</span>
            <PiArrowLeft className={iconSize} aria-hidden="true" />
        </Link>
    )
})

/* ============================================================
   HallCard
   ============================================================ */
function HallCard({ hall, index = 0, viewMode = 'grid' }) {
    if (!hall) return null

    const images = getHallImages(hall)
    const hallUrl = `/halls/${hall._id || hall.id}`
    const pricing = computePricing(hall)

    const isList = viewMode === 'list'
    const titleSize = isList ? 'text-base sm:text-lg' : 'text-base'

    /* ============================================================
       List Mode
       ============================================================ */
    if (isList) {
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
                    shadow-[0_2px_16px_-4px_rgba(15,23,42,0.08)]
                    hover:shadow-[0_20px_40px_-12px_rgba(15,23,42,0.15)]
                    focus-within:ring-2 focus-within:ring-[#C6A14C]/40
                    transition-shadow duration-300
                    flex flex-col md:flex-row
                    overflow-hidden
                "
            >
                <div className="relative w-full md:w-72 lg:w-80 shrink-0">
                    <PhotoSlider
                        images={images}
                        alt={hall.title || 'تالار'}
                        index={index}
                    />
                    <DiscountBadge percent={pricing.discountPercent} />
                    <FavoriteButton
                        initialFavorite={hall?.isFavorite}
                        hallId={hall._id}
                    />
                </div>

                <div className="flex-1 p-5 flex flex-col min-w-0">
                    <div className="mb-3">
                        <Link
                            href={hallUrl}
                            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A14C]/40 rounded"
                        >
                            <h3
                                className={`${titleSize} font-bold line-clamp-1 text-[#2C2418] group-hover/card:text-[#A8853A] transition-colors`}
                            >
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
                                        {' '}
                                        | {hall.province}
                                    </span>
                                )}
                            </span>
                        </div>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                        {hall.description || 'توضیحات این تالار به زودی تکمیل می‌شود'}
                    </p>

                    <div className="mb-4">
                        <Features hall={hall} size="lg" />
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                        <PriceBlock pricing={pricing} size="lg" />
                        <CTAButton href={hallUrl} size="lg" />
                    </div>
                </div>
            </motion.article>
        )
    }

    /* ============================================================
       Grid Mode
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
                shadow-[0_2px_16px_-4px_rgba(15,23,42,0.08)]
                hover:shadow-[0_20px_40px_-12px_rgba(15,23,42,0.15)]
                focus-within:ring-2 focus-within:ring-[#C6A14C]/40
                transition-[transform,box-shadow] duration-300
                flex flex-col
                hover:-translate-y-1
                will-change-transform
                motion-reduce:transition-none motion-reduce:hover:translate-y-0
                overflow-hidden
            "
        >
            <div className="relative">
                <PhotoSlider
                    images={images}
                    alt={hall.title || 'تالار'}
                    index={index}
                />
                <DiscountBadge percent={pricing.discountPercent} />
                <FavoriteButton
                    initialFavorite={hall?.isFavorite}
                    hallId={hall._id}
                />
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <div className="mb-2">
                    <Link
                        href={hallUrl}
                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A14C]/40 rounded"
                    >
                        <h3
                            className={`${titleSize} font-bold line-clamp-1 text-[#2C2418] group-hover/card:text-[#A8853A] transition-colors`}
                        >
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
                                    {' '}
                                    | {hall.province}
                                </span>
                            )}
                        </span>
                    </div>
                </div>

                <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                    {hall.description || 'توضیحات این تالار به زودی تکمیل می‌شود'}
                </p>

                <div className="mb-3">
                    <Features hall={hall} size="sm" />
                </div>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                    <PriceBlock pricing={pricing} size="sm" />
                    <CTAButton href={hallUrl} size="sm" />
                </div>
            </div>
        </motion.article>
    )
}

export default memo(HallCard)