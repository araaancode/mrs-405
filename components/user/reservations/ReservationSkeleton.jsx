// components/user/reservations/ReservationSkeleton.jsx
"use client";

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

export default function ReservationSkeleton() {
    return (
        <div dir="rtl" className="w-full space-y-5">
            {/* هدر */}
            <div className="flex items-center justify-between gap-4">
                <div className="space-y-2">
                    <Shimmer className="h-6 w-32" />
                    <Shimmer className="h-3.5 w-64" />
                </div>
                <Shimmer className="h-10 w-28" rounded="rounded-xl" />
            </div>

            {/* آمار */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                    <Shimmer key={i} className="h-24" rounded="rounded-2xl" />
                ))}
            </div>

            {/* جستجو */}
            <Shimmer className="h-11 w-full" rounded="rounded-xl" />

            {/* کارت‌ها */}
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="
              bg-white rounded-2xl
              ring-1 ring-slate-100
              overflow-hidden
              flex flex-col md:flex-row
            "
                    >
                        <Shimmer
                            className="w-full md:w-64 h-44 md:h-auto flex-shrink-0"
                            rounded="rounded-none"
                        />

                        <div className="flex-1 p-5 space-y-3">
                            <div className="space-y-2">
                                <Shimmer className="h-5 w-2/3" />
                                <Shimmer className="h-3.5 w-1/3" rounded="rounded-md" />
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {[1, 2, 3, 4].map((j) => (
                                    <Shimmer key={j} className="h-14" />
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                <Shimmer className="h-3 w-32" rounded="rounded-md" />
                                <Shimmer className="h-9 w-28" rounded="rounded-lg" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}