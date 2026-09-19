// lib/notifications/sms.js
import axios from 'axios';
import { getTemplate } from './templates';

/**
 * ارسال پیامک با استفاده از سرویس‌های مختلف
 */
export async function sendSMS(phone, message) {
    try {
        // انتخاب سرویس پیامک (بر اساس تنظیمات)
        const provider = process.env.SMS_PROVIDER || 'melipayamak';

        switch (provider) {
            case 'melipayamak':
                return await sendViaMelipayamak(phone, message);
            case 'ippanel':
                return await sendViaIppanel(phone, message);
            case 'kavenegar':
                return await sendViaKavenegar(phone, message);
            default:
                throw new Error('SMS provider not configured');
        }
    } catch (error) {
        console.error('SMS error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * ارسال از طریق ملی پیامک
 */
async function sendViaMelipayamak(phone, message) {
    try {
        const response = await axios.post(
            'https://rest.payamak-panel.com/api/SendSMS/SendSMS',
            {
                username: process.env.MELIPAYAMAK_USERNAME,
                password: process.env.MELIPAYAMAK_PASSWORD,
                from: process.env.SMS_FROM,
                to: phone,
                text: message,
                isFlash: false
            },
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: 10000
            }
        );

        return {
            success: response.data.retStatus === '1',
            messageId: response.data.recId,
            data: response.data
        };
    } catch (error) {
        console.error('Melipayamak error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * ارسال از طریق IPPanel
 */
async function sendViaIppanel(phone, message) {
    try {
        const response = await axios.post(
            'https://api.ippanel.com/v1/messages',
            {
                sender: process.env.SMS_FROM,
                receptor: phone,
                message: message
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': process.env.IPPANEL_API_KEY
                },
                timeout: 10000
            }
        );

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error('IPPanel error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * ارسال از طریق کاوه‌نگار
 */
async function sendViaKavenegar(phone, message) {
    try {
        const response = await axios.get(
            `https://api.kavenegar.com/v1/${process.env.KAVENEGAR_API_KEY}/sms/send.json`,
            {
                params: {
                    sender: process.env.SMS_FROM,
                    receptor: phone,
                    message: message
                },
                timeout: 10000
            }
        );

        return {
            success: response.data.return.status === 200,
            data: response.data
        };
    } catch (error) {
        console.error('Kavenegar error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * ارسال پیامک نوتیفیکیشن
 */
export async function sendNotificationSMS(user, notification, templateData = {}) {
    const template = getTemplate(notification.type, templateData);
    if (!template) return { success: false, error: 'Template not found' };

    // محدودیت طول پیامک (160 کاراکتر)
    let message = template.sms || template.message;
    if (message.length > 160) {
        message = message.substring(0, 157) + '...';
    }

    // افزودن نام کاربر
    message = `سلام ${user.full_name?.split(' ')[0] || 'کاربر'}،\n` + message;

    return await sendSMS(user.phone, message);
}