// components/landing/PopularHalls.jsx
'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { PiArrowLeft } from 'react-icons/pi'

import HallCard from './shared/HallCard'
import MoreCard from './shared/MoreCard'
import NavButton from './shared/NavButton'
import { useCarousel } from './shared/useCarousel'

/* ============================================================
   PopularHalls — اسلایدر محبوب‌ترین تالارها (تم طلایی)
   ============================================================ */
export default function PopularHalls({ halls = [] }) {
    const popularHalls = useMemo(
        () => (Array.isArray(halls) ? halls.slice(0, 10) : []),
        [halls]
    )

    const {
        scrollRef,
        canScrollLeft,
        canScrollRight,
        activeIndex,
        scrollByDirection,
        scrollToIndex,
        onKeyDown,
    } = useCarousel({ itemsCount: popularHalls.length + 1, gap: 16 })

    if (popularHalls.length === 0) return null

    const totalCards = popularHalls.length + 1 // + MoreCard

    return (
        <section
            className="
                relative py-12 md:py-16
                bg-gradient-to-b from-transparent via-[#FBF7EC]/30 to-transparent
            "
            aria-labelledby="popular-halls-heading"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* ==================== هدر ==================== */}
                <div className="flex items-end justify-between gap-4 mb-7 flex-wrap">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <span
                                className="w-6 h-1 rounded-full bg-gradient-to-l from-[#C6A14C] to-[#A8853A]"
                                aria-hidden="true"
                            />
                            <span className="text-[11px] font-bold text-[#A8853A] tracking-wide">
                                پیشنهاد ویژه
                            </span>
                        </div>

                        <h2
                            id="popular-halls-heading"
                            className="text-xl md:text-2xl font-black text-slate-800 mb-1"
                        >
                            محبوب‌ترین تالارها
                        </h2>

                        <p className="text-slate-500 text-xs md:text-sm">
                            بهترین و لوکس‌ترین تالارهای برگزاری مراسم در سراسر ایران
                        </p>
                    </div>

                    <div className="flex items-center gap-2 self-start shrink-0">
                        <NavButton
                            direction="prev"
                            onClick={() => scrollByDirection('prev')}
                            disabled={!canScrollLeft}
                            variant="gold"
                        />
                        <NavButton
                            direction="next"
                            onClick={() => scrollByDirection('next')}
                            disabled={!canScrollRight}
                            variant="gold"
                        />

                        <Link
                            href="/halls"
                            prefetch={false}
                            className="
                                hidden sm:inline-flex items-center gap-1.5
                                h-10 px-4 rounded-2xl
                                bg-white text-slate-700
                                text-xs font-bold
                                shadow-[0_2px_8px_-2px_rgba(15,23,42,0.1)]
                                hover:bg-[#C6A14C] hover:text-white
                                hover:shadow-[0_8px_20px_-4px_rgba(198,161,76,0.35)]
                                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/40
                                transition-all duration-300
                            "
                        >
                            <span>مشاهده همه</span>
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
                aria-label="محبوب‌ترین تالارها"
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
                    {popularHalls.map((hall, index) => (
                        <div key={hall._id || `idx-${index}`} data-card>
                            <HallCard hall={hall} index={index} accent="gold" />
                        </div>
                    ))}

                    <div data-card>
                        <MoreCard
                            href="/halls"
                            label="مشاهده تالارهای بیشتر"
                            variant="gold"
                            ariaLabel="مشاهده تمام تالارها"
                        />
                    </div>

                    {/* Spacer انتهایی برای اسکرول راحت آخرین کارت */}
                    <div className="flex-shrink-0 w-2" aria-hidden="true" />
                </div>

                {/* ==================== Dot Indicators (موبایل) ==================== */}
                {totalCards > 3 && (
                    <div
                        className="flex items-center justify-center gap-1.5 mt-5 md:hidden"
                        role="tablist"
                        aria-label="صفحه‌بندی اسلایدر محبوب‌ترین تالارها"
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