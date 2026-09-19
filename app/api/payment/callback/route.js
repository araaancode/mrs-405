// app/api/payment/callback/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HallReservation from "@/models/HallReservation";
import { verifyPayment } from "@/lib/zarinpal";
import NotificationService from "@/lib/notifications";

export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const authority = searchParams.get("Authority");
        const status = searchParams.get("Status");
        const orderId = searchParams.get("orderId");

        // لاگ برای دیباگ
        console.log("📥 Payment Callback received:", {
            authority,
            status,
            orderId,
            timestamp: new Date().toISOString()
        });

        // ==========================================
        // ۱. بررسی وضعیت کلی
        // ==========================================

        // اگر کاربر پرداخت را لغو کرد
        if (status !== "OK") {
            console.log("❌ Payment canceled by user");
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/reservations?payment=canceled`
            );
        }

        // اگر Authority وجود ندارد
        if (!authority) {
            console.log("❌ Missing authority");
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/reservations?payment=error`
            );
        }

        // ==========================================
        // ۲. پیدا کردن رزرو
        // ==========================================

        const reservation = await HallReservation.findOne({
            "payment_info.tracking_code": authority
        })
            .populate('user_id', 'full_name email phone')
            .populate('hall_id', 'title address city');

        if (!reservation) {
            console.error("❌ Reservation not found for authority:", authority);
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/reservations?payment=error`
            );
        }

        console.log("✅ Reservation found:", {
            reservationId: reservation._id,
            userId: reservation.user_id._id,
            amount: reservation.pre_payment,
            status: reservation.status
        });

        // ==========================================
        // ۳. بررسی تکراری نبودن تایید
        // ==========================================

        if (reservation.payment_info.ref_id) {
            console.log("⚠️ Payment already verified:", reservation.payment_info.ref_id);
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/reservations?payment=duplicate`
            );
        }

        // ==========================================
        // ۴. تایید پرداخت در زرین‌پال
        // ==========================================

        console.log("🔄 Verifying payment with Zarinpal...");

        const verifyResult = await verifyPayment(
            reservation.pre_payment,
            authority
        );

        console.log("📊 Verify result:", verifyResult);

        // ==========================================
        // ۵. پردازش نتیجه تایید
        // ==========================================

        if (verifyResult.success) {
            // ------------------------------------
            // ۵.۱. پرداخت موفق
            // ------------------------------------

            console.log("✅ Payment verified successfully");

            // به‌روزرسانی اطلاعات رزرو
            reservation.payment_info.ref_id = verifyResult.refId.toString();
            reservation.payment_info.paid_at = new Date();
            reservation.payment_info.payment_data = {
                ...reservation.payment_info.payment_data,
                verified_at: new Date(),
                ref_id: verifyResult.refId,
                card_pan: verifyResult.cardPan || null,
                card_hash: verifyResult.cardHash || null,
                verify_response: verifyResult
            };
            reservation.status = "paid";
            await reservation.save();

            console.log("✅ Reservation updated to 'paid'");

            // ------------------------------------
            // ۵.۲. ارسال نوتیفیکیشن پرداخت موفق
            // ------------------------------------

            try {
                await NotificationService.sendFromTemplate({
                    userId: reservation.user_id._id,
                    type: 'payment_success',
                    templateData: {
                        hall_title: reservation.hall_id?.title || 'تالار',
                        amount: reservation.pre_payment?.toLocaleString('fa-IR'),
                        ref_id: verifyResult.refId,
                        reservation_id: reservation._id.toString().slice(-6),
                        start_date: new Date(reservation.start_date).toLocaleDateString('fa-IR'),
                        payment_link: `${process.env.NEXT_PUBLIC_BASE_URL}/reservations`
                    },
                    channels: {
                        email: true,
                        sms: true,
                        inApp: true
                    },
                    priority: 'high'
                });
                console.log("📧 Success notification sent");
            } catch (notifError) {
                // خطای نوتیفیکیشن نباید فرآیند پرداخت را متوقف کند
                console.error("⚠️ Notification error (non-critical):", notifError);
            }

            // ------------------------------------
            // ۵.۳. هدایت به صفحه موفقیت
            // ------------------------------------

            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/reservations?payment=success&ref=${verifyResult.refId}`
            );

        } else {
            // ------------------------------------
            // ۵.۴. پرداخت ناموفق
            // ------------------------------------

            console.log("❌ Payment verification failed:", verifyResult.message);

            // بررسی تکراری بودن (کد ۱۰۱)
            if (verifyResult.code === 101) {
                console.log("⚠️ Transaction already verified (code 101)");
                return NextResponse.redirect(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/reservations?payment=duplicate`
                );
            }

            // به‌روزرسانی وضعیت رزرو
            reservation.status = "pending";
            reservation.payment_info.payment_data = {
                ...reservation.payment_info.payment_data,
                verify_failed_at: new Date(),
                verify_error: verifyResult.message,
                verify_code: verifyResult.code
            };
            await reservation.save();

            console.log("⚠️ Reservation status reset to 'pending'");

            // ------------------------------------
            // ۵.۵. ارسال نوتیفیکیشن پرداخت ناموفق
            // ------------------------------------

            try {
                await NotificationService.sendFromTemplate({
                    userId: reservation.user_id._id,
                    type: 'payment_failed',
                    templateData: {
                        hall_title: reservation.hall_id?.title || 'تالار',
                        reason: verifyResult.message || 'خطای نامشخص',
                        reservation_id: reservation._id.toString().slice(-6),
                        retry_link: `${process.env.NEXT_PUBLIC_BASE_URL}/reservations`
                    },
                    channels: {
                        email: true,
                        sms: false, // برای خطا فقط ایمیل
                        inApp: true
                    },
                    priority: 'high'
                });
                console.log("📧 Failure notification sent");
            } catch (notifError) {
                console.error("⚠️ Notification error (non-critical):", notifError);
            }

            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/reservations?payment=failed`
            );
        }

    } catch (error) {
        // ==========================================
        // ۶. مدیریت خطاهای غیرمنتظره
        // ==========================================

        console.error('❌ Payment callback error:', {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });

        // تلاش برای اطلاع‌رسانی به کاربر در صورت امکان
        try {
            const { searchParams } = new URL(req.url);
            const authority = searchParams.get("Authority");

            if (authority) {
                const reservation = await HallReservation.findOne({
                    "payment_info.tracking_code": authority
                }).select('user_id hall_id _id');

                if (reservation?.user_id) {
                    await NotificationService.sendFromTemplate({
                        userId: reservation.user_id,
                        type: 'system',
                        templateData: {
                            title: '⚠️ خطا در پردازش پرداخت',
                            message: `متاسفانه در پردازش پرداخت شما خطایی رخ داد. لطفاً با پشتیبانی تماس بگیرید. کد رزرو: ${reservation._id.toString().slice(-6)}`
                        },
                        channels: {
                            email: true,
                            sms: false,
                            inApp: true
                        },
                        priority: 'critical'
                    });
                }
            }
        } catch (notifError) {
            console.error("⚠️ Failed to send error notification:", notifError);
        }

        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL}/reservations?payment=error`
        );
    }
}