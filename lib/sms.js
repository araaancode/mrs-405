// lib/sms.js
import axios from 'axios';

export async function sendSMS(phone, message) {
    try {
        // استفاده از سرویس پیامکی که در .env تنظیم شده
        const response = await axios.post('https://api.sms.ir/v1/send', {
            username: process.env.SMS_USERNAME,
            password: process.env.SMS_PASSWORD,
            from: process.env.SMS_FROM,
            to: phone,
            text: message
        });

        return response.data;
    } catch (error) {
        console.error('SMS error:', error);
        return null;
    }
}

// تابع ارسال پیامک تایید پرداخت
export async function sendPaymentConfirmation(reservation) {
    const message = `
         پرداخت رزرو تالار با موفقیت انجام شد.
        کد رزرو: ${reservation._id.toString().slice(-6)}
        مبلغ: ${reservation.pre_payment.toLocaleString()} تومان
        کد پیگیری: ${reservation.payment_info.ref_id}
        تاریخ: ${new Date().toLocaleDateString('fa-IR')}
    `;

    await sendSMS(reservation.user_id.phone, message);
}