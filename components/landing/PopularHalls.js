// components/landing/PopularHalls.jsx - Optimized version with better performance
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRef, useState, useEffect, useCallback, memo, Suspense, lazy } from 'react'

// Lazy load all icons
const PiCrownSimpleFill = lazy(() => import('react-icons/pi').then(mod => ({ default: mod.PiCrownSimpleFill })))
const PiMapPinFill = lazy(() => import('react-icons/pi').then(mod => ({ default: mod.PiMapPinFill })))
const PiUsersThreeFill = lazy(() => import('react-icons/pi').then(mod => ({ default: mod.PiUsersThreeFill })))
const PiCalendarBlank = lazy(() => import('react-icons/pi').then(mod => ({ default: mod.PiCalendarBlank })))
const PiTagFill = lazy(() => import('react-icons/pi').then(mod => ({ default: mod.PiTagFill })))
const PiArrowRight = lazy(() => import('react-icons/pi').then(mod => ({ default: mod.PiArrowRight })))
const PiArrowLeft = lazy(() => import('react-icons/pi').then(mod => ({ default: mod.PiArrowLeft })))
const PiArrowCircleRight = lazy(() => import('react-icons/pi').then(mod => ({ default: mod.PiArrowCircleRight })))
const PiStarFill = lazy(() => import('react-icons/pi').then(mod => ({ default: mod.PiStarFill })))
const PiSparkle = lazy(() => import('react-icons/pi').then(mod => ({ default: mod.PiSparkle })))
const PiWarningCircle = lazy(() => import('react-icons/pi').then(mod => ({ default: mod.PiWarningCircle })))

// Lazy load heavy spinner
const ClipLoader = lazy(() => import('react-spinners').then(mod => ({ default: mod.ClipLoader })))

