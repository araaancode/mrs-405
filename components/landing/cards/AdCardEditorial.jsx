// components/landing/cards/AdCardEditorial.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
    PiArrowUpLeft,
    PiMapPin,
} from "react-icons/pi";

export default function AdCardEditorial({ ad, onClick, width }) {
    const image = ad?.images?.[0] || ad?.image || "/placeholder.jpg";
    const city = ad?.hall_id?.city || ad?.city || "";
    const province = ad?.hall_id?.province || ad?.province || "";
    const finalPrice = ad?.price ?? 0;
    const originalPrice = ad?.original_price ?? finalPrice;
    const discount =
        originalPrice > finalPrice && originalPrice > 0
            ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
            : 0;

    return (
        <Link
            href={ad.target_url || "#"}
            onClick={onClick}
            style={{ flex: `0 0 calc(${width} - 20px)` }}
            className="group relative flex flex-row h-[230px] bg-white rounded-sm overflow-hidden shadow-[0_1px_20px_-6px_rgba(0,0,0,0.3)] hover:shadow-gold-md transition-all duration-500"
        >
            {/* Vertical gold stripe on far right */}
            <span className="absolute right-0 top-0 bottom-0 w-1 gradient-gold z-10" />

            {/* Image (right) */}
            <div className="relative shrink-0 w-[38%] bg-[var(--color-accent-50)] overflow-hidden">
                <Image
                    src={image}
                    alt={ad.title || "تبلیغ"}
                    fill
                    sizes="40vw"
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                {/* Editorial number badge */}
                <div className="absolute top-3 right-3 text-[var(--color-primary-dark)] font-black text-2xl opacity-80 drop-shadow-md">
                    {String(ad._id || "").slice(-2)}
                </div>
            </div>

            {/* Content (left) */}
            <div className="flex flex-col flex-1 p-5 min-w-0">
                {/* Category + Location */}
                <div className="flex items-center gap-2 text-[10px] tracking-widest font-bold text-[var(--color-accent-700)] uppercase mb-3">
                    <span>Featured</span>
                    <span className="w-6 h-px bg-[var(--color-accent)]" />
                    {(province || city) && (
                        <span className="inline-flex items-center gap-1 text-[var(--color-text-muted)] font-medium normal-case tracking-normal">
                            <PiMapPin className="w-3 h-3" />
                            {[province, city].filter(Boolean).join("، ")}
                        </span>
                    )}
                </div>

                {/* Title - serif-like feel */}
                <h3 className="text-lg sm:text-xl font-extrabold text-[var(--color-primary)] line-clamp-2 leading-tight group-hover:text-[var(--color-accent-700)] transition-colors">
                    {ad.title}
                </h3>

                {/* Thin gold underline */}
                <span className="w-10 h-0.5 gradient-gold mt-2.5 group-hover:w-20 transition-all duration-500" />

                {ad.description && (
                    <p className="text-[11px] text-[var(--color-text-muted)] line-clamp-2 mt-2.5 leading-relaxed">
                        {ad.description}
                    </p>
                )}

                {/* Bottom row */}
                <div className="mt-auto flex items-end justify-between gap-3">
                    <div className="flex flex-col">
                        {discount > 0 && (
                            <span className="text-[10px] text-[var(--color-error)] font-bold">
                                {discount}٪ تخفیف ویژه
                            </span>
                        )}
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-[var(--color-primary)] leading-none">
                                {formatPrice(finalPrice)}
                            </span>
                            <span className="text-[10px] text-[var(--color-text-muted)]">
                                تومان
                            </span>
                        </div>
                    </div>

                    <span className="group/cta inline-flex items-center gap-1.5 text-xs font-extrabold text-[var(--color-primary)] border-b-2 border-[var(--color-accent)] pb-0.5 hover:text-[var(--color-accent-700)] transition-colors shrink-0">
                        بیشتر بدانید
                        <PiArrowUpLeft className="w-3.5 h-3.5 group-hover/cta:-translate-y-0.5 group-hover/cta:-translate-x-0.5 transition-transform" />
                    </span>
                </div>
            </div>
        </Link>
    );
}

function formatPrice(n) {
    if (!n && n !== 0) return "-";
    return Number(n).toLocaleString("fa-IR");
}