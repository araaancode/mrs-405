'use client'

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { motion } from 'framer-motion'
import { ClipLoader } from 'react-spinners'
import {
    PiCrownSimpleFill,
    PiMapPinFill,
    PiUsersThreeFill,
    PiCalendarBlank,
    PiTagFill,
    PiArrowLeft,
    PiArrowRight,
    PiStarFill,
    PiWarningCircle,
    PiFunnelSimple,
    PiSortAscending,
    PiCheckCircle,
    PiCaretLeft,
    PiCaretRight,
    PiDotsThree
} from 'react-icons/pi'

// ==================== کامپوننت لودینگ ====================
const LoadingState = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center py-20">
            <ClipLoader color="#D4B06A" size={50} loading={true} speedMultiplier={0.8} />
            <p className="mt-4 text-gray-500 text-sm">در حال بارگذاری تالارها...</p>
        </div>
    </div>
)

// ==================== کامپوننت خطا ====================
const ErrorState = ({ message, onRetry }) => (
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

// ==================== کامپوننت صفحه‌بندی ====================
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pages = []
        const maxVisible = 5

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i)
                pages.push('...')
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1)
                pages.push('...')
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
            } else {
                pages.push(1)
                pages.push('...')
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
                pages.push('...')
                pages.push(totalPages)
            }
        }

        return pages
    }

    if (totalPages <= 1) return null

    return (
        <div className="flex justify-center items-center gap-2 mt-10 pt-6 border-t border-gray-200">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-all duration-300 ${currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-[#D4B06A] hover:text-white hover:border-[#D4B06A]'
                    }`}
            >
                <PiCaretRight className="w-5 h-5" />
            </button>

            {getPageNumbers().map((page, index) => (
                <button
                    key={index}
                    onClick={() => typeof page === 'number' && onPageChange(page)}
                    className={`min-w-[40px] h-10 px-3 rounded-lg font-medium transition-all duration-300 ${currentPage === page
                        ? 'bg-[#D4B06A] text-white shadow-md'
                        : page === '...'
                            ? 'bg-transparent text-gray-400 cursor-default'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-[#D4B06A]'
                        }`}
                    disabled={page === '...'}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-all duration-300 ${currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-[#D4B06A] hover:text-white hover:border-[#D4B06A]'
                    }`}
            >
                <PiCaretLeft className="w-5 h-5" />
            </button>
        </div>
    )
}

