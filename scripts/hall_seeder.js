import mongoose from "mongoose";
import User from "../models/User.js";
import Hall from "../models/Hall.js";

const urlImages = [
    './images/landing/halls/1.jpg',
    './images/landing/halls/2.jpg',
    './images/landing/halls/3.jpg',
    './images/landing/halls/4.jpg',
    './images/landing/halls/5.jpg',
    './images/landing/halls/6.jpg',
    './images/landing/halls/7.jpg',
    './images/landing/halls/8.jpg',
    './images/landing/halls/8.jpeg',
    './images/landing/halls/10.jpg',
    './images/landing/halls/10.jpeg',
    './images/landing/halls/12.jpeg',
    './images/landing/halls/13.jpg',
    './images/landing/halls/14.png',
];

const iranLocations = {
    "آذربایجان شرقی": ["تبریز", "مراغه", "مرند", "اهر", "سراب", "بناب"],
    "آذربایجان غربی": ["ارومیه", "خوی", "مهاباد", "بوکان", "میاندوآب"],
    "اردبیل": ["اردبیل", "پارس آباد", "مشگین شهر", "خلخال"],
    "اصفهان": ["اصفهان", "کاشان", "نجف آباد", "خمینی شهر", "شاهین شهر"],
    "البرز": ["کرج", "نظرآباد", "طالقان", "هشتگرد"],
    "ایلام": ["ایلام", "دهلران", "آبدانان", "مهران"],
    "بوشهر": ["بوشهر", "دشتستان", "گناوه", "دیلم"],
    "تهران": ["تهران", "ری", "اسلامشهر", "شهریار", "دماوند", "ورامین"],
    "چهارمحال و بختیاری": ["شهرکرد", "بروجن", "فارسان", "لردگان"],
    "خراسان جنوبی": ["بیرجند", "قائن", "طبس", "فردوس"],
    "خراسان رضوی": ["مشهد", "نیشابور", "سبزوار", "تربت حیدریه", "قوچان"],
    "خراسان شمالی": ["بجنورد", "شیروان", "اسفراین"],
    "خوزستان": ["اهواز", "آبادان", "خرمشهر", "دزفول", "اندیمشک"],
    "زنجان": ["زنجان", "ابهر", "خرمدره"],
    "سمنان": ["سمنان", "شاهرود", "دامغان", "گرمسار"],
    "سیستان و بلوچستان": ["زاهدان", "چابهار", "ایرانشهر", "زابل"],
    "فارس": ["شیراز", "مرودشت", "کازرون", "لار", "فسا"],
    "قزوین": ["قزوین", "تاکستان", "آبیک"],
    "قم": ["قم"],
    "کردستان": ["سنندج", "سقز", "مریوان", "بانه"],
    "کرمان": ["کرمان", "رفسنجان", "جیرفت", "بم"],
    "کرمانشاه": ["کرمانشاه", "اسلام آباد غرب", "سنقر", "قصر شیرین"],
    "کهگیلویه و بویراحمد": ["یاسوج", "گچساران", "دهدشت"],
    "گلستان": ["گرگان", "گنبد کاووس", "علی آباد کتول"],
    "گیلان": ["رشت", "انزلی", "لاهیجان", "آستارا"],
    "لرستان": ["خرم آباد", "بروجرد", "دورود", "الیگودرز"],
    "مازندران": ["ساری", "بابل", "آمل", "قائمشهر", "نوشهر"],
    "مرکزی": ["اراک", "ساوه", "خمین"],
    "هرمزگان": ["بندرعباس", "قشم", "کیش", "میناب"],
    "همدان": ["همدان", "ملایر", "نهاوند", "تویسرکان"],
    "یزد": ["یزد", "میبد", "اردکان", "بافق"]
};

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mrsapp";

function generateValidNationalCode() {
    const digits = [];
    for (let i = 0; i < 9; i++) {
        digits.push(Math.floor(Math.random() * 10));
    }
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += digits[i] * (10 - i);
    }
    const remainder = sum % 11;
    const checkDigit = remainder < 2 ? remainder : 11 - remainder;
    digits.push(checkDigit);
    return digits.join("");
}

function getRandomHallType() {
    const hallTypes = ["سربسته", "روباز", "باغ", "تراس", "سالن سرپوشیده", "دیگر"];
    return hallTypes[Math.floor(Math.random() * hallTypes.length)];
}

function getRandomEventType() {
    const eventTypes = ["تولد", "عروسی", "عزاداری", "تجلیل", "همایش", "جشن", "دیگر"];
    return eventTypes[Math.floor(Math.random() * eventTypes.length)];
}

function getRandomHostType() {
    const hostTypes = ["فول", "نوشیدنی", "شام", "ناهار", "صبحانه", "بدون پذیرایی", "دیگر"];
    return hostTypes[Math.floor(Math.random() * hostTypes.length)];
}

function getRandomCity() {
    const provinces = Object.keys(iranLocations);
    const randomProvince = provinces[Math.floor(Math.random() * provinces.length)];
    const cities = iranLocations[randomProvince];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    return { province: randomProvince, city: randomCity };
}

function getRandomLatLng() {
    // محدوده جغرافیایی ایران (تقریبی)
    return {
        lat: 25 + Math.random() * 15,  // بین 25 تا 40 درجه
        lng: 44 + Math.random() * 18    // بین 44 تا 62 درجه
    };
}

