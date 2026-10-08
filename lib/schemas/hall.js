import { z } from "zod";
import { IRAN_PROVINCES } from "@/lib/iranProvinces";

/* ============================================================
   Constants & Helpers
   ============================================================ */
const PROVINCE_NAMES = Object.keys(IRAN_PROVINCES);

/** رشته خالی → undefined، در غیر این صورت عدد */
const optionalNumber = (opts = {}) =>
  z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => {
      if (v === "" || v === null || v === undefined) return undefined;
      const n = Number(v);
      return isNaN(n) ? undefined : n;
    })
    .refine(
      (v) => v === undefined || !isNaN(v),
      opts.message || "عدد معتبر وارد کنید"
    );

/** CSV → آرایه‌ای از رشته‌های trim شده، با اعتبارسنجی تعداد و طول */
const csvToStringArray = (opts = {}) =>
  z
    .string()
    .optional()
    .transform((s) =>
      !s ? [] : s.split(",").map((x) => x.trim()).filter(Boolean)
    )
    .refine(
      (arr) =>
        arr.length === 0 ||
        (opts.minLength
          ? arr.every((s) => s.length >= opts.minLength)
          : true),
      opts.message ||
        `هر آیتم باید حداقل ${opts.minLength || 1} کاراکتر باشد`
    )
    .refine(
      (arr) =>
        arr.length === 0 ||
        (opts.maxLength
          ? arr.every((s) => s.length <= opts.maxLength)
          : true),
      opts.message || `هر آیتم نباید از حد مجاز بیشتر باشد`
    )
    .refine(
      (arr) => !opts.minItems || arr.length === 0 || arr.length >= opts.minItems,
      opts.minItemsMessage || `حداقل ${opts.minItems} مورد لازم است`
    )
    .refine(
      (arr) => !opts.maxItems || arr.length <= opts.maxItems,
      opts.maxItemsMessage || `حداکثر ${opts.maxItems} مورد مجاز است`
    );

/* ============================================================
   Main Schema
   ============================================================ */
