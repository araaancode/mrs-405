import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        // No user session
        if (!session || !session.user) {
            return NextResponse.json(
                { error: "شما وارد حساب کاربری نشده‌اید" },
                { status: 401 }
            );
        }

        console.log(session)

        // Check admin role
        if (session.user.role !== "admin") {
            return NextResponse.json(
                { error: "شما دسترسی لازم را ندارید" },
                { status: 403 }
            );
        }

        await connectDB();

        const users = await User.find()

        return NextResponse.json(
            { users },
            { status: 200 }
        );

    } catch (err) {
        return NextResponse.json(
            { error: "مشکلی پیش آمده", details: err.message },
            { status: 500 }
        );
    }
}
