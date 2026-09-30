"use client";

import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/teal.css";
import { toast } from "react-toastify";
import {
  PiBuildings,
  PiUser,
  PiWrench,
  PiCurrencyCircleDollar,
  PiShieldCheck,
  PiCalendarBlank,
  PiImage,
  PiFilePdf,
  PiPlusCircle,
  PiX,
  PiFloppyDisk,
  PiSpinnerGap,
  PiMapPin,
  PiPhone,
  PiEnvelopeSimple,
  PiRuler,
  PiUsersThree,
  PiCarProfile,
  PiNote,
  PiPercent,
} from "react-icons/pi";
import { notify } from "@/lib/toast";

/* ============================================================
   Static Data
   ============================================================ */
const EVENT_TYPES = [
  "تولد",
  "عروسی",
  "عزاداری",
  "تجلیل",
  "همایش",
  "جشن",
  "دیگر",
];

const HALL_TYPES = [
  "سربسته",
  "روباز",
  "باغ",
  "تراس",
  "سالن سرپوشیده",
  "دیگر",
];

const HOST_TYPES = [
  "فول",
  "نوشیدنی",
  "شام",
  "ناهار",
  "صبحانه",
  "بدون پذیرایی",
  "دیگر",
];

/* ============================================================
   Helpers
   ============================================================ */
const toArray = (str) => {
  if (!str) return [];
  return str
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

const toNumber = (value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  const n = Number(value);
  return isNaN(n) ? undefined : n;
};

const convertToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

const convertToGregorian = (dateObject) => {
  if (!dateObject) return null;
  return dateObject.toDate().toISOString().split("T")[0];
};

/* ============================================================
   FormSection
   ============================================================ */
function FormSection({ icon: Icon, title, description, children, index = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="
        py-6 sm:py-7
        border-b border-slate-100 last:border-b-0
      "
    >
      <div className="flex items-start gap-3 pb-3 border-b border-slate-100 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-50 to-gold-100/60 text-gold-600 flex items-center justify-center flex-shrink-0 ring-1 ring-gold-200/60">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-bold text-slate-900">{title}</h3>
          {description && (
            <p className="text-[12px] text-slate-500 mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      {children}
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
  step,
  error,
  hint,
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
            <Icon className="w-4 h-4 text-gold-500 group-focus-within:text-gold-600 transition-colors" />
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
          step={step}
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
   SelectField
   ============================================================ */
function SelectField({
  label,
  name,
  icon: Icon,
  value,
  onChange,
  options,
  placeholder = "انتخاب کنید",
  required,
  error,
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
            <Icon className="w-4 h-4 text-gold-500 group-focus-within:text-gold-600 transition-colors" />
          </div>
        )}
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`
            w-full
            ${Icon ? "pr-10" : "pr-3.5"} pl-3.5
            py-2.5
            bg-white border rounded-xl
            text-[13.5px] text-slate-900
            cursor-pointer
            transition-all duration-200
            focus:outline-none focus:ring-4
            ${
              error
                ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                : "border-slate-200 hover:border-gold-300 focus:border-gold-500 focus:ring-gold-500/10"
            }
          `}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-[11px] text-rose-600 mt-1.5">{error}</p>}
    </div>
  );
}

/* ============================================================
   TextareaField
   ============================================================ */
function TextareaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  error,
  hint,
  rows = 4,
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-rose-500 mr-1">*</span>}
      </label>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`
          w-full px-3.5 py-3
          bg-white border rounded-xl
          text-[13.5px] text-slate-900
          placeholder:text-slate-400
          resize-none
          transition-all duration-200
          focus:outline-none focus:ring-4
          ${
            error
              ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
              : "border-slate-200 hover:border-gold-300 focus:border-gold-500 focus:ring-gold-500/10"
          }
        `}
      />

      {error ? (
        <p className="text-[11px] text-rose-600 mt-1.5">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-slate-400 mt-1.5">{hint}</p>
      ) : null}
    </div>
  );
}

/* ============================================================
   UploadBox
   ============================================================ */
