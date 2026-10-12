// app/api/admin/ads/[id]/approve/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Advertisement from "@/models/Advertisement";

export async function PATCH(req, { params }) {
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

        const ad = await Advertisement.findById(id);
        if (!ad) {
            return NextResponse.json(
                { message: "تبلیغ یافت نشد" },
                { status: 404 }
            );
        }

        if (ad.status !== "pending") {
            return NextResponse.json(
                {
                    message: `این تبلیغ در وضعیت "${ad.status}" است و قابل تأیید نیست`,
                },
                { status: 400 }
            );
        }

        const now = new Date();
        let newStatus = "active";
        let isActive = true;

        if (ad.start_date > now) {
            newStatus = "approved";
            isActive = false;
        }

        ad.status = newStatus;
        ad.is_active = isActive;
        ad.reviewed_by = session.user.id;
        ad.reviewed_at = new Date();
        ad.rejection_reason = "";
        await ad.save();

        return NextResponse.json({
            success: true,
            ad,
            message:
                newStatus === "active"
                    ? "تبلیغ تأیید و فعال شد"
                    : "تبلیغ تأیید شد و در تاریخ مقرر فعال می‌شود",
        });
    } catch (err) {
        console.error("[admin/ads/approve] Error:", err);
        return NextResponse.json(
            { message: err.message || "خطای سرور" },
            { status: 500 }
        );
    }
}