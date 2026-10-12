// app/user/transactions/page.jsx
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
    PiReceipt,
    PiWarningCircle,
    PiArrowClockwise,
    PiCheckCircle,
    PiClock,
    PiXCircle,
    PiArrowCounterClockwise,
    PiCalendarBlank,
    PiStorefront,
    PiMagnifyingGlass,
    PiX,
    PiCaretRight,
    PiCaretLeft,
    PiCaretDoubleRight,
    PiCaretDoubleLeft,
    PiCurrencyCircleDollar,
    PiHash,
    PiUsersThree,
} from "react-icons/pi";
import { useSession } from "next-auth/react";

/* ============================================================
   Constants
   ============================================================ */
const PER_PAGE_OPTIONS = [5, 10, 20, 50];
const faNum = (n) => Number(n || 0).toLocaleString("fa-IR");

const TOAST_OPTIONS = {
    position: "top-center",
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
   Status Config
   ============================================================ */
function getStatusInfo(status) {
    const map = {
        paid: {
            label: "پرداخت موفق",
            icon: PiCheckCircle,
            bg: "bg-emerald-50",
            text: "text-emerald-700",
            ring: "ring-emerald-200",
            dot: "bg-emerald-500",
        },
        pending: {
            label: "در انتظار پرداخت",
            icon: PiClock,
            bg: "bg-amber-50",
            text: "text-amber-700",
            ring: "ring-amber-200",
            dot: "bg-amber-500",
        },
        failed: {
            label: "ناموفق",
            icon: PiXCircle,
            bg: "bg-rose-50",
            text: "text-rose-700",
            ring: "ring-rose-200",
            dot: "bg-rose-500",
        },
        refunded: {
            label: "بازگشت وجه",
            icon: PiArrowCounterClockwise,
            bg: "bg-slate-50",
            text: "text-slate-600",
            ring: "ring-slate-200",
            dot: "bg-slate-500",
        },
    };
    return map[status] || map.pending;
}

function getTypeLabel(type) {
    const map = {
        pre_payment: "پیش‌پرداخت",
        full_payment: "پرداخت کامل",
        refund: "بازگشت وجه",
    };
    return map[type] || "تراکنش";
}

const FILTERS = [
    { key: "all", label: "همه" },
    { key: "paid", label: "پرداخت‌شده" },
    { key: "pending", label: "در انتظار" },
    { key: "failed", label: "ناموفق" },
    { key: "refunded", label: "بازگشتی" },
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
                    "w-1.5 h-1.5 rounded-full animate-pulse",
                    info.dot,
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
const TransactionsSkeleton = memo(function TransactionsSkeleton() {
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
                    <div className="h-3 w-full bg-slate-100 rounded-md" />
                </div>
            ))}
        </div>
    );
});

/* ============================================================
   EmptyState
   ============================================================ */
