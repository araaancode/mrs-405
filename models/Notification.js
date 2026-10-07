// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    type: {
        type: String,
        enum: [
            // ==================== کاربر (user) ====================
            'reservation_created',
            'reservation_accepted',
            'reservation_rejected',
            'reservation_canceled',
            'reservation_paid',
            'payment_success',
            'payment_failed',
            'ticket_created',
            'ticket_reply',
            'ticket_closed',

            // ==================== تالاردار (hall_owner) ====================
            'new_reservation',
            'reservation_canceled_by_user',
            'payment_received',
            'new_ticket_from_user',

            // ==================== ادمین (admin) ====================
            'new_reservation_for_admin',
            'new_hall_request',
            'new_owner_registration',
            'new_ticket',
            'user_report',

            // ==================== تأیید/رد ====================
            'hall_approved',           // ← جدید
            'hall_rejected',           // ← جدید
            'account_approved',        // ← جدید
            'account_deactivated',     // ← جدید

            // ==================== عمومی ====================
            'reminder',
            'system',
            'promotion'
        ],
        required: true
    },

    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },

    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },

    data: {
        type: Object,
        default: {}
    },

    is_read: {
        type: Boolean,
        default: false
    },

    read_at: {
        type: Date,
        default: null
    },

    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },

    channels: {
        email: { type: Boolean, default: false },
        sms: { type: Boolean, default: false },
        inApp: { type: Boolean, default: true }
    },

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

    sent_at: {
        type: Date,
        default: null
    },

    expires_at: {
        type: Date,
        default: null
    },

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

notificationSchema.index({ user_id: 1, is_read: 1 });
notificationSchema.index({ user_id: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

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

notificationSchema.methods.markAsRead = async function () {
    this.is_read = true;
    this.read_at = new Date();
    return await this.save();
};

notificationSchema.statics.getUnreadCount = async function (userId) {
    return await this.countDocuments({ user_id: userId, is_read: false });
};

const Notification = mongoose.models.Notification ||
    mongoose.model("Notification", notificationSchema);

module.exports = Notification;