'use client'

import { useEffect, useState, useCallback, useMemo, memo, useRef } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
    PiCrownSimpleFill,
    PiMapPinFill,
    PiUsersThreeFill,
    PiCalendarBlank,
    PiWarningCircle,
    PiFunnelSimple,
    PiSortAscending,
    PiCheckCircle,
    PiCaretLeft,
    PiCaretRight,
} from 'react-icons/pi'

/* ============================================================
   Constants — بیرون از کامپوننت
   ============================================================ */
const HALL_TYPES = ["همه", "سربسته", "روباز", "باغ", "تراس", "سالن سرپوشیده"]
const HOST_TYPES = ["همه", "فول", "نوشیدنی", "شام", "ناهار", "صبحانه", "بدون پذیرایی"]
const EVENT_TYPES = ["همه", "تولد", "عروسی", "عزاداری", "تجلیل", "همایش", "جشن"]
const SORT_OPTIONS = [
    { value: "newest", label: "جدیدترین" },
    { value: "price_asc", label: "ارزان‌ترین" },
    { value: "price_desc", label: "گران‌ترین" },
    { value: "capacity_asc", label: "کمترین ظرفیت" },
    { value: "capacity_desc", label: "بیشترین ظرفیت" },
]

const INITIAL_FILTERS = {
    minCapacity: 0,
    maxCapacity: 0,
    minPrice: 0,
    maxPrice: 0,
    hallType: "",
    hostType: "",
    eventType: "",
    hasParking: false,
    hasSans: false,
    sortBy: "newest",
}

/* ============================================================
   LoadingState — CSS-only spinner (بدون react-spinners)
   ============================================================ */
const LoadingState = memo(function LoadingState() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center py-20">
                <div
                    className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#D4B06A] animate-spin"
                    role="status"
                    aria-label="loading"
                />
                <p className="mt-4 text-gray-500 text-sm">در حال بارگذاری تالارها...</p>
            </div>
        </div>
    )
})

/* ============================================================
   ErrorState
   ============================================================ */
const ErrorState = memo(function ErrorState({ message, onRetry }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                    <PiWarningCircle className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-[#2C2418] mb-2">خطا در بارگذاری</h3>
                <p className="text-gray-500 mb-6">{message}</p>
                <button
                    onClick={onRetry}
                    className="inline-flex items-center gap-2 bg-[#D4B06A] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#B8922E] transition-all duration-300 shadow-md hover:shadow-lg"
                >
                    تلاش مجدد
                </button>
            </div>
        </div>
    )
})

/* ============================================================
   Pagination — memoized
   ============================================================ */
