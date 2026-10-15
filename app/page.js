// app/page.js — Server Component (بدون "use client")
import dynamic from 'next/dynamic'
import { Suspense, cache } from 'react'
import { PiBuildings, PiWarningCircle } from 'react-icons/pi'

/* ============================================================
   Lazy Load — کامپوننت‌های تعاملی (Client)
   ============================================================ */

const HeroSlider = dynamic(() => import('@/components/landing/HeroSlider'), {
    loading: () => (
        <div className="w-full h-[60svh] min-h-[400px] sm:h-[70svh] sm:min-h-[480px] md:h-[75svh] md:min-h-[540px] lg:h-[80svh] bg-slate-100 animate-pulse rounded-2xl sm:rounded-3xl md:rounded-[2rem] mx-2 sm:mx-4 md:mx-6 lg:mx-8" />
    ),
})

const LandingAds = dynamic(() => import('@/components/landing/LandingAds'), {
    loading: () => (
        <div className="w-full h-[280px] sm:h-[320px] bg-slate-100 animate-pulse" />
    ),
})

const AdvancedSearch = dynamic(
    () => import('@/components/landing/AdvancedSearch'),
    {
        loading: () => (
            <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-lg min-h-[300px] sm:min-h-[400px] animate-pulse">
                <div className="h-7 sm:h-8 w-40 sm:w-48 bg-slate-100 rounded-lg mx-auto mb-5 sm:mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-11 sm:h-12 bg-slate-100 rounded-xl" />
                    ))}
                </div>
            </div>
        ),
    }
)

const PopularCities = dynamic(
    () => import('@/components/landing/PopularCities'),
    {
        loading: () => (
            <div className="w-full py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="h-7 sm:h-8 w-40 sm:w-48 bg-slate-100 rounded-lg mx-auto mb-6 sm:mb-8 animate-pulse" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="h-40 sm:h-44 md:h-48 bg-slate-100 rounded-xl animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            </div>
        ),
    }
)

const PopularHalls = dynamic(
    () => import('@/components/landing/PopularHalls'),
    {
        loading: () => (
            <div className="w-full py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="h-7 sm:h-8 w-40 sm:w-48 bg-slate-100 rounded-lg mx-auto mb-6 sm:mb-8 animate-pulse" />
                    <div className="flex gap-3 sm:gap-4 overflow-hidden">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="flex-shrink-0 w-[240px] sm:w-[260px] md:w-[272px] h-[340px] sm:h-[360px] md:h-[380px] bg-slate-100 rounded-2xl sm:rounded-3xl animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            </div>
        ),
    }
)

const BestDiscounts = dynamic(
    () => import('@/components/landing/BestDiscounts'),
    {
        loading: () => (
            <div className="w-full py-8 sm:py-12 md:py-16 bg-gradient-to-b from-rose-50/40 via-white to-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="h-6 w-32 sm:w-40 bg-rose-100 rounded-full mx-auto mb-3 sm:mb-4 animate-pulse" />
                    <div className="h-8 sm:h-9 w-48 sm:w-56 bg-slate-100 rounded-lg mx-auto mb-6 sm:mb-8 animate-pulse" />
                    <div className="flex gap-3 sm:gap-4 overflow-hidden">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="flex-shrink-0 w-[240px] sm:w-[260px] md:w-[272px] h-[340px] sm:h-[360px] md:h-[380px] bg-slate-100 rounded-2xl sm:rounded-3xl animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            </div>
        ),
    }
)

/* ============================================================
   Empty & Error
   ============================================================ */
function EmptyState() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16 text-center">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-5 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-gold-50 to-gold-100/60 flex items-center justify-center ring-1 ring-gold-100">
                <PiBuildings className="w-8 h-8 sm:w-10 sm:h-10 text-gold-500" />
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 mb-2">
                هنوز تالاری ثبت نشده است
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                به زودی تالارهای جدید به سیستم اضافه خواهند شد
            </p>
        </div>
    )
}

function ErrorState({ message }) {
    return (
        <div className="max-w-xl mx-auto px-4 py-12 sm:py-16 text-center">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-5 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-rose-50 to-rose-100/60 flex items-center justify-center ring-1 ring-rose-100">
                <PiWarningCircle className="w-8 h-8 sm:w-10 sm:h-10 text-rose-500" />
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 mb-2">
                خطا در بارگذاری
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                {message || 'متأسفانه در دریافت اطلاعات مشکلی پیش آمد.'}
            </p>
        </div>
    )
}

/* ============================================================
   Skeletons
   ============================================================ */
