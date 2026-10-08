"use client";
import { useFormContext } from "react-hook-form";

/**
 * TextareaField
 * نسخه ارتقا‌یافته با شمارنده کاراکتر و بازخورد بصری.
 */
export default function TextareaField({
  name,
  label,
  placeholder,
  hint,
  required = false,
  rows = 4,
  minLength,
  maxLength,
}) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const value = watch(name) || "";
  const error = errors[name]?.message;
  const len = value.length;

  const isLow = minLength && len > 0 && len < minLength;
  const isHigh = maxLength && len > maxLength;
  const isOk =
    minLength && maxLength && len >= minLength && len <= maxLength;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor={name}
          className="block text-[13px] font-medium text-slate-700"
        >
          {label}
          {required && <span className="text-rose-500 mr-1">*</span>}
        </label>

        {maxLength && (
          <span
            className={`text-[11px] tabular-nums transition-colors ${
              isHigh
                ? "text-rose-600 font-bold"
                : isOk
                ? "text-emerald-600 font-bold"
                : "text-slate-400"
            }`}
          >
            {len.toLocaleString("fa-IR")} /{" "}
            {maxLength.toLocaleString("fa-IR")}
          </span>
        )}
      </div>

      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-err` : undefined}
        {...register(name)}
        className={`
          w-full px-3.5 py-3
          bg-white border rounded-xl
          text-[13.5px] text-slate-900
          placeholder:text-slate-400
          resize-none
          transition-all duration-200
          focus:outline-none focus:ring-4
          ${
            error
              ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
              : "border-slate-200 hover:border-gold-300 focus:border-gold-500 focus:ring-gold-500/10"
          }
        `}
      />

      {error ? (
        <p
          id={`${name}-err`}
          className="text-[11px] text-rose-600 mt-1.5"
        >
          {error}
        </p>
      ) : isLow ? (
        <p className="text-[11px] text-amber-600 mt-1.5">
          {(minLength - len).toLocaleString("fa-IR")} کاراکتر دیگر لازم است
        </p>
      ) : isOk ? (
        <p className="text-[11px] text-emerald-600 mt-1.5">✓ معتبر</p>
      ) : hint ? (
        <p className="text-[11px] text-slate-400 mt-1.5">{hint}</p>
      ) : null}
    </div>
  );
}