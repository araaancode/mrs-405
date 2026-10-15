// components/landing/shared/CityCard.jsx
'use client'

import { useState, useEffect, memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PiMapPinFill, PiBuildings, PiArrowLeft } from 'react-icons/pi'

const PLACEHOLDER = '/images/placeholder-city.jpg'

/* نرمال‌سازی URL تصویر شهر */
function normalizeCityImage(url) {
    if (!url || typeof url !== 'string') return PLACEHOLDER
    const trimmed = url.trim()
    if (!trimmed) return PLACEHOLDER
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
    if (trimmed.startsWith('data:')) return trimmed
    if (trimmed.startsWith('./')) return '/' + trimmed.slice(2)
    if (!trimmed.startsWith('/')) return '/' + trimmed
    return trimmed
}

const faNum = (n) => Number(n || 0).toLocaleString('fa-IR')

/**
 * CityCard — کارت شهر
 *
 * @param {object} city  - { _id, name, slug, province, image, halls_count }
 * @param {number} index - برای priority تصویر
 */
const CityCard = memo(function CityCard({ city, index = 0 }) {
    const [imgSrc, setImgSrc] = useState(() =>
        normalizeCityImage(city?.image || city?.thumbnail)
    )

    useEffect(() => {
        setImgSrc(normalizeCityImage(city?.image || city?.thumbnail))
    }, [city])

    const name = city?.name || city?.city || 'شهر'
    const province = city?.province || ''
    const hallsCount = Number(city?.halls_count || city?.count || 0)
    const href = city?.slug
        ? `/halls?city=${encodeURIComponent(city.slug)}`
        : `/halls?city=${encodeURIComponent(name)}`

    return (
        <Link
            href={href}
            prefetch={false}
            aria-label={`مشاهده تالارهای ${name}${province ? ` در استان ${province}` : ''}`}
            className="
                city-slide
                group/city relative
                flex flex-col
                rounded-3xl overflow-hidden
                bg-white
                shadow-[0_2px_16px_-4px_rgba(15,23,42,0.08),0_1px_2px_rgba(15,23,42,0.04)]
                hover:shadow-[0_20px_40px_-12px_rgba(198,161,76,0.35)]
                focus-visible:outline-none
                focus-visible:ring-4 focus-visible:ring-[#C6A14C]/40
                transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                hover:-translate-y-1.5
                will-change-transform
                snap-start
            "
        >
            {/* ==================== تصویر ==================== */}
            <div className="relative w-full flex-1 overflow-hidden bg-slate-100">
                <Image
                    src={imgSrc}
                    alt={name}
                    fill
                    sizes="(max-width: 480px) 150px, (max-width: 640px) 160px, (max-width: 768px) 170px, (max-width: 1024px) 180px, (max-width: 1280px) 190px, 200px"
                    quality={75}
                    priority={index < 4}
                    loading={index < 4 ? 'eager' : 'lazy'}
                    onError={() => setImgSrc(PLACEHOLDER)}
                    className="
                        object-cover
                        transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                        group-hover/city:scale-110
                        will-change-transform
                    "
                />

                {/* گرادیان پایین — برای خوانایی متن */}
                <div
                    className="
                        absolute inset-0 pointer-events-none
                        bg-gradient-to-t from-black/75 via-black/20 to-transparent
                        opacity-95 group-hover/city:opacity-100 transition-opacity duration-500
                    "
                    aria-hidden="true"
                />

                {/* گرادیان بالایی — برای بج تعداد */}
                <div
                    className="
                        absolute inset-x-0 top-0 h-16 pointer-events-none
                        bg-gradient-to-b from-black/40 to-transparent
                    "
                    aria-hidden="true"
                />

                {/* بج تعداد تالارها */}
                {hallsCount > 0 && (
                    <div className="absolute top-2.5 right-2.5 z-20">
                        <span
                            className="
                                inline-flex items-center gap-1
                                px-2 py-0.5 rounded-lg
                                bg-white/90 backdrop-blur-md
                                text-slate-800 text-[10px] font-bold
                                shadow-sm
                            "
                        >
                            <PiBuildings
                                className="w-3 h-3 text-[#C6A14C]"
                                aria-hidden="true"
                            />
                            {faNum(hallsCount)}
                        </span>
                    </div>
                )}

                {/* محتوای روی تصویر */}
                <div className="absolute inset-x-0 bottom-0 p-3 z-10">
                    {/* نام شهر */}
                    <h3
                        className="
                            text-sm font-extrabold text-white
                            leading-tight line-clamp-1
                            drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]
                            transition-colors duration-300
                        "
                    >
                        {name}
                    </h3>

                    {/* استان */}
                    {province && (
                        <div className="
                            flex items-center gap-1 mt-0.5
                            text-[10px] text-white/85
                            drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]
                        ">
                            <PiMapPinFill
                                className="w-2.5 h-2.5 text-[#E0C67B]"
                                aria-hidden="true"
                            />
                            <span className="truncate">{province}</span>
                        </div>
                    )}
                </div>

                {/* فلش hover — گوشه پایین چپ */}
                <div
                    className="
                        absolute bottom-2.5 left-2.5 z-20
                        w-6 h-6 rounded-full
                        bg-[#C6A14C]
                        flex items-center justify-center
                        opacity-0 -translate-x-1
                        group-hover/city:opacity-100 group-hover/city:translate-x-0
                        transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                    "
                    aria-hidden="true"
                >
                    <PiArrowLeft className="w-3 h-3 text-white" />
                </div>
            </div>
        </Link>
    )
})

export default CityCard