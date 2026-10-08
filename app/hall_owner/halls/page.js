// app/hall_owner/halls/page.jsx
"use client";

import { useEffect, useState, useCallback, useMemo, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import {
    PiPencilSimple,
    PiTrash,
    PiMapPin,
    PiUsersThree,
    PiRuler,
    PiBuildings,
    PiPlusCircle,
    PiSpinnerGap,
    PiWarningCircle,
    PiSparkle,
    PiImage,
    PiCarProfile,
    PiCaretLeft,
    PiCaretRight,
    PiCaretDoubleLeft,
    PiCaretDoubleRight,
} from "react-icons/pi";

/* ============================================================
   Constants
   ============================================================ */
const PER_PAGE = 6;
const PLACEHOLDER = "/images/placeholder-hall.jpg";
const faNumFormatter = new Intl.NumberFormat("fa-IR");
const faNum = (n) => faNumFormatter.format(Number(n) || 0);

/* ============================================================
   Helpers
   ============================================================ */
function normalizeImageUrl(url, fallback = PLACEHOLDER) {
    if (!url || typeof url !== "string") return fallback;
    const trimmed = url.trim();
    if (!trimmed) return fallback;
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
    if (trimmed.startsWith("data:")) return trimmed;
    if (trimmed.startsWith("./")) return "/" + trimmed.slice(2);
    if (!trimmed.startsWith("/")) return "/" + trimmed;
    return trimmed;
}

/* ============================================================
   HallRowSkeleton — خالص CSS، بدون framer-motion
   ============================================================ */
const HallRowSkeleton = memo(function HallRowSkeleton() {
    return (
        <div className="bg-white rounded-2xl ring-1 ring-slate-100 overflow-hidden animate-pulse flex flex-col md:flex-row">
            <div className="w-full md:w-64 lg:w-72 h-48 md:h-auto bg-slate-100 flex-shrink-0" />
            <div className="flex-1 p-5 space-y-3">
                <div className="h-6 w-2/3 bg-slate-100 rounded-lg" />
                <div className="h-3.5 w-1/3 bg-slate-100 rounded-md" />
                <div className="flex gap-2 pt-2">
                    <div className="h-6 w-24 bg-slate-100 rounded-lg" />
                    <div className="h-6 w-20 bg-slate-100 rounded-lg" />
                    <div className="h-6 w-16 bg-slate-100 rounded-lg" />
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-md mt-3" />
                <div className="h-3 w-5/6 bg-slate-100 rounded-md" />
                <div className="flex gap-2 pt-4 border-t border-slate-100 mt-4">
                    <div className="h-9 w-24 bg-slate-100 rounded-lg" />
                    <div className="h-9 w-24 bg-slate-100 rounded-lg" />
                </div>
            </div>
        </div>
    );
});

/* ============================================================
   EmptyState — memoized
   ============================================================ */
const EmptyState = memo(function EmptyState() {
    return (
        <div className="relative overflow-hidden bg-white rounded-3xl ring-1 ring-slate-100 shadow-[0_8px_32px_rgba(198,161,76,0.06)] p-8 sm:p-12 text-center">
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 50% 0%, rgba(198,161,76,0.08) 0%, transparent 50%)",
                }}
            />

            <div className="relative w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-gold-50 to-gold-100/60 flex items-center justify-center ring-1 ring-gold-100">
                <PiBuildings className="relative w-10 h-10 text-gold-500" />
            </div>

            <h3 className="relative text-lg sm:text-xl font-bold text-slate-900 mb-2">
                هنوز تالاری ثبت نکرده‌اید
            </h3>
            <p className="relative text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-7">
                برای شروع، اولین تالار خود را ایجاد کنید و کسب‌وکارتان را آغاز کنید
            </p>

            <Link
                href="/hall_owner/halls/create"
                className="relative inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-b from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 shadow-md shadow-gold-500/25 hover:shadow-lg hover:shadow-gold-500/40 hover:-translate-y-0.5 transition-all duration-300"
            >
                <PiPlusCircle className="w-4 h-4" />
                ایجاد تالار جدید
            </Link>
        </div>
    );
});

/* ============================================================
   Chip — کوچک، reusable
   ============================================================ */
const Chip = memo(function Chip({ icon: Icon, children }) {
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 text-[11px] font-medium ring-1 ring-slate-100">
            {Icon && <Icon className="w-3.5 h-3.5 text-gold-500" />}
            {children}
        </span>
    );
});

/* ============================================================
   HallRow — memoized + next/image + بدون framer-motion
   ============================================================ */
