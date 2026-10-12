// app/api/admin/ads/[id]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Advertisement from "@/models/Advertisement";
import Hall from "@/models/Hall"; // ← مهم
import User from "@/models/User"; // ← مهم برای populate owner_id
import mongoose from "mongoose";

/* ============================================================
   GET — جزئیات یک تبلیغ (ادمین)
   ============================================================ */
export async function GET(req, { params }) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "admin") {
            return NextResponse.json(
                { message: "دسترسی غیرمجاز" },
                { status: 403 }
            );
        }

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "شناسه نامعتبر" },
                { status: 400 }
            );
        }

        const ad = await Advertisement.findById(id)
            .populate("owner_id", "full_name email phone role")
            .populate("hall_id", "title city province images")
            .populate("reviewed_by", "full_name")
            .lean();

        if (!ad) {
            return NextResponse.json(
                { message: "تبلیغ یافت نشد" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, ad });
    } catch (err) {
        console.error("[admin/ads/[id] GET] Error:", err);
        return NextResponse.json(
            { message: err.message || "خطای سرور" },
            { status: 500 }
        );
    }
}

/* ============================================================
   DELETE — حذف تبلیغ (ادمین)
   ============================================================ */
export async function DELETE(req, { params }) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "admin") {
            return NextResponse.json(
                { message: "دسترسی غیرمجاز" },
                { status: 403 }
            );
        }

        const { id } = await params;

        const ad = await Advertisement.findByIdAndDelete(id);
        if (!ad) {
            return NextResponse.json(
                { message: "تبلیغ یافت نشد" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "تبلیغ حذف شد",
        });
    } catch (err) {
        console.error("[admin/ads/[id] DELETE] Error:", err);
        return NextResponse.json(
            { message: err.message || "خطای سرور" },
            { status: 500 }
        );
    }
}