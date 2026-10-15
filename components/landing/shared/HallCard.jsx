// components/landing/shared/HallCard.jsx
'use client'

import { useState, useEffect, memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    PiMapPinFill,
    PiUsersThreeFill,
    PiCalendarBlank,
    PiTagFill,
    PiArrowLeft,
    PiPhoneCall,
    PiFireFill,
} from 'react-icons/pi'
import { faNum, getHallImages, PLACEHOLDER, computePricing } from './helpers'

/**
 * @param {'gold' | 'hot'} accent
 *   gold = طلایی روشن (PopularHalls)
 *   hot  = طلایی اشباع/تیره‌تر (BestDiscounts) — همچنان در پالت طلایی
 */
const HallCard = memo(function HallCard({ hall, index = 0, accent = 'gold' }) {
    const [imgSrc, setImgSrc] = useState(() => getHallImages(hall)[0] || PLACEHOLDER)

    useEffect(() => {
        setImgSrc(getHallImages(hall)[0] || PLACEHOLDER)
    }, [hall])

    const { finalPrice, discountPercent, hasDiscount, hasPrice, mainPrice } =
        computePricing(hall)

    const isHot = accent === 'hot'

    // ✅ هر دو پالت فقط طلایی/سفید — hot فقط اشباع‌تر
    const palette = isHot
        ? {
              primary: '#A8853A',         // طلایی تیره
              primarySoft: '#F6EED5',     // طلایی خیلی روشن
              ring: 'rgba(168,133,58,0.45)',
              shadow: 'rgba(168,133,58,0.55)',
              shadowCard: 'rgba(168,133,58,0.35)',
              badgeBg: 'linear-gradient(135deg, #C6A14C 0%, #A8853A 100%)',
              badgeShadow: '0 4px 12px -2px rgba(168,133,58,0.55)',
          }
        : {
              primary: '#C6A14C',
              primarySoft: '#FBF7EC',
              ring: 'rgba(198,161,76,0.4)',
              shadow: 'rgba(198,161,76,0.5)',
              shadowCard: 'rgba(198,161,76,0.35)',
              badgeBg: '#10B981',  // بج تخفیف PopularHalls سبز می‌ماند
              badgeShadow: '0 4px 12px -2px rgba(16,185,129,0.5)',
          }

    return (
        <article
            className="
                group/card relative flex flex-col flex-shrink-0
                w-[260px] sm:w-[272px]
                bg-white rounded-3xl
                shadow-[0_2px_16px_-4px_rgba(15,23,42,0.08),0_1px_2px_rgba(15,23,42,0.04)]
                hover:shadow-[0_20px_40px_-12px_rgba(15,23,42,0.18)]
                transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                hover:-translate-y-1.5
                will-change-transform overflow-hidden snap-start
            "
        >
            <Link
                href={`/halls/${hall._id}`}
                prefetch={false}
                aria-label={`مشاهده ${hall.title} در ${hall.city || 'ایران'}`}
                className="
                    flex flex-col flex-1
                    focus-visible:outline-none rounded-3xl
                    focus-visible:ring-4
                "
                style={{ outlineColor: palette.primary }}
            >
                {/* ==================== تصویر ==================== */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
                    <Image
                        src={imgSrc}
                        alt={hall.title || 'تالار'}
                        fill
                        sizes="(max-width: 640px) 260px, 272px"
                        quality={80}
                        priority={index < 3}
                        loading={index < 3 ? 'eager' : 'lazy'}
                        onError={() => setImgSrc(PLACEHOLDER)}
                        className="
                            object-cover
                            transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                            group-hover/card:scale-[1.07]
                            will-change-transform
                        "
                    />

                    <div
                        className="
                            absolute inset-0 pointer-events-none
                            bg-gradient-to-t from-black/60 via-black/5 to-transparent
                            opacity-90 group-hover/card:opacity-100 transition-opacity duration-500
                        "
                        aria-hidden="true"
                    />

                    {/* بج تخفیف */}
                    {hasDiscount && (
                        <div className="absolute top-3 right-3 z-20">
                            <span
                                className="
                                    inline-flex items-center gap-1
                                    px-2.5 py-1 rounded-xl
                                    text-white text-[11px] font-extrabold tracking-tight
                                "
                                style={{
                                    background: palette.badgeBg,
                                    boxShadow: palette.badgeShadow,
                                }}
                            >
                                {isHot ? (
                                    <PiFireFill className="w-3 h-3" aria-hidden="true" />
                                ) : (
                                    <PiTagFill className="w-3 h-3" aria-hidden="true" />
                                )}
                                {faNum(discountPercent)}٪
                            </span>
                        </div>
                    )}

                    {/* بج «داغ‌ترین» روی کارت اول — فقط طلایی */}
                    {isHot && index === 0 && (
                        <div className="absolute top-3 left-3 z-20">
                            <span
                                className="
                                    inline-flex items-center gap-1
                                    px-2.5 py-1 rounded-xl
                                    text-white text-[10px] font-black
                                    animate-pulse-slow
                                "
                                style={{
                                    background: 'linear-gradient(135deg, #D3B263 0%, #A8853A 100%)',
                                    boxShadow: '0 4px 14px -2px rgba(168,133,58,0.7)',
                                }}
                            >
                                <PiFireFill className="w-3 h-3" aria-hidden="true" />
                                داغ‌ترین
                            </span>
                        </div>
                    )}

                    {/* نوع تالار */}
                    {hall.hall_type && !(isHot && index === 0) && (
                        <div className="absolute top-3 left-3 z-20">
                            <span
                                className="
                                    inline-flex items-center
                                    px-2.5 py-1 rounded-xl
                                    bg-white/90 backdrop-blur-md
                                    text-slate-800 text-[10px] font-bold shadow-sm
                                "
                            >
                                {hall.hall_type}
                            </span>
                        </div>
                    )}
                </div>

                {/* ==================== محتوا ==================== */}
                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-[15px] font-extrabold text-slate-800 line-clamp-1 mb-1.5">
                        {hall.title}
                    </h3>

                    <div className="flex items-center text-[11.5px] gap-1.5 text-slate-500 mb-3">
                        <PiMapPinFill
                            className="w-3.5 h-3.5 shrink-0"
                            style={{ color: palette.primary }}
                            aria-hidden="true"
                        />
                        <span className="truncate">
                            {hall.city}
                            {hall.province && (
                                <span className="text-slate-400"> · {hall.province}</span>
                            )}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 text-[10.5px] font-medium text-slate-600 mb-3.5">
                        {hall.capacity && (
                            <span className="inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                                <PiUsersThreeFill
                                    className="w-3.5 h-3.5"
                                    style={{ color: palette.primary }}
                                    aria-hidden="true"
                                />
                                {faNum(hall.capacity)} نفر
                            </span>
                        )}
                        {hall.duration && (
                            <span className="inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                                <PiCalendarBlank
                                    className="w-3.5 h-3.5"
                                    style={{ color: palette.primary }}
                                    aria-hidden="true"
                                />
                                {faNum(hall.duration)} ساعت
                            </span>
                        )}
                    </div>

                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
                        <div className="flex flex-col min-w-0">
                            {hasPrice ? (
                                <>
                                    <div className="flex items-baseline gap-1">
                                        <span
                                            className="text-[17px] font-black leading-none tabular-nums"
                                            style={{ color: palette.primary }}
                                        >
                                            {faNum(finalPrice)}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium">
                                            تومان
                                        </span>
                                    </div>
                                    {mainPrice > finalPrice && (
                                        <span className="text-[10px] text-slate-400 line-through mt-0.5 tabular-nums">
                                            {faNum(mainPrice)}
                                        </span>
                                    )}
                                </>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                                    <PiPhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
                                    تماس بگیرید
                                </span>
                            )}
                        </div>

                        <span
                            className="
                                inline-flex items-center gap-1
                                text-[11px] font-bold
                                px-3 py-1.5 rounded-xl
                                transition-all duration-300 shrink-0
                            "
                            style={{
                                color: palette.primary,
                                backgroundColor: palette.primarySoft,
                            }}
                        >
                            <span>{isHot ? 'دریافت تخفیف' : 'رزرو'}</span>
                            <PiArrowLeft className="w-3 h-3" aria-hidden="true" />
                        </span>
                    </div>
                </div>
            </Link>
        </article>
    )
})

export default HallCard