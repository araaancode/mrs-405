export const dynamic = "force-dynamic";

// app/api/hall_owner/transactions/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HallReservation from "@/models/HallReservation";
import Hall from "@/models/Hall";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/* ============================================================
   GET — تراکنش‌های تالارهای تالاردار
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

        if (session.user.role !== "hall_owner") {
            return NextResponse.json(
                { message: "دسترسی غیرمجاز" },
                { status: 403 }
            );
        }

        // ۱. پیدا کردن همه‌ی تالارهای این مالک
        const ownerHalls = await Hall.find({
            hall_owner_id: session.user.id,
        })
            .select("_id title city province images")
            .lean();

        const hallIds = ownerHalls.map((h) => h._id);

        if (hallIds.length === 0) {
            return NextResponse.json({
                success: true,
                transactions: [],
                stats: {
                    total: 0,
                    paid: 0,
                    pending: 0,
                    failed: 0,
                    refunded: 0,
                    total_paid_amount: 0,
                    total_pending_amount: 0,
                    total_owner_share: 0,
                },
            });
        }

        // ۲. پیدا کردن همه‌ی رزروهای این تالارها
        const reservations = await HallReservation.find({
            hall_id: { $in: hallIds },
        })
            .populate("hall_id", "title city province images")
            .populate("user_id", "full_name phone email")
            .sort({ createdAt: -1 })
            .lean();

        // ۳. نگاشت به تراکنش
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
                customer: {
                    _id: r.user_id?._id,
                    name: r.user_id?.full_name || "کاربر حذف‌شده",
                    phone: r.user_id?.phone || "—",
                    email: r.user_id?.email || "—",
                },
                amount: r.pre_payment || 0,
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

        // ۴. آمار
        const paidTransactions = transactions.filter(
            (t) => t.status === "paid"
        );
        const pendingTransactions = transactions.filter(
            (t) => t.status === "pending"
        );

        const stats = {
            total: transactions.length,
            paid: paidTransactions.length,
            pending: pendingTransactions.length,
            failed: transactions.filter((t) => t.status === "failed").length,
            refunded: transactions.filter((t) => t.status === "refunded")
                .length,
            total_paid_amount: paidTransactions.reduce(
                (sum, t) => sum + (t.amount || 0),
                0
            ),
            total_pending_amount: pendingTransactions.reduce(
                (sum, t) => sum + (t.amount || 0),
                0
            ),
        };

        return NextResponse.json({
            success: true,
            transactions,
            stats,
        });
    } catch (err) {
        console.error("[hall_owner/transactions] Error:", err);
        return NextResponse.json(
            { message: err.message || "خطای داخلی سرور" },
            { status: 500 }
        );
    }
}