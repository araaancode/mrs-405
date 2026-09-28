// app/page.js
"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { motion } from "framer-motion";
import { PiBuildings, PiWarningCircle, PiArrowClockwise } from "react-icons/pi";

/* ============================================================
   Lazy Load — کامپوننت‌های سنگین
   ============================================================ */

/* ---------- Hero Slider ---------- */
const HeroSlider = dynamic(
  () => import("@/components/landing/HeroSlider"),
  {
    loading: () => (
      <div className="w-full h-[500px] bg-slate-100 animate-pulse rounded-2xl" />
    ),
    ssr: false,
  }
);

/* ---------- Advanced Search ---------- */
const AdvancedSearch = dynamic(
  () => import("@/components/landing/AdvancedSearch"),
  {
    loading: () => (
      <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg min-h-[400px] animate-pulse">
        <div className="h-8 w-48 bg-slate-100 rounded-lg mx-auto mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    ),
  }
);

/* ---------- Popular Cities ---------- */
const PopularCities = dynamic(
  () => import("@/components/landing/PopularCities"),
  {
    loading: () => (
      <div className="w-full py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-8 w-48 bg-slate-100 rounded-lg mx-auto mb-8 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-24 sm:h-28 bg-slate-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    ),
  }
);

/* ---------- Popular Halls ---------- */
const PopularHalls = dynamic(
  () => import("@/components/landing/PopularHalls"),
  {
    loading: () => (
      <div className="w-full py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-8 w-48 bg-slate-100 rounded-lg mx-auto mb-8 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-72 bg-slate-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    ),
  }
);

/* ============================================================
   کامپوننت‌های کمکی
   ============================================================ */

/* ---------- Loading State (اسکلتون) ---------- */
function HallsSkeleton() {
  return (
    <div className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* هدر */}
        <div className="text-center mb-10">
          <div className="h-8 w-48 bg-slate-100 rounded-lg mx-auto mb-3 animate-pulse" />
          <div className="w-20 h-1 bg-slate-100 rounded-full mx-auto" />
        </div>

        {/* گرید */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl ring-1 ring-slate-100 overflow-hidden"
            >
              <div className="h-44 bg-slate-100 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-5 w-3/4 bg-slate-100 rounded-lg animate-pulse" />
                <div className="h-3.5 w-1/2 bg-slate-100 rounded-md animate-pulse" />
                <div className="flex gap-2 pt-2">
                  <div className="h-6 w-20 bg-slate-100 rounded-lg animate-pulse" />
                  <div className="h-6 w-16 bg-slate-100 rounded-lg animate-pulse" />
                </div>
                <div className="h-9 w-full bg-slate-100 rounded-lg animate-pulse mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Empty State ---------- */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-2xl mx-auto px-4 py-16 text-center"
    >
      <div className="relative w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-gold-50 to-gold-100/60 flex items-center justify-center ring-1 ring-gold-100">
        <div className="absolute inset-0 rounded-3xl bg-gold-500/5 blur-xl" />
        <PiBuildings className="relative w-10 h-10 text-gold-500" />
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
        هنوز تالاری ثبت نشده است
      </h3>
      <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
        به زودی تالارهای جدید به سیستم اضافه خواهند شد
      </p>
    </motion.div>
  );
}

/* ---------- Error State ---------- */
function ErrorState({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-xl mx-auto px-4 py-16 text-center"
    >
      <div className="relative w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-rose-50 to-rose-100/60 flex items-center justify-center ring-1 ring-rose-100">
        <div className="absolute inset-0 rounded-3xl bg-rose-500/5 blur-xl" />
        <PiWarningCircle className="relative w-10 h-10 text-rose-500" />
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
        خطا در بارگذاری
      </h3>
      <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-6">
        {message || "متأسفانه در دریافت اطلاعات مشکلی پیش آمد."}
      </p>

      <button
        onClick={onRetry}
        className="
          inline-flex items-center gap-2
          px-6 py-3 rounded-xl
          text-sm font-bold text-white
          bg-gradient-to-b from-gold-400 to-gold-600
          hover:from-gold-500 hover:to-gold-700
          shadow-md shadow-gold-500/25
          hover:shadow-lg hover:shadow-gold-500/40
          hover:-translate-y-0.5
          focus:outline-none focus:ring-4 focus:ring-gold-500/25
          active:scale-95
          transition-all duration-300
        "
      >
        <PiArrowClockwise className="w-4 h-4" />
        تلاش مجدد
      </button>
    </motion.div>
  );
}

/* ============================================================
   کامپوننت اصلی
   ============================================================ */
export default function HomePage() {
  const [halls, setHalls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ============================================================
     دریافت داده‌ها از API
     ============================================================ */
  const fetchHalls = useCallback(async (signal) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get("/api/halls", {
        signal,
        timeout: 15000,
        headers: { "Content-Type": "application/json" },
      });

      /* استخراج داده‌ها از ساختارهای مختلف */
      const result = response.data;
      let hallsData = [];

      if (Array.isArray(result)) {
        hallsData = result;
      } else if (Array.isArray(result?.data)) {
        hallsData = result.data;
      } else if (Array.isArray(result?.halls)) {
        hallsData = result.halls;
      } else if (Array.isArray(result?.results)) {
        hallsData = result.results;
      } else if (Array.isArray(result?.items)) {
        hallsData = result.items;
      } else if (result && typeof result === "object") {
        const possibleArray = Object.values(result).filter(
          (item) =>
            item && typeof item === "object" && (item._id || item.id)
        );
        hallsData = possibleArray;
      }

      setHalls(hallsData);
    } catch (err) {
      /* بررسی لغو درخواست */
      if (
        err.name === "CanceledError" ||
        err.code === "ERR_CANCELED" ||
        axios.isCancel?.(err)
      ) {
        return;
      }

      console.error("Error fetching halls:", err);

      if (err.code === "ECONNABORTED") {
        setError("مدت زمان درخواست به پایان رسید. لطفاً دوباره تلاش کنید.");
      } else if (err.response) {
        setError(
          err.response?.data?.message ||
          `خطای سرور: ${err.response.status}`
        );
      } else if (err.request) {
        setError("سرور پاسخ نمی‌دهد. لطفاً دوباره تلاش کنید.");
      } else {
        setError(err.message || "خطا در بارگذاری داده‌ها");
      }

      setHalls([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    fetchHalls(abortController.signal);

    return () => abortController.abort();
  }, [fetchHalls]);

  /* ============================================================
     مدیریت جستجو
     ============================================================ */
  const handleSearch = useCallback((searchData) => {
    console.log("Search:", searchData);
  }, []);

  /* ============================================================
     Retry
     ============================================================ */
  const handleRetry = useCallback(() => {
    const abortController = new AbortController();
    fetchHalls(abortController.signal);
  }, [fetchHalls]);

  /* ============================================================
     Render
     ============================================================ */
  return (
    <div className="min-h-screen bg-[#FDFCF9]">
      {/* ==================== Hero Slider ==================== */}
      <HeroSlider />

      {/* ==================== Advanced Search ==================== */}
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        <AdvancedSearch onSearch={handleSearch} />
      </div>

      {/* ==================== Popular Cities ==================== */}
      <PopularCities />

      {/* ==================== Popular Halls ==================== */}
      {isLoading && <HallsSkeleton />}

      {!isLoading && halls.length > 0 && !error && (
        <PopularHalls halls={halls} />
      )}

      {!isLoading && halls.length === 0 && !error && <EmptyState />}

      {!isLoading && error && halls.length === 0 && (
        <ErrorState message={error} onRetry={handleRetry} />
      )}
    </div>
  );
}