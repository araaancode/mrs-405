// app/halls/components/HallCard.jsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useCallback, useEffect, memo, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    PiMapPinFill,
    PiUsersThreeFill,
    PiCalendarBlank,
    PiTagFill,
    PiCaretLeftBold,
    PiCaretRightBold,
    PiHeart,
    PiArrowLeft,
    PiPhoneCall,
    PiFireFill,
} from 'react-icons/pi'

/* ============================================================
   Constants
   ============================================================ */
const PLACEHOLDER = '/images/placeholder-hall.jpg'

const FA_NUM = new Intl.NumberFormat('fa-IR')
const faNum = (n) => FA_NUM.format(Number(n) || 0)

/* ============================================================
   Helpers
   ============================================================ */
function normalizeImageUrl(url, fallback = PLACEHOLDER) {
    if (!url || typeof url !== 'string') return fallback
    const trimmed = url.trim()
    if (!trimmed) return fallback
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
    if (trimmed.startsWith('data:')) return trimmed
    if (trimmed.startsWith('./')) return '/' + trimmed.slice(2)
    if (!trimmed.startsWith('/')) return '/' + trimmed
    return trimmed
}

function getHallImages(hall, fallback = PLACEHOLDER) {
    if (!hall) return [fallback]

    const buckets = [
        hall.images,
        hall.photos,
        hall.gallery,
        hall.image_urls,
        hall.imageUrls,
        hall.pictures,
    ]

    const result = []
    const seen = new Set()

    const push = (raw) => {
        if (!raw) return
        if (Array.isArray(raw)) {
            raw.forEach((item) => {
                let url
                if (typeof item === 'string') url = item
                else if (item && typeof item === 'object')
                    url = item.url || item.src || item.path || item.image || item.link
                if (url && typeof url === 'string' && url.trim()) {
                    const normalized = normalizeImageUrl(url, fallback)
                    if (!seen.has(normalized)) {
                        seen.add(normalized)
                        result.push(normalized)
                    }
                }
            })
            return
        }
        if (typeof raw === 'string' && raw.trim()) {
            const normalized = normalizeImageUrl(raw, fallback)
            if (!seen.has(normalized)) {
                seen.add(normalized)
                result.push(normalized)
            }
        }
    }

    buckets.forEach(push)

    if (result.length === 0) {
        push(hall.image)
        push(hall.thumbnail)
        push(hall.cover)
    }

    return result.length > 0 ? result : [fallback]
}

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
   PhotoSlider — با framer-motion (قطعی کار می‌کنه)
   ============================================================ */
