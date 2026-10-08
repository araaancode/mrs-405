"use client";
import { useFormContext } from "react-hook-form";

export default function InputField({
  name,
  label,
  icon: Icon,
  type = "text",
  dir = "rtl",
  inputMode,
  step,
  placeholder,
  hint,
  required = false,
  ...rest
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
        className="block text-[13px] font-medium text-slate-700 mb-1.5"
      >
        {label}
        {required && <span className="text-rose-500 mr-1">*</span>}
      </label>

      <div className="relative group">
        {Icon && (
          <Icon className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500 pointer-events-none group-focus-within:text-gold-600 transition-colors z-10" />
        )}
        <input
          id={name}
          type={type}
          dir={dir}
          inputMode={inputMode}
          step={step}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-err` : undefined}
          {...register(name)}
          {...rest}
          className={`w-full ${Icon ? "pr-10" : "pr-3.5"} pl-3.5 py-2.5
            bg-white border rounded-xl text-[13.5px] text-slate-900
            placeholder:text-slate-400 transition-all duration-200
            focus:outline-none focus:ring-4
            ${
              error
                ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                : "border-slate-200 hover:border-gold-300 focus:border-gold-500 focus:ring-gold-500/10"
            }
            ${dir === "ltr" ? "text-left" : "text-right"}`}
        />
      </div>

      {error ? (
        <p id={`${name}-err`} className="text-[11px] text-rose-600 mt-1.5">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[11px] text-slate-400 mt-1.5">{hint}</p>
      ) : null}
    </div>
  );
}