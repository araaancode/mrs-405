import mongoose from "mongoose";
import User from "../models/User.js";
import Hall from "../models/Hall.js";

const urlImages = [
    '/images/landing/halls/1.jpg',
    '/images/landing/halls/2.jpg',
    '/images/landing/halls/3.jpg',
    '/images/landing/halls/4.jpg',
    '/images/landing/halls/5.jpg',
    '/images/landing/halls/6.jpg',
    '/images/landing/halls/7.jpg',
    '/images/landing/halls/8.jpg',
    '/images/landing/halls/8.jpeg',
    '/images/landing/halls/10.jpg',
    '/images/landing/halls/10.jpeg',
    '/images/landing/halls/12.jpeg',
    '/images/landing/halls/13.jpg',
    '/images/landing/halls/14.png',
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

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://araaancode_db_user:F8wuumuoZuZ1mRQ3@cluster0.p8pl5r4.mongodb.net/";

/* ---------- تولید کد ملی معتبر ---------- */
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

/* ---------- تولید کد ملی یکتا ---------- */
const usedNationalCodes = new Set();
function generateUniqueNationalCode() {
    let code;
    let attempts = 0;
    do {
        code = generateValidNationalCode();
        attempts++;
        if (attempts > 10000) {
            throw new Error("Could not generate unique national code after 10000 attempts.");
        }
    } while (usedNationalCodes.has(code));
    usedNationalCodes.add(code);
    return code;
}

/* ---------- داده‌های تصادفی ---------- */
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
    return {
        lat: 25 + Math.random() * 15,
        lng: 44 + Math.random() * 18
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

/* ============================================================
   ۱) پاک‌سازی کامل داده‌های قبلی
   ============================================================ */
async function clearAllData() {
    console.log("🧹 Clearing ALL previous data...");

    const deletedHalls = await Hall.deleteMany({});
    console.log(`   🗑  Deleted halls: ${deletedHalls.deletedCount}`);

    const deletedUsers = await User.deleteMany({});
    console.log(`   🗑  Deleted users: ${deletedUsers.deletedCount}`);

    const remainingHalls = await Hall.countDocuments({});
    const remainingUsers = await User.countDocuments({});
    if (remainingHalls > 0 || remainingUsers > 0) {
        throw new Error(
            `Cleanup failed: ${remainingHalls} halls and ${remainingUsers} users still exist in the database.`
        );
    }
    console.log("✅ All previous data confirmed removed (0 halls, 0 users).");
}

/* ============================================================
   ۲) ایجاد کاربر ادمین
   ============================================================ */
async function createAdmin() {
    console.log("👑 Creating admin user...");
    const admin = await User.create({
        full_name: "مدیر سیستم",
        username: "admin",
        email: "admin@marasem.app",
        phone: "09120000000",
        password: "Admin@123456",
        role: "admin",
        national_code: generateUniqueNationalCode(),
        birth_certificate: "ADMIN0001",
        province: "تهران",
        city: "تهران",
        gender: "male",
        birth_date: new Date("1990-01-01"),
        is_active: true,
        verified_at: new Date(),
        last_login: new Date()
    });
    console.log(`✅ Admin created: username="admin", password="Admin@123456", id=${admin._id}`);
    return admin;
}

/* ============================================================
   ۳) ایجاد ۱۰۰۰ کاربر hall_owner
   ============================================================ */
async function createHallOwners() {
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
            documents: [
                {
                    url: "https://example.com/doc1.pdf",
                    name: "doc1.pdf",
                    size: 1024,
                    type: "application/pdf",
                    uploaded_at: new Date()
                }
            ],
            birth_certificate: `BC${1000000 + i}`,
            national_code: generateUniqueNationalCode(),
            province: "تهران",
            city: "تهران",
            gender: "male",
            birth_date: new Date("1990-01-01"),
            is_active: true,
            verified_at: new Date(),
            last_login: new Date()
        });
    }

    let createdUsers = [];
    try {
        createdUsers = await User.insertMany(users, { ordered: false });
    } catch (err) {
        createdUsers = err.insertedDocs || [];

        console.error("❌ insertMany error name:", err.name);
        console.error("❌ error message:", err.message);
        console.error("❌ error keys:", Object.keys(err));

        if (err.writeErrors) {
            console.error(`❌ writeErrors (${err.writeErrors.length}):`);
            err.writeErrors.slice(0, 10).forEach(e => {
                console.error(`   - index ${e.index}: ${e.errmsg || e.message}`);
            });
        }

        if (err.errors) {
            console.error("❌ err.errors:");
            Object.entries(err.errors).slice(0, 10).forEach(([k, v]) => {
                console.error(`   - ${k}: ${v.message}`);
            });
        }

        if (err.result) {
            console.error("❌ err.result:", JSON.stringify(err.result, null, 2));
        }
    }

    console.log(`✅ ${createdUsers.length} hall owners created.`);
    if (createdUsers.length === 0) {
        throw new Error("No hall owners were created — check validation/unique errors above.");
    }
    return createdUsers;
}

