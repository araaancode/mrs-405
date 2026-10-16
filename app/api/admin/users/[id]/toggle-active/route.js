export const dynamic = "force-dynamic";

// app/api/admin/users/[id]/toggle-active/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import mongoose from "mongoose";

export async function PATCH(req, { params }) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "شما وارد حساب کاربری نشده‌اید" },
                { status: 401 }
            );
        }

        if (session.user.role !== "admin") {
            return NextResponse.json(
                { error: "شما دسترسی لازم را ندارید" },
                { status: 403 }
            );
        }

        const { id } = params;

        // اعتبارسنجی ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "شناسه کاربر معتبر نیست" },
                { status: 400 }
            );
        }

        // ادمین نمی‌تواند خودش را غیرفعال کند
        if (id === session.user.id) {
            return NextResponse.json(
                { error: "نمی‌توانید حساب خودتان را غیرفعال کنید" },
                { status: 400 }
            );
        }

        // خواندن بدنه درخواست (اختیاری)
        let body = {};
        try {
            body = await req.json();
        } catch {
            // اگر بدنه‌ای نبود، اشکالی ندارد
        }

        const user = await User.findById(id).select(
            "-password -otp_code -otp_expires"
        );

        if (!user) {
            return NextResponse.json(
                { error: "کاربر یافت نشد" },
                { status: 404 }
            );
        }

        // اگر در بدنه is_active مشخص شده بود، از آن استفاده کن
        // در غیر این صورت toggle کن
        const newStatus =
            typeof body.is_active === "boolean"
                ? body.is_active
                : !user.is_active;

        user.is_active = newStatus;
        await user.save({ validateBeforeSave: false });

        return NextResponse.json(
            {
                message: newStatus
                    ? "کاربر با موفقیت فعال شد"
                    : "کاربر با موفقیت غیرفعال شد",
                user: {
                    _id: user._id,
                    full_name: user.full_name,
                    is_active: user.is_active,
                },
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("TOGGLE ACTIVE ERROR:", err);
        return NextResponse.json(
            { error: "مشکلی پیش آمد", details: err.message },
            { status: 500 }
        );
    }
}