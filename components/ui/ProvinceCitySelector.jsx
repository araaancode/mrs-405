"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { PiMagnifyingGlass, PiCaretDown, PiCheck, PiX } from "react-icons/pi";
import { IRAN_PROVINCES } from "@/lib/iranProvinces";

/* ============================================================
   Combobox قابل جستجو
   ============================================================ */
function SearchableSelect({
    label,
    name,
    value,
    onChange,
    options,
    placeholder = "انتخاب کنید",
    error,
    disabled = false,
    required = false,
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const wrapRef = useRef(null);
    const inputRef = useRef(null);

    /* بستن با کلیک بیرون */
    useEffect(() => {
        const onDocClick = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                setOpen(false);
                setQuery("");
            }
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    /* فیلتر نتایج */
    const filtered = useMemo(() => {
        if (!query.trim()) return options;
        return options.filter((o) =>
            o.label.toLowerCase().includes(query.trim().toLowerCase())
        );
    }, [options, query]);

    const selected = options.find((o) => o.value === value);

    const handleSelect = (opt) => {
        onChange({ target: { name, value: opt.value } });
        setOpen(false);
        setQuery("");
    };

    const handleClear = (e) => {
        e.stopPropagation();
        onChange({ target: { name, value: "" } });
        setQuery("");
    };

    return (
        <div className="flex flex-col gap-1.5" ref={wrapRef}>
            <label
                htmlFor={name}
                className="text-sm font-medium text-slate-700 flex items-center gap-1"
            >
                {label}
                {required && <span className="text-rose-500">*</span>}
            </label>

            <div className="relative">
                {/* Trigger */}
                <button
                    id={name}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                        if (disabled) return;
                        setOpen((p) => !p);
                        setTimeout(() => inputRef.current?.focus(), 50);
                    }}
                    className={`
            w-full flex items-center justify-between gap-2
            px-3.5 py-2.5 rounded-xl border bg-white text-sm text-right
            transition-all duration-200 focus:outline-none focus:ring-4
            ${error
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                            : "border-slate-200 hover:border-gold-300 focus:border-gold-500 focus:ring-gold-500/15"
                        }
            ${disabled
                            ? "bg-slate-50 text-slate-400 cursor-not-allowed"
                            : "cursor-pointer"
                        }
          `}
                >
                    <span
                        className={`truncate ${selected ? "text-slate-900" : "text-slate-400"
                            }`}
                    >
                        {selected ? selected.label : placeholder}
                    </span>

                    <span className="flex items-center gap-1 flex-shrink-0">
                        {selected && !disabled && (
                            <span
                                role="button"
                                tabIndex={0}
                                onClick={handleClear}
                                onKeyDown={(e) => e.key === "Enter" && handleClear(e)}
                                className="w-4 h-4 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
                            >
                                <PiX className="w-3 h-3" />
                            </span>
                        )}
                        <PiCaretDown
                            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""
                                }`}
                        />
                    </span>
                </button>

                {/* Dropdown */}
                {open && (
                    <div
                        className="
              absolute z-50 top-full mt-2 right-0 left-0
              bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/50
              overflow-hidden animate-fade-in
            "
                        style={{ animationDuration: "0.15s" }}
                    >
                        {/* Search */}
                        <div className="p-2 border-b border-slate-100 bg-slate-50/50">
                            <div className="relative">
                                <PiMagnifyingGlass className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="جستجو..."
                                    className="
                    w-full pr-9 pl-3 py-2 rounded-lg text-sm
                    bg-white border border-slate-200
                    placeholder:text-slate-400
                    focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/15
                  "
                                />
                            </div>
                        </div>

                        {/* Options */}
                        <ul
                            role="listbox"
                            className="max-h-60 overflow-y-auto py-1 scrollbar-thin"
                        >
                            {filtered.length === 0 ? (
                                <li className="px-4 py-6 text-center text-sm text-slate-400">
                                    موردی یافت نشد
                                </li>
                            ) : (
                                filtered.map((opt) => {
                                    const isActive = opt.value === value;
                                    return (
                                        <li key={opt.value}>
                                            <button
                                                type="button"
                                                onClick={() => handleSelect(opt)}
                                                className={`
                          w-full text-right px-3 py-2 text-sm
                          flex items-center justify-between gap-2
                          transition-colors
                          ${isActive
                                                        ? "bg-gold-50 text-gold-700 font-medium"
                                                        : "text-slate-700 hover:bg-slate-50"
                                                    }
                        `}
                                            >
                                                <span className="truncate">{opt.label}</span>
                                                {isActive && (
                                                    <PiCheck className="w-4 h-4 text-gold-600 flex-shrink-0" />
                                                )}
                                            </button>
                                        </li>
                                    );
                                })
                            )}
                        </ul>
                    </div>
                )}
            </div>

            {error && <p className="text-xs text-rose-600">{error}</p>}
        </div>
    );
}

/* ============================================================
   کامپوننت اصلی: استان + شهر
   ============================================================ */
export function ProvinceCitySelector({ form, onChange, errors = {} }) {
    const provinces = useMemo(
        () =>
            Object.keys(IRAN_PROVINCES).map((p) => ({
                value: p,
                label: p,
            })),
        []
    );

    const cities = useMemo(() => {
        if (!form.province) return [];
        return (IRAN_PROVINCES[form.province] || []).map((c) => ({
            value: c,
            label: c,
        }));
    }, [form.province]);

    /* اگر استان عوض شد، شهر ریست شود */
    const handleProvinceChange = (e) => {
        onChange({ target: { name: "province", value: e.target.value } });
        onChange({ target: { name: "city", value: "" } });
    };

    return (
        <>
            <SearchableSelect
                label="استان"
                name="province"
                value={form.province || ""}
                onChange={handleProvinceChange}
                options={provinces}
                placeholder="استان خود را انتخاب کنید"
                error={errors.province}
            />
            <SearchableSelect
                label="شهر"
                name="city"
                value={form.city || ""}
                onChange={onChange}
                options={cities}
                placeholder={
                    form.province
                        ? "شهر خود را انتخاب کنید"
                        : "ابتدا استان را انتخاب کنید"
                }
                disabled={!form.province}
                error={errors.city}
            />
        </>
    );
}