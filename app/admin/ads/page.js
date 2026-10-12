// app/admin/ads/page.jsx
"use client";

import {
    useState,
    useEffect,
    useMemo,
    useRef,
    useCallback,
    memo,
} from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
    PiMegaphone,
    PiWarningCircle,
    PiArrowClockwise,
    PiTrash,
    PiEye,
    PiCursorClick,
    PiCheckCircle,
    PiClock,
    PiXCircle,
    PiPauseCircle,
    PiPlayCircle,
    PiHourglass,
    PiCurrencyCircleDollar,
    PiCalendarBlank,
    PiUser,
    PiCaretRight,
    PiCaretLeft,
    PiCaretDoubleRight,
    PiCaretDoubleLeft,
    PiMagnifyingGlass,
    PiX,
    PiChartLine,
    PiCheck,
} from "react-icons/pi";

/* ============================================================
   Constants
   ============================================================ */
const PER_PAGE_OPTIONS = [5, 10, 20, 50];
const faNum = (n) => Number(n || 0).toLocaleString("fa-IR");

const TOAST_OPTIONS = {
    position: "top-left",
    autoClose: 3500,
    rtl: true,
    theme: "light",
    style: {
        fontFamily: "'IranianSans', system-ui, sans-serif",
        direction: "rtl",
        textAlign: "right",
        borderRadius: "14px",
        padding: "14px 18px",
        fontSize: "13.5px",
        background: "#ffffff",
        color: "#1e293b",
    },
};

/* ============================================================
   Status / Type Configs
   ============================================================ */
function getStatusInfo(status) {
    const map = {
        draft: {
            label: "پیش‌نویس",
            icon: PiClock,
            bg: "bg-slate-50",
            text: "text-slate-600",
            ring: "ring-slate-200",
            dot: "bg-slate-400",
        },
        pending: {
            label: "در انتظار تأیید",
            icon: PiHourglass,
            bg: "bg-amber-50",
            text: "text-amber-700",
            ring: "ring-amber-200",
            dot: "bg-amber-500",
        },
        approved: {
            label: "تأیید شده",
            icon: PiCheckCircle,
            bg: "bg-blue-50",
            text: "text-blue-700",
            ring: "ring-blue-200",
            dot: "bg-blue-500",
        },
        active: {
            label: "در حال نمایش",
            icon: PiPlayCircle,
            bg: "bg-emerald-50",
            text: "text-emerald-700",
            ring: "ring-emerald-200",
            dot: "bg-emerald-500",
        },
        paused: {
            label: "متوقف",
            icon: PiPauseCircle,
            bg: "bg-orange-50",
            text: "text-orange-700",
            ring: "ring-orange-200",
            dot: "bg-orange-500",
        },
        rejected: {
            label: "رد شده",
            icon: PiXCircle,
            bg: "bg-rose-50",
            text: "text-rose-700",
            ring: "ring-rose-200",
            dot: "bg-rose-500",
        },
        expired: {
            label: "منقضی شده",
            icon: PiClock,
            bg: "bg-slate-50",
            text: "text-slate-500",
            ring: "ring-slate-200",
            dot: "bg-slate-400",
        },
    };
    return map[status] || map.draft;
}

function getTypeLabel(type) {
    const map = {
        banner: "بنر",
        sidebar: "سایدبار",
        popup: "پاپ‌آپ",
        featured: "تالار ویژه",
        home_slider: "اسلایدر",
    };
    return map[type] || "تبلیغ";
}

const FILTERS = [
    { key: "all", label: "همه" },
    { key: "pending", label: "در انتظار" },
    { key: "active", label: "فعال" },
    { key: "paused", label: "متوقف" },
    { key: "rejected", label: "رد شده" },
    { key: "expired", label: "منقضی" },
];

/* ============================================================
   StatusBadge
   ============================================================ */
