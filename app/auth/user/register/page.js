"use client";

import { useState, useMemo, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    PiUserFill,
    PiIdentificationCard,
    PiEnvelopeFill,
    PiDeviceMobileFill,
    PiLockKeyFill,
    PiArrowRight,
    PiArrowLeft,
    PiEye,
    PiEyeSlash,
    PiCheckCircleFill,
    PiXCircleFill,
    PiWarningCircleFill,
    PiCrownSimpleFill,
    PiSpinnerGap,
    PiCheck,
    PiX,
} from "react-icons/pi";

/* ============================================================
   InputField Component
   ============================================================ */
function InputField({
    label,
    name,
    icon: Icon,
    type = "text",
    value,
    onChange,
    placeholder,
    dir = "rtl",
    required,
    autoComplete,
    inputMode,
    isPassword,
    showPassword,
    onTogglePassword,
    error,
    hint,
}) {
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                {label}
                {required && <span className="text-rose-500 mr-1">*</span>}
            </label>

            <div className="relative group">
                {Icon && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                        <Icon
                            className={`
                w-4 h-4 transition-colors duration-200
                ${error ? "text-rose-500" : "text-gold-500 group-focus-within:text-gold-600"}
              `}
                        />
                    </div>
                )}

                <input
                    type={inputType}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    dir={dir}
                    autoComplete={autoComplete}
                    inputMode={inputMode}
                    className={`
            w-full
            ${Icon ? "pr-10" : "pr-3.5"}
            ${isPassword ? "pl-10" : "pl-3.5"}
            py-2.5
            bg-white
            border rounded-xl
            text-[13.5px] text-slate-900
            placeholder:text-slate-400
            transition-all duration-200
            focus:outline-none focus:ring-4
            ${error
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                            : "border-slate-200 hover:border-gold-300 focus:border-gold-500 focus:ring-gold-500/10"
                        }
            ${dir === "ltr" ? "text-left" : "text-right"}
          `}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={onTogglePassword}
                        aria-label={showPassword ? "پنهان کردن رمز" : "نمایش رمز"}
                        className="
              absolute left-3 top-1/2 -translate-y-1/2
              w-7 h-7 rounded-lg
              flex items-center justify-center
              text-slate-400 hover:text-gold-500 hover:bg-gold-50
              transition-all duration-200
            "
                    >
                        {showPassword ? (
                            <PiEyeSlash className="w-4 h-4" />
                        ) : (
                            <PiEye className="w-4 h-4" />
                        )}
                    </button>
                )}
            </div>

            {error ? (
                <p className="text-[11px] text-rose-600 mt-1.5 flex items-center gap-1">
                    <PiWarningCircleFill className="w-3 h-3" />
                    {error}
                </p>
            ) : hint ? (
                <p className="text-[11px] text-slate-400 mt-1.5">{hint}</p>
            ) : null}
        </div>
    );
}

/* ============================================================
   PasswordStrength Component
   ============================================================ */
