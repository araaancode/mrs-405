"use client";

import { useState } from "react";
import axios from "axios";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/teal.css";
import toast, { Toaster } from "react-hot-toast";

export default function CreateHallPage() {

    const [form, setForm] = useState({
        title: "",
        province: "",
        city: "",
        address: "",
        lat: "",
        lng: "",
        postal_code: "",
        hall_phone: "",
        hall_owner_name: "",
        hall_owner_phone: "",
        hall_measure: "",
        description: "",
        year: "",
        hall_roles: "",
        capacity: "",
        duration: "",
        entrance_rolls: "",
        hall_type: "",
        host_type: "",
        event_type: "",
        properties: "",
        parking_count: "",
        roof_count: "",
        has_sans: false,
        sans_price: "",
        sans_discount: "",
        licensee_number: "",
        cancel_rolls: "",
        camera_capacities: "",
        reservation_rolls: ""
    });

    const [images, setImages] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [selectedDates, setSelectedDates] = useState([]);
    const [loading, setLoading] = useState(false);

    // تابع تبدیل تاریخ شمسی به میلادی
    const convertToGregorian = (dateObject) => {
        if (!dateObject) return null;
        const gregorianDate = dateObject.toDate();
        return gregorianDate.toISOString().split('T')[0];
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });
    };

    const handleImages = async (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 0) {
            toast.loading("در حال بارگذاری تصاویر...", {
                duration: 2000,
                position: "top-right"
            });
        }

        const base64 = await Promise.all(files.map(convertToBase64));
        setImages(base64);

        if (files.length > 0) {
            toast.success(`${files.length} تصویر با موفقیت بارگذاری شد`, {
                duration: 3000,
                position: "top-right",
                icon: "",
                style: {
                    background: "#fff",
                    color: "#166534",
                    borderRadius: "12px",
                    padding: "12px 20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    border: "1px solid #86EFAC",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
                }
            });
        }
    };

    const handleDocs = async (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 0) {
            toast.loading("در حال بارگذاری مدارک...", {
                duration: 2000,
                position: "top-right"
            });
        }

        const base64 = await Promise.all(files.map(convertToBase64));
        setDocuments(base64);

        if (files.length > 0) {
            toast.success(`${files.length} مدرک با موفقیت بارگذاری شد`, {
                duration: 3000,
                position: "top-right",
                icon: "",
                style: {
                    background: "#fff",
                    color: "#166534",
                    borderRadius: "12px",
                    padding: "12px 20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    border: "1px solid #86EFAC",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
                }
            });
        }
    };

    // اضافه کردن تاریخ
    const addDate = (dateObject) => {
        if (!dateObject) return;

        const gregorianDate = convertToGregorian(dateObject);

        if (!selectedDates.includes(gregorianDate)) {
            setSelectedDates([...selectedDates, gregorianDate]);
            toast.success("تاریخ با موفقیت اضافه شد", {
                duration: 2000,
                position: "top-right",
                icon: "",
                style: {
                    background: "#EFF6FF",
                    color: "#1E40AF",
                    borderRadius: "12px",
                    padding: "12px 20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    border: "1px solid #93C5FD",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
                }
            });
        } else {
            toast.error("این تاریخ قبلاً اضافه شده است", {
                duration: 3000,
                position: "top-right",
                icon: "",
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
    };

    const removeDate = (date) => {
        setSelectedDates(selectedDates.filter(d => d !== date));
        toast("تاریخ حذف شد", {
            duration: 2000,
            position: "top-right",
            icon: "",
            style: {
                background: "#FEF2F2",
                color: "#991B1B",
                borderRadius: "12px",
                padding: "12px 20px",
                fontSize: "14px",
                fontWeight: "500",
                border: "1px solid #FCA5A5",
                boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
            }
        });
    };

    const toArray = (str) => {
        if (!str) return [];
        return str
            .split(",")
            .map(s => s.trim())
            .filter(Boolean);
    };

    const toNumber = (value) => {
        if (value === "" || value === null || value === undefined) return undefined;
        const n = Number(value);
        return isNaN(n) ? undefined : n;
    };

    const validateForm = () => {
        // بررسی توضیحات (حداقل 20 کاراکتر)
        if (!form.description || form.description.trim().length < 20) {
            toast.error("توضیحات باید حداقل ۲۰ کاراکتر باشد", {
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
            return false;
        }

        // بررسی تصاویر
        if (images.length === 0) {
            toast.error("حداقل یک تصویر انتخاب کنید", {
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
            return false;
        }

        // بررسی Latitude
        const lat = parseFloat(form.lat);
        if (isNaN(lat) || lat < -90 || lat > 90) {
            toast.error("Latitude باید بین -90 و 90 باشد", {
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
            return false;
        }

        // بررسی Longitude
        const lng = parseFloat(form.lng);
        if (isNaN(lng) || lng < -180 || lng > 180) {
            toast.error("Longitude باید بین -180 و 180 باشد", {
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
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // اعتبارسنجی
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const payload = {
                ...form,
                lat: parseFloat(form.lat),
                lng: parseFloat(form.lng),
                hall_measure: toNumber(form.hall_measure),
                capacity: toNumber(form.capacity),
                duration: toNumber(form.duration),
                year: toNumber(form.year),
                parking_count: toNumber(form.parking_count),
                roof_count: toNumber(form.roof_count),
                sans_price: toNumber(form.sans_price),
                sans_discount: toNumber(form.sans_discount),
                images,
                hall_document: documents,
                free_dates: selectedDates,
                properties: toArray(form.properties),
                hall_roles: toArray(form.hall_roles),
                entrance_rolls: toArray(form.entrance_rolls),
                cancel_rolls: toArray(form.cancel_rolls),
                camera_capacities: toArray(form.camera_capacities),
                reservation_rolls: toArray(form.reservation_rolls)
            };

            const { data } = await axios.post("/api/hall_owner/halls", payload);

            if (data.success) {
                toast.success(" تالار با موفقیت ثبت شد!", {
                    duration: 5000,
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

                // ریست کردن فرم بعد از ثبت موفق
                setForm({
                    title: "",
                    province: "",
                    city: "",
                    address: "",
                    lat: "",
                    lng: "",
                    postal_code: "",
                    hall_phone: "",
                    hall_owner_name: "",
                    hall_owner_phone: "",
                    hall_measure: "",
                    description: "",
                    year: "",
                    hall_roles: "",
                    capacity: "",
                    duration: "",
                    entrance_rolls: "",
                    hall_type: "",
                    host_type: "",
                    event_type: "",
                    properties: "",
                    parking_count: "",
                    roof_count: "",
                    has_sans: false,
                    sans_price: "",
                    sans_discount: "",
                    licensee_number: "",
                    cancel_rolls: "",
                    camera_capacities: "",
                    reservation_rolls: ""
                });
                setImages([]);
                setDocuments([]);
                setSelectedDates([]);
            }
        } catch (error) {
            console.log(error);
            toast.error("خطا در ثبت تالار. لطفاً مجدداً تلاش کنید.", {
                duration: 4000,
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

    return (
        <div className="createHallPage">
            <Toaster />
            <h2>ایجاد تالار جدید</h2>

            <form onSubmit={handleSubmit}>
                <h3>اطلاعات اصلی تالار</h3>

                <input
                    name="title"
                    placeholder="نام تالار"
                    value={form.title}
                    onChange={handleChange}
                    required
                />

                <input
                    name="province"
                    placeholder="استان"
                    value={form.province}
                    onChange={handleChange}
                    required
                />

                <input
                    name="city"
                    placeholder="شهر"
                    value={form.city}
                    onChange={handleChange}
                    required
                />

                <input
                    name="address"
                    placeholder="آدرس کامل"
                    value={form.address}
                    onChange={handleChange}
                    required
                />

                <div className="row">
                    <input
                        type="number"
                        step="0.000001"
                        name="lat"
                        placeholder="Latitude (عرض جغرافیایی)"
                        value={form.lat}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="number"
                        step="0.000001"
                        name="lng"
                        placeholder="Longitude (طول جغرافیایی)"
                        value={form.lng}
                        onChange={handleChange}
                        required
                    />
                </div>

                <input
                    name="postal_code"
                    placeholder="کدپستی"
                    value={form.postal_code}
                    onChange={handleChange}
                />

                <input
                    type="tel"
                    name="hall_phone"
                    placeholder="تلفن تالار"
                    value={form.hall_phone}
                    onChange={handleChange}
                    required
                />

                <h3>اطلاعات مالک</h3>

                <input
                    name="hall_owner_name"
                    placeholder="نام مالک"
                    value={form.hall_owner_name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="tel"
                    name="hall_owner_phone"
                    placeholder="شماره تماس مالک"
                    value={form.hall_owner_phone}
                    onChange={handleChange}
                    required
                />

                <h3>مشخصات فنی تالار</h3>

                <input
                    type="number"
                    name="hall_measure"
                    placeholder="متراژ تالار (متر مربع)"
                    value={form.hall_measure}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="description"
                    placeholder="توضیحات کامل تالار (حداقل ۲۰ کاراکتر)"
                    value={form.description}
                    onChange={handleChange}
                    required
                    className={form.description && form.description.length < 20 ? "error" : ""}
                />
                {form.description && form.description.length < 20 && (
                    <span className="hint-error">توضیحات باید حداقل ۲۰ کاراکتر باشد</span>
                )}

                <input
                    type="number"
                    name="year"
                    placeholder="سال ساخت"
                    value={form.year}
                    onChange={handleChange}
                    required
                />

                <input
                    name="hall_roles"
                    placeholder="قوانین تالار (با کاما جدا کنید)"
                    value={form.hall_roles}
                    onChange={handleChange}
                />

                <div className="row">
                    <input
                        type="number"
                        name="capacity"
                        placeholder="ظرفیت (نفر)"
                        value={form.capacity}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="number"
                        name="duration"
                        placeholder="مدت سانس (ساعت)"
                        value={form.duration}
                        onChange={handleChange}
                        required
                    />
                </div>

                <input
                    name="entrance_rolls"
                    placeholder="قوانین ورود (با کاما)"
                    value={form.entrance_rolls}
                    onChange={handleChange}
                />

                <div className="row">
                    <input
                        name="hall_type"
                        placeholder="نوع تالار"
                        value={form.hall_type}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="host_type"
                        placeholder="نوع میزبانی"
                        value={form.host_type}
                        onChange={handleChange}
                        required
                    />
                </div>

                <input
                    name="event_type"
                    placeholder="نوع مراسم"
                    value={form.event_type}
                    onChange={handleChange}
                    required
                />

                <input
                    name="properties"
                    placeholder="امکانات تالار (با کاما جدا کنید)"
                    value={form.properties}
                    onChange={handleChange}
                />

                <div className="row">
                    <input
                        type="number"
                        name="parking_count"
                        placeholder="تعداد پارکینگ"
                        value={form.parking_count}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="number"
                        name="roof_count"
                        placeholder="تعداد طبقات"
                        value={form.roof_count}
                        onChange={handleChange}
                        required
                    />
                </div>

                <h3>اطلاعات سانس و قیمت</h3>

                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        name="has_sans"
                        checked={form.has_sans}
                        onChange={handleChange}
                    />
                    دارای سانس
                </label>

                <div className="row">
                    <input
                        type="number"
                        name="sans_price"
                        placeholder="قیمت سانس (تومان)"
                        value={form.sans_price}
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        name="sans_discount"
                        placeholder="تخفیف سانس (درصد)"
                        value={form.sans_discount}
                        onChange={handleChange}
                    />
                </div>

                <input
                    name="licensee_number"
                    placeholder="شماره مجوز"
                    value={form.licensee_number}
                    onChange={handleChange}
                />

                <h3>قوانین و مقررات</h3>

                <input
                    name="cancel_rolls"
                    placeholder="قوانین کنسلی (با کاما)"
                    value={form.cancel_rolls}
                    onChange={handleChange}
                />

                <input
                    name="camera_capacities"
                    placeholder="ظرفیت دوربین (با کاما)"
                    value={form.camera_capacities}
                    onChange={handleChange}
                />

                <input
                    name="reservation_rolls"
                    placeholder="قوانین رزرو (با کاما)"
                    value={form.reservation_rolls}
                    onChange={handleChange}
                />

                <h3>تاریخ‌های آزاد</h3>

                <div className="date-section">
                    <div className="date-input-row">
                        <DatePicker
                            calendar={persian}
                            locale={persian_fa}
                            onChange={addDate}
                            format="YYYY/MM/DD"
                            placeholder="انتخاب تاریخ آزاد"
                            containerClassName="datepicker-wrapper"
                            inputClass="datepicker-input"
                            renderButton={<button className="datepicker-button" type="button">📅</button>}
                        />
                    </div>

                    <div className="date-tags">
                        {selectedDates.map(date => (
                            <div key={date} className="date-tag">
                                <span>{date}</span>
                                <button
                                    type="button"
                                    onClick={() => removeDate(date)}
                                    className="remove-date"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <h3>تصاویر تالار</h3>

                <div className="upload-section">
                    <div className="upload-area">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImages}
                            id="image-upload"
                            className="upload-input"
                        />
                        <label htmlFor="image-upload" className="upload-label">
                            {/* <div className="upload-icon">🖼️</div> */}
                            <div className="upload-text">انتخاب تصاویر</div>
                            <div className="upload-hint">تصاویر با فرمت JPG، PNG، WEBP</div>
                        </label>
                    </div>
                    {images.length > 0 && (
                        <div className="upload-preview">
                            <div className="preview-count">
                                <span className="count-number">{images.length}</span>
                                <span className="count-text">تصویر انتخاب شده</span>
                            </div>
                            <div className="preview-thumbnails">
                                {images.map((img, index) => (
                                    <div key={index} className="thumbnail">
                                        <img src={img} alt={`تصویر ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <h3>مدارک تالار</h3>

                <div className="upload-section">
                    <div className="upload-area">
                        <input
                            type="file"
                            multiple
                            accept=".pdf,image/*"
                            onChange={handleDocs}
                            id="doc-upload"
                            className="upload-input"
                        />
                        <label htmlFor="doc-upload" className="upload-label">
                            {/* <div className="upload-icon">📄</div> */}
                            <div className="upload-text">انتخاب مدارک</div>
                            <div className="upload-hint">مدارک با فرمت PDF، JPG، PNG</div>
                        </label>
                    </div>
                    {documents.length > 0 && (
                        <div className="upload-preview">
                            <div className="preview-count">
                                <span className="count-number">{documents.length}</span>
                                <span className="count-text">مدرک انتخاب شده</span>
                            </div>
                            <div className="preview-docs">
                                {documents.map((doc, index) => (
                                    <div key={index} className="doc-item">
                                        <span className="doc-icon">📎</span>
                                        <span className="doc-name">مدرک {index + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? (
                        <>
                            <span className="spinner"></span>
                            در حال ثبت...
                        </>
                    ) : (
                        "ثبت تالار"
                    )}
                </button>
            </form>

            <style jsx>{`
                .createHallPage {
                    direction: rtl;
                    padding: 1rem;
                    max-width: 100%;
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
                    max-width: 900px;
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

                input,
                select,
                textarea {
                    width: 100%;
                    padding: 12px 14px;
                    border: 1px solid #d1d5db;
                    background: #fafafa;
                    border-radius: 10px;
                    font-size: 14px;
                    box-sizing: border-box;
                    transition: all 0.2s ease;
                }

                input:focus,
                select:focus,
                textarea:focus {
                    outline: none;
                    border-color: #D4B06A;
                    box-shadow: 0 0 0 3px rgba(212, 176, 106, 0.15);
                    background: white;
                }

                textarea {
                    min-height: 100px;
                    resize: vertical;
                }

                textarea.error {
                    border-color: #ef4444;
                }

                textarea.error:focus {
                    border-color: #ef4444;
                    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
                }

                .hint-error {
                    font-size: 12px;
                    color: #ef4444;
                    margin-top: -8px;
                }

                .row {
                    display: flex;
                    gap: 15px;
                }

                .row input {
                    flex: 1;
                }

                .checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 14px;
                    color: #374151;
                    cursor: pointer;
                }

                .checkbox-label input {
                    width: 18px;
                    height: 18px;
                    cursor: pointer;
                }

                /* استایل‌های تاریخ */
                .date-section {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .date-input-row {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }

                .datepicker-wrapper {
                    flex: 1;
                    position: relative;
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

                .date-tags {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                    margin-top: 5px;
                }

                .date-tag {
                    background: #f3f4f6;
                    padding: 8px 12px;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    color: #374151;
                    border: 1px solid #e5e7eb;
                }

                .remove-date {
                    background: #ef4444;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    font-size: 12px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .remove-date:hover {
                    background: #dc2626;
                    transform: scale(1.1);
                }

                /* استایل‌های آپلود */
                .upload-section {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .upload-area {
                    position: relative;
                    border: 2px dashed #d1d5db;
                    border-radius: 12px;
                    background: #fafafa;
                    transition: all 0.3s ease;
                    overflow: hidden;
                }

                .upload-area:hover {
                    border-color: #D4B06A;
                    background: #fcf8f0;
                }

                .upload-input {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    cursor: pointer;
                    z-index: 2;
                }

                .upload-label {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 20px;
                    cursor: pointer;
                    gap: 8px;
                }

                .upload-icon {
                    font-size: 48px;
                    line-height: 1;
                }

                .upload-text {
                    font-size: 16px;
                    font-weight: 600;
                    color: #374151;
                }

                .upload-hint {
                    font-size: 12px;
                    color: #9ca3af;
                }

                .upload-preview {
                    background: #f9fafb;
                    border-radius: 10px;
                    padding: 15px;
                    border: 1px solid #e5e7eb;
                }

                .preview-count {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 12px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid #e5e7eb;
                }

                .count-number {
                    font-size: 20px;
                    font-weight: bold;
                    color: #D4B06A;
                }

                .count-text {
                    font-size: 14px;
                    color: #6b7280;
                }

                .preview-thumbnails {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .thumbnail {
                    width: 80px;
                    height: 80px;
                    border-radius: 8px;
                    overflow: hidden;
                    border: 2px solid #e5e7eb;
                    transition: all 0.2s ease;
                }

                .thumbnail:hover {
                    border-color: #D4B06A;
                    transform: scale(1.05);
                }

                .thumbnail img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .preview-docs {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .doc-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: white;
                    padding: 8px 14px;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                }

                .doc-icon {
                    font-size: 18px;
                }

                .doc-name {
                    font-size: 13px;
                    color: #374151;
                }

                /* دکمه ثبت */
                .submit-btn {
                    margin-top: 20px;
                    width: 200px;
                    padding: 14px;
                    border: none;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #D4B06A 0%, #C39243 50%, #B8860B 100%);
                    color: white;
                    font-size: 16px;
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

                .spinner {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                /* ریسپانسیو */
                @media (max-width: 768px) {
                    .createHallPage {
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

                    .row {
                        flex-direction: column;
                        gap: 14px;
                    }

                    input,
                    select,
                    textarea,
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

                    .upload-label {
                        padding: 30px 15px;
                    }

                    .upload-icon {
                        font-size: 36px;
                    }

                    .upload-text {
                        font-size: 14px;
                    }

                    .thumbnail {
                        width: 60px;
                        height: 60px;
                    }

                    .submit-btn {
                        width: 100%;
                        padding: 12px;
                        font-size: 14px;
                    }
                }

                @media (max-width: 480px) {
                    .createHallPage {
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

                    input,
                    select,
                    textarea,
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

                    .upload-label {
                        padding: 20px 10px;
                    }

                    .upload-icon {
                        font-size: 28px;
                    }

                    .upload-text {
                        font-size: 12px;
                    }

                    .upload-hint {
                        font-size: 10px;
                    }

                    .thumbnail {
                        width: 50px;
                        height: 50px;
                    }

                    .preview-thumbnails {
                        gap: 6px;
                    }

                    .date-tag {
                        font-size: 11px;
                        padding: 6px 10px;
                    }

                    .submit-btn {
                        padding: 10px;
                        font-size: 13px;
                        border-radius: 8px;
                    }
                }

                @media (min-width: 769px) and (max-width: 1024px) {
                    form {
                        max-width: 750px;
                        padding: 30px;
                    }
                }
            `}</style>
        </div>
    );
}