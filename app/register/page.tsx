"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleRegister = () => {
    const newErrors: any = {};

    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!validateEmail(email))
      newErrors.email = "Enter a valid email address.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("REGISTER DATA:", { name, email });
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
          Create Account
        </h1>

        {/* NAME */}
        <div className="mb-4">
          <label className="text-slate-700 font-medium text-sm">
            Full Name
          </label>
          <motion.input
            animate={errors.name ? { x: [-8, 8, -6, 6, 0] } : {}}
            transition={{ duration: 0.3 }}
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: "" })); // 🟢 CLEAR NAME ERROR WHILE TYPING
            }}
            className={`w-full mt-2 p-3 rounded-xl bg-white/80 border outline-none shadow-sm text-slate-700 
              ${
                errors.name
                  ? "border-red-400 focus:border-red-500"
                  : "border-emerald-200 focus:border-emerald-500"
              }
            `}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="text-slate-700 font-medium text-sm">Email</label>
          <motion.input
            animate={errors.email ? { x: [-8, 8, -6, 6, 0] } : {}}
            transition={{ duration: 0.3 }}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: "" })); // 🟢 CLEAR EMAIL ERROR WHILE TYPING
            }}
            className={`w-full mt-2 p-3 rounded-xl bg-white/80 border outline-none shadow-sm text-slate-700 
              ${
                errors.email
                  ? "border-red-400 focus:border-red-500"
                  : "border-emerald-200 focus:border-emerald-500"
              }
            `}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* REGISTER BUTTON */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.03 }}
          onClick={handleRegister}
          className="w-full bg-emerald-700 text-white p-3 rounded-xl font-semibold hover:bg-emerald-800 transition shadow-lg mt-2"
        >
          Register
        </motion.button>

        {/* LINK TO LOGIN */}
        <p className="text-center text-slate-600 mt-6 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-emerald-700 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
