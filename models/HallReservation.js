// models/HallReservation.js
import mongoose from "mongoose";

const hallReservationSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "شناسه کاربر الزامی است"],
        },

        hall_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hall",
            required: [true, "شناسه تالار الزامی است"],
        },

        start_date: {
            type: Date,
            required: [true, "تاریخ شروع رزرو الزامی است"],
        },

        end_date: {
            type: Date,
            required: [true, "تاریخ پایان رزرو الزامی است"],
        },

        guests_count: {
            type: Number,
            required: [true, "تعداد مهمان‌ها الزامی است"],
            min: [1, "حداقل تعداد مهمان باید 1 نفر باشد"],
            max: [10000, "تعداد مهمان بیش از حد مجاز است"],
        },

        base_price: {
            type: Number,
            required: true,
            min: [0, "قیمت پایه نمی‌تواند منفی باشد"],
        },

        discount: {
            type: Number,
            default: 0,
            min: [0, "تخفیف نمی‌تواند منفی باشد"],
        },

        final_price: {
            type: Number,
            required: true,
            min: [0, "مبلغ نهایی نمی‌تواند منفی باشد"],
        },

        pre_payment: {
            type: Number,
            required: true,
            min: [0, "پیش پرداخت نمی‌تواند منفی باشد"],
        },

        status: {
            type: String,
            enum: {
                values: [
                    "pending",
                    "accepted",
                    "rejected",
                    "canceled_by_user",
                    "canceled_by_owner",
                    "completed",
                    "paid",
                ],
                message: "وضعیت رزرو معتبر نیست",
            },
            default: "pending",
        },

        user_note: {
            type: String,
            trim: true,
            maxlength: [500, "توضیحات کاربر نمی‌تواند بیشتر از 500 کاراکتر باشد"],
        },

        owner_note: {
            type: String,
            trim: true,
            maxlength: [500, "توضیحات مدیر تالار نمی‌تواند بیشتر از 500 کاراکتر باشد"],
        },

        reviewed_at: {
            type: Date,
            default: null,
        },

        payment_info: {
            ref_id: { type: String, trim: true },
            tracking_code: { type: String, trim: true, sparse: true },
            paid_at: { type: Date, default: null },
            payment_method: {
                type: String,
                enum: ["zarinpal", "melli", "cash", "other"],
                default: "zarinpal",
            },
            payment_gateway: {
                type: String,
                default: "zarinpal",
            },
            payment_data: {
                type: Object,
                default: {},
            },
        },

        is_confirmed_by_owner: {
            type: Boolean,
            default: false,
        },

        cancel_reason: {
            type: String,
            trim: true,
            maxlength: [300, "دلیل لغو نمی‌تواند بیشتر از 300 کاراکتر باشد"],
        },

        price_calculation: {
            base_price: { type: Number, default: 0 },
            discount_amount: { type: Number, default: 0 },
            final_price: { type: Number, default: 0 },
            pre_payment_percent: { type: Number, default: 30 },
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

hallReservationSchema.index({ user_id: 1 });
hallReservationSchema.index({ hall_id: 1 });
hallReservationSchema.index({ start_date: 1 });
hallReservationSchema.index({ status: 1 });

hallReservationSchema.virtual("duration_days").get(function () {
    if (!this.start_date || !this.end_date) return 0;
    const diff = this.end_date - this.start_date;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

const HallReservation =
    mongoose.models.HallReservation ||
    mongoose.model("HallReservation", hallReservationSchema);

export default HallReservation;   // ← ESM