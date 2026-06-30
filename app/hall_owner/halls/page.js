"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { PiPencilSimple, PiTrash, PiMapPin, PiUsers, PiRuler, PiBuilding } from "react-icons/pi";
import { PulseLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";

export default function HallsPage() {
    const [halls, setHalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const getHalls = async () => {
        try {
            const { data } = await axios.get("/api/hall_owner/halls");
            if (data.success) {
                setHalls(data.halls);
                // if (data.halls.length > 0) {
                //     toast.success(`${data.halls.length} تالار با موفقیت بارگذاری شد`, {
                //         duration: 2000,
                //         position: "top-right",
                //         icon: "",
                //         style: {
                //             background: "#fff",
                //             color: "#166534",
                //             borderRadius: "12px",
                //             padding: "12px 20px",
                //             fontSize: "14px",
                //             fontWeight: "600",
                //             border: "1px solid #86EFAC",
                //             boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
                //         }
                //     });
                // }
            }
        } catch (error) {
            console.log(error);
            toast.error("خطا در دریافت تالارها", {
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
        setLoading(false);
    };

    useEffect(() => {
        getHalls();
    }, []);

    const deleteHall = async (id) => {
        const confirmDelete = window.confirm("آیا از حذف این تالار اطمینان دارید؟");
        if (!confirmDelete) return;

        setDeletingId(id);

        try {
            let response = await axios.delete(`/api/hall_owner/halls/${id}`);
            if (response.status === 200) {
                toast.success("تالار با موفقیت حذف شد", {
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
                setHalls(halls.filter(hall => hall._id !== id));
            }
        } catch (error) {
            console.log(error);
            toast.error("خطا در حذف تالار", {
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
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <PulseLoader color="#D4B06A" size={15} margin={6} />
                <p>در حال دریافت تالارها...</p>
            </div>
        );
    }

    return (
        <div className="hallsPage">
            <Toaster />

            <div className="header">
                <h2>لیست تالارها</h2>

                {halls.length > 0 && (
                    <span className="badge">
                        {halls.length} تالار
                    </span>
                )}
            </div>

            {halls.length === 0 ? (
                <div className="empty-state">
                    <PiBuilding className="empty-icon" />
                    <p className="empty-title">هیچ تالاری یافت نشد</p>
                    <p className="empty-description">برای شروع، یک تالار جدید ایجاد کنید</p>
                </div>
            ) : (
                <div className="halls-grid">
                    {halls.map((hall) => (
                        <div key={hall._id} className="hall-card">
                            {hall.images?.length > 0 && (
                                <div className="image-container">
                                    <img
                                        src={hall.images[0]}
                                        alt={hall.title}
                                        className="hall-image"
                                    />
                                    {hall.has_sans && (
                                        <span className="sans-badge">
                                            دارای سانس
                                        </span>
                                    )}
                                </div>
                            )}

                            <div className="hall-content">
                                <h3 className="hall-title">{hall.title}</h3>

                                <div className="hall-location">
                                    <PiMapPin className="icon" />
                                    <span>{hall.city} - {hall.province}</span>
                                </div>

                                <div className="hall-stats">
                                    <div className="stat-item">
                                        <PiUsers className="icon" />
                                        <span>{hall.capacity || 0} نفر</span>
                                    </div>
                                    <div className="stat-item">
                                        <PiRuler className="icon" />
                                        <span>{hall.hall_measure || 0} متر</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <Link
                                        href={`/hall_owner/halls/update_hall/${hall._id}`}
                                        className="flex-1 flex items-center justify-center gap-2 border py-2 rounded-md"
                                    >
                                        <PiPencilSimple className="text-lg" />
                                        ویرایش
                                    </Link>

                                    <button
                                        onClick={() => deleteHall(hall._id)}
                                        disabled={deletingId === hall._id}
                                        className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-md disabled:opacity-60"
                                    >
                                        {deletingId === hall._id ? (
                                            <>
                                                <PulseLoader color="#ffffff" size={6} margin={3} />
                                                <span>در حال حذف...</span>
                                            </>
                                        ) : (
                                            <>
                                                <PiTrash className="text-lg" />
                                                حذف
                                            </>
                                        )}
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
                .hallsPage {
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

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    flex-wrap: wrap;
                    gap: 12px;
                }

                .header h2 {
                    font-size: 22px;
                    font-weight: bold;
                    color: #1f2937;
                }

                .badge {
                    background: #f3f4f6;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 14px;
                    color: #4b5563;
                }

                .empty-state {
                    text-align: center;
                    padding: 60px 20px;
                    background: #f9fafb;
                    border-radius: 16px;
                    border: 1px solid #e5e7eb;
                }

                .empty-icon {
                    font-size: 48px;
                    color: #d1d5db;
                    margin-bottom: 16px;
                    display: block;
                    margin-left: auto;
                    margin-right: auto;
                }

                .empty-title {
                    font-size: 16px;
                    color: #6b7280;
                    margin-bottom: 8px;
                }

                .empty-description {
                    font-size: 14px;
                    color: #9ca3af;
                }

                .halls-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 24px;
                    margin-top: 0px;
                }

                .hall-card {
                    background: white;
                    border-radius: 20px;
                    overflow: hidden;
                    border: 1px solid #f0f0f0;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .hall-card:hover {
                    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                    transform: translateY(-4px);
                }

                .image-container {
                    position: relative;
                    height: 200px;
                    overflow: hidden;
                }

                .hall-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }

                .hall-card:hover .hall-image {
                    transform: scale(1.05);
                }

                .sans-badge {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    background: linear-gradient(135deg, #D4B06A, #B8922E);
                    color: white;
                    font-size: 12px;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-weight: bold;
                }

                .hall-content {
                    padding: 18px;
                }

                .hall-title {
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 12px;
                    color: #1f2937;
                }

                .hall-location {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                    font-size: 13px;
                    color: #6b7280;
                }

                .hall-stats {
                    display: flex;
                    gap: 16px;
                    margin-top: 12px;
                    padding-top: 12px;
                    border-top: 1px solid #f0f0f0;
                }

                .stat-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 13px;
                    color: #4b5563;
                }

                .icon {
                    font-size: 14px;
                }

                .hall-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 18px;
                }

                .btn-edit {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    background: linear-gradient(135deg, #D4B06A, #B8922E);
                    color: white;
                    padding: 10px 16px;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: bold;
                    text-decoration: none;
                    transition: all 0.2s ease;
                    border: none;
                    cursor: pointer;
                }

                .btn-edit:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }

                .btn-delete {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    color: white;
                    padding: 10px 16px;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: bold;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .btn-delete:hover:not(:disabled) {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }

                .btn-delete:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .btn-icon {
                    font-size: 16px;
                }

                /* ریسپانسیو */
                @media (max-width: 768px) {
                    .hallsPage {
                        padding: 0.75rem;
                    }

                    .header h2 {
                        font-size: 20px;
                    }

                    .halls-grid {
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                        gap: 18px;
                    }

                    .image-container {
                        height: 160px;
                    }

                    .hall-content {
                        padding: 14px;
                    }

                    .hall-title {
                        font-size: 16px;
                    }

                    .hall-stats {
                        gap: 12px;
                        flex-wrap: wrap;
                    }

                    .hall-actions {
                        flex-direction: column;
                    }

                    .btn-edit,
                    .btn-delete {
                        padding: 10px;
                        font-size: 13px;
                    }
                }

                @media (max-width: 480px) {
                    .hallsPage {
                        padding: 0.5rem;
                    }

                    .header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 8px;
                        margin-bottom: 20px;
                    }

                    .header h2 {
                        font-size: 18px;
                    }

                    .badge {
                        font-size: 12px;
                        padding: 4px 10px;
                    }

                    .halls-grid {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }

                    .image-container {
                        height: 140px;
                    }

                    .hall-content {
                        padding: 12px;
                    }

                    .hall-title {
                        font-size: 15px;
                        margin-bottom: 8px;
                    }

                    .hall-location {
                        font-size: 12px;
                    }

                    .stat-item {
                        font-size: 12px;
                    }

                    .btn-edit,
                    .btn-delete {
                        padding: 8px 12px;
                        font-size: 12px;
                        border-radius: 10px;
                    }

                    .sans-badge {
                        font-size: 10px;
                        padding: 3px 8px;
                    }

                    .empty-state {
                        padding: 40px 15px;
                    }

                    .empty-icon {
                        font-size: 36px;
                    }

                    .empty-title {
                        font-size: 14px;
                    }

                    .empty-description {
                        font-size: 12px;
                    }

                    .loading-container p {
                        font-size: 14px;
                    }
                }

                @media (min-width: 769px) and (max-width: 1024px) {
                    .halls-grid {
                        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                        gap: 20px;
                    }
                }
            `}</style>
        </div>
    );
}