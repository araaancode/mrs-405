// app/halls/components/FilterSidebar.jsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PiX, PiCheck, PiFunnel } from "react-icons/pi";
import { useFilterStore } from "../store/filterStore";
import {
    PROVINCES,
    HALL_TYPES,
    EVENT_TYPES,
    HOST_TYPES,
    CAPACITY_RANGES,
    PRICE_RANGES,
    PROPERTIES_FILTER,
} from "../constants";

/* ============================================================
   Section — بخش با عنوان
   ============================================================ */
function Section({ title, children, count }) {
    return (
        <div className="pb-5 mb-5 border-b border-slate-100 last:border-0 last:mb-0 last:pb-0">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5">
                    {title}
                    {count > 0 && (
                        <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-gold-100 text-gold-700 text-[10px] font-bold">
                            {count}
                        </span>
                    )}
                </h4>
            </div>
            {children}
        </div>
    );
}

/* ============================================================
   Chip — دکمه‌ی کوچک انتخابی
   ============================================================ */
function Chip({ active, onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
        inline-flex items-center gap-1
        px-3 py-1.5 rounded-lg
        text-[11.5px] font-medium
        border transition-all duration-200
        ${active
                    ? "bg-gradient-to-b from-gold-400 to-gold-600 border-gold-500 text-white shadow-sm shadow-gold-500/25"
                    : "bg-white border-slate-200 text-slate-600 hover:border-gold-300 hover:text-gold-700 hover:bg-gold-50/40"
                }
      `}
        >
            {active && <PiCheck className="w-3 h-3" strokeWidth={3} />}
            {children}
        </button>
    );
}

/* ============================================================
   OptionRow — گزینه‌ی رادیویی به‌سبک کارت
   ============================================================ */
function OptionRow({ active, onClick, label }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
        w-full text-right px-3 py-2 rounded-lg
        text-[12.5px] transition-all duration-200
        flex items-center justify-between gap-2
        border
        ${active
                    ? "bg-gold-50 border-gold-200 text-slate-800 font-semibold"
                    : "bg-white border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50"
                }
      `}
        >
            <span className="truncate">{label}</span>
            <span
                className={`
          w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0
          border-2 transition-all
          ${active
                        ? "border-gold-500 bg-gold-500"
                        : "border-slate-200 bg-white"
                    }
        `}
            >
                {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
            </span>
        </button>
    );
}

/* ============================================================
   CheckboxRow — چک‌باکس با استایل سفارشی
   ============================================================ */
function CheckboxRow({ checked, onChange, label }) {
    return (
        <label className="flex items-center gap-2.5 cursor-pointer py-2 group">
            <span
                className={`
          relative w-[18px] h-[18px] rounded-md
          border-2 flex items-center justify-center flex-shrink-0
          transition-all duration-200
          ${checked
                        ? "border-gold-500 bg-gradient-to-b from-gold-400 to-gold-600"
                        : "border-slate-300 bg-white group-hover:border-gold-400"
                    }
        `}
            >
                {checked && (
                    <PiCheck
                        className="w-3 h-3 text-white"
                        strokeWidth={3}
                    />
                )}
            </span>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="sr-only"
            />
            <span className="text-[13px] text-slate-700 group-hover:text-slate-900">
                {label}
            </span>
        </label>
    );
}

/* ============================================================
   FilterSidebar
   ============================================================ */