function getRandomFutureDates(count = 3) {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < count; i++) {
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + Math.floor(Math.random() * 365) + 30);
        dates.push(futureDate);
    }
    return dates.sort((a, b) => a - b);
}

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(" MongoDB Connected");

        // پاک کردن داده‌های قبلی
        await User.deleteMany({ role: "hall_owner" });
        await Hall.deleteMany({});
        console.log("🗑 Existing data cleared");

        // ========== ایجاد 1000 کاربر hall_owner ==========
        console.log("👥 Creating 1000 hall owners...");
        const users = [];

        for (let i = 1; i <= 1000; i++) {
            users.push({
                full_name: `مالک تالار ${i}`,
                username: `hall_owner_${i}`,
                email: `owner${i}@example.com`,
                phone: `0912${String(i % 10000000).padStart(7, "0")}`,
                password: "12345678",
                role: "hall_owner",
                documents: ["https://example.com/doc1.pdf"],
                birth_certificate: `BC${1000000 + i}`,
                national_code: generateValidNationalCode(),
                province: "تهران",
                city: "تهران",
                gender: "male",
                birth_date: new Date("1990-01-01"),
                is_active: true,
                verified_at: new Date(),
                last_login: new Date()
            });
        }

        const createdUsers = await User.insertMany(users, { ordered: false });
        console.log(` ${createdUsers.length} users created successfully`);

        // ========== ایجاد 1000 تالار ==========
        console.log("🏢 Creating 1000 halls...");
        const halls = [];

        for (let i = 0; i < 1000; i++) {
            const owner = createdUsers[i];
            const location = getRandomCity();
            const coordinates = getRandomLatLng();

            // اطمینان از حداقل 6 کاراکتر برای title
            const title = `تالار ${getRandomCity().city} ${i + 1}`;
            while (title.length < 6) {
                title = `تالار بزرگ ${i + 1}`;
            }

            halls.push({
                hall_owner_id: owner._id,
                title: title,
                province: location.province,
                city: location.city,
                address: `خیابان اصلی، نبش کوچه ${i + 1}، پلاک ${i + 100}`,
                lat: coordinates.lat,
                lng: coordinates.lng,
                postal_code: 1000000000 + i,
                hall_phone: `021${String(1234567 + i).slice(0, 7)}`,
                hall_owner_name: owner.full_name,
                hall_owner_phone: owner.phone,
                hall_measure: 100 + (i % 990) * 10,
                description: `این تالار یکی از بهترین تالارهای ${location.city} است که با مدرن‌ترین امکانات و خدمات با کیفیت آماده ارائه خدمات به شما عزیزان می‌باشد.`,
                year: 1380 + (i % 24),
                hall_roles: [
                    "ورود با کارت دعوت الزامی است",
                    "استعمال دخانیات فقط در محل‌های مشخص شده",
                    "رعایت حجاب برای بانوان الزامی است"
                ],
                capacity: 50 + (i % 950),
                duration: 4 + (i % 8),
                free_dates: getRandomFutureDates(3),
                images: [...urlImages], // کپی از آرایه تصاویر
                entrance_rolls: [
                    "ورود از ساعت 17 تا 20",
                    "خروج حداکثر ساعت 24"
                ],
                hall_type: getRandomHallType(),
                host_type: getRandomHostType(),
                event_type: getRandomEventType(),
                properties: ["آسانسور", "نمازخانه", "سرویس بهداشتی اختصاصی", "پارکینگ", "سیستم صوتی حرفه‌ای"],
                parking_count: Math.floor(Math.random() * 100).toString(),
                roof_count: Math.floor(Math.random() * 5 + 1).toString(),
                has_sans: Math.random() > 0.5,
                hall_document: ["license.pdf", "ownership.pdf"],
                sans_price: 5000000 + (i % 10000000),
                sans_discount: Math.floor(Math.random() * 50),
                licensee_number: `LIC-${String(1000 + i).padStart(6, "0")}`,
                cancel_rolls: [
                    "لغو تا 7 روز قبل 50% جریمه",
                    "لغو 48 ساعت قبل 100% جریمه"
                ],
                camera_capacities: ["فیلمبرداری حرفه‌ای", "عکاسی", "پخش زنده"],
                reservation_rolls: [
                    "پرداخت 30% بیعانه جهت رزرو",
                    "موجودی باید 3 روز قبل تسویه شود"
                ],
                is_active: true
            });
        }

        // استفاده از insertMany با اعتبارسنجی کامل
        const createdHalls = await Hall.insertMany(halls, {
            ordered: false,  // ادامه بده حتی اگر بعضی خطا داشته باشند
            validateBeforeSave: true  // اعتبارسنجی مدل را اعمال کن
        });

        console.log(` ${createdHalls.length} halls created successfully`);
        console.log("🎉 Seeder executed successfully - 1000 users + 1000 halls");
        process.exit(0);

    } catch (error) {
        console.error("❌ Error in seeder:", error);
        if (error.writeErrors) {
            console.error("Write errors:", error.writeErrors.map(e => ({
                index: e.index,
                message: e.errmsg
            })));
        }
        process.exit(1);
    }
}

seed();