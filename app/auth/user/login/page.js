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
  PiUserCircleFill,
} from "react-icons/pi";

/* ============================================================
   Login Tabs
   ============================================================ */
const LOGIN_TYPES = [
  { id: "password", label: "ایمیل / نام کاربری", shortLabel: "ایمیل" },
  { id: "phone-password", label: "همراه و رمز", shortLabel: "همراه" },
  { id: "phone-otp", label: "همراه و کد تایید", shortLabel: "کد تایید" },
];

/* ============================================================
   InputField
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
        {Icon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <Icon className="w-4 h-4 text-gold-500 group-focus-within:text-gold-600 transition-colors" />
          </div>
        )}

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
            bg-white border border-slate-200 rounded-xl
            text-[13.5px] text-slate-900
            placeholder:text-slate-400
            hover:border-gold-300
            focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10
            transition-all duration-200
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
              active:scale-90
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
   Alert
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
   SubmitButton — تیره با آیکون طلایی
   ============================================================ */
function SubmitButton({ loading, loadingText, text, icon: Icon }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="
        group relative w-full
        inline-flex items-center justify-center gap-2
        px-6 py-3 rounded-xl
        text-sm font-bold text-white
        bg-gradient-to-b from-slate-700 to-slate-900
        hover:from-slate-800 hover:to-black
        shadow-md shadow-slate-900/25
        hover:shadow-lg hover:shadow-slate-900/40
        hover:-translate-y-0.5
        active:scale-95
        focus:outline-none focus:ring-4 focus:ring-slate-500/25
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
          {Icon && <Icon className="w-4 h-4 text-gold-400" />}
          {text}
          <PiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
        </>
      )}
    </button>
  );
}

/* ============================================================
   FooterLinks
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
  const [otpStep, setOtpStep] = useState("form");

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

  /* -------- Handlers -------- */
  const handleTypeChange = useCallback((type) => {
    setLoginType(type);
    setError("");
    setSuccess("");
    setOtpStep("form");
  }, []);

  const handleBackToForm = useCallback(() => {
    setOtpStep("form");
    setPhone("");
    setOtpCode("");
    setError("");
    setSuccess("");
  }, []);

  const inputIcon = useMemo(() => {
    if (identifier.includes("@")) return PiEnvelopeFill;
    if (/^09\d{9}$/.test(identifier)) return PiDeviceMobileFill;
    return PiUserFill;
  }, [identifier]);

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
        role: "user",
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
        role: "user",
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
          role: "user",
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
        role: "user",
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
        role: "user",
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
          {/* جعبه آیکون تیره با نشان USER */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div
                className="
                  relative w-16 h-16 rounded-2xl
                  bg-gradient-to-br from-slate-700 to-slate-900
                  flex items-center justify-center
                  shadow-lg shadow-slate-900/30
                  ring-4 ring-slate-200/50
                "
              >
                <div className="absolute inset-0 rounded-2xl bg-slate-900/20 blur-xl" />
                <PiUserCircleFill className="relative w-7 h-7 text-gold-400" />
              </div>

              {/* نشان USER */}
              <span
                className="
                  absolute -top-1.5 -left-1.5
                  px-2 py-0.5 rounded-full
                  bg-gradient-to-l from-gold-400 to-gold-600
                  text-white text-[9px] font-black
                  shadow-md shadow-gold-500/40
                  ring-2 ring-white
                "
              >
                USER
              </span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            ورود{" "}
            <span className="bg-gradient-to-l from-gold-500 to-gold-700 bg-clip-text text-transparent">
              کاربر
            </span>
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
                    ${
                      isActive
                        ? "bg-gradient-to-b from-slate-700 to-slate-900 text-white shadow-md shadow-slate-900/25"
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
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="example@gmail.com"
                  dir="ltr"
                  required
                  autoComplete="username"
                />

                <InputField
                  label="رمز عبور"
                  icon={PiLockKeyFill}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="••••••••"
                  required
                  isPassword
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword((v) => !v)}
                  autoComplete="current-password"
                />

                {error && <Alert type="error">{error}</Alert>}

                <SubmitButton
                  loading={loading}
                  loadingText="در حال ورود..."
                  text="ورود به حساب"
                  icon={PiUserCircleFill}
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
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (error) setError("");
                  }}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="••••••••"
                  required
                  isPassword
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword((v) => !v)}
                  autoComplete="current-password"
                />

                {error && <Alert type="error">{error}</Alert>}

                <SubmitButton
                  loading={loading}
                  loadingText="در حال ورود..."
                  text="ورود به حساب"
                  icon={PiUserCircleFill}
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
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (error) setError("");
                        }}
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
                        icon={PiKeyFill}
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
                        icon={PiCheckCircleFill}
                      />

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

        {/* ==================== پیام امنیتی ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25 }}
          className="
            mt-5
            p-3.5 rounded-2xl
            bg-gradient-to-br from-slate-50/60 via-white to-white
            border border-slate-200
            flex items-start gap-2.5
          "
        >
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
            <PiUserCircleFill className="w-4 h-4 text-slate-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] font-bold text-slate-700 mb-0.5">
              حساب کاربری شما امن است
            </p>
            <p className="text-[10.5px] text-slate-500 leading-relaxed">
              اطلاعات شما با بالاترین استانداردهای امنیتی محافظت می‌شود.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}