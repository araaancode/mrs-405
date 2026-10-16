export const dynamic = "force-dynamic";

// app/api/admin/profile/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

/* ============================================================
   GET — دریافت پروفایل کاربر جاری
   ============================================================ */
export async function GET() {
    await dbConnect();

    const session = await getServerSession(authOptions);

    // دیباگ — بعد از حل مشکل حذف کن
    console.log("SESSION DEBUG:", {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        userIdLength: session?.user?.id?.length,
    });

    if (!session?.user?.id) {
        return Response.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    const user = await User.findById(session.user.id).select(
        "-password -otp_code -otp_expires"
    );

    if (!user) {
        return Response.json(
            { message: "User not found" },
            { status: 404 }
        );
    }

    return Response.json({ user });
}

/* ============================================================
   PUT — بروزرسانی پروفایل
   ============================================================ */
export async function PUT(req) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return Response.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    const data = await req.json();

    // حذف فیلدهای حساس
    const {
        password,
        role,
        otp_code,
        otp_expires,
        _id,
        __v,
        createdAt,
        updatedAt,
        ...safeData
    } = data;

    const user = await User.findByIdAndUpdate(
        session.user.id,
        safeData,
        { new: true, runValidators: true }
    ).select("-password -otp_code -otp_expires");

    if (!user) {
        return Response.json(
            { message: "User not found" },
            { status: 404 }
        );
    }

    return Response.json({
        message: "updated",
        user,
    });
}