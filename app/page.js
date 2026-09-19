// app/page.js
"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import axios from "axios";

// ==========================================
// Lazy Load کامپوننت‌های سنگین
// ==========================================

const HeroSlider = dynamic(() => import("@/components/landing/HeroSlider"), {
  loading: () => (
    <div className="w-full h-[500px] bg-gray-100 animate-pulse rounded-2xl" />
  ),
  ssr: false
});

const AdvancedSearch = dynamic(() => import("@/components/landing/AdvancedSearch"), {
  loading: () => (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg min-h-[400px] animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded-lg mx-auto mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-12 bg-gray-200 rounded-xl" />
        ))}
      </div>
    </div>
  ),
});

const PopularCities = dynamic(() => import("@/components/landing/PopularCities"), {
  loading: () => (
    <div className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-8 w-48 bg-gray-200 rounded-lg mx-auto mb-8 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className="h-24 sm:h-28 bg-gray-200 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  ),
});

const PopularHalls = dynamic(() => import("@/components/landing/PopularHalls"), {
  loading: () => (
    <div className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-8 w-48 bg-gray-200 rounded-lg mx-auto mb-8 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className="h-72 bg-gray-200 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  ),
});

// ==========================================
// کامپوننت اصلی صفحه
// ==========================================

export default function HomePage() {
  const [halls, setHalls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==========================================
  // دریافت داده‌ها از API
  // ==========================================
  useEffect(() => {
    const abortController = new AbortController();

    const fetchHalls = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get("/api/halls", {
          signal: abortController.signal,
          timeout: 15000,
          headers: {
            "Content-Type": "application/json"
          }
        });

        // استخراج داده‌ها از ساختارهای مختلف پاسخ
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
          // تلاش برای استخراج از Object
          const possibleArray = Object.values(result).filter(
            item =>
              item &&
              typeof item === "object" &&
              (item._id || item.id)
          );
          hallsData = possibleArray;
        }

        setHalls(hallsData);
      } catch (err) {
        // بررسی لغو شدن درخواست (سازگار با axios جدید)
        if (
          err.name === "CanceledError" ||
          err.code === "ERR_CANCELED" ||
          axios.isCancel?.(err)
        ) {
          return; // درخواست لغو شده، کاری نکن
        }

        console.error("Error fetching halls:", err);

        if (err.code === "ECONNABORTED") {
          setError(
            "مدت زمان درخواست به پایان رسید. لطفاً دوباره تلاش کنید."
          );
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
    };

    fetchHalls();

    return () => {
      abortController.abort();
    };
  }, []);

  // ==========================================
  // مدیریت جستجو
  // ==========================================
  const handleSearch = useCallback((searchData) => {
    // TODO: پیاده‌سازی جستجو
    console.log("Search:", searchData);
  }, []);

  // ==========================================
  // رندر
  // ==========================================
  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Advanced Search */}
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        <AdvancedSearch onSearch={handleSearch} />
      </div>

      {/* Popular Cities */}
      <PopularCities />

      {/* Popular Halls - فقط اگر داده وجود داشته باشد */}
      {!isLoading && halls.length > 0 && (
        <PopularHalls halls={halls} />
      )}

      {/* حالت بارگذاری برای تالارها */}
      {isLoading && (
        <div className="w-full py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="h-8 w-48 bg-gray-200 rounded-lg mx-auto mb-8 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div
                  key={i}
                  className="h-72 bg-gray-200 rounded-xl animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* حالت خالی بودن داده‌ها */}
      {!isLoading && halls.length === 0 && !error && (
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            هنوز تالاری ثبت نشده
          </h3>
          <p className="text-gray-500 text-sm">
            به زودی تالارهای جدید اضافه می‌شوند
          </p>
        </div>
      )}

      {/* نمایش خطا */}
      {error && halls.length === 0 && (
        <div className="max-w-md mx-auto px-4 py-12 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            خطا در بارگذاری
          </h3>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#D4B06A] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#B8922E] transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      )}
    </div>
  );
}