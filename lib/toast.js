// lib/toast.js
import { toast } from "react-toastify";

/* ============================================================
   استایل پایه — همه‌ی toast ها این را دارند
   ============================================================ */
const BASE_STYLE = {
    fontFamily: "'IranianSans', system-ui, sans-serif",
    direction: "rtl",
    textAlign: "right",
    borderRadius: "14px",
    padding: "14px 18px",
    fontSize: "13.5px",
    fontWeight: "500",
    background: "#ffffff",         //  پس‌زمینه سفید برای همه
    color: "#1e293b",              // slate-800 پیش‌فرض
    boxShadow:
        "0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)",
    minHeight: "52px",
    display: "flex",
    alignItems: "center",
};

/* ============================================================
   تنظیمات پایه‌ی toast
   ============================================================ */
const BASE_OPTIONS = {
    position: "top-left",          //  سمت چپ بالا
    pauseOnHover: true,
    pauseOnFocusLoss: false,
    draggable: true,
    closeOnClick: false,
    rtl: true,
    theme: "light",
};

/* ============================================================
   تم‌های رنگی — فقط border و رنگ متن
   ============================================================ */
const THEMES = {
    success: {
        color: "#065F46",          // emerald-800
        border: "#10B981",         // emerald-500
    },
    error: {
        color: "#991B1B",          // red-800
        border: "#EF4444",         // red-500
    },
    info: {
        color: "#1E40AF",          // blue-800
        border: "#3B82F6",         // blue-500
    },
    warning: {
        color: "#92400E",          // amber-800
        border: "#F59E0B",         // amber-500
    },
    loading: {
        color: "#475569",          // slate-600
        border: "#CBD5E1",         // slate-300
    },
    default: {
        color: "#1e293b",          // slate-800
        border: "#E2E8F0",         // slate-200
    },
};

/* ============================================================
   ساخت style بر اساس نوع
   ============================================================ */
function buildStyle(type = "default") {
    const theme = THEMES[type] || THEMES.default;
    return {
        ...BASE_STYLE,
        color: theme.color,
        border: `2px solid ${theme.border}`,
    };
}

/* ============================================================
   notify — API اصلی
   ============================================================ */
export const notify = {
    /* ------------------------------------------------------------
       success — پیام موفقیت
       ------------------------------------------------------------ */
    success: (message, options = {}) =>
        toast.success(message, {
            ...BASE_OPTIONS,
            autoClose: options.duration ?? 4000,
            style: buildStyle("success"),
            ...options,
        }),

    /* ------------------------------------------------------------
       error — پیام خطا
       ------------------------------------------------------------ */
    error: (message, options = {}) =>
        toast.error(message, {
            ...BASE_OPTIONS,
            autoClose: options.duration ?? 6000,
            style: buildStyle("error"),
            ...options,
        }),

    /* ------------------------------------------------------------
       info — پیام اطلاع‌رسانی
       ------------------------------------------------------------ */
    info: (message, options = {}) =>
        toast.info(message, {
            ...BASE_OPTIONS,
            autoClose: options.duration ?? 4000,
            style: buildStyle("info"),
            ...options,
        }),

    /* ------------------------------------------------------------
       warning — پیام هشدار
       ------------------------------------------------------------ */
    warning: (message, options = {}) =>
        toast.warning(message, {
            ...BASE_OPTIONS,
            autoClose: options.duration ?? 5000,
            style: buildStyle("warning"),
            ...options,
        }),

    /* ------------------------------------------------------------
       loading — پیام در حال انجام (بسته نمی‌شود تا update شود)
       ------------------------------------------------------------ */
    loading: (message, options = {}) =>
        toast.loading(message, {
            ...BASE_OPTIONS,
            autoClose: false,
            closeOnClick: false,
            closeButton: false,
            style: buildStyle("loading"),
            ...options,
        }),

    /* ------------------------------------------------------------
       update — به‌روزرسانی یک toast موجود
       ------------------------------------------------------------ */
    update: (toastId, { message, type = "info", duration = 5000 } = {}) => {
        return toast.update(toastId, {
            render: message,
            type,
            isLoading: false,
            autoClose: duration,
            closeOnClick: false,
            closeButton: true,
            pauseOnHover: true,
            rtl: true,
            style: buildStyle(type),
        });
    },

    /* ------------------------------------------------------------
       promise — برای Promise ها
       مثال:
       notify.promise(fetchData(), {
         pending: "در حال دریافت...",
         success: "دریافت شد",
         error: "خطا",
       })
       ------------------------------------------------------------ */
    promise: (promise, msgs = {}) =>
        toast.promise(
            promise,
            {
                pending: {
                    render: msgs.pending || "در حال پردازش...",
                    style: buildStyle("loading"),
                },
                success: {
                    render: msgs.success || "انجام شد",
                    style: buildStyle("success"),
                },
                error: {
                    render: msgs.error || "خطا رخ داد",
                    style: buildStyle("error"),
                },
            },
            {
                ...BASE_OPTIONS,
                autoClose: 5000,
            }
        ),

    /* ------------------------------------------------------------
       dismiss — بستن یک یا همه‌ی toast ها
       ------------------------------------------------------------ */
    dismiss: (toastId) => toast.dismiss(toastId),
    dismissAll: () => toast.dismiss(),

    /* ------------------------------------------------------------
       custom — toast با محتوای دلخواه
       ------------------------------------------------------------ */
    custom: (render, options = {}) =>
        toast(render, {
            ...BASE_OPTIONS,
            autoClose: options.duration ?? 4000,
            style: { ...BASE_STYLE, ...(options.style || {}) },
            ...options,
        }),
};

export default notify;