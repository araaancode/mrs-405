"use client";

import { useCallback, memo } from "react";
import Image from "next/image";
import { PiTrash, PiStar } from "react-icons/pi";

/* ============================================================
   تشخیص نوع منبع تصویر — یک بار در ماژول
   ============================================================ */
const isRemote = (url) =>
    typeof url === "string" && /^https?:\/\//i.test(url);

const isInline = (url) =>
    typeof url === "string" &&
    (url.startsWith("data:") || url.startsWith("blob:"));

/* ============================================================
   ImageTile — memoized، با next/image برای همه حالات
   ============================================================ */
const ImageTile = memo(function ImageTile({
    src,
    index,
    isCover,
    onRemove,
    onMakeCover,
}) {
    const handleRemove = useCallback(() => onRemove(index), [onRemove, index]);
    const handleMakeCover = useCallback(
        () => onMakeCover(index),
        [onMakeCover, index]
    );

    const remote = isRemote(src);
    const inline = isInline(src);

    return (
        <div className="relative aspect-square rounded-xl overflow-hidden ring-2 ring-slate-200 group">
            {/*
              - remote  → بهینه‌سازی کامل (WebP/AVIF + resize + cache)
              - inline  → unoptimized (چون blob/data در سرور قابل دسترسی نیست)
              - لوکال  → بهینه‌سازی کامل (اگر در /public باشد)
            */}
            {remote || inline ? (
                <Image
                    src={src}
                    alt={`تصویر ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    quality={remote ? 75 : undefined}
                    unoptimized={inline}
                    loading={index < 4 ? "eager" : "lazy"}
                    className="object-cover"
                />
            ) : (
                <Image
                    src={src}
                    alt={`تصویر ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    quality={75}
                    loading={index < 4 ? "eager" : "lazy"}
                    className="object-cover"
                />
            )}

            {isCover && (
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-gold-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-md">
                    <PiStar className="w-3 h-3" />
                    کاور
                </span>
            )}

            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!isCover && (
                    <button
                        type="button"
                        onClick={handleMakeCover}
                        aria-label="انتخاب به عنوان کاور"
                        className="w-8 h-8 rounded-lg bg-white/90 text-gold-600 flex items-center justify-center hover:bg-gold-500 hover:text-white transition"
                    >
                        <PiStar className="w-4 h-4" />
                    </button>
                )}
                <button
                    type="button"
                    onClick={handleRemove}
                    aria-label="حذف تصویر"
                    className="w-8 h-8 rounded-lg bg-white/90 text-rose-600 flex items-center justify-center hover:bg-rose-500 hover:text-white transition"
                >
                    <PiTrash className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
});

/* ============================================================
   Grid
   ============================================================ */
export default function ImagePreviewGrid({ images, onChange }) {
    const remove = useCallback(
        (i) => {
            onChange(images.filter((_, idx) => idx !== i));
        },
        [images, onChange]
    );

    const makeCover = useCallback(
        (i) => {
            const next = [...images];
            const [picked] = next.splice(i, 1);
            next.unshift(picked);
            onChange(next);
        },
        [images, onChange]
    );

    if (!images?.length) return null;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, i) => (
                <ImageTile
                    key={`${i}-${img}`}
                    src={img}
                    index={i}
                    isCover={i === 0}
                    onRemove={remove}
                    onMakeCover={makeCover}
                />
            ))}
        </div>
    );
}