// Optimized image component using native img
const HallImage = ({ src, alt, index }) => (
    <div className="relative h-44 overflow-hidden rounded-t-2xl">
        {src ? (
            <img
                src={src.replace('./', '/')}
                alt={alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105 will-change-transform"
                loading={index < 3 ? 'eager' : 'lazy'}
                fetchPriority={index < 3 ? 'high' : 'low'}
                decoding="async"
            />
        ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <Suspense fallback={<div className="w-12 h-12 bg-gray-400 rounded" />}>
                    <PiCrownSimpleFill className="w-12 h-12 text-gray-400" />
                </Suspense>
            </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
    </div>
)

// Individual hall card component for better memoization
const HallCard = memo(({ hall, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
            viewport={{ once: true, margin: "-50px" }}
            className="group/card bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-sm transition-all duration-300 flex flex-col flex-shrink-0 w-[300px] hover:-translate-y-1 will-change-transform"
        >
            {/* Image section */}
            <HallImage
                src={hall.images?.[0]}
                alt={hall.title}
                index={index}
            />

            {/* Card content */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Title and location */}
                <div className="mb-2">
                    <h3 className="text-base font-bold line-clamp-1 text-[#2C2418]">
                        {hall.title}
                    </h3>
                    <div className="flex items-center text-xs gap-1 text-gray-500 mt-1">
                        <Suspense fallback={<div className="w-3 h-3" />}>
                            <PiMapPinFill className="w-3 h-3 text-[#D4B06A]" />
                        </Suspense>
                        <span>{hall.city}</span>
                        {hall.province && (
                            <span className="text-gray-400">| {hall.province}</span>
                        )}
                    </div>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                    {hall.description || 'لورم ایپسوم متن تستی برای توضیحات تالار'}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                        <Suspense fallback={<div className="w-3.5 h-3.5" />}>
                            <PiUsersThreeFill className="w-3.5 h-3.5 text-[#D4B06A]" />
                        </Suspense>
                        {hall.capacity?.toLocaleString()} نفر
                    </span>
                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                        <Suspense fallback={<div className="w-3.5 h-3.5" />}>
                            <PiCalendarBlank className="w-3.5 h-3.5 text-[#D4B06A]" />
                        </Suspense>
                        {hall.duration} ساعت
                    </span>
                    {hall.hall_type && (
                        <span className="bg-gray-50 px-2 py-1 rounded-lg">{hall.hall_type}</span>
                    )}
                </div>

                {/* Discount badge */}
                {hall.sans_discount > 0 && (
                    <div className="text-xs text-green-600 flex items-center gap-1 mb-2 bg-green-50 px-2 py-1 rounded-lg w-fit">
                        <Suspense fallback={<div className="w-3.5 h-3.5" />}>
                            <PiTagFill className="w-3.5 h-3.5" />
                        </Suspense>
                        <span className="font-bold">{hall.sans_discount}%</span>
                        <span>تخفیف ویژه</span>
                    </div>
                )}

                {/* Price and button */}
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                    <div>
                        <span className="text-sm font-black text-[#D4B06A]">
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
                        className="group/btn text-xs border-2 border-[#D4B06A] px-4 py-1.5 rounded-lg font-medium text-[#D4B06A] hover:bg-[#D4B06A] hover:text-white transition-all duration-200 hover:shadow-md"
                    >
                        مشاهده و رزرو
                    </Link>
                </div>
            </div>
        </motion.div>
    )
})

HallCard.displayName = 'HallCard'

// Loading skeleton component
const LoadingSkeleton = () => (
    <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <div className="h-10 w-64 bg-gray-200 rounded-lg mx-auto mb-3 animate-pulse" />
                <div className="w-20 h-1 bg-gray-200 rounded-full mx-auto" />
                <div className="h-4 w-48 bg-gray-200 rounded-lg mx-auto mt-4 animate-pulse" />
            </div>
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-[#D4B06A] border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-gray-500 text-sm">در حال بارگذاری تالارها...</p>
            </div>
        </div>
    </section>
)

// Empty state component
const EmptyState = () => (
    <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black text-[#2C2418] mb-3">
                    محبوب‌ترین تالارها
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] rounded-full mx-auto" />
            </div>
            <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                    <Suspense fallback={<div className="w-10 h-10" />}>
                        <PiWarningCircle className="w-10 h-10 text-[#D4B06A]" />
                    </Suspense>
                </div>
                <h3 className="text-xl font-bold text-[#2C2418] mb-2">
                    هنوز تالاری اضافه نشده است
                </h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                    در حال حاضر هیچ تالاری در این بخش وجود ندارد.
                </p>
                <Link href="/halls" className="inline-flex items-center gap-2 bg-[#D4B06A] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#B8922E] transition-all duration-200">
                    <span>مشاهده همه تالارها</span>
                    <Suspense fallback={<div className="w-4 h-4" />}>
                        <PiArrowLeft className="w-4 h-4" />
                    </Suspense>
                </Link>
            </div>
        </div>
    </section>
)

export default function PopularHalls({ halls = [] }) {
    const [loading, setLoading] = useState(true)
    const [popularHalls, setPopularHalls] = useState([])
    const scrollContainerRef = useRef(null)
    const [isMounted, setIsMounted] = useState(false)

    // Mark as mounted
    useEffect(() => {
        setIsMounted(true)
    }, [])

    // ✅ Optimized data loading with safe array handling
    useEffect(() => {
        if (!isMounted) return

        const loadData = () => {
            // ✅ CRITICAL FIX: Ensure halls is an array before slicing
            if (Array.isArray(halls) && halls.length > 0) {
                // If it's an array with items, get first 10
                setPopularHalls(halls.slice(0, 10))
            } else if (Array.isArray(halls)) {
                // If it's an empty array
                setPopularHalls([])
            } else {
                // If halls is not an array, log error and set empty array
                console.warn('PopularHalls: halls is not an array:', halls, 'Type:', typeof halls)
                setPopularHalls([])
            }
            setLoading(false)
        }

        // Execute immediately, no artificial delay
        loadData()
    }, [halls, isMounted])

    // Optimized scroll function
    const scroll = useCallback((direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 380
            scrollContainerRef.current.scrollBy({
                left: direction === 'right' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            })
        }
    }, [])

    // Dot indicator click handler
    const scrollToIndex = useCallback((index) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                left: index * 380,
                behavior: 'smooth'
            })
        }
    }, [])

    // Show loading state
    if (loading) {
        return <LoadingSkeleton />
    }

    // Show empty state
    if (popularHalls.length === 0) {
        return <EmptyState />
    }

    return (
        <section className="py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header section - simplified animation */}
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-4xl font-black text-[#2C2418] mb-3">
                        محبوب‌ترین تالارها
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] rounded-full mx-auto" />
                    <p className="text-gray-500 text-sm mt-4 max-w-md mx-auto px-4">
                        بهترین و لوکس‌ترین تالارهای برگزاری مراسم در سراسر ایران
                    </p>
                </div>

                <div className="relative">
                    {/* Header with slider buttons */}
                    <div className="flex justify-between items-center mb-4 px-2">
                        <div className="text-sm text-gray-400">
                            <span className="font-medium text-[#D4B06A]">{popularHalls.length}</span> تالار ویژه
                        </div>

                        {/* Scroll buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => scroll('left')}
                                className="bg-white border border-gray-200 rounded-full p-2 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-[#D4B06A] hover:border-[#D4B06A] group cursor-pointer"
                                aria-label="Scroll right"
                            >
                                <Suspense fallback={<div className="w-4 h-4" />}>
                                    <PiArrowRight className="w-4 h-4 text-[#2C2418] group-hover:text-white transition-colors" />
                                </Suspense>
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="bg-white border border-gray-200 rounded-full p-2 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-[#D4B06A] hover:border-[#D4B06A] group cursor-pointer"
                                aria-label="Scroll left"
                            >
                                <Suspense fallback={<div className="w-4 h-4" />}>
                                    <PiArrowLeft className="w-4 h-4 text-[#2C2418] group-hover:text-white transition-colors" />
                                </Suspense>
                            </button>
                        </div>
                    </div>

                    {/* Slider */}
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-5 overflow-x-auto scroll-smooth pb-6 px-2 hide-scrollbar"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {popularHalls.map((hall, index) => (
                            <HallCard key={hall._id || index} hall={hall} index={index} />
                        ))}

                        {/* View more card */}
                        <Link
                            href="/halls"
                            prefetch={false}
                            className="flex-shrink-0 w-[260px] flex items-center justify-center border-2 border-dashed border-[#D4B06A] rounded-2xl bg-white/50 hover:bg-white transition-all duration-200 group/more"
                        >
                            <div className="flex flex-col items-center gap-3 text-center p-6">
                                <div className="w-14 h-14 rounded-full bg-[#D4B06A]/10 flex items-center justify-center group-hover/more:bg-[#D4B06A] transition-all duration-200">
                                    <Suspense fallback={<div className="w-7 h-7" />}>
                                        <PiArrowCircleRight className="w-7 h-7 text-[#D4B06A] group-hover/more:text-white transition-colors" />
                                    </Suspense>
                                </div>
                                <span className="font-bold text-[#2C2418] group-hover/more:text-[#D4B06A] transition-colors">
                                    مشاهده تالارهای بیشتر
                                </span>
                                <span className="text-xs text-gray-400">
                                    بیش از {popularHalls.length * 10}+ تالار لوکس
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Scroll indicators for mobile */}
                <div className="flex justify-center gap-1.5 mt-6 md:hidden">
                    {popularHalls.slice(0, 5).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => scrollToIndex(idx)}
                            className="w-1.5 h-1.5 rounded-full bg-gray-300 hover:bg-[#D4B06A] transition-all cursor-pointer"
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