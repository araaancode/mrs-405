// components/landing/PopularHalls.jsx
'use client'

import { useRef, useState, useCallback, useMemo, memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    PiCrownSimpleFill,
    PiMapPinFill,
    PiUsersThreeFill,
    PiCalendarBlank,
    PiTagFill,
    PiArrowRight,
    PiArrowLeft,
    PiArrowCircleRight,
    PiWarningCircle,
    PiCaretLeft,
    PiCaretRight,
} from 'react-icons/pi'

/* ============================================================
   Formatters — یک بار در ماژول
   ============================================================ */
const faNumFormatter = new Intl.NumberFormat('fa-IR')
const faNum = (n) => faNumFormatter.format(Number(n) || 0)

/* ============================================================
   Helpers
   ============================================================ */
const PLACEHOLDER = '/images/placeholder-hall.jpg'

const isRemote = (url) =>
    typeof url === 'string' && /^https?:\/\//i.test(url)

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

function getHallImages(hall) {
    if (!hall) return []
    const raw = Array.isArray(hall.images) ? hall.images : []
    const cleaned = raw
        .filter((img) => typeof img === 'string' && img.trim())
        .map((img) => normalizeImageUrl(img))

    if (cleaned.length === 0) {
        const single = hall.image || hall.thumbnail
        if (single) return [normalizeImageUrl(single)]
    }
    return cleaned
}

/* ============================================================
   PhotoSlider — بدون framer-motion، با CSS transition
   ============================================================ */
