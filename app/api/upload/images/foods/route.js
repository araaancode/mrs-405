import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('images');

        // اعتبارسنجی فایل‌ها
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
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'foods');

        // ایجاد پوشه آپلود اگر وجود ندارد
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // پردازش هر فایل
        for (const file of files) {
            // اعتبارسنجی نوع فایل
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                return NextResponse.json(
                    { error: `نوع فایل ${file.name} مجاز نیست. فقط jpg, jpeg, png, webp` },
                    { status: 400 }
                );
            }

            // اعتبارسنجی حجم فایل (حداکثر 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                return NextResponse.json(
                    { error: `حجم فایل ${file.name} بیش از 5MB است` },
                    { status: 400 }
                );
            }

            // ایجاد نام فایل منحصربه‌فرد
            const timestamp = Date.now();
            const randomNum = Math.floor(Math.random() * 10000);
            const originalName = path.parse(file.name).name;
            const extension = path.extname(file.name);
            const uniqueFilename = `${timestamp}_${randomNum}_${originalName}${extension}`;

            // تبدیل فایل به بافر
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // ذخیره فایل
            const filePath = path.join(uploadDir, uniqueFilename);
            fs.writeFileSync(filePath, buffer);

            // اضافه کردن URL به لیست
            uploadedUrls.push(`/uploads/foods/${uniqueFilename}`);
        }

        return NextResponse.json({
            success: true,
            message: `${files.length} فایل با موفقیت آپلود شد`,
            urls: uploadedUrls
        });

    } catch (error) {
        console.error('خطا در آپلود تصاویر:', error);
        return NextResponse.json(
            { error: 'خطا در آپلود تصاویر' },
            { status: 500 }
        );
    }
}
