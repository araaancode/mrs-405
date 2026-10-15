// components/landing/advanced-search/CustomSelect.jsx
'use client'

import {
    useState,
    useRef,
    useEffect,
    useCallback,
    useMemo,
    memo,
} from 'react'
import {
    PiCaretDownBold,
    PiMagnifyingGlass,
    PiCheckBold,
    PiXCircleFill,
} from 'react-icons/pi'

/* ============================================================
   CustomSelect — dropdown سفارشی
   - همیشه پایین input باز می‌شه
   - با کلیک بیرون بسته می‌شه
   - searchable (اختیاری)
   - keyboard navigation
   - آیکون سمت راست (بدون تداخل با متن)
   ============================================================ */
const CustomSelect = memo(function CustomSelect({
    id,
    value,
    onChange,
    options = [],
    placeholder = 'انتخاب کنید',
    disabled = false,
    searchable = false,
    emptyMessage = 'گزینه‌ای یافت نشد',
    ariaLabel,
    icon: Icon,
}) {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [highlightedIndex, setHighlightedIndex] = useState(-1)

    const rootRef = useRef(null)
    const inputRef = useRef(null)
    const listRef = useRef(null)

    /* ------------------------------------------------------------
       پیدا کردن label فعلی
       ------------------------------------------------------------ */
    const selectedOption = useMemo(
        () => options.find((opt) => opt.value === value),
        [options, value]
    )
    const displayLabel = selectedOption?.label || ''

    /* ------------------------------------------------------------
       فیلتر بر اساس query
       ------------------------------------------------------------ */
    const filteredOptions = useMemo(() => {
        if (!searchable || !query.trim()) return options
        const q = query.trim().toLowerCase()
        return options.filter((opt) =>
            String(opt.label).toLowerCase().includes(q)
        )
    }, [options, query, searchable])

    /* ------------------------------------------------------------
       بستن با کلیک بیرون
       ------------------------------------------------------------ */
    useEffect(() => {
        if (!open) return

        const handleClickOutside = (e) => {
            if (rootRef.current && !rootRef.current.contains(e.target)) {
                setOpen(false)
                setQuery('')
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('touchstart', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('touchstart', handleClickOutside)
        }
    }, [open])

    /* ------------------------------------------------------------
       Keyboard navigation
       ------------------------------------------------------------ */
    const onKeyDown = useCallback(
        (e) => {
            if (disabled) return

            if (e.key === 'Escape') {
                e.preventDefault()
                setOpen(false)
                setQuery('')
                return
            }

            if (
                !open &&
                (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')
            ) {
                e.preventDefault()
                setOpen(true)
                setHighlightedIndex(
                    Math.max(
                        0,
                        filteredOptions.findIndex((o) => o.value === value)
                    )
                )
                return
            }

            if (!open) return

            if (e.key === 'ArrowDown') {
                e.preventDefault()
                setHighlightedIndex((i) =>
                    Math.min(i + 1, filteredOptions.length - 1)
                )
            } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setHighlightedIndex((i) => Math.max(i - 1, 0))
            } else if (e.key === 'Enter') {
                e.preventDefault()
                const opt = filteredOptions[highlightedIndex]
                if (opt) {
                    onChange(opt.value)
                    setOpen(false)
                    setQuery('')
                }
            }
        },
        [open, disabled, filteredOptions, highlightedIndex, value, onChange]
    )

    /* ------------------------------------------------------------
       اسکرول به آیتم highlight
       ------------------------------------------------------------ */
    useEffect(() => {
        if (!open || highlightedIndex < 0) return
        const list = listRef.current
        if (!list) return
        const item = list.children[highlightedIndex]
        if (item && item.scrollIntoView) {
            item.scrollIntoView({ block: 'nearest' })
        }
    }, [highlightedIndex, open])

    /* ------------------------------------------------------------
       Focus روی search input
       ------------------------------------------------------------ */
    useEffect(() => {
        if (open && searchable && inputRef.current) {
            inputRef.current.focus()
        }
    }, [open, searchable])

    /* ------------------------------------------------------------
       انتخاب گزینه
       ------------------------------------------------------------ */
    const handleSelect = (optValue) => {
        onChange(optValue)
        setOpen(false)
        setQuery('')
    }

    /* ------------------------------------------------------------
       پاک کردن مقدار
       ------------------------------------------------------------ */
    const handleClear = (e) => {
        e.stopPropagation()
        onChange('')
        setQuery('')
    }

    /* ------------------------------------------------------------
       Toggle
       ------------------------------------------------------------ */
    const handleToggle = () => {
        if (disabled) return
        setOpen((o) => !o)
        if (!open) {
            setHighlightedIndex(
                Math.max(
                    0,
                    filteredOptions.findIndex((o) => o.value === value)
                )
            )
        }
    }

    return (
        <div ref={rootRef} className="relative w-full">
            {/* ==================== Trigger ==================== */}
            <button
                type="button"
                id={id}
                onClick={handleToggle}
                onKeyDown={onKeyDown}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={ariaLabel || placeholder}
                className={`
                    relative w-full h-12
                    flex items-center justify-between gap-2
                    text-[13px] font-medium text-slate-700
                    bg-white
                    border rounded-xl
                    transition-all duration-200
                    focus:outline-none
                    ${
                        disabled
                            ? 'opacity-50 cursor-not-allowed border-slate-200 bg-slate-50'
                            : open
                            ? 'border-[#C6A14C] ring-4 ring-[#C6A14C]/15 cursor-pointer'
                            : 'border-slate-200 hover:border-[#D3B263] cursor-pointer'
                    }
                `}
                style={{
                    paddingRight: Icon ? '2.5rem' : '0.875rem',
                    paddingLeft: '2.5rem',
                }}
            >
                {/* 🔥 آیکون سمت راست — با absolute و pointer-events-none */}
                {Icon && (
                    <span
                        className="
                            absolute right-3 top-1/2 -translate-y-1/2
                            flex items-center justify-center
                            pointer-events-none
                        "
                        aria-hidden="true"
                    >
                        <Icon
                            className={`
                                w-4 h-4
                                ${
                                    disabled
                                        ? 'text-slate-300'
                                        : open
                                        ? 'text-[#C6A14C]'
                                        : 'text-[#C6A14C]/70'
                                }
                                transition-colors duration-200
                            `}
                        />
                    </span>
                )}

                {/* 🔥 متن — با padding-right که قبلاً ست شده، آیکون روش نمیفته */}
                <span
                    className={`
                        truncate text-right flex-1
                        ${!value ? 'text-slate-400' : 'text-slate-700 font-bold'}
                    `}
                >
                    {disabled
                        ? 'ابتدا استان را انتخاب کنید'
                        : displayLabel || placeholder}
                </span>

                {/* آیکون‌های چپ (clear + caret) */}
                <span className="flex items-center gap-1 shrink-0">
                    {value && !disabled && (
                        <span
                            role="button"
                            tabIndex={-1}
                            onClick={handleClear}
                            aria-label="پاک کردن"
                            className="
                                flex items-center justify-center
                                w-5 h-5 rounded-full
                                text-slate-400 hover:text-rose-500 hover:bg-rose-50
                                transition-colors cursor-pointer
                            "
                        >
                            <PiXCircleFill className="w-4 h-4" aria-hidden="true" />
                        </span>
                    )}
                    <PiCaretDownBold
                        className={`
                            w-3.5 h-3.5 text-[#C6A14C]
                            transition-transform duration-200
                            ${open ? 'rotate-180' : ''}
                        `}
                        aria-hidden="true"
                    />
                </span>
            </button>

            {/* ==================== Dropdown ==================== */}
            {open && !disabled && (
                <div
                    role="listbox"
                    aria-label={ariaLabel || placeholder}
                    className="
                        absolute top-full right-0 left-0
                        mt-1.5 z-50
                        bg-white
                        border border-slate-200
                        rounded-xl
                        shadow-[0_12px_40px_-8px_rgba(15,23,42,0.18)]
                        overflow-hidden
                        animate-in fade-in slide-in-from-top-1 duration-150
                    "
                    style={{ maxHeight: '280px' }}
                >
                    {/* Search input */}
                    {searchable && options.length > 8 && (
                        <div className="p-2 border-b border-slate-100 sticky top-0 bg-white z-10">
                            <div className="relative">
                                <PiMagnifyingGlass
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"
                                    aria-hidden="true"
                                />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => {
                                        setQuery(e.target.value)
                                        setHighlightedIndex(0)
                                    }}
                                    onKeyDown={onKeyDown}
                                    placeholder="جستجو…"
                                    className="
                                        w-full h-9 pr-8 pl-3
                                        text-[12px] text-slate-700
                                        bg-slate-50
                                        border border-slate-200
                                        rounded-lg
                                        focus:outline-none
                                        focus:border-[#C6A14C]
                                        focus:ring-2 focus:ring-[#C6A14C]/15
                                        placeholder:text-slate-400
                                    "
                                />
                            </div>
                        </div>
                    )}

                    {/* Options list */}
                    <ul
                        ref={listRef}
                        className="overflow-y-auto py-1"
                        style={{ maxHeight: searchable ? '230px' : '270px' }}
                    >
                        {filteredOptions.length === 0 ? (
                            <li className="px-3 py-4 text-center text-[12px] text-slate-400">
                                {emptyMessage}
                            </li>
                        ) : (
                            filteredOptions.map((opt, i) => {
                                const isSelected = opt.value === value
                                const isHighlighted = i === highlightedIndex

                                return (
                                    <li
                                        key={opt.value}
                                        role="option"
                                        aria-selected={isSelected}
                                        onClick={() => handleSelect(opt.value)}
                                        onMouseEnter={() => setHighlightedIndex(i)}
                                        className={`
                                            mx-1 px-3 py-2 rounded-lg
                                            flex items-center justify-between gap-2
                                            text-[12.5px] cursor-pointer
                                            transition-colors duration-100
                                            ${
                                                isSelected
                                                    ? 'bg-[#FBF7EC] text-[#85672C] font-bold'
                                                    : isHighlighted
                                                    ? 'bg-slate-50 text-slate-800'
                                                    : 'text-slate-700 hover:bg-slate-50'
                                            }
                                        `}
                                    >
                                        <span className="truncate">{opt.label}</span>
                                        {isSelected && (
                                            <PiCheckBold
                                                className="w-3.5 h-3.5 text-[#C6A14C] shrink-0"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </li>
                                )
                            })
                        )}
                    </ul>
                </div>
            )}
        </div>
    )
})

export default CustomSelect