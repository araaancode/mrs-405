// lib/notifications/index.js
import connectDB from '@/lib/db';
import Notification from '@/models/Notification';
import User from '@/models/User';
import { sendNotificationEmail } from './email';
import { sendNotificationSMS } from './sms';
import { getTemplate } from './templates';

/**
 * کلاس اصلی مدیریت نوتیفیکیشن‌ها
 */
class NotificationService {
    /**
     * ایجاد و ارسال نوتیفیکیشن جدید
     */
    static async createAndSend({
        userId,
        type,
        title,
        message,
        data = {},
        priority = 'medium',
        channels = { email: false, sms: false, inApp: true },
        source = 'system'
    }) {
        try {
            await connectDB();

            // دریافت اطلاعات کاربر
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // ایجاد نوتیفیکیشن در دیتابیس
            const notification = new Notification({
                user_id: userId,
                type,
                title,
                message,
                data,
                priority,
                channels,
                source
            });

            await notification.save();

            // ارسال از طریق کانال‌های مختلف
            const results = {
                email: null,
                sms: null,
                inApp: true
            };

            // ارسال ایمیل
            if (channels.email) {
                const templateData = { ...data, ...notification.toObject() };
                const emailResult = await sendNotificationEmail(user, notification, templateData);
                results.email = emailResult;
                notification.sent_status.email = emailResult.success ? 'sent' : 'failed';
            }

            // ارسال پیامک
            if (channels.sms) {
                const templateData = { ...data, ...notification.toObject() };
                const smsResult = await sendNotificationSMS(user, notification, templateData);
                results.sms = smsResult;
                notification.sent_status.sms = smsResult.success ? 'sent' : 'failed';
            }

            // به‌روزرسانی زمان ارسال
            notification.sent_at = new Date();
            await notification.save();

            return {
                success: true,
                notification,
                results
            };

        } catch (error) {
            console.error('Notification error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * ارسال نوتیفیکیشن بر اساس قالب
     */
    static async sendFromTemplate({
        userId,
        type,
        templateData = {},
        channels = { email: false, sms: false, inApp: true },
        priority = 'medium'
    }) {
        const template = getTemplate(type, templateData);
        if (!template) {
            throw new Error(`Template not found for type: ${type}`);
        }

        return await this.createAndSend({
            userId,
            type,
            title: template.title,
            message: template.message,
            data: templateData,
            priority,
            channels,
            source: 'automated'
        });
    }

    /**
     * علامت‌گذاری نوتیفیکیشن به عنوان خوانده شده
     */
    static async markAsRead(notificationId, userId) {
        try {
            await connectDB();

            const notification = await Notification.findOne({
                _id: notificationId,
                user_id: userId
            });

            if (!notification) {
                throw new Error('Notification not found');
            }

            await notification.markAsRead();
            return { success: true, notification };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * علامت‌گذاری همه نوتیفیکیشن‌های کاربر به عنوان خوانده شده
     */
    static async markAllAsRead(userId) {
        try {
            await connectDB();

            const result = await Notification.updateMany(
                { user_id: userId, is_read: false },
                { is_read: true, read_at: new Date() }
            );

            return { success: true, modifiedCount: result.modifiedCount };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * دریافت نوتیفیکیشن‌های کاربر
     */
    static async getUserNotifications(userId, options = {}) {
        const {
            limit = 20,
            offset = 0,
            unreadOnly = false,
            type = null
        } = options;

        try {
            await connectDB();

            const query = { user_id: userId };
            if (unreadOnly) query.is_read = false;
            if (type) query.type = type;

            const notifications = await Notification.find(query)
                .sort({ createdAt: -1 })
                .skip(offset)
                .limit(limit);

            const total = await Notification.countDocuments(query);
            const unreadCount = await Notification.getUnreadCount(userId);

            return {
                success: true,
                notifications,
                total,
                unreadCount,
                hasMore: total > offset + limit
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * حذف نوتیفیکیشن‌های قدیمی
     */
    static async cleanupOldNotifications(days = 30) {
        try {
            await connectDB();

            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - days);

            const result = await Notification.deleteMany({
                is_read: true,
                createdAt: { $lt: cutoff }
            });

            return { success: true, deletedCount: result.deletedCount };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default NotificationService;