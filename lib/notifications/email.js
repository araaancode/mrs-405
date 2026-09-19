// lib/notifications/email.js
import { getTemplate } from './templates';

/**
 * ارسال ایمیل (نسخه Mock - برای توسعه)
 * در محیط production با nodemailer جایگزین شود
 */
export async function sendEmail({ to, subject, html, text }) {
    try {
        // در محیط توسعه فقط لاگ می‌کنیم
        console.log('📧 Email would be sent:', {
            to,
            subject,
            preview: text?.substring(0, 100) || html?.substring(0, 100)
        });

        // در محیط production اینجا nodemailer استفاده کنید
        if (process.env.NODE_ENV === 'production' && process.env.SMTP_USER) {
            // nodemailer را در production import کنید
            const nodemailer = await import('nodemailer');

            const transporter = nodemailer.default.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT) || 587,
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });

            const info = await transporter.sendMail({
                from: process.env.SMTP_FROM || 'noreply@mrsapp.com',
                to,
                subject,
                html: html || text,
                text: text || html?.replace(/<[^>]*>/g, '') || ''
            });

            console.log('✅ Email sent:', info.messageId);
            return { success: true, messageId: info.messageId };
        }

        // در حالت توسعه، شبیه‌سازی موفقیت
        return {
            success: true,
            messageId: `dev-${Date.now()}`,
            message: 'Email logged (dev mode)'
        };
    } catch (error) {
        console.error('❌ Email error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * ارسال ایمیل نوتیفیکیشن
 */
export async function sendNotificationEmail(user, notification, templateData = {}) {
    const template = getTemplate(notification.type, templateData);
    if (!template) return { success: false, error: 'Template not found' };

    // ساخت HTML ایمیل
    const html = `
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${template.title}</title>
            <style>
                body { font-family: Tahoma, Arial, sans-serif; direction: rtl; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #D4B06A; padding: 20px; color: white; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; padding: 10px 20px; background: #D4B06A; color: white; text-decoration: none; border-radius: 5px; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                .info-box { background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 15px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏛️ سیستم رزرو تالار</h1>
                </div>
                <div class="content">
                    <h2>${template.title}</h2>
                    <p>سلام ${user.full_name || 'کاربر گرامی'}،</p>
                    <div style="white-space: pre-line;">${template.message}</div>
                    
                    ${notification.data?.link ? `
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="${notification.data.link}" class="button">مشاهده جزئیات</a>
                        </div>
                    ` : ''}
                    
                    <div class="info-box">
                        <p>📅 تاریخ: ${new Date().toLocaleDateString('fa-IR')}</p>
                        <p>🕐 زمان: ${new Date().toLocaleTimeString('fa-IR')}</p>
                    </div>
                </div>
                <div class="footer">
                    <p>این ایمیل به صورت خودکار ارسال شده است. لطفاً به آن پاسخ ندهید.</p>
                    <p>© 2024 سیستم رزرو تالار - تمامی حقوق محفوظ است.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    return await sendEmail({
        to: user.email,
        subject: template.title,
        html
    });
}