"use client";

import React from "react";
import { useBookingForm } from "../context/BookingFormContext";

export default function StepMedical() {
  const { form, setForm } = useBookingForm();

  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold text-slate-800 mb-5">
        Medical & Reports
      </h3>

      <div className="flex flex-col gap-6">
        {/* Medical History (Required) */}
        <textarea
          rows={4}
          className={`w-full border rounded-xl px-4 py-3 text-sm shadow-sm 
             focus:ring-2 focus:ring-emerald-500 
             ${!form.medicalHistory ? "border-red-500" : "border-gray-300"}`}
          placeholder="Medical history (required)"
          value={form.medicalHistory || ""}
          onChange={(e) => setForm({ medicalHistory: e.target.value })}
        />
      </div>
    </div>
  );
}
