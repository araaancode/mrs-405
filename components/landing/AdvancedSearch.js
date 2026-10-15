// components/landing/AdvancedSearch.jsx
'use client'

import {
    useCallback,
    useMemo,
    useState,
    useTransition,
    memo,
} from 'react'
import { useRouter } from 'next/navigation'
import {
    PiMagnifyingGlass,
    PiMapPin,
    PiSparkle,
    PiCalendarBlank,
    PiSpinnerGap,
    PiBuildings,
    PiXCircleFill,
} from 'react-icons/pi'

import CustomSelect from './advanced-search/CustomSelect'
import {
    EVENT_TYPES,
    HALL_TYPES,
    PROVINCES,
    INITIAL_FILTERS,
    FILTER_LABELS,
    getCitiesByProvince,
} from './advanced-search/constants'

/* ------------------------------------------------------------------ */
/*  Options — یک بار در ماژول                                          */
/* ------------------------------------------------------------------ */
const PROVINCE_OPTIONS = PROVINCES.map((p) => ({ value: p, label: p }))

/* ------------------------------------------------------------------ */
/*  SelectFieldWrapper — کاملاً مستقل (بدون Field)                     */
/* ------------------------------------------------------------------ */
const SelectFieldWrapper = memo(function SelectFieldWrapper({
    id,
    icon,
    label,
    placeholder,
    value,
    options,
    onChange,
    disabled = false,
    searchable = false,
}) {
    return (
        <div className="relative flex-1 min-w-0 flex flex-col">
            {/* Label */}
            <label
                htmlFor={id}
                className="
                    block text-[11px] font-bold text-slate-600
                    mb-1.5 text-right
                    select-none
                "
            >
                {label}
            </label>

            {/* CustomSelect با icon */}
            <CustomSelect
                id={id}
                value={value}
                onChange={(val) => onChange(id, val)}
                options={options}
                placeholder={placeholder}
                disabled={disabled}
                searchable={searchable}
                ariaLabel={label}
                icon={icon}
            />
        </div>
    )
})

