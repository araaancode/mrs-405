// components/providers/AuthProvider.jsx
"use client";

import { SessionProvider } from "next-auth/react";
import ToastProvider from "./ToastProvider";

export default function AuthProvider({ children }) {
    return (
        <SessionProvider>
            {children}
            <ToastProvider />
        </SessionProvider>
    );
}