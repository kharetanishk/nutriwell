"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useBookingForm } from "../context/BookingFormContext";

export default function PaymentPage() {
  const { form, resetForm } = useBookingForm();
  const router = useRouter();

  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  /* -------------------------------------------------
      BLOCK DIRECT ACCESS
  -------------------------------------------------- */
  useEffect(() => {
    const invalid =
      !form.planSlug ||
      !form.planName ||
      !form.planPrice ||
      !form.appointmentDate ||
      !form.appointmentTime ||
      !form.appointmentMode;

    if (invalid) {
      router.replace("/book/user-details");
    }
  }, [form]);

  /* -------------------------------------------------
      DATE FORMATTER
  -------------------------------------------------- */
  function formatDate(d: string | null) {
    if (!d) return "";
    const date = new Date(d);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  /* -------------------------------------------------
      PAYMENT HANDLER
  -------------------------------------------------- */
  async function onPay() {
    if (processing || success) return;

    setProcessing(true);

    setTimeout(async () => {
      setProcessing(false);
      setSuccess(true);

      // play audio
      try {
        const audio = new Audio("/success.mp3");
        audio.play();
      } catch {}

      // confetti
      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: 150,
        spread: 65,
        origin: { y: 0.6 },
      });

      resetForm();

      setTimeout(() => router.push("/"), 1500);
    }, 1800);
  }

  return (
    <main className="relative bg-white rounded-2xl p-6 shadow-md min-h-[350px] flex flex-col justify-center">
      {/* PROCESSING OVERLAY */}
      <AnimatePresence>
        {processing && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md rounded-2xl z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div className="w-14 h-14 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-slate-700 font-medium text-lg">
              Processing Payment…
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUCCESS OVERLAY */}
      <AnimatePresence>
        {success && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-white rounded-2xl z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ duration: 0.9 }}
              className="w-44 h-44 rounded-full bg-emerald-600 flex items-center justify-center shadow-2xl"
            >
              <Check size={110} className="text-white" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUMMARY */}
      <h2 className="text-xl font-semibold mb-4">Payment</h2>

      <div className="mb-4 space-y-1">
        <p className="text-sm">Plan: {form.planName}</p>

        {form.planPackageName && (
          <p className="text-sm">Package: {form.planPackageName}</p>
        )}

        <p className="text-sm">Mode: {form.appointmentMode}</p>

        <p className="text-sm">
          Date:{" "}
          <span className="font-medium">
            {formatDate(form.appointmentDate)}
          </span>
        </p>

        <p className="text-sm">Time: {form.appointmentTime}</p>

        <p className="text-lg font-bold text-emerald-700">
          Price: {form.planPrice}
        </p>
      </div>

      <button
        onClick={onPay}
        disabled={processing || success}
        className="px-6 py-3 bg-emerald-600 text-white rounded-lg active:scale-95 disabled:opacity-50"
      >
        Pay Now
      </button>

      <button
        onClick={() => router.push("/book/slot")}
        className="mt-4 text-sm text-slate-600"
      >
        ← Back to Slot
      </button>
    </main>
  );
}
