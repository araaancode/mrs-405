// app/api/hall_owner/halls/[id]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Hall from "@/models/Hall";

/* ============================================================
   Helpers
   ============================================================ */

/** ذخیره فایل‌های base64 روی دیسک */
function saveFiles(files, uploadDir) {
  if (!Array.isArray(files) || files.length === 0) return [];

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const saved = [];
  for (const file of files) {
    // اگر قبلاً ذخیره شده (مسیر است، نه base64) → همان را نگه دار
    if (typeof file === "string" && file.startsWith("/uploads/")) {
      saved.push(file);
      continue;
    }

    if (typeof file !== "string" || !file.includes(";base64,")) continue;

    // استخراج پسوند از data URI: data:image/jpeg;base64,... یا data:application/pdf;base64,...
    const mimeMatch = file.match(/^data:([^;]+);base64,/);
    const mime = mimeMatch?.[1] || "image/jpeg";
    const ext =
      {
        "image/jpeg": "jpg",
        "image/jpg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "application/pdf": "pdf",
      }[mime] || "bin";

    const base64 = file.split(";base64,").pop();
    const fileName = `${Date.now()}-${Math.floor(Math.random() * 1e9)}.${ext}`;
    const filePath = path.join(uploadDir, fileName);

    try {
      fs.writeFileSync(filePath, base64, { encoding: "base64" });
      saved.push(`/uploads/halls/${fileName}`);
    } catch (err) {
      console.error("Error saving file:", err);
    }
  }
  return saved;
}

/** حذف فایل‌های قدیمی که دیگر استفاده نمی‌شوند */
function deleteOldFiles(oldPaths, newPaths) {
  if (!Array.isArray(oldPaths)) return;
  const newSet = new Set(newPaths || []);

  for (const p of oldPaths) {
    if (!p || newSet.has(p)) continue;
    if (!p.startsWith("/uploads/")) continue;

    try {
      const absPath = path.join(process.cwd(), "public", p);
      if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  }
}

/* ============================================================
   GET: دریافت یک تالار
   ============================================================ */
export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "hall_owner") {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "شناسه تالار نامعتبر است" },
        { status: 400 }
      );
    }

    // فقط تالارهای متعلق به همین مالک
    const hall = await Hall.findOne({
      _id: id,
      hall_owner_id: session.user.id,
    });

    if (!hall) {
      return NextResponse.json(
        { success: false, message: "تالار پیدا نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, hall });
  } catch (error) {
    console.error("❌ GET /halls/[id]:", error);
    return NextResponse.json(
      { success: false, message: "خطا در دریافت تالار" },
      { status: 500 }
    );
  }
}

/* ============================================================
   PUT: ویرایش تالار
   ============================================================ */
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "hall_owner") {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "شناسه نامعتبر است" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // اطمینان از مالکیت
    const existing = await Hall.findOne({
      _id: id,
      hall_owner_id: session.user.id,
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "تالار پیدا نشد یا دسترسی ندارید" },
        { status: 404 }
      );
    }

    /* ---------- پردازش فایل‌ها ---------- */
    const uploadDir = path.join(process.cwd(), "public/uploads/halls");

    const newImagePaths = saveFiles(body.images, uploadDir);
    const newDocPaths = saveFiles(body.hall_document, uploadDir);

    // حذف فایل‌های قدیمی که دیگر در آرایه جدید نیستند
    deleteOldFiles(existing.images, newImagePaths);
    deleteOldFiles(existing.hall_document, newDocPaths);

    /* ---------- ساخت payload ---------- */
    const updateData = {
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
      capacity: body.capacity,
      duration: body.duration,
      hall_type: body.hall_type,
      host_type: body.host_type,
      event_type: body.event_type,
      parking_count: body.parking_count,
      roof_count: body.roof_count,
      has_sans: body.has_sans,
      sans_price: body.sans_price,
      sans_discount: body.sans_discount,
      licensee_number: body.licensee_number,

      // آرایه‌ها
      hall_roles: body.hall_roles,
      entrance_rolls: body.entrance_rolls,
      properties: body.properties,
      cancel_rolls: body.cancel_rolls,
      camera_capacities: body.camera_capacities,
      reservation_rolls: body.reservation_rolls,
      free_dates: body.free_dates,

      // فایل‌های ذخیره‌شده جدید
      images: newImagePaths,
      hall_document: newDocPaths,
    };

    // حذف undefined ها
    Object.keys(updateData).forEach((k) => {
      if (updateData[k] === undefined) delete updateData[k];
    });

    /* ---------- اعمال ویرایش ---------- */
    const updatedHall = await Hall.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      context: "query", // مهم برای validatorهایی که به this نیاز دارند
    });

    return NextResponse.json({ success: true, hall: updatedHall });
  } catch (error) {
    console.error("❌ PUT /halls/[id]:", error);

    // خطای validation
    if (error.name === "ValidationError") {
      const firstMsg = Object.values(error.errors)[0]?.message;
      return NextResponse.json(
        { success: false, message: firstMsg || "خطای اعتبارسنجی" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message || "خطا در ویرایش تالار" },
      { status: 500 }
    );
  }
}

/* ============================================================
   DELETE: حذف تالار + فایل‌ها
   ============================================================ */
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "hall_owner") {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "شناسه نامعتبر است" },
        { status: 400 }
      );
    }

    // فقط تالار خودش را می‌تواند حذف کند
    const hall = await Hall.findOne({
      _id: id,
      hall_owner_id: session.user.id,
    });

    if (!hall) {
      return NextResponse.json(
        { message: "تالار یافت نشد یا دسترسی ندارید" },
        { status: 404 }
      );
    }

    // حذف فایل‌ها از دیسک
    const allFiles = [...(hall.images || []), ...(hall.hall_document || [])];
    for (const p of allFiles) {
      if (!p.startsWith("/uploads/")) continue;
      try {
        const abs = path.join(process.cwd(), "public", p);
        if (fs.existsSync(abs)) fs.unlinkSync(abs);
      } catch (err) {
        console.error("Error deleting file:", err);
      }
    }

    await Hall.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: "تالار با موفقیت حذف شد" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ DELETE /halls/[id]:", error);
    return NextResponse.json(
      { success: false, message: "خطای سرور در حذف تالار" },
      { status: 500 }
    );
  }
}