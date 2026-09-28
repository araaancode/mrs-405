// components/landing/PopularHalls.jsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
    useRef,
    useState,
    useEffect,
    useCallback,
    memo,
    Suspense,
    lazy,
} from 'react'

/* ============================================================
   Lazy load icons
   ============================================================ */
const PiCrownSimpleFill = lazy(() =>
    import('react-icons/pi').then((mod) => ({ default: mod.PiCrownSimpleFill }))
)
const PiMapPinFill = lazy(() =>
    import('react-icons/pi').then((mod) => ({ default: mod.PiMapPinFill }))
)
const PiUsersThreeFill = lazy(() =>
    import('react-icons/pi').then((mod) => ({ default: mod.PiUsersThreeFill }))
)
const PiCalendarBlank = lazy(() =>
    import('react-icons/pi').then((mod) => ({ default: mod.PiCalendarBlank }))
)
const PiTagFill = lazy(() =>
    import('react-icons/pi').then((mod) => ({ default: mod.PiTagFill }))
)
const PiArrowRight = lazy(() =>
    import('react-icons/pi').then((mod) => ({ default: mod.PiArrowRight }))
)
const PiArrowLeft = lazy(() =>
    import('react-icons/pi').then((mod) => ({ default: mod.PiArrowLeft }))
)
const PiArrowCircleRight = lazy(() =>
    import('react-icons/pi').then((mod) => ({ default: mod.PiArrowCircleRight }))
)
const PiWarningCircle = lazy(() =>
    import('react-icons/pi').then((mod) => ({ default: mod.PiWarningCircle }))
)
const PiCaretLeft = lazy(() =>
    import('react-icons/pi').then((mod) => ({ default: mod.PiCaretLeft }))
)
const PiCaretRight = lazy(() =>
    import('react-icons/pi').then((mod) => ({ default: mod.PiCaretRight }))
)

/* ============================================================
   Helpers
   ============================================================ */
