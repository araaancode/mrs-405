// components/providers/ToastProvider.jsx
"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider() {
    return (
        <ToastContainer
            position="top-left"
            rtl={true}
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick={false}
            pauseOnFocusLoss={false}
            draggable={true}
            pauseOnHover={true}
            theme="light"
            limit={5}
            // ✅ استفاده از کلاس سفارشی برای حذف قاب و سایه
            toastClassName="custom-toast-no-border"
            bodyClassName="custom-toast-body"
            // ✅ حذف سایه، حاشیه و خط دور به صورت inline
            style={{
                boxShadow: "none",
                border: "none",
                outline: "none",
            }}
        />
    );
}