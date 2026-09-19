// app/halls/components/SortDropdown.jsx
"use client";
import { PiSortAscending, PiSquaresFour, PiList } from "react-icons/pi";
import { useFilterStore } from "../store/filterStore";
import { SORT_OPTIONS } from "../constants";

export default function SortDropdown() {
    const { sort, setSort, viewMode, setViewMode } = useFilterStore();

    return (
        <div className="flex items-center gap-2">
            <div className="relative">
                <PiSortAscending className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="pr-9 pl-3 py-2.5 bg-white border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#D4B06A] appearance-none cursor-pointer"
                >
                    {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
            </div>

            <div className="hidden sm:flex bg-white border-2 border-gray-100 rounded-xl p-1">
                <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-[#D4B06A] text-white" : "text-gray-400 hover:text-gray-700"
                        }`}
                    aria-label="نمایش شبکه‌ای"
                >
                    <PiSquaresFour className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-[#D4B06A] text-white" : "text-gray-400 hover:text-gray-700"
                        }`}
                    aria-label="نمایش لیستی"
                >
                    <PiList className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}