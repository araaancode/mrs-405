// components/landing/AdvancedSearch.jsx
"use client";

import {
    useState,
    useEffect,
    useCallback,
    useMemo,
    lazy,
    Suspense,
} from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

/* ============================================================
   Lazy Load Icons
   ============================================================ */
const PiMagnifyingGlass = lazy(() =>
    import("react-icons/pi").then((mod) => ({
        default: mod.PiMagnifyingGlass,
    }))
);
const PiBuildings = lazy(() =>
    import("react-icons/pi").then((mod) => ({ default: mod.PiBuildings }))
);
const PiMapPin = lazy(() =>
    import("react-icons/pi").then((mod) => ({ default: mod.PiMapPin }))
);
const PiSparkle = lazy(() =>
    import("react-icons/pi").then((mod) => ({ default: mod.PiSparkle }))
);
const PiCalendarBlank = lazy(() =>
    import("react-icons/pi").then((mod) => ({
        default: mod.PiCalendarBlank,
    }))
);
const PiArrowLeft = lazy(() =>
    import("react-icons/pi").then((mod) => ({ default: mod.PiArrowLeft }))
);
const PiSpinnerGap = lazy(() =>
    import("react-icons/pi").then((mod) => ({ default: mod.PiSpinnerGap }))
);

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

const PROVINCES = [
    "آذربایجان شرقی",
    "آذربایجان غربی",
    "اردبیل",
    "اصفهان",
    "البرز",
    "ایلام",
    "بوشهر",
    "تهران",
    "چهارمحال و بختیاری",
    "خراسان جنوبی",
    "خراسان رضوی",
    "خراسان شمالی",
    "خوزستان",
    "زنجان",
    "سمنان",
    "سیستان و بلوچستان",
    "فارس",
    "قزوین",
    "قم",
    "کردستان",
    "کرمان",
    "کرمانشاه",
    "کهگیلویه و بویراحمد",
    "گلستان",
    "گیلان",
    "لرستان",
    "مازندران",
    "مرکزی",
    "هرمزگان",
    "همدان",
    "یزد",
];

/* ============================================================
   Field Wrapper — کامپوننت داخلی برای هر فیلد
   ============================================================ */
function Field({ icon: Icon, children }) {
    return (
        <div className="relative flex-1 w-full min-w-0">
            {Icon && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                    <Suspense fallback={<div className="w-4 h-4" />}>
                        <Icon className="w-4 h-4 text-gold-500" />
                    </Suspense>
                </div>
            )}
            {children}
        </div>
    );
}

/* ============================================================
   AdvancedSearch
   ============================================================ */
