// app/api/notifications/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Notification from "@/models/Notification";

/* ============================================================
   GET — لیست نوتیفیکیشن‌ها
   ============================================================ */
export async function GET(req) {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const limit = Math.min(Number(searchParams.get("limit")) || 20, 100);
        const page = Math.max(Number(searchParams.get("page")) || 1, 1);
        const onlyUnread = searchParams.get("unread") === "true";
        const typeFilter = searchParams.get("type");

        const query = { user_id: session.user.id };
        if (onlyUnread) query.is_read = false;
        if (typeFilter) query.type = typeFilter;

        const [notifications, total, unreadCount] = await Promise.all([
            Notification.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Notification.countDocuments(query),
            Notification.countDocuments({
                user_id: session.user.id,
                is_read: false,
            }),
        ]);

        return NextResponse.json({
            notifications,
            total,
            unreadCount,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        console.error("[GET /api/notifications]", err);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

/* ============================================================
   PATCH — علامت‌گذاری خوانده‌شده
   ============================================================ */
export async function PATCH(req) {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json().catch(() => ({}));

        if (body.id) {
            await Notification.findOneAndUpdate(
                { _id: body.id, user_id: session.user.id },
                { $set: { is_read: true, read_at: new Date() } }
            );
        } else {
            await Notification.updateMany(
                { user_id: session.user.id, is_read: false },
                { $set: { is_read: true, read_at: new Date() } }
            );
        }

        const unreadCount = await Notification.countDocuments({
            user_id: session.user.id,
            is_read: false,
        });

        return NextResponse.json({ success: true, unreadCount });
    } catch (err) {
        console.error("[PATCH /api/notifications]", err);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

/* ============================================================
   DELETE — حذف
   ============================================================ */
export async function DELETE(req) {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const all = searchParams.get("all") === "true";

        if (all) {
            await Notification.deleteMany({ user_id: session.user.id });
        } else if (id) {
            await Notification.findOneAndDelete({
                _id: id,
                user_id: session.user.id,
            });
        } else {
            return NextResponse.json({ message: "ID required" }, { status: 400 });
        }

        const unreadCount = await Notification.countDocuments({
            user_id: session.user.id,
            is_read: false,
        });

        return NextResponse.json({ success: true, unreadCount });
    } catch (err) {
        console.error("[DELETE /api/notifications]", err);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}