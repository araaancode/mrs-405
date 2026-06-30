import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Hall from "@/models/Hall";

import fs from "fs";
import path from "path";

export async function POST(req) {

    try {

        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "hall_owner") {
            return NextResponse.json({ success: false, message: "دسترسی غیرمجاز" }, { status: 403 });
        }

        await connectDB();

        const body = await req.json();

        const {
            title,
            province,
            city,
            address,
            lat,
            lng,
            postal_code,
            hall_phone,
            hall_owner_name,
            hall_owner_phone,
            hall_measure,
            description,
            year,
            hall_roles,
            capacity,
            duration,
            free_dates,
            entrance_rolls,
            hall_type,
            host_type,
            event_type,
            properties,
            parking_count,
            roof_count,
            has_sans,
            hall_document,
            sans_price,
            sans_discount,
            licensee_number,
            cancel_rolls,
            camera_capacities,
            reservation_rolls,
            images
        } = body;

        const uploadDir = path.join(process.cwd(), "public/uploads/halls");

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const saveFiles = (files, folder) => {

            const paths = [];

            for (const file of files || []) {

                const base64 = file.split(";base64,").pop();
                const fileName = `${Date.now()}-${Math.random()}.${folder}`;
                const filePath = path.join(uploadDir, fileName);

                fs.writeFileSync(filePath, base64, { encoding: "base64" });

                paths.push(`/uploads/halls/${fileName}`);
            }

            return paths;
        };

        const imagePaths = saveFiles(images, "jpg");
        const docPaths = saveFiles(hall_document, "pdf");

        const hall = await Hall.create({

            hall_owner_id: session.user.id,

            title,
            province,
            city,
            address,
            lat,
            lng,
            postal_code,
            hall_phone,
            hall_owner_name,
            hall_owner_phone,
            hall_measure,
            description,
            year,
            hall_roles,
            capacity,
            duration,
            free_dates,
            entrance_rolls,
            hall_type,
            host_type,
            event_type,
            properties,
            parking_count,
            roof_count,
            has_sans,
            hall_document: docPaths,
            sans_price,
            sans_discount,
            licensee_number,
            cancel_rolls,
            camera_capacities,
            reservation_rolls,
            images: imagePaths,
            is_active: true

        });

        return NextResponse.json({
            success: true,
            data: hall
        });

    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });

    }

}


// ===========================
// GET HALLS FOR LOGGED-IN OWNER
// ===========================
export async function GET() {
    try {

        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "hall_owner") {
            return NextResponse.json(
                { success: false, message: "دسترسی غیرمجاز" },
                { status: 403 }
            );
        }

        await connectDB();

        const halls = await Hall.find({ hall_owner_id: session.user.id })
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            halls
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}