const Pagination = memo(function Pagination({ currentPage, totalPages, onPageChange }) {
    const pageNumbers = useMemo(() => {
        const pages = []
        const maxVisible = 5

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else if (currentPage <= 3) {
            for (let i = 1; i <= 4; i++) pages.push(i)
            pages.push('...', totalPages)
        } else if (currentPage >= totalPages - 2) {
            pages.push(1, '...')
            for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
        } else {
            pages.push(1, '...')
            for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
            pages.push('...', totalPages)
        }
        return pages
    }, [currentPage, totalPages])

    if (totalPages <= 1) return null

    return (
        <div className="flex justify-center items-center gap-2 mt-10 pt-6 border-t border-gray-200">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="صفحه قبل"
                className={`p-2 rounded-lg transition-all duration-300 ${
                    currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-[#D4B06A] hover:text-white hover:border-[#D4B06A]'
                }`}
            >
                <PiCaretRight className="w-5 h-5" />
            </button>

            {pageNumbers.map((page, index) => (
                <button
                    key={`${page}-${index}`}
                    onClick={() => typeof page === 'number' && onPageChange(page)}
                    disabled={page === '...'}
                    className={`min-w-[40px] h-10 px-3 rounded-lg font-medium transition-all duration-300 ${
                        currentPage === page
                            ? 'bg-[#D4B06A] text-white shadow-md'
                            : page === '...'
                                ? 'bg-transparent text-gray-400 cursor-default'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-[#D4B06A]'
                    }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="صفحه بعد"
                className={`p-2 rounded-lg transition-all duration-300 ${
                    currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-[#D4B06A] hover:text-white hover:border-[#D4B06A]'
                }`}
            >
                <PiCaretLeft className="w-5 h-5" />
            </button>
        </div>
    )
})

/* ============================================================
   normalizeImageUrl — یک بار محاسبه
   ============================================================ */
function normalizeImageUrl(url) {
    if (!url || typeof url !== "string") return null
    let u = url
    if (u.startsWith('./')) u = u.replace('./', '/')
    if (!u.startsWith('/') && !u.startsWith('http')) u = '/' + u
    return u
}

/* ============================================================
   HallCard — memoized + next/image + بدون framer-motion
   ============================================================ */
const HallCard = memo(function HallCard({ hall, index }) {
    const [imgError, setImgError] = useState(false)

    const imageUrl = useMemo(
        () => (imgError ? null : normalizeImageUrl(hall.images?.[0])),
        [hall.images, imgError]
    )

    const hasParking = hall.parking_count && hall.parking_count !== "0"

    return (
        <div
            className="group/card bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-sm transition-all duration-500 flex flex-col hover:-translate-y-1 [will-change:transform]"
            style={{ animationDelay: `${index * 40}ms` }}
        >
            <div className="relative h-48 overflow-hidden rounded-t-2xl bg-gray-100">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={hall.title || "تالار"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        quality={75}
                        loading={index < 3 ? "eager" : "lazy"}
                        priority={index === 0}
                        onError={() => setImgError(true)}
                        className="object-cover group-hover/card:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <PiCrownSimpleFill className="w-12 h-12 text-gray-400" />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute bottom-3 left-3 right-3 text-white z-10">
                    <h3 className="text-base font-bold line-clamp-1 drop-shadow-md text-white">
                        {hall.title}
                    </h3>
                    <div className="flex items-center text-xs gap-1 opacity-90">
                        <PiMapPinFill className="w-3 h-3" />
                        <span>{hall.city}</span>
                        {hall.province && (
                            <span className="text-white/70">| {hall.province}</span>
                        )}
                    </div>
                </div>

                {hall.sans_discount > 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg z-10">
                        {hall.sans_discount}% تخفیف
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                    {hall.description || 'تالاری لوکس با امکانات کامل برای برگزاری مراسم شما'}
                </p>

                <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                        <PiUsersThreeFill className="w-3.5 h-3.5 text-[#D4B06A]" />
                        {hall.capacity?.toLocaleString()} نفر
                    </span>
                    {hall.duration && (
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                            <PiCalendarBlank className="w-3.5 h-3.5 text-[#D4B06A]" />
                            {hall.duration} ساعت
                        </span>
                    )}
                    {hall.hall_type && (
                        <span className="bg-gray-50 px-2 py-1 rounded-lg">{hall.hall_type}</span>
                    )}
                </div>

                {(hall.has_sans || hasParking) && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {hall.has_sans && (
                            <span className="text-xs text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                                <PiCheckCircle className="w-3 h-3" />
                                قابلیت سانس
                            </span>
                        )}
                        {hasParking && (
                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                                🚗 پارکینگ
                            </span>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                    <div>
                        {hall.sans_price > 0 && (
                            <>
                                <span className="text-sm font-black text-[#D4B06A]">
                                    {hall.sans_price?.toLocaleString()}
                                </span>
                                <span className="text-[10px] text-gray-400 mr-1">تومان</span>
                            </>
                        )}
                    </div>

                    <Link
                        href={`/halls/${hall._id}`}
                        prefetch={false}
                        className="group/btn text-xs border-2 border-[#D4B06A] px-4 py-1.5 rounded-lg font-medium text-[#D4B06A] hover:bg-[#D4B06A] hover:text-white transition-all duration-300 hover:shadow-md"
                    >
                        مشاهده و رزرو
                    </Link>
                </div>
            </div>
        </div>
    )
})

/* ============================================================
   FilterSidebar — memoized
   ============================================================ */
const FilterSidebar = memo(function FilterSidebar({ filters, onFilterChange, onReset }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-5 sticky top-24">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <PiFunnelSimple className="w-5 h-5 text-[#D4B06A]" />
                    <h3 className="font-bold text-[#2C2418]">فیلترها</h3>
                </div>
                <button
                    onClick={onReset}
                    className="text-xs text-[#D4B06A] hover:text-[#B8922E] transition-colors"
                >
                    حذف همه
                </button>
            </div>

            <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                    محدوده ظرفیت (نفر)
                </label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="حداقل"
                        value={filters.minCapacity || ""}
                        onChange={(e) => onFilterChange("minCapacity", Number(e.target.value))}
                        className="w-1/2 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#D4B06A] focus:ring-1 focus:ring-[#D4B06A] outline-none transition-all"
                    />
                    <input
                        type="number"
                        placeholder="حداکثر"
                        value={filters.maxCapacity || ""}
                        onChange={(e) => onFilterChange("maxCapacity", Number(e.target.value))}
                        className="w-1/2 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#D4B06A] focus:ring-1 focus:ring-[#D4B06A] outline-none transition-all"
                    />
                </div>
            </div>

            <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                    محدوده قیمت سانس (تومان)
                </label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="حداقل"
                        value={filters.minPrice || ""}
                        onChange={(e) => onFilterChange("minPrice", Number(e.target.value))}
                        className="w-1/2 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#D4B06A] focus:ring-1 focus:ring-[#D4B06A] outline-none transition-all"
                    />
                    <input
                        type="number"
                        placeholder="حداکثر"
                        value={filters.maxPrice || ""}
                        onChange={(e) => onFilterChange("maxPrice", Number(e.target.value))}
                        className="w-1/2 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#D4B06A] focus:ring-1 focus:ring-[#D4B06A] outline-none transition-all"
                    />
                </div>
            </div>

            {[
                { key: "hallType", label: "نوع تالار", options: HALL_TYPES },
                { key: "hostType", label: "نوع پذیرایی", options: HOST_TYPES },
                { key: "eventType", label: "نوع مراسم", options: EVENT_TYPES },
            ].map(({ key, label, options }) => (
                <div key={key} className="mb-5">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                        {label}
                    </label>
                    <select
                        value={filters[key]}
                        onChange={(e) => onFilterChange(key, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#D4B06A] focus:ring-1 focus:ring-[#D4B06A] outline-none transition-all bg-white"
                    >
                        {options.map((type) => (
                            <option key={type} value={type === "همه" ? "" : type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
            ))}

            <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700">دارای پارکینگ</span>
                    <input
                        type="checkbox"
                        checked={filters.hasParking}
                        onChange={(e) => onFilterChange("hasParking", e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-[#D4B06A] focus:ring-[#D4B06A]"
                    />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700">دارای سانس متعدد</span>
                    <input
                        type="checkbox"
                        checked={filters.hasSans}
                        onChange={(e) => onFilterChange("hasSans", e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-[#D4B06A] focus:ring-[#D4B06A]"
                    />
                </label>
            </div>
        </div>
    )
})

/* ============================================================
   Main Page
   ============================================================ */
export default function CityHallsPage() {
    const { city } = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()

    const [halls, setHalls] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(9)

    const [filters, setFilters] = useState(() => ({
        ...INITIAL_FILTERS,
        minCapacity: Number(searchParams.get("minCapacity")) || 0,
        maxCapacity: Number(searchParams.get("maxCapacity")) || 0,
        minPrice: Number(searchParams.get("minPrice")) || 0,
        maxPrice: Number(searchParams.get("maxPrice")) || 0,
        hallType: searchParams.get("hallType") || "",
        hostType: searchParams.get("hostType") || "",
        eventType: searchParams.get("eventType") || "",
        hasParking: searchParams.get("hasParking") === "true",
        hasSans: searchParams.get("hasSans") === "true",
        sortBy: searchParams.get("sortBy") || "newest",
    }))

    const decodedCity = useMemo(
        () => (city ? decodeURIComponent(city) : ""),
        [city]
    )

    /* ============================
       Fetch — فقط با fetch، بدون axios
       ============================ */
    const fetchHalls = useCallback(async (signal) => {
        if (!city) return

        setLoading(true)
        setError(null)

        try {
            const res = await fetch(
                `/api/halls/search/by-city?city=${encodeURIComponent(city)}`,
                {
                    signal,
                    headers: { Accept: "application/json" },
                }
            )

            if (!res.ok) {
                setError(`خطای سرور: ${res.status}`)
                setHalls([])
                return
            }

            const data = await res.json()

            if (data.success && Array.isArray(data.data)) {
                setHalls(data.data)
            } else {
                setHalls([])
                if (data.message) setError(data.message)
            }
        } catch (err) {
            if (err.name === "AbortError") return
            setError("ارتباط با سرور برقرار نیست. لطفاً اتصال اینترنت خود را بررسی کنید.")
            setHalls([])
        } finally {
            if (!signal?.aborted) setLoading(false)
        }
    }, [city])

    useEffect(() => {
        const controller = new AbortController()
        fetchHalls(controller.signal)
        return () => controller.abort()
    }, [fetchHalls])

    /* ============================
       فیلتر + مرتب‌سازی — useMemo (به جای useEffect + state جداگانه)
       ============================ */
    const filteredHalls = useMemo(() => {
        if (!halls.length) return []

        const result = []
        const {
            minCapacity, maxCapacity, minPrice, maxPrice,
            hallType, hostType, eventType,
            hasParking, hasSans, sortBy,
        } = filters

        for (let i = 0; i < halls.length; i++) {
            const h = halls[i]
            if (decodedCity && h.city !== decodedCity) continue
            if (minCapacity > 0 && h.capacity < minCapacity) continue
            if (maxCapacity > 0 && h.capacity > maxCapacity) continue
            if (minPrice > 0 && (h.sans_price || 0) < minPrice) continue
            if (maxPrice > 0 && (h.sans_price || 0) > maxPrice) continue
            if (hallType && h.hall_type !== hallType) continue
            if (hostType && h.host_type !== hostType) continue
            if (eventType && h.event_type !== eventType) continue
            if (hasParking && (!h.parking_count || h.parking_count === "0")) continue
            if (hasSans && h.has_sans !== true) continue
            result.push(h)
        }

        switch (sortBy) {
            case "price_asc":
                result.sort((a, b) => (a.sans_price || 0) - (b.sans_price || 0))
                break
            case "price_desc":
                result.sort((a, b) => (b.sans_price || 0) - (a.sans_price || 0))
                break
            case "capacity_asc":
                result.sort((a, b) => a.capacity - b.capacity)
                break
            case "capacity_desc":
                result.sort((a, b) => b.capacity - a.capacity)
                break
            case "newest":
            default:
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        }

        return result
    }, [halls, filters, decodedCity])

    /* ============================
       صفحه‌بندی — useMemo
       ============================ */
    const totalPages = Math.ceil(filteredHalls.length / itemsPerPage)

    const paginatedHalls = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filteredHalls.slice(start, start + itemsPerPage)
    }, [filteredHalls, currentPage, itemsPerPage])

    /* ============================
       به‌روزرسانی URL — فقط وقتی واقعاً تغییر کرده
       ============================ */
    const lastUrlRef = useRef("")
    useEffect(() => {
        const params = new URLSearchParams()
        if (filters.minCapacity) params.set("minCapacity", String(filters.minCapacity))
        if (filters.maxCapacity) params.set("maxCapacity", String(filters.maxCapacity))
        if (filters.minPrice) params.set("minPrice", String(filters.minPrice))
        if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice))
        if (filters.hallType) params.set("hallType", filters.hallType)
        if (filters.hostType) params.set("hostType", filters.hostType)
        if (filters.eventType) params.set("eventType", filters.eventType)
        if (filters.hasParking) params.set("hasParking", "true")
        if (filters.hasSans) params.set("hasSans", "true")
        if (filters.sortBy !== "newest") params.set("sortBy", filters.sortBy)
        if (currentPage !== 1) params.set("page", String(currentPage))

        const qs = params.toString()
        const newUrl = `${window.location.pathname}${qs ? `?${qs}` : ""}`

        if (newUrl !== lastUrlRef.current) {
            lastUrlRef.current = newUrl
            router.replace(newUrl, { scroll: false })
        }
    }, [filters, currentPage, router])

    /* ============================
       Handlers
       ============================ */
    const handleFilterChange = useCallback((key, value) => {
        setFilters((prev) => {
            if (prev[key] === value) return prev
            return { ...prev, [key]: value }
        })
        // ریست صفحه فقط وقتی فیلتر واقعاً عوض شده
        if (key !== "sortBy") setCurrentPage(1)
    }, [])

    const resetFilters = useCallback(() => {
        setFilters(INITIAL_FILTERS)
        setCurrentPage(1)
    }, [])

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page)
        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }, [])

    const handleItemsPerPageChange = useCallback((e) => {
        setItemsPerPage(Number(e.target.value))
        setCurrentPage(1)
    }, [])

    /* ============================
       Render
       ============================ */
    if (loading) return <LoadingState />
    if (error) return <ErrorState message={error} onRetry={() => fetchHalls()} />

    return (
        <div className="min-h-screen py-8 md:py-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* عنوان */}
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-2xl md:text-3xl font-black text-[#2C2418] mb-2">
                        تالارهای {decodedCity}
                    </h1>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] rounded-full mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                        نمایش {paginatedHalls.length} از {filteredHalls.length} تالار
                    </p>
                </div>

                {/* فیلتر موبایل */}
                <div className="md:hidden mb-4">
                    <button
                        onClick={() => setShowMobileFilters((v) => !v)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm"
                    >
                        <div className="flex items-center gap-2">
                            <PiFunnelSimple className="w-5 h-5 text-[#D4B06A]" />
                            <span className="font-medium text-gray-700">فیلتر و مرتب‌سازی</span>
                        </div>
                        <span className="text-gray-400">{showMobileFilters ? '▲' : '▼'}</span>
                    </button>

                    {showMobileFilters && (
                        <div className="mt-3">
                            <FilterSidebar
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onReset={resetFilters}
                            />
                        </div>
                    )}
                </div>

                {/* مرتب‌سازی موبایل */}
                <div className="md:hidden mb-4">
                    <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-[#D4B06A] outline-none"
                    >
                        {SORT_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* سایدبار دسکتاپ */}
                    <aside className="hidden md:block md:w-72 lg:w-80">
                        <FilterSidebar
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onReset={resetFilters}
                        />
                    </aside>

                    {/* لیست */}
                    <main className="flex-1">
                        <div className="hidden md:flex justify-between items-center mb-5 pb-3 border-b border-gray-200">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <PiSortAscending className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-500">
                                        نمایش <span className="font-bold text-[#D4B06A]">{filteredHalls.length}</span> نتیجه
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">نمایش در هر صفحه:</span>
                                    <select
                                        value={itemsPerPage}
                                        onChange={handleItemsPerPageChange}
                                        className="px-2 py-1 text-sm bg-white border border-gray-200 rounded-lg focus:border-[#D4B06A] outline-none"
                                    >
                                        <option value={6}>6</option>
                                        <option value={9}>9</option>
                                        <option value={12}>12</option>
                                        <option value={15}>15</option>
                                    </select>
                                </div>
                            </div>

                            <select
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                                className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:border-[#D4B06A] outline-none"
                            >
                                {SORT_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:hidden text-center mb-3">
                            <span className="text-xs text-gray-400">
                                صفحه {currentPage} از {totalPages || 1}
                            </span>
                        </div>

                        {paginatedHalls.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
                                    <PiWarningCircle className="w-10 h-10 text-[#D4B06A]" />
                                </div>
                                <h3 className="text-xl font-bold text-[#2C2418] mb-2">
                                    هیچ تالاری یافت نشد
                                </h3>
                                <p className="text-gray-500">
                                    در {decodedCity} تالاری با این مشخصات وجود ندارد
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {paginatedHalls.map((hall, index) => (
                                        <HallCard key={hall._id} hall={hall} index={index} />
                                    ))}
                                </div>

                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />

                                {totalPages > 1 && (
                                    <div className="text-center mt-4">
                                        <p className="text-xs text-gray-400">
                                            نمایش {((currentPage - 1) * itemsPerPage) + 1} تا{" "}
                                            {Math.min(currentPage * itemsPerPage, filteredHalls.length)} از{" "}
                                            {filteredHalls.length} تالار
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}