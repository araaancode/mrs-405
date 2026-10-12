// models/Advertisement.js
import mongoose from "mongoose";

const advertisementSchema = new mongoose.Schema(
    {
        /* ============================================================
           مالک تبلیغ (تالاردار)
           ============================================================ */
        owner_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "شناسه مالک تبلیغ الزامی است"],
        },

        /* ============================================================
           تالار مرتبط (اختیاری - می‌تواند تبلیغ عمومی باشد)
           ============================================================ */
        hall_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hall",
            default: null,
        },

        /* ============================================================
           اطلاعات اصلی
           ============================================================ */
        title: {
            type: String,
            required: [true, "عنوان تبلیغ الزامی است"],
            trim: true,
            minlength: [5, "عنوان باید حداقل ۵ کاراکتر باشد"],
            maxlength: [100, "عنوان نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد"],
        },

        description: {
            type: String,
            required: [true, "توضیحات تبلیغ الزامی است"],
            trim: true,
            minlength: [20, "توضیحات باید حداقل ۲۰ کاراکتر باشد"],
            maxlength: [2000, "توضیحات نمی‌تواند بیشتر از ۲۰۰۰ کاراکتر باشد"],
        },

        /* ============================================================
           تصاویر
           ============================================================ */
        images: {
            type: [String],
            default: [],
            validate: [
                {
                    validator: (v) => v.length <= 5,
                    message: "حداکثر ۵ تصویر مجاز است",
                },
            ],
        },

        /* ============================================================
           نوع و مکان نمایش
           ============================================================ */
        ad_type: {
            type: String,
            enum: {
                values: [
                    "banner",       // بنر بالای صفحه
                    "sidebar",      // سایدبار
                    "popup",        // پاپ‌آپ
                    "featured",     // تالار ویژه (در لیست تالارها)
                    "home_slider",  // اسلایدر صفحه اصلی
                ],
                message: "نوع تبلیغ معتبر نیست",
            },
            required: [true, "نوع تبلیغ الزامی است"],
        },

        placement: {
            type: String,
            enum: {
                values: ["home", "halls", "hall_detail", "user_panel", "all"],
                message: "مکان نمایش معتبر نیست",
            },
            default: "all",
        },

        /* ============================================================
           لینک و CTA
           ============================================================ */
        target_url: {
            type: String,
            trim: true,
            validate: {
                validator: (v) =>
                    !v || /^https?:\/\/.+/.test(v) || /^\//.test(v),
                message: "لینک باید با http:// یا https:// یا / شروع شود",
            },
        },

        cta_text: {
            type: String,
            trim: true,
            maxlength: [30, "متن دکمه نمی‌تواند بیشتر از ۳۰ کاراکتر باشد"],
            default: "مشاهده",
        },

        /* ============================================================
           زمان‌بندی
           ============================================================ */
        start_date: {
            type: Date,
            required: [true, "تاریخ شروع الزامی است"],
            default: Date.now,
        },

        end_date: {
            type: Date,
            required: [true, "تاریخ پایان الزامی است"],
        },

        /* ============================================================
           بودجه و پرداخت
           ============================================================ */
        budget: {
            type: Number,
            required: [true, "بودجه الزامی است"],
            min: [0, "بودجه نمی‌تواند منفی باشد"],
        },

        daily_budget: {
            type: Number,
            default: 0,
            min: [0, "بودجه روزانه نمی‌تواند منفی باشد"],
        },

        payment_status: {
            type: String,
            enum: ["unpaid", "paid", "refunded"],
            default: "unpaid",
        },

        payment_info: {
            ref_id: { type: String, default: null },
            paid_at: { type: Date, default: null },
            amount: { type: Number, default: 0 },
        },

        /* ============================================================
           آمار نمایش
           ============================================================ */
        stats: {
            views: { type: Number, default: 0 },
            clicks: { type: Number, default: 0 },
            ctr: { type: Number, default: 0 }, // Click-Through Rate
        },

        /* ============================================================
           وضعیت
           ============================================================ */
        status: {
            type: String,
            enum: {
                values: [
                    "draft",        // پیش‌نویس
                    "pending",      // در انتظار تأیید
                    "approved",     // تأیید شده
                    "active",       // در حال نمایش
                    "paused",       // متوقف شده
                    "rejected",     // رد شده
                    "expired",      // منقضی شده
                ],
                message: "وضعیت تبلیغ معتبر نیست",
            },
            default: "draft",
        },

        is_active: {
            type: Boolean,
            default: false,
        },

        /* ============================================================
           ادمین
           ============================================================ */
        reviewed_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        reviewed_at: {
            type: Date,
            default: null,
        },

        rejection_reason: {
            type: String,
            trim: true,
            maxlength: [500, "دلیل رد نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد"],
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

/* ============================================================
   Indexes
   ============================================================ */
advertisementSchema.index({ owner_id: 1 });
advertisementSchema.index({ status: 1 });
advertisementSchema.index({ ad_type: 1 });
advertisementSchema.index({ placement: 1 });
advertisementSchema.index({ start_date: 1, end_date: 1 });
advertisementSchema.index({ is_active: 1, status: 1 });

/* ============================================================
   Virtuals
   ============================================================ */
advertisementSchema.virtual("is_expired").get(function () {
    return this.end_date && this.end_date < new Date();
});

advertisementSchema.virtual("is_running").get(function () {
    const now = new Date();
    return (
        this.is_active &&
        this.status === "active" &&
        this.start_date <= now &&
        this.end_date >= now
    );
});

advertisementSchema.virtual("duration_days").get(function () {
    if (!this.start_date || !this.end_date) return 0;
    const diff = this.end_date - this.start_date;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

/* ============================================================
   Pre-save Hook
   ============================================================ */
advertisementSchema.pre("save", function () {
    // محاسبه CTR
    if (this.stats && this.stats.views > 0) {
        this.stats.ctr = (this.stats.clicks / this.stats.views) * 100;
    }

    // اگر تاریخ پایان گذشته → expired
    if (this.end_date && this.end_date < new Date() && this.status === "active") {
        this.status = "expired";
        this.is_active = false;
    }
});

const Advertisement =
    mongoose.models.Advertisement ||
    mongoose.model("Advertisement", advertisementSchema);

export default Advertisement;