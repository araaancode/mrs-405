// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        // نام و نام خانوادگی
        full_name: {
            type: String,
            trim: true,
            required: [true, "نام و نام خانوادگی الزامی است"],
            minlength: [3, "نام و نام خانوادگی باید حداقل 3 کاراکتر باشد"],
            maxlength: [100, "نام و نام خانوادگی نمی‌تواند بیشتر از 100 کاراکتر باشد"],
        },

        // نام کاربری
        username: {
            type: String,
            trim: true,
            unique: true,
            required: [true, "نام کاربری الزامی است"],
            minlength: [3, "نام کاربری باید حداقل 3 کاراکتر باشد"],
            maxlength: [30, "نام کاربری نمی‌تواند بیشتر از 30 کاراکتر باشد"],
            match: [
                /^[a-zA-Z0-9_]+$/,
                "نام کاربری فقط می‌تواند شامل حروف انگلیسی، اعداد و زیرخط باشد",
            ],
        },

        // ایمیل
        email: {
            type: String,
            trim: true,
            unique: true,
            required: [true, "ایمیل الزامی است"],
            lowercase: true,
            validate: {
                validator: function (v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: "ایمیل معتبر نیست",
            },
        },

        // شماره همراه
        phone: {
            type: String,
            trim: true,
            unique: true,
            required: [true, "شماره همراه الزامی است"],
            validate: {
                validator: function (v) {
                    return /^09[0-9]{9}$/.test(v);
                },
                message: "شماره همراه معتبر نیست (فرمت: 09xxxxxxxxx)",
            },
        },

        // پسورد
        password: {
            type: String,
            required: [true, "رمز عبور الزامی است"],
            minlength: [8, "رمز عبور باید حداقل 8 کاراکتر باشد"],
            select: false,
        },

        // نقش کاربر
        role: {
            type: String,
            enum: {
                values: ["admin", "user", "hall_owner"],
                message: "نقش کاربر معتبر نیست",
            },
            default: "user",
            required: [true, "نقش کاربر الزامی است"],
        },

        // مدارک کاربر
        documents: [
            {
                type: String,
                trim: true,
                validate: {
                    validator: function (v) {
                        if (!v) return true;
                        return (
                            /^(https?:\/\/.*\.(pdf|jpg|jpeg|png|doc|docx))$/i.test(v) ||
                            /^\/uploads\/.*\.(pdf|jpg|jpeg|png|doc|docx)$/i.test(v)
                        );
                    },
                    message: "آدرس فایل مدرک معتبر نیست",
                },
            },
        ],

        // شناسنامه
        birth_certificate: {
            type: String,
            trim: true,
        },

        // کد ملی
        national_code: {
            type: String,
            trim: true,
            validate: {
                validator: function (v) {
                    // اگر خالی است، از validation عبور کن
                    if (!v || v.trim() === "") return true;

                    // باید ۱۰ رقم باشد
                    if (!/^\d{10}$/.test(v)) return false;

                    // همه ارقام نباید یکسان باشند
                    if (/^(\d)\1{9}$/.test(v)) return false;

                    // الگوریتم چک رقم کنترل
                    let sum = 0;
                    for (let i = 0; i < 9; i++) {
                        sum += parseInt(v[i], 10) * (10 - i);
                    }
                    const remainder = sum % 11;
                    const checkDigit = parseInt(v[9], 10);

                    if (remainder < 2) return checkDigit === remainder;
                    return checkDigit === 11 - remainder;
                },
                message: "کد ملی معتبر نیست",
            },
        },

        // استان محل سکونت
        province: {
            type: String,
            trim: true,
            minlength: [2, "نام استان باید حداقل 2 کاراکتر باشد"],
            maxlength: [50, "نام استان نمی‌تواند بیشتر از 50 کاراکتر باشد"],
        },

        // شهر محل سکونت
        city: {
            type: String,
            trim: true,
            minlength: [2, "نام شهر باید حداقل 2 کاراکتر باشد"],
            maxlength: [50, "نام شهر نمی‌تواند بیشتر از 50 کاراکتر باشد"],
        },

        // جنسیت
        gender: {
            type: String,
            enum: {
                values: ["male", "female", "other"],
                message: "جنسیت معتبر نیست",
            },
        },

        otp_code: {
            type: String,
            select: false,
        },

        otp_expires: {
            type: Date,
            select: false,
        },

        // تاریخ تولد
        birth_date: {
            type: Date,
            validate: {
                validator: function (v) {
                    if (!v) return true;
                    return v < new Date();
                },
                message: "تاریخ تولد باید در گذشته باشد",
            },
        },

        // وضعیت فعال بودن حساب
        is_active: {
            type: Boolean,
            default: true,
        },

        // تاریخ تایید حساب
        verified_at: {
            type: Date,
            default: null,
        },

        // تاریخ آخرین ورود
        last_login: {
            type: Date,
            default: null,
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
userSchema.index({ role: 1 });
userSchema.index({ province: 1, city: 1 });
userSchema.index({ birth_date: 1 });

/* ============================================================
   Pre-save hook — هش کردن رمز عبور
   ============================================================ */
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

/* ============================================================
   Methods
   ============================================================ */
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

/* ============================================================
   Virtuals
   ============================================================ */
userSchema.virtual("age").get(function () {
    if (!this.birth_date) return null;

    const today = new Date();
    const birthDate = new Date(this.birth_date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
});

userSchema.virtual("full_address").get(function () {
    const parts = [this.province, this.city].filter(Boolean);
    return parts.join("، ");
});

userSchema.virtual("is_verified").get(function () {
    return this.verified_at !== null;
});

userSchema.virtual("role_fa").get(function () {
    const roleMap = {
        admin: "مدیر سایت",
        user: "کاربر عادی",
        hall_owner: "تالاردار",
    };
    return roleMap[this.role] || this.role;
});

userSchema.virtual("gender_fa").get(function () {
    const genderMap = {
        male: "مرد",
        female: "زن",
        other: "سایر",
    };
    return genderMap[this.gender] || this.gender;
});

/* ============================================================
   Custom validation — حداقل سن ۱۸ سال
   ============================================================ */
userSchema.path("birth_date").validate(function (value) {
    if (!value) return true;

    const today = new Date();
    const birthDate = new Date(value);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age >= 18;
}, "کاربر باید حداقل 18 سال سن داشته باشد");

/* ============================================================
   Model
   ============================================================ */
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;