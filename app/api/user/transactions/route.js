export const dynamic = "force-dynamic";

// app/api/user/transactions/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HallReservation from "@/models/HallReservation";
import Hall from "@/models/Hall";           // ← این خط اضافه شد
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/* ============================================================
   GET — استخراج تراکنش‌ها از روی رزروهای کاربر
   ============================================================ */
export async function GET() {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const reservations = await HallReservation.find({
            user_id: session.user.id,
        })
            .populate("hall_id", "title city province images")
            .sort({ createdAt: -1 })
            .lean();

        // ... ادامه‌ی کد بدون تغییر
        const transactions = reservations.map((r) => {
            let transaction_status = "pending";
            let transaction_type = "pre_payment";

            if (r.status === "paid" || r.payment_info?.paid_at) {
                transaction_status = "paid";
            } else if (
                r.status === "canceled_by_user" ||
                r.status === "canceled_by_owner"
            ) {
                transaction_status = "refunded";
            } else if (r.status === "rejected") {
                transaction_status = "failed";
            }

            const amount = r.pre_payment || 0;

            return {
                _id: r._id,
                reservation_id: r._id,
                hall: {
                    _id: r.hall_id?._id,
                    title: r.hall_id?.title || "تالار حذف‌شده",
                    city: r.hall_id?.city || "—",
                    province: r.hall_id?.province || "—",
                    image: r.hall_id?.images?.[0] || null,
                },
                amount,
                base_price: r.base_price || 0,
                discount: r.discount || 0,
                final_price: r.final_price || 0,
                pre_payment: r.pre_payment || 0,
                status: transaction_status,
                type: transaction_type,
                payment_method:
                    r.payment_info?.payment_method || "zarinpal",
                ref_id: r.payment_info?.ref_id || null,
                tracking_code: r.payment_info?.tracking_code || null,
                paid_at: r.payment_info?.paid_at || null,
                created_at: r.createdAt,
                updated_at: r.updatedAt,
                reservation_status: r.status,
                start_date: r.start_date,
                end_date: r.end_date,
                guests_count: r.guests_count,
            };
        });

        const stats = {
            total: transactions.length,
            paid: transactions.filter((t) => t.status === "paid").length,
            pending: transactions.filter((t) => t.status === "pending")
                .length,
            failed: transactions.filter((t) => t.status === "failed").length,
            refunded: transactions.filter((t) => t.status === "refunded")
                .length,
            total_paid_amount: transactions
                .filter((t) => t.status === "paid")
                .reduce((sum, t) => sum + (t.amount || 0), 0),
            total_pending_amount: transactions
                .filter((t) => t.status === "pending")
                .reduce((sum, t) => sum + (t.amount || 0), 0),
        };

        return NextResponse.json({
            success: true,
            transactions,
            stats,
        });
    } catch (err) {
        console.error("[user/transactions] Error:", err);
        return NextResponse.json(
            { message: err.message || "خطای داخلی سرور" },
            { status: 500 }
        );
    }
}