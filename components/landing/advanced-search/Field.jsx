"use client";

import { PiXCircleFill } from "react-icons/pi";

export default function Field({
  icon: Icon,
  label,
  value,
  onClear,
  children,
  htmlFor,
}) {
  const showClear = Boolean(value) && Boolean(onClear);

  return (
    <div className="relative flex-1 w-full min-w-0 group">
      {/* Label فقط برای screen reader */}
      <label htmlFor={htmlFor} className="sr-only">
        {label}
      </label>

      {/* Icon */}
      {Icon && (
        <div
          className="pointer-events-none absolute start-3.5 top-1/2 z-10 -translate-y-1/2"
          aria-hidden="true"
        >
          <Icon className="w-4 h-4 text-gold-500 transition-colors group-focus-within:text-gold-600" />
        </div>
      )}

      {children}

      {/* Clear button */}
      {showClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label={`پاک کردن ${label}`}
          className="absolute end-2.5 top-1/2 z-10 -translate-y-1/2 rounded-full p-1 text-slate-400 opacity-0 transition-all duration-150 hover:text-slate-700 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-gold-500/40 group-hover:opacity-100 group-focus-within:opacity-100"
        >
          <PiXCircleFill className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}