// app/halls/components/SearchBar.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import { PiMagnifyingGlass, PiX, PiSlidersHorizontal } from "react-icons/pi";
import { useFilterStore } from "../store/filterStore";

export default function SearchBar({ onOpenFilters, activeFilterCount }) {
    const { filters, setFilter } = useFilterStore();
    const [local, setLocal] = useState(filters.search);
    const timer = useRef(null);

    // debounce ۳۰۰ms
    useEffect(() => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setFilter("search", local), 300);
        return () => clearTimeout(timer.current);
    }, [local, setFilter]);

    // sync یک‌طرفه از store
    useEffect(() => {
        if (filters.search !== local) setLocal(filters.search);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.search]);

    return (
        <div className="flex gap-2">
            <div className="flex-1 relative">
                <PiMagnifyingGlass className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                    type="text"
                    value={local}
                    onChange={(e) => setLocal(e.target.value)}
                    placeholder="جستجو در نام، شهر، آدرس، توضیحات..."
                    className="w-full pr-12 pl-10 py-3.5 bg-white border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#D4B06A] focus:ring-4 focus:ring-[#D4B06A]/10 transition-all text-sm"
                />
                {local && (
                    <button
                        onClick={() => setLocal("")}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="پاک کردن"
                    >
                        <PiX className="w-4 h-4 text-gray-500" />
                    </button>
                )}
            </div>

            <button
                onClick={onOpenFilters}
                className="lg:hidden relative px-4 py-3.5 bg-white border-2 border-gray-100 rounded-xl font-bold text-[#2C2418] hover:border-[#D4B06A] transition-colors flex items-center gap-2"
            >
                <PiSlidersHorizontal className="w-5 h-5" />
                فیلتر
                {activeFilterCount > 0 && (
                    <span className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-[#D4B06A] text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {activeFilterCount}
                    </span>
                )}
            </button>
        </div>
    );
}