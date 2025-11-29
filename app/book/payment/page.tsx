"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { useBookingForm } from "../context/BookingFormContext";
import { createOrder, verifyPayment } from "@/lib/payment";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const { form, resetForm } = useBookingForm();
  const router = useRouter();

  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existingScript) {
      // Wait a bit for script to load
      const checkInterval = setInterval(() => {
        if (window.Razorpay) {
          setRazorpayLoaded(true);
          clearInterval(checkInterval);
        }
      }, 100);

      return () => clearInterval(checkInterval);
    }

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      if (window.Razorpay) {
        setRazorpayLoaded(true);
      } else {
        toast.error("Razorpay failed to initialize");
      }
    };
    script.onerror = () => {
      toast.error("Failed to load payment gateway");
    };
    document.body.appendChild(script);
  }, []);

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
  function formatDate(d: string | null | undefined) {
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
    if (processing || success) {
      return;
    }

    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      toast.error("Payment gateway not loaded. Please refresh the page.");
      return;
    }

    // Validate required fields
    if (
      !form.slotId ||
      !form.patientId ||
      !form.planSlug ||
      !form.appointmentMode ||
      !form.planPriceRaw
    ) {
      toast.error("Missing booking information. Please start over.");
      router.push("/services");
      return;
    }

    setProcessing(true);

    try {
      // Step 1: Create appointment and Razorpay order
      console.log("Creating order...", {
        slotId: form.slotId,
        patientId: form.patientId,
        planSlug: form.planSlug,
        appointmentMode: form.appointmentMode,
      });

      const orderResponse = await createOrder({
        slotId: form.slotId,
        patientId: form.patientId,
        planSlug: form.planSlug,
        appointmentMode: form.appointmentMode,
      });

      console.log("Order response:", orderResponse);

      if (!orderResponse.success || !orderResponse.order) {
        throw new Error(
          orderResponse.error || "Failed to create order"
        );
      }

      const { order, appointmentId } = orderResponse;

      // Step 2: Get Razorpay key from environment
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      console.log("Razorpay key available:", !!razorpayKey);
      
      if (!razorpayKey) {
        throw new Error("Razorpay key not configured. Please contact support.");
      }

      // Step 3: Verify Razorpay is available
      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded. Please refresh the page.");
      }

      // Step 4: Configure Razorpay options
      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "Nutriwell",
        description: `Payment for ${form.planName}`,
        order_id: order.id,
        handler: async function (response: any) {
          console.log("Payment success response:", response);
          try {
            setProcessing(true);
            
            // Verify payment on backend
            const verifyResponse = await verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            if (verifyResponse.success) {
              // Payment successful
              setProcessing(false);
              setSuccess(true);

              // Play success audio
              try {
                const audio = new Audio("/success.mp3");
                audio.play();
              } catch {}

              // Show confetti
              const { default: confetti } = await import("canvas-confetti");
              confetti({
                particleCount: 150,
                spread: 65,
                origin: { y: 0.6 },
              });

              toast.success("Payment successful! Appointment confirmed.");

              resetForm();

              setTimeout(() => router.push("/"), 2000);
            } else {
              throw new Error(verifyResponse.message || verifyResponse.error || "Payment verification failed");
            }
          } catch (error: any) {
            console.error("Payment verification error:", error);
            toast.error(
              error?.response?.data?.message ||
                error?.message ||
                "Payment verification failed. Please contact support."
            );
            setProcessing(false);
          }
        },
        prefill: {
          name: form.fullName || "",
          email: form.email || "",
          contact: form.mobile?.replace(/\D/g, "") || "",
        },
        theme: {
          color: "#10b981", // Emerald color
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal dismissed");
            setProcessing(false);
            toast("Payment cancelled");
          },
        },
      };

      console.log("Opening Razorpay checkout with options:", {
        key: razorpayKey.substring(0, 10) + "...",
        amount: options.amount,
        order_id: options.order_id,
      });

      // Step 5: Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      
      razorpay.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response);
        toast.error(
          response.error?.description || "Payment failed. Please try again."
        );
        setProcessing(false);
      });

      // Open the Razorpay checkout
      razorpay.open();
      console.log("Razorpay checkout opened");
      
      // Don't set processing to false here - let the handler or modal dismiss handle it
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to initiate payment. Please try again."
      );
      setProcessing(false);
    }
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
        className="px-6 py-3 bg-emerald-600 text-white rounded-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          "Pay Now"
        )}
      </button>

      {!razorpayLoaded && (
        <p className="text-xs text-slate-500 mt-2 text-center">
          Loading payment gateway...
        </p>
      )}

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
          <p>Razorpay Loaded: {razorpayLoaded ? "Yes" : "No"}</p>
          <p>Razorpay Key: {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? "Set" : "Not Set"}</p>
          <p>Slot ID: {form.slotId || "Missing"}</p>
          <p>Patient ID: {form.patientId || "Missing"}</p>
        </div>
      )}

      <button
        onClick={() => router.push("/book/slot")}
        className="mt-4 text-sm text-slate-600"
      >
        ← Back to Slot
      </button>
    </main>
  );
}
