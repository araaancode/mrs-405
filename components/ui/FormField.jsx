"use client";

import { forwardRef } from "react";

/* ============================================================
   InputField
   ============================================================ */
export const InputField = forwardRef(function InputField(
    {
        label,
        name,
        error,
        hint,
        required,
        icon,
        className = "",
        ...rest
    },
    ref
) {
    return (
        <div className="flex flex-col gap-1.5">
            <label
                htmlFor={name}
                className="text-sm font-medium text-slate-700 flex items-center gap-1"
            >
                {label}
                {required && <span className="text-rose-500">*</span>}
            </label>

            <div className="relative">
                {icon && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        {icon}
                    </span>
                )}
                <input
                    ref={ref}
                    id={name}
                    name={name}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${name}-error` : undefined}
                    className={`
            w-full ${icon ? "pr-10" : "pr-3.5"} pl-3.5 py-2.5 rounded-xl border bg-white text-sm text-slate-900
            transition-all duration-200 placeholder:text-slate-400
            focus:outline-none focus:ring-4
            ${error
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                            : "border-slate-200 hover:border-gold-300 focus:border-gold-500 focus:ring-gold-500/15"
                        }
            disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
            ${className}
          `}
                    {...rest}
                />
            </div>

            {error ? (
                <p
                    id={`${name}-error`}
                    className="text-xs text-rose-600 flex items-center gap-1"
                >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {error}
                </p>
            ) : hint ? (
                <p className="text-xs text-slate-500">{hint}</p>
            ) : null}
        </div>
    );
});

/* ============================================================
   SelectField
   ============================================================ */
export function SelectField({
    label,
    name,
    error,
    required,
    children,
    className = "",
    ...rest
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={name} className="text-sm font-medium text-slate-700">
                {label}
                {required && <span className="text-rose-500 ml-1">*</span>}
            </label>
            <select
                id={name}
                name={name}
                aria-invalid={!!error}
                className={`
          w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm text-slate-900
          transition-all duration-200 focus:outline-none focus:ring-4
          ${error
                        ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                        : "border-slate-200 hover:border-gold-300 focus:border-gold-500 focus:ring-gold-500/15"
                    }
          ${className}
        `}
                {...rest}
            >
                {children}
            </select>
            {error && <p className="text-xs text-rose-600">{error}</p>}
        </div>
    );
}