const EmptyState = memo(function EmptyState({ filtered, onReset }) {
    const wrapperCls = [
        "relative overflow-hidden bg-white rounded-3xl",
        "ring-1 ring-slate-100",
        "shadow-[0_8px_32px_rgba(198,161,76,0.06)]",
        "p-8 sm:p-12 text-center",
    ].join(" ");

    const resetBtnCls = [
        "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl",
        "text-sm font-medium text-slate-700 bg-white border border-slate-200",
        "hover:bg-slate-50 hover:border-slate-300 active:scale-95",
        "transition-all duration-200",
    ].join(" ");

    const ctaCls = [
        "inline-flex items-center gap-2 px-6 py-3 rounded-xl",
        "text-sm font-bold text-white",
        "bg-gradient-to-b from-gold-400 to-gold-600",
        "hover:from-gold-500 hover:to-gold-700",
        "shadow-md shadow-gold-500/25",
        "hover:shadow-lg hover:shadow-gold-500/40",
        "hover:-translate-y-0.5 transition-all duration-300",
    ].join(" ");

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className={wrapperCls}
        >
            <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 50% 0%, rgba(198,161,76,0.08) 0%, transparent 50%)",
                }}
            />

            <div className="relative w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-gold-50 to-gold-100/60 flex items-center justify-center ring-1 ring-gold-100">
                <div className="absolute inset-0 rounded-3xl bg-gold-500/5 blur-xl" />
                <PiReceipt className="relative w-10 h-10 text-gold-500" />
            </div>

            <h3 className="relative text-lg sm:text-xl font-bold text-slate-900 mb-2">
                {filtered
                    ? "تراکنشی با این فیلتر یافت نشد"
                    : "هنوز تراکنشی ثبت نشده"}
            </h3>
            <p className="relative text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-7">
                {filtered
                    ? "می‌توانید فیلتر یا جستجو را تغییر دهید."
                    : "با ثبت اولین رزرو، تراکنش‌های شما اینجا نمایش داده می‌شوند."}
            </p>

            <div className="relative flex flex-wrap items-center justify-center gap-3">
                {filtered && (
                    <button onClick={onReset} className={resetBtnCls}>
                        <PiX className="w-4 h-4" />
                        پاک کردن فیلترها
                    </button>
                )}
                <Link href="/halls" className={ctaCls}>
                    <PiStorefront className="w-4 h-4" />
                    مشاهده تالارها
                </Link>
            </div>
        </motion.div>
    );
});

/* ============================================================
   TransactionCard
   ============================================================ */
