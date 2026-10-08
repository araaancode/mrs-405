"use client";

export default function UploadBox({
  id,
  accept,
  multiple = true,
  onChange,
  title,
  hint,
  icon: Icon,
  disabled = false,
}) {
  return (
    <div
      className={`
        relative group rounded-2xl border-2 border-dashed
        transition-all duration-300 overflow-hidden
        ${
          disabled
            ? "border-slate-200 bg-slate-100/60 opacity-60 cursor-not-allowed"
            : "border-slate-200 hover:border-gold-400 bg-slate-50/50 hover:bg-gold-50/40"
        }
      `}
    >
      <input
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={onChange}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
        aria-label={title}
      />
      <label
        htmlFor={id}
        className={`flex flex-col items-center justify-center gap-2 py-8 sm:py-10 px-4 ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <div
          className={`
            w-12 h-12 rounded-2xl flex items-center justify-center
            ring-1 transition-transform
            ${
              disabled
                ? "bg-slate-100 text-slate-400 ring-slate-200"
                : "bg-gradient-to-br from-gold-50 to-gold-100/60 text-gold-600 ring-gold-200/60 group-hover:scale-110"
            }
          `}
        >
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        <p className="text-[13.5px] font-bold text-slate-800">{title}</p>
        <p className="text-[11px] text-slate-400">{hint}</p>
      </label>
    </div>
  );
}