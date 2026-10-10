const mongoose = require("mongoose");

const hallSchema = new mongoose.Schema(
  {
    /* ============================================================
       اطلاعات اصلی
       ============================================================ */
    hall_owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "شناسه مالک الزامی است"],
    },

    title: {
      type: String,
      trim: true,
      required: [true, "نام تالار الزامی است"],
      minlength: [6, "نام تالار باید حداقل ۶ کاراکتر باشد"],
      maxlength: [100, "نام تالار نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد"],
    },

    province: {
      type: String,
      trim: true,
      required: [true, "استان الزامی است"],
      maxlength: [50, "نام استان نمی‌تواند بیشتر از ۵۰ کاراکتر باشد"],
    },

    city: {
      type: String,
      trim: true,
      required: [true, "شهر الزامی است"],
      maxlength: [50, "نام شهر نمی‌تواند بیشتر از ۵۰ کاراکتر باشد"],
    },

    address: {
      type: String,
      trim: true,
      required: [true, "آدرس الزامی است"],
      minlength: [10, "آدرس باید حداقل ۱۰ کاراکتر باشد"],
      maxlength: [500, "آدرس نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد"],
    },

    lat: {
      type: Number,
      required: [true, "عرض جغرافیایی الزامی است"],
      min: [-90, "عرض جغرافیایی باید بین -۹۰ تا ۹۰ باشد"],
      max: [90, "عرض جغرافیایی باید بین -۹۰ تا ۹۰ باشد"],
    },

    lng: {
      type: Number,
      required: [true, "طول جغرافیایی الزامی است"],
      min: [-180, "طول جغرافیایی باید بین -۱۸۰ تا ۱۸۰ باشد"],
      max: [180, "طول جغرافیایی باید بین -۱۸۰ تا ۱۸۰ باشد"],
    },

    postal_code: {
      type: String,
      trim: true,
      required: [true, "کد پستی الزامی است"],
      validate: {
        validator: (v) => /^\d{10}$/.test(v),
        message: "کد پستی باید دقیقاً ۱۰ رقم باشد",
      },
    },

    hall_phone: {
      type: String,
      trim: true,
      required: [true, "تلفن تالار الزامی است"],
      minlength: [7, "تلفن تالار باید حداقل ۷ کاراکتر باشد"],
      maxlength: [15, "تلفن تالار نمی‌تواند بیشتر از ۱۵ کاراکتر باشد"],
    },

    /* ============================================================
       مالک
       ============================================================ */
    hall_owner_name: {
      type: String,
      trim: true,
      required: [true, "نام مالک الزامی است"],
      minlength: [3, "نام مالک باید حداقل ۳ کاراکتر باشد"],
      maxlength: [100, "نام مالک نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد"],
    },

    hall_owner_phone: {
      type: String,
      trim: true,
      required: [true, "شماره موبایل مالک الزامی است"],
      validate: {
        validator: (v) => /^09\d{9}$/.test(v),
        message: "شماره موبایل باید با ۰۹ شروع و ۱۱ رقم باشد",
      },
    },

    /* ============================================================
       فنی
       ============================================================ */
    hall_measure: {
      type: Number,
      required: [true, "متراژ تالار الزامی است"],
      min: [10, "متراژ باید حداقل ۱۰ متر مربع باشد"],
      max: [10000, "متراژ نمی‌تواند بیشتر از ۱۰۰۰۰ متر مربع باشد"],
    },

    capacity: {
      type: Number,
      required: [true, "ظرفیت تالار الزامی است"],
      min: [1, "ظرفیت باید حداقل ۱ نفر باشد"],
      max: [10000, "ظرفیت نمی‌تواند بیشتر از ۱۰۰۰۰ نفر باشد"],
    },

    duration: {
      type: Number,
      required: [true, "مدت مراسم الزامی است"],
      min: [1, "مدت مراسم باید حداقل ۱ ساعت باشد"],
      max: [24, "مدت مراسم نمی‌تواند بیشتر از ۲۴ ساعت باشد"],
    },

    year: {
      type: Number,
      required: [true, "سال ساخت الزامی است"],
      min: [1300, "سال ساخت باید بعد از ۱۳۰۰ باشد"],
      max: [
        new Date().getFullYear(),
        "سال ساخت نمی‌تواند از سال جاری بیشتر باشد",
      ],
    },

    parking_count: {
      type: String,
      trim: true,
      required: [true, "تعداد پارکینگ الزامی است"],
      validate: {
        validator: (v) => /^\d+$/.test(v) || v === "نامحدود",
        message: "تعداد پارکینگ باید عدد یا «نامحدود» باشد",
      },
    },

    roof_count: {
      type: String,
      trim: true,
      required: [true, "تعداد طبقات الزامی است"],
      validate: {
        validator: (v) => /^\d+$/.test(v),
        message: "تعداد طبقات باید عدد باشد",
      },
    },

    hall_type: {
      type: String,
      trim: true,
      required: [true, "نوع تالار الزامی است"],
      enum: {
        values: ["سربسته", "روباز", "باغ", "تراس", "سالن سرپوشیده", "دیگر"],
        message: "نوع تالار معتبر نیست",
      },
    },

    host_type: {
      type: String,
      trim: true,
      required: [true, "نوع میزبانی الزامی است"],
      enum: {
        values: [
          "فول",
          "نوشیدنی",
          "شام",
          "ناهار",
          "صبحانه",
          "بدون پذیرایی",
          "دیگر",
        ],
        message: "نوع میزبانی معتبر نیست",
      },
    },

    event_type: {
      type: String,
      trim: true,
      required: [true, "نوع مراسم الزامی است"],
      enum: {
        values: [
          "تولد",
          "عروسی",
          "عزاداری",
          "تجلیل",
          "همایش",
          "جشن",
          "دیگر",
        ],
        message: "نوع مراسم معتبر نیست",
      },
    },

    description: {
      type: String,
      trim: true,
      required: [true, "توضیحات الزامی است"],
      minlength: [20, "توضیحات باید حداقل ۲۰ کاراکتر باشد"],
      maxlength: [2000, "توضیحات نمی‌تواند بیشتر از ۲۰۰۰ کاراکتر باشد"],
    },

    /* ============================================================
       آرایه‌های CSV
       ============================================================ */
    hall_roles: {
      type: [
        {
          type: String,
          trim: true,
          minlength: [5, "هر قانون باید حداقل ۵ کاراکتر باشد"],
          maxlength: [500, "هر قانون نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد"],
        },
      ],
      default: [],
    },

    entrance_rolls: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: [
            500,
            "هر محدودیت نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد",
          ],
        },
      ],
      default: [],
    },

    properties: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: [
            1000,
            "هر ویژگی نمی‌تواند بیشتر از ۱۰۰۰ کاراکتر باشد",
          ],
        },
      ],
      default: [],
    },

    cancel_rolls: {
      type: [
        {
          type: String,
          trim: true,
          minlength: [5, "هر قانون لغو باید حداقل ۵ کاراکتر باشد"],
        },
      ],
      default: [],
    },

    camera_capacities: {
      type: [
        {
          type: String,
          trim: true,
          minlength: [3, "هر توانایی باید حداقل ۳ کاراکتر باشد"],
        },
      ],
      default: [],
    },

    reservation_rolls: {
      type: [
        {
          type: String,
          trim: true,
          minlength: [5, "هر قانون رزرو باید حداقل ۵ کاراکتر باشد"],
        },
      ],
      default: [],
    },

    /* ============================================================
       سانس و قیمت
       ============================================================ */
    has_sans: {
      type: Boolean,
      default: false,
    },

    sans_price: {
      type: Number,
      default: 0,
      min: [0, "قیمت سانس نمی‌تواند منفی باشد"],
      validate: {
        validator: function (v) {
          // اگر has_sans فعال است، قیمت باید بیشتر از صفر باشد
          if (this.has_sans) return v > 0;
          return true;
        },
        message: "در صورت داشتن سانس، قیمت سانس باید بیشتر از صفر باشد",
      },
    },

    sans_discount: {
      type: Number,
      default: 0,
      min: [0, "تخفیف نمی‌تواند منفی باشد"],
      max: [100, "تخفیف نمی‌تواند بیشتر از ۱۰۰ درصد باشد"],
    },

    licensee_number: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => !v || /^[A-Za-z0-9\-]+$/.test(v),
        message: "شماره پروانه باید شامل حروف، اعداد و خط تیره باشد",
      },
    },

    /* ============================================================
       تاریخ‌ها
       ============================================================ */
    free_dates: {
      type: [Date],
      default: [],
      validate: [
        {
          validator: (v) => v.length <= 365,
          message: "تعداد تاریخ‌های آزاد نمی‌تواند بیشتر از ۳۶۵ باشد",
        },
      ],
    },

    /* ============================================================
       تصاویر و مدارک
       ============================================================ */
    images: {
      type: [String],
      required: [true, "تصاویر تالار الزامی است"],
      validate: [
        {
          validator: (v) => v.length >= 6,
          message: "حداقل ۶ تصویر برای تالار الزامی است",
        },
        {
          validator: (v) => v.length <= 12,
          message: "حداکثر ۱۲ تصویر مجاز است",
        },
        {
          validator: (v) =>
            v.every(
              (img) =>
                /^data:image\//.test(img) ||
                /^https?:\/\//.test(img) ||
                /^\/uploads\//.test(img) ||
                /\.(jpg|jpeg|png|webp)$/i.test(img)
            ),
          message: "فرمت تصاویر باید jpg, jpeg, png یا webp باشد",
        },
      ],
    },

    hall_document: {
      type: [String],
      default: [],
      validate: {
        validator: (v) =>
          v.every(
            (doc) =>
              /^data:(application\/pdf|image\/)/.test(doc) ||
              /^https?:\/\//.test(doc) ||
              /^\/uploads\//.test(doc) ||
              /\.(pdf|jpg|jpeg|png)$/i.test(doc)
          ),
        message: "فرمت مدارک باید pdf, jpg, jpeg یا png باشد",
      },
    },

    /* ============================================================
       وضعیت
       ============================================================ */
    is_active: {
      type: Boolean,
      default: false,
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
hallSchema.index({ title: 1 });
hallSchema.index({ province: 1, city: 1 });
hallSchema.index({ lat: 1, lng: 1 });
hallSchema.index({ hall_owner_phone: 1 });
hallSchema.index({ hall_phone: 1 });

/* ============================================================
    Pre-save Hook — سازگار با Mongoose 7+
   بدون next() — فقط mutation مستقیم روی سند
   ============================================================ */
hallSchema.pre("save", function () {
  if (this.free_dates && this.free_dates.length > 0) {
    const unique = [
      ...new Set(this.free_dates.map((d) => d.toISOString())),
    ];
    this.free_dates = unique
      .map((d) => new Date(d))
      .sort((a, b) => a - b);
  }
});

/* ============================================================
   Virtual: تعداد روزهای آزاد
   ============================================================ */
hallSchema.virtual("free_dates_count").get(function () {
  return this.free_dates?.length || 0;
});

const Hall = mongoose.models.Hall || mongoose.model("Hall", hallSchema);

module.exports = Hall;