function UploadBox({
  id,
  accept,
  multiple = true,
  onChange,
  title,
  hint,
  icon: Icon,
}) {
  return (
    <div className="relative group rounded-2xl border-2 border-dashed border-slate-200 hover:border-gold-400 bg-slate-50/50 hover:bg-gold-50/40 transition-all duration-300 overflow-hidden">
      <input
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <label
        htmlFor={id}
        className="flex flex-col items-center justify-center gap-2 py-8 sm:py-10 px-4 cursor-pointer"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-50 to-gold-100/60 text-gold-600 flex items-center justify-center ring-1 ring-gold-200/60 group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6" />
        </div>
        <p className="text-[13.5px] font-bold text-slate-800">{title}</p>
        <p className="text-[11px] text-slate-400">{hint}</p>
      </label>
    </div>
  );
}

/* ============================================================
   Page
   ============================================================ */
export default function CreateHallPage() {
  const [form, setForm] = useState({
    title: "",
    province: "",
    city: "",
    address: "",
    lat: "",
    lng: "",
    postal_code: "",
    hall_phone: "",
    hall_owner_name: "",
    hall_owner_phone: "",
    hall_measure: "",
    description: "",
    year: "",
    hall_roles: "",
    capacity: "",
    duration: "",
    entrance_rolls: "",
    hall_type: "",
    host_type: "",
    event_type: "",
    properties: "",
    parking_count: "",
    roof_count: "",
    has_sans: false,
    sans_price: "",
    sans_discount: "",
    licensee_number: "",
    cancel_rolls: "",
    camera_capacities: "",
    reservation_rolls: "",
  });

  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ============================================================
     Handlers
     ============================================================ */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImages = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const toastId = toast.loading(`در حال بارگذاری ${files.length} تصویر...`);
    try {
      const base64 = await Promise.all(files.map(convertToBase64));
      setImages(base64);
      toast.update(toastId, {
        render: `${files.length} تصویر با موفقیت بارگذاری شد`,
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
    } catch {
      toast.update(toastId, {
        render: "خطا در بارگذاری تصاویر",
        type: "error",
        isLoading: false,
        autoClose: 8000,
      });
    }
  };

  const handleDocs = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const toastId = toast.loading(`در حال بارگذاری ${files.length} مدرک...`);
    try {
      const base64 = await Promise.all(files.map(convertToBase64));
      setDocuments(base64);
      toast.update(toastId, {
        render: `${files.length} مدرک با موفقیت بارگذاری شد`,
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
    } catch {
      toast.update(toastId, {
        render: "خطا در بارگذاری مدارک",
        type: "error",
        isLoading: false,
        autoClose: 8000,
      });
    }
  };

  const addDate = (dateObject) => {
    if (!dateObject) return;
    const gregorianDate = convertToGregorian(dateObject);

    if (selectedDates.includes(gregorianDate)) {
      notify.warning("این تاریخ قبلاً اضافه شده است");
      return;
    }
    setSelectedDates([...selectedDates, gregorianDate]);
    notify.success("تاریخ اضافه شد");
  };

  const removeDate = (date) => {
    setSelectedDates(selectedDates.filter((d) => d !== date));
    notify.info("تاریخ حذف شد");
  };

  /* ============================================================
     Validate
     ============================================================ */
  const validateForm = () => {
    if (!form.description || form.description.trim().length < 20) {
      notify.error("توضیحات باید حداقل ۲۰ کاراکتر باشد");
      return false;
    }
    if (images.length === 0) {
      notify.error("حداقل یک تصویر انتخاب کنید");
      return false;
    }
    const lat = parseFloat(form.lat);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      notify.error("Latitude باید بین -90 و 90 باشد");
      return false;
    }
    const lng = parseFloat(form.lng);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      notify.error("Longitude باید بین -180 و 180 باشد");
      return false;
    }
    return true;
  };

  /* ============================================================
     Submit
     ============================================================ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const toastId = toast.loading("در حال ثبت تالار...");

    try {
      const payload = {
        ...form,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
        hall_measure: toNumber(form.hall_measure),
        capacity: toNumber(form.capacity),
        duration: toNumber(form.duration),
        year: toNumber(form.year),
        parking_count: toNumber(form.parking_count),
        roof_count: toNumber(form.roof_count),
        sans_price: toNumber(form.sans_price),
        sans_discount: toNumber(form.sans_discount),
        images,
        hall_document: documents,
        free_dates: selectedDates,
        properties: toArray(form.properties),
        hall_roles: toArray(form.hall_roles),
        entrance_rolls: toArray(form.entrance_rolls),
        cancel_rolls: toArray(form.cancel_rolls),
        camera_capacities: toArray(form.camera_capacities),
        reservation_rolls: toArray(form.reservation_rolls),
      };

      const { data } = await axios.post("/api/hall_owner/halls", payload);

      if (data.success) {
        toast.update(toastId, {
          render: "تالار با موفقیت ثبت شد!",
          type: "success",
          isLoading: false,
          autoClose: 8000,
        });

        /* reset */
        setForm({
          title: "",
          province: "",
          city: "",
          address: "",
          lat: "",
          lng: "",
          postal_code: "",
          hall_phone: "",
          hall_owner_name: "",
          hall_owner_phone: "",
          hall_measure: "",
          description: "",
          year: "",
          hall_roles: "",
          capacity: "",
          duration: "",
          entrance_rolls: "",
          hall_type: "",
          host_type: "",
          event_type: "",
          properties: "",
          parking_count: "",
          roof_count: "",
          has_sans: false,
          sans_price: "",
          sans_discount: "",
          licensee_number: "",
          cancel_rolls: "",
          camera_capacities: "",
          reservation_rolls: "",
        });
        setImages([]);
        setDocuments([]);
        setSelectedDates([]);
      }
    } catch (error) {
      console.error(error);
      toast.update(toastId, {
        render:
          error.response?.data?.message ||
          "خطا در ثبت تالار. لطفاً مجدداً تلاش کنید.",
        type: "error",
        isLoading: false,
        autoClose: 10000,
      });
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     Render
     ============================================================ */
  return (
    <div dir="rtl" className="w-full">
      {/* ==================== Header ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-6"
      >
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/25 flex-shrink-0">
            <PiBuildings className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              ایجاد تالار جدید
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              اطلاعات کامل تالار خود را وارد کنید
            </p>
          </div>
        </div>
      </motion.div>

      {/* ==================== Form ==================== */}
      <form
        onSubmit={handleSubmit}
        className="
          bg-white rounded-2xl
          ring-1 ring-slate-100
          shadow-[0_1px_2px_rgba(15,23,42,0.04)]
          p-5 sm:p-7
        "
      >
        {/* ============ اطلاعات اصلی ============ */}
        <FormSection
          index={0}
          icon={PiBuildings}
          title="اطلاعات اصلی تالار"
          description="نام، موقعیت و اطلاعات تماس"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="نام تالار"
              name="title"
              icon={PiBuildings}
              value={form.title}
              onChange={handleChange}
              placeholder="مثلاً: تالار گلستان"
              required
            />
            <InputField
              label="تلفن تالار"
              name="hall_phone"
              icon={PiPhone}
              type="tel"
              value={form.hall_phone}
              onChange={handleChange}
              placeholder="021xxxxxxxx"
              dir="ltr"
              required
            />
            <InputField
              label="استان"
              name="province"
              icon={PiMapPin}
              value={form.province}
              onChange={handleChange}
              placeholder="تهران"
              required
            />
            <InputField
              label="شهر"
              name="city"
              icon={PiMapPin}
              value={form.city}
              onChange={handleChange}
              placeholder="تهران"
              required
            />
            <div className="sm:col-span-2">
              <InputField
                label="آدرس کامل"
                name="address"
                icon={PiMapPin}
                value={form.address}
                onChange={handleChange}
                placeholder="خیابان، کوچه، پلاک"
                required
              />
            </div>
            <InputField
              label="Latitude (عرض)"
              name="lat"
              type="number"
              step="0.000001"
              value={form.lat}
              onChange={handleChange}
              placeholder="35.6892"
              dir="ltr"
              inputMode="decimal"
              required
            />
            <InputField
              label="Longitude (طول)"
              name="lng"
              type="number"
              step="0.000001"
              value={form.lng}
              onChange={handleChange}
              placeholder="51.3890"
              dir="ltr"
              inputMode="decimal"
              required
            />
            <InputField
              label="کد پستی"
              name="postal_code"
              icon={PiEnvelopeSimple}
              value={form.postal_code}
              onChange={handleChange}
              placeholder="۱۰ رقمی"
              dir="ltr"
            />
          </div>
        </FormSection>

        {/* ============ اطلاعات مالک ============ */}
        <FormSection
          index={1}
          icon={PiUser}
          title="اطلاعات مالک"
          description="نام و شماره تماس مدیر تالار"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="نام مالک"
              name="hall_owner_name"
              icon={PiUser}
              value={form.hall_owner_name}
              onChange={handleChange}
              placeholder="مثلاً: علی محمدی"
              required
            />
            <InputField
              label="شماره تماس مالک"
              name="hall_owner_phone"
              icon={PiPhone}
              type="tel"
              value={form.hall_owner_phone}
              onChange={handleChange}
              placeholder="09xxxxxxxxx"
              dir="ltr"
              required
            />
          </div>
        </FormSection>

        {/* ============ مشخصات فنی ============ */}
        <FormSection
          index={2}
          icon={PiWrench}
          title="مشخصات فنی تالار"
          description="متراژ، ظرفیت و امکانات"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="متراژ تالار (متر مربع)"
              name="hall_measure"
              icon={PiRuler}
              type="number"
              value={form.hall_measure}
              onChange={handleChange}
              placeholder="مثلاً: 800"
              dir="ltr"
              required
            />
            <InputField
              label="ظرفیت (نفر)"
              name="capacity"
              icon={PiUsersThree}
              type="number"
              value={form.capacity}
              onChange={handleChange}
              placeholder="مثلاً: 500"
              dir="ltr"
              required
            />
            <InputField
              label="مدت سانس (ساعت)"
              name="duration"
              type="number"
              value={form.duration}
              onChange={handleChange}
              placeholder="مثلاً: 4"
              dir="ltr"
              required
            />
            <InputField
              label="سال ساخت"
              name="year"
              type="number"
              value={form.year}
              onChange={handleChange}
              placeholder="مثلاً: 1395"
              dir="ltr"
              required
            />
            <InputField
              label="تعداد پارکینگ"
              name="parking_count"
              icon={PiCarProfile}
              type="number"
              value={form.parking_count}
              onChange={handleChange}
              placeholder="مثلاً: 50"
              dir="ltr"
              required
            />
            <InputField
              label="تعداد طبقات"
              name="roof_count"
              type="number"
              value={form.roof_count}
              onChange={handleChange}
              placeholder="مثلاً: 2"
              dir="ltr"
              required
            />
            <SelectField
              label="نوع تالار"
              name="hall_type"
              value={form.hall_type}
              onChange={handleChange}
              options={HALL_TYPES}
              placeholder="انتخاب نوع"
              required
            />
            <SelectField
              label="نوع میزبانی"
              name="host_type"
              value={form.host_type}
              onChange={handleChange}
              options={HOST_TYPES}
              placeholder="انتخاب میزبانی"
              required
            />
            <SelectField
              label="نوع مراسم"
              name="event_type"
              value={form.event_type}
              onChange={handleChange}
              options={EVENT_TYPES}
              placeholder="انتخاب مراسم"
              required
            />
          </div>

          <div className="mt-4 space-y-4">
            <TextareaField
              label="توضیحات کامل تالار"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="توضیحات دقیق در مورد تالار، امکانات، سرویس‌ها و..."
              required
              rows={5}
              hint="حداقل ۲۰ کاراکتر"
              error={
                form.description && form.description.length < 20
                  ? "توضیحات باید حداقل ۲۰ کاراکتر باشد"
                  : undefined
              }
            />

            <InputField
              label="قوانین تالار"
              name="hall_roles"
              icon={PiNote}
              value={form.hall_roles}
              onChange={handleChange}
              placeholder="هر قانون را با کاما جدا کنید"
              hint="مثال: ورود با کفش ممنوع، سیگار ممنوع"
            />

            <InputField
              label="قوانین ورود و خروج"
              name="entrance_rolls"
              value={form.entrance_rolls}
              onChange={handleChange}
              placeholder="قوانین ساعت ورود و خروج (با کاما)"
            />

            <InputField
              label="امکانات تالار"
              name="properties"
              icon={PiWrench}
              value={form.properties}
              onChange={handleChange}
              placeholder="هر امکان را با کاما جدا کنید"
              hint="مثال: آسانسور، نمازخانه، سرویس بهداشتی"
            />
          </div>
        </FormSection>

        {/* ============ سانس و قیمت ============ */}
        <FormSection
          index={3}
          icon={PiCurrencyCircleDollar}
          title="اطلاعات سانس و قیمت"
          description="قیمت‌گذاری و تخفیف‌ها"
        >
          <label className="flex items-center gap-2.5 cursor-pointer py-2 group mb-4">
            <span
              className={`
                relative w-[18px] h-[18px] rounded-md
                border-2 flex items-center justify-center flex-shrink-0
                transition-all duration-200
                ${
                  form.has_sans
                    ? "border-gold-500 bg-gradient-to-b from-gold-400 to-gold-600"
                    : "border-slate-300 bg-white group-hover:border-gold-400"
                }
              `}
            >
              {form.has_sans && (
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
            <input
              type="checkbox"
              name="has_sans"
              checked={form.has_sans}
              onChange={handleChange}
              className="sr-only"
            />
            <span className="text-[13px] text-slate-700 group-hover:text-slate-900">
              این تالار دارای سانس است
            </span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="قیمت سانس (تومان)"
              name="sans_price"
              icon={PiCurrencyCircleDollar}
              type="number"
              value={form.sans_price}
              onChange={handleChange}
              placeholder="مثلاً: 50000000"
              dir="ltr"
            />
            <InputField
              label="تخفیف سانس (درصد)"
              name="sans_discount"
              icon={PiPercent}
              type="number"
              value={form.sans_discount}
              onChange={handleChange}
              placeholder="مثلاً: 10"
              dir="ltr"
            />
            <InputField
              label="شماره مجوز"
              name="licensee_number"
              value={form.licensee_number}
              onChange={handleChange}
              placeholder="شماره پروانه کسب"
              dir="ltr"
            />
          </div>
        </FormSection>

        {/* ============ قوانین و مقررات ============ */}
        <FormSection
          index={4}
          icon={PiShieldCheck}
          title="قوانین و مقررات"
          description="قوانین لغو، دوربین و رزرو"
        >
          <div className="grid grid-cols-1 gap-4">
            <InputField
              label="قوانین کنسلی"
              name="cancel_rolls"
              value={form.cancel_rolls}
              onChange={handleChange}
              placeholder="هر قانون را با کاما جدا کنید"
            />
            <InputField
              label="ظرفیت دوربین‌برداری"
              name="camera_capacities"
              value={form.camera_capacities}
              onChange={handleChange}
              placeholder="مثال: عکاس، فیلم‌بردار (با کاما)"
            />
            <InputField
              label="قوانین رزرو"
              name="reservation_rolls"
              value={form.reservation_rolls}
              onChange={handleChange}
              placeholder="هر قانون را با کاما جدا کنید"
            />
          </div>
        </FormSection>

        {/* ============ تاریخ‌های آزاد ============ */}
        <FormSection
          index={5}
          icon={PiCalendarBlank}
          title="تاریخ‌های آزاد"
          description="تاریخ‌هایی که تالار در دسترس است"
        >
          <div className="space-y-4">
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              onChange={addDate}
              format="YYYY/MM/DD"
              placeholder="انتخاب تاریخ آزاد"
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

            {selectedDates.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedDates.map((date) => (
                  <span
                    key={date}
                    className="
                      inline-flex items-center gap-2
                      px-3 py-1.5 rounded-lg
                      bg-gold-50 text-gold-700
                      ring-1 ring-gold-100
                      text-[12px] font-medium
                    "
                  >
                    {new Date(date).toLocaleDateString("fa-IR")}
                    <button
                      type="button"
                      onClick={() => removeDate(date)}
                      aria-label="حذف تاریخ"
                      className="
                        w-4 h-4 rounded-full
                        flex items-center justify-center
                        text-gold-600 hover:text-white hover:bg-rose-500
                        transition-all duration-200
                      "
                    >
                      <PiX className="w-3 h-3" strokeWidth={3} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </FormSection>

        {/* ============ تصاویر ============ */}
        <FormSection
          index={6}
          icon={PiImage}
          title="تصاویر تالار"
          description="حداقل یک تصویر الزامی است"
        >
          <UploadBox
            id="image-upload"
            accept="image/*"
            onChange={handleImages}
            title="انتخاب تصاویر"
            hint="فرمت JPG، PNG، WEBP"
            icon={PiImage}
          />

          {images.length > 0 && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 ring-1 ring-slate-100">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
                <span className="text-[18px] font-bold text-gold-600">
                  {images.length.toLocaleString("fa-IR")}
                </span>
                <span className="text-[12.5px] text-slate-500">
                  تصویر انتخاب‌شده
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="aspect-square rounded-lg overflow-hidden ring-2 ring-slate-200 hover:ring-gold-400 transition-all"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`تصویر ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </FormSection>

        {/* ============ مدارک ============ */}
        <FormSection
          index={7}
          icon={PiFilePdf}
          title="مدارک تالار"
          description="اسناد و مجوزها (اختیاری)"
        >
          <UploadBox
            id="doc-upload"
            accept=".pdf,image/*"
            onChange={handleDocs}
            title="انتخاب مدارک"
            hint="فرمت PDF، JPG، PNG"
            icon={PiFilePdf}
          />

          {documents.length > 0 && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 ring-1 ring-slate-100">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
                <span className="text-[18px] font-bold text-gold-600">
                  {documents.length.toLocaleString("fa-IR")}
                </span>
                <span className="text-[12.5px] text-slate-500">
                  مدرک انتخاب‌شده
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {documents.map((_, idx) => (
                  <div
                    key={idx}
                    className="
                      flex items-center gap-2
                      px-3 py-2 rounded-lg
                      bg-white ring-1 ring-slate-100
                    "
                  >
                    <PiFilePdf className="w-4 h-4 text-gold-500 flex-shrink-0" />
                    <span className="text-[12px] text-slate-700 truncate">
                      مدرک {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </FormSection>

        {/* ============ Action Bar ============ */}
        <div className="pt-6 mt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              if (
                confirm(
                  "آیا مطمئن هستید؟ تمام اطلاعات فرم پاک خواهد شد."
                )
              ) {
                setForm({
                  title: "",
                  province: "",
                  city: "",
                  address: "",
                  lat: "",
                  lng: "",
                  postal_code: "",
                  hall_phone: "",
                  hall_owner_name: "",
                  hall_owner_phone: "",
                  hall_measure: "",
                  description: "",
                  year: "",
                  hall_roles: "",
                  capacity: "",
                  duration: "",
                  entrance_rolls: "",
                  hall_type: "",
                  host_type: "",
                  event_type: "",
                  properties: "",
                  parking_count: "",
                  roof_count: "",
                  has_sans: false,
                  sans_price: "",
                  sans_discount: "",
                  licensee_number: "",
                  cancel_rolls: "",
                  camera_capacities: "",
                  reservation_rolls: "",
                });
                setImages([]);
                setDocuments([]);
                setSelectedDates([]);
                notify.info("فرم پاک شد");
              }
            }}
            disabled={loading}
            className="
              w-full sm:w-auto
              inline-flex items-center justify-center gap-2
              px-5 py-2.5 rounded-xl
              text-sm font-medium
              text-slate-700 bg-white
              border border-slate-200
              hover:bg-slate-50 hover:border-slate-300
              active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
            "
          >
            <PiX className="w-4 h-4" />
            پاک کردن فرم
          </button>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full sm:w-auto
              inline-flex items-center justify-center gap-2
              px-6 py-2.5 rounded-xl
              text-sm font-bold text-white
              bg-gradient-to-b from-gold-400 to-gold-600
              hover:from-gold-500 hover:to-gold-700
              shadow-md shadow-gold-500/25
              hover:shadow-lg hover:shadow-gold-500/40
              hover:-translate-y-0.5
              active:scale-95
              focus:outline-none focus:ring-4 focus:ring-gold-500/25
              disabled:opacity-60 disabled:cursor-not-allowed
              disabled:hover:translate-y-0
              transition-all duration-300
              min-w-[180px]
            "
          >
            {loading ? (
              <>
                <PiSpinnerGap className="w-4 h-4 animate-spin" />
                در حال ثبت...
              </>
            ) : (
              <>
                <PiFloppyDisk className="w-4 h-4" />
                ثبت تالار
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}