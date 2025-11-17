"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [otpSent, setOtpSent] = useState(false);

  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);

  const [errors, setErrors] = useState<{ email?: string; otp?: string }>({});

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const otpRefs = Array.from({ length: 6 }, () =>
    useRef<HTMLInputElement | null>(null)
  );

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  // TIMER LOGIC
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleGetOtp = () => {
    const newErrors: any = {};

    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!validateEmail(email))
      newErrors.email = "Enter a valid email address.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoadingOtp(true);

      setTimeout(() => {
        console.log("OTP SENT TO:", email);
        setOtpSent(true);
        setLoadingOtp(false);
        setTimer(60);
        setCanResend(false);

        otpRefs[0].current?.focus();
      }, 1200);
    }
  };

  const handleResendOtp = () => {
    if (!canResend) return;

    setTimer(60);
    setCanResend(false);
    console.log("OTP RESENT TO:", email);

    otpRefs[0].current?.focus();
  };

  const handleOtpChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      setErrors((prev) => ({ ...prev, otp: "" }));

      if (value && index < 5) otpRefs[index + 1].current?.focus();
    }
  };

  const handleBackspace = (value: string, index: number) => {
    if (!value && index > 0) otpRefs[index - 1].current?.focus();
  };

  const handleVerifyOtp = () => {
    const otpValue = otp.join("");
    const newErrors: any = {};
    if (otpValue.length !== 6) newErrors.otp = "Enter full 6-digit OTP.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoadingVerify(true);

      setTimeout(() => {
        console.log("VERIFY OTP:", { email, otp: otpValue });
        router.push("/");
      }, 1200);
    }
  };

  return (
    <div className="h-svh flex items-center justify-center bg-gradient-to-b from-white to-emerald-50/40 p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 rounded-3xl bg-white/30 backdrop-blur-xl shadow-2xl border border-white/40"
      >
        <h1 className="text-3xl font-bold text-emerald-800 text-center mb-6">
          Login
        </h1>

        {/* EMAIL FIELD */}
        <div className="mb-4">
          <label className="text-slate-700 font-medium text-sm">Email</label>

          <motion.input
            animate={errors.email ? { x: [-8, 8, -6, 6, 0] } : {}}
            transition={{ duration: 0.3 }}
            type="email"
            placeholder="Enter your email"
            value={email}
            disabled={otpSent}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: "" }));
            }}
            className={`w-full mt-2 p-3 rounded-xl bg-white/80 
              border outline-none shadow-sm text-slate-700 transition
              ${
                errors.email
                  ? "border-red-400"
                  : "border-emerald-200 focus:border-emerald-500"
              }
              ${otpSent ? "opacity-60 cursor-not-allowed" : ""}
            `}
          />

          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* GET OTP BUTTON */}
        {!otpSent && (
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.03 }}
            onClick={handleGetOtp}
            disabled={loadingOtp}
            className={`w-full bg-emerald-700 text-white p-3 rounded-xl font-semibold mt-3 
            shadow-lg hover:bg-emerald-800 transition 
            ${loadingOtp ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loadingOtp ? "Sending OTP..." : "Get OTP"}
          </motion.button>
        )}

        {/* OTP UI AFTER SENDING */}
        {otpSent && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6"
          >
            <label className="text-slate-700 font-medium text-sm">
              Enter OTP
            </label>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-3 mb-2">
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  ref={otpRefs[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) =>
                    e.key === "Backspace" && handleBackspace(digit, index)
                  }
                  className="
        w-10 h-10                       /* ultra small screens */
        xs:w-11 xs:h-11                 /* 360px+ */
        sm:w-12 sm:h-12                 /* 480px+ */
        md:w-14 md:h-14                 /* tablets */
        rounded-xl bg-white/80 text-center
        border border-emerald-300 focus:border-emerald-600
        outline-none text-lg sm:text-xl font-semibold
        shadow-[0_0_12px_rgba(16,185,129,0.25)]
        focus:shadow-[0_0_18px_rgba(16,185,129,0.55)]
        transition-all
      "
                />
              ))}
            </div>

            {errors.otp && (
              <p className="text-red-500 text-xs mt-1">{errors.otp}</p>
            )}

            {/* TIMER + RESEND */}
            <p className="text-center text-sm text-slate-600 mt-3">
              {canResend ? (
                <button
                  onClick={handleResendOtp}
                  className="text-emerald-700 font-semibold hover:underline"
                >
                  Resend OTP
                </button>
              ) : (
                <>
                  Resend in <span className="font-semibold">{timer}s</span>
                </>
              )}
            </p>

            {/* VERIFY BUTTON */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.03 }}
              onClick={handleVerifyOtp}
              disabled={loadingVerify}
              className={`w-full bg-emerald-700 text-white p-3 mt-5 rounded-xl font-semibold 
              hover:bg-emerald-800 transition shadow-lg
              ${loadingVerify ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loadingVerify ? "Verifying..." : "Verify OTP"}
            </motion.button>
          </motion.div>
        )}

        <p className="text-center text-slate-600 mt-6 text-sm">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-emerald-700 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
