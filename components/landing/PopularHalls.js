// components/landing/PopularHalls.jsx
'use client'

import { useRef, useCallback, useMemo, memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    PiMapPinFill,
    PiUsersThreeFill,
    PiCalendarBlank,
    PiTagFill,
    PiArrowRight,
    PiArrowLeft,
    PiArrowCircleRight,
} from 'react-icons/pi'

/* ============================================================
   Formatters
   ============================================================ */
const faNumFormatter = new Intl.NumberFormat('fa-IR')
const faNum = (n) => faNumFormatter.format(Number(n) || 0)

/* ============================================================
   Helpers
   ============================================================ */
const PLACEHOLDER = '/images/placeholder-hall.jpg'

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
   HallCard — هماهنگ با HallCard اصلی
   ✅ ساختار مشابه: تصویر + عنوان + مکان + ویژگی‌ها + قیمت
   ✅ بج تخفیف، دکمه CTA با فلش RTL
   ✅ focus-visible روی همه‌ی عناصر تعاملی
   ============================================================ */
const HallCard = memo(function HallCard({ hall, index = 0 }) {
    const images = useMemo(
        () => getHallImages(hall),
        [hall.images, hall.image, hall.thumbnail]
    )
    const image = images[0] || PLACEHOLDER

    const price = Number(hall.sans_price || 0)
    const discount = Number(hall.sans_discount || 0)
    const finalPrice = Math.max(price - discount, 0)
    const hasPrice = price > 0
    const hasDiscount = discount > 0
    const hasMainPrice = hall.main_price && hall.main_price > hall.sans_price

    return (
        <Link
            href={`/halls/${hall._id}`}
            prefetch={false}
            aria-label={`مشاهده ${hall.title} در ${hall.city || 'ایران'}`}
            className="
                group/card flex flex-col flex-shrink-0 w-[260px]
                bg-white rounded-2xl
                border border-gray-100
                shadow-sm hover:shadow-xl hover:shadow-slate-900/5
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/40
                transition-all duration-300
                hover:-translate-y-1 will-change-transform
                overflow-hidden snap-start
            "
        >
            {/* ==================== تصویر ==================== */}
            <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-gray-100">
                <Image
                    src={image}
                    alt={hall.title}
                    fill
                    sizes="260px"
                    quality={75}
                    priority={index < 3}
                    loading={index < 3 ? 'eager' : 'lazy'}
                    className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105 will-change-transform"
                />

                {/* گرادیانت پایین */}
                <div
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"
                    aria-hidden="true"
                />

                {/* بج تخفیف */}
                {hasDiscount && (
                    <div className="absolute top-3 right-3 z-20">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-500 text-white text-[11px] font-bold shadow-md">
                            <PiTagFill className="w-3 h-3" aria-hidden="true" />
                            {faNum(discount)}٪
                        </span>
                    </div>
                )}

                {/* نوع تالار */}
                {hall.hall_type && (
                    <div className="absolute bottom-3 right-3 z-20">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-[#2C2418] text-[10px] font-bold shadow-sm">
                            {hall.hall_type}
                        </span>
                    </div>
                )}
            </div>

            {/* ==================== محتوا ==================== */}
            <div className="p-4 flex flex-col flex-grow">
                {/* عنوان */}
                <h3 className="text-base font-bold text-[#2C2418] line-clamp-1 mb-1.5 group-hover/card:text-[#A8853A] transition-colors">
                    {hall.title}
                </h3>

                {/* مکان */}
                <div className="flex items-center text-xs gap-1.5 text-gray-500 mb-3">
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

                {/* ویژگی‌ها */}
                <div className="flex flex-wrap gap-1.5 text-[11px] text-gray-600 mb-3">
                    {hall.capacity && (
                        <span className="inline-flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                            <PiUsersThreeFill
                                className="w-3.5 h-3.5 text-[#C6A14C]"
                                aria-hidden="true"
                            />
                            {faNum(hall.capacity)} نفر
                        </span>
                    )}
                    {hall.duration && (
                        <span className="inline-flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                            <PiCalendarBlank
                                className="w-3.5 h-3.5 text-[#C6A14C]"
                                aria-hidden="true"
                            />
                            {faNum(hall.duration)} ساعت
                        </span>
                    )}
                </div>

                {/* قیمت */}
                <div className="mt-auto pt-3 border-t border-gray-100 flex items-end justify-between gap-2">
                    <div className="flex flex-col min-w-0">
                        {hasPrice ? (
                            <>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-base font-black text-[#C6A14C] leading-none">
                                        {faNum(finalPrice)}
                                    </span>
                                    <span className="text-[10px] text-gray-400">
                                        تومان
                                    </span>
                                </div>
                                {hasMainPrice && (
                                    <span className="text-[10px] text-gray-400 line-through mt-0.5">
                                        {faNum(hall.main_price)} تومان
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="text-xs text-gray-400">
                                تماس بگیرید
                            </span>
                        )}
                    </div>

                    {/* دکمه CTA */}
                    <span
                        className="
                            inline-flex items-center gap-1
                            text-[11px] font-bold
                            border-2 border-[#C6A14C]
                            px-2.5 py-1 rounded-lg
                            text-[#C6A14C]
                            group-hover/card:bg-[#C6A14C] group-hover/card:text-white
                            transition-all duration-200
                            shrink-0
                        "
                    >
                        <span>رزرو</span>
                        <PiArrowLeft
                            className="w-3 h-3"
                            aria-hidden="true"
                        />
                    </span>
                </div>
            </div>
        </Link>
    )
})

/* ============================================================
   PopularHalls — چیدمان جاباما
   ✅ هدر با دکمه‌های ناوبری و "مشاهده همه"
   ✅ کارت‌های افقی با اسکرول نرم و snap
   ✅ کارت «مشاهده بیشتر» در انتها
   ============================================================ */
export default function PopularHalls({ halls = [] }) {
    const scrollContainerRef = useRef(null)

    const popularHalls = useMemo(
        () => (Array.isArray(halls) ? halls.slice(0, 10) : []),
        [halls]
    )

    const scroll = useCallback((direction) => {
        const el = scrollContainerRef.current
        if (!el) return
        el.scrollBy({
            left: direction === 'right' ? 280 : -280,
            behavior: 'smooth',
        })
    }, [])

    if (popularHalls.length === 0) return null

    return (
        <section className="py-10 md:py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* ==================== هدر ==================== */}
                <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
                    <div className="min-w-0">
                        <h2 className="text-xl md:text-2xl font-black text-[#2C2418] mb-1">
                            محبوب‌ترین تالارها
                        </h2>
                        <p className="text-gray-500 text-xs md:text-sm">
                            بهترین و لوکس‌ترین تالارهای برگزاری مراسم در
                            سراسر ایران
                        </p>
                    </div>

                    <div className="flex items-center gap-2 self-start shrink-0">
                        <button
                            type="button"
                            onClick={() => scroll('right')}
                            className="
                                w-9 h-9 rounded-lg
                                bg-white border border-gray-200
                                flex items-center justify-center
                                text-[#2C2418]
                                hover:bg-[#C6A14C] hover:border-[#C6A14C] hover:text-white
                                active:scale-95
                                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/40
                                transition-all duration-200 cursor-pointer
                            "
                            aria-label="اسکرول به راست"
                        >
                            <PiArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => scroll('left')}
                            className="
                                w-9 h-9 rounded-lg
                                bg-white border border-gray-200
                                flex items-center justify-center
                                text-[#2C2418]
                                hover:bg-[#C6A14C] hover:border-[#C6A14C] hover:text-white
                                active:scale-95
                                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/40
                                transition-all duration-200 cursor-pointer
                            "
                            aria-label="اسکرول به چپ"
                        >
                            <PiArrowLeft className="w-4 h-4" />
                        </button>
                        <Link
                            href="/halls"
                            prefetch={false}
                            className="
                                hidden sm:inline-flex items-center gap-1.5
                                h-9 px-4 rounded-lg
                                bg-white border border-gray-200
                                text-xs font-bold text-[#2C2418]
                                hover:bg-[#C6A14C] hover:border-[#C6A14C] hover:text-white
                                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/40
                                transition-all duration-200
                            "
                        >
                            <span>مشاهده همه</span>
                            <PiArrowLeft
                                className="w-3.5 h-3.5"
                                aria-hidden="true"
                            />
                        </Link>
                    </div>
                </div>
            </div>

            {/* ==================== ردیف کارت‌ها ==================== */}
            <div className="max-w-7xl mx-auto">
                <div
                    ref={scrollContainerRef}
                    className="
                        flex gap-4 overflow-x-auto scroll-smooth pb-4
                        hide-scrollbar px-4 sm:px-6 lg:px-8
                        snap-x snap-mandatory
                    "
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    {popularHalls.map((hall, index) => (
                        <HallCard
                            key={hall._id || `idx-${index}`}
                            hall={hall}
                            index={index}
                        />
                    ))}

                    {/* کارت مشاهده بیشتر */}
                    <Link
                        href="/halls"
                        prefetch={false}
                        className="
                            flex-shrink-0 w-[240px]
                            flex items-center justify-center
                            border-2 border-dashed border-[#C6A14C]
                            rounded-2xl bg-white/50 hover:bg-white
                            focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/40
                            transition-all duration-200
                            group/more snap-start
                            hover:border-solid hover:shadow-md hover:shadow-[#C6A14C]/10
                        "
                        aria-label="مشاهده تمام تالارها"
                    >
                        <div className="flex flex-col items-center gap-3 text-center p-6">
                            <div
                                className="
                                    w-12 h-12 rounded-full
                                    bg-[#C6A14C]/10
                                    flex items-center justify-center
                                    group-hover/more:bg-[#C6A14C]
                                    transition-colors duration-300
                                "
                            >
                                <PiArrowCircleRight
                                    className="w-6 h-6 text-[#C6A14C] group-hover/more:text-white transition-colors duration-300"
                                    aria-hidden="true"
                                />
                            </div>
                            <span className="font-bold text-xs text-[#2C2418] group-hover/more:text-[#A8853A] transition-colors">
                                مشاهده تالارهای بیشتر
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    )
}