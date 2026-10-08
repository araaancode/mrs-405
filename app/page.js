// app/page.js — Server Component (بدون "use client")
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { PiBuildings, PiWarningCircle } from "react-icons/pi";

/* ============================================================
   Lazy Load — کامپوننت‌های تعاملی (Client)
   ============================================================ */

const HeroSlider = dynamic(() => import("@/components/landing/HeroSlider"), {
    loading: () => (
        <div className="w-full h-[500px] bg-slate-100 animate-pulse rounded-2xl" />
    ),
});

const AdvancedSearch = dynamic(
    () => import("@/components/landing/AdvancedSearch"),
    {
        loading: () => (
            <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg min-h-[400px] animate-pulse">
                <div className="h-8 w-48 bg-slate-100 rounded-lg mx-auto mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 bg-slate-100 rounded-xl" />
                    ))}
                </div>
            </div>
        ),
    }
);

const PopularCities = dynamic(
    () => import("@/components/landing/PopularCities"),
    {
        loading: () => (
            <div className="w-full py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="h-8 w-48 bg-slate-100 rounded-lg mx-auto mb-8 animate-pulse" />
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="h-24 sm:h-28 bg-slate-100 rounded-xl animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            </div>
        ),
    }
);

const PopularHalls = dynamic(
    () => import("@/components/landing/PopularHalls"),
    {
        loading: () => (
            <div className="w-full py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="h-8 w-48 bg-slate-100 rounded-lg mx-auto mb-8 animate-pulse" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="h-72 bg-slate-100 rounded-xl animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            </div>
        ),
    }
);

/* ============================================================
   Empty & Error — بدون framer-motion، فقط CSS
   ============================================================ */
function EmptyState() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <div className="relative w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-gold-50 to-gold-100/60 flex items-center justify-center ring-1 ring-gold-100">
                <PiBuildings className="w-10 h-10 text-gold-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                هنوز تالاری ثبت نشده است
            </h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                به زودی تالارهای جدید به سیستم اضافه خواهند شد
            </p>
        </div>
    );
}

function ErrorState({ message }) {
    return (
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
            <div className="relative w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-rose-50 to-rose-100/60 flex items-center justify-center ring-1 ring-rose-100">
                <PiWarningCircle className="w-10 h-10 text-rose-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                خطا در بارگذاری
            </h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                {message || "متأسفانه در دریافت اطلاعات مشکلی پیش آمد."}
            </p>
        </div>
    );
}

/* ============================================================
   Skeleton برای PopularHalls — به عنوان fallback Suspense
   ============================================================ */
function HallsSkeleton() {
    return (
        <div className="w-full py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <div className="h-8 w-48 bg-slate-100 rounded-lg mx-auto mb-3 animate-pulse" />
                    <div className="w-20 h-1 bg-slate-100 rounded-full mx-auto" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl ring-1 ring-slate-100 overflow-hidden"
                        >
                            <div className="h-44 bg-slate-100 animate-pulse" />
                            <div className="p-4 space-y-3">
                                <div className="h-5 w-3/4 bg-slate-100 rounded-lg animate-pulse" />
                                <div className="h-3.5 w-1/2 bg-slate-100 rounded-md animate-pulse" />
                                <div className="h-9 w-full bg-slate-100 rounded-lg animate-pulse mt-4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ============================================================
   Fetch در سرور — بدون axios، بدون waterfall
   ============================================================ */
async function getHalls() {
    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_BASE_URL ||
            (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
            "http://localhost:3000";

        const res = await fetch(`${baseUrl}/api/halls`, {
            next: { revalidate: 300 }, // ISR: هر ۵ دقیقه بازسازی
            headers: { Accept: "application/json" },
        });

        if (!res.ok) return { halls: [], error: `خطای سرور: ${res.status}` };

        const data = await res.json();

        // استخراج ساده‌تر
        let halls = [];
        if (Array.isArray(data)) halls = data;
        else if (Array.isArray(data?.data)) halls = data.data;
        else if (Array.isArray(data?.halls)) halls = data.halls;
        else if (Array.isArray(data?.results)) halls = data.results;
        else if (Array.isArray(data?.items)) halls = data.items;

        return { halls, error: null };
    } catch (err) {
        return { halls: [], error: err.message || "خطا در بارگذاری داده‌ها" };
    }
}

/* ============================================================
   PopularHallsAsync — بخش داده‌ای با Streaming
   ============================================================ */
async function PopularHallsAsync() {
    const { halls, error } = await getHalls();

    if (error && halls.length === 0) return <ErrorState message={error} />;
    if (halls.length === 0) return <EmptyState />;

    return <PopularHalls halls={halls} />;
}

/* ============================================================
   HomePage — Server Component
   ============================================================ */
export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#FDFCF9]">
            {/* ==================== Hero Slider ==================== */}
            <HeroSlider />

            {/* ==================== Advanced Search ==================== */}
            <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
                <AdvancedSearch />
            </div>

            {/* ==================== Popular Cities ==================== */}
            <PopularCities />

            {/* ==================== Popular Halls — Streaming ==================== */}
            <Suspense fallback={<HallsSkeleton />}>
                <PopularHallsAsync />
            </Suspense>
        </div>
    );
}