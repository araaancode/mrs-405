// lib/zarinpalService.js
import ZarinpalPayment from "zarinpal-pay";

/* ============================================================
   ایجاد نمونه زرین‌پال (Singleton)
   ============================================================ */
let zarinpalInstance = null;

function getZarinpal() {
    if (!zarinpalInstance) {
        const merchantId = process.env.ZARINPAL_MERCHANT_ID;
        if (!merchantId) {
            console.warn("[Zarinpal] Merchant ID missing in .env");
            return null;
        }

        zarinpalInstance = new ZarinpalPayment(merchantId, {
            isSandbox: process.env.ZARINPAL_SANDBOX === "true",
            isToman: process.env.ZARINPAL_IS_TOMAN !== "false", // پیش‌فرض true
        });
    }
    return zarinpalInstance;
}

/* ============================================================
   ایجاد تراکنش (درخواست پرداخت)
   ============================================================ */
export async function createPayment({
    amount,        // به تومان (چون isToman=true)
    callbackUrl,
    mobile,
    email,
    description,
    orderId,
}) {
    const zarinpal = getZarinpal();
    if (!zarinpal) {
        return { success: false, error: "Zarinpal not configured" };
    }

    try {
        const result = await zarinpal.create({
            amount,
            callback_url: callbackUrl,
            mobile,
            email,
            description: description || "پرداخت رزرو تالار",
            order_id: orderId,
        });

        // code = 100 یعنی موفق [citation:10]
        if (result.code === 100 && result.authority && result.link) {
            return {
                success: true,
                authority: result.authority,
                link: result.link,
                fee: result.fee,
            };
        }

        return {
            success: false,
            error: result.message || "Zarinpal create failed",
            code: result.code,
        };
    } catch (err) {
        console.error("[Zarinpal] Create error:", err);
        return { success: false, error: err.message };
    }
}

/* ============================================================
   تأیید تراکنش (پس از بازگشت کاربر)
   ============================================================ */
export async function verifyPayment({ amount, authority }) {
    const zarinpal = getZarinpal();
    if (!zarinpal) {
        return { success: false, error: "Zarinpal not configured" };
    }

    try {
        const result = await zarinpal.verify({
            amount,
            authority,
        });

        // code = 100 → موفق
        // code = 101 → قبلاً تأیید شده [citation:7]
        if (result.code === 100 || result.code === 101) {
            return {
                success: true,
                alreadyVerified: result.code === 101,
                refId: result.ref_id,
                cardPan: result.card_pan,
                fee: result.fee,
            };
        }

        return {
            success: false,
            error: result.message || "Verify failed",
            code: result.code,
        };
    } catch (err) {
        console.error("[Zarinpal] Verify error:", err);
        return { success: false, error: err.message };
    }
}