// app/halls/constants.js
export const PROVINCES = [
    "تهران", "البرز", "اصفهان", "فارس", "خراسان رضوی",
    "آذربایجان شرقی", "آذربایجان غربی", "خوزستان", "گیلان",
    "مازندران", "کرمان", "یزد", "قم"
];

export const HALL_TYPES = [
    "سربسته", "روباز", "باغ", "تراس", "سالن سرپوشیده", "دیگر"
];

export const EVENT_TYPES = [
    "عروسی", "تولد", "عزاداری", "تجلیل", "همایش", "جشن", "دیگر"
];

export const HOST_TYPES = [
    "فول", "نوشیدنی", "شام", "ناهار", "صبحانه", "بدون پذیرایی", "دیگر"
];

export const SORT_OPTIONS = [
    { value: "newest", label: "جدیدترین" },
    { value: "price_asc", label: "ارزان‌ترین" },
    { value: "price_desc", label: "گران‌ترین" },
    { value: "capacity_desc", label: "بزرگ‌ترین ظرفیت" },
    { value: "capacity_asc", label: "کوچک‌ترین ظرفیت" },
];

export const CAPACITY_RANGES = [
    { label: "تا 100 نفر", min: 0, max: 100 },
    { label: "100 تا 300 نفر", min: 100, max: 300 },
    { label: "300 تا 500 نفر", min: 300, max: 500 },
    { label: "بیش از 500 نفر", min: 500, max: Infinity },
];

export const PRICE_RANGES = [
    { label: "تا ۱۰ میلیون", min: 0, max: 10_000_000 },
    { label: "۱۰ تا ۳۰ میلیون", min: 10_000_000, max: 30_000_000 },
    { label: "۳۰ تا ۶۰ میلیون", min: 30_000_000, max: 60_000_000 },
    { label: "بیش از ۶۰ میلیون", min: 60_000_000, max: Infinity },
];

export const PROPERTIES_FILTER = [
    "پارکینگ", "آسانسور", "نمازخانه", "سیستم سرمایشی",
    "سیستم گرمایشی", "اتاق عروس", "گل‌آرایی", "کولر"
];