// app/halls/components/SkeletonCard.jsx
"use client";

/* ============================================================
   Shimmer Block — بلوک با انیمیشن درخشش
   ============================================================ */
function Shimmer({ className = "", rounded = "rounded-lg" }) {
    return (
        <div
            className={`
        relative overflow-hidden
        bg-slate-100
        ${rounded}
        ${className}
      `}
        >
            {/* نوار درخشان */}
            <div
                className="
          absolute inset-0 -translate-x-full
          bg-gradient-to-r from-transparent via-white/70 to-transparent
          animate-[shimmer_1.6s_infinite]
        "
            />
        </div>
    );
}

/* ============================================================
   SkeletonCard
   ============================================================ */
export default function SkeletonCard({ viewMode = "grid" }) {
    /* ---------- حالت LIST ---------- */
    if (viewMode === "list") {
        return (
            <div
                className="
          bg-white rounded-2xl
          border border-slate-100
          shadow-sm
          overflow-hidden
          flex flex-col md:flex-row
        "
            >
                {/* تصویر */}
                <Shimmer
                    className="w-full md:w-72 h-48 md:h-auto flex-shrink-0"
                    rounded="rounded-none"
                />

                {/* محتوا */}
                <div className="flex-1 p-5 sm:p-6 space-y-3">
                    {/* عنوان + موقعیت */}
                    <div className="space-y-2">
                        <Shimmer className="h-5 w-2/3" />
                        <Shimmer className="h-3.5 w-1/3" rounded="rounded-md" />
                    </div>

                    {/* توضیحات */}
                    <div className="space-y-2 pt-1">
                        <Shimmer className="h-3 w-full" rounded="rounded-md" />
                        <Shimmer className="h-3 w-5/6" rounded="rounded-md" />
                    </div>

                    {/* چیپ‌ها */}
                    <div className="flex gap-2 pt-1">
                        <Shimmer className="h-6 w-20" rounded="rounded-lg" />
                        <Shimmer className="h-6 w-16" rounded="rounded-lg" />
                        <Shimmer className="h-6 w-14" rounded="rounded-lg" />
                    </div>

                    {/* قیمت + دکمه */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="space-y-1.5">
                            <Shimmer className="h-2.5 w-20" rounded="rounded-md" />
                            <Shimmer className="h-5 w-28" />
                        </div>
                        <Shimmer className="h-9 w-24" rounded="rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    /* ---------- حالت GRID (پیش‌فرض) ---------- */
    return (
        <div
            className="
        bg-white rounded-2xl
        border border-slate-100
        shadow-sm
        overflow-hidden
        flex flex-col
      "
        >
            {/* ==================== تصویر ==================== */}
            <div className="relative">
                <Shimmer className="h-44 w-full" rounded="rounded-none" />

                {/* تخفیف (سایه) — گوشه بالا راست */}
                <div className="absolute top-3 right-3">
                    <Shimmer className="h-6 w-14" rounded="rounded-lg" />
                </div>

                {/* علاقه‌مندی (سایه) — گوشه بالا چپ */}
                <div className="absolute top-3 left-3">
                    <Shimmer className="w-8 h-8" rounded="rounded-full" />
                </div>
            </div>

            {/* ==================== محتوا ==================== */}
            <div className="p-4 flex flex-col flex-grow">
                {/* عنوان + موقعیت */}
                <div className="mb-2 space-y-2">
                    <Shimmer className="h-5 w-3/4" />
                    <Shimmer className="h-3.5 w-1/2" rounded="rounded-md" />
                </div>

                {/* توضیحات */}
                <div className="space-y-2 mb-3">
                    <Shimmer className="h-3 w-full" rounded="rounded-md" />
                    <Shimmer className="h-3 w-4/5" rounded="rounded-md" />
                </div>

                {/* چیپ‌های ویژگی */}
                <div className="flex flex-wrap gap-2 mb-3">
                    <Shimmer className="h-6 w-20" rounded="rounded-lg" />
                    <Shimmer className="h-6 w-16" rounded="rounded-lg" />
                    <Shimmer className="h-6 w-14" rounded="rounded-lg" />
                </div>

                {/* نشان تخفیف */}
                <Shimmer className="h-6 w-32 mb-3" rounded="rounded-lg" />

                {/* قیمت + دکمه */}
                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    {/* قیمت */}
                    <div className="space-y-1.5 min-w-0 flex-1">
                        <Shimmer className="h-2.5 w-16" rounded="rounded-md" />
                        <Shimmer className="h-5 w-24" />
                    </div>

                    {/* دکمه */}
                    <Shimmer className="h-8 w-24 flex-shrink-0" rounded="rounded-lg" />
                </div>
            </div>
        </div>
    );
}