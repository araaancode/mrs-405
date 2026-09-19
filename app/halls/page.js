// app/halls/page.js
"use client";
import { useState } from "react";
import { PiBuildings, PiWarningCircle } from "react-icons/pi";
import { useHalls } from "./hooks/useHalls";
import { useHallFilters } from "./hooks/useHallFilters";
import { useFilterStore } from "./store/filterStore";
import SearchBar from "./components/SearchBar";
import FilterSidebar from "./components/FilterSidebar";
import ActiveFiltersBar from "./components/ActiveFiltersBar";
import SortDropdown from "./components/SortDropdown";
import HallCard from "./components/HallCard";
import SkeletonCard from "./components/SkeletonCard";

export default function HallsPage() {
  const { halls, loading, error, refresh } = useHalls();
  const { filters, sort, viewMode, getActiveFilterCount, resetFilters } = useFilterStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useHallFilters(halls, filters, sort);
  const activeCount = getActiveFilterCount();

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* هدر */}
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-[#2C2418] mb-2">
            تالارهای مراسم
          </h1>
          <p className="text-gray-500">
            {loading
              ? "در حال بارگذاری..."
              : `${filtered.length.toLocaleString("fa-IR")} تالار موجود`}
          </p>
        </header>

        {/* جستجو */}
        <div className="mb-6">
          <SearchBar
            onOpenFilters={() => setDrawerOpen(true)}
            activeFilterCount={activeCount}
          />
        </div>

        {/* بدنه */}
        <div className="flex gap-6">
          {/* سایدبار */}
          <FilterSidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />

          {/* محتوا */}
          <main className="flex-1 min-w-0">
            {/* نوار بالای نتایج */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">
                {!loading && `${filtered.length.toLocaleString("fa-IR")} نتیجه`}
              </span>
              <SortDropdown />
            </div>

            {/* فیلترهای فعال */}
            <ActiveFiltersBar />

            {/* حالت خطا */}
            {error && !loading && (
              <div className="text-center py-20 bg-white rounded-2xl border border-red-100">
                <PiWarningCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  خطا در بارگذاری
                </h3>
                <p className="text-gray-500 text-sm mb-5">
                  {error?.response?.data?.message || "مشکلی پیش آمد"}
                </p>
                <button
                  onClick={refresh}
                  className="px-6 py-2.5 bg-[#D4B06A] text-white rounded-xl font-bold hover:bg-[#c39f59] transition-colors"
                >
                  تلاش مجدد
                </button>
              </div>
            )}

            {/* لودینگ */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {/* خالی */}
            {!loading && !error && filtered.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl">
                <PiBuildings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  تالاری یافت نشد
                </h3>
                <p className="text-gray-500 text-sm mb-5">
                  با فیلترهای انتخابی تالایی پیدا نشد
                </p>
                {activeCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="px-6 py-2.5 bg-[#D4B06A] text-white rounded-xl font-bold hover:bg-[#c39f59] transition-colors"
                  >
                    پاک کردن فیلترها
                  </button>
                )}
              </div>
            )}

            {/* نتایج */}
            {!loading && !error && filtered.length > 0 && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {filtered.map((hall, i) => (
                  <HallCard
                    key={hall._id}
                    hall={hall}
                    index={i}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}