// ==================== کامپوننت کارت تالار ====================
const HallCard = ({ hall, index }) => {
    const [imgError, setImgError] = useState(false)

    const getImageUrl = useCallback(() => {
        if (!hall.images?.length || imgError) return null

        let imageUrl = hall.images[0]

        if (imageUrl.startsWith('./')) {
            imageUrl = imageUrl.replace('./', '/')
        }

        if (!imageUrl.startsWith('/') && !imageUrl.startsWith('http')) {
            imageUrl = '/' + imageUrl
        }

        return imageUrl
    }, [hall.images, imgError])

    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.05 }}
            viewport={{ once: true }}
            className="group/card bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-sm transition-all duration-500 flex flex-col hover:-translate-y-1"
        >
            <div className="relative h-48 overflow-hidden rounded-t-2xl bg-gray-100">
                {getImageUrl() ? (
                    <img
                        src={getImageUrl()}
                        alt={hall.title}
                        className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
                        onError={() => setImgError(true)}
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

                {(hall.has_sans || hall.parking_count) && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {hall.has_sans && (
                            <span className="text-xs text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                                <PiCheckCircle className="w-3 h-3" />
                                قابلیت سانس
                            </span>
                        )}
                        {hall.parking_count && hall.parking_count !== "0" && (
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
                        className="group/btn text-xs border-2 border-[#D4B06A] px-4 py-1.5 rounded-lg font-medium text-[#D4B06A] hover:bg-[#D4B06A] hover:text-white transition-all duration-300 hover:shadow-md"
                    >
                        مشاهده و رزرو
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}

// ==================== کامپوننت فیلتر سایدبار ====================
const FilterSidebar = ({ filters, onFilterChange, onReset }) => {
    const hallTypes = ["همه", "سربسته", "روباز", "باغ", "تراس", "سالن سرپوشیده"]
    const hostTypes = ["همه", "فول", "نوشیدنی", "شام", "ناهار", "صبحانه", "بدون پذیرایی"]
    const eventTypes = ["همه", "تولد", "عروسی", "عزاداری", "تجلیل", "همایش", "جشن"]

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

            <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                    نوع تالار
                </label>
                <select
                    value={filters.hallType}
                    onChange={(e) => onFilterChange("hallType", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#D4B06A] focus:ring-1 focus:ring-[#D4B06A] outline-none transition-all bg-white"
                >
                    {hallTypes.map((type) => (
                        <option key={type} value={type === "همه" ? "" : type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                    نوع پذیرایی
                </label>
                <select
                    value={filters.hostType}
                    onChange={(e) => onFilterChange("hostType", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#D4B06A] focus:ring-1 focus:ring-[#D4B06A] outline-none transition-all bg-white"
                >
                    {hostTypes.map((type) => (
                        <option key={type} value={type === "همه" ? "" : type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                    نوع مراسم
                </label>
                <select
                    value={filters.eventType}
                    onChange={(e) => onFilterChange("eventType", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#D4B06A] focus:ring-1 focus:ring-[#D4B06A] outline-none transition-all bg-white"
                >
                    {eventTypes.map((type) => (
                        <option key={type} value={type === "همه" ? "" : type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">دارای پارکینگ</span>
                    </div>
                    <input
                        type="checkbox"
                        checked={filters.hasParking}
                        onChange={(e) => onFilterChange("hasParking", e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-[#D4B06A] focus:ring-[#D4B06A]"
                    />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">دارای سانس متعدد</span>
                    </div>
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
}

// ==================== کامپوننت اصلی ====================
export default function CityHallsPage() {
    const { city } = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()

    const [halls, setHalls] = useState([])
    const [filteredHalls, setFilteredHalls] = useState([])
    const [paginatedHalls, setPaginatedHalls] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showMobileFilters, setShowMobileFilters] = useState(false)

    // صفحه‌بندی
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(9)

    const [filters, setFilters] = useState({
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
    })

    // اعمال فیلترها
    const applyFilters = useCallback((hallsList) => {
        let result = [...hallsList]

        if (city) {
            result = result.filter((h) => h.city === decodeURIComponent(city))
        }

        if (filters.minCapacity > 0) {
            result = result.filter((h) => h.capacity >= filters.minCapacity)
        }
        if (filters.maxCapacity > 0) {
            result = result.filter((h) => h.capacity <= filters.maxCapacity)
        }

        if (filters.minPrice > 0) {
            result = result.filter((h) => (h.sans_price || 0) >= filters.minPrice)
        }
        if (filters.maxPrice > 0) {
            result = result.filter((h) => (h.sans_price || 0) <= filters.maxPrice)
        }

        if (filters.hallType) {
            result = result.filter((h) => h.hall_type === filters.hallType)
        }

        if (filters.hostType) {
            result = result.filter((h) => h.host_type === filters.hostType)
        }

        if (filters.eventType) {
            result = result.filter((h) => h.event_type === filters.eventType)
        }

        if (filters.hasParking) {
            result = result.filter((h) => h.parking_count && h.parking_count !== "0")
        }

        if (filters.hasSans) {
            result = result.filter((h) => h.has_sans === true)
        }

        switch (filters.sortBy) {
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
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                break
        }

        return result
    }, [filters, city])

    // اعمال صفحه‌بندی
    const applyPagination = useCallback((items) => {
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        return items.slice(startIndex, endIndex)
    }, [currentPage, itemsPerPage])

    // دریافت داده
    const fetchHalls = useCallback(async () => {
        if (!city) return

        setLoading(true)
        setError(null)

        try {
            const response = await axios.get(`/api/halls/search/by-city`, {
                params: { city: encodeURIComponent(city) },
                timeout: 10000,
                headers: { 'Content-Type': 'application/json' }
            })

            const data = response.data

            if (data.success && Array.isArray(data.data)) {
                setHalls(data.data)
            } else {
                setHalls([])
                if (data.message) setError(data.message)
            }
        } catch (err) {
            console.error("Error fetching halls:", err)

            if (err.response) {
                setError(err.response.data?.message || `خطای سرور: ${err.response.status}`)
            } else if (err.request) {
                setError("ارتباط با سرور برقرار نیست. لطفاً اتصال اینترنت خود را بررسی کنید.")
            } else {
                setError("مشکل در دریافت اطلاعات. لطفاً دوباره تلاش کنید.")
            }

            setHalls([])
        } finally {
            setLoading(false)
        }
    }, [city])

    useEffect(() => {
        fetchHalls()
    }, [fetchHalls])

    // اعمال فیلترها و صفحه‌بندی
    useEffect(() => {
        const filtered = applyFilters(halls)
        setFilteredHalls(filtered)

        // ریست به صفحه اول وقتی فیلترها تغییر می‌کنند
        setCurrentPage(1)

        // به‌روزرسانی URL
        const params = new URLSearchParams()
        if (filters.minCapacity) params.set("minCapacity", filters.minCapacity.toString())
        if (filters.maxCapacity) params.set("maxCapacity", filters.maxCapacity.toString())
        if (filters.minPrice) params.set("minPrice", filters.minPrice.toString())
        if (filters.maxPrice) params.set("maxPrice", filters.maxPrice.toString())
        if (filters.hallType) params.set("hallType", filters.hallType)
        if (filters.hostType) params.set("hostType", filters.hostType)
        if (filters.eventType) params.set("eventType", filters.eventType)
        if (filters.hasParking) params.set("hasParking", "true")
        if (filters.hasSans) params.set("hasSans", "true")
        if (filters.sortBy !== "newest") params.set("sortBy", filters.sortBy)
        if (currentPage !== 1) params.set("page", currentPage.toString())

        const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`
        router.replace(newUrl, { scroll: false })
    }, [halls, filters, currentPage, router])

    // اعمال صفحه‌بندی روی داده‌های فیلتر شده
    useEffect(() => {
        const paginated = applyPagination(filteredHalls)
        setPaginatedHalls(paginated)
    }, [filteredHalls, applyPagination])

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
    }

    const resetFilters = () => {
        setFilters({
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
        })
        setCurrentPage(1)
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
        // اسکرول به بالای صفحه
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value))
        setCurrentPage(1)
    }

    const totalPages = Math.ceil(filteredHalls.length / itemsPerPage)

    if (loading) return <LoadingState />
    if (error) return <ErrorState message={error} onRetry={fetchHalls} />

    const cityName = decodeURIComponent(city)

    return (
        <div className="min-h-screen py-8 md:py-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* عنوان صفحه */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8 md:mb-12"
                >
                    <h1 className="text-2xl md:text-3xl font-black text-[#2C2418] mb-2">
                        تالارهای {cityName}
                    </h1>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] rounded-full mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                        نمایش {paginatedHalls.length} از {filteredHalls.length} تالار
                    </p>
                </motion.div>

                {/* دکمه فیلتر موبایل */}
                <div className="md:hidden mb-4">
                    <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
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
                        <option value="newest">جدیدترین</option>
                        <option value="price_asc">ارزان‌ترین</option>
                        <option value="price_desc">گران‌ترین</option>
                        <option value="capacity_asc">کمترین ظرفیت</option>
                        <option value="capacity_desc">بیشترین ظرفیت</option>
                    </select>
                </div>

                {/* دسکتاپ: دو ستونه */}
                <div className="flex flex-col md:flex-row gap-6">
                    {/* سایدبار فیلتر */}
                    <aside className="hidden md:block md:w-72 lg:w-80">
                        <FilterSidebar
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onReset={resetFilters}
                        />
                    </aside>

                    {/* لیست تالارها */}
                    <main className="flex-1">
                        {/* هدر مرتب‌سازی و تعداد نمایش */}
                        <div className="hidden md:flex justify-between items-center mb-5 pb-3 border-b border-gray-200">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <PiSortAscending className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-500">
                                        نمایش <span className="font-bold text-[#D4B06A]">{filteredHalls.length}</span> نتیجه
                                    </span>
                                </div>

                                {/* انتخاب تعداد آیتم در صفحه */}
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
                                <option value="newest">جدیدترین</option>
                                <option value="price_asc">ارزان‌ترین</option>
                                <option value="price_desc">گران‌ترین</option>
                                <option value="capacity_asc">کمترین ظرفیت</option>
                                <option value="capacity_desc">بیشترین ظرفیت</option>
                            </select>
                        </div>

                        {/* اطلاعات صفحه در موبایل */}
                        <div className="md:hidden text-center mb-3">
                            <span className="text-xs text-gray-400">
                                صفحه {currentPage} از {totalPages || 1}
                            </span>
                        </div>

                        {/* گرید تالارها */}
                        {paginatedHalls.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
                                    <PiWarningCircle className="w-10 h-10 text-[#D4B06A]" />
                                </div>
                                <h3 className="text-xl font-bold text-[#2C2418] mb-2">
                                    هیچ تالاری یافت نشد
                                </h3>
                                <p className="text-gray-500">
                                    در {cityName} تالاری با این مشخصات وجود ندارد
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {paginatedHalls.map((hall, index) => (
                                        <HallCard key={hall._id} hall={hall} index={index} />
                                    ))}
                                </div>

                                {/* صفحه‌بندی */}
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />

                                {/* اطلاعات اضافی صفحه‌بندی */}
                                {totalPages > 1 && (
                                    <div className="text-center mt-4">
                                        <p className="text-xs text-gray-400">
                                            نمایش {((currentPage - 1) * itemsPerPage) + 1} تا {Math.min(currentPage * itemsPerPage, filteredHalls.length)} از {filteredHalls.length} تالار
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>

            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
            `}</style>
        </div>
    )
}