function HallsSkeleton() {
    return (
        <div className="w-full py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                <div className="text-center mb-8 sm:mb-10">
                    <div className="h-7 sm:h-8 w-40 sm:w-48 bg-slate-100 rounded-lg mx-auto mb-3 animate-pulse" />
                    <div className="w-16 sm:w-20 h-1 bg-slate-100 rounded-full mx-auto" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl ring-1 ring-slate-100 overflow-hidden"
                        >
                            <div className="h-40 sm:h-44 bg-slate-100 animate-pulse" />
                            <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3">
                                <div className="h-4 sm:h-5 w-3/4 bg-slate-100 rounded-lg animate-pulse" />
                                <div className="h-3 sm:h-3.5 w-1/2 bg-slate-100 rounded-md animate-pulse" />
                                <div className="h-9 w-full bg-slate-100 rounded-lg animate-pulse mt-3 sm:mt-4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function DiscountHallsSkeleton() {
    return (
        <div className="w-full py-12 sm:py-16 md:py-20 bg-gradient-to-b from-rose-50/40 via-white to-white">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                <div className="text-center mb-8 sm:mb-10">
                    <div className="h-5 sm:h-6 w-32 sm:w-40 bg-rose-100 rounded-full mx-auto mb-3 sm:mb-4 animate-pulse" />
                    <div className="h-8 sm:h-9 w-48 sm:w-56 bg-slate-100 rounded-lg mx-auto mb-3 animate-pulse" />
                    <div className="w-16 sm:w-20 h-1 bg-rose-100 rounded-full mx-auto" />
                    <div className="h-3.5 sm:h-4 w-52 sm:w-64 bg-slate-100 rounded-md mx-auto mt-3 sm:mt-4 animate-pulse" />
                </div>
                <div className="flex gap-3 sm:gap-5 overflow-hidden px-1 sm:px-2 pb-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 w-[260px] sm:w-[280px] md:w-[300px] bg-white rounded-2xl ring-1 ring-slate-100 overflow-hidden"
                        >
                            <div className="h-40 sm:h-44 bg-slate-100 animate-pulse" />
                            <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3">
                                <div className="h-4 sm:h-5 w-3/4 bg-slate-100 rounded-lg animate-pulse" />
                                <div className="h-3 sm:h-3.5 w-1/2 bg-slate-100 rounded-md animate-pulse" />
                                <div className="h-14 sm:h-16 w-full bg-rose-50 rounded-xl animate-pulse mt-3 sm:mt-4" />
                                <div className="h-9 w-full bg-slate-100 rounded-lg animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

/* ============================================================
   Fetch در سرور — با React.cache برای جلوگیری از duplicate fetch
   ============================================================ */
const getHalls = cache(async () => {
    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_BASE_URL ||
            (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
            'http://localhost:3000'

        const res = await fetch(`${baseUrl}/api/halls`, {
            next: { revalidate: 300 },
            headers: { Accept: 'application/json' },
        })

        if (!res.ok) return { halls: [], error: `خطای سرور: ${res.status}` }

        const data = await res.json()

        let halls = []
        if (Array.isArray(data)) halls = data
        else if (Array.isArray(data?.data)) halls = data.data
        else if (Array.isArray(data?.halls)) halls = data.halls
        else if (Array.isArray(data?.results)) halls = data.results
        else if (Array.isArray(data?.items)) halls = data.items

        return { halls, error: null }
    } catch (err) {
        return { halls: [], error: err.message || 'خطا در بارگذاری داده‌ها' }
    }
})

/* ============================================================
   Async Components — Streaming
   ============================================================ */

async function PopularHallsAsync() {
    const { halls, error } = await getHalls()

    if (error && halls.length === 0) return <ErrorState message={error} />
    if (halls.length === 0) return <EmptyState />

    return <PopularHalls halls={halls} />
}

async function BestDiscountsAsync() {
    const { halls, error } = await getHalls()

    if (error && halls.length === 0) return null
    if (halls.length === 0) return null

    return <BestDiscounts halls={halls} limit={10} />
}

/* ============================================================
   HomePage — Server Component
   ============================================================ */
export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#FDFCF9] overflow-x-clip">
            {/* ==================== Hero Slider ==================== */}
            <HeroSlider />

            {/* ==================== Advanced Search ==================== */}
            <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-5 sm:py-6 md:py-8">
                <AdvancedSearch />
            </div>

            {/* ==================== Popular Halls ==================== */}
            <Suspense fallback={<HallsSkeleton />}>
                <PopularHallsAsync />
            </Suspense>

            {/* ==================== Best Discounts ==================== */}
            <Suspense fallback={<DiscountHallsSkeleton />}>
                <BestDiscountsAsync />
            </Suspense>

            {/* ==================== Landing Ads ==================== */}
            <LandingAds />

            {/* ==================== Popular Cities ==================== */}
            <PopularCities />
        </div>
    )
}