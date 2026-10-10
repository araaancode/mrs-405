// components/admin/EditUserModal.jsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    PiX,
    PiCircleNotch,
    PiUser,
    PiEnvelopeSimple,
    PiPhone,
    PiIdentificationCard,
    PiMapPin,
    PiCalendarBlank,
} from "react-icons/pi";

const ROLE_OPTIONS = [
    { value: "user", label: "کاربر عادی" },
    { value: "hall_owner", label: "تالاردار" },
    { value: "admin", label: "مدیر" },
];

const GENDER_OPTIONS = [
    { value: "", label: "انتخاب کنید" },
    { value: "male", label: "مرد" },
    { value: "female", label: "زن" },
    { value: "other", label: "سایر" },
];

export default function EditUserModal({
    isOpen,
    onClose,
    onSave,
    user,
    loading,
}) {
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});

    /* ============ مقداردهی اولیه ============ */
    useEffect(() => {
        if (user && isOpen) {
            setForm({
                full_name: user.full_name || "",
                username: user.username || "",
                email: user.email || "",
                phone: user.phone || "",
                national_code: user.national_code || "",
                birth_certificate: user.birth_certificate || "",
                province: user.province || "",
                city: user.city || "",
                gender: user.gender || "",
                role: user.role || "user",
                birth_date: user.birth_date
                    ? new Date(user.birth_date).toISOString().split("T")[0]
                    : "",
            });
            setErrors({});
        }
    }, [user, isOpen]);

    /* ============ تغییر فیلد ============ */
    const changeHandler = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    /* ============ اعتبارسنجی ============ */
    const validate = () => {
        const e = {};

        if (!form.full_name?.trim()) {
            e.full_name = "نام و نام خانوادگی الزامی است";
        }
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            e.email = "ایمیل معتبر نیست";
        }
        if (form.phone && !/^09\d{9}$/.test(form.phone)) {
            e.phone = "شماره همراه باید ۱۱ رقم و با ۰۹ شروع شود";
        }
        if (form.national_code && !/^\d{10}$/.test(form.national_code)) {
            e.national_code = "کد ملی باید ۱۰ رقم باشد";
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    /* ============ ذخیره ============ */
    const handleSave = () => {
        if (!validate()) return;
        onSave(form);
    };

    if (!user) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                        className="
                            relative w-full max-w-2xl max-h-[90vh]
                            bg-white rounded-3xl
                            ring-1 ring-slate-200
                            shadow-2xl shadow-slate-900/20
                            overflow-hidden
                            flex flex-col
                        "
                        dir="rtl"
                    >
                        {/* هدر */}
                        <div className="relative bg-gradient-to-l from-gold-500 to-gold-600 px-6 py-5 flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/20 ring-1 ring-white/30 flex items-center justify-center">
                                    <PiUser className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-base sm:text-lg font-bold text-white">
                                        ویرایش کاربر
                                    </h2>
                                    <p className="text-[11.5px] text-white/80 mt-0.5">
                                        {user.full_name}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                aria-label="بستن"
                                className="
                                    w-9 h-9 rounded-xl
                                    flex items-center justify-center
                                    text-white/80 hover:text-white hover:bg-white/20
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    transition-all
                                "
                            >
                                <PiX className="w-5 h-5" />
                            </button>
                        </div>

                        {/* بدنه */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field
                                    label="نام و نام خانوادگی"
                                    name="full_name"
                                    icon={PiUser}
                                    value={form.full_name}
                                    onChange={changeHandler}
                                    error={errors.full_name}
                                    required
                                />
                                <Field
                                    label="نام کاربری"
                                    name="username"
                                    value={form.username}
                                    onChange={changeHandler}
                                    dir="ltr"
                                />
                                <Field
                                    label="ایمیل"
                                    name="email"
                                    type="email"
                                    icon={PiEnvelopeSimple}
                                    value={form.email}
                                    onChange={changeHandler}
                                    error={errors.email}
                                    dir="ltr"
                                />
                                <Field
                                    label="شماره همراه"
                                    name="phone"
                                    icon={PiPhone}
                                    value={form.phone}
                                    onChange={changeHandler}
                                    error={errors.phone}
                                    dir="ltr"
                                />
                                <Field
                                    label="کد ملی"
                                    name="national_code"
                                    icon={PiIdentificationCard}
                                    value={form.national_code}
                                    onChange={changeHandler}
                                    error={errors.national_code}
                                    dir="ltr"
                                    maxLength={10}
                                />
                                <Field
                                    label="شماره شناسنامه"
                                    name="birth_certificate"
                                    value={form.birth_certificate}
                                    onChange={changeHandler}
                                    dir="ltr"
                                />
                                <Field
                                    label="استان"
                                    name="province"
                                    icon={PiMapPin}
                                    value={form.province}
                                    onChange={changeHandler}
                                />
                                <Field
                                    label="شهر"
                                    name="city"
                                    icon={PiMapPin}
                                    value={form.city}
                                    onChange={changeHandler}
                                />

                                {/* تاریخ تولد */}
                                <div>
                                    <label className="block text-[12.5px] font-medium text-slate-700 mb-1.5">
                                        تاریخ تولد
                                    </label>
                                    <div className="relative">
                                        <PiCalendarBlank className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500 pointer-events-none" />
                                        <input
                                            type="date"
                                            name="birth_date"
                                            value={form.birth_date}
                                            onChange={changeHandler}
                                            className="
                                                w-full pr-10 pl-3.5 py-2.5
                                                bg-white border border-slate-200 rounded-xl
                                                text-[13px] text-slate-900
                                                hover:border-gold-300
                                                focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10
                                                transition-all
                                            "
                                        />
                                    </div>
                                </div>

                                {/* جنسیت */}
                                <div>
                                    <label className="block text-[12.5px] font-medium text-slate-700 mb-1.5">
                                        جنسیت
                                    </label>
                                    <select
                                        name="gender"
                                        value={form.gender}
                                        onChange={changeHandler}
                                        className="
                                            w-full px-3.5 py-2.5
                                            bg-white border border-slate-200 rounded-xl
                                            text-[13px] text-slate-900
                                            cursor-pointer
                                            hover:border-gold-300
                                            focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10
                                            transition-all
                                        "
                                    >
                                        {GENDER_OPTIONS.map((o) => (
                                            <option key={o.value} value={o.value}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* نقش */}
                                <div className="sm:col-span-2">
                                    <label className="block text-[12.5px] font-medium text-slate-700 mb-1.5">
                                        نقش کاربر
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {ROLE_OPTIONS.map((opt) => {
                                            const active = form.role === opt.value;
                                            return (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() =>
                                                        setForm((p) => ({
                                                            ...p,
                                                            role: opt.value,
                                                        }))
                                                    }
                                                    className={`
                                                        px-3 py-2.5 rounded-xl
                                                        text-[12.5px] font-bold
                                                        transition-all
                                                        active:scale-95
                                                        ${
                                                            active
                                                                ? "bg-gradient-to-b from-gold-400 to-gold-600 text-white shadow-md shadow-gold-500/25"
                                                                : "bg-white border border-slate-200 text-slate-600 hover:border-gold-300 hover:text-gold-700 hover:bg-gold-50/40"
                                                        }
                                                    `}
                                                >
                                                    {opt.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* فوتر */}
                        <div className="flex items-center gap-2.5 px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="
                                    flex-1 sm:flex-none sm:w-32
                                    inline-flex items-center justify-center
                                    px-4 py-2.5 rounded-xl
                                    text-[13px] font-medium text-slate-700
                                    bg-white border border-slate-200
                                    hover:bg-slate-50 hover:border-slate-300
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    active:scale-95
                                    transition-all
                                "
                            >
                                انصراف
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={loading}
                                className="
                                    flex-1 sm:flex-none sm:w-40
                                    inline-flex items-center justify-center gap-2
                                    px-4 py-2.5 rounded-xl
                                    text-[13px] font-bold text-white
                                    bg-gradient-to-b from-gold-400 to-gold-600
                                    hover:from-gold-500 hover:to-gold-700
                                    shadow-md shadow-gold-500/25
                                    hover:shadow-lg hover:shadow-gold-500/40
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    active:scale-95
                                    transition-all
                                "
                            >
                                {loading ? (
                                    <>
                                        <PiCircleNotch className="w-4 h-4 animate-spin" />
                                        در حال ذخیره...
                                    </>
                                ) : (
                                    "ذخیره تغییرات"
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ============================================================
   Field — کامپوننت داخلی ورودی
   ============================================================ */
function Field({
    label,
    name,
    icon: Icon,
    type = "text",
    value,
    onChange,
    error,
    dir = "rtl",
    required,
    maxLength,
}) {
    return (
        <div>
            <label className="block text-[12.5px] font-medium text-slate-700 mb-1.5">
                {label}
                {required && <span className="text-rose-500 mr-1">*</span>}
            </label>
            <div className="relative group">
                {Icon && (
                    <Icon className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500 pointer-events-none" />
                )}
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    dir={dir}
                    maxLength={maxLength}
                    className={`
                        w-full ${Icon ? "pr-10" : "pr-3.5"} pl-3.5 py-2.5
                        bg-white border rounded-xl
                        text-[13px] text-slate-900
                        transition-all
                        focus:outline-none focus:ring-4
                        ${
                            error
                                ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                                : "border-slate-200 hover:border-gold-300 focus:border-gold-500 focus:ring-gold-500/10"
                        }
                        ${dir === "ltr" ? "text-left" : "text-right"}
                    `}
                />
            </div>
            {error && (
                <p className="text-[11px] text-rose-600 mt-1.5">{error}</p>
            )}
        </div>
    );
}