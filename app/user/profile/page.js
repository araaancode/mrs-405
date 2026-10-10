"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

import {
    PiUser,
    PiIdentificationCard,
    PiBriefcase,
    PiMapPin,
    PiFolderOpen,
    PiFloppyDisk,
    PiArrowCounterClockwise,
    PiCheck,
    PiCircleNotch,
    PiCamera,
} from "react-icons/pi";

import { InputField, SelectField } from "@/components/ui/FormField";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { BirthDatePicker } from "@/components/ui/BirthDatePicker";
import { DocumentUploader } from "@/components/ui/DocumentUploader";
import { ProfileHeader } from "@/components/ui/ProfileHeader";
import { ProvinceCitySelector } from "@/components/ui/ProvinceCitySelector";
import { AvatarUploader } from "@/components/ui/AvatarUploader";
import { notify } from "@/lib/toast";

/* ============================================================
   Whitelist — فیلدهایی که به API فرستاده می‌شوند
   (آواتار جداگانه آپلود می‌شود)
   ============================================================ */
const EDITABLE_FIELDS = [
    "full_name",
    "username",
    "email",
    "phone",
    "national_code",
    "birth_certificate",
    "birth_date",
    "gender",
    "province",
    "city",
    "business_name",
    "license_number",
    "documents",
];

/* ============================================================
   FormSection
   ============================================================ */
function FormSection({ icon, title, description, children, badge, index = 0 }) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            className="relative py-7 sm:py-8 border-b border-slate-100 last:border-b-0"
        >
            <SectionTitle
                icon={icon}
                title={title}
                description={description}
                badge={badge}
            />
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {children}
            </div>
        </motion.section>
    );
}

/* ============================================================
   Skeleton
   ============================================================ */
