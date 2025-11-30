"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useBookingForm } from "../context/BookingFormContext";
import { createOrder, verifyPayment } from "@/lib/payment";
import { Loader2, CheckCircle, XCircle, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const { form, resetForm } = useBookingForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [isRazorpayReady, setIsRazorpayReady] = useState(false);
  const razorpayLoaded = useRef(false);

  /* -------------------------------------------------
      BLOCK DIRECT ACCESS
  -------------------------------------------------- */
  useEffect(() => {
    if (!form.appointmentId || !form.slotId || !form.planSlug) {
      toast.error("Please complete the booking process first");
      router.replace("/services");
      return;
    }
  }, [form.appointmentId, form.slotId, form.planSlug, router]);

  /* -------------------------------------------------
      LOAD RAZORPAY SCRIPT
  -------------------------------------------------- */
  useEffect(() => {
    if (razorpayLoaded.current) return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      console.log("Razorpay script loaded");
      razorpayLoaded.current = true;
      setIsRazorpayReady(true);
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      toast.error("Failed to load payment gateway. Please refresh the page.");
      setIsRazorpayReady(false);
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  /* -------------------------------------------------
      CREATE ORDER AND INITIATE PAYMENT
  -------------------------------------------------- */
  async function initiatePayment() {
    if (!form.appointmentId || !form.slotId || !form.planSlug) {
      toast.error("Missing booking information. Please go back and try again.");
      return;
    }

    if (!isRazorpayReady) {
      toast.error(
        "Payment gateway is loading. Please wait a moment and try again."
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(
        "[PAYMENT] Creating order for appointment:",
        form.appointmentId
      );

      // Create order using existing appointment
      const orderResponse = await createOrder({
        appointmentId: form.appointmentId,
      });

      if (!orderResponse.success || !orderResponse.order) {
        throw new Error(
          orderResponse.error || "Failed to create payment order"
        );
      }

      const { order } = orderResponse;
      console.log("[PAYMENT] Order created:", order.id);

      setOrderCreated(true);

      // Initialize Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Nutriwell",
        description: form.planName || "Appointment Booking",
        order_id: order.id,
        handler: async function (response: any) {
          console.log("[PAYMENT] Payment success response:", response);
          setProcessing(true);

          try {
            // Verify payment on backend
            const verifyResponse = await verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            if (verifyResponse.success) {
              console.log("[PAYMENT] Payment verified successfully");
              toast.success(
                "Payment successful! Your appointment is confirmed."
              );

              // Reset form and redirect to home
              resetForm();
              setTimeout(() => {
                router.push("/");
              }, 2000);
            } else {
              throw new Error(
                verifyResponse.error || "Payment verification failed"
              );
            }
          } catch (error: any) {
            console.error("[PAYMENT] Payment verification error:", error);
            toast.error(
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
          color: "#10b981", // emerald-600
        },
        modal: {
          ondismiss: function () {
            console.log("[PAYMENT] Payment modal dismissed");
            toast.error("Payment cancelled");
            setProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response: any) {
        console.error("[PAYMENT] Payment failed:", response);
        toast.error(
          response.error?.description || "Payment failed. Please try again."
        );
        setProcessing(false);
      });

      razorpay.open();
    } catch (error: any) {
      console.error("[PAYMENT] Payment initiation error:", error);
      toast.error(
        error?.response?.data?.error ||
          error?.message ||
          "Failed to initiate payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const [error, setError] = useState<string | null>(null);

  /* -------------------------------------------------
      UI RENDER
  -------------------------------------------------- */
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f9fcfa] to-[#f1f7f3] py-10 px-4 flex justify-center">
      <div className="max-w-lg w-full bg-white rounded-2xl p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <CreditCard className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-800 mb-2">
            Complete Payment
          </h1>
          <p className="text-slate-600 text-sm">
            Secure payment powered by Razorpay
          </p>
        </div>

        {/* Booking Summary */}
        {form.planName && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-emerald-900 mb-2">
              Booking Summary
            </h3>
            <div className="space-y-1 text-sm text-emerald-700">
              <p>
                <span className="font-medium">Plan:</span> {form.planName}
              </p>
              {form.planPackageName && (
                <p>
                  <span className="font-medium">Package:</span>{" "}
                  {form.planPackageName}
                </p>
              )}
              <p>
                <span className="font-medium">Amount:</span> {form.planPrice}
              </p>
              {form.appointmentDate && (
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(form.appointmentDate).toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
              {form.appointmentTime && (
                <p>
                  <span className="font-medium">Time:</span>{" "}
                  {form.appointmentTime}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-700">
              <XCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Payment Button */}
        <div className="space-y-4">
          <button
            onClick={initiatePayment}
            disabled={loading || processing || !isRazorpayReady}
            className="w-full py-4 bg-emerald-600 text-white rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors"
          >
            {processing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Payment...
              </>
            ) : loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Preparing Payment...
              </>
            ) : orderCreated ? (
              <>
                <CreditCard className="w-5 h-5" />
                Pay {form.planPrice}
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Pay {form.planPrice}
              </>
            )}
          </button>

          <button
            onClick={() => router.push("/book/slot")}
            disabled={processing}
            className="w-full py-2 text-slate-600 hover:text-slate-800 text-sm disabled:opacity-50"
          >
            ← Back to Slot Selection
          </button>
        </div>

        {/* Security Note */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            🔒 Your payment is secured by Razorpay. We do not store your card
            details.
          </p>
        </div>
      </div>
    </main>
  );
}
