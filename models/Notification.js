// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    // کاربر دریافت‌کننده
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    // نوع نوتیفیکیشن
    type: {
        type: String,
        enum: [
            'reservation_created',
            'reservation_accepted',
            'reservation_rejected',
            'reservation_canceled',
            'reservation_paid',
            'payment_success',
            'payment_failed',
            'reminder',
            'system',
            'promotion'
        ],
        required: true
    },

    // عنوان نوتیفیکیشن
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },

    // متن نوتیفیکیشن
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },

    // داده‌های اضافی (مثلاً لینک‌ها، آی‌دی‌ها)
    data: {
        type: Object,
        default: {}
    },

    // آیا خوانده شده؟
    is_read: {
        type: Boolean,
        default: false
    },

    // زمان خوانده شدن
    read_at: {
        type: Date,
        default: null
    },

    // اولویت
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },

    // روش‌های ارسال
    channels: {
        email: { type: Boolean, default: false },
        sms: { type: Boolean, default: false },
        inApp: { type: Boolean, default: true }
    },

    // وضعیت ارسال
    sent_status: {
        email: {
            type: String,
            enum: ['pending', 'sent', 'failed'],
            default: 'pending'
        },
        sms: {
            type: String,
            enum: ['pending', 'sent', 'failed'],
            default: 'pending'
        }
    },

    // تاریخ ارسال
    sent_at: {
        type: Date,
        default: null
    },

    // انقضای نوتیفیکیشن
    expires_at: {
        type: Date,
        default: null
    },

    // منبع ایجاد (کدام بخش سیستم)
    source: {
        type: String,
        enum: ['system', 'admin', 'user', 'automated'],
        default: 'system'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ایندکس‌ها
notificationSchema.index({ user_id: 1, is_read: 1 });
notificationSchema.index({ user_id: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

// متد مجازی: زمان گذشته
notificationSchema.virtual('time_ago').get(function () {
    const diff = Date.now() - this.createdAt.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} روز پیش`;
    if (hours > 0) return `${hours} ساعت پیش`;
    if (minutes > 0) return `${minutes} دقیقه پیش`;
    return 'لحظاتی پیش';
});

// متد: علامت‌گذاری به عنوان خوانده شده
notificationSchema.methods.markAsRead = async function () {
    this.is_read = true;
    this.read_at = new Date();
    return await this.save();
};

// متد استاتیک: دریافت نوتیفیکیشن‌های خوانده نشده
notificationSchema.statics.getUnreadCount = async function (userId) {
    return await this.countDocuments({ user_id: userId, is_read: false });
};

const Notification = mongoose.models.Notification ||
    mongoose.model("Notification", notificationSchema);

module.exports = Notification;