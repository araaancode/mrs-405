// app/halls/page.js
'use client'

import { useState, useMemo, useEffect, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    PiBuildings,
    PiWarningCircle,
    PiArrowClockwise,
    PiCaretLeft,
    PiCaretRight,
    PiCaretDoubleLeft,
    PiCaretDoubleRight,
} from 'react-icons/pi'

import { useHalls } from './hooks/useHalls'
import { useHallFilters } from './hooks/useHallFilters'
import { useFilterStore } from './store/filterStore'

import SearchBar from './components/SearchBar'
import FilterSidebar from './components/FilterSidebar'
import ActiveFiltersBar from './components/ActiveFiltersBar'
import SortDropdown from './components/SortDropdown'
import HallCard from './components/HallCard'
import SkeletonCard from './components/SkeletonCard'

/* ============================================================
   Constants
   ============================================================ */
const PER_PAGE = 9
const GOLD_GRADIENT = 'linear-gradient(180deg, #D3B263 0%, #C6A14C 50%, #A8853A 100%)'
const GOLD_GRADIENT_TEXT = 'linear-gradient(90deg, #C6A14C 0%, #85672C 100%)'

const FA_NUM = new Intl.NumberFormat('fa-IR')
const faNum = (n) => FA_NUM.format(Number(n) || 0)

/* ============================================================
   EmptyState
   ============================================================ */
const EmptyState = memo(function EmptyState({ activeCount, onReset }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="
                relative overflow-hidden
                bg-white rounded-3xl
                ring-1 ring-slate-100
                p-8 sm:p-12
                text-center
            "
            style={{ boxShadow: '0 8px 32px rgba(198,161,76,0.06)' }}
            role="status"
        >
            <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                    backgroundImage:
                        'radial-gradient(circle at 50% 0%, rgba(198,161,76,0.08) 0%, transparent 50%)',
                }}
                aria-hidden="true"
            />

            <div className="relative w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-[#FBF7EC] to-[#F6EED5]/60 flex items-center justify-center ring-1 ring-[#EDDCA9]">
                <div className="absolute inset-0 rounded-3xl bg-[#C6A14C]/5 blur-xl" />
                <PiBuildings
                    className="relative w-10 h-10 text-[#C6A14C]"
                    aria-hidden="true"
                />
            </div>

            <h3 className="relative text-lg sm:text-xl font-bold text-slate-900 mb-2">
                تالاری یافت نشد
            </h3>
            <p className="relative text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-7">
                با فیلترهای انتخابی تالایی پیدا نشد. می‌توانید فیلترها را تغییر
                دهید یا همه را پاک کنید.
            </p>

            {activeCount > 0 && (
                <button
                    type="button"
                    onClick={onReset}
                    className="
                        relative inline-flex items-center gap-2
                        px-6 py-3 rounded-xl
                        text-sm font-bold text-white
                        shadow-md shadow-[#C6A14C]/25
                        hover:shadow-lg hover:shadow-[#C6A14C]/40
                        hover:-translate-y-0.5
                        active:scale-95
                        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/30
                        motion-reduce:transition-none
                        transition-all duration-300
                    "
                    style={{ backgroundImage: GOLD_GRADIENT }}
                >
                    <PiArrowClockwise className="w-4 h-4" aria-hidden="true" />
                    پاک کردن فیلترها
                </button>
            )}

            <p className="relative text-[11px] text-slate-400 mt-5">
                یا فیلترها را تغییر دهید تا نتایج بیشتری ببینید
            </p>
        </motion.div>
    )
})

/* ============================================================
   ErrorState
   ============================================================ */
const ErrorState = memo(function ErrorState({ message, onRetry }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="
                relative overflow-hidden
                bg-white rounded-3xl
                ring-1 ring-rose-100
                p-8 sm:p-12
                text-center
            "
            style={{ boxShadow: '0 8px 32px rgba(244,63,94,0.06)' }}
            role="alert"
        >
            <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                    backgroundImage:
                        'radial-gradient(circle at 50% 0%, rgba(244,63,94,0.06) 0%, transparent 50%)',
                }}
                aria-hidden="true"
            />

            <div className="relative w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-rose-50 to-rose-100/60 flex items-center justify-center ring-1 ring-rose-100">
                <div className="absolute inset-0 rounded-3xl bg-rose-500/5 blur-xl" />
                <PiWarningCircle
                    className="relative w-10 h-10 text-rose-500"
                    aria-hidden="true"
                />
            </div>

            <h3 className="relative text-lg sm:text-xl font-bold text-slate-900 mb-2">
                خطا در بارگذاری اطلاعات
            </h3>
            <p className="relative text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-7">
                {message ||
                    'متأسفانه در دریافت اطلاعات مشکلی پیش آمد. لطفاً دوباره تلاش کنید.'}
            </p>

            <button
                type="button"
                onClick={onRetry}
                className="
                    relative inline-flex items-center gap-2
                    px-6 py-3 rounded-xl
                    text-sm font-bold text-white
                    shadow-md shadow-[#C6A14C]/25
                    hover:shadow-lg hover:shadow-[#C6A14C]/40
                    hover:-translate-y-0.5
                    active:scale-95
                    focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/30
                    motion-reduce:transition-none
                    transition-all duration-300
                "
                style={{ backgroundImage: GOLD_GRADIENT }}
            >
                <PiArrowClockwise className="w-4 h-4" aria-hidden="true" />
                تلاش مجدد
            </button>

            <p className="relative text-[11px] text-slate-400 mt-5">
                اگر مشکل ادامه داشت، با پشتیبانی تماس بگیرید
            </p>
        </motion.div>
    )
})