function PasswordStrength({ checks }) {
    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
        >
            <div className="mt-2 space-y-1.5">
                {checks.map((check) => (
                    <div
                        key={check.label}
                        className="flex items-center gap-2 text-[11px]"
                    >
                        {check.passed ? (
                            <PiCheck
                                className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0"
                                strokeWidth={3}
                            />
                        ) : (
                            <PiX
                                className="w-3.5 h-3.5 text-slate-300 flex-shrink-0"
                                strokeWidth={3}
                            />
                        )}
                        <span
                            className={
                                check.passed ? "text-emerald-600" : "text-slate-400"
                            }
                        >
                            {check.label}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

/* ============================================================
   Alert Component
   ============================================================ */
function Alert({ type = "error", children }) {
    if (!children) return null;

    const styles = {
        error: {
            bg: "bg-rose-50",
            border: "border-rose-200",
            text: "text-rose-700",
            icon: PiWarningCircleFill,
        },
        success: {
            bg: "bg-emerald-50",
            border: "border-emerald-200",
            text: "text-emerald-700",
            icon: PiCheckCircleFill,
        },
    };

    const style = styles[type];
    const Icon = style.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
        flex items-center gap-2
        p-3 rounded-xl border
        ${style.bg} ${style.border} ${style.text}
      `}
        >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <p className="text-[12.5px] font-medium">{children}</p>
        </motion.div>
    );
}

/* ============================================================
   Submit Button
   ============================================================ */
function SubmitButton({ loading, disabled, loadingText, text }) {
    return (
        <button
            type="submit"
            disabled={loading || disabled}
            className="
        group relative w-full
        inline-flex items-center justify-center gap-2
        px-6 py-3 rounded-xl
        text-sm font-bold text-white
        bg-gradient-to-b from-gold-400 to-gold-600
        hover:from-gold-500 hover:to-gold-700
        shadow-md shadow-gold-500/25
        hover:shadow-lg hover:shadow-gold-500/40
        hover:-translate-y-0.5
        active:scale-95
        focus:outline-none focus:ring-4 focus:ring-gold-500/25
        disabled:opacity-60 disabled:cursor-not-allowed
        disabled:hover:translate-y-0 disabled:hover:shadow-md
        transition-all duration-300
      "
        >
            {loading ? (
                <>
                    <PiSpinnerGap className="w-4 h-4 animate-spin" />
                    {loadingText}
                </>
            ) : (
                <>
                    {text}
                    <PiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                </>
            )}
        </button>
    );
}

/* ============================================================
   Page
   ============================================================ */
export default function UserRegisterPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        full_name: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    /* ============================================================
       Handlers
       ============================================================ */
    const handleChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            setForm((prev) => ({ ...prev, [name]: value }));
            if (error) setError("");
        },
        [error]
    );

    /* ============================================================
       Password Strength
       ============================================================ */
    const passwordChecks = useMemo(
        () => [
            { label: "حداقل ۸ کاراکتر", passed: form.password.length >= 8 },
            { label: "شامل حروف انگلیسی", passed: /[a-zA-Z]/.test(form.password) },
            { label: "شامل اعداد", passed: /[0-9]/.test(form.password) },
        ],
        [form.password]
    );

    const passwordValid = passwordChecks.every((c) => c.passed);
    const passwordsMatch =
        form.password === form.confirmPassword && form.confirmPassword !== "";
    const showMatchError =
        form.confirmPassword !== "" && form.password !== form.confirmPassword;

    /* ============================================================
       Submit
       ============================================================ */
    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            setError("");

            if (!passwordsMatch) {
                setError("رمز عبور و تکرار آن مطابقت ندارند");
                return;
            }

            if (!passwordValid) {
                setError("رمز عبور باید حداقل ۸ کاراکتر و شامل حروف و اعداد باشد");
                return;
            }

            setLoading(true);

            try {
                const { confirmPassword, ...submitData } = form;
                await axios.post("/api/auth/user/register", submitData);
                router.push("/auth/user/login");
            } catch (err) {
                setError(err.response?.data?.message || "خطا در ثبت‌نام");
            } finally {
                setLoading(false);
            }
        },
        [form, passwordValid, passwordsMatch, router]
    );

    /* ============================================================
       Render
       ============================================================ */
    return (
        <div className="min-h-screen flex flex-col justify-center py-10 sm:py-14 px-4 sm:px-6 lg:px-8 relative">
            {/* الگوی تزئینی پس‌زمینه */}
            <div
                className="absolute inset-0 pointer-events-none opacity-50"
                style={{
                    backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(198,161,76,0.06) 0%, transparent 45%),
            radial-gradient(circle at 80% 70%, rgba(198,161,76,0.05) 0%, transparent 45%)
          `,
                }}
            />

            <div className="relative max-w-2xl mx-auto w-full">
                {/* ==================== Header ==================== */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-6"
                >
                    {/* آیکون تاج */}
                    <div className="flex justify-center mb-5">
                        <div
                            className="
                relative w-16 h-16 rounded-2xl
                bg-gradient-to-br from-gold-400 to-gold-600
                flex items-center justify-center
                shadow-lg shadow-gold-500/30
                ring-4 ring-gold-100/50
              "
                        >
                            <div className="absolute inset-0 rounded-2xl bg-gold-500/20 blur-xl" />
                            <PiCrownSimpleFill className="relative w-7 h-7 text-white" />
                        </div>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                        ثبت‌نام کاربر
                    </h2>

                    <div className="w-16 h-1 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full mx-auto mt-3 mb-3" />

                    <p className="text-[13px] text-slate-500">
                        لطفاً اطلاعات خود را برای ایجاد حساب کاربر وارد کنید
                    </p>
                </motion.div>

                {/* ==================== Form Card ==================== */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="
            bg-white
            rounded-2xl
            ring-1 ring-slate-100
            shadow-[0_8px_32px_rgba(15,23,42,0.08)]
            overflow-hidden
          "
                >
                    <form
                        onSubmit={handleSubmit}
                        className="p-5 sm:p-7 space-y-5"
                    >
                        {/* ==================== Grid فیلدها ==================== */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputField
                                label="نام و نام خانوادگی"
                                name="full_name"
                                icon={PiIdentificationCard}
                                value={form.full_name}
                                onChange={handleChange}
                                placeholder="علی رضایی"
                                required
                                autoComplete="name"
                            />

                            <InputField
                                label="نام کاربری"
                                name="username"
                                icon={PiUserFill}
                                value={form.username}
                                onChange={handleChange}
                                placeholder="ali_rezaei"
                                dir="ltr"
                                required
                                autoComplete="username"
                            />

                            <InputField
                                label="ایمیل"
                                name="email"
                                icon={PiEnvelopeFill}
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="example@gmail.com"
                                dir="ltr"
                                required
                                autoComplete="email"
                                inputMode="email"
                            />

                            <InputField
                                label="شماره موبایل"
                                name="phone"
                                icon={PiDeviceMobileFill}
                                type="tel"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="09123456789"
                                dir="ltr"
                                required
                                autoComplete="tel"
                                inputMode="tel"
                            />

                            {/* رمز عبور */}
                            <div>
                                <InputField
                                    label="رمز عبور"
                                    name="password"
                                    icon={PiLockKeyFill}
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    isPassword
                                    showPassword={showPassword}
                                    onTogglePassword={() => setShowPassword((v) => !v)}
                                    autoComplete="new-password"
                                />

                                <AnimatePresence>
                                    {form.password && (
                                        <PasswordStrength checks={passwordChecks} />
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* تکرار رمز عبور */}
                            <InputField
                                label="تکرار رمز عبور"
                                name="confirmPassword"
                                icon={PiLockKeyFill}
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                isPassword
                                showPassword={showConfirmPassword}
                                onTogglePassword={() =>
                                    setShowConfirmPassword((v) => !v)
                                }
                                autoComplete="new-password"
                                error={showMatchError ? "رمز عبور مطابقت ندارد" : undefined}
                            />
                        </div>

                        {/* ==================== Alert ==================== */}
                        {error && <Alert type="error">{error}</Alert>}

                        {/* ==================== Submit ==================== */}
                        <SubmitButton
                            loading={loading}
                            disabled={showMatchError}
                            loadingText="در حال ثبت‌نام..."
                            text="ثبت‌نام"
                        />

                        {/* ==================== Footer Links ==================== */}
                        <div className="pt-5 border-t border-slate-100 space-y-3">
                            <p className="text-center text-[12.5px] text-slate-500">
                                قبلاً حساب کاربر دارید؟{" "}
                                <Link
                                    href="/auth/user/login"
                                    className="
                    inline-flex items-center gap-1
                    text-gold-700 font-bold
                    hover:text-gold-600 hover:gap-1.5
                    transition-all duration-200
                  "
                                >
                                    ورود به حساب
                                    <PiArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </p>

                            <p className="text-center">
                                <Link
                                    href="/"
                                    className="
                    inline-flex items-center gap-1
                    text-[11.5px] text-slate-400 hover:text-gold-600
                    transition-colors duration-200
                  "
                                >
                                    <PiArrowLeft className="w-3.5 h-3.5" />
                                    بازگشت به صفحه اصلی
                                </Link>
                            </p>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}