const HallRow = memo(function HallRow({ hall, onDelete, isDeleting }) {
    const updateUrl = `/hall_owner/halls/update_hall/${hall._id}`;

    /* یک بار محاسبه */
    const imageUrl = useMemo(() => {
        const cover = Array.isArray(hall.images) && hall.images[0];
        return cover ? normalizeImageUrl(cover) : null;
    }, [hall.images]);

    const shortId = useMemo(
        () => hall._id?.slice(-6).toUpperCase(),
        [hall._id]
    );

    /* callbacks پایدار */
    const handleDelete = useCallback(() => onDelete(hall._id), [onDelete, hall._id]);
    const handleImgError = useCallback((e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = PLACEHOLDER;
    }, []);

    return (
        <article className="group bg-white rounded-2xl ring-1 ring-slate-100 hover:ring-gold-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_32px_-12px_rgba(198,161,76,0.18)] transition-all duration-300 overflow-hidden flex flex-col md:flex-row">
            {/* ==================== تصویر ==================== */}
            <Link
                href={updateUrl}
                className="relative w-full md:w-64 lg:w-72 h-48 md:h-auto flex-shrink-0 overflow-hidden bg-slate-100 block"
            >
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={hall.title || "تالار"}
                        fill
                        sizes="(max-width: 768px) 100vw, 288px"
                        quality={75}
                        loading="lazy"
                        onError={handleImgError}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                        <PiImage className="w-10 h-10 mb-2" />
                        <span className="text-[11px]">بدون تصویر</span>
                    </div>
                )}

                {hall.has_sans && (
                    <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-l from-gold-400 to-gold-600 text-white text-[10px] font-bold shadow-lg shadow-gold-500/40">
                            <PiSparkle className="w-3 h-3" />
                            دارای سانس
                        </span>
                    </div>
                )}
            </Link>

            {/* ==================== محتوا ==================== */}
            <div className="flex-1 p-5 min-w-0 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                        <Link href={updateUrl}>
                            <h3 className="text-base sm:text-[17px] font-bold text-slate-900 group-hover:text-gold-700 transition-colors line-clamp-1">
                                {hall.title}
                            </h3>
                        </Link>

                        <div className="flex items-center gap-1.5 text-[12.5px] text-slate-500 mt-1.5">
                            <PiMapPin className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
                            <span className="line-clamp-1">
                                {hall.city} — {hall.province}
                            </span>
                        </div>
                    </div>
                </div>

                {/* چیپ‌ها */}
                <div className="flex items-center gap-2 flex-wrap mb-3">
                    <Chip icon={PiUsersThree}>ظرفیت: {faNum(hall.capacity)} نفر</Chip>
                    <Chip icon={PiRuler}>متراژ: {faNum(hall.hall_measure)} متر</Chip>
                    {hall.hall_type && (
                        <Chip icon={PiBuildings}>{hall.hall_type}</Chip>
                    )}
                    {hall.parking_count && (
                        <Chip icon={PiCarProfile}>
                            پارکینگ:{" "}
                            {hall.parking_count === "نامحدود"
                                ? "نامحدود"
                                : faNum(hall.parking_count)}
                        </Chip>
                    )}
                </div>

                {hall.description && (
                    <p className="text-[12.5px] text-slate-500 leading-relaxed line-clamp-2 mb-3">
                        {hall.description}
                    </p>
                )}

                {/* اکشن‌ها */}
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
                    <div className="text-[10.5px] text-slate-400">
                        <span>شناسه: </span>
                        <span className="font-mono font-bold text-slate-600">
                            #{shortId}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={updateUrl}
                            className="group/btn inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-[11.5px] font-bold text-gold-700 bg-gold-50 ring-1 ring-gold-100 hover:bg-gold-500 hover:text-white hover:ring-gold-500 hover:shadow-md hover:shadow-gold-500/30 active:scale-95 transition-all duration-200"
                        >
                            <PiPencilSimple className="w-3.5 h-3.5" />
                            ویرایش
                        </Link>

                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-[11.5px] font-bold text-rose-600 bg-rose-50 ring-1 ring-rose-100 hover:bg-rose-500 hover:text-white hover:ring-rose-500 hover:shadow-md hover:shadow-rose-500/30 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {isDeleting ? (
                                <>
                                    <PiSpinnerGap className="w-3.5 h-3.5 animate-spin" />
                                    در حال حذف...
                                </>
                            ) : (
                                <>
                                    <PiTrash className="w-3.5 h-3.5" />
                                    حذف
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
});

/* ============================================================
   NavButton / PageButton / Ellipsis — بیرون از Pagination
   ============================================================ */
const NavButton = memo(function NavButton({ onClick, disabled, icon: Icon, label }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:border-gold-300 hover:text-gold-700 hover:bg-gold-50/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200 disabled:hover:text-slate-600 focus:outline-none focus:ring-4 focus:ring-gold-500/15 active:scale-95 transition-all duration-200"
        >
            <Icon className="w-4 h-4" />
        </button>
    );
});

