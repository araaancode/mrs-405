"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    PiEnvelopeFill,
    PiLockKeyFill,
    PiArrowLeft,
    PiArrowRight,
    PiEye,
    PiEyeSlash,
    PiDeviceMobileFill,
    PiUserFill,
    PiCheckCircleFill,
    PiWarningCircleFill,
    PiArrowCounterClockwiseFill,
    PiKeyFill,
    PiCrownSimpleFill,
    PiSpinnerGap,
} from "react-icons/pi";

/* ============================================================
   Login Tabs
   ============================================================ */
const LOGIN_TYPES = [
    {
        id: "password",
        label: "ایمیل / نام کاربری",
        shortLabel: "ایمیل",
    },
    {
        id: "phone-password",
        label: "همراه و رمز",
        shortLabel: "همراه",
    },
    {
        id: "phone-otp",
        label: "همراه و کد تایید",
        shortLabel: "کد تایید",
    },
];

/* ============================================================
   Field Component
   ============================================================ */
function InputField({
    label,
    icon: Icon,
    type = "text",
    value,
    onChange,
    placeholder,
    dir = "rtl",
    required,
    autoComplete,
    inputMode,
    extra,
    isPassword,
    showPassword,
    onTogglePassword,
}) {
    return (
        <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                {label}
            </label>

            <div className="relative group">
                {/* آیکون سمت راست */}
                {Icon && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                        <Icon className="w-4 h-4 text-gold-500" />
                    </div>
                )}

                {/* Input */}
                <input
                    type={isPassword ? (showPassword ? "text" : "password") : type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    dir={dir}
                    autoComplete={autoComplete}
                    inputMode={inputMode}
                    className={`
            w-full
            ${Icon ? "pr-10" : "pr-3.5"} ${isPassword ? "pl-10" : "pl-3.5"}
            py-2.5
            bg-white
            border rounded-xl
            text-[13.5px] text-slate-900
            placeholder:text-slate-400
            transition-all duration-200
            focus:outline-none focus:ring-4
            ${isPassword
                            ? "border-slate-200 hover:border-gold-300 focus:border-gold-500 focus:ring-gold-500/10"
                            : "border-slate-200 hover:border-gold-300 focus:border-gold-500 focus:ring-gold-500/10"
                        }
            ${dir === "ltr" ? "text-left" : "text-right"}
          `}
                />

                {/* دکمه نمایش رمز */}
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

            {extra && (
                <p className="text-[11px] text-slate-400 mt-1.5">{extra}</p>
            )}
        </div>
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
        p-3 rounded-xl
        border
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
function SubmitButton({ loading, loadingText, text }) {
    return (
        <button
            type="submit"
            disabled={loading}
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
                text
            )}
        </button>
    );
}

/* ============================================================
   Footer Links
   ============================================================ */
function FooterLinks() {
    return (
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
            <p className="text-center text-[12.5px] text-slate-500">
                حساب کاربر ندارید؟{" "}
                <Link
                    href="/auth/user/register"
                    className="
            inline-flex items-center gap-1
            text-gold-700 font-bold
            hover:text-gold-600 hover:gap-1.5
            transition-all duration-200
          "
                >
                    ثبت‌نام کاربر
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
    );
}

/* ============================================================
   Page
   ============================================================ */
