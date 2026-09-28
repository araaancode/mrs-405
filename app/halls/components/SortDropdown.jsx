// app/halls/components/SortDropdown.jsx
"use client";

import {
    PiSortAscending,
    PiSquaresFour,
    PiList,
    PiCaretDown,
} from "react-icons/pi";
import { useFilterStore } from "../store/filterStore";
import { SORT_OPTIONS } from "../constants";

export default function SortDropdown() {
    const { sort, setSort, viewMode, setViewMode } = useFilterStore();

    return (
        <div className="flex items-center gap-2 sm:gap-3">
            {/* ==================== Select مرتب‌سازی ==================== */}
            <div className="relative group">
                {/* آیکون چپ (sort) */}
                <PiSortAscending
                    className="
            absolute right-3 top-1/2 -translate-y-1/2
            w-4 h-4 pointer-events-none
            text-slate-400
            group-focus-within:text-gold-500
            transition-colors duration-200
          "
                />

                {/* Select */}
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    aria-label="مرتب‌سازی نتایج"
                    className="
            appearance-none
            pr-10 pl-9
            py-2.5 sm:py-3
            bg-white
            border-2 border-slate-100
            rounded-xl
            text-[13px] font-medium text-slate-700
            cursor-pointer
            hover:border-gold-200 hover:shadow-sm
            focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10
            transition-all duration-200
            min-w-[160px]
          "
                >
                    {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>

                {/* آیکون چپ (caret) */}
                <PiCaretDown
                    className="
            absolute left-3 top-1/2 -translate-y-1/2
            w-3.5 h-3.5 pointer-events-none
            text-slate-400
            group-focus-within:text-gold-500
            transition-colors duration-200
          "
                />
            </div>

            {/* ==================== Toggle نمای Grid/List ==================== */}
            <div
                className="
          hidden sm:flex
          bg-slate-50
          border border-slate-100
          rounded-xl
          p-1
          relative
        "
                role="group"
                aria-label="حالت نمایش"
            >
                {/* پس‌زمینه متحرک (indicator) */}
                <span
                    className={`
            absolute top-1 bottom-1 w-[calc(50%-4px)]
            rounded-lg
            bg-gradient-to-b from-gold-400 to-gold-600
            shadow-sm shadow-gold-500/25
            transition-all duration-300 ease-out
            ${viewMode === "grid"
                            ? "right-1"
                            : "right-[calc(50%+0px)]"
                        }
          `}
                    aria-hidden="true"
                />

                {/* دکمه Grid */}
                <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    aria-label="نمایش شبکه‌ای"
                    aria-pressed={viewMode === "grid"}
                    className={`
            relative z-10
            w-9 h-9 rounded-lg
            flex items-center justify-center
            transition-colors duration-200
            ${viewMode === "grid"
                            ? "text-white"
                            : "text-slate-400 hover:text-slate-700"
                        }
          `}
                >
                    <PiSquaresFour className="w-4 h-4" />
                </button>

                {/* دکمه List */}
                <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    aria-label="نمایش لیستی"
                    aria-pressed={viewMode === "list"}
                    className={`
            relative z-10
            w-9 h-9 rounded-lg
            flex items-center justify-center
            transition-colors duration-200
            ${viewMode === "list"
                            ? "text-white"
                            : "text-slate-400 hover:text-slate-700"
                        }
          `}
                >
                    <PiList className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}