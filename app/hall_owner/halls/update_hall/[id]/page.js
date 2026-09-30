// app/hall_owner/halls/update_hall/[id]/page.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
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
  PiFloppyDisk,
  PiSpinnerGap,
  PiX,
  PiMapPin,
  PiPhone,
  PiEnvelopeSimple,
  PiRuler,
  PiUsersThree,
  PiCarProfile,
  PiNote,
  PiPercent,
  PiArrowLeft,
} from "react-icons/pi";
import { notify } from "@/lib/toast";

/* ============================================================
   Static Data
   ============================================================ */
const EVENT_TYPES = ["تولد", "عروسی", "عزاداری", "تجلیل", "همایش", "جشن", "دیگر"];
const HALL_TYPES = ["سربسته", "روباز", "باغ", "تراس", "سالن سرپوشیده", "دیگر"];
const HOST_TYPES = ["فول", "نوشیدنی", "شام", "ناهار", "صبحانه", "بدون پذیرایی", "دیگر"];

const INITIAL_FORM = {
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
};

/* ============================================================
   Helpers
   ============================================================ */
const toArray = (str) => {
  if (!str) return [];
  return str.split(",").map((s) => s.trim()).filter(Boolean);
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

const formatDateForDisplay = (dateStr) => {
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("fa-IR");
  } catch {
    return dateStr;
  }
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
      className="py-6 sm:py-7 border-b border-slate-100 last:border-b-0"
    >
      <div className="flex items-start gap-3 pb-3 border-b border-slate-100 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-50 to-gold-100/60 text-gold-600 flex items-center justify-center flex-shrink-0 ring-1 ring-gold-200/60">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-bold text-slate-900">{title}</h3>
          {description && (
            <p className="text-[12px] text-slate-500 mt-0.5">{description}</p>
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
function UploadBox({ id, accept, multiple = true, onChange, title, hint, icon: Icon }) {
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
export default function EditHallPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState(INITIAL_FORM);
  const [selectedDates, setSelectedDates] = useState([]);
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* ============================================================
     Get Hall
     ============================================================ */
  const getHall = useCallback(async () => {
    try {
      const res = await axios.get(`/api/hall_owner/halls/${id}`);
      const hall = res.data.hall;

      setForm({
        title: hall.title || "",
        province: hall.province || "",
        city: hall.city || "",
        address: hall.address || "",
        lat: hall.lat || "",
        lng: hall.lng || "",
        postal_code: hall.postal_code || "",
        hall_phone: hall.hall_phone || "",
        hall_owner_name: hall.hall_owner_name || "",
        hall_owner_phone: hall.hall_owner_phone || "",
        hall_measure: hall.hall_measure || "",
        description: hall.description || "",
        year: hall.year || "",
        hall_roles: hall.hall_roles?.join(",") || "",
        capacity: hall.capacity || "",
        duration: hall.duration || "",
        entrance_rolls: hall.entrance_rolls?.join(",") || "",
        hall_type: hall.hall_type || "",
        host_type: hall.host_type || "",
        event_type: hall.event_type || "",
        properties: hall.properties?.join(",") || "",
        parking_count: hall.parking_count || "",
        roof_count: hall.roof_count || "",
        has_sans: hall.has_sans || false,
        sans_price: hall.sans_price || "",
        sans_discount: hall.sans_discount || "",
        licensee_number: hall.licensee_number || "",
        cancel_rolls: hall.cancel_rolls?.join(",") || "",
        camera_capacities: hall.camera_capacities?.join(",") || "",
        reservation_rolls: hall.reservation_rolls?.join(",") || "",
      });

      if (hall.free_dates?.length > 0) {
        setSelectedDates(hall.free_dates.map((d) => d.slice(0, 10)));
      }
      if (hall.images?.length > 0) setImages(hall.images);
      if (hall.hall_document?.length > 0) setDocuments(hall.hall_document);
    } catch (error) {
      console.error("خطا در دریافت اطلاعات:", error);
      notify.error("خطا در دریافت اطلاعات تالار");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getHall();
  }, [getHall]);

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

  /* -------- Dates -------- */
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

  /* -------- Images -------- */
  const handleImages = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const toastId = toast.loading(`در حال بارگذاری ${files.length} تصویر...`);
    try {
      const base64 = await Promise.all(files.map(convertToBase64));
      setImages((prev) => [...prev, ...base64]);
      toast.update(toastId, {
        render: `${files.length} تصویر با موفقیت اضافه شد`,
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

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    notify.info("تصویر حذف شد");
  };

  /* -------- Documents -------- */
  const handleDocs = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const toastId = toast.loading(`در حال بارگذاری ${files.length} مدرک...`);
    try {
      const base64 = await Promise.all(files.map(convertToBase64));
      setDocuments((prev) => [...prev, ...base64]);
      toast.update(toastId, {
        render: `${files.length} مدرک با موفقیت اضافه شد`,
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

  const removeDocument = (index) => {
    setDocuments(documents.filter((_, i) => i !== index));
    notify.info("مدرک حذف شد");
  };

  /* ============================================================
     Validate
     ============================================================ */
  const validateForm = () => {
    if (!form.description || form.description.trim().length < 20) {
      notify.error("توضیحات باید حداقل ۲۰ کاراکتر باشد");
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

    setSubmitting(true);
    const toastId = toast.loading("در حال ذخیره تغییرات...");

    try {
      await axios.put(`/api/hall_owner/halls/${id}`, {
        ...form,
        hall_roles: toArray(form.hall_roles),
        entrance_rolls: toArray(form.entrance_rolls),
        properties: toArray(form.properties),
        cancel_rolls: toArray(form.cancel_rolls),
        camera_capacities: toArray(form.camera_capacities),
        reservation_rolls: toArray(form.reservation_rolls),
        images,
        hall_document: documents,
        free_dates: selectedDates,
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
      });

      toast.update(toastId, {
        render: "تالار با موفقیت بروزرسانی شد",
        type: "success",
        isLoading: false,
        autoClose: 6000,
      });

      setTimeout(() => router.push("/hall_owner/halls"), 1200);
    } catch (error) {
      console.error("خطا در بروزرسانی:", error);
      toast.update(toastId, {
        render: error.response?.data?.message || "خطا در بروزرسانی تالار",
        type: "error",
        isLoading: false,
        autoClose: 10000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ============================================================
     Loading
     ============================================================ */
  if (loading) {
    return (
      <div dir="rtl" className="w-full space-y-5 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100" />
          <div className="space-y-2">
            <div className="h-6 w-48 bg-slate-100 rounded-lg" />
            <div className="h-3.5 w-64 bg-slate-100 rounded-md" />
          </div>
        </div>
        <div className="bg-white rounded-2xl ring-1 ring-slate-100 p-6 sm:p-8 space-y-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="space-y-4 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
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
              ویرایش تالار
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              اطلاعات تالار خود را ویرایش کنید
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/hall_owner/halls")}
            className="
              hidden sm:inline-flex items-center gap-2
              px-4 py-2.5 rounded-xl
              text-[12.5px] font-medium
              text-slate-700 bg-white
              border border-slate-200
              hover:bg-slate-50 hover:border-slate-300
              active:scale-95
              transition-all duration-200
              flex-shrink-0
            "
          >
            <PiArrowLeft className="w-4 h-4" />
            بازگشت به لیست
          </button>
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
        {/* ========== اطلاعات اصلی ========== */}
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

        {/* ========== اطلاعات مالک ========== */}
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

        {/* ========== مشخصات فنی ========== */}
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

        {/* ========== سانس و قیمت ========== */}
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
                <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
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

        {/* ========== قوانین و مقررات ========== */}
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

        {/* ========== تاریخ‌های آزاد ========== */}
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
              placeholder="انتخاب تاریخ آزاد جدید"
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
                {selectedDates.map((date, idx) => (
                  <span
                    key={idx}
                    className="
                      inline-flex items-center gap-2
                      px-3 py-1.5 rounded-lg
                      bg-gold-50 text-gold-700
                      ring-1 ring-gold-100
                      text-[12px] font-medium
                    "
                  >
                    {formatDateForDisplay(date)}
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

        {/* ========== تصاویر ========== */}
        <FormSection
          index={6}
          icon={PiImage}
          title="تصاویر تالار"
          description={`${images.length} تصویر موجود`}
        >
          <UploadBox
            id="image-upload"
            accept="image/*"
            onChange={handleImages}
            title="افزودن تصاویر جدید"
            hint="فرمت JPG، PNG، WEBP"
            icon={PiImage}
          />

          {images.length > 0 && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 ring-1 ring-slate-100">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
                <span className="text-[18px] font-bold text-gold-600">
                  {images.length.toLocaleString("fa-IR")}
                </span>
                <span className="text-[12.5px] text-slate-500">تصویر</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden ring-2 ring-slate-200 hover:ring-gold-400 transition-all group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`تصویر ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      aria-label="حذف تصویر"
                      className="
                        absolute top-1 right-1
                        w-6 h-6 rounded-full
                        flex items-center justify-center
                        bg-rose-500 text-white
                        opacity-0 group-hover:opacity-100
                        hover:bg-rose-600
                        active:scale-90
                        transition-all duration-200
                      "
                    >
                      <PiX className="w-3.5 h-3.5" strokeWidth={3} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </FormSection>

        {/* ========== مدارک ========== */}
        <FormSection
          index={7}
          icon={PiFilePdf}
          title="مدارک تالار"
          description={`${documents.length} مدرک موجود`}
        >
          <UploadBox
            id="doc-upload"
            accept=".pdf,image/*"
            onChange={handleDocs}
            title="افزودن مدارک جدید"
            hint="فرمت PDF، JPG، PNG"
            icon={PiFilePdf}
          />

          {documents.length > 0 && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 ring-1 ring-slate-100">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
                <span className="text-[18px] font-bold text-gold-600">
                  {documents.length.toLocaleString("fa-IR")}
                </span>
                <span className="text-[12.5px] text-slate-500">مدرک</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {documents.map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white ring-1 ring-slate-100 group"
                  >
                    <PiFilePdf className="w-4 h-4 text-gold-500 flex-shrink-0" />
                    <span className="text-[12px] text-slate-700 truncate flex-1">
                      مدرک {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeDocument(idx)}
                      aria-label="حذف مدرک"
                      className="
                        w-5 h-5 rounded-md
                        flex items-center justify-center
                        text-slate-400 hover:text-white hover:bg-rose-500
                        active:scale-90
                        transition-all duration-200
                      "
                    >
                      <PiX className="w-3 h-3" strokeWidth={3} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </FormSection>

        {/* ========== Action Bar ========== */}
        <div className="pt-6 mt-2 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/hall_owner/halls")}
            disabled={submitting}
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
            <PiArrowLeft className="w-4 h-4" />
            انصراف
          </button>

          <button
            type="submit"
            disabled={submitting}
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
            {submitting ? (
              <>
                <PiSpinnerGap className="w-4 h-4 animate-spin" />
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
      </form>
    </div>
  );
}