import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET() {

    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById({ _id: session.user.id });

    console.log(session)

    return Response.json({ user });
}

export async function PUT(req) {

    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const user = await User.findByIdAndUpdate(
        session.user.id,
        data,
        { new: true, runValidators: true }
    );

    return Response.json({
        message: "updated",
        user
    });
}