/* ============================================================
   Pagination — کامپوننت‌های داخلی memo شده
   ============================================================ */
const NavButton = memo(function NavButton({
    onClick,
    disabled,
    icon: Icon,
    label,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            className="
                w-10 h-10 rounded-xl
                flex items-center justify-center
                bg-white border border-slate-200
                text-slate-600
                hover:border-[#D3B263] hover:text-[#85672C] hover:bg-[#FBF7EC]/60
                disabled:opacity-40 disabled:cursor-not-allowed
                disabled:hover:bg-white disabled:hover:border-slate-200 disabled:hover:text-slate-600
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/20
                active:scale-95
                motion-reduce:transition-none
                transition-all duration-200
            "
        >
            <Icon className="w-4 h-4" aria-hidden="true" />
        </button>
    )
})

const PageButton = memo(function PageButton({ page, active, onChange }) {
    const handleClick = useCallback(() => onChange(page), [onChange, page])

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={`رفتن به صفحه ${page}`}
            aria-current={active ? 'page' : undefined}
            className={`
                min-w-[40px] h-10 px-3 rounded-xl
                flex items-center justify-center
                text-[13px] font-bold
                active:scale-95
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/20
                motion-reduce:transition-none
                transition-all duration-200
                ${
                    active
                        ? 'text-white shadow-md shadow-[#C6A14C]/25 hover:shadow-lg hover:shadow-[#C6A14C]/40'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-[#D3B263] hover:text-[#85672C] hover:bg-[#FBF7EC]/60'
                }
            `}
            style={active ? { backgroundImage: GOLD_GRADIENT } : undefined}
        >
            {faNum(page)}
        </button>
    )
})

const Ellipsis = memo(function Ellipsis() {
    return (
        <span
            className="w-10 h-10 flex items-center justify-center text-slate-400 select-none"
            aria-hidden="true"
        >
            …
        </span>
    )
})

/* ============================================================
   Pagination
   ============================================================ */
