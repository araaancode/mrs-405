// components/providers/ToastProvider.jsx
"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider() {
    return (
        <ToastContainer
            position="top-left"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={true}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            limit={5}
            style={{
                fontFamily: "Vazirmatn, Inter, sans-serif",
                fontSize: "14px",
            }}
            toastStyle={{
                borderRadius: "14px",
                boxShadow:
                    "0 20px 40px -12px rgba(198, 161, 76, 0.25), 0 4px 6px -4px rgba(0,0,0,0.08)",
                padding: "14px 18px",
                border: "1px solid rgba(198, 161, 76, 0.2)",
            }}
        />
    );
}