const PhotoSlider = memo(function PhotoSlider({ images, alt, index = 0 }) {
    const [[current, direction], setState] = useState([0, 0])
    const [imgErrors, setImgErrors] = useState(() => new Set())
    const touchStartX = useRef(null)
    const touchEndX = useRef(null)
    const didDragRef = useRef(false)

    const total = images.length
    const hasMultiple = total > 1

    useEffect(() => {
        setState([0, 0])
        setImgErrors(new Set())
    }, [images])

    const goNext = useCallback(
        (e) => {
            e?.preventDefault?.()
            e?.stopPropagation?.()
            setState(([c]) => [(c + 1) % total, 1])
        },
        [total]
    )

    const goPrev = useCallback(
        (e) => {
            e?.preventDefault?.()
            e?.stopPropagation?.()
            setState(([c]) => [(c - 1 + total) % total, -1])
        },
        [total]
    )

    const goTo = useCallback(
        (i, e) => {
            e?.preventDefault?.()
            e?.stopPropagation?.()
            setState(([c]) => [i, i > c ? 1 : -1])
        },
        []
    )

    /* Swipe handlers */
    const onTouchStart = useCallback((e) => {
        touchEndX.current = null
        touchStartX.current = e.targetTouches[0].clientX
        didDragRef.current = false
    }, [])

    const onTouchMove = useCallback((e) => {
        touchEndX.current = e.targetTouches[0].clientX
        if (
            touchStartX.current != null &&
            Math.abs(touchStartX.current - touchEndX.current) > 10
        ) {
            didDragRef.current = true
        }
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

    const currentSrc = imgErrors.has(current) ? PLACEHOLDER : images[current]

    const variants = {
        enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
    }

    return (
        <div
            className="
                relative w-full aspect-[4/3] overflow-hidden select-none
                bg-slate-100
                rounded-t-3xl
            "
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onKeyDown={hasMultiple ? onKeyDown : undefined}
            tabIndex={hasMultiple ? 0 : -1}
            role="region"
            aria-roledescription="carousel"
            aria-label={`گالری تصاویر ${alt}`}
            style={{ touchAction: 'pan-y' }}
        >
            {/* 🔥 تصاویر با framer-motion — این روش ۱۰۰٪ کار می‌کنه */}
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
                        alt={`${alt} - تصویر ${faNum(current + 1)}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                        quality={80}
                        priority={index < 3 && current === 0}
                        loading={index < 3 && current === 0 ? 'eager' : 'lazy'}
                        unoptimized={
                            currentSrc.startsWith('data:') || currentSrc === PLACEHOLDER
                        }
                        onError={() =>
                            setImgErrors((prev) => {
                                const next = new Set(prev)
                                next.add(current)
                                return next
                            })
                        }
                        className="
                            object-cover
                            transition-transform duration-700 ease-out
                            group-hover/card:scale-105
                            will-change-transform
                            motion-reduce:transition-none
                            pointer-events-none
                        "
                        draggable={false}
                    />
                </motion.div>
            </AnimatePresence>

            {/* گرادیانت پایین */}
            <div
                className="
                    absolute inset-0 pointer-events-none
                    bg-gradient-to-t from-black/60 via-black/5 to-transparent
                "
                aria-hidden="true"
            />

            {/* 🔥 لینک روی ناحیه تصویر — زیر دکمه‌ها (z-10) */}
            <Link
                href={`/halls/${alt}`}
                className="absolute inset-0 z-10"
                aria-label={`مشاهده ${alt}`}
                onClick={(e) => {
                    if (didDragRef.current) {
                        e.preventDefault()
                        didDragRef.current = false
                    }
                }}
            >
                <span className="sr-only">مشاهده جزئیات {alt}</span>
            </Link>

            {/* ==================== دکمه‌های ناوبری — z-30 ==================== */}
            {hasMultiple && (
                <>
                    <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onPointerUp={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        onClick={goNext}
                        aria-label="تصویر بعدی"
                        className="
                            absolute left-2 top-1/2 -translate-y-1/2 z-30
                            w-7 h-7 rounded-full
                            bg-white/85 hover:bg-white backdrop-blur-md
                            text-slate-800
                            flex items-center justify-center
                            shadow-md
                            opacity-0 group-hover/card:opacity-100
                            focus-visible:opacity-100
                            transition-opacity duration-300
                            hover:scale-110 active:scale-95
                            cursor-pointer
                        "
                    >
                        <PiCaretLeftBold className="w-3 h-3" aria-hidden="true" />
                    </button>

                    <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onPointerUp={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        onClick={goPrev}
                        aria-label="تصویر قبلی"
                        className="
                            absolute right-2 top-1/2 -translate-y-1/2 z-30
                            w-7 h-7 rounded-full
                            bg-white/85 hover:bg-white backdrop-blur-md
                            text-slate-800
                            flex items-center justify-center
                            shadow-md
                            opacity-0 group-hover/card:opacity-100
                            focus-visible:opacity-100
                            transition-opacity duration-300
                            hover:scale-110 active:scale-95
                            cursor-pointer
                        "
                    >
                        <PiCaretRightBold className="w-3 h-3" aria-hidden="true" />
                    </button>
                </>
            )}

            {/* ==================== Dot Indicators — z-30 ==================== */}
            {hasMultiple && (
                <div
                    className="
                        absolute bottom-2 left-1/2 -translate-x-1/2 z-30
                        flex items-center gap-1
                        px-2 py-1 rounded-full
                        bg-black/25 backdrop-blur-md
                    "
                    role="tablist"
                    aria-label="انتخاب تصویر"
                >
                    {images.map((_, i) => {
                        const active = i === current
                        return (
                            <button
                                key={i}
                                type="button"
                                role="tab"
                                aria-selected={active}
                                aria-label={`تصویر ${faNum(i + 1)}`}
                                onPointerDown={(e) => e.stopPropagation()}
                                onPointerUp={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                                onTouchStart={(e) => e.stopPropagation()}
                                onClick={(e) => goTo(i, e)}
                                className="rounded-full transition-all duration-300 cursor-pointer"
                                style={{
                                    width: active ? 16 : 6,
                                    height: 6,
                                    backgroundColor: active
                                        ? '#fff'
                                        : 'rgba(255,255,255,0.55)',
                                    boxShadow: active
                                        ? '0 0 0 2px rgba(198,161,76,0.6)'
                                        : 'none',
                                }}
                            />
                        )
                    })}
                </div>
            )}

            {/* شمارنده sr-only */}
            {hasMultiple && (
                <div className="absolute top-3 left-3 z-20 sr-only" aria-live="polite">
                    تصویر {faNum(current + 1)} از {faNum(total)}
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
        },
        [hallId]
    )

    return (
        <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={handleClick}
            aria-label={isFavorite ? 'حذف از علاقه‌مندی' : 'افزودن به علاقه‌مندی'}
            aria-pressed={isFavorite}
            className={`
                absolute top-3 left-3 z-40
                w-8 h-8 rounded-full
                flex items-center justify-center
                backdrop-blur-md
                transition-all duration-300
                active:scale-90
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/60
                cursor-pointer
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
const DiscountBadge = memo(function DiscountBadge({ percent, isHot = false }) {
    if (!percent || percent <= 0) return null

    return (
        <div className="absolute top-3 right-3 z-40 pointer-events-none">
            <span
                className="
                    inline-flex items-center gap-1
                    px-2.5 py-1 rounded-xl
                    text-white text-[11px] font-extrabold tracking-tight
                "
                style={{
                    background: isHot
                        ? 'linear-gradient(135deg, #C6A14C 0%, #A8853A 100%)'
                        : '#10B981',
                    boxShadow: isHot
                        ? '0 4px 12px -2px rgba(168,133,58,0.55)'
                        : '0 4px 12px -2px rgba(16,185,129,0.5)',
                }}
            >
                {isHot ? (
                    <PiFireFill className="w-3 h-3" aria-hidden="true" />
                ) : (
                    <PiTagFill className="w-3 h-3" aria-hidden="true" />
                )}
                {faNum(percent)}٪
            </span>
        </div>
    )
})

/* ============================================================
   Features — چیپ‌های ویژگی
   ============================================================ */
const Features = memo(function Features({ hall }) {
    return (
        <div className="flex flex-wrap gap-1.5 text-[10.5px] font-medium text-slate-600">
            {hall.capacity && (
                <span className="inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                    <PiUsersThreeFill
                        className="w-3.5 h-3.5 text-[#C6A14C]"
                        aria-hidden="true"
                    />
                    {faNum(hall.capacity)} نفر
                </span>
            )}
            {hall.duration && (
                <span className="inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                    <PiCalendarBlank
                        className="w-3.5 h-3.5 text-[#C6A14C]"
                        aria-hidden="true"
                    />
                    {faNum(hall.duration)} ساعت
                </span>
            )}
        </div>
    )
})

/* ============================================================
   PriceBlock
   ============================================================ */
const PriceBlock = memo(function PriceBlock({ pricing }) {
    const { finalPrice, hasPrice, hasDiscount, mainPrice } = pricing

    if (!hasPrice) {
        return (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                <PiPhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
                تماس بگیرید
            </span>
        )
    }

    return (
        <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-1">
                <span className="text-[17px] font-black leading-none text-[#C6A14C] tabular-nums">
                    {faNum(finalPrice)}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">تومان</span>
            </div>
            {hasDiscount && mainPrice > finalPrice && (
                <span className="text-[10px] text-slate-400 line-through mt-0.5 tabular-nums">
                    {faNum(mainPrice)}
                </span>
            )}
        </div>
    )
})

/* ============================================================
   CTAButton
   ============================================================ */
const CTAButton = memo(function CTAButton({ href, label = 'رزرو' }) {
    return (
        <Link
            href={href}
            className="
                inline-flex items-center gap-1
                text-[11px] font-bold
                px-3 py-1.5 rounded-xl
                text-[#C6A14C]
                bg-[#FBF7EC]
                hover:shadow-md hover:scale-105 active:scale-95
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A14C]/60
                transition-all duration-300 shrink-0
            "
        >
            <span>{label}</span>
            <PiArrowLeft className="w-3 h-3" aria-hidden="true" />
        </Link>
    )
})

/* ============================================================
   HallCard
   ============================================================ */
function HallCard({ hall, index = 0, viewMode = 'grid' }) {
    if (!hall) return null

    const images = useMemo(() => getHallImages(hall), [hall])
    const hallUrl = `/halls/${hall._id || hall.id}`
    const pricing = computePricing(hall)

    const isList = viewMode === 'list'

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
                    group/card bg-white rounded-3xl
                    shadow-[0_2px_16px_-4px_rgba(15,23,42,0.08),0_1px_2px_rgba(15,23,42,0.04)]
                    hover:shadow-[0_20px_40px_-12px_rgba(15,23,42,0.18)]
                    transition-shadow duration-300
                    flex flex-col md:flex-row
                    overflow-hidden
                "
            >
                <div className="relative w-full md:w-72 lg:w-80 shrink-0">
                    <PhotoSlider
                        images={images}
                        alt={hall._id || hall.title || 'تالار'}
                        index={index}
                    />
                    <DiscountBadge percent={pricing.discountPercent} />
                    <FavoriteButton
                        initialFavorite={hall?.isFavorite}
                        hallId={hall._id}
                    />
                </div>

                <div className="flex-1 p-4 flex flex-col min-w-0">
                    <Link
                        href={hallUrl}
                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A14C]/40 rounded-lg"
                    >
                        <h3 className="text-[15px] font-extrabold text-slate-800 line-clamp-1 mb-1.5 hover:text-[#C6A14C] transition-colors">
                            {hall.title}
                        </h3>
                    </Link>

                    <div className="flex items-center text-[11.5px] gap-1.5 text-slate-500 mb-3">
                        <PiMapPinFill
                            className="w-3.5 h-3.5 shrink-0 text-[#C6A14C]"
                            aria-hidden="true"
                        />
                        <span className="truncate">
                            {hall.city}
                            {hall.province && (
                                <span className="text-slate-400"> · {hall.province}</span>
                            )}
                        </span>
                    </div>

                    <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">
                        {hall.description || 'توضیحات این تالار به زودی تکمیل می‌شود'}
                    </p>

                    <div className="mb-3.5">
                        <Features hall={hall} />
                    </div>

                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
                        <PriceBlock pricing={pricing} />
                        <CTAButton href={hallUrl} label="رزرو" />
                    </div>
                </div>
            </motion.article>
        )
    }

    /* ============================================================
       Grid Mode — استایل کاملاً شبیه landing
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
                group/card relative flex flex-col
                bg-white rounded-3xl
                shadow-[0_2px_16px_-4px_rgba(15,23,42,0.08),0_1px_2px_rgba(15,23,42,0.04)]
                hover:shadow-[0_20px_40px_-12px_rgba(15,23,42,0.18)]
                transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                hover:-translate-y-1.5
                will-change-transform
                motion-reduce:transition-none motion-reduce:hover:translate-y-0
                overflow-hidden
            "
        >
            <div className="relative">
                <PhotoSlider
                    images={images}
                    alt={hall._id || hall.title || 'تالار'}
                    index={index}
                />
                <DiscountBadge percent={pricing.discountPercent} />
                <FavoriteButton
                    initialFavorite={hall?.isFavorite}
                    hallId={hall._id}
                />
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <Link
                    href={hallUrl}
                    className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A14C]/40 rounded-lg"
                >
                    <h3 className="text-[15px] font-extrabold text-slate-800 line-clamp-1 mb-1.5 hover:text-[#C6A14C] transition-colors">
                        {hall.title}
                    </h3>
                </Link>

                <div className="flex items-center text-[11.5px] gap-1.5 text-slate-500 mb-3">
                    <PiMapPinFill
                        className="w-3.5 h-3.5 shrink-0 text-[#C6A14C]"
                        aria-hidden="true"
                    />
                    <span className="truncate">
                        {hall.city}
                        {hall.province && (
                            <span className="text-slate-400"> · {hall.province}</span>
                        )}
                    </span>
                </div>

                <div className="mb-3.5">
                    <Features hall={hall} />
                </div>

                <div className="mt-auto pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
                    <PriceBlock pricing={pricing} />
                    <CTAButton href={hallUrl} label="رزرو" />
                </div>
            </div>
        </motion.article>
    )
}

export default memo(HallCard)