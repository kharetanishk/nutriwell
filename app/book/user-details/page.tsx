"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import StepPersonal from "../components/StepPersonal";
import StepMeasurements from "../components/StepMeasurements";
import StepMedical from "../components/StepMedical";
import StepLifestyle from "../components/StepLifestyle";
import ReviewStep from "../components/ReviewStep";

import FloatingMiniStepper from "../components/FloatingMiniStepper";
import { useBookingForm } from "../context/BookingFormContext";
import { useStepValidator } from "../context/useStepValidator";

export default function UserDetailsPage() {
  const [internalStep, setInternalStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const total = 5;

  const { form, setForm } = useBookingForm();

  // Load plan + price from URL (ONLY on first visit)
  useEffect(() => {
    if (form.planSlug) return; // prevent override after refresh

    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan");
    const price = params.get("price");

    if (plan) {
      setForm({
        planSlug: plan,
        planName: plan
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        planPrice: price || "0",
      });
    }
  }, []);

  function stepIndexToId(index: number) {
    switch (index) {
      case 1:
        return "user-details";
      case 2:
        return "measurements";
      case 3:
        return "medical";
      case 4:
        return "lifestyle";
      case 5:
        return "lifestyle";
      default:
        return "user-details";
    }
  }

  const stepId = stepIndexToId(internalStep);
  const { validate, getFirstMissingField } = useStepValidator(stepId);

  function next() {
    setError(null);

    const ok = validate();
    if (!ok) {
      const missing = getFirstMissingField();
      setError(
        missing
          ? `Please fill the required field: ${toHumanLabel(missing)}`
          : "Please complete all required fields."
      );
      return;
    }

    if (internalStep >= total) {
      router.push("/book/recall"); // 🔥 FIXED
      return;
    }

    setInternalStep((s) => s + 1);
  }

  function prev() {
    setError(null);
    if (internalStep > 1) setInternalStep((s) => s - 1);
  }

  function toHumanLabel(key: string) {
    const map: Record<string, string> = {
      fullName: "Full name",
      mobile: "Mobile number",
      email: "Email",
      dob: "Date of birth",
      gender: "Gender",
      address: "Address",
      weight: "Weight",
      height: "Height",
      medicalHistory: "Medical history",
      bowel: "Bowel movement",
      dailyFood: "Daily food intake",
      waterIntake: "Water intake",
      wakeUpTime: "Wake up time",
      sleepTime: "Sleep time",
      sleepQuality: "Sleep quality",
    };
    return map[key] || key;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f9fcfa] to-[#f1f7f3] py-13 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto w-full bg-white rounded-2xl p-5 sm:p-7 shadow-[0_3px_20px_rgba(0,0,0,0.08)] relative">
        <FloatingMiniStepper step={internalStep} total={total} />

        {form.planName && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 p-4 rounded-lg text-center sm:text-left">
            <p className="font-semibold text-emerald-900 text-base sm:text-lg">
              Booking: {form.planName}
            </p>
            <p className="text-emerald-700 text-sm sm:text-base">
              Price: ₹{form.planPrice}
            </p>
          </div>
        )}

        <div className="mb-4">
          {internalStep === 1 && <StepPersonal />}
          {internalStep === 2 && <StepMeasurements />}
          {internalStep === 3 && <StepMedical />}
          {internalStep === 4 && <StepLifestyle />}
          {internalStep === 5 && <ReviewStep />}
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={prev}
            disabled={internalStep === 1}
            className="px-4 py-2 rounded-lg border text-sm sm:text-base disabled:opacity-40"
          >
            ← Prev
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 text-sm sm:text-base text-gray-600"
            >
              Cancel
            </button>

            <button
              onClick={next}
              className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm sm:text-base"
            >
              {internalStep === total ? "Proceed to Recall" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