export const hallSchema = z
  .object({
    /* ---------- اطلاعات اصلی ---------- */

    title: z
      .string({ required_error: "نام تالار الزامی است" })
      .trim()
      .min(6, "نام تالار باید حداقل ۶ کاراکتر باشد")
      .max(100, "نام تالار نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد"),

    province: z
      .string({ required_error: "استان الزامی است" })
      .trim()
      .min(1, "استان را انتخاب کنید")
      .refine(
        (v) => PROVINCE_NAMES.includes(v),
        "استان انتخابی معتبر نیست"
      ),

    city: z
      .string({ required_error: "شهر الزامی است" })
      .trim()
      .min(1, "شهر را انتخاب کنید"),

    address: z
      .string({ required_error: "آدرس الزامی است" })
      .trim()
      .min(10, "آدرس باید حداقل ۱۰ کاراکتر باشد")
      .max(500, "آدرس نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد"),

    lat: z.coerce
      .number({ invalid_type_error: "عرض جغرافیایی نامعتبر" })
      .min(-90, "عرض جغرافیایی باید بین -۹۰ و ۹۰ باشد")
      .max(90, "عرض جغرافیایی باید بین -۹۰ و ۹۰ باشد"),

    lng: z.coerce
      .number({ invalid_type_error: "طول جغرافیایی نامعتبر" })
      .min(-180, "طول جغرافیایی باید بین -۱۸۰ و ۱۸۰ باشد")
      .max(180, "طول جغرافیایی باید بین -۱۸۰ و ۱۸۰ باشد"),

    postal_code: z
      .string()
      .trim()
      .regex(/^\d{10}$/, "کد پستی باید دقیقاً ۱۰ رقم باشد"),

    hall_phone: z
      .string({ required_error: "تلفن تالار الزامی است" })
      .trim()
      .min(7, "تلفن معتبر وارد کنید")
      .max(15, "تلفن نمی‌تواند بیشتر از ۱۵ کاراکتر باشد"),

    /* ---------- مالک ---------- */

    hall_owner_name: z
      .string({ required_error: "نام مالک الزامی است" })
      .trim()
      .min(3, "نام مالک باید حداقل ۳ کاراکتر باشد")
      .max(100, "نام مالک نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد"),

    hall_owner_phone: z
      .string({ required_error: "شماره موبایل مالک الزامی است" })
      .trim()
      .regex(/^09\d{9}$/, "شماره موبایل باید با ۰۹ شروع و ۱۱ رقم باشد"),

    /* ---------- فنی ---------- */

    hall_measure: optionalNumber().refine(
      (v) => v === undefined || (v >= 10 && v <= 10000),
      "متراژ باید بین ۱۰ تا ۱۰۰۰۰ متر مربع باشد"
    ),

    capacity: optionalNumber().refine(
      (v) => v === undefined || (v >= 1 && v <= 10000),
      "ظرفیت باید بین ۱ تا ۱۰۰۰۰ نفر باشد"
    ),

    duration: optionalNumber().refine(
      (v) => v === undefined || (v >= 1 && v <= 24),
      "مدت مراسم باید بین ۱ تا ۲۴ ساعت باشد"
    ),

    year: optionalNumber().refine(
      (v) =>
        v === undefined ||
        (v >= 1300 && v <= new Date().getFullYear()),
      "سال ساخت باید بین ۱۳۰۰ تا سال جاری باشد"
    ),

    parking_count: z
      .string()
      .trim()
      .optional()
      .refine(
        (v) => !v || /^\d+$/.test(v) || v === "نامحدود",
        "تعداد پارکینگ باید عدد یا «نامحدود» باشد"
      ),

    roof_count: z
      .string()
      .trim()
      .optional()
      .refine(
        (v) => !v || /^\d+$/.test(v),
        "تعداد طبقات باید عدد باشد"
      ),

    hall_type: z
      .string({ required_error: "نوع تالار الزامی است" })
      .min(1, "نوع تالار را انتخاب کنید"),

    host_type: z
      .string({ required_error: "نوع میزبانی الزامی است" })
      .min(1, "نوع میزبانی را انتخاب کنید"),

    event_type: z
      .string({ required_error: "نوع مراسم الزامی است" })
      .min(1, "نوع مراسم را انتخاب کنید"),

    description: z
      .string({ required_error: "توضیحات الزامی است" })
      .trim()
      .min(20, "توضیحات باید حداقل ۲۰ کاراکتر باشد")
      .max(2000, "توضیحات نمی‌تواند بیشتر از ۲۰۰۰ کاراکتر باشد"),

    /* ---------- CSV: ۱ تا ۵ مورد ---------- */

    hall_roles: csvToStringArray({
      minLength: 5,
      maxLength: 500,
      minItems: 1,
      maxItems: 5,
      message: "هر قانون باید بین ۵ تا ۵۰۰ کاراکتر باشد",
      minItemsMessage: "حداقل ۱ قانون تالار الزامی است",
      maxItemsMessage: "حداکثر ۵ قانون تالار مجاز است",
    }),

    entrance_rolls: csvToStringArray({
      minLength: 3,
      maxLength: 500,
      minItems: 1,
      maxItems: 5,
      message: "هر محدودیت باید بین ۳ تا ۵۰۰ کاراکتر باشد",
      minItemsMessage: "حداقل ۱ محدودیت ورود/خروج الزامی است",
      maxItemsMessage: "حداکثر ۵ محدودیت ورود/خروج مجاز است",
    }),

    properties: csvToStringArray({
      minLength: 3,
      maxLength: 1000,
      minItems: 1,
      maxItems: 5,
      message: "هر ویژگی باید بین ۳ تا ۱۰۰۰ کاراکتر باشد",
      minItemsMessage: "حداقل ۱ امکان تالار الزامی است",
      maxItemsMessage: "حداکثر ۵ امکان تالار مجاز است",
    }),

    cancel_rolls: csvToStringArray({
      minLength: 5,
      maxLength: 500,
      minItems: 1,
      maxItems: 5,
      message: "هر قانون لغو باید بین ۵ تا ۵۰۰ کاراکتر باشد",
      minItemsMessage: "حداقل ۱ قانون لغو الزامی است",
      maxItemsMessage: "حداکثر ۵ قانون لغو مجاز است",
    }),

    camera_capacities: csvToStringArray({
      minLength: 3,
      maxLength: 500,
      minItems: 1,
      maxItems: 5,
      message: "هر توانایی باید بین ۳ تا ۵۰۰ کاراکتر باشد",
      minItemsMessage: "حداقل ۱ توانایی الزامی است",
      maxItemsMessage: "حداکثر ۵ توانایی مجاز است",
    }),

    reservation_rolls: csvToStringArray({
      minLength: 5,
      maxLength: 500,
      minItems: 1,
      maxItems: 5,
      message: "هر قانون رزرو باید بین ۵ تا ۵۰۰ کاراکتر باشد",
      minItemsMessage: "حداقل ۱ قانون رزرو الزامی است",
      maxItemsMessage: "حداکثر ۵ قانون رزرو مجاز است",
    }),

    /* ---------- سانس ---------- */

    has_sans: z.boolean().default(false),

    sans_price: optionalNumber().refine(
      (v) => v === undefined || v >= 0,
      "قیمت سانس نمی‌تواند منفی باشد"
    ),

    sans_discount: optionalNumber().refine(
      (v) => v === undefined || (v >= 0 && v <= 100),
      "تخفیف باید بین ۰ تا ۱۰۰ درصد باشد"
    ),

    licensee_number: z
      .string()
      .trim()
      .optional()
      .refine(
        (v) => !v || /^[A-Za-z0-9\-]+$/.test(v),
        "شماره پروانه باید شامل حروف، اعداد و خط تیره باشد"
      ),
  })
  .superRefine((data, ctx) => {
    /* اگر has_sans فعال است، قیمت الزامی می‌شود */
    if (data.has_sans && (!data.sans_price || data.sans_price <= 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sans_price"],
        message: "در صورت داشتن سانس، قیمت الزامی است",
      });
    }

    /* اگر has_sans غیرفعال، تخفیف معنایی ندارد */
    if (!data.has_sans && data.sans_discount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sans_discount"],
        message: "بدون سانس، تخفیف معنایی ندارد",
      });
    }
  });