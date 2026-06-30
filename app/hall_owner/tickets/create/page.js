"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PulseLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";

export default function HallOwnerCreateTicketPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        subject: "",
        description: "",
        priority: "medium"
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.subject || !form.description) {
            const msg = "لطفاً موضوع و توضیحات تیکت را وارد کنید";
            setError(msg);
            toast.error(msg, {
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
            return;
        }

        if (form.subject.length < 5) {
            const msg = "موضوع تیکت باید حداقل ۵ کاراکتر باشد";
            setError(msg);
            toast.error(msg, {
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
            return;
        }

        if (form.description.length < 10) {
            const msg = "توضیحات تیکت باید حداقل ۱۰ کاراکتر باشد";
            setError(msg);
            toast.error(msg, {
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
            return;
        }

        try {
            setLoading(true);

            await axios.post("/api/hall_owner/tickets", {
                subject: form.subject,
                description: form.description,
                priority: form.priority
            });

            toast.success(" تیکت با موفقیت ثبت شد!", {
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
                router.push("/hall_owner/tickets");
            }, 1500);

        } catch (err) {
            const msg = err.response?.data?.message || "خطا در ایجاد تیکت";
            setError(msg);
            toast.error(msg, {
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

    return (
        <div className="create-ticket-page">
            <Toaster />

            {/* هدر صفحه */}
            <div className="header">
                <div className="header-content">
                    <div className="header-icon">
                        <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                    </div>
                    <div>
                        <h2>ایجاد تیکت جدید</h2>
                        <p>تیکت پشتیبانی خود را ثبت کنید، کارشناسان ما در اسرع وقت پاسخگو خواهند بود</p>
                    </div>
                </div>
                <div className="header-line" />
            </div>

            {/* فرم ایجاد تیکت */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="form-container"
            >
                <form onSubmit={handleSubmit} className="form">

                    {/* موضوع تیکت */}
                    <div className="form-group">
                        <label className="form-label">
                            موضوع تیکت
                            <span className="required">*</span>
                        </label>
                        <div className="input-wrapper">
                            <div className="input-icon">
                                <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                name="subject"
                                value={form.subject}
                                onChange={handleChange}
                                placeholder="مثلاً: مشکل در ثبت تالار"
                                className="form-input"
                                required
                                minLength={5}
                                maxLength={100}
                            />
                        </div>
                        <div className="input-hint">
                            <span>حداقل ۵ و حداکثر ۱۰۰ کاراکتر</span>
                            <span>{form.subject.length}/100</span>
                        </div>
                    </div>

                    {/* اولویت */}
                    <div className="form-group">
                        <label className="form-label">سطح اولویت</label>
                        <div className="priority-grid">
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, priority: "low" })}
                                className={`priority-btn ${form.priority === "low" ? "priority-low-active" : "priority-low"}`}
                            >
                                <span>✓</span>
                                <span>کم</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setForm({ ...form, priority: "medium" })}
                                className={`priority-btn ${form.priority === "medium" ? "priority-medium-active" : "priority-medium"}`}
                            >
                                <span>!!</span>
                                <span>متوسط</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setForm({ ...form, priority: "high" })}
                                className={`priority-btn ${form.priority === "high" ? "priority-high-active" : "priority-high"}`}
                            >
                                <span>⚠️</span>
                                <span>زیاد</span>
                            </button>
                        </div>
                        <p className="priority-hint">
                            {form.priority === "high" && "⚠️ تیکت‌های با اولویت بالا سریع‌تر بررسی می‌شوند"}
                            {form.priority === "medium" && "ℹ️ اولویت متوسط برای مشکلات معمولی"}
                            {form.priority === "low" && "✓ اولویت کم برای سوالات و پیشنهادات"}
                        </p>
                    </div>

                    {/* توضیحات */}
                    <div className="form-group">
                        <label className="form-label">
                            توضیحات کامل
                            <span className="required">*</span>
                        </label>
                        <div className="textarea-wrapper">
                            <div className="textarea-icon">
                                <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                className="form-textarea"
                                placeholder="مشکل خود را کامل توضیح دهید..."
                                rows="6"
                                required
                                minLength={10}
                            />
                        </div>
                        <div className="input-hint">
                            <span>حداقل ۱۰ کاراکتر</span>
                            <span>{form.description.length} کاراکتر</span>
                        </div>
                    </div>

                    {/* نمایش خطا */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="error-box"
                        >
                            <span className="error-icon">⚠️</span>
                            <p className="error-text">{error}</p>
                        </motion.div>
                    )}

                    {/* دکمه‌های اقدام */}
                    <div className="form-actions">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-submit"
                        >
                            {loading ? (
                                <>
                                    <PulseLoader color="#ffffff" size={8} margin={4} />
                                    <span>در حال ارسال...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    ثبت تیکت
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="btn-cancel"
                        >
                            <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            بازگشت
                        </button>
                    </div>

                    {/* راهنمای تکمیل تیکت */}
                    <div className="help-box">
                        <div className="help-content">
                            <div className="help-icon-box">
                                <span className="help-icon-text">✓</span>
                            </div>
                            <div className="help-text">
                                <h4 className="help-title">نکات مهم در ثبت تیکت</h4>
                                <ul className="help-list">
                                    <li>• موضوع تیکت را دقیق و مختصر انتخاب کنید</li>
                                    <li>• توضیحات کامل و واضح بنویسید</li>
                                    <li>• در صورت نیاز، تصاویر یا مستندات ضمیمه کنید</li>
                                    <li>• پاسخ تیکت در بخش "همه تیکت‌ها" قابل مشاهده است</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </form>
            </motion.div>

            <style jsx>{`
                .create-ticket-page {
                    direction: rtl;
                    padding: 1rem;
                    max-width: 100%;
                }

                /* هدر */
                .header {
                    margin-bottom: 2rem;
                }

                .header-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 0.5rem;
                }

                .header-icon {
                    padding: 0.5rem;
                    background: linear-gradient(135deg, rgba(212, 176, 106, 0.1), rgba(184, 146, 46, 0.1));
                    border-radius: 0.75rem;
                    flex-shrink: 0;
                }

                .icon {
                    width: 2rem;
                    height: 2rem;
                    color: #D4B06A;
                }

                .header-content h2 {
                    font-size: 1.5rem;
                    font-weight: 900;
                    color: #2C2418;
                }

                .header-content p {
                    color: #6b7280;
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                }

                .header-line {
                    width: 5rem;
                    height: 0.25rem;
                    background: linear-gradient(90deg, #D4B06A, #B8922E);
                    border-radius: 9999px;
                    margin-top: 0.5rem;
                }

                /* فرم */
                .form-container {
                    max-width: 48rem;
                }

                .form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .form-label {
                    font-size: 0.875rem;
                    font-weight: 700;
                    color: #2C2418;
                }

                .required {
                    color: #ef4444;
                    margin-right: 0.25rem;
                }

                .input-wrapper {
                    position: relative;
                }

                .input-icon {
                    position: absolute;
                    top: 50%;
                    right: 0.75rem;
                    transform: translateY(-50%);
                    pointer-events: none;
                }

                .icon-svg {
                    width: 1.25rem;
                    height: 1.25rem;
                    color: #9ca3af;
                    transition: color 0.3s;
                }

                .input-wrapper:focus-within .icon-svg {
                    color: #D4B06A;
                }

                .form-input {
                    width: 100%;
                    padding: 0.75rem 2.5rem 0.75rem 1rem;
                    background: #f9fafb;
                    border: 2px solid #e5e7eb;
                    border-radius: 0.75rem;
                    font-size: 0.875rem;
                    color: #2C2418;
                    transition: all 0.3s;
                    outline: none;
                    font-family: inherit;
                }

                .form-input:focus {
                    border-color: #D4B06A;
                    box-shadow: 0 0 0 3px rgba(212, 176, 106, 0.15);
                    background: white;
                }

                .form-input::placeholder {
                    color: #9ca3af;
                }

                .input-hint {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.75rem;
                    color: #9ca3af;
                    margin-top: 0.25rem;
                }

                /* اولویت */
                .priority-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0.75rem;
                }

                .priority-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1rem;
                    border-radius: 0.75rem;
                    font-weight: 500;
                    font-size: 0.875rem;
                    transition: all 0.3s;
                    border: 2px solid #e5e7eb;
                    background: #f9fafb;
                    color: #6b7280;
                    cursor: pointer;
                }

                .priority-btn:hover {
                    border-color: #d1d5db;
                }

                .priority-low {
                    border-color: #e5e7eb;
                    background: #f9fafb;
                    color: #6b7280;
                }

                .priority-low-active {
                    border-color: #22c55e;
                    background: #f0fdf4;
                    color: #16a34a;
                }

                .priority-medium {
                    border-color: #e5e7eb;
                    background: #f9fafb;
                    color: #6b7280;
                }

                .priority-medium-active {
                    border-color: #eab308;
                    background: #fefce8;
                    color: #ca8a04;
                }

                .priority-high {
                    border-color: #e5e7eb;
                    background: #f9fafb;
                    color: #6b7280;
                }

                .priority-high-active {
                    border-color: #ef4444;
                    background: #fef2f2;
                    color: #dc2626;
                }

                .priority-hint {
                    font-size: 0.75rem;
                    color: #9ca3af;
                    margin-top: 0.5rem;
                }

                /* Textarea */
                .textarea-wrapper {
                    position: relative;
                }

                .textarea-icon {
                    position: absolute;
                    top: 0.75rem;
                    right: 0.75rem;
                    pointer-events: none;
                }

                .textarea-wrapper:focus-within .icon-svg {
                    color: #D4B06A;
                }

                .form-textarea {
                    width: 100%;
                    padding: 0.75rem 2.5rem 0.75rem 1rem;
                    background: #f9fafb;
                    border: 2px solid #e5e7eb;
                    border-radius: 0.75rem;
                    font-size: 0.875rem;
                    color: #2C2418;
                    transition: all 0.3s;
                    outline: none;
                    resize: vertical;
                    min-height: 150px;
                    font-family: inherit;
                }

                .form-textarea:focus {
                    border-color: #D4B06A;
                    box-shadow: 0 0 0 3px rgba(212, 176, 106, 0.15);
                    background: white;
                }

                .form-textarea::placeholder {
                    color: #9ca3af;
                }

                /* خطا */
                .error-box {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem;
                    background: #fef2f2;
                    border: 1px solid #fca5a5;
                    border-radius: 0.75rem;
                }

                .error-icon {
                    color: #ef4444;
                    font-size: 1.25rem;
                }

                .error-text {
                    color: #dc2626;
                    font-size: 0.875rem;
                    font-weight: 500;
                }

                /* دکمه‌ها */
                .form-actions {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding-top: 1rem;
                }

                .btn-submit {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.875rem 2rem;
                    background: linear-gradient(135deg, #D4B06A, #B8922E);
                    color: white;
                    border: none;
                    border-radius: 0.75rem;
                    font-weight: 700;
                    font-size: 1rem;
                    box-shadow: 0 4px 15px rgba(212, 176, 106, 0.3);
                    transition: all 0.3s;
                    cursor: pointer;
                    min-width: 150px;
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

                .btn-icon {
                    width: 1.25rem;
                    height: 1.25rem;
                }

                .btn-cancel {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.875rem 1.5rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 0.75rem;
                    font-weight: 500;
                    font-size: 0.875rem;
                    color: #6b7280;
                    background: transparent;
                    transition: all 0.3s;
                    cursor: pointer;
                }

                .btn-cancel:hover {
                    border-color: #d1d5db;
                    background: #f9fafb;
                }

                /* راهنما */
                .help-box {
                    margin-top: 2rem;
                    padding: 1rem;
                    background: linear-gradient(135deg, #eff6ff, #eef2ff);
                    border-radius: 0.75rem;
                    border: 1px solid #bfdbfe;
                }

                .help-content {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                }

                .help-icon-box {
                    width: 2rem;
                    height: 2rem;
                    background: #bfdbfe;
                    border-radius: 0.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .help-icon-text {
                    color: #2563eb;
                    font-size: 1.25rem;
                    font-weight: 700;
                }

                .help-text {
                    flex: 1;
                }

                .help-title {
                    font-weight: 700;
                    color: #1e40af;
                    font-size: 0.875rem;
                    margin-bottom: 0.25rem;
                }

                .help-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    font-size: 0.75rem;
                    color: #1e40af;
                    space-y: 0.25rem;
                }

                .help-list li {
                    padding: 0.125rem 0;
                }

                /* ریسپانسیو */
                @media (max-width: 768px) {
                    .create-ticket-page {
                        padding: 0.75rem;
                    }

                    .header-content h2 {
                        font-size: 1.25rem;
                    }

                    .priority-grid {
                        grid-template-columns: 1fr 1fr 1fr;
                        gap: 0.5rem;
                    }

                    .priority-btn {
                        padding: 0.5rem 0.75rem;
                        font-size: 0.75rem;
                    }

                    .form-actions {
                        flex-direction: column;
                    }

                    .btn-submit,
                    .btn-cancel {
                        width: 100%;
                    }

                    .btn-submit {
                        min-width: unset;
                    }

                    .help-content {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }

                    .help-list {
                        text-align: right;
                    }
                }

                @media (max-width: 480px) {
                    .create-ticket-page {
                        padding: 0.5rem;
                    }

                    .header-content {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .header-content h2 {
                        font-size: 1.125rem;
                    }

                    .header-content p {
                        font-size: 0.75rem;
                    }

                    .priority-grid {
                        grid-template-columns: 1fr;
                        gap: 0.5rem;
                    }

                    .priority-btn {
                        padding: 0.625rem;
                    }

                    .form-input,
                    .form-textarea {
                        font-size: 0.8rem;
                        padding: 0.625rem 2rem 0.625rem 0.75rem;
                    }

                    .btn-submit,
                    .btn-cancel {
                        padding: 0.75rem;
                        font-size: 0.875rem;
                    }

                    .help-box {
                        padding: 0.75rem;
                    }

                    .help-title {
                        font-size: 0.8rem;
                    }

                    .help-list li {
                        font-size: 0.7rem;
                    }
                }

                @media (min-width: 769px) and (max-width: 1024px) {
                    .form-container {
                        max-width: 40rem;
                    }
                }
            `}</style>
        </div>
    );
}