// app/api/hall_owner/halls/[id]/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Hall from "@/models/Hall";

export async function GET(req, { params }) {
    try {
        await connectDB();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "شناسه تالار نامعتبر است" },
                { status: 400 }
            );
        }

        const hall = await Hall.findById(id);

        if (!hall) {
            return NextResponse.json(
                { success: false, message: "تالار پیدا نشد" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, hall });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { success: false, message: "خطا در دریافت تالار" },
            { status: 500 }
        );
    }
}

export async function PUT(req, { params }) {
    try {
        await connectDB();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "شناسه نامعتبر است" },
                { status: 400 }
            );
        }

        const body = await req.json();

        const hall = await Hall.findById(id);
        if (!hall) {
            return NextResponse.json(
                { success: false, message: "تالار پیدا نشد" },
                { status: 404 }
            );
        }

        const updatedHall = await Hall.findByIdAndUpdate(
            id,
            {
                title: body.title,
                province: body.province,
                city: body.city,
                address: body.address,
                lat: body.lat,
                lng: body.lng,
                postal_code: body.postal_code,
                hall_phone: body.hall_phone,
                hall_owner_name: body.hall_owner_name,
                hall_owner_phone: body.hall_owner_phone,
                hall_measure: body.hall_measure,
                description: body.description,
                year: body.year,
                hall_roles: body.hall_roles,
                capacity: body.capacity,
                duration: body.duration,
                free_dates: body.free_dates,
                images: body.images,
                entrance_rolls: body.entrance_rolls,
                hall_type: body.hall_type,
                host_type: body.host_type,
                event_type: body.event_type,
                properties: body.properties,
                parking_count: body.parking_count,
                roof_count: body.roof_count,
                has_sans: body.has_sans,
                hall_document: body.hall_document,
                sans_price: body.sans_price,
                sans_discount: body.sans_discount,
                licensee_number: body.licensee_number,
                cancel_rolls: body.cancel_rolls,
                camera_capacities: body.camera_capacities,
                reservation_rolls: body.reservation_rolls,
            },
            { new: true, runValidators: true }
        );

        return NextResponse.json({ success: true, hall: updatedHall });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { success: false, message: "خطا در ویرایش تالار" },
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { id } = await params;

        const hall = await Hall.findOne({ _id: id });
        if (!hall) {
            return NextResponse.json(
                { message: "تالار یافت نشد یا شما اجازه حذف آن را ندارید" },
                { status: 404 }
            );
        }

        await Hall.findByIdAndDelete(id);

        return NextResponse.json(
            { message: "تالار با موفقیت حذف شد" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting hall:", error);
        return NextResponse.json(
            { message: "خطای سرور در حذف تالار" },
            { status: 500 }
        );
    }
}