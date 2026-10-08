// lib/notificationHelpers.js
import User from "@/models/User";
import { notify, notifyMany } from "@/lib/notificationService";
import { sendPatternSMSByUserId } from "@/lib/smsService";

/* ============================================================
   پیدا کردن ادمین‌ها
   ============================================================ */
async function getAdminIds() {
    const admins = await User.find({ role: "admin" }).select("_id").lean();
    return admins.map((a) => a._id);
}

/* ============================================================
   تابع کمکی: ارسال SMS با پترن
   ============================================================ */
async function sendSMS({ userId, envKey, args }) {
    const bodyId = process.env[envKey];

    if (!bodyId) {
        console.warn(`⚠️ [SMS] ${envKey} not set, skipping`);
        return null;
    }

    const safeArgs = (Array.isArray(args) ? args : [args]).map((a) =>
        String(a ?? "").trim()
    );

    console.log("📤 [sendSMS] envKey:", envKey);
    console.log("📤 [sendSMS] bodyId:", bodyId);
    console.log("📤 [sendSMS] args:", safeArgs);
    console.log("📤 [sendSMS] args.length:", safeArgs.length);

    return sendPatternSMSByUserId({
        userId,
        bodyId: Number(bodyId),
        args: safeArgs,
        User,
    });
}

/* ============================================================
   تابع کمکی: ساخت کد کوتاه از ObjectId
   ============================================================ */
function shortCode(id) {
    if (!id) return "UNKNOWN";
    return id.toString().slice(-6).toUpperCase();
}

/* ============================================================
   1. رزرو جدید → کاربر + تالاردار + ادمین
   ============================================================ */
export async function notifyReservationCreated({ reservation, hall, user }) {
    // ==================== In-App ====================
    await notify({
        userId: user._id,
        type: "reservation_created",
        data: { hall_title: hall.title },
    });

    if (hall.hall_owner_id) {
        await notify({
            userId: hall.hall_owner_id,
            type: "new_reservation",
            data: { hall_title: hall.title },
        });
    }

    const adminIds = await getAdminIds();
    await notifyMany(adminIds, {
        type: "new_reservation_for_admin",
        data: { hall_title: hall.title },
    });

    // ==================== SMS ====================
    const reservationCode = shortCode(reservation._id);
    const hallCode = shortCode(hall._id);

    // به کاربر — پترن 553366 دو متغیره: [کد رزرو, کد تالار]
    await sendSMS({
        userId: user._id,
        envKey: "SMS_PATTERN_RESERVATION_CREATED_USER",
        args: [reservationCode, hallCode], // ✅ ۲ تا
    });

    // به تالاردار — پترن 553371 یک متغیره: [کد رزرو]
    if (hall.hall_owner_id) {
        await sendSMS({
            userId: hall.hall_owner_id,
            envKey: "SMS_PATTERN_RESERVATION_CREATED_OWNER",
            args: [reservationCode], // ✅ ۱ تا
        });
    }
}

/* ============================================================
   2. تأیید رزرو → کاربر
   ============================================================ */
export async function notifyReservationAccepted({ reservation, hall }) {
    await notify({
        userId: reservation.user_id,
        type: "reservation_accepted",
        data: { hall_title: hall.title },
    });

    const reservationCode = shortCode(reservation._id);

    // پترن 553372 دو متغیره: [کد رزرو, وضعیت]
    // arg دوم انگلیسی می‌فرستیم: "OK" برای تأیید
    await sendSMS({
        userId: reservation.user_id,
        envKey: "SMS_PATTERN_RESERVATION_STATUS_USER",
        args: [reservationCode, "OK"], // ✅ ۲ تا
    });
}

/* ============================================================
   3. رد رزرو → کاربر
   ============================================================ */
export async function notifyReservationRejected({ reservation, hall, reason }) {
    await notify({
        userId: reservation.user_id,
        type: "reservation_rejected",
        data: { hall_title: hall.title, reason },
    });

    const reservationCode = shortCode(reservation._id);

    // پترن 553372 دو متغیره: [کد رزرو, وضعیت]
    // arg دوم انگلیسی: "NO" برای رد
    await sendSMS({
        userId: reservation.user_id,
        envKey: "SMS_PATTERN_RESERVATION_STATUS_USER",
        args: [reservationCode, "NO"], // ✅ ۲ تا
    });
}

