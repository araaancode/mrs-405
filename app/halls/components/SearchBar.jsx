// app/halls/components/SearchBar.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { PiMagnifyingGlass, PiX, PiSlidersHorizontal } from "react-icons/pi";
import { useFilterStore } from "../store/filterStore";

export default function SearchBar({ onOpenFilters, activeFilterCount }) {
    const { filters, setFilter } = useFilterStore();
    const [local, setLocal] = useState(filters.search);
    const [isFocused, setIsFocused] = useState(false);
    const timer = useRef(null);
    const inputRef = useRef(null);

    /* debounce ۳۰۰ms */
    useEffect(() => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setFilter("search", local), 300);
        return () => clearTimeout(timer.current);
    }, [local, setFilter]);

    /* sync یک‌طرفه از store */
    useEffect(() => {
        if (filters.search !== local) setLocal(filters.search);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.search]);

    /* پاک کردن با Esc */
    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            setLocal("");
            inputRef.current?.blur();
        }
    };

    const handleClear = () => {
        setLocal("");
        inputRef.current?.focus();
    };

    return (
        <div className="flex gap-2 sm:gap-3">
            {/* ==================== فیلد جستجو ==================== */}
            <div
                className={`
          flex-1 relative group
          rounded-2xl
          transition-all duration-300
          ${isFocused
                        ? "shadow-lg shadow-[#C6A14C]/10"
                        : "shadow-sm hover:shadow-md"
                    }
        `}
            >
                {/* آیکون جستجو */}
                <div
                    className={`
            absolute right-4 top-1/2 -translate-y-1/2
            w-5 h-5 pointer-events-none
            flex items-center justify-center
            transition-colors duration-300
            ${isFocused ? "text-[#C6A14C]" : "text-gray-400"}
          `}
                >
                    <PiMagnifyingGlass className="w-5 h-5" />
                </div>

                {/* Input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={local}
                    onChange={(e) => setLocal(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={handleKeyDown}
                    placeholder="جستجو در نام، شهر، آدرس، توضیحات..."
                    aria-label="جستجوی تالار"
                    className="
            w-full
            pr-12 pl-12 py-3.5 sm:py-4
            bg-white
            border-2 border-gray-100
            rounded-2xl
            text-sm text-[#2C2418]
            placeholder:text-gray-400 placeholder:text-sm
            focus:outline-none
            focus:border-[#C6A14C]
            focus:ring-4 focus:ring-[#C6A14C]/10
            hover:border-gray-200
            transition-all duration-300
          "
                />

                {/* دکمه پاک کردن */}
                {local && (
                    <button
                        type="button"
                        onClick={handleClear}
                        aria-label="پاک کردن جستجو"
                        className="
              absolute left-3 top-1/2 -translate-y-1/2
              w-7 h-7 rounded-full
              flex items-center justify-center
              bg-gray-100 hover:bg-[#C6A14C]/10
              text-gray-500 hover:text-[#C6A14C]
              transition-all duration-200
              active:scale-90
            "
                    >
                        <PiX className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </button>
                )}

                {/* لودر کوچک (نمایش در حال جستجو) — اختیاری */}
                {isFocused && !local && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-[10px] text-gray-300 select-none">
                        <kbd className="px-1.5 py-0.5 rounded border border-gray-200 bg-gray-50 font-sans">
                            Esc
                        </kbd>
                    </div>
                )}
            </div>

            {/* ==================== دکمه فیلتر (موبایل) ==================== */}
            <button
                type="button"
                onClick={onOpenFilters}
                aria-label={`باز کردن فیلترها${activeFilterCount > 0 ? ` (${activeFilterCount} فعال)` : ""
                    }`}
                className="
          lg:hidden
          relative
          px-4 sm:px-5 py-3.5 sm:py-4
          bg-white
          border-2 border-gray-100
          rounded-2xl
          font-bold text-sm text-[#2C2418]
          hover:border-[#C6A14C] hover:text-[#C6A14C]
          hover:shadow-md
          focus:outline-none focus:border-[#C6A14C] focus:ring-4 focus:ring-[#C6A14C]/10
          transition-all duration-200
          flex items-center gap-2
          active:scale-95
          flex-shrink-0
        "
            >
                <PiSlidersHorizontal className="w-5 h-5" />
                <span className="hidden xs:inline sm:inline">فیلتر</span>

                {/* Badge تعداد فیلترهای فعال */}
                {activeFilterCount > 0 && (
                    <span
                        className="
              absolute -top-1.5 -left-1.5
              min-w-[22px] h-[22px] px-1
              bg-gradient-to-br from-[#C6A14C] to-[#A8853A]
              text-white
              text-[11px] font-bold
              rounded-full
              flex items-center justify-center
              shadow-md shadow-[#C6A14C]/40
              ring-2 ring-white
            "
                    >
                        {activeFilterCount.toLocaleString("fa-IR")}
                    </span>
                )}
            </button>
        </div>
    );
}