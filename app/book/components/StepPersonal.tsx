"use client";

import React, { useEffect } from "react";
import { useBookingForm } from "../context/BookingFormContext";
import { calcAgeFromDOB } from "../utilis/calcAge";


export default function StepPersonal() {
  const { form, setForm } = useBookingForm();

  useEffect(() => {
    if (!form.dob) return;
    const age = calcAgeFromDOB(form.dob);
    if (age !== undefined) setForm({ age });
  }, [form.dob]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Personal Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="input"
          placeholder="Full name"
          value={form.fullName || ""}
          onChange={(e) => setForm({ fullName: e.target.value })}
        />

        <input
          className="input"
          placeholder="Mobile number"
          value={form.mobile || ""}
          onChange={(e) => setForm({ mobile: e.target.value })}
        />

        <input
          className="input"
          placeholder="Email"
          type="email"
          value={form.email || ""}
          onChange={(e) => setForm({ email: e.target.value })}
        />

        <input
          className="input"
          type="date"
          placeholder="Date of birth"
          value={form.dob || ""}
          onChange={(e) => setForm({ dob: e.target.value })}
        />

        {/* AGE should be readOnly */}
        <input
          className="input"
          placeholder="Age"
          value={form.age ?? ""}
          readOnly
        />

        <select
          className="input"
          value={form.gender || ""}
          onChange={(e) => setForm({ gender: e.target.value })}
        >
          <option value="">Select gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <input
          className="input md:col-span-2"
          placeholder="Address"
          value={form.address || ""}
          onChange={(e) => setForm({ address: e.target.value })}
        />
      </div>

      {/* Add this below inputs */}
     
    </div>
  );
}
