// components/admin/EditHallModal.jsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    PiX,
    PiCircleNotch,
    PiBuildings,
    PiMapPin,
    PiUsersThree,
    PiTextAlignLeft,
    PiPhone,
    PiUser,
} from "react-icons/pi";

export default function EditHallModal({
    isOpen,
    onClose,
    onSave,
    hall,
    loading,
}) {
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (hall && isOpen) {
            setForm({
                title: hall.title || "",
                description: hall.description || "",
                province: hall.province || "",
                city: hall.city || "",
                address: hall.address || "",
                capacity: hall.capacity || "",
                phone: hall.phone || "",
            });
            setErrors({});
        }
    }, [hall, isOpen]);

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const e = {};

        if (!form.title?.trim()) {
            e.title = "نام تالار الزامی است";
        }
        if (form.capacity && (isNaN(form.capacity) || Number(form.capacity) < 1)) {
            e.capacity = "ظرفیت باید یک عدد مثبت باشد";
        }
        if (form.phone && !/^0\d{10}$/.test(form.phone)) {
            e.phone = "شماره تلفن معتبر نیست";
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        onSave({
            ...form,
            capacity: form.capacity ? Number(form.capacity) : undefined,
        });
    };

    if (!hall) return null;

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
                                    <PiBuildings className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-base sm:text-lg font-bold text-white">
                                        ویرایش تالار
                                    </h2>
                                    <p className="text-[11.5px] text-white/80 mt-0.5">
                                        {hall.title}
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
                                    label="نام تالار"
                                    name="title"
                                    icon={PiBuildings}
                                    value={form.title}
                                    onChange={changeHandler}
                                    error={errors.title}
                                    required
                                />
                                <Field
                                    label="ظرفیت (نفر)"
                                    name="capacity"
                                    icon={PiUsersThree}
                                    value={form.capacity}
                                    onChange={changeHandler}
                                    error={errors.capacity}
                                    type="number"
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
                                <Field
                                    label="تلفن تالار"
                                    name="phone"
                                    icon={PiPhone}
                                    value={form.phone}
                                    onChange={changeHandler}
                                    error={errors.phone}
                                    dir="ltr"
                                />
                                <Field
                                    label="آدرس"
                                    name="address"
                                    icon={PiMapPin}
                                    value={form.address}
                                    onChange={changeHandler}
                                />

                                {/* توضیحات */}
                                <div className="sm:col-span-2">
                                    <label className="block text-[12.5px] font-medium text-slate-700 mb-1.5">
                                        توضیحات
                                    </label>
                                    <div className="relative">
                                        <PiTextAlignLeft className="absolute right-3.5 top-3 w-4 h-4 text-gold-500 pointer-events-none" />
                                        <textarea
                                            name="description"
                                            value={form.description}
                                            onChange={changeHandler}
                                            rows={4}
                                            className="
                                                w-full pr-10 pl-3.5 py-2.5
                                                bg-white border border-slate-200 rounded-xl
                                                text-[13px] text-slate-900
                                                resize-none
                                                hover:border-gold-300
                                                focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10
                                                transition-all
                                            "
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* اطلاعات مالک (فقط نمایش) */}
                            {hall.hall_owner_id && (
                                <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <p className="text-[11.5px] font-bold text-slate-600 mb-2 flex items-center gap-1.5">
                                        <PiUser className="w-3.5 h-3.5" />
                                        مالک تالار
                                    </p>
                                    <div className="grid grid-cols-2 gap-3 text-[12.5px]">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500">
                                                نام
                                            </span>
                                            <span className="text-slate-800 font-medium truncate">
                                                {hall.hall_owner_id.full_name ||
                                                    "—"}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500">
                                                تلفن
                                            </span>
                                            <span
                                                className="text-slate-800 font-medium"
                                                dir="ltr"
                                            >
                                                {hall.hall_owner_id.phone ||
                                                    "—"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
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
   Field — کامپوننت داخلی
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