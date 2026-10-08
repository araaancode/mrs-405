// lib/smsService.js
import https from "https";

/* ============================================================
   تنظیمات کنسول ملی پیامک
   ============================================================ */
const CONSOLE_TOKEN =
    process.env.MELIPAYAMAK_CONSOLE_TOKEN ||
    "2783a430de89451a8499166485b11b68";

const CONSOLE_HOST = "console.melipayamak.com";

/* ============================================================
   نرمال‌سازی شماره موبایل
   ============================================================ */
function normalizePhone(phone) {
    if (!phone) return null;
    let p = String(phone).replace(/[^\d]/g, "");

    if (p.startsWith("+98")) p = "0" + p.slice(3);
    if (p.startsWith("98") && p.length === 12) p = "0" + p.slice(2);
    if (p.startsWith("9") && p.length === 10) p = "0" + p;

    if (!/^09\d{9}$/.test(p)) return null;
    return p;
}

/* ============================================================
   تابع کمکی عمومی برای درخواست به کنسول
   ============================================================ */
function callConsoleAPI({ path, body }) {
    return new Promise((resolve) => {
        //  انکودینگ UTF-8 برای پشتیبانی از فارسی
        const data = JSON.stringify(body);
        const buffer = Buffer.from(data, "utf8");

        const options = {
            hostname: CONSOLE_HOST,
            port: 443,
            path: path,
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Content-Length": buffer.length,
            },
        };

        const req = https.request(options, (res) => {
            let responseData = "";
            res.setEncoding("utf8");

            res.on("data", (d) => (responseData += d));
            res.on("end", () => {
                try {
                    const result = JSON.parse(responseData);
                    resolve(result);
                } catch (err) {
                    resolve({
                        status: `Parse error: ${err.message}`,
                        raw: responseData,
                    });
                }
            });
        });

        req.on("error", (err) => {
            resolve({ status: `Request error: ${err.message}` });
        });

        req.write(buffer);
        req.end();
    });
}

/* ============================================================
   1. ارسال ساده (Simple) — یک گیرنده، متن آزاد
   ============================================================ */
export async function sendSimpleSMS({ to, text, from }) {
    const phone = normalizePhone(to);
    if (!phone) {
        return { success: false, error: "Invalid phone number" };
    }

    const sender = from || process.env.SMS_FROM;

    const result = await callConsoleAPI({
        path: `/api/send/simple/${CONSOLE_TOKEN}`,
        body: {
            from: sender,
            to: phone,
            text: text,
        },
    });

    console.log("🔍 [SMS Simple] Result:", result);

    if (result.recId && result.recId > 0) {
        return { success: true, recId: result.recId, phone };
    }

    return {
        success: false,
        error: result.status || "SMS send failed",
        raw: result,
    };
}

/* ============================================================
   2. ارسال با پترن (Shared) — یک گیرنده، پترن
   ============================================================ */
export async function sendPatternSMS({ to, bodyId, args = [] }) {
    const phone = normalizePhone(to);
    if (!phone) {
        return { success: false, error: "Invalid phone number" };
    }

    if (!bodyId) {
        return { success: false, error: "bodyId is required" };
    }

    //  اطمینان از اینکه args آرایه‌ایه و همه‌ی مقادیر رشته و trim شده هستن
    const safeArgs = (Array.isArray(args) ? args : [args]).map((a) =>
        String(a ?? "").trim()
    );

    console.log("🔍 [SMS Pattern] Sending:");
    console.log("   - bodyId:", bodyId);
    console.log("   - to:", phone);
    console.log("   - args:", safeArgs);
    console.log("   - args.length:", safeArgs.length);

    const result = await callConsoleAPI({
        path: `/api/send/shared/${CONSOLE_TOKEN}`,
        body: {
            bodyId: Number(bodyId),
            to: phone,
            args: safeArgs,
        },
    });

    console.log("🔍 [SMS Pattern] Response:", JSON.stringify(result, null, 2));

    if (result.recId && result.recId > 0) {
        return { success: true, recId: result.recId, phone };
    }

    return {
        success: false,
        error: result.status || "SMS send failed",
        raw: result,
    };
}

/* ============================================================
   3. ارسال پیشرفته (Advanced) — چند گیرنده، متن واحد
   ============================================================ */
export async function sendAdvancedSMS({ to, text, from, udh = "" }) {
    // نرمال‌سازی آرایه شماره‌ها
    const phones = (Array.isArray(to) ? to : [to])
        .map(normalizePhone)
        .filter(Boolean);

    if (phones.length === 0) {
        return { success: false, error: "No valid phone numbers" };
    }

    const sender = from || process.env.SMS_FROM;

    const result = await callConsoleAPI({
        path: `/api/send/advanced/${CONSOLE_TOKEN}`,
        body: {
            from: sender,
            to: phones,
            text: text,
            udh: udh,
        },
    });

    console.log("🔍 [SMS Advanced] Result:", result);

    if (
        result.recIds &&
        Array.isArray(result.recIds) &&
        result.recIds.length > 0
    ) {
        return {
            success: true,
            recIds: result.recIds,
            phones,
        };
    }

    return {
        success: false,
        error: result.status || "SMS send failed",
        raw: result,
    };
}

/* ============================================================
   تابع کمکی: ارسال با پترن بر اساس userId
   ============================================================ */
export async function sendPatternSMSByUserId({
    userId,
    bodyId,
    args = [],
    User,
}) {
    if (!bodyId) {
        console.warn("⚠️ [SMS] bodyId not set, skipping");
        return null;
    }

    try {
        const user = await User.findById(userId)
            .select("phone full_name")
            .lean();

        if (!user?.phone) {
            console.warn(`⚠️ [SMS] No phone for user ${userId}`);
            return null;
        }

        return await sendPatternSMS({
            to: user.phone,
            bodyId: Number(bodyId),
            args,
        });
    } catch (err) {
        console.error(" [SMS] Error:", err);
        return null;
    }
}