const Pagination = memo(function Pagination({
    currentPage,
    totalPages,
    onChange,
}) {
    const pageNumbers = useMemo(() => {
        const pages = []
        const maxVisible = 5

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
            return pages
        }

        pages.push(1)

        let start = Math.max(2, currentPage - 1)
        let end = Math.min(totalPages - 1, currentPage + 1)

        if (currentPage <= 3) {
            start = 2
            end = 4
        }
        if (currentPage >= totalPages - 2) {
            start = totalPages - 3
            end = totalPages - 1
        }

        if (start > 2) pages.push('start-ellipsis')
        for (let i = start; i <= end; i++) pages.push(i)
        if (end < totalPages - 1) pages.push('end-ellipsis')

        pages.push(totalPages)
        return pages
    }, [currentPage, totalPages])

    if (totalPages <= 1) return null

    return (
        <motion.nav
            aria-label="صفحه‌بندی نتایج"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8 sm:mt-10 flex flex-col items-center gap-3"
        >
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
                <NavButton
                    onClick={() => onChange(1)}
                    disabled={currentPage === 1}
                    icon={PiCaretDoubleRight}
                    label="صفحه اول"
                />
                <NavButton
                    onClick={() => onChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    icon={PiCaretRight}
                    label="صفحه قبلی"
                />

                <div
                    className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"
                    aria-hidden="true"
                />

                {pageNumbers.map((p) => {
                    if (typeof p === 'string') {
                        return <Ellipsis key={p} />
                    }
                    return (
                        <PageButton
                            key={p}
                            page={p}
                            active={p === currentPage}
                            onChange={onChange}
                        />
                    )
                })}

                <div
                    className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"
                    aria-hidden="true"
                />

                <NavButton
                    onClick={() => onChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    icon={PiCaretLeft}
                    label="صفحه بعدی"
                />
                <NavButton
                    onClick={() => onChange(totalPages)}
                    disabled={currentPage === totalPages}
                    icon={PiCaretDoubleLeft}
                    label="صفحه آخر"
                />
            </div>

            <p className="text-[11px] text-slate-400">
                صفحه <span className="font-bold text-slate-600">{faNum(currentPage)}</span>{' '}
                از <span className="font-bold text-slate-600">{faNum(totalPages)}</span>
            </p>
        </motion.nav>
    )
})

/* ============================================================
   Page
   ============================================================ */
export default function HallsPage() {
    const { halls, loading, error, refresh } = useHalls()

    const filters = useFilterStore((s) => s.filters)
    const sort = useFilterStore((s) => s.sort)
    const viewMode = useFilterStore((s) => s.viewMode)
    const getActiveFilterCount = useFilterStore((s) => s.getActiveFilterCount)
    const resetFilters = useFilterStore((s) => s.resetFilters)

    const [drawerOpen, setDrawerOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    const filtered = useHallFilters(halls, filters, sort)
    const activeCount = getActiveFilterCount()

    /* Pagination logic */
    const totalPages = useMemo(
        () => Math.ceil(filtered.length / PER_PAGE) || 1,
        [filtered.length]
    )

    const paginatedHalls = useMemo(() => {
        const start = (currentPage - 1) * PER_PAGE
        return filtered.slice(start, start + PER_PAGE)
    }, [filtered, currentPage])

    /* ریست صفحه در صورت تغییر فیلترها یا کاهش تعداد صفحات */
    useEffect(() => {
        setCurrentPage(1)
    }, [filters, sort])

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1)
        }
    }, [totalPages, currentPage])

    /* با تغییر صفحه → اسکرول به بالا */
    const handlePageChange = useCallback((page) => {
        setCurrentPage(page)
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FDFCF9] via-[#FAF8F2] to-[#F7F3E8] pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                {/* ==================== هدر ==================== */}
                <motion.header
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-center mb-8 sm:mb-10"
                >
                  

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">
                        تالارهای{' '}
                        <span
                            className="bg-clip-text text-transparent"
                            style={{ backgroundImage: GOLD_GRADIENT_TEXT }}
                        >
                            مراسم
                        </span>
                    </h1>
                    <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                        بهترین تالارهای عروسی، همایش و مراسم را با فیلترهای دقیق
                        پیدا کنید
                    </p>
                </motion.header>

                {/* ==================== جستجو ==================== */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.08 }}
                    className="mb-6"
                >
                    <SearchBar
                        onOpenFilters={() => setDrawerOpen(true)}
                        activeFilterCount={activeCount}
                    />
                </motion.div>

                {/* ==================== بدنه ==================== */}
                <div className="flex gap-5 lg:gap-7">
                    <FilterSidebar
                        open={drawerOpen}
                        onClose={() => setDrawerOpen(false)}
                    />

                    <main
                        id="results"
                        role="main"
                        className="flex-1 min-w-0"
                    >
                        {/* نوار بالای نتایج */}
                        <div className="flex items-center justify-between gap-4 mb-4 sm:mb-5 flex-wrap">
                            <div className="flex items-center gap-2">
                                <span
                                    className="text-sm font-medium text-slate-700"
                                    aria-live="polite"
                                    aria-atomic="true"
                                >
                                    {loading ? (
                                        <span className="inline-flex items-center gap-2 text-slate-500">
                                            <svg
                                                className="w-3.5 h-3.5 animate-spin text-[#C6A14C]"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                aria-hidden="true"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                                />
                                            </svg>
                                            در حال بارگذاری
                                        </span>
                                    ) : (
                                        <>
                                            <span className="text-slate-900 font-bold text-base">
                                                {faNum(filtered.length)}
                                            </span>{' '}
                                            <span className="text-slate-500">
                                                نتیجه
                                            </span>
                                            {totalPages > 1 && (
                                                <span className="text-slate-400 text-xs mr-2">
                                                    — صفحه {faNum(currentPage)} از{' '}
                                                    {faNum(totalPages)}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </span>
                            </div>

                            <SortDropdown />
                        </div>

                        {/* فیلترهای فعال */}
                        <ActiveFiltersBar />

                        {/* خطا */}
                        {error && !loading && (
                            <ErrorState
                                message={error?.response?.data?.message}
                                onRetry={refresh}
                            />
                        )}

                        {/* لودینگ */}
                        {loading && (
                            <div
                                className={
                                    viewMode === 'grid'
                                        ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6'
                                        : 'space-y-4'
                                }
                                aria-busy="true"
                                aria-label="در حال بارگذاری تالارها"
                            >
                                {Array.from({
                                    length: viewMode === 'grid' ? 6 : 3,
                                }).map((_, i) => (
                                    <SkeletonCard
                                        key={`sk-${i}`}
                                        viewMode={viewMode}
                                    />
                                ))}
                            </div>
                        )}

                        {/* خالی */}
                        {!loading && !error && filtered.length === 0 && (
                            <EmptyState
                                activeCount={activeCount}
                                onReset={resetFilters}
                            />
                        )}

                        {/* نتایج */}
                        {!loading && !error && filtered.length > 0 && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className={
                                        viewMode === 'grid'
                                            ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6'
                                            : 'space-y-4'
                                    }
                                >
                                    <AnimatePresence mode="popLayout">
                                        {paginatedHalls.map((hall, i) => (
                                            <HallCard
                                                key={hall._id}
                                                hall={hall}
                                                index={i}
                                                viewMode={viewMode}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </motion.div>

                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onChange={handlePageChange}
                                />
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}