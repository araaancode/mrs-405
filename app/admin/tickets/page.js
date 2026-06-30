"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function AdminTicketsPage() {
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getTickets() {
            try {
                const base = process.env.NEXT_PUBLIC_BASE_URL || "";
                const url = `/api/admin/tickets`;

                const res = await axios.get(url, { withCredentials: true });
                setTickets(res.data.tickets || []);
            } catch (err) {
                setError(err.response?.status || 500);
            } finally {
                setLoading(false);
            }
        }

        getTickets();
    }, []);

    if (loading) return <p className="loading-text">در حال بارگذاری...</p>;
    if (error === 401) return <p className="error-text">لطفاً وارد شوید.</p>;
    if (error === 403) return <p className="error-text">شما دسترسی لازم را ندارید.</p>;
    if (error) return <p className="error-text">خطا در دریافت اطلاعات تیکت‌ها (کد: {error})</p>;

    return (
        <div className="container">
            <h1 className="page-title">لیست تیکت‌ها (ادمین)</h1>

            {tickets.length === 0 && <p className="empty-text">هیچ تیکتی ثبت نشده است.</p>}

            {tickets.map((ticket) => (
                <div key={ticket._id} className="ticket-card">
                    <h2 className="ticket-subject">{ticket.subject}</h2>

                    <div className="ticket-details">
                        <p><strong>توضیحات:</strong> {ticket.description}</p>
                        <p><strong>وضعیت:</strong> <span className={`status-badge status-${ticket.status}`}>{ticket.status}</span></p>
                        <p><strong>اولویت:</strong> <span className={`priority-badge priority-${ticket.priority}`}>{ticket.priority}</span></p>

                        <p>
                            <strong>ایجاد کننده:</strong>
                            {ticket.reporterId?.name || "نامعلوم"} (
                            {ticket.reporterId?.email || "ایمیل نامعلوم"})
                        </p>

                        <p>
                            <strong>مسئول (ادمین):</strong>
                            {ticket.assigneeId?.name || "تعیین نشده"} (
                            {ticket.assigneeId?.email || "ایمیل نامعلوم"})
                        </p>

                        <p><strong>تعداد پیام‌ها:</strong> {ticket.message_count}</p>
                        <p><strong>پاسخ جدید دارد؟</strong> {ticket.has_new_reply ? "بله" : "خیر"}</p>

                        <p><strong>بسته شده توسط کاربر:</strong> {ticket.closed_by_user ? "بله" : "خیر"}</p>
                        <p><strong>بسته شده توسط ادمین:</strong> {ticket.closed_by_admin ? "بله" : "خیر"}</p>
                    </div>

                    {/* بخش پیام‌ها */}
                    {ticket.messages?.length > 0 && (
                        <div className="messages-section">
                            <strong>پیام‌ها:</strong>
                            <ul className="messages-list">
                                {ticket.messages.map((msg, i) => (
                                    <li key={i} className={`message-item ${msg.is_admin_reply ? 'admin-reply' : 'user-message'}`}>
                                        <div className="message-header">
                                            <strong>
                                                {msg.senderId?.name || "ناشناس"}
                                                {" "}(
                                                {msg.senderId?.email || "نامشخص"}
                                                ) -{" "}
                                                {new Date(msg.timestamp).toLocaleString("fa-IR")}
                                            </strong>
                                            <span className="message-type">
                                                {msg.is_admin_reply ? "پاسخ ادمین" : "پیام کاربر"}
                                            </span>
                                        </div>
                                        <p className="message-text">{msg.text}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="ticket-footer">
                        <p>
                            ایجاد شده: {new Date(ticket.createdAt).toLocaleString("fa-IR")}
                            <br />
                            بروزرسانی: {new Date(ticket.updatedAt).toLocaleString("fa-IR")}
                        </p>
                    </div>
                </div>
            ))}

            <style jsx>{`
                /* استایل‌های کلی و رسپانسیو */
                .container {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                    width: 100%;
                }

                .page-title {
                    font-size: 28px;
                    margin-bottom: 30px;
                    text-align: center;
                }

                .ticket-card {
                    background: #f9f9f9;
                    padding: 20px;
                    margin-bottom: 20px;
                    border-radius: 10px;
                    border: 1px solid #ddd;
                    transition: all 0.3s ease;
                }

                .ticket-card:hover {
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }

                .ticket-subject {
                    font-size: 22px;
                    margin-bottom: 15px;
                    color: #333;
                }

                .ticket-details {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px 20px;
                }

                .ticket-details p {
                    margin: 5px 0;
                    line-height: 1.6;
                }

                .ticket-details p:last-child {
                    grid-column: 1 / -1;
                }

                .status-badge, .priority-badge {
                    display: inline-block;
                    padding: 2px 10px;
                    border-radius: 15px;
                    font-size: 0.9em;
                    font-weight: bold;
                }

                .status-open { background: #4CAF50; color: white; }
                .status-in-progress { background: #FF9800; color: white; }
                .status-closed { background: #f44336; color: white; }
                .status-pending { background: #2196F3; color: white; }

                .priority-low { background: #8BC34A; color: white; }
                .priority-medium { background: #FFC107; color: white; }
                .priority-high { background: #FF5722; color: white; }
                .priority-critical { background: #D32F2F; color: white; }

                .messages-section {
                    margin-top: 15px;
                    padding-top: 15px;
                    border-top: 1px solid #eee;
                }

                .messages-list {
                    list-style: none;
                    padding: 0;
                    margin-top: 8px;
                }

                .message-item {
                    padding: 12px;
                    margin-bottom: 10px;
                    border-radius: 8px;
                    background: #fff;
                    border-right: 4px solid #ddd;
                }

                .message-item.admin-reply {
                    border-right-color: #2196F3;
                    background: #f0f7ff;
                }

                .message-item.user-message {
                    border-right-color: #4CAF50;
                    background: #f0fff4;
                }

                .message-header {
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    margin-bottom: 5px;
                    font-size: 0.95em;
                }

                .message-type {
                    font-size: 0.85em;
                    color: #666;
                    font-style: italic;
                }

                .message-text {
                    margin: 5px 0 0 0;
                    line-height: 1.5;
                }

                .ticket-footer {
                    margin-top: 15px;
                    padding-top: 10px;
                    border-top: 1px solid #eee;
                    font-size: 12px;
                    opacity: 0.7;
                }

                .loading-text, .error-text, .empty-text {
                    text-align: center;
                    padding: 40px 20px;
                    font-size: 18px;
                }

                .error-text {
                    color: #f44336;
                }

                /* استایل‌های رسپانسیو */
                @media (max-width: 768px) {
                    .container {
                        padding: 10px;
                    }

                    .page-title {
                        font-size: 24px;
                        margin-bottom: 20px;
                    }

                    .ticket-card {
                        padding: 15px;
                    }

                    .ticket-subject {
                        font-size: 20px;
                    }

                    .ticket-details {
                        grid-template-columns: 1fr;
                        gap: 5px;
                    }

                    .message-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .message-type {
                        margin-top: 3px;
                    }

                    .message-item {
                        padding: 10px;
                    }
                }

                @media (max-width: 480px) {
                    .container {
                        padding: 5px;
                    }

                    .page-title {
                        font-size: 20px;
                    }

                    .ticket-card {
                        padding: 12px;
                        border-radius: 8px;
                    }

                    .ticket-subject {
                        font-size: 18px;
                    }

                    .ticket-details p {
                        font-size: 14px;
                    }

                    .status-badge, .priority-badge {
                        font-size: 0.8em;
                        padding: 1px 8px;
                    }

                    .message-header {
                        font-size: 0.9em;
                    }

                    .message-text {
                        font-size: 14px;
                    }
                }

                @media (min-width: 769px) and (max-width: 1024px) {
                    .ticket-details {
                        grid-template-columns: 1fr 1fr;
                    }
                }

                /* پشتیبانی از حالت تاریک و نمایشگرهای بزرگتر */
                @media (min-width: 1200px) {
                    .container {
                        padding: 30px 40px;
                    }

                    .ticket-card {
                        padding: 30px;
                    }

                    .ticket-details {
                        grid-template-columns: 1fr 1fr 1fr;
                    }
                }

                /* استایل برای چاپ */
                @media print {
                    .ticket-card {
                        break-inside: avoid;
                        border: 1px solid #000;
                    }
                }
            `}</style>
        </div>
    );
}