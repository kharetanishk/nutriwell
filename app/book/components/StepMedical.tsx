"use client";

import React from "react";
import { useBookingForm } from "../context/BookingFormContext";

interface StepMedicalProps {
  error?: string | null;
  fieldErrors?: Record<string, string>;
}

export default function StepMedical({ error, fieldErrors }: StepMedicalProps) {
  const { form, setForm } = useBookingForm();

  const hasError = !form.medicalHistory || fieldErrors?.medicalHistory;

  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold text-slate-800 mb-5">
        Medical History
      </h3>

      <div className="flex flex-col gap-4">
        {/* Medical History (Required) */}
        <div>
          <textarea
            rows={6}
            className={`w-full border rounded-xl px-4 py-3 text-sm shadow-sm 
               focus:ring-2 focus:ring-emerald-500 focus:outline-none
               resize-y min-h-[120px] max-h-[300px]
               ${
                 hasError
                   ? "border-red-500 focus:ring-red-500"
                   : "border-gray-300"
               }`}
            placeholder="Enter your medical history (required)"
            value={form.medicalHistory || ""}
            onChange={(e) => setForm({ medicalHistory: e.target.value })}
            style={{ wordWrap: "break-word", overflowWrap: "break-word" }}
          />
          {(fieldErrors?.medicalHistory || (hasError && error)) && (
            <p className="mt-2 text-sm text-red-600">
              {fieldErrors?.medicalHistory || "Medical history is required"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