const StatusBadge = memo(function StatusBadge({ status }) {
    const info = getStatusInfo(status);
    const Icon = info.icon;
    const cls = [
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full",
        "text-[11px] font-bold ring-1",
        info.bg,
        info.text,
        info.ring,
    ].join(" ");
    return (
        <span className={cls}>
            <span
                className={[
                    "w-1.5 h-1.5 rounded-full",
                    info.dot,
                    status === "active" ? "animate-pulse" : "",
                ].join(" ")}
            />
            <Icon className="w-3.5 h-3.5" />
            {info.label}
        </span>
    );
});

/* ============================================================
   Skeleton
   ============================================================ */
const AdsSkeleton = memo(function AdsSkeleton() {
    return (
        <div className="w-full space-y-5 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl" />
                <div className="space-y-2">
                    <div className="h-7 w-48 bg-slate-100 rounded-lg" />
                    <div className="h-3.5 w-64 bg-slate-100 rounded-md" />
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 bg-slate-100 rounded-xl" />
                ))}
            </div>
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="bg-white rounded-2xl ring-1 ring-slate-100 p-5 space-y-3"
                >
                    <div className="h-6 w-32 bg-slate-100 rounded-full" />
                    <div className="h-5 w-2/3 bg-slate-100 rounded-lg" />
                </div>
            ))}
        </div>
    );
});

/* ============================================================
   EmptyState
   ============================================================ */
const EmptyState = memo(function EmptyState({ filtered, onReset }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="relative overflow-hidden bg-white rounded-3xl ring-1 ring-slate-100 shadow-[0_8px_32px_rgba(198,161,76,0.06)] p-8 sm:p-12 text-center"
        >
            <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 50% 0%, rgba(198,161,76,0.08) 0%, transparent 50%)",
                }}
            />
            <div className="relative w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-gold-50 to-gold-100/60 flex items-center justify-center ring-1 ring-gold-100">
                <PiMegaphone className="relative w-10 h-10 text-gold-500" />
            </div>
            <h3 className="relative text-lg sm:text-xl font-bold text-slate-900 mb-2">
                {filtered ? "تبلیغی یافت نشد" : "هنوز تبلیغی ثبت نشده"}
            </h3>
            <p className="relative text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-7">
                {filtered
                    ? "می‌توانید فیلتر یا جستجو را تغییر دهید."
                    : "تبلیغات تالارداران اینجا نمایش داده می‌شوند."}
            </p>
            {filtered && (
                <button
                    onClick={onReset}
                    className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
                >
                    <PiX className="w-4 h-4" />
                    پاک کردن فیلترها
                </button>
            )}
        </motion.div>
    );
});

/* ============================================================
   AdCard
   ============================================================ */
