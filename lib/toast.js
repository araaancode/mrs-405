import { toast } from "react-toastify";

const BASE_STYLE = {
  fontFamily: "'IranianSans', system-ui, sans-serif",
  direction: "rtl",
  textAlign: "right",
  borderRadius: "14px",
  padding: "14px 18px",
  fontSize: "13.5px",
  fontWeight: "500",
};

export const notify = {
  // متد لودینگ (بدون autoClose)
  loading: (message) => toast.loading(message, {
    position: "top-left",
    autoClose: false,
    pauseOnHover: true,
    style: { ...BASE_STYLE, background: "#fff", border: "1px solid #ccc" }
  }),

  // متد آپدیت (بخش حساس)
  update: (toastId, { message, type, duration = 5000 }) => {
    // تعریف رنگ‌ها بر اساس نوع
    const themes = {
      success: { bg: "#ECFDF5", color: "#065F46", border: "#10B981" },
      error: { bg: "#FEF2F2", color: "#991B1B", border: "#EF4444" },
      info: { bg: "#EFF6FF", color: "#1E40AF", border: "#3B82F6" },
      warning: { bg: "#FFFBEB", color: "#92400E", border: "#F59E0B" },
    };

    const theme = themes[type] || themes.info;

    return toast.update(toastId, {
      render: message,
      type: type,
      isLoading: false,
      showCloseButton: true,
      autoClose: duration, // این مقدار باید حتماً پاس داده شود
      pauseOnHover: true,   // برای اینکه کاربر بتواند بخواند
      style: {
        ...BASE_STYLE,
        background: theme.bg,
        color: theme.color,
        border: `2px solid ${theme.border}`,
      },
    });
  },

  // سایر متدها برای استفاده‌های معمولی در برنامه
  success: (msg) => toast.success(msg, { style: { ...BASE_STYLE, background: "#ECFDF5" } }),
  error: (msg) => toast.error(msg, { style: { ...BASE_STYLE, background: "#FEF2F2" } }),
};
