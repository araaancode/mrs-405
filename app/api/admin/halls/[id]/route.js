// app/api/admin/halls/[id]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Hall from "@/models/Hall";
import User from "@/models/User";
import { notify } from "@/lib/notificationService";

/* ============================================================
   GET — دریافت جزئیات تالار
   ============================================================ */
export async function GET(req, { params }) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const admin = await User.findById(session.user.id);
        if (admin?.role !== "admin") {
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            );
        }

        const { id } = await params;
        const hall = await Hall.findById(id).populate(
            "hall_owner_id",
            "full_name email phone"
        );

        if (!hall) {
            return NextResponse.json(
                { message: "تالار یافت نشد" },
                { status: 404 }
            );
        }

        return NextResponse.json(hall);
    } catch (error) {
        console.error("❌ [admin hall GET] Error:", error);
        return NextResponse.json(
            { message: error.message || "خطای سرور" },
            { status: 500 }
        );
    }
}

/* ============================================================
   PATCH — تأیید یا رد تالار
   ============================================================ */
export async function PATCH(req, { params }) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const admin = await User.findById(session.user.id);
        if (admin?.role !== "admin") {
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            );
        }

        const { id } = await params;
        const body = await req.json();
        const { action, reason } = body;

        if (!["approve", "reject"].includes(action)) {
            return NextResponse.json(
                { message: "اکشن نامعتبر است (approve یا reject)" },
                { status: 400 }
            );
        }

        const hall = await Hall.findById(id);
        if (!hall) {
            return NextResponse.json(
                { message: "تالار یافت نشد" },
                { status: 404 }
            );
        }

        if (action === "approve") {
            hall.is_active = true;
            await hall.save();

            // 🔔 نوتیف به تالاردار
            try {
                await notify({
                    userId: hall.hall_owner_id,
                    type: "hall_approved",
                    data: { hall_title: hall.title },
                });
                console.log("✅ [admin hall approve] Notification sent");
            } catch (err) {
                console.error(
                    "❌ [admin hall approve] Notification failed:",
                    err
                );
            }

            return NextResponse.json({
                success: true,
                message: "تالار با موفقیت تأیید شد",
                hall,
            });
        }

        // reject
        if (!reason || reason.trim().length < 5) {
            return NextResponse.json(
                { message: "دلیل رد باید حداقل ۵ کاراکتر باشد" },
                { status: 400 }
            );
        }

        hall.is_active = false;
        await hall.save();

        // 🔔 نوتیف به تالاردار
        try {
            await notify({
                userId: hall.hall_owner_id,
                type: "hall_rejected",
                data: { hall_title: hall.title, reason: reason.trim() },
            });
            console.log("✅ [admin hall reject] Notification sent");
        } catch (err) {
            console.error(
                "❌ [admin hall reject] Notification failed:",
                err
            );
        }

        return NextResponse.json({
            success: true,
            message: "تالار رد شد",
            hall,
        });
    } catch (error) {
        console.error("❌ [admin hall PATCH] Error:", error);
        return NextResponse.json(
            { message: error.message || "خطای سرور" },
            { status: 500 }
        );
    }
}

/* ============================================================
   DELETE — حذف تالار
   ============================================================ */
export async function DELETE(req, { params }) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const admin = await User.findById(session.user.id);
        if (admin?.role !== "admin") {
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            );
        }

        const { id } = await params;
        const hall = await Hall.findByIdAndDelete(id);

        if (!hall) {
            return NextResponse.json(
                { message: "تالار یافت نشد" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "تالار حذف شد",
        });
    } catch (error) {
        console.error("❌ [admin hall DELETE] Error:", error);
        return NextResponse.json(
            { message: error.message || "خطای سرور" },
            { status: 500 }
        );
    }
}