function ProfileSkeleton() {
    return (
        <div className="space-y-5 animate-pulse">
            <div className="h-32 bg-slate-100 rounded-3xl" />
            <div className="bg-white rounded-2xl ring-1 ring-slate-100 p-6 sm:p-8 space-y-6">
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className="space-y-4 pb-6 border-b border-slate-100 last:border-0 last:pb-0"
                    >
                        <div className="h-6 w-40 bg-slate-100 rounded-lg" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="h-14 bg-slate-100 rounded-xl" />
                            <div className="h-14 bg-slate-100 rounded-xl" />
                            <div className="h-14 bg-slate-100 rounded-xl" />
                            <div className="h-14 bg-slate-100 rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ============================================================
   Main
   ============================================================ */
export default function UserProfilePage() {
    const { data: session, status } = useSession();
    const [form, setForm] = useState({});
    const [originalForm, setOriginalForm] = useState({});
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [dateValue, setDateValue] = useState(null);

    /* ============================================================
       بارگذاری اطلاعات
       ============================================================ */
    useEffect(() => {
        if (!session?.user) return;

        let cancelled = false;

        axios
            .get("/api/user/profile")
            .then((res) => {
                if (cancelled) return;
                const userData = res.data?.user || res.data || {};
                setForm(userData);
                setOriginalForm(userData);

                if (userData.birth_date) {
                    const [y, m, d] = userData.birth_date
                        .split("T")[0]
                        .split("-")
                        .map(Number);
                    setDateValue(new Date(y, m - 1, d));
                }
            })
            .catch((err) => {
                if (cancelled) return;
                if (err.response?.status === 401) {
                    notify.error("لطفاً دوباره وارد شوید");
                } else {
                    notify.error("خطا در دریافت اطلاعات پروفایل");
                }
                setForm(session.user);
            })
            .finally(() => {
                if (!cancelled) setInitialLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [session]);

    /* ============================================================
       تشخیص تغییرات — آواتار نادیده گرفته می‌شود
       ============================================================ */
    const isDirty = useMemo(() => {
        const { avatar: _a, ...rest } = form || {};
        const { avatar: _b, ...origRest } = originalForm || {};
        return JSON.stringify(rest) !== JSON.stringify(origRest);
    }, [form, originalForm]);

    /* ============================================================
       تغییرات فرم
       ============================================================ */
    const changeHandler = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        const nextValue = type === "checkbox" ? checked : value;
        setForm((prev) => ({ ...prev, [name]: nextValue }));
        setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
    }, []);

    const handleDateChange = useCallback((date) => {
        if (!date) {
            setForm((p) => ({ ...p, birth_date: "" }));
            setDateValue(null);
            return;
        }

        const gregorianDate = date.toDate();
        const today = new Date();
        let age = today.getFullYear() - gregorianDate.getFullYear();
        const m = today.getMonth() - gregorianDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < gregorianDate.getDate())) {
            age--;
        }

        if (age < 18) {
            notify.error("سن باید حداقل ۱۸ سال باشد");
            return;
        }
        if (age > 100) {
            notify.error("سن نمی‌تواند بیشتر از ۱۰۰ سال باشد");
            return;
        }

        const y = gregorianDate.getFullYear();
        const mm = String(gregorianDate.getMonth() + 1).padStart(2, "0");
        const dd = String(gregorianDate.getDate()).padStart(2, "0");

        setForm((p) => ({ ...p, birth_date: `${y}-${mm}-${dd}` }));
        setDateValue(date);
    }, []);

    /* ============================================================
       Validation
       ============================================================ */
    const validate = useCallback(() => {
        const e = {};

        if (!form.full_name?.trim()) {
            e.full_name = "نام و نام خانوادگی الزامی است";
        }
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            e.email = "ایمیل معتبر نیست";
        }
        if (form.phone && !/^09\d{9}$/.test(form.phone)) {
            e.phone = "شماره همراه معتبر نیست";
        }
        if (form.national_code && !/^\d{10}$/.test(form.national_code)) {
            e.national_code = "کد ملی باید ۱۰ رقم باشد";
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    }, [form]);

    /* ============================================================
       Submit
       ============================================================ */
    const submitHandler = useCallback(
        async (ev) => {
            ev.preventDefault();
            if (!validate()) {
                notify.error("خطا در فرم");
                return;
            }

            setLoading(true);
            const toastId = notify.loading("در حال ذخیره تغییرات...");

            try {
                const payload = {};
                for (const key of EDITABLE_FIELDS) {
                    if (form[key] !== undefined) payload[key] = form[key];
                }

                const { data } = await axios.put(
                    "/api/user/profile",
                    payload
                );

                const merged = { ...form, ...(data?.user || {}) };
                setForm(merged);
                setOriginalForm(merged);

                notify.update(toastId, {
                    message: "پروفایل با موفقیت به‌روزرسانی شد",
                    type: "success",
                    duration: 10000,
                });
            } catch (error) {
                const fieldErrors = error.response?.data?.errors;
                if (fieldErrors && typeof fieldErrors === "object") {
                    setErrors((prev) => ({ ...prev, ...fieldErrors }));
                }
                notify.update(toastId, {
                    message:
                        error.response?.data?.message ||
                        "خطا در ارتباط با سرور",
                    type: "error",
                    duration: 15000,
                });
            } finally {
                setLoading(false);
            }
        },
        [form, validate]
    );

    const handleCancel = useCallback(() => {
        setForm(originalForm);
        setErrors({});

        if (originalForm.birth_date) {
            const [y, m, d] = originalForm.birth_date
                .split("T")[0]
                .split("-")
                .map(Number);
            setDateValue(new Date(y, m - 1, d));
        } else {
            setDateValue(null);
        }

        notify.info("تغییرات لغو شد");
    }, [originalForm]);

    /* ============================================================
       آپلود آواتار — همگام‌سازی form و originalForm
       ============================================================ */
    const handleAvatarUploaded = useCallback((url) => {
        setForm((p) => ({ ...p, avatar: url }));
        setOriginalForm((p) => ({ ...p, avatar: url }));
    }, []);

    /* ============================================================
       Loading / Unauthenticated
       ============================================================ */
    if (status === "loading" || initialLoading) {
        return (
            <div dir="rtl" className="w-full">
                <ProfileSkeleton />
            </div>
        );
    }

    if (!session) {
        return (
            <div dir="rtl" className="text-center py-16">
                <div className="w-16 h-16 mx-auto bg-gold-50 rounded-2xl ring-1 ring-gold-100 flex items-center justify-center mb-4">
                    <PiUser className="w-8 h-8 text-gold-500" />
                </div>
                <p className="text-slate-700 font-medium">دسترسی محدود</p>
                <p className="text-slate-500 text-sm mt-1">
                    برای مشاهده پروفایل وارد شوید
                </p>
            </div>
        );
    }

    /* ============================================================
       Render
       ============================================================ */
    return (
        <div dir="rtl" className="w-full">
            {/* ==================== Header ==================== */}
            <ProfileHeader form={form} isDirty={isDirty} />

            <form
                onSubmit={submitHandler}
                className="space-y-0"
                noValidate
            >
                {/* ==================== آواتار ==================== */}
                <FormSection
                    index={0}
                    icon={<PiCamera className="w-5 h-5" />}
                    title="تصویر پروفایل"
                    description="یک تصویر برای شناسایی بهتر انتخاب کنید"
                >
                    <div className="sm:col-span-2 flex justify-center py-2">
                        <AvatarUploader
                            currentAvatar={form.avatar || null}
                            name={form.full_name || form.username || ""}
                            onUploaded={handleAvatarUploaded}
                        />
                    </div>
                </FormSection>

                {/* ==================== اطلاعات اصلی ==================== */}
                <FormSection
                    index={1}
                    icon={<PiUser className="w-5 h-5" />}
                    title="اطلاعات اصلی"
                    description="نام، ایمیل و راه‌های ارتباطی"
                >
                    <InputField
                        label="نام و نام خانوادگی"
                        name="full_name"
                        required
                        placeholder="مثلاً: علی محمدی"
                        value={form.full_name || ""}
                        onChange={changeHandler}
                        error={errors.full_name}
                    />
                    <InputField
                        label="نام کاربری"
                        name="username"
                        placeholder="username"
                        value={form.username || ""}
                        onChange={changeHandler}
                        dir="ltr"
                        className="text-left"
                        error={errors.username}
                    />
                    <InputField
                        label="ایمیل"
                        name="email"
                        type="email"
                        dir="ltr"
                        className="text-left"
                        placeholder="example@domain.com"
                        value={form.email || ""}
                        onChange={changeHandler}
                        error={errors.email}
                    />
                    <InputField
                        label="شماره همراه"
                        name="phone"
                        dir="ltr"
                        className="text-left"
                        placeholder="09xxxxxxxxx"
                        value={form.phone || ""}
                        onChange={changeHandler}
                        error={errors.phone}
                    />
                </FormSection>

                {/* ==================== اطلاعات هویتی ==================== */}
                <FormSection
                    index={2}
                    icon={<PiIdentificationCard className="w-5 h-5" />}
                    title="اطلاعات هویتی"
                    description="کد ملی، شناسنامه و تاریخ تولد"
                >
                    <InputField
                        label="کد ملی"
                        name="national_code"
                        dir="ltr"
                        className="text-left"
                        placeholder="۱۰ رقمی"
                        maxLength={10}
                        inputMode="numeric"
                        value={form.national_code || ""}
                        onChange={changeHandler}
                        error={errors.national_code}
                    />
                    <InputField
                        label="شماره شناسنامه"
                        name="birth_certificate"
                        dir="ltr"
                        className="text-left"
                        value={form.birth_certificate || ""}
                        onChange={changeHandler}
                    />
                    <BirthDatePicker
                        value={dateValue}
                        onChange={handleDateChange}
                        error={errors.birth_date}
                    />
                    <SelectField
                        label="جنسیت"
                        name="gender"
                        value={form.gender || ""}
                        onChange={changeHandler}
                    >
                        <option value="">انتخاب کنید</option>
                        <option value="male">مرد</option>
                        <option value="female">زن</option>
                        <option value="other">سایر</option>
                    </SelectField>
                </FormSection>

                {/* ==================== اطلاعات فعالیت ==================== */}
                <FormSection
                    index={3}
                    icon={<PiBriefcase className="w-5 h-5" />}
                    title="اطلاعات فعالیت"
                    description="اطلاعات کسب‌وکار و مجوزها"
                >
                    <InputField
                        label="نام کسب‌وکار"
                        name="business_name"
                        placeholder="اختیاری"
                        value={form.business_name || ""}
                        onChange={changeHandler}
                    />
                    <InputField
                        label="شماره مجوز"
                        name="license_number"
                        placeholder="اختیاری"
                        value={form.license_number || ""}
                        onChange={changeHandler}
                    />
                </FormSection>

                {/* ==================== موقعیت جغرافیایی ==================== */}
                <FormSection
                    index={4}
                    icon={<PiMapPin className="w-5 h-5" />}
                    title="موقعیت جغرافیایی"
                    description="استان و شهر محل سکونت خود را انتخاب کنید"
                >
                    <ProvinceCitySelector
                        form={form}
                        onChange={changeHandler}
                        errors={errors}
                    />
                </FormSection>

                {/* ==================== مدارک ==================== */}
                <motion.section
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 5 * 0.06 }}
                    className="py-7 sm:py-8"
                >
                    <SectionTitle
                        icon={<PiFolderOpen className="w-5 h-5" />}
                        title="مدارک و اسناد"
                        description="کارت ملی، شناسنامه، مجوز کسب‌وکار و..."
                        badge="Upload"
                    />
                    <div className="mt-6">
                        <DocumentUploader
                            documents={form.documents || []}
                            onChange={(docs) =>
                                setForm((p) => ({ ...p, documents: docs }))
                            }
                            maxFiles={5}
                            maxSizeMB={5}
                            uploadType="documents"
                        />
                    </div>
                </motion.section>

                {/* ==================== Action Bar ==================== */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 6 * 0.06 }}
                    className="relative pt-6 mt-2 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3"
                >
                    <p className="text-xs text-center sm:text-right">
                        <AnimatePresence mode="wait">
                            {isDirty ? (
                                <motion.span
                                    key="dirty"
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    className="text-gold-700 font-medium inline-flex items-center gap-1.5"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                                    تغییرات ذخیره نشده دارید
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="clean"
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    className="text-emerald-600 inline-flex items-center gap-1.5"
                                >
                                    <PiCheck
                                        className="w-3.5 h-3.5"
                                        strokeWidth={3}
                                    />
                                    همه تغییرات ذخیره شده است
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </p>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={!isDirty || loading}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-gold-50 hover:border-gold-300 hover:text-gold-700 focus:outline-none focus:ring-4 focus:ring-gold-500/15 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all duration-200"
                        >
                            <PiArrowCounterClockwise className="w-4 h-4" />
                            انصراف
                        </button>

                        <button
                            type="submit"
                            disabled={loading || !isDirty}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-b from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 shadow-md shadow-gold-500/25 hover:shadow-lg hover:shadow-gold-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-gold-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 active:scale-95 transition-all duration-300 min-w-[140px]"
                        >
                            {loading ? (
                                <>
                                    <PiCircleNotch className="w-4 h-4 animate-spin" />
                                    در حال ذخیره...
                                </>
                            ) : (
                                <>
                                    <PiFloppyDisk className="w-4 h-4" />
                                    ذخیره تغییرات
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </form>
        </div>
    );
}