export default function FilterSidebar({ open, onClose }) {
    const { filters, setFilter, toggleProperty, resetFilters } =
        useFilterStore();

    /* شمارش فعال در هر بخش */
    const countBy = {
        capacity: filters.capacityRange ? 1 : 0,
        price: filters.priceRange ? 1 : 0,
        hall_type: filters.hall_type ? 1 : 0,
        event_type: filters.event_type ? 1 : 0,
        host_type: filters.host_type ? 1 : 0,
        properties: filters.properties?.length || 0,
        other:
            (filters.hasParking ? 1 : 0) + (filters.hasSans ? 1 : 0),
    };

    const totalCount =
        countBy.capacity +
        countBy.price +
        countBy.hall_type +
        countBy.event_type +
        countBy.host_type +
        countBy.properties +
        countBy.other +
        (filters.province ? 1 : 0);

    const content = (
        <div className="space-y-0">
            {/* ==================== هدر ==================== */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gold-50 flex items-center justify-center ring-1 ring-gold-100">
                        <PiFunnel className="w-4 h-4 text-gold-600" />
                    </div>
                    <div>
                        <h3 className="text-[15px] font-bold text-slate-900 leading-tight">
                            فیلترها
                        </h3>
                        {totalCount > 0 && (
                            <p className="text-[10px] text-slate-400 mt-0.5">
                                {totalCount.toLocaleString("fa-IR")} فیلتر فعال
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-1.5">
                    {totalCount > 0 && (
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="
                text-[11px] font-medium
                text-rose-500 hover:text-rose-600
                px-2.5 py-1.5 rounded-lg
                hover:bg-rose-50
                transition-all
              "
                        >
                            پاک کردن همه
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        className="
              lg:hidden
              w-8 h-8 rounded-lg
              flex items-center justify-center
              text-slate-500 hover:text-slate-800
              hover:bg-slate-100
              transition-all
            "
                        aria-label="بستن"
                    >
                        <PiX className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* ==================== استان ==================== */}
            <Section title="استان">
                <select
                    value={filters.province}
                    onChange={(e) => setFilter("province", e.target.value)}
                    className="
            w-full px-3 py-2.5 text-[13px] rounded-xl
            bg-white border border-slate-200
            text-slate-700
            hover:border-gold-300
            focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10
            transition-all duration-200
            cursor-pointer
          "
                >
                    <option value="">همه استان‌ها</option>
                    {PROVINCES.map((p) => (
                        <option key={p} value={p}>
                            {p}
                        </option>
                    ))}
                </select>
            </Section>

            {/* ==================== ظرفیت ==================== */}
            <Section title="ظرفیت" count={countBy.capacity}>
                <div className="space-y-1.5">
                    {CAPACITY_RANGES.map((r) => (
                        <OptionRow
                            key={r.label}
                            label={r.label}
                            active={filters.capacityRange?.label === r.label}
                            onClick={() =>
                                setFilter(
                                    "capacityRange",
                                    filters.capacityRange?.label === r.label ? null : r
                                )
                            }
                        />
                    ))}
                </div>
            </Section>

            {/* ==================== قیمت ==================== */}
            <Section title="محدوده قیمت" count={countBy.price}>
                <div className="space-y-1.5">
                    {PRICE_RANGES.map((r) => (
                        <OptionRow
                            key={r.label}
                            label={r.label}
                            active={filters.priceRange?.label === r.label}
                            onClick={() =>
                                setFilter(
                                    "priceRange",
                                    filters.priceRange?.label === r.label ? null : r
                                )
                            }
                        />
                    ))}
                </div>
            </Section>

            {/* ==================== نوع تالار ==================== */}
            <Section title="نوع تالار" count={countBy.hall_type}>
                <div className="flex flex-wrap gap-1.5">
                    {HALL_TYPES.map((t) => (
                        <Chip
                            key={t}
                            active={filters.hall_type === t}
                            onClick={() =>
                                setFilter("hall_type", filters.hall_type === t ? "" : t)
                            }
                        >
                            {t}
                        </Chip>
                    ))}
                </div>
            </Section>

            {/* ==================== نوع مراسم ==================== */}
            <Section title="نوع مراسم" count={countBy.event_type}>
                <div className="flex flex-wrap gap-1.5">
                    {EVENT_TYPES.map((t) => (
                        <Chip
                            key={t}
                            active={filters.event_type === t}
                            onClick={() =>
                                setFilter("event_type", filters.event_type === t ? "" : t)
                            }
                        >
                            {t}
                        </Chip>
                    ))}
                </div>
            </Section>

            {/* ==================== نوع پذیرایی ==================== */}
            <Section title="نوع پذیرایی" count={countBy.host_type}>
                <div className="flex flex-wrap gap-1.5">
                    {HOST_TYPES.map((t) => (
                        <Chip
                            key={t}
                            active={filters.host_type === t}
                            onClick={() =>
                                setFilter("host_type", filters.host_type === t ? "" : t)
                            }
                        >
                            {t}
                        </Chip>
                    ))}
                </div>
            </Section>

            {/* ==================== امکانات ==================== */}
            <Section title="امکانات" count={countBy.properties}>
                <div className="flex flex-wrap gap-1.5">
                    {PROPERTIES_FILTER.map((p) => (
                        <Chip
                            key={p}
                            active={filters.properties.includes(p)}
                            onClick={() => toggleProperty(p)}
                        >
                            {p}
                        </Chip>
                    ))}
                </div>
            </Section>

            {/* ==================== سایر ==================== */}
            <Section title="سایر" count={countBy.other}>
                <div className="space-y-0.5">
                    <CheckboxRow
                        checked={filters.hasParking}
                        onChange={(e) => setFilter("hasParking", e.target.checked)}
                        label="دارای پارکینگ"
                    />
                    <CheckboxRow
                        checked={filters.hasSans}
                        onChange={(e) => setFilter("hasSans", e.target.checked)}
                        label="قابلیت رزرو سانس"
                    />
                </div>
            </Section>
        </div>
    );

    return (
        <>
            {/* ==================== دسکتاپ ==================== */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
                <div
                    className="
            sticky top-24
            bg-white/70 backdrop-blur-xl
            rounded-2xl
            border border-white/60
            shadow-[0_8px_32px_rgba(198,161,76,0.08),0_2px_8px_rgba(0,0,0,0.04)]
            p-5
            max-h-[calc(100vh-7rem)]
            overflow-y-auto
            scrollbar-thin
          "
                >
                    {content}
                </div>
            </aside>

            {/* ==================== موبایل — Drawer ==================== */}
            <AnimatePresence>
                {open && (
                    <div className="lg:hidden fixed inset-0 z-50">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={onClose}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 320, damping: 32 }}
                            className="
                absolute right-0 top-0 h-full
                w-[85%] max-w-sm
                bg-white
                rounded-l-3xl
                shadow-2xl
                overflow-y-auto
                p-5
                scrollbar-thin
              "
                        >
                            {content}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}