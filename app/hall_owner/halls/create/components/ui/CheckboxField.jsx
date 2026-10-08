"use client";
import { useFormContext } from "react-hook-form";

export default function CheckboxField({ name, label }) {
  const { register, watch } = useFormContext();
  const checked = watch(name);

  return (
    <label className="flex items-center gap-2.5 cursor-pointer py-2 group">
      <span
        className={`relative w-[18px] h-[18px] rounded-md border-2
          flex items-center justify-center flex-shrink-0 transition-all
          ${
            checked
              ? "border-gold-500 bg-gradient-to-b from-gold-400 to-gold-600"
              : "border-slate-300 bg-white group-hover:border-gold-400"
          }`}
      >
        {checked && (
          <svg
            className="w-3 h-3 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </span>
      <input type="checkbox" {...register(name)} className="sr-only" />
      <span className="text-[13px] text-slate-700 group-hover:text-slate-900">
        {label}
      </span>
    </label>
  );
}