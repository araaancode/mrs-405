const mongoose = require("mongoose");

const ticketMessageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        required: [true, "متن پیام الزامی است"],
        minlength: [1, "پیام نمی‌تواند خالی باشد"],
        maxlength: [2000, "پیام نمی‌تواند بیشتر از 2000 کاراکتر باشد"]
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    is_admin_reply: {
        type: Boolean,
        default: false
    }
}, { _id: false });

const ticketSchema = new mongoose.Schema({
    // موضوع تیکت
    subject: {
        type: String,
        required: [true, "موضوع تیکت الزامی است"],
        minlength: [5, "موضوع تیکت باید حداقل 5 کاراکتر باشد"],
        maxlength: [100, "موضوع تیکت نمی‌تواند بیشتر از 100 کاراکتر باشد"]
    },

    // توضیحات اولیه
    description: {
        type: String,
        required: [true, "توضیحات تیکت الزامی است"],
        minlength: [10, "توضیحات باید حداقل 10 کاراکتر باشد"]
    },

    // وضعیت تیکت
    status: {
        type: String,
        enum: ['open', 'in_progress', 'answered', 'closed'],
        default: 'open'
    },

    // اولویت تیکت
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },

    // کاربری که تیکت را ثبت کرده
    reporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "ایجادکننده تیکت مشخص نشده است"]
    },

    // کاربر پشتیبانی یا ادمینی که تیکت را پیگیری می‌کند
    assigneeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    // پیام‌های تیکت
    messages: [ticketMessageSchema],

    // آیا تیکت توسط کاربر بسته شده؟
    closed_by_user: {
        type: Boolean,
        default: false
    },

    // آیا تیکت توسط ادمین بسته شده؟
    closed_by_admin: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// اندکس‌ها برای سرعت بیشتر
ticketSchema.index({ reporterId: 1 });
ticketSchema.index({ assigneeId: 1 });
ticketSchema.index({ status: 1 });
ticketSchema.index({ priority: 1 });

// ورچوال: تعداد پیام‌ها
ticketSchema.virtual("message_count").get(function () {
    return this.messages.length;
});

// ورچوال: آیا تیکت پاسخ جدید دارد؟
ticketSchema.virtual("has_new_reply").get(function () {
    if (this.messages.length === 0) return false;
    const last = this.messages[this.messages.length - 1];
    return last.is_admin_reply;
});

const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
