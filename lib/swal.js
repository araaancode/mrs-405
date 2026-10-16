// lib/swal.js
import Swal from "sweetalert2";

/* ============================================================
   پیکربندی پیش‌فرض SweetAlert2 — هماهنگ با طراحی سایت
   ============================================================ */
const baseConfig = {
    confirmButtonColor: "#C6A14C",
    cancelButtonColor: "#64748b",
    confirmButtonText: "تأیید",
    cancelButtonText: "انصراف",
    buttonsStyling: true,
    customClass: {
        popup: "rounded-2xl font-iransans",
        title: "text-slate-900 font-bold",
        htmlContainer: "text-slate-600 text-sm",
        confirmButton:
            "rounded-xl px-5 py-2.5 text-sm font-bold shadow-md hover:shadow-lg transition-all",
        cancelButton:
            "rounded-xl px-5 py-2.5 text-sm font-medium transition-all",
    },
};

/* ============================================================
   توست زیبا (بالا-چپ)
   ============================================================ */
const Toast = Swal.mixin({
    toast: true,
    position: "top-left",
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
});

/* ============================================================
   API نهایی
   ============================================================ */
export const swal = {
    /* ---------- توست‌ها ---------- */
    success: (message, title = "موفق") =>
        Toast.fire({
            icon: "success",
            title: title,
            text: message,
            iconColor: "#10B981",
        }),

    error: (message, title = "خطا") =>
        Toast.fire({
            icon: "error",
            title: title,
            text: message,
            iconColor: "#EF4444",
        }),

    warning: (message, title = "هشدار") =>
        Toast.fire({
            icon: "warning",
            title: title,
            text: message,
            iconColor: "#F59E0B",
        }),

    info: (message, title = "اطلاع") =>
        Toast.fire({
            icon: "info",
            title: title,
            text: message,
            iconColor: "#3B82F6",
        }),

    /* ---------- لودینگ ---------- */
    loading: (message = "در حال انجام...") => {
        Swal.fire({
            ...baseConfig,
            title: message,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => Swal.showLoading(),
            customClass: {
                ...baseConfig.customClass,
                popup: "rounded-2xl font-iransans w-auto",
            },
        });
    },

    close: () => Swal.close(),

    /* ---------- تأیید عملیات ---------- */
    confirm: async ({
        title = "آیا مطمئن هستید؟",
        text = "این عملیات قابل بازگشت نیست",
        confirmText = "بله، انجام بده",
        cancelText = "انصراف",
        icon = "warning",
    } = {}) => {
        const result = await Swal.fire({
            ...baseConfig,
            title,
            text,
            icon,
            showCancelButton: true,
            confirmButtonText: confirmText,
            cancelButtonText: cancelText,
            reverseButtons: true,
            focusCancel: true,
        });
        return result.isConfirmed;
    },

    /* ---------- مودال سفارشی ---------- */
    fire: (options) => Swal.fire({ ...baseConfig, ...options }),
};