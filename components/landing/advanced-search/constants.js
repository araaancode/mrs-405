export const EVENT_TYPES = [
  { value: "تولد", label: "تولد" },
  { value: "عروسی", label: "عروسی" },
  { value: "عزاداری", label: "عزاداری" },
  { value: "تجلیل", label: "تجلیل" },
  { value: "همایش", label: "همایش" },
  { value: "جشن", label: "جشن" },
  { value: "دیگر", label: "دیگر" },
];

export const HALL_TYPES = [
  { value: "سربسته", label: "سربسته" },
  { value: "روباز", label: "روباز" },
  { value: "باغ", label: "باغ" },
  { value: "تراس", label: "تراس" },
  { value: "سالن سرپوشیده", label: "سالن سرپوشیده" },
  { value: "دیگر", label: "دیگر" },
];

export const PROVINCES = [
  "آذربایجان شرقی", "آذربایجان غربی", "اردبیل", "اصفهان", "البرز",
  "ایلام", "بوشهر", "تهران", "چهارمحال و بختیاری", "خراسان جنوبی",
  "خراسان رضوی", "خراسان شمالی", "خوزستان", "زنجان", "سمنان",
  "سیستان و بلوچستان", "فارس", "قزوین", "قم", "کردستان", "کرمان",
  "کرمانشاه", "کهگیلویه و بویراحمد", "گلستان", "گیلان", "لرستان",
  "مازندران", "مرکزی", "هرمزگان", "همدان", "یزد",
];

export const INITIAL_FILTERS = {
  province: "",
  city: "",
  event_type: "",
  hall_type: "",
};

export const FILTER_LABELS = {
  province: "استان",
  city: "شهر",
  event_type: "نوع مراسم",
  hall_type: "نوع تالار",
};