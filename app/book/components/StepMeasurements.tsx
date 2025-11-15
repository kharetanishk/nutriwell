"use client";

import React from "react";
import { useBookingForm } from "../context/BookingFormContext";

export default function StepMeasurements() {
  const { form, setForm } = useBookingForm();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Body Measurements (cm / kg)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className={`input ${!form.weight ? "border-red-500" : ""}`}
          placeholder="Weight (kg)"
          value={form.weight || ""}
          onChange={(e) => setForm({ weight: e.target.value })}
        />

        <input
          className={`input ${!form.height ? "border-red-500" : ""}`}
          placeholder="Height (cm)"
          value={form.height || ""}
          onChange={(e) => setForm({ height: e.target.value })}
        />

        <input
          className="input"
          placeholder="Neck (cm)"
          value={form.neck || ""}
          onChange={(e) => setForm({ neck: e.target.value })}
        />

        <input
          className="input"
          placeholder="Waist (cm)"
          value={form.waist || ""}
          onChange={(e) => setForm({ waist: e.target.value })}
        />

        <input
          className="input"
          placeholder="Hip (cm)"
          value={form.hip || ""}
          onChange={(e) => setForm({ hip: e.target.value })}
        />

        <p className="text-xs text-slate-500 md:col-span-2">
          Use measuring tape — enter in centimeters.
        </p>
      </div>

      {/* NEXT + BACK BUTTONS */}
    </div>
  );
}
