// lib/notifications/templates.js

/**
 * قالب‌های پیام‌ها برای انواع مختلف نوتیفیکیشن
 */
export const NotificationTemplates = {
    // رزرو ایجاد شد
    reservation_created: {
        title: (data) => ` رزرو تالار ${data.hall_title || ''} ثبت شد`,
        message: (data) => `
            رزرو شما برای تالار ${data.hall_title || ''} با موفقیت ثبت شد.
            تاریخ: ${data.start_date || ''}
            تعداد مهمان: ${data.guests_count || 0} نفر
            کد رزرو: ${data.reservation_id || ''}
            
            منتظر تایید مالک تالار باشید.
        `,
        sms: (data) => `
            رزرو تالار ${data.hall_title || ''} ثبت شد. 
            کد: ${data.reservation_id || ''}
        `
    },

    // رزرو تایید شد
    reservation_accepted: {
        title: (data) => ` رزرو تالار ${data.hall_title || ''} تایید شد`,
        message: (data) => `
            رزرو شما برای تالار ${data.hall_title || ''} توسط مالک تایید شد.
            برای تکمیل فرآیند، لطفاً پیش‌پرداخت را انجام دهید.
            
            🔗 برای پرداخت کلیک کنید: ${data.payment_link || ''}
        `,
        sms: (data) => `
            رزرو تالار ${data.hall_title || ''} تایید شد. 
            برای پرداخت به سایت مراجعه کنید.
        `
    },

    // رزرو رد شد
    reservation_rejected: {
        title: (data) => ` رزرو تالار ${data.hall_title || ''} رد شد`,
        message: (data) => `
            متاسفانه رزرو شما برای تالار ${data.hall_title || ''} توسط مالک رد شد.
            دلیل: ${data.reason || 'نامشخص'}
            
            برای مشاهده تالارهای دیگر کلیک کنید.
        `,
        sms: (data) => `
            رزرو تالار ${data.hall_title || ''} رد شد. 
            دلیل: ${data.reason || 'نامشخص'}
        `
    },

    // رزرو لغو شد
    reservation_canceled: {
        title: (data) => `⚠️ رزرو تالار ${data.hall_title || ''} لغو شد`,
        message: (data) => `
            رزرو شما برای تالار ${data.hall_title || ''} لغو شد.
            دلیل: ${data.reason || 'نامشخص'}
            
            در صورت نیاز، می‌توانید مجدداً رزرو کنید.
        `,
        sms: (data) => `
            رزرو تالار ${data.hall_title || ''} لغو شد.
        `
    },

    // پرداخت موفق
    payment_success: {
        title: (data) => `💰 پرداخت با موفقیت انجام شد`,
        message: (data) => `
            پرداخت شما برای رزرو تالار ${data.hall_title || ''} با موفقیت انجام شد.
            مبلغ: ${data.amount || 0} تومان
            کد پیگیری: ${data.ref_id || ''}
            
            رزرو شما نهایی شد.
        `,
        sms: (data) => `
            پرداخت ${data.amount || 0} تومان برای رزرو تالار ${data.hall_title || ''} تایید شد.
            کد پیگیری: ${data.ref_id || ''}
        `
    },

    // پرداخت ناموفق
    payment_failed: {
        title: (data) => ` پرداخت ناموفق بود`,
        message: (data) => `
            پرداخت شما برای رزرو تالار ${data.hall_title || ''} ناموفق بود.
            دلیل: ${data.reason || 'نامشخص'}
            
            لطفاً مجدداً تلاش کنید.
        `,
        sms: (data) => `
            پرداخت برای رزرو تالار ${data.hall_title || ''} ناموفق بود.
        `
    },

    // یادآوری
    reminder: {
        title: (data) => `⏰ یادآوری: رزرو تالار ${data.hall_title || ''}`,
        message: (data) => `
            رزرو شما برای تالار ${data.hall_title || ''} در تاریخ ${data.start_date || ''} برگزار می‌شود.
            
            لطفاً هماهنگی‌های لازم را انجام دهید.
        `,
        sms: (data) => `
            یادآوری: رزرو تالار ${data.hall_title || ''} در تاریخ ${data.start_date || ''}.
        `
    },

    // نوتیفیکیشن سیستمی
    system: {
        title: (data) => data.title || '📢 اطلاعیه سیستمی',
        message: (data) => data.message || '',
        sms: (data) => data.message || ''
    },

    // پیشنهادات ویژه
    promotion: {
        title: (data) => `🎉 ${data.title || 'پیشنهاد ویژه'}`,
        message: (data) => data.message || '',
        sms: (data) => data.message || ''
    }
};

/**
 * دریافت قالب بر اساس نوع
 */
export function getTemplate(type, data = {}) {
    const template = NotificationTemplates[type];
    if (!template) return null;

    return {
        title: typeof template.title === 'function' ? template.title(data) : template.title,
        message: typeof template.message === 'function' ? template.message(data) : template.message,
        sms: typeof template.sms === 'function' ? template.sms(data) : template.message
    };
}