/* ============================================================
   ۴) ایجاد ۱۰۰۰ تالار
   ============================================================ */
async function createHalls(createdUsers) {
    console.log("🏢 Creating 1000 halls...");
    const halls = [];

    for (let i = 0; i < 1000; i++) {
        const owner = createdUsers[i % createdUsers.length];
        const location = getRandomCity();
        const coordinates = getRandomLatLng();

        let title = `تالار ${location.city} ${i + 1}`;
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
            postal_code: String(1000000000 + i),          // ← ۱۰ رقم، به صورت رشته
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
            images: urlImages.slice(0, 8),               // ← حداکثر ۸ تصویر (مدل: ۶ تا ۱۲)
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

    let createdHalls = [];
    try {
        createdHalls = await Hall.insertMany(halls, {
            ordered: false,
            validateBeforeSave: true
        });
    } catch (err) {
        createdHalls = err.insertedDocs || [];

        console.error("❌ Hall insertMany error name:", err.name);
        console.error("❌ Hall error message:", err.message);
        console.error("❌ Hall error keys:", Object.keys(err));

        if (err.writeErrors) {
            console.error(`❌ Hall writeErrors (${err.writeErrors.length}):`);
            err.writeErrors.slice(0, 10).forEach(e => {
                console.error(`   - index ${e.index}: ${e.errmsg || e.message}`);
            });
        }
        if (err.errors) {
            console.error("❌ Hall err.errors:");
            Object.entries(err.errors).slice(0, 10).forEach(([k, v]) => {
                console.error(`   - ${k}: ${v.message}`);
            });
        }
        if (err.result) {
            console.error("❌ Hall err.result:", JSON.stringify(err.result, null, 2));
        }
    }

    console.log(`✅ ${createdHalls.length} halls created.`);
    return createdHalls;
}

/* ============================================================
   ۵) خواندن مجدد از دیتابیس و نمایش
   ============================================================ */
async function verifyAndDisplay() {
    console.log("\n========== 📊 VERIFICATION (read from DB) ==========");

    const totalUsers = await User.countDocuments({});
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalOwners = await User.countDocuments({ role: "hall_owner" });
    const totalHalls = await Hall.countDocuments({});

    console.log(`👤 Total users in DB : ${totalUsers}  (admin: ${totalAdmins}, hall_owner: ${totalOwners})`);
    console.log(`🏢 Total halls in DB : ${totalHalls}`);

    const admin = await User.findOne({ role: "admin" }).lean();
    console.log("\n👑 Admin:");
    console.log(`   username: ${admin?.username}`);
    console.log(`   email   : ${admin?.email}`);
    console.log(`   phone   : ${admin?.phone}`);

    const sampleOwners = await User.find({ role: "hall_owner" }).limit(3).lean();
    console.log("\n👥 Sample hall owners (first 3):");
    sampleOwners.forEach(u =>
        console.log(`   - ${u.username} | ${u.full_name} | ${u.phone} | national_code=${u.national_code}`)
    );

    const sampleHalls = await Hall.find({}).limit(3).lean();
    console.log("\n🏢 Sample halls (first 3):");
    sampleHalls.forEach(h =>
        console.log(`   - ${h.title} | ${h.province} / ${h.city} | capacity=${h.capacity}`)
    );

    console.log("====================================================\n");
}

/* ============================================================
   MAIN
   ============================================================ */
async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ MongoDB Connected\n");

        await clearAllData();
        await createAdmin();
        const createdUsers = await createHallOwners();
        await createHalls(createdUsers);
        await verifyAndDisplay();

        console.log("🎉 Seeder finished successfully.");
        process.exit(0);

    } catch (error) {
        console.error("❌ Error in seeder:", error.message || error);
        process.exit(1);
    }
}

seed();