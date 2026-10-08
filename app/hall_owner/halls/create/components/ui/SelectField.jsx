"use client";
import { useFormContext } from "react-hook-form";

export default function SelectField({
  name,
  label,
  icon: Icon,
  options = [],
  placeholder = "انتخاب کنید",
  required = false,
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message;

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-[13px] font-semibold text-slate-700 mb-2"
      >
        {label}
        {required && <span className="text-rose-500 mr-1">*</span>}
      </label>

      <div className="relative group">
        {Icon && (
          <Icon className="absolute right-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gold-500 pointer-events-none z-10 transition-colors group-focus-within:text-gold-600" />
        )}

        <select
          id={name}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-err` : undefined}
          {...register(name)}
          className={`
            w-full ${Icon ? "pr-11" : "pr-4"} pl-10 py-3
            bg-white border-2 rounded-xl
            text-[13.5px] font-medium text-slate-900
            cursor-pointer appearance-none
            transition-all duration-200
            focus:outline-none focus:ring-4
            ${
              error
                ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                : "border-slate-200 hover:border-gold-300 hover:shadow-sm focus:border-gold-500 focus:ring-gold-500/10 focus:shadow-md"
            }
          `}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {/* Custom Chevron */}
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-slate-400 group-focus-within:text-gold-500 transition-colors"
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
        </div>
      </div>

      {error && (
        <p id={`${name}-err`} className="text-[11px] text-rose-600 mt-2">
          {error}
        </p>
      )}
    </div>
  );
}