const PageButton = memo(function PageButton({ page, active, onChange }) {
    const handleClick = useCallback(() => onChange(page), [onChange, page]);

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={`رفتن به صفحه ${page}`}
            aria-current={active ? "page" : undefined}
            className={`min-w-[40px] h-10 px-3 rounded-xl flex items-center justify-center text-[13px] font-bold transition-all duration-200 active:scale-95 focus:outline-none focus:ring-4 focus:ring-gold-500/15 ${
                active
                    ? "bg-gradient-to-b from-gold-400 to-gold-600 text-white shadow-md shadow-gold-500/25"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-gold-300 hover:text-gold-700 hover:bg-gold-50/40"
            }`}
        >
            {page.toLocaleString("fa-IR")}
        </button>
    );
});

const Ellipsis = memo(function Ellipsis() {
    return (
        <span className="w-10 h-10 flex items-center justify-center text-slate-400 select-none">
            …
        </span>
    );
});

/* ============================================================
   Pagination — memoized
   ============================================================ */
const Pagination = memo(function Pagination({ currentPage, totalPages, onChange }) {
    const pageNumbers = useMemo(() => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }

        pages.push(1);

        let start = Math.max(2, currentPage - 1);
        let end = Math.min(totalPages - 1, currentPage + 1);

        if (currentPage <= 3) {
            start = 2;
            end = 4;
        }
        if (currentPage >= totalPages - 2) {
            start = totalPages - 3;
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
        <div className="mt-8 flex flex-col items-center gap-3">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
                <NavButton
                    onClick={() => onChange(1)}
                    disabled={currentPage === 1}
                    icon={PiCaretDoubleRight}
                    label="صفحه اول"
                />
                <NavButton
                    onClick={() => onChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    icon={PiCaretRight}
                    label="صفحه قبلی"
                />

                <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />

                {pageNumbers.map((p) => {
                    if (typeof p === "string") return <Ellipsis key={p} />;
                    return (
                        <PageButton
                            key={p}
                            page={p}
                            active={p === currentPage}
                            onChange={onChange}
                        />
                    );
                })}

                <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />

                <NavButton
                    onClick={() => onChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    icon={PiCaretLeft}
                    label="صفحه بعدی"
                />
                <NavButton
                    onClick={() => onChange(totalPages)}
                    disabled={currentPage === totalPages}
                    icon={PiCaretDoubleLeft}
                    label="صفحه آخر"
                />
            </div>

            <p className="text-[11px] text-slate-400">
                صفحه{" "}
                <span className="font-bold text-slate-600">
                    {currentPage.toLocaleString("fa-IR")}
                </span>{" "}
                از{" "}
                <span className="font-bold text-slate-600">
                    {totalPages.toLocaleString("fa-IR")}
                </span>
            </p>
        </div>
    );
});

/* ============================================================
   ConfirmDialog — بدون AnimatePresence، فقط CSS transition
   ============================================================ */
const ConfirmDialog = memo(function ConfirmDialog({
    isOpen,
    hallTitle,
    onConfirm,
    onCancel,
    isDeleting,
}) {
    /* Escape key */
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => e.key === "Escape" && onCancel();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeIn_200ms_ease-out]"
            onClick={onCancel}
            role="dialog"
            aria-modal="true"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl ring-1 ring-slate-100 shadow-2xl p-6 w-full max-w-sm text-center animate-[popIn_200ms_ease-out]"
            >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100/60 flex items-center justify-center ring-1 ring-rose-100">
                    <PiWarningCircle className="w-7 h-7 text-rose-500" />
                </div>

                <h3 className="text-[16px] font-bold text-slate-900 mb-2">
                    حذف تالار
                </h3>
                <p className="text-[13px] text-slate-500 leading-relaxed mb-6">
                    آیا از حذف تالار{" "}
                    <span className="font-bold text-slate-800">
                        «{hallTitle}»
                    </span>{" "}
                    مطمئن هستید؟ این عملیات قابل بازگشت نیست.
                </p>

                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-[12.5px] font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        انصراف
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-[12.5px] font-bold text-white bg-gradient-to-b from-rose-400 to-rose-600 hover:from-rose-500 hover:to-rose-700 shadow-md shadow-rose-500/25 hover:shadow-lg hover:shadow-rose-500/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        {isDeleting ? (
                            <>
                                <PiSpinnerGap className="w-3.5 h-3.5 animate-spin" />
                                در حال حذف...
                            </>
                        ) : (
                            <>
                                <PiTrash className="w-3.5 h-3.5" />
                                حذف کن
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
});

/* ============================================================
   Page
   ============================================================ */
export default function HallsPage() {
    const [halls, setHalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [confirmHall, setConfirmHall] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    /* ============================================================
       Fetch — با fetch + AbortController
       ============================================================ */
    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            try {
                const res = await fetch("/api/hall_owner/halls", {
                    signal: controller.signal,
                    headers: { Accept: "application/json" },
                });
                const data = await res.json();
                if (data?.success && Array.isArray(data.halls)) {
                    setHalls(data.halls);
                }
            } catch (err) {
                if (err.name === "AbortError") return;
                toast.error("خطا در دریافت تالارها");
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        })();

        return () => controller.abort();
    }, []);

    /* ============================================================
       Pagination — useMemo (بدون useEffect اضافه)
       ============================================================ */
    const totalPages = useMemo(
        () => Math.max(1, Math.ceil(halls.length / PER_PAGE)),
        [halls.length]
    );

    const safePage = currentPage > totalPages ? totalPages : currentPage;

    const paginatedHalls = useMemo(() => {
        const start = (safePage - 1) * PER_PAGE;
        return halls.slice(start, start + PER_PAGE);
    }, [halls, safePage]);

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, []);

    /* ============================================================
       Delete
       ============================================================ */
    const openConfirm = useCallback(
        (id) => {
            const hall = halls.find((h) => h._id === id);
            if (hall) setConfirmHall(hall);
        },
        [halls]
    );

    const closeConfirm = useCallback(() => {
        setConfirmHall((cur) => (deletingId ? cur : null));
    }, [deletingId]);

    const handleConfirmDelete = useCallback(async () => {
        if (!confirmHall) return;

        const id = confirmHall._id;
        setDeletingId(id);

        const toastId = toast.loading("در حال حذف تالار...");

        try {
            const res = await fetch(`/api/hall_owner/halls/${id}`, {
                method: "DELETE",
                headers: { Accept: "application/json" },
            });

            if (res.ok) {
                setHalls((prev) => prev.filter((h) => h._id !== id));
                toast.update(toastId, {
                    render: "تالار با موفقیت حذف شد",
                    type: "success",
                    isLoading: false,
                    autoClose: 5000,
                });
                setConfirmHall(null);
            } else {
                toast.update(toastId, {
                    render: "خطا در حذف تالار",
                    type: "error",
                    isLoading: false,
                    autoClose: 8000,
                });
            }
        } catch {
            toast.update(toastId, {
                render: "خطا در حذف تالار",
                type: "error",
                isLoading: false,
                autoClose: 8000,
            });
        } finally {
            setDeletingId(null);
        }
    }, [confirmHall]);

    /* ============================================================
       Render
       ============================================================ */
    return (
        <div dir="rtl" className="w-full">
            {/* ==================== Header ==================== */}
            <div className="mb-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/25 flex-shrink-0">
                            <PiBuildings className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                                    تالارهای من
                                </h1>
                                {halls.length > 0 && (
                                    <span className="inline-flex items-center justify-center min-w-[28px] h-[24px] px-2 rounded-full bg-gold-50 text-gold-700 text-[11px] font-bold ring-1 ring-gold-100">
                                        {faNum(halls.length)}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                مدیریت و ویرایش تالارهای ثبت‌شده
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/hall_owner/halls/create"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-b from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 shadow-md shadow-gold-500/25 hover:shadow-lg hover:shadow-gold-500/40 hover:-translate-y-0.5 transition-all duration-300"
                    >
                        <PiPlusCircle className="w-4 h-4" />
                        ایجاد تالار
                    </Link>
                </div>
            </div>

            {/* ==================== Content ==================== */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <HallRowSkeleton key={i} />
                    ))}
                </div>
            ) : halls.length === 0 ? (
                <EmptyState />
            ) : (
                <>
                    <div className="space-y-4">
                        {paginatedHalls.map((hall) => (
                            <HallRow
                                key={hall._id}
                                hall={hall}
                                onDelete={openConfirm}
                                isDeleting={deletingId === hall._id}
                            />
                        ))}
                    </div>

                    <Pagination
                        currentPage={safePage}
                        totalPages={totalPages}
                        onChange={handlePageChange}
                    />
                </>
            )}

            {/* ==================== Confirm Dialog ==================== */}
            <ConfirmDialog
                isOpen={!!confirmHall}
                hallTitle={confirmHall?.title}
                onConfirm={handleConfirmDelete}
                onCancel={closeConfirm}
                isDeleting={!!deletingId}
            />

            {/* کیفریم‌های سبک برای دیالوگ */}
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.95) translateY(12px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    );
}