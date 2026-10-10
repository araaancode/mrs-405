// app/api/notifications/unread-count/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Notification from "@/models/Notification";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ unreadCount: 0 });
        }

        const unreadCount = await Notification.countDocuments({
            user_id: session.user.id,
            is_read: false,
        });

        return NextResponse.json({ unreadCount });
    } catch (err) {
        console.error("[GET /api/notifications/unread-count]", err);
        return NextResponse.json({ unreadCount: 0 }, { status: 500 });
    }
}