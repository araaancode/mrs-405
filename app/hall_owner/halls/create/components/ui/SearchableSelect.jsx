"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { PiMagnifyingGlass, PiX, PiCheck } from "react-icons/pi";
import { useFormContext } from "react-hook-form";

/**
 * SearchableSelect
 * کامپوننت select با قابلیت جستجو — یکپارچه با React Hook Form
 * از طریق نام فیلد با useFormContext ارتباط برقرار می‌کند.
 */
export default function SearchableSelect({
  name,
  label,
  icon: Icon,
  options = [],
  placeholder = "جستجو کنید...",
  required = false,
  disabled = false,
  onValueChange,
}) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const selected = watch(name) || "";
  const error = errors[name]?.message;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  /** فیلتر زنده */
  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, query]);

  /** بستن با کلیک بیرون */
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /** فوکوس روی input جستجو هنگام باز شدن */
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const select = (opt) => {
    setValue(name, opt, { shouldValidate: true, shouldDirty: true });
    onValueChange?.(opt);
    setQuery("");
    setOpen(false);
  };

  const clear = (e) => {
    e.stopPropagation();
    setValue(name, "", { shouldValidate: true, shouldDirty: true });
    onValueChange?.("");
  };

  return (
    <div ref={containerRef} className="relative">
      <label
        htmlFor={name}
        className="block text-[13px] font-semibold text-slate-700 mb-2"
      >
        {label}
        {required && <span className="text-rose-500 mr-1">*</span>}
      </label>

      <div
        onClick={() => !disabled && setOpen((o) => !o)}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={`${name}-listbox`}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            !disabled && setOpen((o) => !o);
          }
          if (e.key === "Escape") setOpen(false);
        }}
        className={`
          w-full flex items-center gap-2 px-4 py-3
          bg-white border-2 rounded-xl cursor-pointer
          transition-all duration-200
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${
            error
              ? "border-rose-300"
              : open
              ? "border-gold-500 ring-4 ring-gold-500/10"
              : "border-slate-200 hover:border-gold-300"
          }
        `}
      >
        {Icon && (
          <Icon className="w-[18px] h-[18px] text-gold-500 flex-shrink-0" />
        )}
        <span
          className={`flex-1 text-[13.5px] font-medium truncate ${
            selected ? "text-slate-900" : "text-slate-400"
          }`}
        >
          {selected || placeholder}
        </span>

        {selected ? (
          <button
            type="button"
            onClick={clear}
            aria-label="پاک کردن انتخاب"
            className="w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition"
          >
            <PiX className="w-3.5 h-3.5" />
          </button>
        ) : (
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform ${
              open ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </div>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-slate-100">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
              <PiMagnifyingGlass className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجو..."
                className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-slate-400"
                onClick={(e) => e.stopPropagation()}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-slate-400 hover:text-rose-500"
                >
                  <PiX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <ul
            id={`${name}-listbox`}
            role="listbox"
            className="max-h-56 overflow-y-auto py-1"
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-6 text-[12.5px] text-slate-400 text-center">
                موردی یافت نشد
              </li>
            ) : (
              filtered.map((opt) => (
                <li
                  key={opt}
                  role="option"
                  aria-selected={selected === opt}
                  onClick={() => select(opt)}
                  className={`
                    flex items-center justify-between px-4 py-2.5
                    text-[13px] cursor-pointer transition-colors
                    ${
                      selected === opt
                        ? "bg-gold-50 text-gold-700 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }
                  `}
                >
                  <span className="truncate">{opt}</span>
                  {selected === opt && (
                    <PiCheck className="w-4 h-4 text-gold-600 flex-shrink-0" />
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {error && (
        <p className="text-[11px] text-rose-600 mt-2">{error}</p>
      )}
    </div>
  );
}