const PhotoSlider = memo(function PhotoSlider({ images, alt, index }) {
    const [current, setCurrent] = useState(0)
    const touchStartX = useRef(null)
    const touchEndX = useRef(null)

    const total = images.length
    const hasMultiple = total > 1

    const goNext = useCallback(
        (e) => {
            e?.preventDefault()
            e?.stopPropagation()
            setCurrent((c) => (c + 1) % total)
        },
        [total]
    )

    const goPrev = useCallback(
        (e) => {
            e?.preventDefault()
            e?.stopPropagation()
            setCurrent((c) => (c - 1 + total) % total)
        },
        [total]
    )

    /* Swipe با RAF throttle */
    const rafRef = useRef(null)
    const onTouchStart = useCallback((e) => {
        touchEndX.current = null
        touchStartX.current = e.targetTouches[0].clientX
    }, [])
    const onTouchMove = useCallback((e) => {
        if (rafRef.current) return
        rafRef.current = requestAnimationFrame(() => {
            touchEndX.current = e.targetTouches[0].clientX
            rafRef.current = null
        })
    }, [])
    const onTouchEnd = useCallback(() => {
        if (touchStartX.current == null || touchEndX.current == null) return
        const distance = touchStartX.current - touchEndX.current
        if (distance > 50) goNext()
        else if (distance < -50) goPrev()
        touchStartX.current = null
        touchEndX.current = null
    }, [goNext, goPrev])

    /* حالت بدون تصویر */
    if (total === 0) {
        return (
            <div className="relative h-44 overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <PiCrownSimpleFill className="w-12 h-12 text-gray-400" />
            </div>
        )
    }

    const currentSrc = images[current]
    const remote = isRemote(currentSrc)

    return (
        <div
            className="relative h-44 overflow-hidden rounded-t-2xl select-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* همه تصاویر رندر می‌شوند، فقط opacity تغییر می‌کند */}
            {images.map((img, i) => {
                const isActive = i === current
                const isFirst = i === 0
                const imgRemote = isRemote(img)
                return (
                    <div
                        key={`${i}-${img}`}
                        className={`absolute inset-0 transition-opacity duration-500 ${
                            isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                        }`}
                        aria-hidden={!isActive}
                    >
                        <Image
                            src={img}
                            alt={`${alt} - تصویر ${i + 1}`}
                            fill
                            sizes="300px"
                            quality={75}
                            priority={index < 3 && isFirst}
                            loading={index < 3 && isFirst ? 'eager' : 'lazy'}
                            unoptimized={!imgRemote}
                            className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                        />
                    </div>
                )
            })}

            {/* گرادیانت */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none z-10" />

            {/* شمارنده تصویر */}
            {hasMultiple && (
                <div className="absolute bottom-2 right-2 z-20 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-bold">
                    {faNum(current + 1)} / {faNum(total)}
                </div>
            )}

            {/* دکمه‌های ناوبری */}
            {hasMultiple && (
                <>
                    <button
                        type="button"
                        onClick={goNext}
                        aria-label="تصویر بعدی"
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center bg-white/25 hover:bg-[#C6A14C] backdrop-blur-md text-white ring-1 ring-white/40 hover:ring-[#C6A14C] shadow-md hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
                    >
                        <PiCaretRight className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                    <button
                        type="button"
                        onClick={goPrev}
                        aria-label="تصویر قبلی"
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center bg-white/25 hover:bg-[#C6A14C] backdrop-blur-md text-white ring-1 ring-white/40 hover:ring-[#C6A14C] shadow-md hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
                    >
                        <PiCaretLeft className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                </>
            )}
        </div>
    )
})

/* ============================================================
   HallCard — memoized
   ============================================================ */
const HallCard = memo(function HallCard({ hall, index }) {
    /* تصاویر — یک بار محاسبه */
    const images = useMemo(() => getHallImages(hall), [hall.images, hall.image, hall.thumbnail])

    const hasDiscount = hall.sans_discount > 0
    const hasMainPrice = hall.main_price && hall.main_price > hall.sans_price

    return (
        <div
            className="group/card bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col flex-shrink-0 w-[300px] hover:-translate-y-1 overflow-hidden"
            style={{ willChange: 'transform' }}
        >
            <PhotoSlider images={images} alt={hall.title} index={index} />

            <div className="p-4 flex flex-col flex-grow">
                <div className="mb-2">
                    <h3 className="text-base font-bold line-clamp-1 text-[#2C2418]">
                        {hall.title}
                    </h3>
                    <div className="flex items-center text-xs gap-1 text-gray-500 mt-1">
                        <PiMapPinFill className="w-3 h-3 text-[#C6A14C]" />
                        <span>{hall.city}</span>
                        {hall.province && (
                            <span className="text-gray-400">| {hall.province}</span>
                        )}
                    </div>
                </div>

                <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                    {hall.description || 'لورم ایپسوم متن تستی برای توضیحات تالار'}
                </p>

                <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                        <PiUsersThreeFill className="w-3.5 h-3.5 text-[#C6A14C]" />
                        {faNum(hall.capacity)} نفر
                    </span>
                    {hall.duration && (
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                            <PiCalendarBlank className="w-3.5 h-3.5 text-[#C6A14C]" />
                            {hall.duration} ساعت
                        </span>
                    )}
                    {hall.hall_type && (
                        <span className="bg-gray-50 px-2 py-1 rounded-lg">
                            {hall.hall_type}
                        </span>
                    )}
                </div>

                {hasDiscount && (
                    <div className="text-xs text-green-600 flex items-center gap-1 mb-2 bg-green-50 px-2 py-1 rounded-lg w-fit">
                        <PiTagFill className="w-3.5 h-3.5" />
                        <span className="font-bold">{hall.sans_discount}%</span>
                        <span>تخفیف ویژه</span>
                    </div>
                )}

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                    <div>
                        <span className="text-sm font-black text-[#C6A14C]">
                            {faNum(hall.sans_price)}
                        </span>
                        <span className="text-[10px] text-gray-400 mr-1">تومان</span>
                        {hasMainPrice && (
                            <div className="text-[10px] text-gray-400 line-through">
                                {faNum(hall.main_price)} تومان
                            </div>
                        )}
                    </div>

                    <Link
                        href={`/halls/${hall._id}`}
                        prefetch={false}
                        className="group/btn text-xs border-2 border-[#C6A14C] px-4 py-1.5 rounded-lg font-medium text-[#C6A14C] hover:bg-[#C6A14C] hover:text-white transition-colors duration-200 hover:shadow-md"
                    >
                        مشاهده و رزرو
                    </Link>
                </div>
            </div>
        </div>
    )
})

/* ============================================================
   LoadingSkeleton
   ============================================================ */
const LoadingSkeleton = memo(function LoadingSkeleton() {
    return (
        <section className="py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="h-10 w-64 bg-gray-200 rounded-lg mx-auto mb-3 animate-pulse" />
                    <div className="w-20 h-1 bg-gray-200 rounded-full mx-auto" />
                    <div className="h-4 w-48 bg-gray-200 rounded-lg mx-auto mt-4 animate-pulse" />
                </div>
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-[#C6A14C] border-t-transparent rounded-full animate-spin" />
                    <p className="mt-4 text-gray-500 text-sm">در حال بارگذاری تالارها...</p>
                </div>
            </div>
        </section>
    )
})

/* ============================================================
   EmptyState
   ============================================================ */
const EmptyState = memo(function EmptyState() {
    return (
        <section className="py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-[#2C2418] mb-3">
                        محبوب‌ترین تالارها
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-[#C6A14C] to-[#A8853A] rounded-full mx-auto" />
                </div>
                <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                        <PiWarningCircle className="w-10 h-10 text-[#C6A14C]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2C2418] mb-2">
                        هنوز تالاری اضافه نشده است
                    </h3>
                    <p className="text-gray-500 text-center max-w-md mb-6">
                        در حال حاضر هیچ تالاری در این بخش وجود ندارد.
                    </p>
                    <Link
                        href="/halls"
                        className="inline-flex items-center gap-2 bg-[#C6A14C] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#A8853A] transition-colors duration-200"
                    >
                        <span>مشاهده همه تالارها</span>
                        <PiArrowLeft className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    )
})

/* ============================================================
   PopularHalls
   ============================================================ */
export default function PopularHalls({ halls = [] }) {
    const scrollContainerRef = useRef(null)

    /* slice در useMemo، بدون useEffect و isMounted */
    const popularHalls = useMemo(
        () => (Array.isArray(halls) ? halls.slice(0, 10) : []),
        [halls]
    )

    const scroll = useCallback((direction) => {
        const el = scrollContainerRef.current
        if (!el) return
        const scrollAmount = 380
        el.scrollBy({
            left: direction === 'right' ? scrollAmount : -scrollAmount,
            behavior: 'smooth',
        })
    }, [])

    const scrollToIndex = useCallback((index) => {
        const el = scrollContainerRef.current
        if (!el) return
        el.scrollTo({ left: index * 380, behavior: 'smooth' })
    }, [])

    if (popularHalls.length === 0) return <EmptyState />

    return (
        <section className="py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-4xl font-black text-[#2C2418] mb-3">
                        محبوب‌ترین تالارها
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-[#C6A14C] to-[#A8853A] rounded-full mx-auto" />
                    <p className="text-gray-500 text-sm mt-4 max-w-md mx-auto px-4">
                        بهترین و لوکس‌ترین تالارهای برگزاری مراسم در سراسر ایران
                    </p>
                </div>

                <div className="relative">
                    <div className="flex justify-between items-center mb-4 px-2">
                        <div className="text-sm text-gray-400">
                            <span className="font-medium text-[#C6A14C]">
                                {faNum(popularHalls.length)}
                            </span>{' '}
                            تالار ویژه
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => scroll('left')}
                                className="bg-white border border-gray-200 rounded-full p-2 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-[#C6A14C] hover:border-[#C6A14C] group cursor-pointer"
                                aria-label="Scroll right"
                            >
                                <PiArrowRight className="w-4 h-4 text-[#2C2418] group-hover:text-white transition-colors" />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="bg-white border border-gray-200 rounded-full p-2 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-[#C6A14C] hover:border-[#C6A14C] group cursor-pointer"
                                aria-label="Scroll left"
                            >
                                <PiArrowLeft className="w-4 h-4 text-[#2C2418] group-hover:text-white transition-colors" />
                            </button>
                        </div>
                    </div>

                    <div
                        ref={scrollContainerRef}
                        className="flex gap-5 overflow-x-auto scroll-smooth pb-6 px-2 hide-scrollbar"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {popularHalls.map((hall, index) => (
                            <HallCard
                                key={hall._id || `idx-${index}`}
                                hall={hall}
                                index={index}
                            />
                        ))}

                        <Link
                            href="/halls"
                            prefetch={false}
                            className="flex-shrink-0 w-[260px] flex items-center justify-center border-2 border-dashed border-[#C6A14C] rounded-2xl bg-white/50 hover:bg-white transition-colors duration-200 group/more"
                        >
                            <div className="flex flex-col items-center gap-3 text-center p-6">
                                <div className="w-14 h-14 rounded-full bg-[#C6A14C]/10 flex items-center justify-center group-hover/more:bg-[#C6A14C] transition-colors duration-200">
                                    <PiArrowCircleRight className="w-7 h-7 text-[#C6A14C] group-hover/more:text-white transition-colors" />
                                </div>
                                <span className="font-bold text-[#2C2418] group-hover/more:text-[#C6A14C] transition-colors">
                                    مشاهده تالارهای بیشتر
                                </span>
                                <span className="text-xs text-gray-400">
                                    بیش از {faNum(popularHalls.length * 10)}+ تالار لوکس
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="flex justify-center gap-1.5 mt-6 md:hidden">
                    {popularHalls.slice(0, 5).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => scrollToIndex(idx)}
                            className="w-1.5 h-1.5 rounded-full bg-gray-300 hover:bg-[#C6A14C] transition-colors cursor-pointer"
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}