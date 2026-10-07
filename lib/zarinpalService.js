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
            isToman: process.env.ZARINPAL_IS_TOMAN !== "false",
        });
    }
    return zarinpalInstance;
}

/* ============================================================
   ایجاد تراکنش
   ============================================================ */
export async function createPayment({
    amount,
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

        console.log("🔍 [Zarinpal] Create result:", result);

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
   تأیید تراکنش
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

        console.log("🔍 [Zarinpal] Verify result:", result);

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