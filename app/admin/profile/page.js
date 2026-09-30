// app/admin/profile/page.jsx
"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/teal.css";
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
  PiCalendarBlank,
  PiNote,
} from "react-icons/pi";
import { notify } from "@/lib/toast";

/* ============================================================
   Helpers
   ============================================================ */
function parseDate(value) {
  if (!value) return null;
  try {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

function formatDate(value) {
  const d = parseDate(value);
  return d ? d.toLocaleDateString("fa-IR") : "—";
}

function toGregorian(dateObject) {
  if (!dateObject) return null;
  return dateObject.toDate().toISOString().split("T")[0];
}

/* ============================================================
   FormSection
   ============================================================ */
function FormSection({ icon: Icon, title, description, children, index = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="py-7 sm:py-8 border-b border-slate-100 last:border-b-0"
    >
      <div className="flex items-start gap-3 pb-3 border-b border-slate-100 mb-5">
        <div
          className="
            w-10 h-10 rounded-xl
            bg-gradient-to-br from-gold-400 to-gold-600
            text-white
            flex items-center justify-center flex-shrink-0
            shadow-sm shadow-gold-500/25
          "
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-bold text-slate-900">{title}</h3>
          {description && (
            <p className="text-[12px] text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {children}
      </div>
    </motion.section>
  );
}

/* ============================================================
   InputField
   ============================================================ */
function InputField({
  label,
  name,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  dir = "rtl",
  required,
  inputMode,
  maxLength,
  error,
  hint,
  className = "",
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-rose-500 mr-1">*</span>}
      </label>

      <div className="relative group">
        {Icon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <Icon className="w-4 h-4 text-gold-500 group-focus-within:text-gold-600 transition-colors duration-200" />
          </div>
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          dir={dir}
          required={required}
          inputMode={inputMode}
          maxLength={maxLength}
          className={`
            w-full
            ${Icon ? "pr-10" : "pr-3.5"} pl-3.5
            py-2.5
            bg-white border rounded-xl
            text-[13.5px] text-slate-900
            placeholder:text-slate-400
            transition-all duration-200
            focus:outline-none focus:ring-4
            ${
              error
                ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                : "border-slate-200 hover:border-gold-300 focus:border-gold-500 focus:ring-gold-500/10"
            }
            ${dir === "ltr" ? "text-left" : "text-right"}
            ${className}
          `}
        />
      </div>

      {error ? (
        <p className="text-[11px] text-rose-600 mt-1.5">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-slate-400 mt-1.5">{hint}</p>
      ) : null}
    </div>
  );
}

/* ============================================================
   ProfileHeader — طلایی روشن
   ============================================================ */
function ProfileHeader({ form, isDirty }) {
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
        {/* آواتار طلایی با نشان ADMIN */}
        <div className="relative flex-shrink-0">
          <div
            className="
              relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl
              bg-gradient-to-br from-gold-400 to-gold-600
              ring-4 ring-gold-100/60
              flex items-center justify-center
              text-2xl sm:text-3xl font-bold text-white
              shadow-lg shadow-gold-500/30
            "
          >
            {initials}
          </div>
          <span
            className="
              absolute -bottom-1.5 -left-1.5
              px-2 py-0.5 rounded-full
              bg-white
              text-gold-700 text-[9px] font-black
              shadow-md shadow-gold-500/30
              ring-2 ring-gold-400
            "
          >
            ADMIN
          </span>
        </div>

        {/* اطلاعات */}
        <div className="flex-1 text-center sm:text-right min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
              {form?.full_name || "مدیر بدون نام"}
            </h1>

            {isDirty ? (
              <span className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full bg-gold-50 border border-gold-200 text-gold-700 text-[11px] font-medium self-center sm:self-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                تغییرات ذخیره نشده
              </span>
            ) : (
              <span className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full bg-gold-50 border border-gold-200 text-gold-700 text-[11px] font-medium self-center sm:self-auto">
                <PiCheck className="w-3.5 h-3.5" strokeWidth={3} />
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
          <div className="flex items-center gap-3 bg-gold-50/60 border border-gold-100 rounded-xl px-4 py-3 sm:min-w-[200px]">
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

/* ============================================================
   ProfileSkeleton
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
   Page
   ============================================================ */
export default function AdminProfilePage() {
  const { data: session, status } = useSession();
  const [form, setForm] = useState({});
  const [originalForm, setOriginalForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [birthDate, setBirthDate] = useState(null);

  /* ============================================================
     Load
     ============================================================ */
  useEffect(() => {
    if (!session?.user) return;

    axios
      .get("/api/admin/profile")
      .then((response) => {
        const userData = response.data.user || response.data;
        setForm(userData);
        setOriginalForm(userData);

        if (userData.birth_date) {
          const d = parseDate(userData.birth_date);
          if (d) setBirthDate(d);
        }
      })
      .catch((err) => {
        console.error("خطا در دریافت اطلاعات:", err);
        setForm(session.user);
        notify.error("خطا در دریافت اطلاعات پروفایل");
      })
      .finally(() => setInitialLoading(false));
  }, [session]);

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(originalForm),
    [form, originalForm]
  );

  /* ============================================================
     Handlers
     ============================================================ */
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBirthDateChange = (date) => {
    setBirthDate(date);
    setForm((prev) => ({ ...prev, birth_date: toGregorian(date) }));
  };

  /* ============================================================
     Validate
     ============================================================ */
  const validate = () => {
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
  };

  /* ============================================================
     Submit
     ============================================================ */
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validate()) {
      notify.error("لطفاً خطاهای فرم را برطرف کنید");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("در حال ذخیره تغییرات...");

    try {
      await axios.put("/api/admin/profile", form, {
        headers: { "Content-Type": "application/json" },
      });

      setOriginalForm(form);

      toast.update(toastId, {
        render: "پروفایل با موفقیت بروزرسانی شد",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
    } catch (error) {
      console.error("خطا در بروزرسانی:", error);
      toast.update(toastId, {
        render: error.response?.data?.message || "خطا در ارتباط با سرور",
        type: "error",
        isLoading: false,
        autoClose: 8000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm(originalForm);
    setErrors({});
    if (originalForm.birth_date) {
      const d = parseDate(originalForm.birth_date);
      setBirthDate(d);
    }
    notify.info("تغییرات لغو شد");
  };

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

      <form onSubmit={submitHandler} className="space-y-0">
        {/* ==================== اطلاعات اصلی ==================== */}
        <FormSection
          index={0}
          icon={PiUser}
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
          index={1}
          icon={PiIdentificationCard}
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

          {/* تاریخ تولد */}
          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
              <PiCalendarBlank className="w-3.5 h-3.5 text-gold-500" />
              تاریخ تولد
            </label>
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={birthDate}
              onChange={handleBirthDateChange}
              format="YYYY/MM/DD"
              placeholder="انتخاب تاریخ تولد"
              inputClass="
                w-full px-3.5 py-2.5
                bg-white border border-slate-200 rounded-xl
                text-[13.5px] text-slate-900
                hover:border-gold-300
                focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10
                transition-all duration-200
              "
              containerClassName="w-full"
            />
            {form.birth_date && (
              <p className="text-[11px] text-slate-400 mt-1.5">
                تاریخ:{" "}
                <span className="font-medium text-slate-600">
                  {formatDate(form.birth_date)}
                </span>
              </p>
            )}
          </div>

          {/* جنسیت */}
          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
              جنسیت
            </label>
            <select
              name="gender"
              value={form.gender || ""}
              onChange={changeHandler}
              className="
                w-full px-3.5 py-2.5
                bg-white border border-slate-200 rounded-xl
                text-[13.5px] text-slate-900
                cursor-pointer
                hover:border-gold-300
                focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10
                transition-all duration-200
              "
            >
              <option value="">انتخاب کنید</option>
              <option value="male">مرد</option>
              <option value="female">زن</option>
              <option value="other">سایر</option>
            </select>
          </div>
        </FormSection>

        {/* ==================== اطلاعات فعالیت ==================== */}
        <FormSection
          index={2}
          icon={PiBriefcase}
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
          index={3}
          icon={PiMapPin}
          title="موقعیت جغرافیایی"
          description="استان و شهر محل سکونت"
        >
          <InputField
            label="استان"
            name="province"
            value={form.province || ""}
            onChange={changeHandler}
          />
          <InputField
            label="شهر"
            name="city"
            value={form.city || ""}
            onChange={changeHandler}
          />
        </FormSection>

        {/* ==================== مدارک ==================== */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 4 * 0.06 }}
          className="py-7 sm:py-8"
        >
          <div className="flex items-start gap-3 pb-3 border-b border-slate-100 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-gold-500/25">
              <PiFolderOpen className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-bold text-slate-900">
                مدارک و اسناد
              </h3>
              <p className="text-[12px] text-slate-500 mt-0.5">
                هر خط یک لینک جداگانه وارد کنید
              </p>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
              <PiNote className="w-3.5 h-3.5 text-gold-500" />
              لینک مدارک
            </label>
            <textarea
              name="documents"
              value={form.documents?.join("\n") || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  documents: e.target.value.split("\n"),
                }))
              }
              dir="ltr"
              rows={4}
              placeholder={"https://example.com/doc1.pdf\nhttps://example.com/doc2.jpg"}
              className="
                w-full px-3.5 py-3
                bg-white border border-slate-200 rounded-xl
                text-[13.5px] text-slate-900 text-left
                placeholder:text-slate-400
                resize-none
                hover:border-gold-300
                focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10
                transition-all duration-200
              "
            />
          </div>
        </motion.section>

        {/* ==================== Action Bar ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 5 * 0.06 }}
          className="
            relative pt-6 mt-2
            border-t border-slate-100
            flex flex-col-reverse sm:flex-row
            items-stretch sm:items-center
            justify-between gap-3
          "
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
                  className="text-gold-700 inline-flex items-center gap-1.5"
                >
                  <PiCheck className="w-3.5 h-3.5" strokeWidth={3} />
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
              className="
                flex-1 sm:flex-none
                inline-flex items-center justify-center gap-2
                px-5 py-2.5 rounded-xl
                text-sm font-medium text-slate-700
                bg-white border border-slate-200
                hover:bg-gold-50 hover:border-gold-300 hover:text-gold-700
                focus:outline-none focus:ring-4 focus:ring-gold-500/15
                disabled:opacity-50 disabled:cursor-not-allowed
                active:scale-95
                transition-all duration-200
              "
            >
              <PiArrowCounterClockwise className="w-4 h-4" />
              انصراف
            </button>

            <button
              type="submit"
              disabled={loading || !isDirty}
              className="
                flex-1 sm:flex-none
                inline-flex items-center justify-center gap-2
                px-6 py-2.5 rounded-xl
                text-sm font-bold text-white
                bg-gradient-to-b from-gold-400 to-gold-600
                hover:from-gold-500 hover:to-gold-700
                shadow-md shadow-gold-500/25
                hover:shadow-lg hover:shadow-gold-500/40
                hover:-translate-y-0.5
                focus:outline-none focus:ring-4 focus:ring-gold-500/25
                disabled:opacity-50 disabled:cursor-not-allowed
                disabled:hover:translate-y-0
                active:scale-95
                transition-all duration-300
                min-w-[140px]
              "
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