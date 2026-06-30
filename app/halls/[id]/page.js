"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/green.css";
import toast, { Toaster } from 'react-hot-toast';

import Loading from "../../../components/ui/Loading"

export default function HallDetailsPage({ params }) {
  const hallId = params?.id;

  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);

  // فرم رزرو
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState("");
  const [note, setNote] = useState("");
  const [reserveLoading, setReserveLoading] = useState(false);

  // تابع تبدیل تاریخ شمسی به میلادی
  const convertToGregorian = (dateObject) => {
    if (!dateObject) return null;
    const gregorianDate = dateObject.toDate();
    return gregorianDate.toISOString().split('T')[0];
  };

  // تابع تبدیل مسیر تصاویر
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.jpg";

    if (imagePath.startsWith("http") || imagePath.startsWith("https")) {
      return imagePath;
    }

    let cleanPath = imagePath.replace(/^\.\//, "");

    if (cleanPath.startsWith("/")) {
      return cleanPath;
    }

    return `/${cleanPath}`;
  };

  // دریافت جزئیات تالار
  useEffect(() => {
    if (!hallId) return;

    const fetchHall = async () => {
      try {
        const res = await axios.get(`/api/halls/${hallId}`);
        console.log(res)
        setHall(res.data);
      } catch (err) {
        console.error(err);
        toast.error('خطا در دریافت اطلاعات تالار');
      } finally {
        setLoading(false);
      }
    };

    fetchHall();
  }, [hallId]);

  const handleReserve = async () => {
    const gregorianStart = convertToGregorian(startDate);
    const gregorianEnd = convertToGregorian(endDate);

    if (!gregorianStart || !gregorianEnd || !guests) {
      toast.error('لطفاً تمام فیلدهای الزامی را پر کنید');
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
          user_note: note
        },
        { withCredentials: true }
      );

      toast.success('✓ رزرو با موفقیت ثبت شد');

      // پاک کردن فرم
      setStartDate(null);
      setEndDate(null);
      setGuests("");
      setNote("");

    } catch (err) {
      toast.error(err.response?.data?.message || "خطا در ثبت رزرو");
    } finally {
      setReserveLoading(false);
    }
  };

  // فرمت تاریخ برای نمایش
  const formatDate = (dateValue) => {
    if (!dateValue) return "—";
    try {
      let date;
      if (dateValue && typeof dateValue === 'object' && dateValue.$date) {
        date = new Date(dateValue.$date);
      } else {
        date = new Date(dateValue);
      }
      if (isNaN(date.getTime())) return "—";
      return date.toLocaleDateString("fa-IR");
    } catch {
      return "—";
    }
  };

  if (loading) {
    return (
      <>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Loading />
      </>
    );
  }

  if (!hall) {
    return (
      <>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#fff',
            },
          }}
        />
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 sm:py-20 text-center px-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-4 sm:mb-6">
            <span className="text-3xl sm:text-4xl">🏛️</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#2C2418] mb-2">تالار یافت نشد</h3>
          <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">تالار مورد نظر وجود ندارد یا حذف شده است</p>
          <Link href="/halls">
            <button className="flex items-center gap-2 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold shadow-md hover:shadow-xl transition-all duration-300 text-sm sm:text-base">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              بازگشت به لیست تالارها
            </button>
          </Link>
        </div>
      </>
    );
  }

  // تصاویر معتبر را فیلتر کنید
  const validImages = hall.images?.filter(img => img && img.trim()) || [];

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#fff',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '14px',
            maxWidth: '500px',
            direction: 'rtl',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
            style: {
              background: '#22c55e',
              color: '#fff',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '14px',
              maxWidth: '500px',
              direction: 'rtl',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            style: {
              background: '#ef4444',
              color: '#fff',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '14px',
              maxWidth: '500px',
              direction: 'rtl',
            },
          },
        }}
      />

      <div className="hall-details-page w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8" style={{ paddingTop: '80px' }}>

        {/* گالری تصاویر - حالت مودال */}
        <AnimatePresence>
          {showGallery && validImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-2 sm:p-4"
              onClick={() => setShowGallery(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative w-full max-w-4xl lg:max-w-5xl"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={getImageUrl(validImages[selectedImage])}
                  alt="گالری تالار"
                  className="w-full h-auto rounded-xl sm:rounded-2xl max-h-[60vh] sm:max-h-[70vh] lg:max-h-[80vh] object-contain"
                  onError={(e) => {
                    e.target.src = "/placeholder.jpg";
                  }}
                />
                <button
                  onClick={() => setShowGallery(false)}
                  className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/50 text-white p-1.5 sm:p-2 rounded-full hover:bg-black/70 transition z-10"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {validImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : validImages.length - 1))}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 sm:p-2 rounded-full hover:bg-black/70 transition"
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev < validImages.length - 1 ? prev + 1 : 0))}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 sm:p-2 rounded-full hover:bg-black/70 transition"
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
                <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
                  {validImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${selectedImage === idx ? 'bg-[#D4B06A] w-3 sm:w-4' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* هدر صفحه */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-[#D4B06A]/10 to-[#B8922E]/10 rounded-lg sm:rounded-xl flex-shrink-0">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#D4B06A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="min-w-0 flex-1 mt-16">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-[#2C2418] break-words">{hall.title}</h1>
              <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm mt-0.5 sm:mt-1 break-all">شناسه: {hall._id?.$oid || hall._id}</p>
            </div>
          </div>
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] rounded-full mt-2 sm:mt-3" />
        </div>

        {/* گالری تصاویر اصلی - فقط در صورت وجود تصاویر */}
        {validImages.length > 0 && (
          <div className="mb-4 sm:mb-6 md:mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              <div
                className="sm:col-span-2 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer bg-gray-100"
                onClick={() => setShowGallery(true)}
              >
                <img
                  src={getImageUrl(validImages[0])}
                  alt={hall.title}
                  className="w-full h-48 sm:h-56 md:h-72 lg:h-96 object-cover hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = "/placeholder.jpg";
                  }}
                />
              </div>
              <div className="hidden sm:grid sm:col-span-2 grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                {validImages.slice(1, 5).map((img, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer bg-gray-100"
                    onClick={() => {
                      setSelectedImage(idx + 1);
                      setShowGallery(true);
                    }}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`${hall.title} ${idx + 2}`}
                      className="w-full h-28 sm:h-32 md:h-36 lg:h-44 object-cover hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "/placeholder.jpg";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            {validImages.length > 5 && (
              <p className="text-center text-gray-500 text-[10px] sm:text-xs md:text-sm mt-1.5 sm:mt-2">
                +{validImages.length - 5} تصویر دیگر
              </p>
            )}
          </div>
        )}

        {/* در صورت نبود تصاویر */}
        {validImages.length === 0 && (
          <div className="mb-4 sm:mb-6 md:mb-8 bg-gray-100 rounded-xl sm:rounded-2xl h-48 sm:h-56 md:h-64 flex items-center justify-center">
            <div className="text-center px-4">
              <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-400 mx-auto mb-1.5 sm:mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400 text-xs sm:text-sm">تصویری برای این تالار وجود ندارد</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">

          {/* اطلاعات اصلی تالار */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5 md:space-y-6">

            {/* آدرس و موقعیت */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-md p-4 sm:p-5">
              <h3 className="font-bold text-[#2C2418] flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 text-sm sm:text-base">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4B06A] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                موقعیت مکانی
              </h3>
              <p className="text-gray-700 text-sm sm:text-base break-words mb-1.5">📍 {hall.address}</p>
              <p className="text-gray-500 text-xs sm:text-sm break-words">استان: {hall.province} | شهر: {hall.city}</p>
              {hall.postal_code && <p className="text-gray-500 text-xs sm:text-sm mt-1 break-words">کد پستی: {hall.postal_code}</p>}
              {hall.lat && hall.lng && (
                <p className="text-gray-500 text-xs sm:text-sm mt-1 break-words">مختصات: {hall.lat}, {hall.lng}</p>
              )}
            </div>

            {/* مشخصات تالار */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-md p-4 sm:p-5">
              <h3 className="font-bold text-[#2C2418] flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 text-sm sm:text-base">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4B06A] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                مشخصات کلی
              </h3>
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#D4B06A]">{hall.capacity?.toLocaleString()}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">ظرفیت (نفر)</p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#D4B06A]">{hall.hall_measure}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">متراژ (متر)</p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#D4B06A]">{hall.year || "—"}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">سال ساخت</p>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
                <p className="break-words"><span className="font-medium text-gray-700">نوع تالار:</span> {hall.hall_type}</p>
                <p className="break-words"><span className="font-medium text-gray-700">نوع میزبانی:</span> {hall.host_type}</p>
                <p className="break-words"><span className="font-medium text-gray-700">نوع رویداد:</span> {hall.event_type}</p>
                <p className="break-words"><span className="font-medium text-gray-700">پارکینگ:</span> {hall.parking_count} جایگاه</p>
                <p className="break-words"><span className="font-medium text-gray-700">تعداد سقف:</span> {hall.roof_count}</p>
                <p className="break-words"><span className="font-medium text-gray-700">مدت زمان رزرو:</span> {hall.duration} ساعت</p>
                <p className="break-words"><span className="font-medium text-gray-700">دارای سانس:</span> {hall.has_sans ? "بله ✓" : "خیر ✗"}</p>
                {hall.has_sans && (
                  <>
                    <p className="break-words"><span className="font-medium text-gray-700">قیمت سانس:</span> {hall.sans_price?.toLocaleString()} تومان</p>
                    <p className="break-words"><span className="font-medium text-gray-700">تخفیف سانس:</span> {hall.sans_discount}%</p>
                  </>
                )}
              </div>
            </div>

            {/* توضیحات */}
            {hall.description && (
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-md p-4 sm:p-5">
                <h3 className="font-bold text-[#2C2418] flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 text-sm sm:text-base">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4B06A] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  توضیحات تالار
                </h3>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed break-words">{hall.description.slice(0, 40)}...</p>
              </div>
            )}

            {/* امکانات - اصلاح شده برای آرایه */}
            {hall.properties && hall.properties.length > 0 && (
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-md p-4 sm:p-5">
                <h3 className="font-bold text-[#2C2418] flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 text-sm sm:text-base">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4B06A] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  امکانات تالار
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {hall.properties.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#D4B06A] rounded-full flex-shrink-0"></span>
                      <span className="break-words">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* نقش‌های تالار */}
            {hall.hall_roles && hall.hall_roles.length > 0 && (
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-md p-4 sm:p-5">
                <h3 className="font-bold text-[#2C2418] flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 text-sm sm:text-base">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4B06A] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  قوانین و مقررات
                </h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {hall.hall_roles.map((role, idx) => (
                    <span key={idx} className="px-2 sm:px-3 py-1 bg-[#D4B06A]/10 text-[#D4B06A] rounded-lg text-xs sm:text-sm font-medium break-words">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* تاریخ‌های آزاد */}
            {hall.free_dates && hall.free_dates.length > 0 && (
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-md p-4 sm:p-5">
                <h3 className="font-bold text-[#2C2418] flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 text-sm sm:text-base">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4B06A] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  تاریخ‌های آزاد
                </h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {hall.free_dates.map((date, idx) => (
                    <span key={idx} className="px-2 sm:px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs sm:text-sm font-medium break-words">
                      {formatDate(date)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* بخش رزرو - سایدبار */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 sm:top-24">
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-xl p-4 sm:p-5 md:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-[#2C2418] mb-1.5">رزرو تالار</h3>
                <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-5 md:mb-6">
                  لطفاً بازه زمانی و تعداد مهمان را مشخص کنید
                </p>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-[#2C2418] text-xs sm:text-sm font-bold mb-1.5">
                      تاریخ شروع <span className="text-red-500">*</span>
                    </label>
                    <DatePicker
                      calendar={persian}
                      locale={persian_fa}
                      value={startDate}
                      onChange={setStartDate}
                      format="YYYY/MM/DD"
                      placeholder="انتخاب تاریخ شروع"
                      className="green"
                      inputClass="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl text-[#2C2418] text-xs sm:text-sm focus:outline-none focus:border-[#D4B06A] focus:ring-2 focus:ring-[#D4B06A]/20 transition-all duration-300"
                      containerClassName="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-[#2C2418] text-xs sm:text-sm font-bold mb-1.5">
                      تاریخ پایان <span className="text-red-500">*</span>
                    </label>
                    <DatePicker
                      calendar={persian}
                      locale={persian_fa}
                      value={endDate}
                      onChange={setEndDate}
                      format="YYYY/MM/DD"
                      placeholder="انتخاب تاریخ پایان"
                      className="green"
                      inputClass="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl text-[#2C2418] text-xs sm:text-sm focus:outline-none focus:border-[#D4B06A] focus:ring-2 focus:ring-[#D4B06A]/20 transition-all duration-300"
                      containerClassName="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-[#2C2418] text-xs sm:text-sm font-bold mb-1.5">
                      تعداد مهمان <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      placeholder="تعداد نفرات"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl 
                             text-[#2C2418] placeholder-gray-400 text-xs sm:text-sm
                             focus:outline-none focus:border-[#D4B06A] focus:ring-2 focus:ring-[#D4B06A]/20
                             transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[#2C2418] text-xs sm:text-sm font-bold mb-1.5">
                      توضیحات برای مالک
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows="3"
                      placeholder="توضیحات خود را وارد کنید..."
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl 
                             text-[#2C2418] placeholder-gray-400 text-xs sm:text-sm resize-none
                             focus:outline-none focus:border-[#D4B06A] focus:ring-2 focus:ring-[#D4B06A]/20
                             transition-all duration-300"
                    />
                  </div>

                  <button
                    onClick={handleReserve}
                    disabled={reserveLoading}
                    className="w-full bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white py-3 sm:py-3.5 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-xl transition-all duration-300 disabled:opacity-70"
                  >
                    {reserveLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>در حال ثبت...</span>
                      </div>
                    ) : (
                      "ثبت رزرو"
                    )}
                  </button>

                  <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-3 sm:mt-4">
                    پس از ثبت رزرو، مالک تالار درخواست شما را بررسی خواهد کرد
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}