/* ------------------------------------------------------------------ */
/*  ActiveChip                                                         */
/* ------------------------------------------------------------------ */
const ActiveChip = memo(function ActiveChip({ label, value, onRemove }) {
    return (
        <button
            type="button"
            onClick={onRemove}
            aria-label={`حذف فیلتر ${label}: ${value}`}
            className="
                group inline-flex items-center gap-1.5
                rounded-full bg-[#FBF7EC] px-3 py-1
                text-[12px] font-medium text-[#85672C]
                ring-1 ring-[#EDDCA9]
                transition-all duration-200
                hover:bg-[#F6EED5] hover:ring-[#C6A14C]/50
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A14C]/50
                active:scale-95
            "
        >
            <span className="text-[#A8853A]/70">{label}:</span>
            <span className="font-bold">{value}</span>
            <PiXCircleFill
                className="h-3.5 w-3.5 text-[#C6A14C] transition-colors group-hover:text-[#85672C]"
                aria-hidden="true"
            />
        </button>
    )
})

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function AdvancedSearch({ onSearch }) {
    const router = useRouter()
    const [filters, setFilters] = useState(INITIAL_FILTERS)
    const [isPending, startTransition] = useTransition()

    /* ----------------------------------------------------------------
       تغییر یک فیلد — اگه استان عوض شد، شهر پاک بشه
       ---------------------------------------------------------------- */
    const handleChange = useCallback((name, value) => {
        setFilters((prev) => {
            const next = { ...prev, [name]: value }

            if (name === 'province' && prev.province !== value) {
                next.city = ''
            }

            return next
        })
    }, [])

    /* ----------------------------------------------------------------
       لیست شهرهای استان انتخاب‌شده
       ---------------------------------------------------------------- */
    const cityOptions = useMemo(() => {
        if (!filters.province) return []
        const cities = getCitiesByProvince(filters.province)
        return cities.map((c) => ({ value: c, label: c }))
    }, [filters.province])

    /* ----------------------------------------------------------------
       تعداد فیلترهای فعال
       ---------------------------------------------------------------- */
    const activeEntries = useMemo(
        () => Object.entries(filters).filter(([, v]) => Boolean(v)),
        [filters]
    )
    const activeCount = activeEntries.length

    /* ----------------------------------------------------------------
       پاک کردن همه
       ---------------------------------------------------------------- */
    const handleReset = useCallback(() => {
        setFilters(INITIAL_FILTERS)
    }, [])

    /* ----------------------------------------------------------------
       Submit
       ---------------------------------------------------------------- */
    const handleSearch = useCallback(
        (e) => {
            e.preventDefault()

            const params = new URLSearchParams()
            for (const [key, value] of Object.entries(filters)) {
                if (value) params.set(key, value)
            }
            const qs = params.toString()

            console.log('🔍 Filters being sent:', filters)
            console.log('🌐 URL:', qs ? `/halls?${qs}` : '/halls')
            console.log('=====================================')

            onSearch?.(filters)

            startTransition(() => {
                router.push(qs ? `/halls?${qs}` : '/halls')
            })
        },
        [filters, router, onSearch]
    )

    return (
        <section
            aria-label="جستجوی پیشرفته تالار"
            className="
                relative z-20 mx-auto
                w-full max-w-4xl
                px-3 sm:px-4
                -mt-16 sm:-mt-20 md:-mt-24
            "
        >
            <form
                onSubmit={handleSearch}
                className="
                    overflow-visible
                    rounded-3xl
                    bg-white/95 backdrop-blur-md
                    shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)]
                    ring-1 ring-slate-100
                "
            >
                {/* ==================== Header ==================== */}
                <header
                    className="
                        flex items-center justify-between gap-3
                        border-b border-slate-100
                        bg-gradient-to-l from-[#FBF7EC]/60 via-white to-white
                        px-5 py-4
                        rounded-t-3xl
                    "
                >
                    <div className="flex items-center gap-2.5 min-w-0">
                        <span
                            className="
                                flex h-8 w-8 items-center justify-center
                                rounded-xl
                                bg-gradient-to-br from-[#C6A14C] to-[#A8853A]
                                shadow-[0_4px_12px_-2px_rgba(198,161,76,0.4)]
                                shrink-0
                            "
                        >
                            <PiBuildings
                                className="h-4 w-4 text-white"
                                aria-hidden="true"
                            />
                        </span>
                        <div className="min-w-0">
                            <h2 className="text-[14px] font-extrabold text-slate-800 truncate">
                                جستجوی هوشمند تالار
                            </h2>
                            <p className="text-[11px] text-slate-500 truncate hidden sm:block">
                                {activeCount > 0
                                    ? `${activeCount} فیلتر فعال`
                                    : 'برای شروع، فیلترها را انتخاب کنید'}
                            </p>
                        </div>
                    </div>

                    {activeCount > 0 && (
                        <button
                            type="button"
                            onClick={handleReset}
                            className="
                                inline-flex items-center gap-1.5
                                rounded-xl px-3 py-1.5
                                text-[12px] font-bold text-slate-600
                                bg-slate-50 hover:bg-rose-50 hover:text-rose-600
                                ring-1 ring-slate-200 hover:ring-rose-200
                                transition-all duration-200
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/40
                                shrink-0
                            "
                        >
                            <PiXCircleFill className="h-3.5 w-3.5" aria-hidden="true" />
                            <span className="hidden sm:inline">پاک کردن</span>
                            <span>({activeCount})</span>
                        </button>
                    )}
                </header>

                {/* ==================== Fields ==================== */}
                <div className="p-4 sm:p-5 md:p-6">
                    <div
                        className="
                            flex flex-col items-stretch gap-3
                            md:flex-row md:items-stretch
                        "
                    >
                        {/* استان */}
                        <SelectFieldWrapper
                            id="province"
                            icon={PiMapPin}
                            label={FILTER_LABELS.province}
                            placeholder="استان"
                            value={filters.province}
                            options={PROVINCE_OPTIONS}
                            onChange={handleChange}
                            searchable
                        />

                        {/* شهر — وابسته به استان */}
                        <SelectFieldWrapper
                            id="city"
                            icon={PiMapPin}
                            label={FILTER_LABELS.city}
                            placeholder="شهر"
                            value={filters.city}
                            options={cityOptions}
                            onChange={handleChange}
                            disabled={!filters.province}
                            searchable
                        />

                        {/* نوع مراسم */}
                        <SelectFieldWrapper
                            id="event_type"
                            icon={PiCalendarBlank}
                            label={FILTER_LABELS.event_type}
                            placeholder="نوع مراسم"
                            value={filters.event_type}
                            options={EVENT_TYPES}
                            onChange={handleChange}
                        />

                        {/* نوع تالار */}
                        <SelectFieldWrapper
                            id="hall_type"
                            icon={PiSparkle}
                            label={FILTER_LABELS.hall_type}
                            placeholder="نوع تالار"
                            value={filters.hall_type}
                            options={HALL_TYPES}
                            onChange={handleChange}
                        />

                        {/* 🔥 دکمه جستجو — با label نامرئی برای تراز ارتفاع */}
                        <div className="relative flex flex-col shrink-0 md:min-w-[140px]">
                            {/* label نامرئی — فقط برای یکسان‌سازی ارتفاع */}
                            <span
                                className="
                                    block text-[11px] font-bold
                                    mb-1.5 invisible select-none
                                "
                                aria-hidden="true"
                            >
                                &nbsp;
                            </span>

                            <button
                                type="submit"
                                disabled={isPending}
                                aria-busy={isPending}
                                className="
                                    group flex w-full h-12
                                    items-center justify-center gap-2
                                    rounded-xl
                                    bg-gradient-to-b from-[#D3B263] to-[#A8853A]
                                    px-6
                                    text-sm font-extrabold text-white
                                    shadow-[0_8px_20px_-6px_rgba(198,161,76,0.5)]
                                    transition-all duration-200
                                    hover:-translate-y-0.5
                                    hover:from-[#C6A14C] hover:to-[#85672C]
                                    hover:shadow-[0_12px_28px_-6px_rgba(198,161,76,0.6)]
                                    focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/30
                                    active:scale-[0.97]
                                    disabled:cursor-not-allowed disabled:opacity-70
                                    disabled:hover:translate-y-0 disabled:hover:shadow-[0_8px_20px_-6px_rgba(198,161,76,0.5)]
                                    sm:px-8
                                "
                            >
                                {isPending ? (
                                    <>
                                        <PiSpinnerGap
                                            className="h-5 w-5 animate-spin"
                                            aria-hidden="true"
                                        />
                                        <span>در حال جستجو…</span>
                                    </>
                                ) : (
                                    <>
                                        <PiMagnifyingGlass
                                            className="h-5 w-5 transition-transform group-hover:scale-110"
                                            aria-hidden="true"
                                        />
                                        <span>جستجو</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* ==================== Active chips ==================== */}
                    {activeCount > 0 && (
                        <ul
                            className="mt-4 flex flex-wrap gap-2 animate-in fade-in duration-300"
                            aria-label="فیلترهای فعال"
                        >
                            {activeEntries.map(([key, value]) => (
                                <li key={key}>
                                    <ActiveChip
                                        label={FILTER_LABELS[key]}
                                        value={value}
                                        onRemove={() => handleChange(key, '')}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </form>
        </section>
    )
}