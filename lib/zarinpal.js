// lib/zarinpal.js
const SANDBOX = process.env.NODE_ENV === "development";
const BASE_URL = SANDBOX
    ? "https://sandbox.zarinpal.com/pg/rest/WebGate"
    : "https://api.zarinpal.com/pg/v4/payment";

export async function requestPayment({ amount, description, email, mobile, orderId }) {
    try {
        const payload = {
            merchant_id: process.env.ZARINPAL,
            amount: Math.round(amount), // اطمینان از عدد صحیح
            description: description || "پرداخت رزرو تالار",
            callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/callback`,
            metadata: {
                email: email || "",
                mobile: mobile || "",
                order_id: orderId || ""
            }
        };

        console.log("📤 Requesting payment with payload:", { ...payload, merchant_id: "***" });

        const response = await fetch(`${BASE_URL}/request.json`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("📥 Payment request response:", data);

        if (data.data && data.data.code === 100) {
            return {
                success: true,
                authority: data.data.authority,
                gatewayUrl: SANDBOX
                    ? `https://sandbox.zarinpal.com/pg/StartPay/${data.data.authority}`
                    : `https://www.zarinpal.com/pg/StartPay/${data.data.authority}`,
                message: "درخواست پرداخت با موفقیت ثبت شد"
            };
        } else {
            const errorMsg = data.errors?.message || data.data?.message || "خطا در اتصال به درگاه";
            return {
                success: false,
                message: errorMsg,
                code: data.data?.code
            };
        }
    } catch (error) {
        console.error(" Payment request error:", error);
        return {
            success: false,
            message: "خطا در ارتباط با درگاه پرداخت"
        };
    }
}

export async function verifyPayment(amount, authority) {
    try {
        const payload = {
            merchant_id: process.env.ZARINPAL,
            amount: Math.round(amount),
            authority: authority
        };

        console.log("📤 Verifying payment:", { authority, amount });

        const response = await fetch(`${BASE_URL}/verify.json`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("📥 Verify response:", data);

        if (data.data && data.data.code === 100) {
            return {
                success: true,
                refId: data.data.ref_id,
                message: "پرداخت با موفقیت تایید شد"
            };
        } else if (data.data && data.data.code === 101) {
            return {
                success: false,
                message: "این تراکنش قبلاً تایید شده است",
                code: 101
            };
        } else {
            const errorMsg = data.errors?.message || data.data?.message || "خطا در تایید پرداخت";
            return {
                success: false,
                message: errorMsg,
                code: data.data?.code
            };
        }
    } catch (error) {
        console.error(" Payment verification error:", error);
        return {
            success: false,
            message: "خطا در تایید پرداخت"
        };
    }
}