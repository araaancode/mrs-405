export const dynamic = "force-dynamic";

// app/api/admin/ads/[id]/reject/route.js
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
        const body = await req.json().catch(() => ({}));
        const { reason } = body;

        if (!reason || reason.trim().length < 5) {
            return NextResponse.json(
                { message: "دلیل رد باید حداقل ۵ کاراکتر باشد" },
                { status: 400 }
            );
        }

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
                    message: `این تبلیغ در وضعیت "${ad.status}" است و قابل رد نیست`,
                },
                { status: 400 }
            );
        }

        ad.status = "rejected";
        ad.is_active = false;
        ad.reviewed_by = session.user.id;
        ad.reviewed_at = new Date();
        ad.rejection_reason = reason.trim();
        await ad.save();

        return NextResponse.json({
            success: true,
            ad,
            message: "تبلیغ رد شد",
        });
    } catch (err) {
        console.error("[admin/ads/reject] Error:", err);
        return NextResponse.json(
            { message: err.message || "خطای سرور" },
            { status: 500 }
        );
    }
}