/* ============================================================
   4. لغو رزرو توسط کاربر → تالاردار + ادمین + کاربر
   ============================================================ */
export async function notifyReservationCanceledByUser({
    reservation,
    hall,
    reason,
}) {
    // In-App به تالاردار
    if (hall.hall_owner_id) {
        await notify({
            userId: hall.hall_owner_id,
            type: "reservation_canceled_by_user",
            data: { hall_title: hall.title, reason },
        });
    }

    // In-App به ادمین‌ها
    const adminIds = await getAdminIds();
    await notifyMany(adminIds, {
        type: "reservation_canceled",
        data: { hall_title: hall.title, reason },
    });

    // SMS به کاربر (تأییدیه لغو)
    const reservationCode = shortCode(reservation._id);
    await sendSMS({
        userId: reservation.user_id,
        envKey: "SMS_PATTERN_RESERVATION_STATUS_USER",
        args: [reservationCode, "CX"], // ✅ ۲ تا — CX = Cancelled
    });
}

/* ============================================================
   5. پرداخت موفق → کاربر + تالاردار
   ============================================================ */
export async function notifyPaymentSuccess({
    reservation,
    hall,
    amount,
    refId,
}) {
    await notify({
        userId: reservation.user_id,
        type: "payment_success",
        data: { amount, ref_id: refId },
    });

    if (hall.hall_owner_id) {
        await notify({
            userId: hall.hall_owner_id,
            type: "payment_received",
            data: { amount, hall_title: hall.title },
        });
    }
}

/* ============================================================
   6. پرداخت ناموفق → کاربر
   ============================================================ */
export async function notifyPaymentFailed({ userId, reason }) {
    await notify({
        userId,
        type: "payment_failed",
        data: { reason },
    });
}

/* ============================================================
   7. تیکت جدید → کاربر + ادمین
   ============================================================ */
export async function notifyNewTicket({ ticket }) {
    if (ticket.reporterId) {
        await notify({
            userId: ticket.reporterId,
            type: "ticket_created",
            data: { subject: ticket.subject },
        });
    }

    const adminIds = await getAdminIds();
    await notifyMany(adminIds, {
        type: "new_ticket",
        data: { subject: ticket.subject },
    });
}

/* ============================================================
   8. پاسخ در تیکت
   ============================================================ */
export async function notifyTicketReply({ ticket, toUserId }) {
    await notify({
        userId: toUserId,
        type: "ticket_reply",
        data: { subject: ticket.subject },
    });
}

/* ============================================================
   9. ثبت‌نام تالاردار جدید → ادمین‌ها
   ============================================================ */
export async function notifyNewOwnerRegistration({ user }) {
    const adminIds = await getAdminIds();
    await notifyMany(adminIds, {
        type: "new_owner_registration",
        data: { full_name: user.full_name },
    });
}

/* ============================================================
   10. ثبت تالار جدید → ادمین + تالاردار
   ============================================================ */
export async function notifyNewHallRequest({ hall, owner }) {
    const adminIds = await getAdminIds();
    await notifyMany(adminIds, {
        type: "new_hall_request",
        data: { hall_title: hall.title, owner_name: owner.full_name },
    });

    // SMS به تالاردار — پترن 553374 (فرض یک متغیره)
    const hallCode = shortCode(hall._id);
    await sendSMS({
        userId: owner._id,
        envKey: "SMS_PATTERN_HALL_CREATED_OWNER",
        args: [hallCode], // ✅ ۱ تا
    });
}

/* ============================================================
   11. تأیید/رد تالار توسط ادمین → تالاردار
   ============================================================ */
export async function notifyHallStatusChanged({ hall, action, reason }) {
    const isApproved = action === "approve";

    await notify({
        userId: hall.hall_owner_id,
        type: isApproved ? "hall_approved" : "hall_rejected",
        data: {
            hall_title: hall.title,
            reason: reason || "",
        },
    });

    // SMS — پترن 553375 (فرض یک یا دو متغیره)
    const hallCode = shortCode(hall._id);
    await sendSMS({
        userId: hall.hall_owner_id,
        envKey: "SMS_PATTERN_HALL_STATUS_OWNER",
        args: [hallCode], // ✅ ۱ تا (اگه ۲ متغیره بود، خطا می‌ده)
    });
}