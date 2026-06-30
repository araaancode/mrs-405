import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Ticket from "@/models/Ticket";

export async function POST(req) {

    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session.user.id);

    if (!user) {
        return Response.json({ message: "User not found" }, { status: 404 });
    }

    if (user.role !== "user") {
        return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    const ticket = await Ticket.create({
        subject: body.subject,
        description: body.description,
        priority: body.priority || "normal",
        reporterId: user._id
    });

    return Response.json(ticket, { status: 201 });
}


export async function GET() {

    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session.user.id);

    if (!user) {
        return Response.json({ message: "User not found" }, { status: 404 });
    }

    if (user.role !== "user") {
        return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    const tickets = await Ticket.find({ reporterId: user._id })
        .sort({ createdAt: -1 });

    return Response.json(tickets);
}
