"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/green.css";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  PiMapPin,
  PiUsersThree,
  PiRuler,
  PiCalendarBlank,
  PiCarProfile,
  PiForkKnife,
  PiSparkle,
  PiBuildings,
  PiCaretLeft,
  PiCaretRight,
  PiX,
  PiMagnifyingGlass,
  PiCheck,
  PiCurrencyCircleDollar,
  PiArrowLeft,
  PiClock,
  PiStarFill,
  PiInfo,
} from "react-icons/pi";

import Loading from "../../../components/ui/Loading";

/* ============================================================
   Helpers
   ============================================================ */
function getImageUrl(imagePath) {
  if (!imagePath) return "/placeholder.jpg";
  if (imagePath.startsWith("http") || imagePath.startsWith("https"))
    return imagePath;
  let clean = imagePath.replace(/^\.\//, "");
  if (clean.startsWith("/")) return clean;
  return `/${clean}`;
}

function convertToGregorian(dateObject) {
  if (!dateObject) return null;
  return dateObject.toDate().toISOString().split("T")[0];
}

const faNum = (n) => Number(n || 0).toLocaleString("fa-IR");

/* ============================================================
   InfoCard — کارت اطلاعات
   ============================================================ */
function InfoCard({ title, icon: Icon, children, className = "" }) {
  return (
    <div
      className={`
        bg-white rounded-2xl
        ring-1 ring-slate-100
        shadow-[0_1px_2px_rgba(15,23,42,0.04)]
        p-5 sm:p-6
        ${className}
      `}
    >
      <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4 text-[15px]">
        {Icon && (
          <span className="w-8 h-8 rounded-lg bg-gold-50 flex items-center justify-center ring-1 ring-gold-100">
            <Icon className="w-4 h-4 text-gold-600" />
          </span>
        )}
        {title}
      </h3>
      {children}
    </div>
  );
}

/* ============================================================
   ImageGallery — گالری با اسلایدر
   ============================================================ */
/* ============================================================
   ImageGallery — چیدمان Bento حرفه‌ای
   ============================================================ */
function ImageGallery({ images, title, onOpen }) {
  const [current, setCurrent] = useState(0);
  const valid = images.filter((i) => i && i.trim());

  if (valid.length === 0) return null;

  const goNext = (e) => {
    e?.stopPropagation();
    setCurrent((c) => (c + 1) % valid.length);
  };
  const goPrev = (e) => {
    e?.stopPropagation();
    setCurrent((c) => (c - 1 + valid.length) % valid.length);
  };

  /* توزیع تصاویر بر اساس تعداد */
  const count = valid.length;
  const hasEnoughForGrid = count >= 3;

  /* ============================================================
     گالری دسکتاپ — چیدمان Bento
     ============================================================ */
  const DesktopGallery = () => {
    /* حالت ۱: ۱ تصویر */
    if (count === 1) {
      return (
        <div
          className="relative rounded-2xl overflow-hidden cursor-pointer bg-slate-100 group aspect-[16/9] max-h-[520px]"
          onClick={() => onOpen(0)}
        >
          <img
            src={getImageUrl(valid[0])}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => (e.target.src = "/placeholder.jpg")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      );
    }

    /* حالت ۲: ۲ تصویر */
    if (count === 2) {
      return (
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {valid.map((img, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl overflow-hidden cursor-pointer bg-slate-100 group aspect-[4/3]"
              onClick={() => onOpen(idx)}
            >
              <img
                src={getImageUrl(img)}
                alt={`${title} ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => (e.target.src = "/placeholder.jpg")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      );
    }

    /* حالت ۳: ۳ تصویر — Bento */
    if (count === 3) {
      return (
        <div className="grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4 h-[420px] sm:h-[480px]">
          {/* تصویر بزرگ — چپ */}
          <div
            className="row-span-2 relative rounded-2xl overflow-hidden cursor-pointer bg-slate-100 group"
            onClick={() => onOpen(0)}
          >
            <img
              src={getImageUrl(valid[0])}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => (e.target.src = "/placeholder.jpg")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* دو تصویر کوچک — راست */}
          {valid.slice(1, 3).map((img, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl overflow-hidden cursor-pointer bg-slate-100 group"
              onClick={() => onOpen(idx + 1)}
            >
              <img
                src={getImageUrl(img)}
                alt={`${title} ${idx + 2}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => (e.target.src = "/placeholder.jpg")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      );
    }

    /* حالت ۴: ۴+ تصویر — Bento کامل */
    return (
      <div className="grid grid-cols-4 grid-rows-2 gap-3 sm:gap-4 h-[420px] sm:h-[480px]">
        {/* تصویر اصلی — ۲x۲ */}
        <div
          className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden cursor-pointer bg-slate-100 group"
          onClick={() => onOpen(0)}
        >
          <img
            src={getImageUrl(valid[0])}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => (e.target.src = "/placeholder.jpg")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* badge تعداد تصاویر */}
          {count > 1 && (
            <div className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-slate-800 text-[11px] font-bold shadow-md">
              <PiMagnifyingGlass className="w-3.5 h-3.5 text-gold-600" />
              {faNum(count)} تصویر
            </div>
          )}
        </div>

        {/* ۴ تصویر کوچک — راست */}
        {[1, 2, 3, 4].map((slotIdx) => {
          const img = valid[slotIdx];
          const isLast = slotIdx === 4;
          const hasMore = count > 5 && isLast;

          return (
            <div
              key={slotIdx}
              className="relative rounded-2xl overflow-hidden cursor-pointer bg-slate-100 group"
              onClick={() => {
                if (img) onOpen(slotIdx);
                else if (hasMore) onOpen(0);
              }}
            >
              {img ? (
                <>
                  <img
                    src={getImageUrl(img)}
                    alt={`${title} ${slotIdx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => (e.target.src = "/placeholder.jpg")}
                  />

                  {/* overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* overlay بیشتر */}
                  {hasMore && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white font-bold text-2xl drop-shadow-md">
                        +{faNum(count - 5)}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                /* جای خالی — اگر تعداد کمتر از ۵ بود */
                <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                  <PiBuildings className="w-8 h-8 text-slate-300" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="mb-6 sm:mb-8">
      {/* دسکتاپ */}
      <div className="hidden sm:block">
        <DesktopGallery />
      </div>

      {/* موبایل — اسلایدر تمام‌عرض */}
      <div className="sm:hidden relative rounded-2xl overflow-hidden bg-slate-100 aspect-[4/3]">
        <img
          src={getImageUrl(valid[current])}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => (e.target.src = "/placeholder.jpg")}
        />

        {/* گرادیانت */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        {/* دکمه‌های ناوبری */}
        {valid.length > 1 && (
          <>
            <button
              onClick={goNext}
              aria-label="تصویر بعدی"
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                w-10 h-10 rounded-full
                flex items-center justify-center
                bg-white/25 hover:bg-gold-500
                backdrop-blur-md
                text-white
                ring-1 ring-white/40 hover:ring-gold-500
                shadow-md hover:shadow-lg hover:shadow-gold-500/50
                hover:scale-110 active:scale-95
                transition-all duration-200
              "
            >
              <PiCaretRight className="w-5 h-5" strokeWidth={2.5} />
            </button>
            <button
              onClick={goPrev}
              aria-label="تصویر قبلی"
              className="
                absolute left-3 top-1/2 -translate-y-1/2
                w-10 h-10 rounded-full
                flex items-center justify-center
                bg-white/25 hover:bg-gold-500
                backdrop-blur-md
                text-white
                ring-1 ring-white/40 hover:ring-gold-500
                shadow-md hover:shadow-lg hover:shadow-gold-500/50
                hover:scale-110 active:scale-95
                transition-all duration-200
              "
            >
              <PiCaretLeft className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </>
        )}

        {/* شمارنده */}
        <div className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-bold">
          {faNum(current + 1)} / {faNum(valid.length)}
        </div>

        {/* دکمه باز کردن گالری */}
        <button
          onClick={() => onOpen(current)}
          className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-slate-800 text-[11px] font-bold shadow-md"
        >
          مشاهده همه
        </button>
      </div>
    </div>
  );
}
/* ============================================================
   GalleryModal — گالری تمام صفحه
   ============================================================ */
function GalleryModal({ open, images, current, onClose, onNavigate }) {
  const valid = images.filter((i) => i && i.trim());

  /* کیبورد ناوبری */
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((current + 1) % valid.length);
      if (e.key === "ArrowLeft")
        onNavigate((current - 1 + valid.length) % valid.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, current, valid.length, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {open && valid.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getImageUrl(valid[current])}
              alt="گالری"
              className="w-full h-auto max-h-[75vh] sm:max-h-[80vh] object-contain rounded-2xl"
              onError={(e) => (e.target.src = "/placeholder.jpg")}
            />

            {/* دکمه بستن */}
            <button
              onClick={onClose}
              aria-label="بستن"
              className="
                absolute top-3 right-3 z-20
                w-10 h-10 rounded-full
                flex items-center justify-center
                bg-white/10 hover:bg-white/20
                backdrop-blur-md
                text-white
                ring-1 ring-white/20
                transition-all
              "
            >
              <PiX className="w-5 h-5" />
            </button>

            {/* شمارنده */}
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold ring-1 ring-white/20">
              {faNum(current + 1)} / {faNum(valid.length)}
            </div>

            {/* ناوبری */}
            {valid.length > 1 && (
              <>
                <button
                  onClick={() =>
                    onNavigate((current - 1 + valid.length) % valid.length)
                  }
                  aria-label="تصویر قبلی"
                  className="
                    absolute left-3 top-1/2 -translate-y-1/2 z-20
                    w-11 h-11 rounded-full
                    flex items-center justify-center
                    bg-white/10 hover:bg-gold-500
                    backdrop-blur-md
                    text-white
                    ring-1 ring-white/20 hover:ring-gold-500
                    transition-all duration-200
                  "
                >
                  <PiCaretLeft className="w-5 h-5" strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => onNavigate((current + 1) % valid.length)}
                  aria-label="تصویر بعدی"
                  className="
                    absolute right-3 top-1/2 -translate-y-1/2 z-20
                    w-11 h-11 rounded-full
                    flex items-center justify-center
                    bg-white/10 hover:bg-gold-500
                    backdrop-blur-md
                    text-white
                    ring-1 ring-white/20 hover:ring-gold-500
                    transition-all duration-200
                  "
                >
                  <PiCaretRight className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </>
            )}

            {/* Thumbnails */}
            {valid.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 max-w-full overflow-x-auto px-2 py-2 rounded-xl bg-black/40 backdrop-blur-md scrollbar-thin">
                {valid.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => onNavigate(idx)}
                    className={`
                      relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden
                      transition-all duration-200
                      ${current === idx
                        ? "ring-2 ring-gold-500 scale-105"
                        : "ring-1 ring-white/20 opacity-60 hover:opacity-100"
                      }
                    `}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
   Page
   ============================================================ */
export default function HallDetailsPage({ params }) {
  const router = useRouter();
  const hallId = params?.id;

  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isLoadingSession = status === "loading";

  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState("");
  const [note, setNote] = useState("");
  const [reserveLoading, setReserveLoading] = useState(false);

  /* ============================================================
     بارگذاری تالار
     ============================================================ */
  useEffect(() => {
    if (!hallId) return;
    const fetchHall = async () => {
      try {
        const res = await axios.get(`/api/halls/${hallId}`);
        setHall(res.data);
      } catch (err) {
        console.error(err);
        toast.error("خطا در دریافت اطلاعات تالار");
      } finally {
        setLoading(false);
      }
    };
    fetchHall();
  }, [hallId]);

  /* ============================================================
     ثبت رزرو
     ============================================================ */
  const handleReserve = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error("لطفاً ابتدا وارد حساب کاربری خود شوید");
      const returnUrl = encodeURIComponent(`/halls/${hallId}`);
      router.push(`/auth/user/login?callbackUrl=${returnUrl}`);
      return;
    }

    const gregorianStart = convertToGregorian(startDate);
    const gregorianEnd = convertToGregorian(endDate);

    if (!gregorianStart || !gregorianEnd || !guests) {
      toast.error("لطفاً تمام فیلدهای الزامی را پر کنید");
      return;
    }

    const start = new Date(gregorianStart);
    const end = new Date(gregorianEnd);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      toast.error("تاریخ شروع نمی‌تواند در گذشته باشد");
      return;
    }
    if (end <= start) {
      toast.error("تاریخ پایان باید بعد از تاریخ شروع باشد");
      return;
    }
    if (parseInt(guests) > hall.capacity) {
      toast.error(
        `تعداد مهمان‌ها نمی‌تواند بیشتر از ${faNum(hall.capacity)} نفر باشد`
      );
      return;
    }

    try {
      setReserveLoading(true);
      await axios.post(
        "/api/user/hall_reservations",
        {
          hall_id: hall._id,
          start_date: gregorianStart,
          end_date: gregorianEnd,
          guests_count: parseInt(guests),
          user_note: note,
        },
        { withCredentials: true }
      );

      toast.success("✓ رزرو با موفقیت ثبت شد");
      setStartDate(null);
      setEndDate(null);
      setGuests("");
      setNote("");

      setTimeout(() => router.push("/user/profile"), 2000);
    } catch (err) {
      console.error("Reservation error:", err);
      toast.error(err.response?.data?.message || "خطا در ثبت رزرو");
    } finally {
      setReserveLoading(false);
    }
  }, [isAuthenticated, startDate, endDate, guests, note, hall, hallId, router]);

  /* ============================================================
     Loading / Not Found
     ============================================================ */
  if (loading || isLoadingSession) {
    return (
      <>
        <Toaster position="top-center" />
        <Loading />
      </>
    );
  }

  if (!hall) {
    return (
      <>
        <Toaster position="top-center" />
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 px-4 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-gold-50 to-gold-100 rounded-3xl flex items-center justify-center mb-6 ring-1 ring-gold-100">
            <PiBuildings className="w-12 h-12 text-gold-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            تالار یافت نشد
          </h3>
          <p className="text-slate-500 text-sm mb-6">
            تالار مورد نظر وجود ندارد یا حذف شده است
          </p>
          <Link
            href="/halls"
            className="
              inline-flex items-center gap-2
              px-6 py-3 rounded-xl
              text-sm font-bold text-white
              bg-gradient-to-b from-gold-400 to-gold-600
              hover:from-gold-500 hover:to-gold-700
              shadow-md shadow-gold-500/25 hover:shadow-lg hover:shadow-gold-500/40
              transition-all duration-300
            "
          >
            <PiArrowLeft className="w-4 h-4" />
            بازگشت به لیست تالارها
          </Link>
        </div>
      </>
    );
  }

  const validImages =
    hall.images?.filter((img) => img && img.trim()) || [];

  /* ============================================================
     Render
     ============================================================ */
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#ffffff",
            color: "#1e293b",
            border: "1px solid #F6EED5",
            padding: "12px 18px",
            borderRadius: "12px",
            boxShadow:
              "0 20px 40px -12px rgba(198,161,76,0.15), 0 4px 6px -4px rgba(0,0,0,0.05)",
            fontSize: "13.5px",
            fontFamily: "inherit",
            direction: "rtl",
          },
          success: {
            iconTheme: { primary: "#C6A14C", secondary: "#ffffff" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#ffffff" },
          },
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-[#FDFCF9] via-[#FAF8F2] to-[#F7F3E8] pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* ==================== Breadcrumb ==================== */}
          <nav className="mb-5 flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-gold-700 transition-colors">
              خانه
            </Link>
            <span className="text-slate-300">/</span>
            <Link
              href="/halls"
              className="hover:text-gold-700 transition-colors"
            >
              تالارها
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-medium truncate">
              {hall.title}
            </span>
          </nav>

          {/* ==================== هدر ==================== */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/25 flex-shrink-0">
                <PiBuildings className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 break-words leading-tight mb-2">
                  {hall.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <PiMapPin className="w-4 h-4 text-gold-500" />
                    {hall.city}
                    {hall.province && ` — ${hall.province}`}
                  </span>

                  {hall.capacity && (
                    <span className="inline-flex items-center gap-1.5">
                      <PiUsersThree className="w-4 h-4 text-gold-500" />
                      {faNum(hall.capacity)} نفر
                    </span>
                  )}

                  {hall.hall_measure && (
                    <span className="inline-flex items-center gap-1.5">
                      <PiRuler className="w-4 h-4 text-gold-500" />
                      {faNum(hall.hall_measure)} متر
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ==================== گالری ==================== */}
          <ImageGallery
            images={validImages}
            title={hall.title}
            onOpen={(idx) => {
              setSelectedImage(idx);
              setShowGallery(true);
            }}
          />

          {/* ==================== محتوای اصلی ==================== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7">
            {/* ستون اطلاعات */}
            <div className="lg:col-span-2 space-y-5">
              {/* موقعیت */}
              <InfoCard title="موقعیت مکانی" icon={PiMapPin}>
                <p className="text-slate-700 text-sm leading-relaxed mb-3">
                  {hall.address}
                </p>
                <div className="flex flex-wrap gap-2">
                  {hall.province && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-xs ring-1 ring-slate-100">
                      استان: <strong className="text-slate-800">{hall.province}</strong>
                    </span>
                  )}
                  {hall.city && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-xs ring-1 ring-slate-100">
                      شهر: <strong className="text-slate-800">{hall.city}</strong>
                    </span>
                  )}
                  {hall.postal_code && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-xs ring-1 ring-slate-100">
                      کد پستی:{" "}
                      <strong className="text-slate-800">
                        {hall.postal_code}
                      </strong>
                    </span>
                  )}
                </div>
              </InfoCard>

              {/* مشخصات */}
              <InfoCard title="مشخصات کلی" icon={PiInfo}>
                {/* آمار */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="text-center p-4 bg-gold-50/50 rounded-xl ring-1 ring-gold-100/50">
                    <PiUsersThree className="w-5 h-5 text-gold-600 mx-auto mb-1.5" />
                    <p className="text-lg font-bold text-slate-900">
                      {faNum(hall.capacity)}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      ظرفیت (نفر)
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gold-50/50 rounded-xl ring-1 ring-gold-100/50">
                    <PiRuler className="w-5 h-5 text-gold-600 mx-auto mb-1.5" />
                    <p className="text-lg font-bold text-slate-900">
                      {faNum(hall.hall_measure)}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      متراژ (متر)
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gold-50/50 rounded-xl ring-1 ring-gold-100/50">
                    <PiCalendarBlank className="w-5 h-5 text-gold-600 mx-auto mb-1.5" />
                    <p className="text-lg font-bold text-slate-900">
                      {hall.year ? faNum(hall.year) : "—"}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      سال ساخت
                    </p>
                  </div>
                </div>

                {/* جزئیات */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {hall.hall_type && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <PiSparkle className="w-4 h-4 text-gold-500" />
                      <span className="text-slate-500">نوع تالار:</span>
                      <span className="font-medium text-slate-800">
                        {hall.hall_type}
                      </span>
                    </div>
                  )}
                  {hall.host_type && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <PiForkKnife className="w-4 h-4 text-gold-500" />
                      <span className="text-slate-500">نوع پذیرایی:</span>
                      <span className="font-medium text-slate-800">
                        {hall.host_type}
                      </span>
                    </div>
                  )}
                  {hall.event_type && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <PiCalendarBlank className="w-4 h-4 text-gold-500" />
                      <span className="text-slate-500">نوع مراسم:</span>
                      <span className="font-medium text-slate-800">
                        {hall.event_type}
                      </span>
                    </div>
                  )}
                  {hall.parking_count && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <PiCarProfile className="w-4 h-4 text-gold-500" />
                      <span className="text-slate-500">پارکینگ:</span>
                      <span className="font-medium text-slate-800">
                        {hall.parking_count}
                      </span>
                    </div>
                  )}
                </div>
              </InfoCard>

              {/* توضیحات */}
              {hall.description && (
                <InfoCard title="درباره تالار">
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                    {hall.description}
                  </p>
                </InfoCard>
              )}

              {/* امکانات */}
              {hall.properties && hall.properties.length > 0 && (
                <InfoCard title="امکانات و ویژگی‌ها">
                  <div className="flex flex-wrap gap-2">
                    {hall.properties.map((item, idx) => (
                      <span
                        key={idx}
                        className="
                          inline-flex items-center gap-1.5
                          px-3 py-1.5 rounded-lg
                          bg-gold-50 text-gold-700
                          text-[12px] font-medium
                          ring-1 ring-gold-100
                        "
                      >
                        <PiCheck className="w-3.5 h-3.5" strokeWidth={3} />
                        {item}
                      </span>
                    ))}
                  </div>
                </InfoCard>
              )}
            </div>

            {/* ستون رزرو */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <div
                  className="
                    bg-white rounded-2xl
                    ring-1 ring-slate-100
                    shadow-[0_8px_32px_rgba(198,161,76,0.08),0_2px_8px_rgba(0,0,0,0.04)]
                    p-5 sm:p-6
                  "
                >
                  {/* هدر */}
                  <div className="flex items-start justify-between gap-3 mb-5 pb-5 border-b border-slate-100">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        رزرو تالار
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        بازه و تعداد مهمان را مشخص کنید
                      </p>
                    </div>
                    {hall.sans_price && (
                      <div className="text-left flex-shrink-0">
                        <p className="text-[10px] text-slate-400">
                          هر سانس
                        </p>
                        <p className="text-base font-black text-gold-700">
                          {faNum(hall.sans_price)}
                        </p>
                        <p className="text-[9px] text-slate-400">تومان</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* تاریخ شروع */}
                    <div>
                      <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                        تاریخ شروع <span className="text-rose-500">*</span>
                      </label>
                      <DatePicker
                        calendar={persian}
                        locale={persian_fa}
                        value={startDate}
                        onChange={setStartDate}
                        format="YYYY/MM/DD"
                        placeholder="انتخاب تاریخ شروع"
                        className="green"
                        inputClass="
                          w-full px-3.5 py-2.5
                          bg-white border border-slate-200 rounded-xl
                          text-sm text-slate-900
                          focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10
                          hover:border-gold-300
                          transition-all duration-200
                        "
                        containerClassName="w-full"
                      />
                    </div>

                    {/* تاریخ پایان */}
                    <div>
                      <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                        تاریخ پایان <span className="text-rose-500">*</span>
                      </label>
                      <DatePicker
                        calendar={persian}
                        locale={persian_fa}
                        value={endDate}
                        onChange={setEndDate}
                        format="YYYY/MM/DD"
                        placeholder="انتخاب تاریخ پایان"
                        className="green"
                        inputClass="
                          w-full px-3.5 py-2.5
                          bg-white border border-slate-200 rounded-xl
                          text-sm text-slate-900
                          focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10
                          hover:border-gold-300
                          transition-all duration-200
                        "
                        containerClassName="w-full"
                      />
                    </div>

                    {/* تعداد مهمان */}
                    <div>
                      <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                        تعداد مهمان <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        placeholder="تعداد نفرات"
                        min="1"
                        max={hall.capacity}
                        className="
                          w-full px-3.5 py-2.5
                          bg-white border border-slate-200 rounded-xl
                          text-sm text-slate-900
                          placeholder:text-slate-400
                          focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10
                          hover:border-gold-300
                          transition-all duration-200
                        "
                      />
                      {hall.capacity && (
                        <p className="text-[11px] text-slate-400 mt-1">
                          حداکثر ظرفیت: {faNum(hall.capacity)} نفر
                        </p>
                      )}
                    </div>

                    {/* توضیحات */}
                    <div>
                      <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                        توضیحات (اختیاری)
                      </label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows="3"
                        placeholder="توضیحات خود را وارد کنید..."
                        className="
                          w-full px-3.5 py-2.5
                          bg-white border border-slate-200 rounded-xl
                          text-sm text-slate-900
                          placeholder:text-slate-400
                          resize-none
                          focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10
                          hover:border-gold-300
                          transition-all duration-200
                        "
                      />
                    </div>

                    {/* دکمه رزرو */}
                    <button
                      onClick={handleReserve}
                      disabled={reserveLoading}
                      className="
                        w-full
                        inline-flex items-center justify-center gap-2
                        py-3.5 rounded-xl
                        text-sm font-bold text-white
                        bg-gradient-to-b from-gold-400 to-gold-600
                        hover:from-gold-500 hover:to-gold-700
                        shadow-md shadow-gold-500/25 hover:shadow-lg hover:shadow-gold-500/40
                        focus:outline-none focus:ring-4 focus:ring-gold-500/25
                        disabled:opacity-70 disabled:cursor-not-allowed
                        hover:-translate-y-0.5
                        transition-all duration-300
                      "
                    >
                      {reserveLoading ? (
                        <>
                          <svg
                            className="w-4 h-4 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          در حال ثبت...
                        </>
                      ) : (
                        <>
                          <PiCalendarBlank className="w-4 h-4" />
                          ثبت رزرو
                        </>
                      )}
                    </button>

                    {/* پیام ورود */}
                    <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                      {!isAuthenticated ? (
                        <Link
                          href={`/auth/user/login?callbackUrl=${encodeURIComponent(
                            `/halls/${hallId}`
                          )}`}
                          className="text-gold-700 font-medium hover:underline"
                        >
                          برای ثبت رزرو وارد حساب کاربری خود شوید
                        </Link>
                      ) : (
                        "پس از ثبت رزرو، مالک تالار درخواست شما را بررسی خواهد کرد"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* گالری مودال */}
      <GalleryModal
        open={showGallery}
        images={validImages}
        current={selectedImage}
        onClose={() => setShowGallery(false)}
        onNavigate={setSelectedImage}
      />
    </>
  );
}