const mongoose = require("mongoose");

const hallReservationSchema = new mongoose.Schema({

    // کاربری که رزرو انجام می‌دهد
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "شناسه کاربر الزامی است"]
    },

    // تالاری که رزرو می‌شود
    hall_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hall",
        required: [true, "شناسه تالار الزامی است"]
    },

    // تاریخ شروع رزرو
    start_date: {
        type: Date,
        required: [true, "تاریخ شروع رزرو الزامی است"],
        validate: {
            validator: function (v) {
                return v > new Date();
            },
            message: "تاریخ شروع باید در آینده باشد"
        }
    },

    // تاریخ پایان رزرو
    end_date: {
        type: Date,
        required: [true, "تاریخ پایان رزرو الزامی است"],
        validate: {
            validator: function (v) {
                if (!this.start_date) return true;
                return v > this.start_date;
            },
            message: "تاریخ پایان باید بعد از تاریخ شروع باشد"
        }
    },

    // تعداد مهمان‌ها
    guests_count: {
        type: Number,
        required: [true, "تعداد مهمان‌ها الزامی است"],
        min: [1, "حداقل تعداد مهمان باید 1 نفر باشد"],
        max: [10000, "تعداد مهمان بیش از حد مجاز است"]
    },

    // قیمت پایه (از روی مدل تالار)
    base_price: {
        type: Number,
        required: true,
        min: [0, "قیمت پایه نمی‌تواند منفی باشد"]
    },

    // تخفیف روی رزرو (درصد یا مقدار دلخواه)
    discount: {
        type: Number,
        default: 0,
        min: [0, "تخفیف نمی‌تواند منفی باشد"]
    },

    // مبلغ نهایی پس از تخفیف
    final_price: {
        type: Number,
        required: true,
        min: [0, "مبلغ نهایی نمی‌تواند منفی باشد"]
    },

    // مبلغ پیش پرداخت
    pre_payment: {
        type: Number,
        required: true,
        min: [0, "پیش پرداخت نمی‌تواند منفی باشد"]
    },

    // وضعیت رزرو
    status: {
        type: String,
        enum: {
            values: [
                "pending",      // در انتظار بررسی
                "accepted",     // تایید شده توسط تالار
                "rejected",     // رد شده
                "canceled_by_user",
                "canceled_by_owner",
                "completed"     // مراسم انجام شده
            ],
            message: "وضعیت رزرو معتبر نیست"
        },
        default: "pending"
    },

    // توضیحاتی از طرف کاربر
    user_note: {
        type: String,
        trim: true,
        maxlength: [500, "توضیحات کاربر نمی‌تواند بیشتر از 500 کاراکتر باشد"]
    },

    // توضیحات مدیر تالار
    owner_note: {
        type: String,
        trim: true,
        maxlength: [500, "توضیحات مدیر تالار نمی‌تواند بیشتر از 500 کاراکتر باشد"]
    },

    // زمان تایید یا رد شدن توسط مالک تالار
    reviewed_at: {
        type: Date,
        default: null
    },

    // اطلاعات پرداخت
    payment_info: {
        ref_id: { type: String, trim: true },
        tracking_code: { type: String, trim: true, sparse: true },
        paid_at: { type: Date, default: null }
    },

    // آیا مدیر تالار رزرو را نهایی کرده؟
    is_confirmed_by_owner: {
        type: Boolean,
        default: false
    },

    // لاگ لغو رزرو
    cancel_reason: {
        type: String,
        trim: true,
        maxlength: [300, "دلیل لغو نمی‌تواند بیشتر از 300 کاراکتر باشد"]
    }

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


// ایندکس ها برای بهبود سرعت جستجو
hallReservationSchema.index({ user_id: 1 });
hallReservationSchema.index({ hall_id: 1 });
hallReservationSchema.index({ start_date: 1 });
hallReservationSchema.index({ status: 1 });


// متد مجازی: تعداد روزهای رزرو
hallReservationSchema.virtual("duration_days").get(function () {
    if (!this.start_date || !this.end_date) return 0;
    const diff = this.end_date - this.start_date;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
});


// ولیدیشن سفارشی: چک ظرفیت تالار
// hallReservationSchema.pre("save", async function () {
//     try {
//         const Hall = mongoose.model("Hall");
//         const hall = await Hall.findById(this.hall_id).select("capacity");

//         if (!hall) return next(new Error("تالار یافت نشد"));

//         if (this.guests_count > hall.capacity) {
//             return next(new Error("تعداد مهمان‌ها بیشتر از ظرفیت تالار است"));
//         }

//         next();
//     } catch (err) {
//         next(err);
//     }
// });


const HallReservation =
    mongoose.models.HallReservation ||
    mongoose.model("HallReservation", hallReservationSchema);

module.exports = HallReservation;
