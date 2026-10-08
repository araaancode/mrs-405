"use client";
import { PiTrash, PiStar } from "react-icons/pi";

export default function ImagePreviewGrid({ images, onChange }) {
  const remove = (i) => onChange(images.filter((_, idx) => idx !== i));
  const makeCover = (i) => {
    const next = [...images];
    const [picked] = next.splice(i, 1);
    next.unshift(picked);
    onChange(next);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {images.map((img, i) => (
        <div
          key={i}
          className="relative aspect-square rounded-xl overflow-hidden ring-2 ring-slate-200 group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img}
            alt={`تصویر ${i + 1}`}
            className="w-full h-full object-cover"
          />

          {i === 0 && (
            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-gold-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-md">
              <PiStar className="w-3 h-3" /> کاور
            </span>
          )}

          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            {i !== 0 && (
              <button
                type="button"
                onClick={() => makeCover(i)}
                aria-label="انتخاب به عنوان کاور"
                className="w-8 h-8 rounded-lg bg-white/90 text-gold-600 flex items-center justify-center hover:bg-gold-500 hover:text-white transition"
              >
                <PiStar className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="حذف تصویر"
              className="w-8 h-8 rounded-lg bg-white/90 text-rose-600 flex items-center justify-center hover:bg-rose-500 hover:text-white transition"
            >
              <PiTrash className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}