const TransactionCard = memo(function TransactionCard({ tx, index }) {
    const cardCls = [
        "group bg-white rounded-2xl",
        "ring-1 ring-slate-100 hover:ring-gold-200/70",
        "shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        "hover:shadow-[0_12px_32px_-12px_rgba(198,161,76,0.18)]",
        "transition-all duration-300 overflow-hidden",
    ].join(" ");

    const shortId = tx._id?.slice(-6).toUpperCase();

    return (
        <motion.article
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.3,
                delay: Math.min(index * 0.04, 0.3),
            }}
            className={cardCls}
        >
            <div className="p-5">
                {/* ردیف بالا */}
                <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={tx.status} />
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold-50 text-gold-700 text-[10.5px] font-bold ring-1 ring-gold-100">
                            {getTypeLabel(tx.type)}
                        </span>
                    </div>
                    <span className="text-[10.5px] text-slate-400 font-mono">
                        #{shortId}
                    </span>
                </div>

                {/* تالار */}
                <div className="flex items-start gap-3 mb-4">
                    {tx.hall?.image ? (
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden ring-1 ring-slate-100 flex-shrink-0 bg-slate-50">
                            <Image
                                src={tx.hall.image}
                                alt={tx.hall.title}
                                fill
                                sizes="56px"
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-14 h-14 rounded-xl bg-gold-50 ring-1 ring-gold-100 flex items-center justify-center flex-shrink-0">
                            <PiStorefront className="w-6 h-6 text-gold-500" />
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <h3 className="text-[14px] font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-gold-700 transition-colors">
                            {tx.hall?.title || "تالار حذف‌شده"}
                        </h3>
                        <p className="text-[11.5px] text-slate-500">
                            {tx.hall?.city} — {tx.hall?.province}
                        </p>
                    </div>
                </div>

                {/* مبلغ */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                    <div className="bg-slate-50 rounded-xl p-3 ring-1 ring-slate-100">
                        <p className="text-[10px] text-slate-500 mb-1">
                            مبلغ نهایی
                        </p>
                        <p className="text-[13px] font-bold text-slate-900">
                            {faNum(tx.final_price)}{" "}
                            <span className="text-[10px] font-medium text-slate-500">
                                تومان
                            </span>
                        </p>
                    </div>

                    <div className="bg-gold-50 rounded-xl p-3 ring-1 ring-gold-100">
                        <p className="text-[10px] text-gold-700 mb-1">
                            پیش‌پرداخت
                        </p>
                        <p className="text-[13px] font-bold text-gold-800">
                            {faNum(tx.pre_payment)}{" "}
                            <span className="text-[10px] font-medium text-gold-600">
                                تومان
                            </span>
                        </p>
                    </div>

                    {tx.discount > 0 && (
                        <div className="bg-emerald-50 rounded-xl p-3 ring-1 ring-emerald-100">
                            <p className="text-[10px] text-emerald-700 mb-1">
                                تخفیف
                            </p>
                            <p className="text-[13px] font-bold text-emerald-800">
                                {faNum(tx.discount)}٪
                            </p>
                        </div>
                    )}
                </div>

                {/* اطلاعات تکمیلی */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-[11.5px] text-slate-600">
                        <PiCalendarBlank className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
                        <span>
                            تاریخ ثبت:{" "}
                            <strong className="text-slate-800">
                                {new Date(tx.created_at).toLocaleDateString(
                                    "fa-IR"
                                )}
                            </strong>
                        </span>
                    </div>

                    {tx.paid_at && (
                        <div className="flex items-center gap-2 text-[11.5px] text-slate-600">
                            <PiCheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                            <span>
                                تاریخ پرداخت:{" "}
                                <strong className="text-slate-800">
                                    {new Date(tx.paid_at).toLocaleDateString(
                                        "fa-IR"
                                    )}
                                </strong>
                            </span>
                        </div>
                    )}

                    {tx.ref_id && (
                        <div className="flex items-center gap-2 text-[11.5px] text-slate-600">
                            <PiHash className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
                            <span>
                                کد پیگیری:{" "}
                                <strong className="text-slate-800 font-mono">
                                    {tx.ref_id}
                                </strong>
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-2 text-[11.5px] text-slate-600">
                        <PiUsersThree className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
                        <span>
                            تعداد مهمان:{" "}
                            <strong className="text-slate-800">
                                {faNum(tx.guests_count)} نفر
                            </strong>
                        </span>
                    </div>
                </div>

                {/* لینک به رزرو */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                    <Link
                        href="/user/reservations"
                        className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-gold-700 hover:text-gold-800 hover:bg-gold-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        <PiReceipt className="w-3.5 h-3.5" />
                        مشاهده رزرو
                    </Link>
                </div>
            </div>
        </motion.article>
    );
});

/* ============================================================
   NavButton / PageButton / Ellipsis
   ============================================================ */
const NavButton = memo(function NavButton({
    onClick,
    disabled,
    icon: Icon,
    label,
}) {
    const cls = [
        "inline-flex items-center justify-center",
        "min-w-[34px] h-9 px-2.5 rounded-lg",
        "text-[12px] font-bold transition-all duration-200 active:scale-95",
        "text-slate-500 bg-white border border-slate-200",
        "hover:border-gold-300 hover:text-gold-700 hover:bg-gold-50",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        "disabled:hover:bg-white disabled:hover:border-slate-200 disabled:hover:text-slate-500",
    ].join(" ");
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            className={cls}
        >
            <Icon className="w-3.5 h-3.5" />
        </button>
    );
});

const PageButton = memo(function PageButton({ page, active, onChange }) {
    const handleClick = useCallback(() => onChange(page), [onChange, page]);
    const cls = [
        "inline-flex items-center justify-center min-w-[34px] h-9 px-2.5",
        "rounded-lg text-[12px] font-bold transition-all duration-200 active:scale-95",
        active
            ? "text-white bg-gradient-to-b from-gold-400 to-gold-600 shadow-md shadow-gold-500/25"
            : "text-slate-600 bg-white border border-slate-200 hover:border-gold-300 hover:text-gold-700 hover:bg-gold-50",
    ].join(" ");
    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={`صفحه ${page}`}
            aria-current={active ? "page" : undefined}
            className={cls}
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

/* ============================================================
   Pagination
   ============================================================ */
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
                <span className="font-bold text-slate-700">
                    {faNum(startIndex)}
                </span>{" "}
                تا{" "}
                <span className="font-bold text-slate-700">
                    {faNum(endIndex)}
                </span>{" "}
                از{" "}
                <span className="font-bold text-slate-700">
                    {faNum(totalItems)}
                </span>{" "}
                تراکنش
            </div>

            <div className="flex items-center gap-1 order-1 sm:order-2">
                <NavButton
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    icon={PiCaretDoubleRight}
                    label="اولین صفحه"
                />
                <NavButton
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    icon={PiCaretRight}
                    label="صفحه قبلی"
                />

                <div className="hidden sm:flex items-center gap-1 mx-1">
                    {pageNumbers.map((p, idx) => {
                        if (typeof p === "string")
                            return <Ellipsis key={`${p}-${idx}`} />;
                        return (
                            <PageButton
                                key={p}
                                page={p}
                                active={p === currentPage}
                                onChange={onPageChange}
                            />
                        );
                    })}
                </div>

                <div className="sm:hidden inline-flex items-center gap-1 px-3 h-9 rounded-lg bg-gold-50 text-gold-700 text-[12px] font-bold ring-1 ring-gold-200">
                    {faNum(currentPage)} / {faNum(totalPages)}
                </div>

                <NavButton
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    icon={PiCaretLeft}
                    label="صفحه بعدی"
                />
                <NavButton
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    icon={PiCaretDoubleLeft}
                    label="آخرین صفحه"
                />
            </div>

            <div className="flex items-center gap-2 order-3">
                <label
                    htmlFor="tx-per-page"
                    className="text-[11.5px] text-slate-500 whitespace-nowrap"
                >
                    تعداد در صفحه:
                </label>
                <select
                    id="tx-per-page"
                    value={perPage}
                    onChange={(e) => onPerPageChange(Number(e.target.value))}
                    className="h-9 pr-2 pl-7 rounded-lg text-[12px] font-bold text-slate-700 bg-white border border-slate-200 hover:border-gold-300 focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 transition-all duration-200 cursor-pointer"
                >
                    {PER_PAGE_OPTIONS.map((n) => (
                        <option key={n} value={n}>
                            {faNum(n)}
                        </option>
                    ))}
                </select>
            </div>
        </motion.div>
    );
});

/* ============================================================
   StatCard
   ============================================================ */
const StatCard = memo(function StatCard({
    icon: Icon,
    label,
    value,
    tone = "slate",
    suffix,
}) {
    const toneMap = {
        slate: {
            bg: "bg-slate-50",
            ring: "ring-slate-100",
            icon: "bg-slate-100 text-slate-600",
            value: "text-slate-900",
        },
        emerald: {
            bg: "bg-emerald-50",
            ring: "ring-emerald-100",
            icon: "bg-emerald-100 text-emerald-700",
            value: "text-emerald-900",
        },
        amber: {
            bg: "bg-amber-50",
            ring: "ring-amber-100",
            icon: "bg-amber-100 text-amber-700",
            value: "text-amber-900",
        },
        gold: {
            bg: "bg-gold-50",
            ring: "ring-gold-100",
            icon: "bg-gold-100 text-gold-700",
            value: "text-gold-900",
        },
        rose: {
            bg: "bg-rose-50",
            ring: "ring-rose-100",
            icon: "bg-rose-100 text-rose-700",
            value: "text-rose-900",
        },
    };
    const t = toneMap[tone] || toneMap.slate;
    const wrapper = [
        "rounded-2xl p-4 ring-1",
        t.bg,
        t.ring,
        "flex items-center gap-3",
    ].join(" ");
    const iconWrap = [
        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
        t.icon,
    ].join(" ");
    return (
        <div className={wrapper}>
            <div className={iconWrap}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
                <p className="text-[10.5px] text-slate-500 mb-0.5">{label}</p>
                <p
                    className={[
                        "text-[14px] font-bold truncate",
                        t.value,
                    ].join(" ")}
                >
                    {value}
                    {suffix && (
                        <span className="text-[10px] font-medium text-slate-500 mr-1">
                            {suffix}
                        </span>
                    )}
                </p>
            </div>
        </div>
    );
});

/* ============================================================
   Main Page
   ============================================================ */
export default function UserTransactionsPage() {
    const { data: session, status } = useSession();
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const listTopRef = useRef(null);

    /* ============================================================
       Fetch
       ============================================================ */
    const fetchTransactions = useCallback(async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            else setRefreshing(true);

            const res = await axios.get("/api/user/transactions", {
                withCredentials: true,
            });

            setTransactions(res.data.transactions || []);
            setStats(res.data.stats || null);
            setError(null);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message || "خطا در دریافت تراکنش‌ها"
            );
            if (!silent) {
                toast.error("خطا در دریافت تراکنش‌ها", TOAST_OPTIONS);
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        if (status === "authenticated") {
            fetchTransactions();
        } else if (status === "unauthenticated") {
            setLoading(false);
        }
    }, [status, fetchTransactions]);

    /* ============================================================
       Filter + Search
       ============================================================ */
    const filtered = useMemo(() => {
        let list = [...transactions];

        if (filter !== "all") {
            list = list.filter((t) => t.status === filter);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            list = list.filter((t) => {
                const title = (t.hall?.title || "").toLowerCase();
                const city = (t.hall?.city || "").toLowerCase();
                const refId = (t.ref_id || "").toLowerCase();
                const shortId = t._id?.slice(-8).toLowerCase() || "";
                return (
                    title.includes(q) ||
                    city.includes(q) ||
                    refId.includes(q) ||
                    shortId.includes(q)
                );
            });
        }

        list.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        return list;
    }, [transactions, filter, searchQuery]);

    /* ============================================================
       Counts
       ============================================================ */
    const counts = useMemo(
        () => ({
            all: transactions.length,
            paid: transactions.filter((t) => t.status === "paid").length,
            pending: transactions.filter((t) => t.status === "pending")
                .length,
            failed: transactions.filter((t) => t.status === "failed")
                .length,
            refunded: transactions.filter((t) => t.status === "refunded")
                .length,
        }),
        [transactions]
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
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
        if (listTopRef.current) {
            const yOffset = -80;
            const y =
                listTopRef.current.getBoundingClientRect().top +
                window.pageYOffset +
                yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    }, []);

    /* ============================================================
       Loading / Unauthenticated
       ============================================================ */
    if (status === "loading" || loading) {
        return (
            <div dir="rtl" className="w-full">
                <TransactionsSkeleton />
            </div>
        );
    }

    if (!session) {
        return (
            <div dir="rtl" className="text-center py-16">
                <div className="w-16 h-16 mx-auto bg-gold-50 rounded-2xl ring-1 ring-gold-100 flex items-center justify-center mb-4">
                    <PiReceipt className="w-8 h-8 text-gold-500" />
                </div>
                <p className="text-slate-700 font-medium">دسترسی محدود</p>
                <p className="text-slate-500 text-sm mt-1">
                    برای مشاهده تراکنش‌ها وارد شوید
                </p>
            </div>
        );
    }

    /* ============================================================
       Error
       ============================================================ */
    if (error && transactions.length === 0) {
        return (
            <div dir="rtl" className="text-center py-16">
                <div className="w-16 h-16 mx-auto bg-rose-50 rounded-2xl ring-1 ring-rose-100 flex items-center justify-center mb-4">
                    <PiWarningCircle className="w-8 h-8 text-rose-500" />
                </div>
                <p className="text-slate-700 font-medium">خطا در بارگذاری</p>
                <p className="text-slate-500 text-sm mt-1 mb-5">{error}</p>
                <button
                    onClick={() => fetchTransactions()}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-b from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 shadow-md shadow-gold-500/25 hover:shadow-lg hover:shadow-gold-500/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                    <PiArrowClockwise className="w-4 h-4" />
                    تلاش مجدد
                </button>
            </div>
        );
    }

    /* ============================================================
       Render
       ============================================================ */
    const refreshBtnCls = [
        "inline-flex items-center gap-1.5",
        "px-3 py-2 rounded-xl text-[12px] font-medium",
        "text-slate-600 bg-white border border-slate-200",
        "hover:bg-gold-50 hover:border-gold-300 hover:text-gold-700",
        "disabled:opacity-50 disabled:cursor-not-allowed active:scale-95",
        "transition-all duration-200",
    ].join(" ");

    const searchInputCls = [
        "w-full pr-11 pl-10 py-2.5",
        "bg-white border border-slate-200 rounded-xl",
        "text-sm text-slate-900 placeholder:text-slate-400",
        "hover:border-gold-300",
        "focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10",
        "transition-all duration-200",
    ].join(" ");

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
                            <PiReceipt className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                                    تراکنش‌های من
                                </h1>
                                {transactions.length > 0 && (
                                    <span className="inline-flex items-center justify-center min-w-[28px] h-[24px] px-2 rounded-full bg-gold-50 text-gold-700 text-[11px] font-bold ring-1 ring-gold-100">
                                        {faNum(transactions.length)}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                مشاهده و پیگیری تمام تراکنش‌های شما
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => fetchTransactions(true)}
                        disabled={refreshing}
                        className={refreshBtnCls}
                    >
                        <PiArrowClockwise
                            className={[
                                "w-3.5 h-3.5",
                                refreshing ? "animate-spin" : "",
                            ].join(" ")}
                        />
                        به‌روزرسانی
                    </button>
                </div>
            </motion.div>

            {/* ==================== Stats ==================== */}
            {stats && transactions.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5"
                >
                    <StatCard
                        icon={PiReceipt}
                        label="کل تراکنش‌ها"
                        value={faNum(stats.total)}
                        tone="slate"
                    />
                    <StatCard
                        icon={PiCheckCircle}
                        label="پرداخت‌شده"
                        value={faNum(stats.paid)}
                        tone="emerald"
                    />
                    <StatCard
                        icon={PiClock}
                        label="در انتظار"
                        value={faNum(stats.pending)}
                        tone="amber"
                    />
                    <StatCard
                        icon={PiCurrencyCircleDollar}
                        label="مجموع پرداخت‌شده"
                        value={faNum(stats.total_paid_amount)}
                        suffix="تومان"
                        tone="gold"
                    />
                </motion.div>
            )}

            {/* ==================== Filters ==================== */}
            {transactions.length > 0 && (
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
                                        "flex-shrink-0 inline-flex items-center gap-1.5",
                                        "px-3.5 py-2 rounded-xl text-[12px] font-bold",
                                        "transition-all duration-200",
                                        active
                                            ? "text-white bg-gradient-to-b from-gold-400 to-gold-600 shadow-md shadow-gold-500/25"
                                            : "text-slate-600 bg-white border border-slate-200 hover:border-gold-300 hover:text-gold-700 hover:bg-gold-50",
                                    ].join(" ")}
                                >
                                    <span>{f.label}</span>
                                    {count > 0 && (
                                        <span
                                            className={[
                                                "px-1.5 rounded-full text-[10px]",
                                                active
                                                    ? "bg-white/25 text-white"
                                                    : "bg-slate-100 text-slate-600",
                                            ].join(" ")}
                                        >
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
                            placeholder="جستجو در نام تالار، کد پیگیری یا شناسه..."
                            aria-label="جستجو در تراکنش‌ها"
                            className={searchInputCls}
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                aria-label="پاک کردن جستجو"
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
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <EmptyState
                            filtered={
                                transactions.length > 0 &&
                                (filter !== "all" || searchQuery)
                            }
                            onReset={() => {
                                setFilter("all");
                                setSearchQuery("");
                            }}
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
                        {paginated.map((tx, index) => (
                            <TransactionCard
                                key={tx._id}
                                tx={tx}
                                index={index}
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
        </div>
    );
}