const AdCard = memo(function AdCard({ ad, index, onDelete, onPause, onResume }) {
    const image = ad.images?.[0] || null;
    const shortId = ad._id?.slice(-6).toUpperCase();

    const cardCls = [
        "group bg-white rounded-2xl",
        "ring-1 ring-slate-100 hover:ring-gold-200/70",
        "shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        "hover:shadow-[0_12px_32px_-12px_rgba(198,161,76,0.18)]",
        "transition-all duration-300 overflow-hidden",
    ].join(" ");

    const ctr =
        ad.stats?.views > 0
            ? ((ad.stats.clicks / ad.stats.views) * 100).toFixed(1)
            : "0.0";

    return (
        <motion.article
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
            className={cardCls}
        >
            <div className="p-5">
                {/* ردیف بالا */}
                <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={ad.status} />
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold-50 text-gold-700 text-[10.5px] font-bold ring-1 ring-gold-100">
                            {getTypeLabel(ad.ad_type)}
                        </span>
                    </div>
                    <span className="text-[10.5px] text-slate-400 font-mono">
                        #{shortId}
                    </span>
                </div>

                {/* تصویر + محتوا */}
                <div className="flex items-start gap-3 mb-4">
                    {image ? (
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden ring-1 ring-slate-100 flex-shrink-0 bg-slate-50">
                            <Image
                                src={image}
                                alt={ad.title}
                                fill
                                sizes="80px"
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-20 h-20 rounded-xl bg-gold-50 ring-1 ring-gold-100 flex items-center justify-center flex-shrink-0">
                            <PiMegaphone className="w-8 h-8 text-gold-500" />
                        </div>
                    )}

                    <div className="min-w-0 flex-1">
                        <h3 className="text-[14px] font-bold text-slate-900 mb-1 line-clamp-2 group-hover:text-gold-700 transition-colors">
                            {ad.title}
                        </h3>
                        <p className="text-[11.5px] text-slate-500 line-clamp-2 leading-relaxed">
                            {ad.description}
                        </p>
                    </div>
                </div>

                {/* مالک */}
                <div className="flex items-center gap-2 mb-4 p-2.5 bg-slate-50 rounded-lg ring-1 ring-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <PiUser className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[10px] text-slate-500">مالک تبلیغ</p>
                        <p className="text-[12px] font-bold text-slate-800 truncate">
                            {ad.owner_id?.full_name || "نامشخص"}
                        </p>
                    </div>
                </div>

                {/* آمار */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-slate-50 rounded-lg p-2.5 ring-1 ring-slate-100">
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1">
                            <PiEye className="w-3 h-3" />
                            بازدید
                        </div>
                        <p className="text-[13px] font-bold text-slate-800">
                            {faNum(ad.stats?.views || 0)}
                        </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2.5 ring-1 ring-slate-100">
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1">
                            <PiCursorClick className="w-3 h-3" />
                            کلیک
                        </div>
                        <p className="text-[13px] font-bold text-slate-800">
                            {faNum(ad.stats?.clicks || 0)}
                        </p>
                    </div>
                    <div className="bg-gold-50 rounded-lg p-2.5 ring-1 ring-gold-100">
                        <div className="flex items-center gap-1 text-[10px] text-gold-700 mb-1">
                            <PiChartLine className="w-3 h-3" />
                            CTR
                        </div>
                        <p className="text-[13px] font-bold text-gold-800">
                            {ctr}٪
                        </p>
                    </div>
                </div>

                {/* اطلاعات بودجه و زمان */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-slate-100 mb-4">
                    <div className="flex items-center gap-2 text-[11.5px] text-slate-600">
                        <PiCurrencyCircleDollar className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
                        <span>
                            بودجه:{" "}
                            <strong className="text-slate-800">
                                {faNum(ad.budget)} تومان
                            </strong>
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11.5px] text-slate-600">
                        <PiCalendarBlank className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
                        <span>
                            {new Date(ad.start_date).toLocaleDateString("fa-IR")}{" "}
                            تا{" "}
                            {new Date(ad.end_date).toLocaleDateString("fa-IR")}
                        </span>
                    </div>
                </div>

                {/* اکشن‌ها */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {ad.status === "active" && (
                            <button
                                onClick={() => onPause(ad)}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11.5px] font-bold text-orange-700 bg-orange-50 ring-1 ring-orange-100 hover:bg-orange-500 hover:text-white hover:ring-orange-500 active:scale-95 transition-all"
                            >
                                <PiPauseCircle className="w-3.5 h-3.5" />
                                توقف
                            </button>
                        )}
                        {ad.status === "paused" && (
                            <button
                                onClick={() => onResume(ad)}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11.5px] font-bold text-emerald-700 bg-emerald-50 ring-1 ring-emerald-100 hover:bg-emerald-500 hover:text-white hover:ring-emerald-500 active:scale-95 transition-all"
                            >
                                <PiPlayCircle className="w-3.5 h-3.5" />
                                فعال‌سازی
                            </button>
                        )}
                        <button
                            onClick={() => onDelete(ad)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11.5px] font-bold text-rose-600 bg-rose-50 ring-1 ring-rose-100 hover:bg-rose-500 hover:text-white hover:ring-rose-500 active:scale-95 transition-all"
                        >
                            <PiTrash className="w-3.5 h-3.5" />
                            حذف
                        </button>
                    </div>

                    <Link
                        href={`/admin/ads/${ad._id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[11.5px] font-bold text-white bg-gradient-to-b from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 shadow-sm shadow-gold-500/25 hover:shadow-md active:scale-95 transition-all"
                    >
                        <PiEye className="w-3.5 h-3.5" />
                        بررسی
                    </Link>
                </div>
            </div>
        </motion.article>
    );
});

/* ============================================================
   Pagination
   ============================================================ */
const NavButton = memo(function NavButton({ onClick, disabled, icon: Icon, label }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            className="inline-flex items-center justify-center min-w-[34px] h-9 px-2.5 rounded-lg text-[12px] font-bold text-slate-500 bg-white border border-slate-200 hover:border-gold-300 hover:text-gold-700 hover:bg-gold-50 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
        >
            <Icon className="w-3.5 h-3.5" />
        </button>
    );
});

const PageButton = memo(function PageButton({ page, active, onChange }) {
    const handleClick = useCallback(() => onChange(page), [onChange, page]);
    return (
        <button
            type="button"
            onClick={handleClick}
            className={[
                "inline-flex items-center justify-center min-w-[34px] h-9 px-2.5 rounded-lg text-[12px] font-bold transition-all active:scale-95",
                active
                    ? "text-white bg-gradient-to-b from-gold-400 to-gold-600 shadow-md shadow-gold-500/25"
                    : "text-slate-600 bg-white border border-slate-200 hover:border-gold-300 hover:text-gold-700 hover:bg-gold-50",
            ].join(" ")}
        >
            {faNum(page)}
        </button>
    );
});

const Ellipsis = memo(function Ellipsis() {
    return (
        <span className="inline-flex items-center justify-center min-w-[34px] h-9 text-slate-400 text-[12px] font-bold">
            …
        </span>
    );
});

const Pagination = memo(function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    perPage,
    onPerPageChange,
    totalItems,
    startIndex,
    endIndex,
}) {
    const pageNumbers = useMemo(() => {
        const pages = [];
        const maxVisible = 5;
        const half = Math.floor(maxVisible / 2);
        if (totalPages <= maxVisible + 2) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }
        pages.push(1);
        let start = Math.max(2, currentPage - half);
        let end = Math.min(totalPages - 1, currentPage + half);
        if (currentPage <= half + 1) {
            start = 2;
            end = maxVisible;
        }
        if (currentPage >= totalPages - half) {
            start = totalPages - maxVisible + 1;
            end = totalPages - 1;
        }
        if (start > 2) pages.push("start-ellipsis");
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < totalPages - 1) pages.push("end-ellipsis");
        pages.push(totalPages);
        return pages;
    }, [currentPage, totalPages]);

    if (totalPages <= 1) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 bg-white rounded-2xl ring-1 ring-slate-100 p-3 sm:p-4"
        >
            <div className="text-[11.5px] sm:text-[12px] text-slate-500 order-2 sm:order-1">
                نمایش{" "}
                <span className="font-bold text-slate-700">{faNum(startIndex)}</span> تا{" "}
                <span className="font-bold text-slate-700">{faNum(endIndex)}</span> از{" "}
                <span className="font-bold text-slate-700">{faNum(totalItems)}</span> تبلیغ
            </div>

            <div className="flex items-center gap-1 order-1 sm:order-2">
                <NavButton onClick={() => onPageChange(1)} disabled={currentPage === 1} icon={PiCaretDoubleRight} label="اولین" />
                <NavButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} icon={PiCaretRight} label="قبلی" />
                <div className="hidden sm:flex items-center gap-1 mx-1">
                    {pageNumbers.map((p, idx) =>
                        typeof p === "string" ? (
                            <Ellipsis key={`${p}-${idx}`} />
                        ) : (
                            <PageButton key={p} page={p} active={p === currentPage} onChange={onPageChange} />
                        )
                    )}
                </div>
                <div className="sm:hidden inline-flex items-center gap-1 px-3 h-9 rounded-lg bg-gold-50 text-gold-700 text-[12px] font-bold ring-1 ring-gold-200">
                    {faNum(currentPage)} / {faNum(totalPages)}
                </div>
                <NavButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} icon={PiCaretLeft} label="بعدی" />
                <NavButton onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} icon={PiCaretDoubleLeft} label="آخرین" />
            </div>

            <div className="flex items-center gap-2 order-3">
                <label htmlFor="ads-per-page" className="text-[11.5px] text-slate-500">
                    تعداد:
                </label>
                <select
                    id="ads-per-page"
                    value={perPage}
                    onChange={(e) => onPerPageChange(Number(e.target.value))}
                    className="h-9 pr-2 pl-7 rounded-lg text-[12px] font-bold text-slate-700 bg-white border border-slate-200 hover:border-gold-300 focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 transition-all cursor-pointer"
                >
                    {PER_PAGE_OPTIONS.map((n) => (
                        <option key={n} value={n}>{faNum(n)}</option>
                    ))}
                </select>
            </div>
        </motion.div>
    );
});

/* ============================================================
   StatCard
   ============================================================ */
const StatCard = memo(function StatCard({ icon: Icon, label, value, tone = "slate", suffix }) {
    const toneMap = {
        slate: { bg: "bg-slate-50", ring: "ring-slate-100", icon: "bg-slate-100 text-slate-600", value: "text-slate-900" },
        emerald: { bg: "bg-emerald-50", ring: "ring-emerald-100", icon: "bg-emerald-100 text-emerald-700", value: "text-emerald-900" },
        amber: { bg: "bg-amber-50", ring: "ring-amber-100", icon: "bg-amber-100 text-amber-700", value: "text-amber-900" },
        gold: { bg: "bg-gold-50", ring: "ring-gold-100", icon: "bg-gold-100 text-gold-700", value: "text-gold-900" },
        blue: { bg: "bg-blue-50", ring: "ring-blue-100", icon: "bg-blue-100 text-blue-700", value: "text-blue-900" },
        rose: { bg: "bg-rose-50", ring: "ring-rose-100", icon: "bg-rose-100 text-rose-700", value: "text-rose-900" },
    };
    const t = toneMap[tone] || toneMap.slate;
    return (
        <div className={["rounded-2xl p-4 ring-1 flex items-center gap-3", t.bg, t.ring].join(" ")}>
            <div className={["w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", t.icon].join(" ")}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
                <p className="text-[10.5px] text-slate-500 mb-0.5">{label}</p>
                <p className={["text-[14px] font-bold truncate", t.value].join(" ")}>
                    {value}
                    {suffix && <span className="text-[10px] font-medium text-slate-500 mr-1">{suffix}</span>}
                </p>
            </div>
        </div>
    );
});

/* ============================================================
   Main Page
   ============================================================ */
export default function AdminAdsPage() {
    const [ads, setAds] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    const listTopRef = useRef(null);

    /* ============================================================
       Fetch
       ============================================================ */
    const fetchAds = useCallback(async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            else setRefreshing(true);

            const res = await axios.get("/api/admin/ads");
            setAds(res.data.ads || []);
            setStats(res.data.stats || null);
        } catch (err) {
            console.error(err);
            toast.error("خطا در دریافت تبلیغات", TOAST_OPTIONS);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchAds();
    }, [fetchAds]);

    /* ============================================================
       Filter + Search
       ============================================================ */
    const filtered = useMemo(() => {
        let list = [...ads];

        if (filter !== "all") {
            list = list.filter((a) => a.status === filter);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            list = list.filter((a) => {
                const title = (a.title || "").toLowerCase();
                const desc = (a.description || "").toLowerCase();
                const ownerName = (a.owner_id?.full_name || "").toLowerCase();
                const shortId = a._id?.slice(-8).toLowerCase() || "";
                return (
                    title.includes(q) ||
                    desc.includes(q) ||
                    ownerName.includes(q) ||
                    shortId.includes(q)
                );
            });
        }

        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return list;
    }, [ads, filter, searchQuery]);

    const counts = useMemo(
        () => ({
            all: ads.length,
            pending: ads.filter((a) => a.status === "pending").length,
            active: ads.filter((a) => a.status === "active").length,
            paused: ads.filter((a) => a.status === "paused").length,
            rejected: ads.filter((a) => a.status === "rejected").length,
            expired: ads.filter((a) => a.status === "expired").length,
        }),
        [ads]
    );

    /* ============================================================
       Pagination
       ============================================================ */
    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = (safeCurrentPage - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, totalItems);
    const paginated = useMemo(
        () => filtered.slice(startIndex, endIndex),
        [filtered, startIndex, endIndex]
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [filter, searchQuery, perPage]);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
    }, [currentPage, totalPages]);

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
        if (listTopRef.current) {
            const yOffset = -80;
            const y = listTopRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    }, []);

    /* ============================================================
       Actions
       ============================================================ */
    const handleDelete = useCallback(async () => {
        if (!confirmDelete) return;
        const id = confirmDelete._id;
        setActionLoading(id);
        const toastId = toast.loading("در حال حذف...");
        try {
            await axios.delete(`/api/admin/ads/${id}`);
            setAds((prev) => prev.filter((a) => a._id !== id));
            toast.update(toastId, {
                render: "تبلیغ حذف شد",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
            setConfirmDelete(null);
        } catch (err) {
            toast.update(toastId, {
                render: err.response?.data?.message || "خطا در حذف",
                type: "error",
                isLoading: false,
                autoClose: 5000,
            });
        } finally {
            setActionLoading(null);
        }
    }, [confirmDelete]);

    const handlePauseResume = useCallback(async (ad, action) => {
        const id = ad._id;
        setActionLoading(id);
        const toastId = toast.loading(action === "pause" ? "در حال توقف..." : "در حال فعال‌سازی...");
        try {
            const res = await axios.patch(`/api/admin/ads/${id}/pause`, { action });
            setAds((prev) => prev.map((a) => (a._id === id ? res.data.ad : a)));
            toast.update(toastId, {
                render: res.data.message,
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
        } catch (err) {
            toast.update(toastId, {
                render: err.response?.data?.message || "خطا",
                type: "error",
                isLoading: false,
                autoClose: 5000,
            });
        } finally {
            setActionLoading(null);
        }
    }, []);

    if (loading) {
        return (
            <div dir="rtl" className="w-full">
                <AdsSkeleton />
            </div>
        );
    }

    return (
        <div dir="rtl" className="w-full">
            {/* ==================== Header ==================== */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="mb-6"
            >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/25 flex-shrink-0">
                            <PiMegaphone className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                                    مدیریت تبلیغات
                                </h1>
                                {ads.length > 0 && (
                                    <span className="inline-flex items-center justify-center min-w-[28px] h-[24px] px-2 rounded-full bg-gold-50 text-gold-700 text-[11px] font-bold ring-1 ring-gold-100">
                                        {faNum(ads.length)}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                تأیید و مدیریت تبلیغات تالارداران
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => fetchAds(true)}
                        disabled={refreshing}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium text-slate-600 bg-white border border-slate-200 hover:bg-gold-50 hover:border-gold-300 hover:text-gold-700 disabled:opacity-50 active:scale-95 transition-all"
                    >
                        <PiArrowClockwise className={["w-3.5 h-3.5", refreshing ? "animate-spin" : ""].join(" ")} />
                        به‌روزرسانی
                    </button>
                </div>
            </motion.div>

            {/* ==================== Stats ==================== */}
            {stats && ads.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5"
                >
                    <StatCard icon={PiMegaphone} label="کل تبلیغات" value={faNum(stats.total)} tone="slate" />
                    <StatCard icon={PiHourglass} label="در انتظار تأیید" value={faNum(stats.pending)} tone="amber" />
                    <StatCard icon={PiPlayCircle} label="فعال" value={faNum(stats.active)} tone="emerald" />
                    <StatCard icon={PiEye} label="کل بازدید" value={faNum(stats.total_views)} tone="blue" />
                </motion.div>
            )}

            {/* ==================== Filters ==================== */}
            {ads.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                    className="mb-5 space-y-3"
                >
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                        {FILTERS.map((f) => {
                            const active = filter === f.key;
                            const count = counts[f.key] || 0;
                            return (
                                <button
                                    key={f.key}
                                    type="button"
                                    onClick={() => setFilter(f.key)}
                                    className={[
                                        "flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold transition-all",
                                        active
                                            ? "text-white bg-gradient-to-b from-gold-400 to-gold-600 shadow-md shadow-gold-500/25"
                                            : "text-slate-600 bg-white border border-slate-200 hover:border-gold-300 hover:text-gold-700 hover:bg-gold-50",
                                    ].join(" ")}
                                >
                                    <span>{f.label}</span>
                                    {count > 0 && (
                                        <span className={["px-1.5 rounded-full text-[10px]", active ? "bg-white/25 text-white" : "bg-slate-100 text-slate-600"].join(" ")}>
                                            {faNum(count)}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="relative group">
                        <PiMagnifyingGlass className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-gold-500 transition-colors pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="جستجو در عنوان، توضیحات یا نام مالک..."
                            className="w-full pr-11 pl-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 hover:border-gold-300 focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 transition-all"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-gold-600 hover:bg-gold-50 active:scale-90 transition-all"
                            >
                                <PiX className="w-3.5 h-3.5" strokeWidth={2.5} />
                            </button>
                        )}
                    </div>
                </motion.div>
            )}

            {/* ==================== Content ==================== */}
            <div ref={listTopRef} />
            <AnimatePresence mode="wait">
                {filtered.length === 0 ? (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <EmptyState
                            filtered={ads.length > 0 && (filter !== "all" || searchQuery)}
                            onReset={() => { setFilter("all"); setSearchQuery(""); }}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key={`list-${safeCurrentPage}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                    >
                        {paginated.map((ad, index) => (
                            <AdCard
                                key={ad._id}
                                ad={ad}
                                index={index}
                                onDelete={setConfirmDelete}
                                onPause={(a) => handlePauseResume(a, "pause")}
                                onResume={(a) => handlePauseResume(a, "resume")}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ==================== Pagination ==================== */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={safeCurrentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    perPage={perPage}
                    onPerPageChange={setPerPage}
                    totalItems={totalItems}
                    startIndex={startIndex + 1}
                    endIndex={endIndex}
                />
            )}

            {/* ==================== Delete Modal ==================== */}
            <AnimatePresence>
                {confirmDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => !actionLoading && setConfirmDelete(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 12 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 12 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl ring-1 ring-slate-100 shadow-2xl p-6 w-full max-w-sm text-center"
                        >
                            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100/60 flex items-center justify-center ring-1 ring-rose-100">
                                <PiTrash className="w-7 h-7 text-rose-500" />
                            </div>
                            <h3 className="text-[16px] font-bold text-slate-900 mb-2">
                                حذف تبلیغ
                            </h3>
                            <p className="text-[13px] text-slate-500 leading-relaxed mb-6">
                                آیا از حذف تبلیغ «{confirmDelete.title}» مطمئن هستید؟ این عملیات قابل بازگشت نیست.
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setConfirmDelete(null)}
                                    disabled={!!actionLoading}
                                    className="px-4 py-2.5 rounded-xl text-[12.5px] font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-all"
                                >
                                    انصراف
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={!!actionLoading}
                                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-[12.5px] font-bold text-white bg-gradient-to-b from-rose-400 to-rose-600 hover:from-rose-500 hover:to-rose-700 shadow-md shadow-rose-500/25 disabled:opacity-50 transition-all"
                                >
                                    {actionLoading ? "در حال حذف..." : "حذف کن"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}