export default function UserLoginPage() {
    const router = useRouter();

    /* -------- State -------- */
    const [loginType, setLoginType] = useState("password");
    const [otpStep, setOtpStep] = useState("form"); // form | verify

    const [identifier, setIdentifier] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [otpCode, setOtpCode] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [tempPhoneForOtp, setTempPhoneForOtp] = useState("");

    /* -------- Resend Timer -------- */
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    /* -------- Reset on Type Change -------- */
    const handleTypeChange = useCallback((type) => {
        setLoginType(type);
        setError("");
        setSuccess("");
        setOtpStep("form");
    }, []);

    /* -------- Reset on OTP back -------- */
    const handleBackToForm = useCallback(() => {
        setOtpStep("form");
        setPhone("");
        setOtpCode("");
        setError("");
        setSuccess("");
    }, []);

    /* -------- Get Input Icon -------- */
    const inputIcon = useMemo(() => {
        if (identifier.includes("@")) return PiEnvelopeFill;
        if (/^09\d{9}$/.test(identifier)) return PiDeviceMobileFill;
        return PiUserFill;
    }, [identifier]);

    /* ============================================================
       Submit Handlers
       ============================================================ */

    /* --- ایمیل/نام کاربری + رمز --- */
    const handlePasswordLogin = useCallback(
        async (e) => {
            e.preventDefault();
            setError("");
            setLoading(true);

            const res = await signIn("credentials", {
                redirect: false,
                identifier,
                password,
            });

            if (res?.error) {
                setError(res.error);
                setLoading(false);
                return;
            }

            router.push("/user/profile");
        },
        [identifier, password, router]
    );

    /* --- همراه + رمز --- */
    const handlePhonePasswordLogin = useCallback(
        async (e) => {
            e.preventDefault();
            setError("");
            setLoading(true);

            const res = await signIn("phone-password", {
                redirect: false,
                phone,
                password,
            });

            if (res?.error) {
                setError(res.error);
                setLoading(false);
                return;
            }

            router.push("/user/profile");
        },
        [phone, password, router]
    );

    /* --- درخواست OTP --- */
    const handleRequestOtp = useCallback(
        async (e) => {
            e.preventDefault();
            setError("");
            setSuccess("");

            if (!phone || !/^09\d{9}$/.test(phone)) {
                setError("شماره همراه معتبر وارد کنید (۰۹xxxxxxxxx)");
                return;
            }

            setLoading(true);

            try {
                const res = await signIn("phone-otp", {
                    redirect: false,
                    phone,
                    step: "request",
                });

                if (res?.error) {
                    setError(res.error);
                    setLoading(false);
                    return;
                }

                setTempPhoneForOtp(phone);
                setSuccess("کد تایید با موفقیت ارسال شد");
                setOtpStep("verify");
                setResendTimer(60);
            } catch {
                setError("خطا در ارسال کد تایید");
            } finally {
                setLoading(false);
            }
        },
        [phone]
    );

    /* --- تایید OTP --- */
    const handleVerifyOtp = useCallback(
        async (e) => {
            e.preventDefault();
            setError("");

            if (!otpCode || otpCode.length < 4) {
                setError("کد تایید معتبر وارد کنید");
                return;
            }

            setLoading(true);

            const res = await signIn("phone-otp", {
                redirect: false,
                phone: tempPhoneForOtp,
                otpCode,
                step: "verify",
            });

            if (res?.error) {
                setError(res.error);
                setLoading(false);
                return;
            }

            router.push("/user/profile");
        },
        [otpCode, tempPhoneForOtp, router]
    );

    /* --- ارسال مجدد --- */
    const handleResendOtp = useCallback(async () => {
        if (resendTimer > 0) return;

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const res = await signIn("phone-otp", {
                redirect: false,
                phone: tempPhoneForOtp,
                step: "request",
            });

            if (res?.error) {
                setError(res.error);
                setLoading(false);
                return;
            }

            setSuccess("کد تایید مجدداً ارسال شد");
            setResendTimer(60);
        } catch {
            setError("خطا در ارسال مجدد کد");
        } finally {
            setLoading(false);
        }
    }, [resendTimer, tempPhoneForOtp]);

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

            <div className="relative max-w-md mx-auto w-full">
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
                        ورود کاربر
                    </h2>

                    <div className="w-16 h-1 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full mx-auto mt-3 mb-3" />

                    <p className="text-[13px] text-slate-500">
                        {loginType === "password" && "با ایمیل یا نام کاربری وارد شوید"}
                        {loginType === "phone-password" &&
                            "با شماره همراه و رمز عبور وارد شوید"}
                        {loginType === "phone-otp" &&
                            "با شماره همراه و کد تایید وارد شوید"}
                    </p>
                </motion.div>

                {/* ==================== Tabs ==================== */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="
            p-1.5
            bg-white/80 backdrop-blur-sm
            rounded-2xl
            ring-1 ring-slate-100
            shadow-[0_4px_20px_rgba(15,23,42,0.06)]
            mb-4
          "
                >
                    <div className="grid grid-cols-3 gap-1">
                        {LOGIN_TYPES.map((type) => {
                            const isActive = loginType === type.id;
                            return (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => handleTypeChange(type.id)}
                                    aria-pressed={isActive}
                                    className={`
                    relative
                    py-2.5 px-2 rounded-xl
                    text-[12px] font-medium
                    transition-all duration-300
                    ${isActive
                                            ? "bg-gradient-to-b from-gold-400 to-gold-600 text-white shadow-md shadow-gold-500/25"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        }
                  `}
                                >
                                    <span className="hidden sm:inline">{type.label}</span>
                                    <span className="sm:hidden">{type.shortLabel}</span>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* ==================== Form Card ==================== */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="
            bg-white
            rounded-2xl
            ring-1 ring-slate-100
            shadow-[0_8px_32px_rgba(15,23,42,0.08)]
            overflow-hidden
          "
                >
                    <AnimatePresence mode="wait">
                        {/* ========== فرم ایمیل/نام کاربری ========== */}
                        {loginType === "password" && (
                            <motion.form
                                key="password"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.25 }}
                                onSubmit={handlePasswordLogin}
                                className="p-5 sm:p-7 space-y-4"
                            >
                                <InputField
                                    label="ایمیل یا نام کاربری"
                                    icon={inputIcon}
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder="example@gmail.com"
                                    dir="ltr"
                                    required
                                    autoComplete="username"
                                />

                                <InputField
                                    label="رمز عبور"
                                    icon={PiLockKeyFill}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    isPassword
                                    showPassword={showPassword}
                                    onTogglePassword={() =>
                                        setShowPassword((v) => !v)
                                    }
                                    autoComplete="current-password"
                                />

                                {error && <Alert type="error">{error}</Alert>}

                                <SubmitButton
                                    loading={loading}
                                    loadingText="در حال ورود..."
                                    text="ورود به حساب"
                                />

                                <FooterLinks />
                            </motion.form>
                        )}

                        {/* ========== فرم همراه + رمز ========== */}
                        {loginType === "phone-password" && (
                            <motion.form
                                key="phone-password"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.25 }}
                                onSubmit={handlePhonePasswordLogin}
                                className="p-5 sm:p-7 space-y-4"
                            >
                                <InputField
                                    label="شماره همراه"
                                    icon={PiDeviceMobileFill}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="09123456789"
                                    dir="ltr"
                                    inputMode="tel"
                                    required
                                    autoComplete="tel"
                                />

                                <InputField
                                    label="رمز عبور"
                                    icon={PiLockKeyFill}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    isPassword
                                    showPassword={showPassword}
                                    onTogglePassword={() =>
                                        setShowPassword((v) => !v)
                                    }
                                    autoComplete="current-password"
                                />

                                {error && <Alert type="error">{error}</Alert>}

                                <SubmitButton
                                    loading={loading}
                                    loadingText="در حال ورود..."
                                    text="ورود به حساب"
                                />

                                <FooterLinks />
                            </motion.form>
                        )}

                        {/* ========== فرم همراه + OTP ========== */}
                        {loginType === "phone-otp" && (
                            <motion.div
                                key="phone-otp"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.25 }}
                                className="p-5 sm:p-7 space-y-4"
                            >
                                <AnimatePresence mode="wait">
                                    {otpStep === "form" && (
                                        <motion.form
                                            key="otp-form"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.25 }}
                                            onSubmit={handleRequestOtp}
                                            className="space-y-4"
                                        >
                                            <InputField
                                                label="شماره همراه"
                                                icon={PiDeviceMobileFill}
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="09123456789"
                                                dir="ltr"
                                                inputMode="tel"
                                                required
                                                autoComplete="tel"
                                                extra="کد تایید به این شماره ارسال خواهد شد"
                                            />

                                            {error && <Alert type="error">{error}</Alert>}

                                            <SubmitButton
                                                loading={loading}
                                                loadingText="در حال ارسال کد..."
                                                text="ارسال کد تایید"
                                            />

                                            <FooterLinks />
                                        </motion.form>
                                    )}

                                    {otpStep === "verify" && (
                                        <motion.form
                                            key="otp-verify"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.25 }}
                                            onSubmit={handleVerifyOtp}
                                            className="space-y-4"
                                        >
                                            {/* هدر کد تایید */}
                                            <div className="flex items-center justify-between">
                                                <label className="block text-[13px] font-medium text-slate-700">
                                                    کد تایید
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={handleBackToForm}
                                                    className="
                            inline-flex items-center gap-1
                            text-[11px] text-slate-400 hover:text-gold-600
                            transition-colors
                          "
                                                >
                                                    <PiArrowCounterClockwiseFill className="w-3.5 h-3.5" />
                                                    تغییر شماره
                                                </button>
                                            </div>

                                            <InputField
                                                label=""
                                                icon={PiKeyFill}
                                                value={otpCode}
                                                onChange={(e) =>
                                                    setOtpCode(
                                                        e.target.value.replace(/\D/g, "").slice(0, 6)
                                                    )
                                                }
                                                placeholder="کد ۴ تا ۶ رقمی"
                                                dir="ltr"
                                                inputMode="numeric"
                                                required
                                                autoComplete="one-time-code"
                                            />

                                            {/* شماره مقصد */}
                                            <p className="text-[11.5px] text-slate-400 text-center -mt-2">
                                                کد برای شماره{" "}
                                                <span className="font-medium text-slate-600">
                                                    {tempPhoneForOtp}
                                                </span>{" "}
                                                ارسال شد
                                            </p>

                                            {success && <Alert type="success">{success}</Alert>}
                                            {error && <Alert type="error">{error}</Alert>}

                                            <SubmitButton
                                                loading={loading}
                                                loadingText="در حال تایید..."
                                                text="تایید و ورود"
                                            />

                                            {/* ارسال مجدد */}
                                            <div className="text-center">
                                                <button
                                                    type="button"
                                                    onClick={handleResendOtp}
                                                    disabled={resendTimer > 0 || loading}
                                                    className="
                            text-[11.5px] text-slate-500
                            hover:text-gold-600
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-colors
                          "
                                                >
                                                    {resendTimer > 0
                                                        ? `ارسال مجدد کد پس از ${resendTimer.toLocaleString("fa-IR")} ثانیه`
                                                        : "ارسال مجدد کد تایید"}
                                                </button>
                                            </div>

                                            <FooterLinks />
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}