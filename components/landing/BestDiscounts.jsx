// components/landing/BestDiscounts.jsx
'use client'

import { useMemo, useState, useEffect, memo } from 'react'
import Link from 'next/link'
import { PiArrowLeft, PiFireFill, PiLightningFill } from 'react-icons/pi'

import HallCard from './shared/HallCard'
import MoreCard from './shared/MoreCard'
import NavButton from './shared/NavButton'
import { useCarousel } from './shared/useCarousel'
import { pickBestDiscounts, computePricing, faNum } from './shared/helpers'

/* ============================================================
   CountdownBadge — تایمر طلایی تا پایان امروز
   ============================================================ */
const CountdownBadge = memo(function CountdownBadge() {
    const endOfDay = useMemo(() => {
        const d = new Date()
        d.setHours(23, 59, 59, 999)
        return d.getTime()
    }, [])

    const [remaining, setRemaining] = useState(() => endOfDay - Date.now())

    useEffect(() => {
        const id = setInterval(() => {
            setRemaining(Math.max(0, endOfDay - Date.now()))
        }, 1000)
        return () => clearInterval(id)
    }, [endOfDay])

    const totalSec = Math.floor(remaining / 1000)
    const hours = Math.floor(totalSec / 3600)
    const minutes = Math.floor((totalSec % 3600) / 60)
    const seconds = totalSec % 60
    const pad = (n) => String(n).padStart(2, '0')

    return (
        <div
            className="
                hidden sm:inline-flex items-center gap-1.5
                px-3 h-9 rounded-2xl
                bg-[#FBF7EC] ring-1 ring-[#C6A14C]/25
                text-[#85672C] text-[11px] font-bold
                tabular-nums
            "
            aria-label={`زمان باقی‌مانده تا پایان امروز: ${pad(hours)} ساعت و ${pad(minutes)} دقیقه`}
        >
            <PiLightningFill className="w-3.5 h-3.5" aria-hidden="true" />
            <span>پایان تا</span>
            <span className="font-black">
                {pad(hours)}:{pad(minutes)}:{pad(seconds)}
            </span>
        </div>
    )
})

/* ============================================================
   BestDiscounts — اسلایدر پرتخفیف‌ترین تالارها (تم طلایی)
   ============================================================ */
export default function BestDiscounts({ halls = [], limit = 10 }) {
    const discounted = useMemo(
        () => pickBestDiscounts(halls, limit),
        [halls, limit]
    )

    const totalSavings = useMemo(() => {
        return discounted.reduce((sum, hall) => {
            const { price, finalPrice } = computePricing(hall)
            return sum + Math.max(price - finalPrice, 0)
        }, 0)
    }, [discounted])

    const {
        scrollRef,
        canScrollLeft,
        canScrollRight,
        activeIndex,
        scrollByDirection,
        scrollToIndex,
        onKeyDown,
    } = useCarousel({ itemsCount: discounted.length + 1, gap: 16 })

    if (discounted.length === 0) return null

    const totalCards = discounted.length + 1 // + MoreCard

    return (
        <section
            className="
                relative py-12 md:py-16
                bg-gradient-to-b from-[#FBF7EC]/60 via-[#FBF7EC]/20 to-transparent
            "
            aria-labelledby="best-discounts-heading"
        >
            {/* دکور طلایی پس‌زمینه */}
            <div
                className="
                    pointer-events-none absolute inset-0 opacity-[0.05]
                    bg-[radial-gradient(circle_at_20%_20%,#C6A14C_0%,transparent_50%),radial-gradient(circle_at_80%_60%,#A8853A_0%,transparent_50%)]
                "
                aria-hidden="true"
            />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* ==================== هدر ==================== */}
                <div className="flex items-end justify-between gap-4 mb-7 flex-wrap">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <span
                                className="
                                    inline-flex items-center justify-center
                                    w-6 h-6 rounded-lg
                                    shadow-[0_4px_12px_-2px_rgba(168,133,58,0.5)]
                                "
                                style={{
                                    background:
                                        'linear-gradient(135deg, #C6A14C 0%, #A8853A 100%)',
                                }}
                            >
                                <PiFireFill
                                    className="w-3.5 h-3.5 text-white"
                                    aria-hidden="true"
                                />
                            </span>
                            <span className="text-[11px] font-bold text-[#A8853A] tracking-wide">
                                پیشنهاد داغ
                            </span>
                        </div>

                        <h2
                            id="best-discounts-heading"
                            className="text-xl md:text-2xl font-black text-slate-800 mb-1"
                        >
                            پرتخفیف‌ترین تالارها
                        </h2>

                        <p className="text-slate-500 text-xs md:text-sm">
                            {totalSavings > 0 ? (
                                <>
                                    تا{' '}
                                    <span className="font-bold text-[#A8853A] tabular-nums">
                                        {faNum(totalSavings)}
                                    </span>{' '}
                                    تومان صرفه‌جویی در این پیشنهادها
                                </>
                            ) : (
                                'بیشترین تخفیف‌ها روی تالارهای منتخب'
                            )}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 self-start shrink-0">
                        <CountdownBadge />

                        <NavButton
                            direction="prev"
                            onClick={() => scrollByDirection('prev')}
                            disabled={!canScrollLeft}
                            variant="hot"
                        />
                        <NavButton
                            direction="next"
                            onClick={() => scrollByDirection('next')}
                            disabled={!canScrollRight}
                            variant="hot"
                        />

                        <Link
                            href="/halls?sort=discount"
                            prefetch={false}
                            className="
                                hidden sm:inline-flex items-center gap-1.5
                                h-10 px-4 rounded-2xl
                                bg-white text-[#A8853A]
                                text-xs font-bold
                                ring-1 ring-[#C6A14C]/25
                                shadow-[0_2px_8px_-2px_rgba(15,23,42,0.1)]
                                hover:bg-[#C6A14C] hover:text-white hover:ring-[#C6A14C]
                                hover:shadow-[0_8px_20px_-4px_rgba(198,161,76,0.4)]
                                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/40
                                transition-all duration-300
                            "
                        >
                            <span>همه تخفیف‌ها</span>
                            <PiArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* ==================== ردیف کارت‌ها ==================== */}
            <div
                className="relative max-w-7xl mx-auto"
                role="region"
                aria-roledescription="carousel"
                aria-label="پرتخفیف‌ترین تالارها"
            >
                <div
                    ref={scrollRef}
                    tabIndex={0}
                    onKeyDown={onKeyDown}
                    className="
                        flex gap-4 overflow-x-auto scroll-smooth
                        hide-scrollbar px-4 sm:px-6 lg:px-8 pb-2
                        snap-x snap-mandatory
                        focus-visible:outline-none
                        focus-visible:ring-2 focus-visible:ring-[#C6A14C]/40
                        focus-visible:ring-offset-2
                        rounded-2xl
                    "
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        scrollPaddingInline: '1rem',
                    }}
                >
                    {discounted.map((hall, index) => (
                        <div key={hall._id || `idx-${index}`} data-card>
                            <HallCard hall={hall} index={index} accent="hot" />
                        </div>
                    ))}

                    <div data-card>
                        <MoreCard
                            href="/halls?sort=discount"
                            label="مشاهده همه تخفیف‌ها"
                            variant="hot"
                            ariaLabel="مشاهده تمام تالارهای تخفیف‌دار"
                        />
                    </div>

                    <div className="flex-shrink-0 w-2" aria-hidden="true" />
                </div>

                {/* ==================== Dot Indicators (موبایل) ==================== */}
                {totalCards > 3 && (
                    <div
                        className="flex items-center justify-center gap-1.5 mt-5 md:hidden"
                        role="tablist"
                        aria-label="صفحه‌بندی اسلایدر تخفیف‌ها"
                    >
                        {Array.from({ length: Math.min(totalCards, 6) }).map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                role="tab"
                                aria-selected={i === activeIndex}
                                aria-label={`رفتن به کارت ${i + 1}`}
                                onClick={() => scrollToIndex(i)}
                                className={`
                                    h-1.5 rounded-full transition-all duration-300
                                    ${
                                        i === activeIndex
                                            ? 'w-6 bg-[#C6A14C]'
                                            : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                                    }
                                `}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}