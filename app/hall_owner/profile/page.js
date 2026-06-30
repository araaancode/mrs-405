"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/teal.css";
import toast from "react-hot-toast";


export default function UserProfilePage() {
    const { data: session } = useSession();
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(false);
    const [dateValue, setDateValue] = useState(null);

    const datePickerRef = useRef(null);

    useEffect(() => {
        if (session?.user) {
            // دریافت اطلاعات پروفایل با axios
            axios.get("/api/hall_owner/profile")
                .then(response => {
                    const userData = response.data.user || response.data;
                    setForm(userData);

                    // تنظیم تاریخ برای DatePicker
                    if (userData.birth_date) {
                        const dateParts = userData.birth_date.split('T')[0].split('-');
                        const persianDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                        setDateValue(persianDate);
                    }
                })
                .catch(err => {
                    console.error("خطا در دریافت اطلاعات:", err);
                    setForm(session.user);
                });
        }
    }, [session]);

    const changeHandler = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleDateChange = (date) => {

        if (date) {

            const gregorianDate = date.toDate();
            const today = new Date();

            let age = today.getFullYear() - gregorianDate.getFullYear();
            const m = today.getMonth() - gregorianDate.getMonth();

            if (m < 0 || (m === 0 && today.getDate() < gregorianDate.getDate())) {
                age--;
            }

            if (age < 18) {
                toast.error("سن باید حداقل 18 سال باشد");
                setDateValue(null);
                return;
            }

            if (age > 100) {
                toast.error("سن نمی‌تواند بیشتر از 100 سال باشد");
                setDateValue(null);
                return;
            }

            const year = gregorianDate.getFullYear();
            const month = String(gregorianDate.getMonth() + 1).padStart(2, '0');
            const day = String(gregorianDate.getDate()).padStart(2, '0');

            const formattedDate = `${year}-${month}-${day}`;

            setForm({
                ...form,
                birth_date: formattedDate
            });

            setDateValue(date);

        } else {

            setForm({
                ...form,
                birth_date: ""
            });

            setDateValue(null);
        }
    };


    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.put("/api/hall_owner/profile", form);

            if (response.status === 200) {
                toast.success("پروفایل با موفقیت بروزرسانی شد");

            } else {
                alert("خطا در بروزرسانی");
            }
        } catch (error) {
            console.error("خطا در بروزرسانی:", error);
            toast.error(error.response?.data?.message || "خطا در ارتباط با سرور");

        } finally {
            setLoading(false);
        }
    };

    if (!session) {
        return <p>در حال بارگذاری...</p>;
    }

    return (
        <div className="profilePage">

            <h2>ویرایش پروفایل کاربر</h2>

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
                            ref={datePickerRef}
                            calendar={persian}
                            locale={persian_fa}
                            value={dateValue}
                            onChange={handleDateChange}
                            placeholder="انتخاب تاریخ تولد"
                            format="YYYY/MM/DD"
                            containerClassName="datepicker-wrapper"
                            inputClass="datepicker-input"
                        // renderButton={<button className="datepicker-button" type="button">📅</button>}
                        />

                        <button
                            type="button"
                            className="datepicker-button"
                            onClick={() => datePickerRef.current?.openCalendar()}
                        >
                            انتخاب تاریخ تولد
                        </button>


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

                <button className="submit-btn" disabled={loading}>
                    {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
                </button>

            </form>

            <style jsx>{`
                
.profilePage{
    direction:rtl;
    padding: 1rem;
    max-width: 100%;
   
}

h2{
    margin-bottom:30px;
    font-size:22px;
    font-weight:bold;
}

form{
    background:white;
    border:1px solid #e5e7eb;
    border-radius:16px;
    padding:35px;
    max-width:800px;
    display:flex;
    flex-direction:column;
    gap:18px;
    width: 100%;
}

h3{
    margin-top:15px;
    font-size:16px;
    font-weight:600;
    color:#374151;
}

.form-field{
    width: 100%;
}

.form-field input,
.form-field select,
.form-field textarea{
    width:100%;
    padding:12px 14px;
    border:1px solid #d1d5db;
    background:#fafafa;
    border-radius:10px;
    font-size:14px;
    box-sizing: border-box;
}

textarea{
    min-height:120px;
    resize: vertical;
}

/* دکمه ذخیره */
.submit-btn{
    margin-top:10px;
    width:180px;
    padding:12px;
    border:none;
    border-radius:10px;
    background: linear-gradient(135deg, #D4B06A 0%, #C39243 50%, #B8860B 100%);
    color:white;
    font-size:15px;
    font-weight:600;
    cursor:pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(212, 176, 106, 0.3);
}

.submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(212, 176, 106, 0.4);
}

.submit-btn:active:not(:disabled) {
    transform: translateY(0);
}

.submit-btn:disabled{
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
}

/* فیلد تاریخ */
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

/* input تاریخ */
.datepicker-input {
    width: 100%;
    padding: 12px 170px 12px 14px;
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

/* دکمه انتخاب تاریخ */
.datepicker-button {
    position: absolute;
    left: 6px;
    top: 50%;
    transform: translateY(-50%);
    height: 36px;
    padding: 0 14px;
    border: none;
    background: linear-gradient(135deg, #D4B06A 0%, #C39243 50%, #B8860B 100%);
    font-size: 13px;
    cursor: pointer;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    white-space: nowrap;
    font-weight: 500;
    box-shadow: 0 2px 10px rgba(212, 176, 106, 0.25);
    transition: all 0.25s ease;
}

.datepicker-button:hover {
    transform: translateY(-50%) scale(1.03);
    box-shadow: 0 4px 15px rgba(212, 176, 106, 0.35);
}

.datepicker-button:active {
    transform: translateY(-50%) scale(0.97);
}

.date-display {
    font-size: 13px;
    color: #6b7280;
    margin-top: 4px;
    padding-right: 4px;
}

/* ریسپانسیو */
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
        padding: 10px 150px 10px 12px;
    }

    .datepicker-button {
        height: 32px;
        font-size: 12px;
        padding: 0 10px;
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
        padding: 8px 130px 8px 10px;
    }

    .datepicker-button {
        height: 30px;
        font-size: 11px;
        padding: 0 8px;
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
