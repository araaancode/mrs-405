"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/teal.css";
import { PulseLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";

export default function EditHallPage() {

    const { id } = useParams();
    const router = useRouter();

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

    const [selectedDates, setSelectedDates] = useState([]);
    const [images, setImages] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // تابع تبدیل تاریخ میلادی به شمسی برای نمایش
    const convertToPersian = (gregorianDate) => {
        if (!gregorianDate) return null;
        return gregorianDate;
    };

    // تابع تبدیل تاریخ شمسی به میلادی
    const convertToGregorian = (dateObject) => {
        if (!dateObject) return null;
        const gregorianDate = dateObject.toDate();
        return gregorianDate.toISOString().split('T')[0];
    };

    useEffect(() => {
        getHall();
    }, []);

    const getHall = async () => {
        try {
            const res = await axios.get(`/api/hall_owner/halls/${id}`);
            const hall = res.data.hall;

            setForm({
                title: hall.title || "",
                province: hall.province || "",
                city: hall.city || "",
                address: hall.address || "",
                lat: hall.lat || "",
                lng: hall.lng || "",
                postal_code: hall.postal_code || "",
                hall_phone: hall.hall_phone || "",
                hall_owner_name: hall.hall_owner_name || "",
                hall_owner_phone: hall.hall_owner_phone || "",
                hall_measure: hall.hall_measure || "",
                description: hall.description || "",
                year: hall.year || "",
                hall_roles: hall.hall_roles?.join(",") || "",
                capacity: hall.capacity || "",
                duration: hall.duration || "",
                entrance_rolls: hall.entrance_rolls?.join(",") || "",
                hall_type: hall.hall_type || "",
                host_type: hall.host_type || "",
                event_type: hall.event_type || "",
                properties: hall.properties?.join(",") || "",
                parking_count: hall.parking_count || "",
                roof_count: hall.roof_count || "",
                has_sans: hall.has_sans || false,
                sans_price: hall.sans_price || "",
                sans_discount: hall.sans_discount || "",
                licensee_number: hall.licensee_number || "",
                cancel_rolls: hall.cancel_rolls?.join(",") || "",
                camera_capacities: hall.camera_capacities?.join(",") || "",
                reservation_rolls: hall.reservation_rolls?.join(",") || ""
            });

            // تنظیم تاریخ‌های آزاد
            if (hall.free_dates && hall.free_dates.length > 0) {
                setSelectedDates(hall.free_dates.map(d => d.slice(0, 10)));
            }

            // تنظیم تصاویر و مدارک
            if (hall.images && hall.images.length > 0) {
                setImages(hall.images);
            }

            if (hall.hall_document && hall.hall_document.length > 0) {
                setDocuments(hall.hall_document);
            }

            // toast.success("اطلاعات تالار با موفقیت بارگذاری شد", {
            //     duration: 2000,
            //     position: "top-right",
            //     icon: "",
            //     style: {
            //         background: "#fff",
            //         color: "#166534",
            //         borderRadius: "12px",
            //         padding: "12px 20px",
            //         fontSize: "14px",
            //         fontWeight: "600",
            //         border: "1px solid #86EFAC",
            //         boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
            //     }
            // });

        } catch (error) {
            console.error("خطا در دریافت اطلاعات:", error);
            toast.error("خطا در دریافت اطلاعات تالار", {
                duration: 3000,
                position: "top-right",
                icon: "❌",
                style: {
                    background: "#fff",
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    // اضافه کردن تاریخ جدید
    const addDate = (dateObject) => {
        if (!dateObject) return;

        const gregorianDate = convertToGregorian(dateObject);

        if (gregorianDate && !selectedDates.includes(gregorianDate)) {
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
        } else if (gregorianDate) {
            toast.error("این تاریخ قبلاً اضافه شده است", {
                duration: 3000,
                position: "top-right",
                icon: "",
                style: {
                    background: "#fff",
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

    // حذف تاریخ
    const removeDate = (date) => {
        setSelectedDates(selectedDates.filter(d => d !== date));
        toast("تاریخ حذف شد", {
            duration: 2000,
            position: "top-right",
            icon: "",
            style: {
                background: "#fff",
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

    const convertToBase64 = async (file) => {
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
        setImages([...images, ...base64]);

        if (files.length > 0) {
            toast.success(`${files.length} تصویر با موفقیت اضافه شد`, {
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
        setDocuments([...documents, ...base64]);

        if (files.length > 0) {
            toast.success(`${files.length} مدرک با موفقیت اضافه شد`, {
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

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
        toast("تصویر حذف شد", {
            duration: 2000,
            position: "top-right",
            icon: "",
            style: {
                background: "#fff",
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

    const removeDocument = (index) => {
        setDocuments(documents.filter((_, i) => i !== index));
        toast("مدرک حذف شد", {
            duration: 2000,
            position: "top-right",
            icon: "🗑️",
            style: {
                background: "#fff",
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

    const validateForm = () => {
        // بررسی توضیحات (حداقل 20 کاراکتر)
        if (!form.description || form.description.trim().length < 20) {
            toast.error("توضیحات باید حداقل ۲۰ کاراکتر باشد", {
                duration: 3000,
                position: "top-right",
                icon: "❌",
                style: {
                    background: "#fff",
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
                    background: "#fff",
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
                    background: "#fff",
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

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);

        try {
            await axios.put(`/api/hall_owner/halls/${id}`, {
                ...form,
                hall_roles: form.hall_roles.split(",").map(s => s.trim()).filter(Boolean),
                entrance_rolls: form.entrance_rolls.split(",").map(s => s.trim()).filter(Boolean),
                properties: form.properties.split(",").map(s => s.trim()).filter(Boolean),
                cancel_rolls: form.cancel_rolls.split(",").map(s => s.trim()).filter(Boolean),
                camera_capacities: form.camera_capacities.split(",").map(s => s.trim()).filter(Boolean),
                reservation_rolls: form.reservation_rolls.split(",").map(s => s.trim()).filter(Boolean),
                images: images,
                hall_document: documents,
                free_dates: selectedDates,
                lat: parseFloat(form.lat),
                lng: parseFloat(form.lng),
                hall_measure: form.hall_measure ? Number(form.hall_measure) : undefined,
                capacity: form.capacity ? Number(form.capacity) : undefined,
                duration: form.duration ? Number(form.duration) : undefined,
                year: form.year ? Number(form.year) : undefined,
                parking_count: form.parking_count ? Number(form.parking_count) : undefined,
                roof_count: form.roof_count ? Number(form.roof_count) : undefined,
                sans_price: form.sans_price ? Number(form.sans_price) : undefined,
                sans_discount: form.sans_discount ? Number(form.sans_discount) : undefined
            });

            toast.success(" تالار با موفقیت بروزرسانی شد!", {
                duration: 4000,
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

            setTimeout(() => {
                router.push(`/hall_owner/halls`);
            }, 1500);

        } catch (error) {
            console.error("خطا در بروزرسانی:", error);
            toast.error("خطا در بروزرسانی تالار", {
                duration: 3000,
                position: "top-right",
                icon: "❌",
                style: {
                    background: "#fff",
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
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <PulseLoader color="#D4B06A" size={15} margin={6} />
                <p>در حال بارگذاری اطلاعات تالار...</p>
            </div>
        );
    }

    return (
        <div className="editHallPage">
            <Toaster />
            <h2>ویرایش تالار</h2>

            <form onSubmit={handleSubmit}>
                <h3>اطلاعات اصلی تالار</h3>

                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="نام تالار"
                />

                <div className="row">
                    <input
                        name="province"
                        value={form.province}
                        onChange={handleChange}
                        placeholder="استان"
                    />

                    <input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="شهر"
                    />
                </div>

                <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="آدرس کامل"
                />

                <div className="row">
                    <input
                        name="lat"
                        value={form.lat}
                        onChange={handleChange}
                        placeholder="Latitude (عرض جغرافیایی)"
                        type="number"
                        step="0.000001"
                    />

                    <input
                        name="lng"
                        value={form.lng}
                        onChange={handleChange}
                        placeholder="Longitude (طول جغرافیایی)"
                        type="number"
                        step="0.000001"
                    />
                </div>

                <input
                    name="postal_code"
                    value={form.postal_code}
                    onChange={handleChange}
                    placeholder="کدپستی"
                />

                <input
                    name="hall_phone"
                    value={form.hall_phone}
                    onChange={handleChange}
                    placeholder="تلفن تالار"
                    type="tel"
                />

                <h3>اطلاعات مالک</h3>

                <div className="row">
                    <input
                        name="hall_owner_name"
                        value={form.hall_owner_name}
                        onChange={handleChange}
                        placeholder="نام مالک"
                    />

                    <input
                        name="hall_owner_phone"
                        value={form.hall_owner_phone}
                        onChange={handleChange}
                        placeholder="شماره تماس مالک"
                        type="tel"
                    />
                </div>

                <h3>مشخصات فنی تالار</h3>

                <div className="row">
                    <input
                        name="hall_measure"
                        value={form.hall_measure}
                        onChange={handleChange}
                        placeholder="متراژ تالار (متر مربع)"
                        type="number"
                    />

                    <input
                        name="year"
                        value={form.year}
                        onChange={handleChange}
                        placeholder="سال ساخت"
                        type="number"
                    />
                </div>

                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="توضیحات کامل تالار (حداقل ۲۰ کاراکتر)"
                    className={form.description && form.description.length < 20 ? "error" : ""}
                />
                {form.description && form.description.length < 20 && (
                    <span className="hint-error">توضیحات باید حداقل ۲۰ کاراکتر باشد</span>
                )}

                <input
                    name="hall_roles"
                    value={form.hall_roles}
                    onChange={handleChange}
                    placeholder="قوانین تالار (با کاما جدا کنید)"
                />

                <div className="row">
                    <input
                        name="capacity"
                        value={form.capacity}
                        onChange={handleChange}
                        placeholder="ظرفیت (نفر)"
                        type="number"
                    />

                    <input
                        name="duration"
                        value={form.duration}
                        onChange={handleChange}
                        placeholder="مدت سانس (ساعت)"
                        type="number"
                    />
                </div>

                <input
                    name="entrance_rolls"
                    value={form.entrance_rolls}
                    onChange={handleChange}
                    placeholder="قوانین ورود (با کاما)"
                />

                <div className="row">
                    <input
                        name="hall_type"
                        value={form.hall_type}
                        onChange={handleChange}
                        placeholder="نوع تالار"
                    />

                    <input
                        name="host_type"
                        value={form.host_type}
                        onChange={handleChange}
                        placeholder="نوع میزبانی"
                    />
                </div>

                <input
                    name="event_type"
                    value={form.event_type}
                    onChange={handleChange}
                    placeholder="نوع مراسم"
                />

                <input
                    name="properties"
                    value={form.properties}
                    onChange={handleChange}
                    placeholder="امکانات تالار (با کاما جدا کنید)"
                />

                <div className="row">
                    <input
                        name="parking_count"
                        value={form.parking_count}
                        onChange={handleChange}
                        placeholder="تعداد پارکینگ"
                        type="number"
                    />

                    <input
                        name="roof_count"
                        value={form.roof_count}
                        onChange={handleChange}
                        placeholder="تعداد طبقات"
                        type="number"
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
                        name="sans_price"
                        value={form.sans_price}
                        onChange={handleChange}
                        placeholder="قیمت سانس (تومان)"
                        type="number"
                    />

                    <input
                        name="sans_discount"
                        value={form.sans_discount}
                        onChange={handleChange}
                        placeholder="تخفیف سانس (درصد)"
                        type="number"
                    />
                </div>

                <input
                    name="licensee_number"
                    value={form.licensee_number}
                    onChange={handleChange}
                    placeholder="شماره مجوز"
                />

                <h3>قوانین و مقررات</h3>

                <input
                    name="cancel_rolls"
                    value={form.cancel_rolls}
                    onChange={handleChange}
                    placeholder="قوانین کنسلی (با کاما)"
                />

                <input
                    name="camera_capacities"
                    value={form.camera_capacities}
                    onChange={handleChange}
                    placeholder="ظرفیت دوربین (با کاما)"
                />

                <input
                    name="reservation_rolls"
                    value={form.reservation_rolls}
                    onChange={handleChange}
                    placeholder="قوانین رزرو (با کاما)"
                />

                <h3>تاریخ‌های آزاد</h3>

                <div className="date-section">
                    <div className="date-input-row">
                        <DatePicker
                            calendar={persian}
                            locale={persian_fa}
                            onChange={addDate}
                            format="YYYY/MM/DD"
                            placeholder="انتخاب تاریخ آزاد جدید"
                            containerClassName="datepicker-wrapper"
                            inputClass="datepicker-input"
                            renderButton={<button className="datepicker-button" type="button">📅</button>}
                        />
                    </div>

                    <div className="date-tags">
                        {selectedDates.map((date, index) => (
                            <div key={index} className="date-tag">
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
                            <div className="upload-text">افزودن تصاویر جدید</div>
                            <div className="upload-hint">تصاویر با فرمت JPG، PNG، WEBP</div>
                        </label>
                    </div>

                    {images.length > 0 && (
                        <div className="upload-preview">
                            <div className="preview-count">
                                <span className="count-number">{images.length}</span>
                                <span className="count-text">تصویر موجود</span>
                            </div>
                            <div className="preview-thumbnails">
                                {images.map((img, index) => (
                                    <div key={index} className="thumbnail-wrapper">
                                        <img
                                            src={img}
                                            alt={`تصویر ${index + 1}`}
                                            className="thumbnail"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="remove-btn"
                                        >
                                            ×
                                        </button>
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
                            <div className="upload-text">افزودن مدارک جدید</div>
                            <div className="upload-hint">مدارک با فرمت PDF، JPG، PNG</div>
                        </label>
                    </div>

                    {documents.length > 0 && (
                        <div className="upload-preview">
                            <div className="preview-count">
                                <span className="count-number">{documents.length}</span>
                                <span className="count-text">مدرک موجود</span>
                            </div>
                            <div className="preview-docs">
                                {documents.map((_, index) => (
                                    <div key={index} className="doc-item">
                                        <span className="doc-icon">📎</span>
                                        <span className="doc-name">مدرک {index + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeDocument(index)}
                                            className="remove-doc"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={() => router.push("/hall_owner/halls")}
                        className="btn-cancel"
                    >
                        انصراف
                    </button>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-submit"
                    >
                        {submitting ? (
                            <>
                                <PulseLoader color="#ffffff" size={8} margin={4} />
                                <span>در حال ذخیره...</span>
                            </>
                        ) : (
                            "ذخیره تغییرات"
                        )}
                    </button>
                </div>
            </form>

            <style jsx>{`
                .editHallPage {
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
                    padding: 30px 20px;
                    cursor: pointer;
                    gap: 8px;
                }

                .upload-icon {
                    font-size: 40px;
                    line-height: 1;
                }

                .upload-text {
                    font-size: 15px;
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

                .thumbnail-wrapper {
                    position: relative;
                    display: inline-block;
                }

                .thumbnail {
                    width: 80px;
                    height: 80px;
                    border-radius: 8px;
                    object-fit: cover;
                    border: 2px solid #e5e7eb;
                    transition: all 0.2s ease;
                }

                .thumbnail:hover {
                    border-color: #D4B06A;
                    transform: scale(1.05);
                }

                .remove-btn {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #ef4444;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 22px;
                    height: 22px;
                    font-size: 14px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .remove-btn:hover {
                    background: #dc2626;
                    transform: scale(1.1);
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

                .remove-doc {
                    background: #ef4444;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    font-size: 12px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .remove-doc:hover {
                    background: #dc2626;
                    transform: scale(1.1);
                }

                /* دکمه‌ها */
                .form-actions {
                    display: flex;
                    gap: 15px;
                    margin-top: 10px;
                }

                .btn-cancel {
                    flex: 1;
                    padding: 14px;
                    border: 1px solid #d1d5db;
                    border-radius: 10px;
                    background: white;
                    color: #4b5563;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .btn-cancel:hover {
                    background: #f9fafb;
                    border-color: #9ca3af;
                }

                .btn-submit {
                    flex: 1;
                    padding: 14px;
                    border: none;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #D4B06A 0%, #C39243 50%, #B8860B 100%);
                    color: white;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(212, 176, 106, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }

                .btn-submit:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 25px rgba(212, 176, 106, 0.4);
                }

                .btn-submit:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }

                /* ریسپانسیو */
                @media (max-width: 768px) {
                    .editHallPage {
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
                        padding: 25px 15px;
                    }

                    .upload-icon {
                        font-size: 32px;
                    }

                    .thumbnail {
                        width: 60px;
                        height: 60px;
                    }

                    .form-actions {
                        flex-direction: column;
                    }

                    .btn-cancel,
                    .btn-submit {
                        padding: 12px;
                        font-size: 14px;
                    }
                }

                @media (max-width: 480px) {
                    .editHallPage {
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

                    .date-tag {
                        font-size: 11px;
                        padding: 6px 10px;
                    }

                    .btn-cancel,
                    .btn-submit {
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