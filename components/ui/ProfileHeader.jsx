"use client";

import {
    PiCamera,
    PiCheckCircle,
    PiUserCircle,
} from "react-icons/pi";

export function ProfileHeader({ form, isDirty, onAvatarClick }) {
    /* محاسبه درصد تکمیل پروفایل */
    const fields = [
        "full_name",
        "email",
        "phone",
        "national_code",
        "birth_date",
        "gender",
        "province",
        "city",
    ];
    const filled = fields.filter((f) => form?.[f]?.toString()?.trim()).length;
    const completion = Math.round((filled / fields.length) * 100);

    const initials = (form?.full_name || form?.username || "؟")
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("");

    return (
        <div className="mb-6 pb-6 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5">
                {/* آواتار */}
                <button
                    type="button"
                    onClick={onAvatarClick}
                    className="
            relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl
            bg-gold-50 ring-1 ring-gold-100
            flex items-center justify-center
            text-2xl sm:text-3xl font-bold text-gold-600
            hover:scale-[1.02] hover:ring-gold-200 transition-all
            group overflow-hidden flex-shrink-0
          "
                >
                    {form?.avatar ? (
                        <img
                            src={form.avatar}
                            alt={form.full_name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="select-none">{initials}</span>
                    )}

                    {/* Overlay آپلود آواتار */}
                    <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <PiCamera className="w-5 h-5 text-white" />
                    </span>
                </button>

                {/* اطلاعات */}
                <div className="flex-1 text-center sm:text-right min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
                            {form?.full_name || "کاربر بدون نام"}
                        </h1>

                        {/* Badge وضعیت */}
                        {isDirty ? (
                            <span className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full bg-gold-50 border border-gold-200 text-gold-700 text-[11px] font-medium self-center sm:self-auto">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                                تغییرات ذخیره نشده
                            </span>
                        ) : (
                            <span className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium self-center sm:self-auto">
                                <PiCheckCircle className="w-3.5 h-3.5" />
                                ذخیره شده
                            </span>
                        )}
                    </div>

                    <p className="text-sm text-slate-500 mt-1 truncate">
                        {form?.email || form?.username || "—"}
                    </p>
                </div>

                {/* درصد تکمیل */}
                <div className="w-full sm:w-auto flex-shrink-0">
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 sm:min-w-[200px]">
                        <div className="relative w-10 h-10 flex-shrink-0">
                            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                                <circle
                                    cx="18"
                                    cy="18"
                                    r="16"
                                    fill="none"
                                    stroke="#F6EED5"
                                    strokeWidth="3"
                                />
                                <circle
                                    cx="18"
                                    cy="18"
                                    r="16"
                                    fill="none"
                                    stroke="#C6A14C"
                                    strokeWidth="3"
                                    strokeDasharray={`${completion}, 100`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gold-700">
                                {completion}%
                            </span>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-500">تکمیل پروفایل</p>
                            <p className="text-sm font-bold text-slate-800">
                                {filled} از {fields.length} فیلد
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}