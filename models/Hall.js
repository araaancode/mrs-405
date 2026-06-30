const mongoose = require("mongoose");

const hallSchema = new mongoose.Schema({
    hall_owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // hall name or title  -> نام تالار
    title: {
        type: String,
        trim: true,
        minlength: [6, "نام تالار باید حداقل 6 کاراکتر باشد"],
        maxlength: [100, "نام تالار نمی‌تواند بیشتر از 100 کاراکتر باشد"],
        required: [true, "نام تالار الزامی است"]
    },

    // province -> استان
    province: {
        type: String,
        trim: true,
        required: [true, "استان الزامی است"]
    },

    // city -> شهر
    city: {
        type: String,
        trim: true,
        required: [true, "شهر الزامی است"]
    },

    // hall address -> آدرس
    address: {
        type: String,
        trim: true,
        required: [true, "آدرس الزامی است"],
        minlength: [10, "آدرس باید حداقل 10 کاراکتر باشد"]
    },

    // -> مختصات جغرافیایی
    lat: {
        type: Number,
        required: [true, "عرض جغرافیایی الزامی است"],
        min: [-90, "عرض جغرافیایی باید بین -90 تا 90 باشد"],
        max: [90, "عرض جغرافیایی باید بین -90 تا 90 باشد"]
    },
    lng: {
        type: Number,
        required: [true, "طول جغرافیایی الزامی است"],
        min: [-180, "طول جغرافیایی باید بین -180 تا 180 باشد"],
        max: [180, "طول جغرافیایی باید بین -180 تا 180 باشد"]
    },

    // hall postal code -> کد پستی
    postal_code: {
        type: Number,
        required: [true, "کد پستی الزامی است"],
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v.toString());
            },
            message: "کد پستی باید 10 رقم باشد"
        }
    },

    // hall phone  -> تلفن تالار
    hall_phone: {
        type: String,
        trim: true,
        required: [true, "تلفن تالار الزامی است"],
        // validate: {
        //     validator: function (v) {
        //         return /^0\d{10}$/.test(v);
        //     },
        //     message: "شماره تلفن باید با 0 شروع شده و 11 رقم باشد"
        // }
    },

    // hall owner name -> نام مدیر تالار
    hall_owner_name: {
        type: String,
        trim: true,
        required: [true, "نام مدیر تالار الزامی است"],
        minlength: [3, "نام مدیر باید حداقل 3 کاراکتر باشد"]
    },

    // hall owner phone -> شماره موبایل مدیر تالار
    hall_owner_phone: {
        type: String,
        trim: true,
        required: [true, "شماره موبایل مدیر الزامی است"],
        validate: {
            validator: function (v) {
                return /^09\d{9}$/.test(v);
            },
            message: "شماره موبایل باید با 09 شروع شده و 11 رقم باشد"
        }
    },

    // hall measure -> متراژ تالار
    hall_measure: {
        type: Number,
        required: [true, "متراژ تالار الزامی است"],
        min: [10, "متراژ تالار باید حداقل 10 متر مربع باشد"],
        max: [10000, "متراژ تالار نمی‌تواند بیشتر از 10000 متر مربع باشد"]
    },

    // hall description -> درباره تالار
    description: {
        type: String,
        trim: true,
        minlength: [20, "توضیحات باید حداقل 20 کاراکتر باشد"],
        maxlength: [2000, "توضیحات نمی‌تواند بیشتر از 2000 کاراکتر باشد"]
    },

    // year -> سال ساخت تالار
    year: {
        type: Number,
        min: [1300, "سال ساخت باید بعد از 1300 باشد"],
        max: [new Date().getFullYear(), "سال ساخت نمی‌تواند از سال جاری بیشتر باشد"]
    },

    // hall roles  -> قوانین ثبت تالار
    hall_roles: [{
        type: String,
        trim: true,
        minlength: [5, "هر قانون باید حداقل 5 کاراکتر باشد"]
    }],

    // capacity -> ظرفیت تالار
    capacity: {
        type: Number,
        required: [true, "ظرفیت تالار الزامی است"],
        min: [1, "ظرفیت باید حداقل 1 نفر باشد"],
        max: [10000, "ظرفیت نمی‌تواند بیشتر از 10000 نفر باشد"]
    },

    // duration event -> مدت مراسم
    duration: {
        type: Number,
        min: [1, "مدت مراسم باید حداقل 1 ساعت باشد"],
        max: [24, "مدت مراسم نمی‌تواند بیشتر از 24 ساعت باشد"]
    },

    // free dates -> تاریخ برگزاری (تاریخ های آزاد)
    free_dates: [{
        type: Date,
        // validate: {
        //     validator: function (v) {
        //         return v > new Date();
        //     },
        //     message: "تاریخ‌های آزاد باید در آینده باشند"
        // }
    }],

    // hall images -> عکس های تالار
    images: [{
        type: String,
        validate: {
            validator: function (v) {
                return /\.(jpg|jpeg|png|webp)$/i.test(v);
            },
            message: "فرمت عکس باید jpg, jpeg, png یا webp باشد"
        }
    }],

    // entrance rolls -> محدویت های ساعت ورود و خروج
    entrance_rolls: [{
        type: String,
        trim: true,
        maxlength: [500, "محدودیت‌های ورود و خروج نمی‌تواند بیشتر از 500 کاراکتر باشد"]
    }],

    // hall type -> نوع تالار (سربسته-روباز- باغ و ...)
    hall_type: {
        type: String,
        trim: true,
        // enum: {
        //     values: ["سربسته", "روباز", "باغ", "تراس", "سالن سرپوشیده", "دیگر"],
        //     message: "نوع تالار باید یکی از مقادیر معتبر باشد"
        // }
    },

    // host type -> نوع پذیرایی (فول-نوشیدنی- همراه با شام و ...)
    host_type: {
        type: String,
        trim: true,
        // enum: {
        //     values: ["فول", "نوشیدنی", "شام", "ناهار", "صبحانه", "بدون پذیرایی", "دیگر"],
        //     message: "نوع پذیرایی باید یکی از مقادیر معتبر باشد"
        // }
    },

    // event type -> نوع مراسم (تولد، تجلیل، عزاداری و ...)
    event_type: {
        type: String,
        trim: true,
        // enum: {
        //     values: ["تولد", "عروسی", "عزاداری", "تجلیل", "همایش", "جشن", "دیگر"],
        //     message: "نوع مراسم باید یکی از مقادیر معتبر باشد"
        // }
    },

    // hall properties -> (آسانسور،نمازخانه،سرویس بهداشتی،سیستم گرمایشی و سرمایشی، کولر و خواننده و مداح و اتاق گل آرایی، نوع صندلی و ...
    properties: [{
        type: String,
        trim: true,
        maxlength: [1000, "ویژگی‌ها نمی‌تواند بیشتر از 1000 کاراکتر باشد"]
    }],

    // parking count -> تعداد پارکینگ ها
    parking_count: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                return /^\d+$/.test(v) || v === "نامحدود";
            },
            message: "تعداد پارکینگ باید عدد یا 'نامحدود' باشد"
        }
    },

    // roof count -> تعداد طبقه ها
    roof_count: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                return /^\d+$/.test(v);
            },
            message: "تعداد طبقه باید عدد باشد"
        }
    },

    // add sans ability -> قابیت اضافه کردن سانس
    has_sans: {
        type: Boolean,
        default: false
    },

    // hall document -> مدارک تالار(قبض آب و برق و ...، سند تالار، مدارک تالار)
    hall_document: [{
        type: String,
        validate: {
            validator: function (v) {
                return /\.(pdf|jpg|jpeg|png)$/i.test(v);
            },
            message: "فرمت مدارک باید pdf, jpg, jpeg یا png باشد"
        }
    }],

    // sans price  -> قیمت سانس
    sans_price: {
        type: Number,
        default: 0
    },

    // sans discount  -> تخفیف سانس
    sans_discount: {
        type: Number,

    },

    // licensee number -> شماره پروانه یا مجوز تالار
    licensee_number: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                return /^[A-Za-z0-9\-]+$/.test(v);
            },
            message: "شماره پروانه باید شامل حروف، اعداد و خط تیره باشد"
        }
    },

    // cancel rolls -> قوانین لغو رزرو تالار
    cancel_rolls: [{
        type: String,
        trim: true,
        minlength: [5, "هر قانون لغو باید حداقل 5 کاراکتر باشد"]
    }],

    // camera_capacities -> توانایی های عکس و فیلم برداری
    camera_capacities: [{
        type: String,
        trim: true,
        minlength: [3, "هر توانایی باید حداقل 3 کاراکتر باشد"]
    }],

    // reservation rolls -> قوانین رزرو
    reservation_rolls: [{
        type: String,
        trim: true,
        minlength: [5, "هر قانون رزرو باید حداقل 5 کاراکتر باشد"]
    }],

    is_active: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true, // اضافه کردن createdAt و updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

hallSchema.index({ title: 1 });
hallSchema.index({ province: 1, city: 1 });
hallSchema.index({ lat: 1, lng: 1 });
hallSchema.index({ hall_owner_phone: 1 });
hallSchema.index({ hall_phone: 1 });

// ولیدیشن سفارشی برای بررسی تاریخ‌های آزاد
// hallSchema.pre('save', function (next) {
//     if (this.free_dates && this.free_dates.length > 0) {
//         const uniqueDates = [...new Set(this.free_dates.map(d => d.toISOString()))];
//         this.free_dates = uniqueDates.map(d => new Date(d)).sort((a, b) => a - b);
//     }
//     next();
// });

// ولیدیشن برای اطمینان از وجود حداقل یک تصویر
hallSchema.path('images').validate(function (value) {
    if (!value || value.length === 0) {
        return false;
    }
    return true;
}, 'حداقل یک عکس برای تالار الزامی است');

const Hall = mongoose.models.Hall || mongoose.model('Hall', hallSchema);

module.exports = Hall;


// 34 => fields