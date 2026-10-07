// lib/notificationHelpers.js
import User from "@/models/User";
import { notify, notifyMany } from "@/lib/notificationService";

/* ============================================================
   پیدا کردن همه ادمین‌ها
   ============================================================ */
async function getAdminIds() {
    const admins = await User.find({ role: "admin" }).select("_id").lean();

    console.log("🔍 [notifHelpers] Admin count:", admins.length);

    return admins.map((a) => a._id);
}

/* ============================================================
   1. رزرو جدید → کاربر + تالاردار + ادمین
   ============================================================ */
export async function notifyReservationCreated({ reservation, hall, user }) {
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
        type: "new_reservation",
        data: { hall_title: hall.title },
    });
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
}

/* ============================================================
   4. لغو رزرو توسط کاربر → تالاردار + ادمین
   ============================================================ */
export async function notifyReservationCanceledByUser({
    reservation,
    hall,
    reason,
}) {
    if (hall.hall_owner_id) {
        await notify({
            userId: hall.hall_owner_id,
            type: "reservation_canceled_by_user",
            data: { hall_title: hall.title, reason },
        });
    }
    const adminIds = await getAdminIds();
    await notifyMany(adminIds, {
        type: "reservation_canceled",
        data: { hall_title: hall.title, reason },
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
   7. تیکت جدید → کاربر (تأییدیه) + ادمین‌ها
   ============================================================ */
export async function notifyNewTicket({ ticket }) {
    console.log("🔍 [notifHelpers] notifyNewTicket called:", ticket.subject);

    // ==================== 1. به کاربر (ثبت‌کننده تیکت) ====================
    if (ticket.reporterId) {
        await notify({
            userId: ticket.reporterId,
            type: "ticket_created",
            data: { subject: ticket.subject },
        });
        console.log(
            "✅ [notifHelpers] Notification sent to user:",
            ticket.reporterId
        );
    }

    // ==================== 2. به ادمین‌ها ====================
    const adminIds = await getAdminIds();

    if (adminIds.length === 0) {
        console.warn(
            "⚠️ [notifHelpers] No admins found! Admin notification skipped."
        );
        return [];
    }

    const result = await notifyMany(adminIds, {
        type: "new_ticket",
        data: { subject: ticket.subject },
    });

    console.log("🔍 [notifHelpers] Admin result:", result);
    return result;
}

/* ============================================================
   8. پاسخ در تیکت → کاربر یا ادمین
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
   10. درخواست ثبت تالار جدید → ادمین‌ها
   ============================================================ */
export async function notifyNewHallRequest({ hall, owner }) {
    const adminIds = await getAdminIds();
    await notifyMany(adminIds, {
        type: "new_hall_request",
        data: { hall_title: hall.title, owner_name: owner.full_name },
    });
}