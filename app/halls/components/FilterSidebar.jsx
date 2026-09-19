// app/halls/components/FilterSidebar.jsx
"use client";
import { PiX, PiCheck } from "react-icons/pi";
import { useFilterStore } from "../store/filterStore";
import {
    PROVINCES, HALL_TYPES, EVENT_TYPES, HOST_TYPES,
    CAPACITY_RANGES, PRICE_RANGES, PROPERTIES_FILTER,
} from "../constants";

function Section({ title, children }) {
    return (
        <div className="pb-5 mb-5 border-b border-gray-100 last:border-0">
            <h4 className="font-bold text-[#2C2418] mb-3 text-sm">{title}</h4>
            {children}
        </div>
    );
}

function Chip({ active, onClick, children }) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 text-xs rounded-lg border-2 transition-all ${active
                    ? "bg-[#D4B06A] border-[#D4B06A] text-white font-bold"
                    : "bg-white border-gray-200 text-gray-600 hover:border-[#D4B06A]"
                }`}
        >
            {children}
        </button>
    );
}

export default function FilterSidebar({ open, onClose }) {
    const { filters, setFilter, toggleProperty, resetFilters } = useFilterStore();

    const content = (
        <div className="space-y-2">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="font-black text-[#2C2418] text-lg">فیلترها</h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={resetFilters}
                        className="text-xs text-red-500 hover:text-red-700 font-bold"
                    >
                        پاک کردن همه
                    </button>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
                        aria-label="بستن"
                    >
                        <PiX className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <Section title="استان">
                <select
                    value={filters.province}
                    onChange={(e) => setFilter("province", e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#D4B06A]"
                >
                    <option value="">همه استان‌ها</option>
                    {PROVINCES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
            </Section>

            <Section title="ظرفیت">
                <div className="space-y-2">
                    {CAPACITY_RANGES.map((r) => {
                        const active = filters.capacityRange?.label === r.label;
                        return (
                            <button
                                key={r.label}
                                onClick={() => setFilter("capacityRange", active ? null : r)}
                                className={`w-full text-right px-3 py-2 text-sm rounded-lg border-2 transition-all flex items-center justify-between ${active
                                        ? "bg-[#D4B06A]/10 border-[#D4B06A] text-[#2C2418] font-bold"
                                        : "bg-white border-gray-100 hover:border-gray-200"
                                    }`}
                            >
                                <span>{r.label}</span>
                                {active && <PiCheck className="w-4 h-4 text-[#D4B06A]" />}
                            </button>
                        );
                    })}
                </div>
            </Section>

            <Section title="محدوده قیمت">
                <div className="space-y-2">
                    {PRICE_RANGES.map((r) => {
                        const active = filters.priceRange?.label === r.label;
                        return (
                            <button
                                key={r.label}
                                onClick={() => setFilter("priceRange", active ? null : r)}
                                className={`w-full text-right px-3 py-2 text-sm rounded-lg border-2 transition-all flex items-center justify-between ${active
                                        ? "bg-[#D4B06A]/10 border-[#D4B06A] text-[#2C2418] font-bold"
                                        : "bg-white border-gray-100 hover:border-gray-200"
                                    }`}
                            >
                                <span>{r.label}</span>
                                {active && <PiCheck className="w-4 h-4 text-[#D4B06A]" />}
                            </button>
                        );
                    })}
                </div>
            </Section>

            <Section title="نوع تالار">
                <div className="flex flex-wrap gap-1.5">
                    {HALL_TYPES.map((t) => (
                        <Chip
                            key={t}
                            active={filters.hall_type === t}
                            onClick={() => setFilter("hall_type", filters.hall_type === t ? "" : t)}
                        >
                            {t}
                        </Chip>
                    ))}
                </div>
            </Section>

            <Section title="نوع مراسم">
                <div className="flex flex-wrap gap-1.5">
                    {EVENT_TYPES.map((t) => (
                        <Chip
                            key={t}
                            active={filters.event_type === t}
                            onClick={() => setFilter("event_type", filters.event_type === t ? "" : t)}
                        >
                            {t}
                        </Chip>
                    ))}
                </div>
            </Section>

            <Section title="نوع پذیرایی">
                <div className="flex flex-wrap gap-1.5">
                    {HOST_TYPES.map((t) => (
                        <Chip
                            key={t}
                            active={filters.host_type === t}
                            onClick={() => setFilter("host_type", filters.host_type === t ? "" : t)}
                        >
                            {t}
                        </Chip>
                    ))}
                </div>
            </Section>

            <Section title="امکانات">
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

            <Section title="سایر">
                <label className="flex items-center gap-2 cursor-pointer py-1.5">
                    <input
                        type="checkbox"
                        checked={filters.hasParking}
                        onChange={(e) => setFilter("hasParking", e.target.checked)}
                        className="w-4 h-4 accent-[#D4B06A]"
                    />
                    <span className="text-sm text-gray-700">دارای پارکینگ</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer py-1.5">
                    <input
                        type="checkbox"
                        checked={filters.hasSans}
                        onChange={(e) => setFilter("hasSans", e.target.checked)}
                        className="w-4 h-4 accent-[#D4B06A]"
                    />
                    <span className="text-sm text-gray-700">قابلیت رزرو سانس</span>
                </label>
            </Section>
        </div>
    );

    return (
        <>
            {/* دسکتاپ */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
                <div className="sticky top-24 bg-white rounded-2xl shadow-md p-5 max-h-[calc(100vh-7rem)] overflow-y-auto">
                    {content}
                </div>
            </aside>

            {/* موبایل - Drawer */}
            {open && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl overflow-y-auto p-5 animate-in slide-in-from-right">
                        {content}
                    </div>
                </div>
            )}
        </>
    );
}