// components/providers/ToastProvider.jsx
"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
    return (
        <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
                duration: 4000,
                style: {
                    background: '#fff',
                    color: '#2C2418',
                    padding: '16px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    maxWidth: '500px',
                    direction: 'rtl',
                    fontFamily: 'Vazirmatn, Inter, sans-serif',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(212, 176, 106, 0.2)',
                },
                success: {
                    duration: 3000,
                    iconTheme: {
                        primary: '#22c55e',
                        secondary: '#fff',
                    },
                    style: {
                        background: '#f0fdf4',
                        color: '#166534',
                        border: '1px solid #86efac',
                    },
                },
                error: {
                    duration: 5000,
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                    },
                    style: {
                        background: '#fef2f2',
                        color: '#991b1b',
                        border: '1px solid #fca5a5',
                    },
                },
                loading: {
                    iconTheme: {
                        primary: '#D4B06A',
                        secondary: '#fff',
                    },
                    style: {
                        background: '#fffbeb',
                        color: '#92400e',
                        border: '1px solid #fcd34d',
                    },
                },
            }}
        />
    );
}