export default function AdvancedSearch({ onSearch }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [filters, setFilters] = useState({
        province: "",
        city: "",
        event_type: "",
        hall_type: "",
    });

    /* -------- Mount -------- */
    useEffect(() => {
        setIsMounted(true);
    }, []);

    /* -------- Change handler -------- */
    const handleChange = useCallback((name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
    }, []);

    /* -------- Submit -------- */
    const handleSearch = useCallback(
        (e) => {
            e.preventDefault();
            setLoading(true);

            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const queryString = params.toString();

            /* فراخوانی callback اختیاری */
            onSearch?.(filters);

            /* navigate */
            router.push(queryString ? `/halls?${queryString}` : "/halls");
        },
        [filters, router, onSearch]
    );

    /* -------- Options -------- */
    const provinceOptions = useMemo(
        () =>
            PROVINCES.map((province) => (
                <option key={province} value={province}>
                    {province}
                </option>
            )),
        []
    );

    const eventTypeOptions = useMemo(
        () =>
            EVENT_TYPES.map((item) => (
                <option key={item} value={item}>
                    {item}
                </option>
            )),
        []
    );

    const hallTypeOptions = useMemo(
        () =>
            HALL_TYPES.map((item) => (
                <option key={item} value={item}>
                    {item}
                </option>
            )),
        []
    );

    /* -------- input classes -------- */
    const inputClass = `
    w-full
    py-3.5 pr-11 pl-3.5
    bg-white
    border-2 border-slate-200
    rounded-xl
    text-[13.5px] text-slate-900
    placeholder:text-slate-400
    hover:border-gold-300
    focus:outline-none
    focus:border-gold-500
    focus:ring-4 focus:ring-gold-500/10
    transition-all duration-200
  `;

    const selectClass = `
    ${inputClass}
    appearance-none
    cursor-pointer
    bg-no-repeat
  `;

    /* ============================================================
       Render
       ============================================================ */
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-4xl mx-auto px-3 sm:px-4 -mt-20 sm:-mt-24 relative z-20"
        >
            <form
                onSubmit={handleSearch}
                className="
          bg-white/95 backdrop-blur-sm
          rounded-3xl
          ring-1 ring-slate-100
          shadow-[0_20px_50px_-15px_rgba(15,23,42,0.15)]
          overflow-hidden
        "
            >
                {/* ==================== Header ==================== */}
                <div className="bg-gradient-to-l from-gold-50/60 via-white to-white border-b border-slate-100 px-5 py-4">
                    <div className="flex items-center justify-center gap-2">

                        <span className="font-bold text-[14px] text-slate-800">
                            جستجوی هوشمند تالار
                        </span>
                    </div>
                </div>

                {/* ==================== Fields ==================== */}
                <div className="p-4 sm:p-5 md:p-6">
                    <div className="flex flex-col md:flex-row gap-3 items-stretch">
                        {/* استان */}
                        <Field icon={PiMapPin}>
                            <select
                                value={filters.province}
                                onChange={(e) => handleChange("province", e.target.value)}
                                className={selectClass}
                                aria-label="استان"
                            >
                                <option value="">انتخاب استان</option>
                                {provinceOptions}
                            </select>
                        </Field>

                        {/* شهر */}
                        <Field icon={PiMapPin}>
                            <input
                                type="text"
                                placeholder="نام شهر"
                                value={filters.city}
                                onChange={(e) => handleChange("city", e.target.value)}
                                className={inputClass}
                                aria-label="شهر"
                                enterKeyHint="search"
                            />
                        </Field>

                        {/* نوع مراسم */}
                        <Field icon={PiCalendarBlank}>
                            <select
                                value={filters.event_type}
                                onChange={(e) =>
                                    handleChange("event_type", e.target.value)
                                }
                                className={selectClass}
                                aria-label="نوع مراسم"
                            >
                                <option value="">نوع مراسم</option>
                                {eventTypeOptions}
                            </select>
                        </Field>

                        {/* نوع تالار */}
                        <Field icon={PiSparkle}>
                            <select
                                value={filters.hall_type}
                                onChange={(e) =>
                                    handleChange("hall_type", e.target.value)
                                }
                                className={selectClass}
                                aria-label="نوع تالار"
                            >
                                <option value="">نوع تالار</option>
                                {hallTypeOptions}
                            </select>
                        </Field>

                        {/* دکمه جستجو */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="
                group flex items-center justify-center gap-2
                px-6 sm:px-8 py-3.5
                rounded-xl
                text-sm font-bold text-white
                bg-gradient-to-b from-gold-400 to-gold-600
                hover:from-gold-500 hover:to-gold-700
                shadow-md shadow-gold-500/25
                hover:shadow-lg hover:shadow-gold-500/40
                hover:-translate-y-0.5
                active:scale-95
                focus:outline-none focus:ring-4 focus:ring-gold-500/25
                disabled:opacity-70 disabled:cursor-not-allowed
                disabled:hover:translate-y-0 disabled:hover:shadow-md
                min-w-[120px]
                transition-all duration-200
                flex-shrink-0
              "
                        >
                            {loading ? (
                                <>
                                    <Suspense fallback={<div className="w-5 h-5" />}>
                                        <PiSpinnerGap className="w-5 h-5 animate-spin" />
                                    </Suspense>
                                    <span>در حال جستجو...</span>
                                </>
                            ) : (
                                <>
                                    <Suspense fallback={<div className="w-5 h-5" />}>
                                        <PiMagnifyingGlass className="w-5 h-5" />
                                    </Suspense>
                                    <span>جستجو</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </motion.div>
    );
}