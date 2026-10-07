// lib/notificationService.js
import dbConnect from "@/lib/db";
import Notification from "@/models/Notification";

/* ============================================================
   قالب‌های نوتیفیکیشن به تفکیک رویداد
   ============================================================ */
export const TEMPLATES = {
    // ==================== کاربر (user) ====================
    reservation_created: {
        title: "رزرو جدید ثبت شد",
        message: (d) =>
            `رزرو شما برای تالار «${d.hall_title || "—"}» با موفقیت ثبت شد و در انتظار تأیید مدیر است.`,
        priority: "medium",
    },
    reservation_accepted: {
        title: "رزرو شما تأیید شد ",
        message: (d) =>
            `رزرو تالار «${d.hall_title}» توسط مدیر تأیید شد. منتظر حضور شما هستیم.`,
        priority: "high",
    },
    reservation_rejected: {
        title: "رزرو شما رد شد",
        message: (d) =>
            `متأسفانه رزرو تالار «${d.hall_title}» رد شد.${d.reason ? ` دلیل: ${d.reason}` : ""}`,
        priority: "high",
    },
    reservation_canceled: {
        title: "رزرو لغو شد",
        message: (d) =>
            `رزرو تالار «${d.hall_title}» لغو شد.${d.reason ? ` دلیل: ${d.reason}` : ""}`,
        priority: "medium",
    },
    payment_success: {
        title: "پرداخت موفق 💳",
        message: (d) =>
            `پرداخت شما به مبلغ ${Number(d.amount || 0).toLocaleString("fa-IR")} تومان با موفقیت انجام شد. کد پیگیری: ${d.ref_id || "—"}`,
        priority: "high",
    },
    payment_failed: {
        title: "پرداخت ناموفق",
        message: (d) =>
            `متأسفانه پرداخت شما ناموفق بود.${d.reason ? ` دلیل: ${d.reason}` : " لطفاً دوباره تلاش کنید."}`,
        priority: "high",
    },
    ticket_created: {
        title: "تیکت شما ثبت شد ",
        message: (d) =>
            `تیکت شما با موضوع «${d.subject || "—"}» با موفقیت ثبت شد. کارشناسان ما به‌زودی بررسی می‌کنند.`,
        priority: "medium",
    },
    ticket_reply: {
        title: "پاسخ جدید در تیکت شما",
        message: (d) => `تیکت «${d.subject || "—"}» پاسخ جدیدی دریافت کرد.`,
        priority: "medium",
    },
    ticket_closed: {
        title: "تیکت بسته شد",
        message: (d) => `تیکت «${d.subject || "—"}» بسته شد.`,
        priority: "low",
    },

    // ==================== تالاردار (hall_owner) ====================
    new_reservation: {
        title: "رزرو جدید برای تالار شما 🎉",
        message: (d) =>
            `یک رزرو جدید برای تالار «${d.hall_title}» ثبت شد. لطفاً بررسی کنید.`,
        priority: "high",
    },
    reservation_canceled_by_user: {
        title: "لغو رزرو توسط کاربر",
        message: (d) => `کاربر رزرو تالار «${d.hall_title}» را لغو کرد.`,
        priority: "medium",
    },
    payment_received: {
        title: "پرداخت جدید دریافت شد",
        message: (d) =>
            `مبلغ ${Number(d.amount || 0).toLocaleString("fa-IR")} تومان برای رزرو تالار «${d.hall_title}» پرداخت شد.`,
        priority: "high",
    },
    new_ticket_from_user: {
        title: "تیکت جدید از کاربر",
        message: (d) =>
            `تیکت جدیدی با موضوع «${d.subject}» از طرف کاربر ثبت شد.`,
        priority: "medium",
    },

    // ==================== ادمین (admin) ====================
    new_reservation_for_admin: {
        title: "رزرو جدید در سیستم 🎉",
        message: (d) =>
            `رزرو جدیدی برای تالار «${d.hall_title}» ثبت شد.`,
        priority: "high",
    },
    new_hall_request: {
        title: "درخواست ثبت تالار جدید",
        message: (d) =>
            `تالار «${d.hall_title}» توسط ${d.owner_name} برای بررسی ثبت شد.`,
        priority: "high",
    },
    new_owner_registration: {
        title: "ثبت‌نام تالاردار جدید",
        message: (d) =>
            `کاربر «${d.full_name}» به عنوان تالاردار ثبت‌نام کرد و در انتظار تأیید است.`,
        priority: "medium",
    },
    new_ticket: {
        title: "تیکت پشتیبانی جدید",
        message: (d) => `تیکت جدیدی با موضوع «${d.subject}» ثبت شد.`,
        priority: "high",
    },
    user_report: {
        title: "گزارش جدید از کاربر",
        message: (d) => `گزارش جدیدی درباره «${d.subject}» ثبت شد.`,
        priority: "high",
    },
    system: {
        title: "اطلاعیه سیستم",
        message: (d) => d.message || "پیام جدیدی از سیستم دارید.",
        priority: "medium",
    },

    // ==================== تأیید/رد تالار و کاربر ====================
hall_approved: {
    title: "تالار شما تأیید شد ",
    message: (d) =>
        `تالار «${d.hall_title}» توسط مدیر سایت تأیید و فعال شد.`,
    priority: "high",
},
hall_rejected: {
    title: "تالار شما رد شد",
    message: (d) =>
        `متأسفانه تالار «${d.hall_title}» رد شد.${d.reason ? ` دلیل: ${d.reason}` : ""}`,
    priority: "high",
},
account_approved: {
    title: "حساب شما تأیید شد ",
    message: () =>
        "حساب کاربری شما توسط مدیر سایت تأیید و فعال شد. اکنون می‌توانید از تمام امکانات استفاده کنید.",
    priority: "high",
},
account_deactivated: {
    title: "حساب شما غیرفعال شد",
    message: (d) =>
        `حساب کاربری شما غیرفعال شد.${d.reason ? ` دلیل: ${d.reason}` : ""}`,
    priority: "critical",
},
};

/* ============================================================
   ایجاد یک نوتیفیکیشن
   ============================================================ */
export async function createNotification({
    userId,
    type,
    title,
    message,
    data = {},
    priority = "medium",
    source = "system",
    expiresAt = null,
}) {
    await dbConnect();

    try {
        return await Notification.create({
            user_id: userId,
            type,
            title,
            message,
            data,
            priority,
            channels: { email: false, sms: false, inApp: true },
            source,
            expires_at: expiresAt,
        });
    } catch (err) {
        console.error("[Notification] create error:", err);
        return null;
    }
}

/* ============================================================
   ارسال از قالب
   ============================================================ */
export async function notify({ userId, type, data = {}, overrides = {} }) {
    const tpl = TEMPLATES[type];
    if (!tpl) {
        console.warn(`[Notification] Unknown template: ${type}`);
        return null;
    }

    return createNotification({
        userId,
        type,
        title: overrides.title || tpl.title,
        message:
            overrides.message ||
            (typeof tpl.message === "function" ? tpl.message(data) : tpl.message),
        data,
        priority: overrides.priority || tpl.priority || "medium",
        source: overrides.source || "system",
        expiresAt: overrides.expiresAt || null,
    });
}

/* ============================================================
   ارسال به چند کاربر (مثلاً همه ادمین‌ها)
   ============================================================ */
export async function notifyMany(userIds, payload) {
    if (!Array.isArray(userIds) || userIds.length === 0) return [];
    return Promise.allSettled(
        userIds.map((uid) => notify({ ...payload, userId: uid }))
    );
}