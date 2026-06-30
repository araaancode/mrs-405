"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/teal.css";
import { PulseLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";

export default function AdminProfilePage() {
    const { data: session } = useSession();
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(false);
    const [birthDate, setBirthDate] = useState(null);

    // تابع تبدیل تاریخ میلادی به شمسی (برای نمایش در DatePicker)
    const convertToPersianDateObject = (gregorianDate) => {
        if (!gregorianDate) return null;
        try {
            const date = new Date(gregorianDate);
            return date;
        } catch {
            return null;
        }
    };

    // تابع تبدیل تاریخ شمسی به میلادی برای ارسال به سرور
    const convertToGregorian = (dateObject) => {
        if (!dateObject) return null;
        const gregorianDate = dateObject.toDate();
        return gregorianDate.toISOString().split('T')[0];
    };

    useEffect(() => {
        if (session?.user) {
            // دریافت اطلاعات پروفایل با axios
            axios.get("/api/admin/profile")
                .then(response => {
                    const userData = response.data.user || response.data;
                    setForm(userData);

                    // تنظیم تاریخ برای DatePicker
                    if (userData.birth_date) {
                        const dateObj = convertToPersianDateObject(userData.birth_date);
                        setBirthDate(dateObj);
                    }
                })
                .catch(err => {
                    console.error("خطا در دریافت اطلاعات:", err);
                    setForm(session.user);
                    toast.error("خطا در دریافت اطلاعات پروفایل", {
                        duration: 3000,
                        position: "top-right",
                        icon: "❌",
                        style: {
                            background: "#FEF2F2",
                            color: "#991B1B",
                            borderRadius: "12px",
                            padding: "12px 20px",
                            fontSize: "14px",
                            fontWeight: "600",
                            border: "1px solid #FCA5A5",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
                        }
                    });
                });
        }
    }, [session]);

    const changeHandler = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleBirthDateChange = (date) => {
        setBirthDate(date);
        // تبدیل به میلادی برای ذخیره در فرم
        const gregorianDate = convertToGregorian(date);
        setForm({
            ...form,
            birth_date: gregorianDate
        });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.put("/api/admin/profile", form, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 200) {
                toast.success(" پروفایل با موفقیت بروزرسانی شد", {
                    duration: 3000,
                    position: "top-right",
                    icon: "",
                    style: {
                        background: "#fff",
                        color: "#166534",
                        borderRadius: "12px",
                        padding: "16px 24px",
                        fontSize: "16px",
                        fontWeight: "700",
                        border: "2px solid #86EFAC",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                    }
                });
            } else {
                toast.error("خطا در بروزرسانی پروفایل", {
                    duration: 3000,
                    position: "top-right",
                    icon: "❌",
                    style: {
                        background: "#FEF2F2",
                        color: "#991B1B",
                        borderRadius: "12px",
                        padding: "12px 20px",
                        fontSize: "14px",
                        fontWeight: "600",
                        border: "1px solid #FCA5A5",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
                    }
                });
            }
        } catch (error) {
            console.error("خطا در بروزرسانی:", error);
            toast.error(error.response?.data?.message || "خطا در ارتباط با سرور", {
                duration: 3000,
                position: "top-right",
                icon: "❌",
                style: {
                    background: "#FEF2F2",
                    color: "#991B1B",
                    borderRadius: "12px",
                    padding: "12px 20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    border: "1px solid #FCA5A5",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
                }
            });
        } finally {
            setLoading(false);
        }
    };

    if (!session) {
        return (
            <div className="loading-container">
                <PulseLoader color="#D4B06A" size={15} margin={6} />
                <p>در حال بارگذاری...</p>
            </div>
        );
    }

    return (
        <div className="profilePage">
            <Toaster />
            <h2>ویرایش پروفایل ادمین</h2>

            <form onSubmit={submitHandler}>
                <h3>اطلاعات اصلی</h3>

                <div className="form-field">
                    <input
                        name="full_name"
                        placeholder="نام و نام خانوادگی"
                        value={form.full_name || ""}
                        onChange={changeHandler}
                    />
                </div>

                <div className="form-field">
                    <input
                        name="username"
                        placeholder="نام کاربری"
                        value={form.username || ""}
                        onChange={changeHandler}
                    />
                </div>

                <div className="form-field">
                    <input
                        name="email"
                        placeholder="ایمیل"
                        value={form.email || ""}
                        onChange={changeHandler}
                    />
                </div>

                <div className="form-field">
                    <input
                        name="phone"
                        placeholder="شماره همراه"
                        value={form.phone || ""}
                        onChange={changeHandler}
                    />
                </div>

                <h3>اطلاعات هویتی</h3>

                <div className="form-field">
                    <input
                        name="national_code"
                        placeholder="کد ملی"
                        value={form.national_code || ""}
                        onChange={changeHandler}
                    />
                </div>

                <div className="form-field">
                    <input
                        name="birth_certificate"
                        placeholder="شماره شناسنامه"
                        value={form.birth_certificate || ""}
                        onChange={changeHandler}
                    />
                </div>

                <div className="form-field date-field">
                    <label className="date-label">تاریخ تولد</label>
                    <div className="date-input-wrapper">
                        <DatePicker
                            calendar={persian}
                            locale={persian_fa}
                            value={birthDate}
                            onChange={handleBirthDateChange}
                            format="YYYY/MM/DD"
                            placeholder="انتخاب تاریخ تولد"
                            containerClassName="datepicker-wrapper"
                            inputClass="datepicker-input"
                            renderButton={<button className="datepicker-button" type="button">📅</button>}
                        />
                    </div>
                    {form.birth_date && (
                        <span className="date-display">تاریخ انتخاب شده: {new Date(form.birth_date).toLocaleDateString('fa-IR')}</span>
                    )}
                </div>

                <div className="form-field">
                    <select
                        name="gender"
                        value={form.gender || ""}
                        onChange={changeHandler}
                    >
                        <option value="">انتخاب جنسیت</option>
                        <option value="male">مرد</option>
                        <option value="female">زن</option>
                        <option value="other">سایر</option>
                    </select>
                </div>

                <h3>اطلاعات فعالیت</h3>

                <div className="form-field">
                    <input
                        name="business_name"
                        placeholder="نام کسب‌وکار (در صورت وجود)"
                        value={form.business_name || ""}
                        onChange={changeHandler}
                    />
                </div>

                <div className="form-field">
                    <input
                        name="license_number"
                        placeholder="شماره مجوز (اختیاری)"
                        value={form.license_number || ""}
                        onChange={changeHandler}
                    />
                </div>

                <h3>موقعیت جغرافیایی</h3>

                <div className="form-field">
                    <input
                        name="province"
                        placeholder="استان"
                        value={form.province || ""}
                        onChange={changeHandler}
                    />
                </div>

                <div className="form-field">
                    <input
                        name="city"
                        placeholder="شهر"
                        value={form.city || ""}
                        onChange={changeHandler}
                    />
                </div>

                <h3>مدارک</h3>

                <div className="form-field">
                    <textarea
                        name="documents"
                        placeholder="لینک مدارک (هر خط یک لینک)"
                        value={form.documents?.join("\n") || ""}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                documents: e.target.value.split("\n")
                            })
                        }
                    />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? (
                        <>
                            <PulseLoader color="#ffffff" size={8} margin={4} />
                            <span>در حال ذخیره...</span>
                        </>
                    ) : (
                        "ذخیره تغییرات"
                    )}
                </button>
            </form>

            <style jsx>{`
                .profilePage {
                    direction: rtl;
                    padding: 1rem;
                    max-width: 100%;
                   
                }

                .loading-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    min-height: 400px;
                    direction: rtl;
                    gap: 20px;
                }

                .loading-container p {
                    font-size: 16px;
                    color: #6b7280;
                    margin-top: 8px;
                }

                h2 {
                    margin-bottom: 30px;
                    font-size: 22px;
                    font-weight: bold;
                }

                form {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 16px;
                    padding: 35px;
                    max-width: 800px;
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                    width: 100%;
                }

                h3 {
                    margin-top: 15px;
                    font-size: 16px;
                    font-weight: 600;
                    color: #374151;
                }

                .form-field input,
                .form-field select,
                .form-field textarea {
                    width: 100%;
                    padding: 12px 14px;
                    border: 1px solid #d1d5db;
                    background: #fafafa;
                    border-radius: 10px;
                    font-size: 14px;
                    box-sizing: border-box;
                    transition: all 0.2s ease;
                }

                .form-field input:focus,
                .form-field select:focus,
                .form-field textarea:focus {
                    outline: none;
                    border-color: #D4B06A;
                    box-shadow: 0 0 0 3px rgba(212, 176, 106, 0.15);
                    background: white;
                }

                textarea {
                    min-height: 120px;
                    resize: vertical;
                }

                /* دکمه ذخیره با رنگ طلایی */
                .submit-btn {
                    margin-top: 10px;
                    width: 180px;
                    padding: 12px;
                    border: none;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #D4B06A 0%, #C39243 50%, #B8860B 100%);
                    color: white;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(212, 176, 106, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }

                .submit-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 25px rgba(212, 176, 106, 0.4);
                }

                .submit-btn:active:not(:disabled) {
                    transform: translateY(0);
                }

                .submit-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }

                /* استایل‌های فیلد تاریخ */
                .date-field {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .date-label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 2px;
                }

                .date-input-wrapper {
                    position: relative;
                    width: 100%;
                }

                .datepicker-wrapper {
                    width: 100%;
                }

                .datepicker-input {
                    width: 100%;
                    padding: 12px 14px;
                    padding-left: 50px;
                    border: 1px solid #d1d5db;
                    background: #fafafa;
                    border-radius: 10px;
                    font-size: 14px;
                    box-sizing: border-box;
                    cursor: pointer;
                    font-family: inherit;
                    transition: all 0.2s ease;
                }

                .datepicker-input:hover {
                    border-color: #D4B06A;
                    background: #fcf8f0;
                }

                .datepicker-input:focus {
                    outline: none;
                    border-color: #D4B06A;
                    box-shadow: 0 0 0 3px rgba(212, 176, 106, 0.15);
                }

                /* دکمه تقویم با رنگ طلایی */
                .datepicker-button {
                    position: absolute;
                    left: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 38px;
                    height: 38px;
                    border: none;
                    background: linear-gradient(135deg, #D4B06A 0%, #C39243 50%, #B8860B 100%);
                    font-size: 18px;
                    cursor: pointer;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    padding: 0;
                    color: white;
                    box-shadow: 0 2px 10px rgba(212, 176, 106, 0.25);
                }

                .datepicker-button:hover {
                    transform: translateY(-50%) scale(1.05);
                    box-shadow: 0 4px 15px rgba(212, 176, 106, 0.4);
                }

                .datepicker-button:active {
                    transform: translateY(-50%) scale(0.95);
                }

                .date-display {
                    font-size: 13px;
                    color: #6b7280;
                    margin-top: 4px;
                    padding-right: 4px;
                }

                /* استایل‌های ریسپانسیو */
                @media (max-width: 768px) {
                    .profilePage {
                        padding: 0.75rem;
                    }

                    form {
                        padding: 20px;
                        border-radius: 12px;
                        gap: 14px;
                    }

                    h2 {
                        font-size: 20px;
                        margin-bottom: 20px;
                    }

                    h3 {
                        font-size: 15px;
                        margin-top: 12px;
                    }

                    .form-field input,
                    .form-field select,
                    .form-field textarea,
                    .datepicker-input {
                        padding: 10px 12px;
                        font-size: 13px;
                    }

                    .datepicker-input {
                        padding-left: 46px;
                    }

                    .datepicker-button {
                        width: 34px;
                        height: 34px;
                        font-size: 16px;
                        left: 6px;
                    }

                    .submit-btn {
                        width: 100%;
                        padding: 12px;
                        font-size: 14px;
                    }
                }

                @media (max-width: 480px) {
                    .profilePage {
                        padding: 0.5rem;
                    }

                    form {
                        padding: 16px;
                        border-radius: 10px;
                        gap: 12px;
                    }

                    h2 {
                        font-size: 18px;
                        margin-bottom: 16px;
                    }

                    h3 {
                        font-size: 14px;
                        margin-top: 10px;
                    }

                    .form-field input,
                    .form-field select,
                    .form-field textarea,
                    .datepicker-input {
                        padding: 8px 10px;
                        font-size: 12px;
                        border-radius: 8px;
                    }

                    .datepicker-input {
                        padding-left: 40px;
                    }

                    .datepicker-button {
                        width: 30px;
                        height: 30px;
                        font-size: 14px;
                        left: 4px;
                        border-radius: 6px;
                    }

                    .date-label {
                        font-size: 12px;
                    }

                    .date-display {
                        font-size: 12px;
                    }

                    textarea {
                        min-height: 80px;
                    }

                    .submit-btn {
                        padding: 10px;
                        font-size: 13px;
                        border-radius: 8px;
                    }
                }

                @media (min-width: 769px) and (max-width: 1024px) {
                    form {
                        max-width: 700px;
                        padding: 30px;
                    }
                }

                @media (min-width: 1025px) {
                    .profilePage {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }

                    form {
                        max-width: 800px;
                    }
                }
            `}</style>
        </div>
    );
}