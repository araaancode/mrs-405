// components/ui/PersianDatePicker.jsx
"use client";

import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/teal.css";
import { useRef } from "react";

/* ============================================================
   تابع کمکی — تبدیل هر نوع مقدار به Date معتبر
   ============================================================ */
function toValidDate(value) {
    if (!value) return null;

    if (value instanceof Date) {
        return isNaN(value.getTime()) ? null : value;
    }

    if (typeof value === "object" && typeof value.toDate === "function") {
        try {
            const d = value.toDate();
            return d instanceof Date && !isNaN(d.getTime()) ? d : null;
        } catch {
            return null;
        }
    }

    if (typeof value === "string") {
        const d = new Date(value);
        return isNaN(d.getTime()) ? null : d;
    }

    if (typeof value === "number") {
        const d = new Date(value);
        return isNaN(d.getTime()) ? null : d;
    }

    return null;
}

/* ============================================================
   PersianDatePicker — انتخاب تاریخ شمسی (عمومی)
   ============================================================ */
export function PersianDatePicker({
    label,
    value,
    onChange,
    error,
    required = false,
    minDate,
    maxDate,
    disabled = false,
    placeholder = "انتخاب تاریخ",
}) {
    const ref = useRef(null);
    const safeValue = toValidDate(value);
    const safeMinDate = toValidDate(minDate);
    const safeMaxDate = toValidDate(maxDate);

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    {label}
                    {required && <span className="text-rose-500">*</span>}
                </label>
            )}

            <div className="relative">
                <DatePicker
                    ref={ref}
                    calendar={persian}
                    locale={persian_fa}
                    value={safeValue}
                    onChange={onChange}
                    minDate={safeMinDate}
                    maxDate={safeMaxDate}
                    disabled={disabled}
                    format="YYYY/MM/DD"
                    calendarPosition="bottom-right"
                    inputClass={`
                        w-full pl-28 pr-3.5 py-2.5 rounded-xl border bg-white text-sm text-slate-900
                        transition-all duration-200 focus:outline-none focus:ring-4
                        ${
                            disabled
                                ? "opacity-60 cursor-not-allowed bg-slate-50"
                                : ""
                        }
                        ${
                            error
                                ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                                : "border-slate-200 hover:border-gold-300 focus:border-gold-500 focus:ring-gold-500/10"
                        }
                    `}
                    containerClassName="w-full"
                    placeholder={placeholder}
                />

                <button
                    type="button"
                    onClick={() => !disabled && ref.current?.openCalendar()}
                    disabled={disabled}
                    className="
                        absolute left-2 top-1/2 -translate-y-1/2
                        h-8 px-3 rounded-lg
                        bg-gradient-to-b from-gold-400 to-gold-600
                        hover:from-gold-500 hover:to-gold-700
                        text-white text-xs font-medium
                        shadow-sm hover:shadow-md
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-gold-500/40
                        flex items-center gap-1.5
                        disabled:opacity-50 disabled:cursor-not-allowed
                    "
                >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                        />
                    </svg>
                    انتخاب
                </button>
            </div>

            {error ? (
                <p className="text-xs text-rose-600">{error}</p>
            ) : safeValue ? (
                <p className="text-xs text-slate-500">
                    تاریخ انتخاب‌شده:{" "}
                    <span className="text-slate-700 font-medium">
                        {safeValue.toLocaleDateString("fa-IR")}
                    </span>
                </p>
            ) : null}
        </div>
    );
}