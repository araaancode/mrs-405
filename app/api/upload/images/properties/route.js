// app/api/upload/property-images/route.js

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('images');

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: 'حداقل یک فایل تصویر الزامی است' },
                { status: 400 }
            );
        }

        if (files.length > 10) {
            return NextResponse.json(
                { error: 'حداکثر 10 فایل مجاز است' },
                { status: 400 }
            );
        }

        const uploadedUrls = [];
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'properties');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        for (const file of files) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                return NextResponse.json(
                    { error: `نوع فایل ${file.name} مجاز نیست` },
                    { status: 400 }
                );
            }

            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                return NextResponse.json(
                    { error: `حجم فایل ${file.name} بیش از 5MB است` },
                    { status: 400 }
                );
            }

            const timestamp = Date.now();
            const randomNum = Math.floor(Math.random() * 10000);
            const originalName = path.parse(file.name).name;
            const extension = path.extname(file.name);
            const unique = `${timestamp}_${randomNum}_${originalName}${extension}`;

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const filePath = path.join(uploadDir, unique);
            fs.writeFileSync(filePath, buffer);

            uploadedUrls.push(`/uploads/properties/${unique}`);
        }

        return NextResponse.json({
            success: true,
            urls: uploadedUrls
        });

    } catch (error) {
        return NextResponse.json(
            { error: 'خطا در آپلود تصاویر' },
            { status: 500 }
        );
    }
}
