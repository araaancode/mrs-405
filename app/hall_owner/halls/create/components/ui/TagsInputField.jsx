"use client";
import { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { PiX, PiTag, PiWarning, PiPlus } from "react-icons/pi";

export default function TagsInputField({
  name,
  label,
  icon: Icon = PiTag,
  placeholder = "مقدار را وارد و Enter بزنید",
  hint,
  required = false,
  minTagLength = 3,
  maxTagLength = 500,
  minTags = 1,
  maxTags = 5,
}) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message;
  const rawValue = watch(name) || "";

  /* تگ‌ها در state محلی — منبع حقیقت اصلی */
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState("");
  const isMounted = useRef(false);

  /* فقط یک‌بار از فرم مقدار اولیه را بخوان (برای draft/ویرایش) */
  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;

    if (rawValue) {
      const initial = rawValue
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      setTags(initial);
    }
  }, []); // eslint-disable-line

  /* هر بار tags تغییر کرد، فرم را sync کن */
  useEffect(() => {
    if (!isMounted.current) return;
    setValue(name, tags.join(", "), {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [tags, name, setValue]);

  const addTag = (text) => {
    const clean = text.trim();
    if (!clean) return;
    if (tags.length >= maxTags) return;
    if (tags.includes(clean)) {
      setInput("");
      return;
    }
    if (clean.length < minTagLength) return;
    if (clean.length > maxTagLength) return;

    setTags((prev) => [...prev, clean]);
    setInput("");
  };

  const removeTag = (idx) => {
    setTags((prev) => prev.filter((_, i) => i !== idx));
  };

  /* افزودن با دکمه + */
  const handleAddClick = () => {
    if (input.trim()) addTag(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "," || e.key === "،") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text");
    if (text.includes(",") || text.includes("،") || text.includes("\n")) {
      e.preventDefault();
      const items = text
        .split(/[,،\n]/)
        .map((s) => s.trim())
        .filter((s) => s.length >= minTagLength && s.length <= maxTagLength);
      setTags((prev) => {
        const merged = [...prev, ...items];
        return [...new Set(merged)].slice(0, maxTags);
      });
      setInput("");
    }
  };

  const invalidTags = tags.filter(
    (t) => t.length < minTagLength || t.length > maxTagLength
  );

  const reachedMax = tags.length >= maxTags;
  const canAdd = input.trim().length > 0 && !reachedMax;

  return (
    <div>
      {/* Label + شمارنده */}
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor={name}
          className="block text-[13px] font-medium text-slate-700"
        >
          {label}
          {required && <span className="text-rose-500 mr-1">*</span>}
        </label>
        <span
          className={`text-[11px] tabular-nums ${
            reachedMax
              ? "text-amber-600 font-bold"
              : "text-slate-400"
          }`}
        >
          {tags.length.toLocaleString("fa-IR")} /{" "}
          {maxTags.toLocaleString("fa-IR")}
        </span>
      </div>

      {/* Input + دکمه افزودن */}
      <div className="flex gap-2">
        <div className="relative group flex-1">
          <Icon className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500 pointer-events-none z-10 group-focus-within:text-gold-600 transition-colors" />
          <input
            id={name}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={
              reachedMax
                ? `حداکثر ${maxTags} مورد مجاز است`
                : placeholder
            }
            disabled={reachedMax}
            aria-invalid={!!error}
            className={`
              w-full pr-10 pl-3.5 py-2.5
              bg-white border rounded-xl
              text-[13.5px] text-slate-900
              placeholder:text-slate-400
              transition-all duration-200
              focus:outline-none focus:ring-4
              disabled:bg-slate-50 disabled:cursor-not-allowed
              ${
                error
                  ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                  : "border-slate-200 hover:border-gold-300 focus:border-gold-500 focus:ring-gold-500/10"
              }
            `}
          />
        </div>

        {/* دکمه افزودن */}
        <button
          type="button"
          onClick={handleAddClick}
          disabled={!canAdd}
          aria-label="افزودن تگ"
          className={`
            px-3 rounded-xl flex items-center justify-center gap-1
            text-[13px] font-bold transition-all duration-200
            ${
              canAdd
                ? "bg-gradient-to-b from-gold-400 to-gold-600 text-white hover:-translate-y-0.5 active:scale-95 shadow-md shadow-gold-500/25"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }
          `}
        >
          <PiPlus className="w-4 h-4" />
          افزودن
        </button>
      </div>

      {/* راهنما */}
      <p className="text-[11px] text-slate-400 mt-1.5">
        {hint ||
          `با Enter یا دکمه افزودن — حداقل ${minTags} و حداکثر ${maxTags} مورد`}
      </p>

      {/* نمایش تگ‌ها */}
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag, idx) => {
            const isTooLong = tag.length > maxTagLength;
            const isTooShort = tag.length < minTagLength;
            const isInvalid = isTooLong || isTooShort;

            return (
              <span
                key={`${tag}-${idx}`}
                title={tag}
                className={`
                  group/tag
                  inline-flex items-center gap-1.5
                  max-w-full
                  px-2.5 py-1.5 rounded-lg
                  ring-1 text-[12px] font-medium
                  transition-all duration-200
                  ${
                    isInvalid
                      ? "bg-rose-50 text-rose-700 ring-rose-200"
                      : "bg-gold-50 text-gold-700 ring-gold-200 hover:bg-gold-100"
                  }
                `}
              >
                {isInvalid && (
                  <PiWarning className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                )}

                <span className="truncate max-w-[240px] sm:max-w-[320px]">
                  {tag}
                </span>

                <button
                  type="button"
                  onClick={() => removeTag(idx)}
                  aria-label={`حذف ${tag}`}
                  className={`
                    w-4 h-4 rounded-full flex items-center justify-center
                    flex-shrink-0 transition-all duration-200
                    ${
                      isInvalid
                        ? "text-rose-500 hover:text-white hover:bg-rose-500"
                        : "text-gold-600 hover:text-white hover:bg-rose-500"
                    }
                  `}
                >
                  <PiX className="w-3 h-3" strokeWidth={3} />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* هشدار حداقل */}
      {tags.length > 0 && tags.length < minTags && (
        <p className="text-[11px] text-amber-600 mt-2">
          حداقل {minTags} مورد لازم است (
          {(minTags - tags.length).toLocaleString("fa-IR")} مورد دیگر)
        </p>
      )}

      {/* خطای فرم */}
      {error && (
        <p className="text-[11px] text-rose-600 mt-2">{error}</p>
      )}

      {/* هشدار تگ نامعتبر */}
      {!error && invalidTags.length > 0 && (
        <p className="text-[11px] text-rose-600 mt-2">
          {invalidTags.length.toLocaleString("fa-IR")} تگ دارای طول غیرمجاز
          است
        </p>
      )}
    </div>
  );
}