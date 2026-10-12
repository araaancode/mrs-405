// lib/zarinpalService.js
import axios from "axios";

/* ============================================================
   تنظیمات
   ============================================================ */
const MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID;
const IS_SANDBOX = process.env.ZARINPAL_SANDBOX === "true";
const IS_TOMAN = process.env.ZARINPAL_IS_TOMAN !== "false";

const API_BASE = IS_SANDBOX
    ? "https://sandbox.zarinpal.com/pg"
    : "https://payment.zarinpal.com/pg";

const REQUEST_URL = `${API_BASE}/v4/payment/request.json`;
const VERIFY_URL = `${API_BASE}/v4/payment/verify.json`;
const GATEWAY_URL = `${API_BASE}/StartPay`;

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
    if (!MERCHANT_ID) {
        return { success: false, error: "Zarinpal merchant ID not configured" };
    }

    if (!amount || amount <= 0) {
        return { success: false, error: "Invalid amount" };
    }

    if (!callbackUrl || !callbackUrl.startsWith("http")) {
        return { success: false, error: "Invalid callback URL" };
    }

    // تبدیل تومان به ریال (زرین‌پال ریال می‌خواهد)
    const finalAmount = IS_TOMAN ? Math.round(amount * 10) : Math.round(amount);

    const payload = {
        merchant_id: MERCHANT_ID,
        amount: finalAmount,
        callback_url: callbackUrl,
        description: description || "پرداخت رزرو تالار",
    };

    // افزودن metadata فقط اگر مقدار داشته باشد
    const metadata = {};
    if (mobile) metadata.mobile = String(mobile);
    if (email) metadata.email = String(email);
    if (Object.keys(metadata).length > 0) {
        payload.metadata = metadata;
    }

    try {
        console.log("🔍 [Zarinpal] Request:", {
            url: REQUEST_URL,
            amount: finalAmount,
            callbackUrl,
            sandbox: IS_SANDBOX,
        });

        const response = await axios.post(REQUEST_URL, payload, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            timeout: 15000,
        });

        const data = response.data;
        console.log("🔍 [Zarinpal] Response:", data);

        if (data?.data?.code === 100 && data?.data?.authority) {
            return {
                success: true,
                authority: data.data.authority,
                link: `${GATEWAY_URL}/${data.data.authority}`,
                fee: data.data.fee,
            };
        }

        return {
            success: false,
            error:
                data?.errors?.message ||
                data?.errors?.code?.toString() ||
                "Zarinpal request failed",
            code: data?.errors?.code,
        };
    } catch (err) {
        console.error(
            "[Zarinpal] Create error:",
            err.response?.data || err.message
        );
        return {
            success: false,
            error:
                err.response?.data?.errors?.message ||
                err.message ||
                "Network error",
        };
    }
}

/* ============================================================
   تأیید تراکنش
   ============================================================ */
export async function verifyPayment({ amount, authority }) {
    if (!MERCHANT_ID) {
        return { success: false, error: "Zarinpal merchant ID not configured" };
    }

    if (!amount || !authority) {
        return { success: false, error: "Missing amount or authority" };
    }

    const finalAmount = IS_TOMAN ? Math.round(amount * 10) : Math.round(amount);

    try {
        const response = await axios.post(
            VERIFY_URL,
            {
                merchant_id: MERCHANT_ID,
                amount: finalAmount,
                authority,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                timeout: 15000,
            }
        );

        const data = response.data;
        console.log("🔍 [Zarinpal] Verify response:", data);

        if (data?.data?.code === 100 || data?.data?.code === 101) {
            return {
                success: true,
                alreadyVerified: data.data.code === 101,
                refId: data.data.ref_id,
                cardPan: data.data.card_pan,
                fee: data.data.fee,
            };
        }

        return {
            success: false,
            error:
                data?.errors?.message ||
                data?.errors?.code?.toString() ||
                "Verify failed",
            code: data?.errors?.code,
        };
    } catch (err) {
        console.error(
            "[Zarinpal] Verify error:",
            err.response?.data || err.message
        );
        return {
            success: false,
            error:
                err.response?.data?.errors?.message ||
                err.message ||
                "Network error",
        };
    }
}