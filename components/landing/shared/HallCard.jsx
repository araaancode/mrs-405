// components/landing/shared/HallCard.jsx
'use client'

import { useState, useEffect, memo, useRef, useCallback, useMemo } from 'react'
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
    PiCaretLeftBold,
    PiCaretRightBold,
} from 'react-icons/pi'
import { faNum, getHallImages, PLACEHOLDER, computePricing } from './helpers'

const SWIPE_THRESHOLD = 40

const HallCard = memo(function HallCard({
    hall,
    index = 0,
    accent = 'gold',
    forceCarousel = false,
}) {
    /* ============================================================
       تصاویر
       ============================================================ */
    const images = useMemo(() => {
        const imgs = getHallImages(hall).filter(Boolean)
        // 🔥 DEBUG — این خط رو نگه دار تا ببینی چند تصویر میاد
        console.log('🖼️ HallCard images:', hall?.title, '→', imgs.length, imgs)
        return imgs.length > 0 ? imgs : [PLACEHOLDER]
    }, [hall])

    const displayImages = useMemo(() => {
        if (!forceCarousel || images.length > 1) return images
        return [images[0], PLACEHOLDER, PLACEHOLDER, PLACEHOLDER]
    }, [images, forceCarousel])

    const [imgIndex, setImgIndex] = useState(0)
    const [failedImgs, setFailedImgs] = useState(() => new Set())
    const [isDragging, setIsDragging] = useState(false)
    const [dragX, setDragX] = useState(0)

    const dragStartX = useRef(0)
    const dragStartTime = useRef(0)
    const didDragRef = useRef(false)

    useEffect(() => {
        setImgIndex(0)
        setFailedImgs(new Set())
        setDragX(0)
    }, [hall])

    const safeImages = useMemo(
        () => displayImages.map((src) => (failedImgs.has(src) ? PLACEHOLDER : src)),
        [displayImages, failedImgs]
    )

    const total = safeImages.length
    const hasMultiple = total > 1

    const hallHref = `/halls/${hall._id}`

    /* ============================================================
       ناوبری
       ============================================================ */
    const goTo = useCallback(
        (i) => {
            if (total === 0) return
            const next = ((i % total) + total) % total
            console.log('🎯 goTo:', next, 'of', total) // 🔥 DEBUG
            setImgIndex(next)
        },
        [total]
    )

    const goNext = useCallback(() => goTo(imgIndex + 1), [goTo, imgIndex])
    const goPrev = useCallback(() => goTo(imgIndex - 1), [goTo, imgIndex])

    /* ============================================================
       Swipe / Drag
       ============================================================ */
    const onPointerDown = (e) => {
        if (!hasMultiple) return
        if (e.pointerType === 'mouse' && e.button !== 0) return
        setIsDragging(true)
        dragStartX.current = e.clientX
        dragStartTime.current = Date.now()
        didDragRef.current = false
        setDragX(0)
        e.currentTarget.setPointerCapture?.(e.pointerId)
    }

    const onPointerMove = (e) => {
        if (!isDragging) return
        const dx = e.clientX - dragStartX.current
        if (Math.abs(dx) > 5) didDragRef.current = true
        setDragX(dx)
    }

    const onPointerUp = (e) => {
        if (!isDragging) return
        const dx = e.clientX - dragStartX.current
        const dt = Date.now() - dragStartTime.current
        const velocity = Math.abs(dx) / Math.max(dt, 1)

        setIsDragging(false)
        setDragX(0)
        e.currentTarget.releasePointerCapture?.(e.pointerId)

        if (Math.abs(dx) > SWIPE_THRESHOLD || velocity > 0.5) {
            if (dx < 0) goNext()
            else goPrev()
        }
    }

    const onPointerCancel = (e) => {
        setIsDragging(false)
        setDragX(0)
        e.currentTarget.releasePointerCapture?.(e.pointerId)
    }

    const onKeyDown = (e) => {
        if (!hasMultiple) return
        if (e.key === 'ArrowLeft') {
            e.preventDefault()
            goNext()
        } else if (e.key === 'ArrowRight') {
            e.preventDefault()
            goPrev()
        }
    }

    const handleImageAreaClick = (e) => {
        if (didDragRef.current) {
            e.preventDefault()
            e.stopPropagation()
            didDragRef.current = false
        }
    }

    const handleNavClick = (e, action) => {
        e.preventDefault()
        e.stopPropagation()
        e.nativeEvent?.stopImmediatePropagation?.()
        action()
    }

    /* ============================================================
       Pricing
       ============================================================ */
    const { finalPrice, discountPercent, hasDiscount, hasPrice, mainPrice } =
        computePricing(hall)

    const isHot = accent === 'hot'

    const palette = isHot
        ? {
              primary: '#A8853A',
              primarySoft: '#F6EED5',
              ring: 'rgba(168,133,58,0.45)',
              badgeBg: 'linear-gradient(135deg, #C6A14C 0%, #A8853A 100%)',
              badgeShadow: '0 4px 12px -2px rgba(168,133,58,0.55)',
          }
        : {
              primary: '#C6A14C',
              primarySoft: '#FBF7EC',
              ring: 'rgba(198,161,76,0.4)',
              badgeBg: '#10B981',
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
            {/* ==================== گالری تصاویر ==================== */}
            <div
                role="region"
                aria-roledescription="carousel"
                aria-label={`گالری تصاویر ${hall.title || 'تالار'}`}
                tabIndex={hasMultiple ? 0 : -1}
                onKeyDown={onKeyDown}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerCancel}
                className="
                    relative w-full aspect-[4/3] overflow-hidden bg-slate-100
                    select-none
                    focus-visible:outline-none
                    rounded-t-3xl
                "
                style={{
                    touchAction: 'pan-y',
                    cursor: hasMultiple ? 'grab' : 'pointer',
                }}
            >
                {/* Link فقط روی ناحیه تصویر */}
                <Link
                    href={hallHref}
                    prefetch={false}
                    aria-label={`مشاهده ${hall.title} در ${hall.city || 'ایران'}`}
                    onClick={handleImageAreaClick}
                    className="
                        absolute inset-0 z-10
                        focus-visible:outline-none
                        focus-visible:ring-4 focus-visible:ring-inset
                    "
                    style={{ outlineColor: palette.primary }}
                >
                    <span className="sr-only">مشاهده جزئیات {hall.title}</span>
                </Link>

                {/* 🔥🔥🔥 تصاویر — به جای transform، از opacity استفاده می‌کنیم
                    این روش ۱۰۰٪ در همه مرورگرها کار می‌کنه */}
                <div className="absolute inset-0 pointer-events-none">
                    {safeImages.map((src, i) => {
                        const isActive = i === imgIndex
                        return (
                            <div
                                key={`${src}-${i}`}
                                className="absolute inset-0 transition-opacity duration-500 ease-out"
                                style={{
                                    opacity: isActive ? 1 : 0,
                                    zIndex: isActive ? 1 : 0,
                                    // 🔥 برای اطمینان بیشتر
                                    visibility: isActive ? 'visible' : 'hidden',
                                }}
                                aria-hidden={!isActive}
                            >
                                <Image
                                    src={src}
                                    alt={`${hall.title || 'تالار'} - تصویر ${faNum(i + 1)}`}
                                    fill
                                    sizes="(max-width: 640px) 260px, 272px"
                                    quality={80}
                                    priority={index < 3 && i === 0}
                                    loading={index < 3 && i === 0 ? 'eager' : 'lazy'}
                                    unoptimized={
                                        src.startsWith('data:') || src === PLACEHOLDER
                                    }
                                    onError={() => {
                                        console.warn('❌ image failed:', src) // 🔥 DEBUG
                                        setFailedImgs((prev) => {
                                            const next = new Set(prev)
                                            next.add(src)
                                            return next
                                        })
                                    }}
                                    className="
                                        object-cover
                                        transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                                        group-hover/card:scale-[1.07]
                                        will-change-transform
                                    "
                                    draggable={false}
                                />
                            </div>
                        )
                    })}
                </div>

                {/* گرادیان */}
                <div
                    className="
                        absolute inset-0 z-20 pointer-events-none
                        bg-gradient-to-t from-black/60 via-black/5 to-transparent
                        opacity-90 group-hover/card:opacity-100 transition-opacity duration-500
                    "
                    aria-hidden="true"
                />

                {/* ==== دکمه‌های ناوبری ==== */}
                {hasMultiple && (
                    <>
                        <button
                            type="button"
                            onPointerDown={(e) => e.stopPropagation()}
                            onPointerUp={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                            onClick={(e) => handleNavClick(e, goNext)}
                            aria-label="تصویر بعدی"
                            className="
                                absolute left-2 top-1/2 -translate-y-1/2 z-30
                                w-7 h-7 rounded-full
                                bg-white/85 hover:bg-white backdrop-blur-md
                                text-slate-800
                                flex items-center justify-center
                                shadow-md
                                opacity-0 group-hover/card:opacity-100
                                focus-visible:opacity-100
                                transition-opacity duration-300
                                hover:scale-110 active:scale-95
                                cursor-pointer
                            "
                        >
                            <PiCaretLeftBold className="w-3 h-3" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onPointerDown={(e) => e.stopPropagation()}
                            onPointerUp={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                            onClick={(e) => handleNavClick(e, goPrev)}
                            aria-label="تصویر قبلی"
                            className="
                                absolute right-2 top-1/2 -translate-y-1/2 z-30
                                w-7 h-7 rounded-full
                                bg-white/85 hover:bg-white backdrop-blur-md
                                text-slate-800
                                flex items-center justify-center
                                shadow-md
                                opacity-0 group-hover/card:opacity-100
                                focus-visible:opacity-100
                                transition-opacity duration-300
                                hover:scale-110 active:scale-95
                                cursor-pointer
                            "
                        >
                            <PiCaretRightBold className="w-3 h-3" aria-hidden="true" />
                        </button>
                    </>
                )}

                {/* ==== Dot Indicators ==== */}
                {hasMultiple && (
                    <div
                        className="
                            absolute bottom-2 left-1/2 -translate-x-1/2 z-30
                            flex items-center gap-1
                            px-2 py-1 rounded-full
                            bg-black/25 backdrop-blur-md
                        "
                        role="tablist"
                        aria-label="انتخاب تصویر"
                    >
                        {safeImages.map((_, i) => {
                            const active = i === imgIndex
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    role="tab"
                                    aria-selected={active}
                                    aria-label={`تصویر ${faNum(i + 1)}`}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onPointerUp={(e) => e.stopPropagation()}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onTouchStart={(e) => e.stopPropagation()}
                                    onClick={(e) => handleNavClick(e, () => goTo(i))}
                                    className="rounded-full transition-all duration-300 cursor-pointer"
                                    style={{
                                        width: active ? 16 : 6,
                                        height: 6,
                                        backgroundColor: active
                                            ? '#fff'
                                            : 'rgba(255,255,255,0.55)',
                                        boxShadow: active
                                            ? `0 0 0 2px ${palette.ring}`
                                            : 'none',
                                    }}
                                />
                            )
                        })}
                    </div>
                )}

                {/* بج تخفیف */}
                {hasDiscount && (
                    <div className="absolute top-3 right-3 z-40 pointer-events-none">
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

                {/* بج «داغ‌ترین» */}
                {isHot && index === 0 && (
                    <div className="absolute top-3 left-3 z-40 pointer-events-none">
                        <span
                            className="
                                inline-flex items-center gap-1
                                px-2.5 py-1 rounded-xl
                                text-white text-[10px] font-black
                                animate-pulse-slow
                            "
                            style={{
                                background:
                                    'linear-gradient(135deg, #D3B263 0%, #A8853A 100%)',
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
                    <div className="absolute top-3 left-3 z-40 pointer-events-none">
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
                <Link
                    href={hallHref}
                    prefetch={false}
                    className="
                        block
                        focus-visible:outline-none
                        focus-visible:ring-2 focus-visible:ring-offset-2
                        rounded-lg
                    "
                    style={{ outlineColor: palette.primary }}
                    aria-label={`مشاهده ${hall.title}`}
                >
                    <h3 className="text-[15px] font-extrabold text-slate-800 line-clamp-1 mb-1.5 hover:text-[#C6A14C] transition-colors">
                        {hall.title}
                    </h3>
                </Link>

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

                    <Link
                        href={hallHref}
                        prefetch={false}
                        aria-label={`${isHot ? 'دریافت تخفیف' : 'رزرو'} ${hall.title}`}
                        className="
                            inline-flex items-center gap-1
                            text-[11px] font-bold
                            px-3 py-1.5 rounded-xl
                            transition-all duration-300 shrink-0
                            hover:shadow-md hover:scale-105 active:scale-95
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                        "
                        style={{
                            color: palette.primary,
                            backgroundColor: palette.primarySoft,
                            outlineColor: palette.primary,
                        }}
                    >
                        <span>{isHot ? 'دریافت تخفیف' : 'رزرو'}</span>
                        <PiArrowLeft className="w-3 h-3" aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </article>
    )
})

export default HallCard