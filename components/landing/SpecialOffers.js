'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useCallback, useMemo, memo } from 'react'
import { FaFire, FaTag, FaClock, FaArrowLeft } from 'react-icons/fa'

/* ============================================================
   Constants & Formatters — یک بار در ماژول
   ============================================================ */
const PLACEHOLDER = '/images/placeholder.jpg'

const faNumFormatter = new Intl.NumberFormat('fa-IR')
const faNum = (n) => faNumFormatter.format(Number(n) || 0)

const isRemote = (url) =>
    typeof url === 'string' && /^https?:\/\//i.test(url)

/* ============================================================
   Helpers — خالص، بدون ساخت مجدد
   ============================================================ */
function hasValidDiscount(hall) {
    return (
        (hall.hasDiscount || (hall.discount && hall.discount > 0)) &&
        hall.discount !== undefined
    )
}

function getDiscountedPrice(hall) {
    if (typeof hall.price !== 'number') return null
    const discountPercent = hall.discount || 20
    return Math.floor(hall.price * (1 - discountPercent / 100))
}

/* ============================================================
   OfferCard — memoized + next/image + بدون framer-motion
   ============================================================ */
const OfferCard = memo(function OfferCard({ hall, index }) {
    const [imgError, setImgError] = useState(false)

    /* تصویر — یک بار محاسبه */
    const imageSrc = useMemo(() => {
        if (imgError) return PLACEHOLDER
        return hall.images?.[0] || PLACEHOLDER
    }, [hall.images, imgError])

    const remote = isRemote(imageSrc)

    /* قیمت — یک بار محاسبه */
    const pricing = useMemo(() => {
        const discounted = getDiscountedPrice(hall)
        if (discounted === null) return null
        return {
            final: faNum(discounted),
            original: faNum(hall.price),
        }
    }, [hall.price, hall.discount])

    const discountPercent = hall.discount || 20
    const isFirst = index === 0
    const priority = index < 2

    const handleError = useCallback(() => setImgError(true), [])

    return (
        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden hover:-translate-y-2">
            {/* برچسب تخفیف */}
            <div className="absolute top-4 right-4 z-10">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <FaTag className="w-3 h-3" />
                    {discountPercent}% تخفیف
                </div>
            </div>

            {/* برچسب ویژه */}
            {isFirst && (
                <div className="absolute top-4 left-4 z-10">
                    <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        ویژه
                    </div>
                </div>
            )}

            {/* تصویر */}
            <div className="relative h-48 overflow-hidden bg-gray-100">
                <Image
                    src={imageSrc}
                    alt={hall.name || 'تالار'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    quality={75}
                    priority={priority}
                    loading={priority ? 'eager' : 'lazy'}
                    unoptimized={!remote}
                    onError={handleError}
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* محتوا */}
            <div className="p-5">
                <h3 className="text-lg font-bold text-[#3B2F2F] mb-2 line-clamp-1 group-hover:text-red-600 transition-colors">
                    {hall.name}
                </h3>

                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-baseline gap-2 flex-wrap">
                        {pricing ? (
                            <>
                                <span className="text-2xl font-bold text-red-500">
                                    {pricing.final}
                                </span>
                                <span className="text-xs text-gray-400 line-through">
                                    {pricing.original}
                                </span>
                                <span className="text-xs text-gray-500">تومان</span>
                            </>
                        ) : (
                            <span className="text-sm text-gray-500">
                                برای استعلام قیمت تماس بگیرید
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-full">
                        <FaClock className="w-3 h-3" />
                        <span className="text-xs font-medium">زمان محدود</span>
                    </div>
                </div>

                {hall.capacity && (
                    <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                        <span>ظرفیت: {faNum(hall.capacity)} نفر</span>
                        {hall.location && (
                            <>
                                <span>•</span>
                                <span>{hall.location}</span>
                            </>
                        )}
                    </div>
                )}

                <Link
                    href={`/halls/${hall._id}`}
                    prefetch={false}
                    className="block w-full text-center px-4 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-label={`مشاهده و استفاده از تخفیف ${hall.name}`}
                >
                    استفاده از تخفیف
                    <FaArrowLeft
                        className="w-4 h-4 inline-block mr-2 group-hover:translate-x-1 transition-transform"
                        aria-hidden="true"
                    />
                </Link>
            </div>
        </div>
    )
})

/* ============================================================
   LoadingState
   ============================================================ */
const LoadingState = memo(function LoadingState() {
    return (
        <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4" />
                    <p className="text-[#8E8276]">در حال بارگذاری تخفیف‌های ویژه...</p>
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
        <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <FaFire className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-[#3B2F2F] mb-2">
                        تخفیفی موجود نیست
                    </h3>
                    <p className="text-[#8E8276]">
                        به زودی تخفیف‌های ویژه‌ای برای شما آماده می‌شود
                    </p>
                </div>
            </div>
        </section>
    )
})

/* ============================================================
   SpecialOffers
   ============================================================ */
export default function SpecialOffers({ halls = [], isLoading = false }) {
    /* offers — با فیلتر و slice در یک پاس */
    const displayOffers = useMemo(() => {
        if (!Array.isArray(halls) || halls.length === 0) return []

        const withDiscount = []
        const withoutDiscount = []

        for (let i = 0; i < halls.length; i++) {
            const h = halls[i]
            if (hasValidDiscount(h)) withDiscount.push(h)
            else withoutDiscount.push(h)
        }

        const primary = withDiscount.length > 0 ? withDiscount : withoutDiscount
        return primary.slice(0, 4)
    }, [halls])

    if (isLoading) return <LoadingState />
    if (displayOffers.length === 0) return <EmptyState />

    return (
        <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* هدر — بدون framer-motion */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="w-16 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-2xl">
                            <FaFire className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                            تخفیفات ویژه
                        </h2>
                        <div className="w-16 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
                    </div>
                    <p className="text-[#8E8276] text-base md:text-lg max-w-2xl mx-auto">
                        فرصت‌های استثنایی برای برگزاری مراسم با بهترین قیمت‌ها
                    </p>
                </div>

                {/* گرید */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayOffers.map((hall, index) => (
                        <OfferCard key={hall._id} hall={hall} index={index} />
                    ))}
                </div>

                {/* مشاهده همه */}
                {halls.length > 4 && (
                    <div className="text-center mt-12">
                        <Link
                            href="/halls"
                            prefetch={false}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-600 rounded-xl font-bold shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            مشاهده همه تالارها
                            <FaArrowLeft className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    )
}