function normalizeImageUrl(url, fallback = '/images/placeholder-hall.jpg') {
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
   PhotoSlider — اسلایدر با دکمه‌های طلایی در هاور
   ============================================================ */
const PhotoSlider = memo(({ images, alt, index }) => {
    const [current, setCurrent] = useState(0)
    const [direction, setDirection] = useState(0)
    const touchStartX = useRef(null)
    const touchEndX = useRef(null)

    const total = images.length
    const hasMultiple = total > 1

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
    const onTouchStart = (e) => {
        touchEndX.current = null
        touchStartX.current = e.targetTouches[0].clientX
    }
    const onTouchMove = (e) => {
        touchEndX.current = e.targetTouches[0].clientX
    }
    const onTouchEnd = () => {
        if (touchStartX.current == null || touchEndX.current == null) return
        const distance = touchStartX.current - touchEndX.current
        if (distance > 50) goNext()
        else if (distance < -50) goPrev()
        touchStartX.current = null
        touchEndX.current = null
    }

    const variants = {
        enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
    }

    /* حالت بدون تصویر */
    if (total === 0) {
        return (
            <div className="relative h-44 overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <Suspense fallback={<div className="w-12 h-12 bg-gray-400 rounded" />}>
                    <PiCrownSimpleFill className="w-12 h-12 text-gray-400" />
                </Suspense>
            </div>
        )
    }

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
                        x: { type: 'spring', stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                    }}
                    className="absolute inset-0"
                >
                    <img
                        src={images[current]}
                        alt={`${alt} - تصویر ${current + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105 will-change-transform"
                        loading={index < 3 ? 'eager' : 'lazy'}
                        fetchPriority={index < 3 ? 'high' : 'low'}
                        decoding="async"
                    />
                </motion.div>
            </AnimatePresence>

            {/* گرادیانت */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

            {/* دکمه‌های ناوبری */}
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
                        <Suspense fallback={<div className="w-4 h-4" />}>
                            <PiCaretRight className="w-4 h-4" strokeWidth={2.5} />
                        </Suspense>
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
                        <Suspense fallback={<div className="w-4 h-4" />}>
                            <PiCaretLeft className="w-4 h-4" strokeWidth={2.5} />
                        </Suspense>
                    </button>
                </>
            )}
        </div>
    )
})

PhotoSlider.displayName = 'PhotoSlider'

/* ============================================================
   HallCard
   ============================================================ */
const HallCard = memo(({ hall, index }) => {
    const images = getHallImages(hall)

    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
            viewport={{ once: true, margin: '-50px' }}
            className="
        group/card bg-white rounded-2xl
        border border-gray-100
        shadow-md hover:shadow-lg
        transition-all duration-300
        flex flex-col flex-shrink-0 w-[300px]
        hover:-translate-y-1 will-change-transform
        overflow-hidden
      "
        >
            {/* اسلایدر عکس */}
            <PhotoSlider images={images} alt={hall.title} index={index} />

            {/* محتوای کارت */}
            <div className="p-4 flex flex-col flex-grow">
                {/* عنوان و موقعیت */}
                <div className="mb-2">
                    <h3 className="text-base font-bold line-clamp-1 text-[#2C2418]">
                        {hall.title}
                    </h3>
                    <div className="flex items-center text-xs gap-1 text-gray-500 mt-1">
                        <Suspense fallback={<div className="w-3 h-3" />}>
                            <PiMapPinFill className="w-3 h-3 text-[#C6A14C]" />
                        </Suspense>
                        <span>{hall.city}</span>
                        {hall.province && (
                            <span className="text-gray-400">| {hall.province}</span>
                        )}
                    </div>
                </div>

                {/* توضیحات */}
                <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                    {hall.description || 'لورم ایپسوم متن تستی برای توضیحات تالار'}
                </p>

                {/* ویژگی‌ها */}
                <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                        <Suspense fallback={<div className="w-3.5 h-3.5" />}>
                            <PiUsersThreeFill className="w-3.5 h-3.5 text-[#C6A14C]" />
                        </Suspense>
                        {hall.capacity?.toLocaleString()} نفر
                    </span>
                    {hall.duration && (
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                            <Suspense fallback={<div className="w-3.5 h-3.5" />}>
                                <PiCalendarBlank className="w-3.5 h-3.5 text-[#C6A14C]" />
                            </Suspense>
                            {hall.duration} ساعت
                        </span>
                    )}
                    {hall.hall_type && (
                        <span className="bg-gray-50 px-2 py-1 rounded-lg">
                            {hall.hall_type}
                        </span>
                    )}
                </div>

                {/* نشان تخفیف */}
                {hall.sans_discount > 0 && (
                    <div className="text-xs text-green-600 flex items-center gap-1 mb-2 bg-green-50 px-2 py-1 rounded-lg w-fit">
                        <Suspense fallback={<div className="w-3.5 h-3.5" />}>
                            <PiTagFill className="w-3.5 h-3.5" />
                        </Suspense>
                        <span className="font-bold">{hall.sans_discount}%</span>
                        <span>تخفیف ویژه</span>
                    </div>
                )}

                {/* قیمت و دکمه */}
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                    <div>
                        <span className="text-sm font-black text-[#C6A14C]">
                            {hall.sans_price?.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-gray-400 mr-1">تومان</span>
                        {hall.main_price && hall.main_price > hall.sans_price && (
                            <div className="text-[10px] text-gray-400 line-through">
                                {hall.main_price?.toLocaleString()} تومان
                            </div>
                        )}
                    </div>

                    <Link
                        href={`/halls/${hall._id}`}
                        prefetch={false}
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
    )
})

HallCard.displayName = 'HallCard'

/* ============================================================
   Loading skeleton
   ============================================================ */
const LoadingSkeleton = () => (
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

/* ============================================================
   Empty state
   ============================================================ */
const EmptyState = () => (
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
                    <Suspense fallback={<div className="w-10 h-10" />}>
                        <PiWarningCircle className="w-10 h-10 text-[#C6A14C]" />
                    </Suspense>
                </div>
                <h3 className="text-xl font-bold text-[#2C2418] mb-2">
                    هنوز تالاری اضافه نشده است
                </h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                    در حال حاضر هیچ تالاری در این بخش وجود ندارد.
                </p>
                <Link
                    href="/halls"
                    className="inline-flex items-center gap-2 bg-[#C6A14C] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#A8853A] transition-all duration-200"
                >
                    <span>مشاهده همه تالارها</span>
                    <Suspense fallback={<div className="w-4 h-4" />}>
                        <PiArrowLeft className="w-4 h-4" />
                    </Suspense>
                </Link>
            </div>
        </div>
    </section>
)

/* ============================================================
   PopularHalls
   ============================================================ */
export default function PopularHalls({ halls = [] }) {
    const [loading, setLoading] = useState(true)
    const [popularHalls, setPopularHalls] = useState([])
    const scrollContainerRef = useRef(null)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (!isMounted) return

        const loadData = () => {
            if (Array.isArray(halls) && halls.length > 0) {
                setPopularHalls(halls.slice(0, 10))
            } else if (Array.isArray(halls)) {
                setPopularHalls([])
            } else {
                console.warn('PopularHalls: halls is not an array:', halls)
                setPopularHalls([])
            }
            setLoading(false)
        }

        loadData()
    }, [halls, isMounted])

    const scroll = useCallback((direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 380
            scrollContainerRef.current.scrollBy({
                left: direction === 'right' ? scrollAmount : -scrollAmount,
                behavior: 'smooth',
            })
        }
    }, [])

    const scrollToIndex = useCallback((index) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                left: index * 380,
                behavior: 'smooth',
            })
        }
    }, [])

    if (loading) return <LoadingSkeleton />
    if (popularHalls.length === 0) return <EmptyState />

    return (
        <section className="py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* هدر */}
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
                    {/* نوار بالای اسلایدر */}
                    <div className="flex justify-between items-center mb-4 px-2">
                        <div className="text-sm text-gray-400">
                            <span className="font-medium text-[#C6A14C]">
                                {popularHalls.length}
                            </span>{' '}
                            تالار ویژه
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => scroll('left')}
                                className="
                  bg-white border border-gray-200 rounded-full p-2
                  shadow-sm hover:shadow-md
                  transition-all duration-200
                  hover:bg-[#C6A14C] hover:border-[#C6A14C]
                  group cursor-pointer
                "
                                aria-label="Scroll right"
                            >
                                <Suspense fallback={<div className="w-4 h-4" />}>
                                    <PiArrowRight className="w-4 h-4 text-[#2C2418] group-hover:text-white transition-colors" />
                                </Suspense>
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="
                  bg-white border border-gray-200 rounded-full p-2
                  shadow-sm hover:shadow-md
                  transition-all duration-200
                  hover:bg-[#C6A14C] hover:border-[#C6A14C]
                  group cursor-pointer
                "
                                aria-label="Scroll left"
                            >
                                <Suspense fallback={<div className="w-4 h-4" />}>
                                    <PiArrowLeft className="w-4 h-4 text-[#2C2418] group-hover:text-white transition-colors" />
                                </Suspense>
                            </button>
                        </div>
                    </div>

                    {/* اسلایدر افقی */}
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-5 overflow-x-auto scroll-smooth pb-6 px-2 hide-scrollbar"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {popularHalls.map((hall, index) => (
                            <HallCard
                                key={hall._id || index}
                                hall={hall}
                                index={index}
                            />
                        ))}

                        {/* کارت مشاهده بیشتر */}
                        <Link
                            href="/halls"
                            prefetch={false}
                            className="
                flex-shrink-0 w-[260px]
                flex items-center justify-center
                border-2 border-dashed border-[#C6A14C]
                rounded-2xl bg-white/50 hover:bg-white
                transition-all duration-200
                group/more
              "
                        >
                            <div className="flex flex-col items-center gap-3 text-center p-6">
                                <div className="w-14 h-14 rounded-full bg-[#C6A14C]/10 flex items-center justify-center group-hover/more:bg-[#C6A14C] transition-all duration-200">
                                    <Suspense fallback={<div className="w-7 h-7" />}>
                                        <PiArrowCircleRight className="w-7 h-7 text-[#C6A14C] group-hover/more:text-white transition-colors" />
                                    </Suspense>
                                </div>
                                <span className="font-bold text-[#2C2418] group-hover/more:text-[#C6A14C] transition-colors">
                                    مشاهده تالارهای بیشتر
                                </span>
                                <span className="text-xs text-gray-400">
                                    بیش از {popularHalls.length * 10}+ تالار لوکس
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* نشانگرهای اسکرول موبایل */}
                <div className="flex justify-center gap-1.5 mt-6 md:hidden">
                    {popularHalls.slice(0, 5).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => scrollToIndex(idx)}
                            className="w-1.5 h-1.5 rounded-full bg-gray-300 hover:bg-[#C6A14C] transition-all cursor-pointer"
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>

            <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
        </section>
    )
}