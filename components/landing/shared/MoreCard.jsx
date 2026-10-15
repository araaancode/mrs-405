// components/landing/shared/MoreCard.jsx
'use client'

import Link from 'next/link'
import { memo } from 'react'
import { PiArrowCircleRight } from 'react-icons/pi'

/**
 * @param {'gold'|'hot'} variant - hot = طلایی اشباع‌تر
 */
const MoreCard = memo(function MoreCard({
    href = '/halls',
    label = 'مشاهده تالارهای بیشتر',
    variant = 'gold',
    ariaLabel = 'مشاهده تمام تالارها',
}) {
    const isHot = variant === 'hot'

    // ✅ هر دو فقط طلایی/سفید
    const palette = isHot
        ? {
              gradientFrom: 'from-[#F6EED5]',
              iconBg: 'bg-[#A8853A]/15',
              iconRing: 'ring-[#A8853A]/30',
              iconBgHover: 'group-hover/more:bg-[#A8853A]',
              iconRingHover: 'group-hover/more:ring-[#A8853A]',
              iconText: 'text-[#A8853A]',
              focusRing: 'focus-visible:ring-[#A8853A]/40',
              hoverShadow: 'hover:shadow-[0_20px_40px_-12px_rgba(168,133,58,0.35)]',
              hoverText: 'group-hover/more:text-[#85672C]',
          }
        : {
              gradientFrom: 'from-[#FBF7EC]',
              iconBg: 'bg-[#C6A14C]/10',
              iconRing: 'ring-[#C6A14C]/20',
              iconBgHover: 'group-hover/more:bg-[#C6A14C]',
              iconRingHover: 'group-hover/more:ring-[#C6A14C]',
              iconText: 'text-[#C6A14C]',
              focusRing: 'focus-visible:ring-[#C6A14C]/40',
              hoverShadow: 'hover:shadow-[0_20px_40px_-12px_rgba(198,161,76,0.3)]',
              hoverText: 'group-hover/more:text-[#A8853A]',
          }

    return (
        <Link
            href={href}
            prefetch={false}
            aria-label={ariaLabel}
            className={`
                group/more flex-shrink-0 w-[260px] sm:w-[272px]
                flex flex-col items-center justify-center gap-3
                rounded-3xl
                bg-gradient-to-br ${palette.gradientFrom} to-white
                shadow-[0_2px_16px_-4px_rgba(15,23,42,0.06)]
                ${palette.hoverShadow}
                focus-visible:outline-none focus-visible:ring-4 ${palette.focusRing}
                transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                hover:-translate-y-1.5
                snap-start
            `}
        >
            <div
                className={`
                    w-14 h-14 rounded-full
                    ${palette.iconBg} ring-1 ${palette.iconRing}
                    flex items-center justify-center
                    ${palette.iconBgHover} ${palette.iconRingHover}
                    group-hover/more:scale-110
                    transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                `}
            >
                <PiArrowCircleRight
                    className={`
                        w-7 h-7 ${palette.iconText}
                        group-hover/more:text-white
                        transition-colors duration-300
                    `}
                    aria-hidden="true"
                />
            </div>

            <span
                className={`
                    font-bold text-xs text-slate-700
                    ${palette.hoverText}
                    transition-colors duration-300
                `}
            >
                {label}
            </span>
        </Link>
    )
})

export default MoreCard