// app/api/admin/users/[id]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { notify } from "@/lib/notificationService";

/* ============================================================
   GET — دریافت جزئیات کاربر
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
        const user = await User.findById(id).select("-password -otp_code");

        if (!user) {
            return NextResponse.json(
                { message: "کاربر یافت نشد" },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error(" [admin user GET] Error:", error);
        return NextResponse.json(
            { message: error.message || "خطای سرور" },
            { status: 500 }
        );
    }
}

/* ============================================================
   PATCH — تأیید یا غیرفعال کردن کاربر
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

        if (!["approve", "deactivate"].includes(action)) {
            return NextResponse.json(
                { message: "اکشن نامعتبر است (approve یا deactivate)" },
                { status: 400 }
            );
        }

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json(
                { message: "کاربر یافت نشد" },
                { status: 404 }
            );
        }

        // جلوگیری از تأیید/غیرفعال کردن خود ادمین
        if (user._id.toString() === admin._id.toString()) {
            return NextResponse.json(
                { message: "نمی‌توانید حساب خودتان را تغییر دهید" },
                { status: 400 }
            );
        }

        if (action === "approve") {
            user.is_active = true;
            user.verified_at = new Date();
            await user.save();

            // 🔔 نوتیف به کاربر
            try {
                await notify({
                    userId: user._id,
                    type: "account_approved",
                    data: {},
                });
                console.log(" [admin user approve] Notification sent");
            } catch (err) {
                console.error(
                    " [admin user approve] Notification failed:",
                    err
                );
            }

            return NextResponse.json({
                success: true,
                message: "کاربر تأیید شد",
                user,
            });
        }

        // deactivate
        user.is_active = false;
        await user.save();

        // 🔔 نوتیف به کاربر
        try {
            await notify({
                userId: user._id,
                type: "account_deactivated",
                data: { reason: reason?.trim() || "" },
            });
            console.log(" [admin user deactivate] Notification sent");
        } catch (err) {
            console.error(
                " [admin user deactivate] Notification failed:",
                err
            );
        }

        return NextResponse.json({
            success: true,
            message: "کاربر غیرفعال شد",
            user,
        });
    } catch (error) {
        console.error(" [admin user PATCH] Error:", error);
        return NextResponse.json(
            { message: error.message || "خطای سرور" },
            { status: 500 }
        );
    }
}

/* ============================================================
   DELETE — حذف کاربر
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

        if (id === session.user.id) {
            return NextResponse.json(
                { message: "نمی‌توانید حساب خودتان را حذف کنید" },
                { status: 400 }
            );
        }

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return NextResponse.json(
                { message: "کاربر یافت نشد" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "کاربر حذف شد",
        });
    } catch (error) {
        console.error(" [admin user DELETE] Error:", error);
        return NextResponse.json(
            { message: error.message || "خطای سرور" },
            { status: 500 }
        );
    }
}