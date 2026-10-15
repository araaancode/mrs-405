// components/landing/shared/NavButton.jsx
'use client'

import { memo } from 'react'
import { PiArrowRight, PiArrowLeft } from 'react-icons/pi'

/**
 * @param {'gold'|'hot'} variant - hot = طلایی اشباع‌تر
 */
const NavButton = memo(function NavButton({
    direction,
    onClick,
    disabled = false,
    label,
    variant = 'gold',
}) {
    const defaultLabel =
        direction === 'next' ? 'اسکرول به کارت بعدی' : 'اسکرول به کارت قبلی'

    const isNext = direction === 'next'
    const isHot = variant === 'hot'

    // ✅ هر دو طلایی
    const palette = isHot
        ? {
              hoverBg: 'hover:bg-[#A8853A]',
              hoverRing: 'focus-visible:ring-[#A8853A]/40',
              hoverShadow: 'hover:shadow-[0_8px_20px_-4px_rgba(168,133,58,0.4)]',
          }
        : {
              hoverBg: 'hover:bg-[#C6A14C]',
              hoverRing: 'focus-visible:ring-[#C6A14C]/40',
              hoverShadow: 'hover:shadow-[0_8px_20px_-4px_rgba(198,161,76,0.35)]',
          }

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label || defaultLabel}
            aria-disabled={disabled}
            className={`
                hidden md:flex w-10 h-10 rounded-2xl
                bg-white
                shadow-[0_2px_8px_-2px_rgba(15,23,42,0.1)]
                ${palette.hoverShadow}
                items-center justify-center
                text-slate-700
                ${palette.hoverBg} hover:text-white
                active:scale-95
                focus-visible:outline-none focus-visible:ring-4 ${palette.hoverRing}
                disabled:opacity-30 disabled:cursor-not-allowed
                disabled:hover:bg-white disabled:hover:text-slate-700
                disabled:hover:shadow-[0_2px_8px_-2px_rgba(15,23,42,0.1)]
                transition-all duration-300
                cursor-pointer
            `}
        >
            {isNext ? (
                <PiArrowLeft className="w-4 h-4" aria-hidden="true" />
            ) : (
                <PiArrowRight className="w-4 h-4" aria-hidden="true" />
            )}
        </button>
    )
})

export default NavButton