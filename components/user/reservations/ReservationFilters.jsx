// components/user/reservations/ReservationFilters.jsx
"use client";

import { PiMagnifyingGlass, PiX } from "react-icons/pi";

const faNum = (n) => Number(n || 0).toLocaleString("fa-IR");

export default function ReservationFilters({
    searchQuery,
    onSearchChange,
    total,
}) {
    return (
        <div className="mb-5 flex items-center gap-3 flex-wrap">
            {/* جستجو */}
            <div className="relative flex-1 min-w-[240px]">
                <PiMagnifyingGlass
                    className="
            absolute right-3.5 top-1/2 -translate-y-1/2
            w-4 h-4 text-slate-400 pointer-events-none
          "
                />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="جستجو در نام تالار یا شهر..."
                    aria-label="جستجو در رزروها"
                    className="
            w-full pr-11 pl-10 py-2.5
            bg-white
            border border-slate-200
            rounded-xl
            text-sm text-slate-900
            placeholder:text-slate-400
            hover:border-gold-300
            focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10
            transition-all duration-200
          "
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => onSearchChange("")}
                        aria-label="پاک کردن جستجو"
                        className="
              absolute left-3 top-1/2 -translate-y-1/2
              w-6 h-6 rounded-full
              flex items-center justify-center
              text-slate-400 hover:text-gold-600 hover:bg-gold-50
              active:scale-90
              transition-all
            "
                    >
                        <PiX className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </button>
                )}
            </div>

            {/* تعداد */}
            <div
                className="
          px-3.5 py-2.5 rounded-xl
          bg-white border border-slate-200
          text-[12px] text-slate-600
          flex items-center gap-1.5
        "
            >
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                <span className="font-bold text-slate-900">{faNum(total)}</span>
                <span className="text-slate-500">رزرو</span>
            </div>
        </div>
    );
}