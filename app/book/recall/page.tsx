"use client";

import React, { useEffect } from "react";
import { useBookingForm } from "../context/BookingFormContext";
import { useRouter } from "next/navigation";

export default function RecallPage() {
  const { form } = useBookingForm();
  const router = useRouter();

  /* -------------------------------------------------
      1️⃣ BLOCK DIRECT ACCESS (NO PLAN? → GO BACK)
  --------------------------------------------------*/
  useEffect(() => {
    if (!form.planSlug || !form.planName || !form.planPrice) {
      router.replace("/services");
    }
  }, [form]);

  /* -------------------------------------------------
      ACTIONS
  --------------------------------------------------*/
  function goToSlotSelection() {
    router.push("/book/slot");
  }

  function goBack() {
    router.push("/book/user-details"); // safer than router.back()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f9fcfa] to-[#f1f7f3] py-10 px-4 sm:px-6 flex justify-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        {/* -------------------------------------------------
            PLAN BANNER
        -------------------------------------------------- */}
        {form.planName && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
            <p className="font-semibold text-emerald-900 text-lg">
              Booking: {form.planName}
              {form.planPackageName ? ` — ${form.planPackageName}` : ""}
            </p>
            <p className="text-emerald-700 text-sm">Price: {form.planPrice}</p>
          </div>
        )}

        {/* -------------------------------------------------
            TITLE
        -------------------------------------------------- */}
        <h2 className="text-2xl font-semibold text-emerald-700 mb-4">
          Final Review
        </h2>

        <p className="text-sm text-slate-600 mb-6">
          Please verify your details before continuing to slot selection.
        </p>

        {/* -------------------------------------------------
            DETAILS SECTIONS
        -------------------------------------------------- */}
        <div className="space-y-6">
          <Section title="Personal Details">
            <Item label="Full Name" value={form.fullName} />
            <Item label="Mobile" value={form.mobile} />
            <Item label="Email" value={form.email} />
            <Item label="Date of Birth" value={form.dob} />
            <Item label="Age" value={form.age ? form.age.toString() : "—"} />
            <Item label="Gender" value={form.gender} />
            <Item label="Address" value={form.address} />
          </Section>

          <Section title="Body Measurements">
            <Item label="Weight" value={form.weight} />
            <Item label="Height" value={form.height} />
            <Item label="Neck" value={form.neck} />
            <Item label="Waist" value={form.waist} />
            <Item label="Hip" value={form.hip} />
          </Section>

          <Section title="Medical Details">
            <Item label="Medical History" value={form.medicalHistory} />
            <Item
              label="Appointment Concerns"
              value={form.appointmentConcerns}
            />
            <Item
              label="Reports"
              value={
                form.reports?.length
                  ? `${form.reports.length} file(s)`
                  : "No reports uploaded"
              }
            />
          </Section>

          <Section title="Lifestyle & Habits">
            <Item label="Bowel Movement" value={form.bowel} />
            <Item label="Daily Food Intake" value={form.dailyFood} />
            <Item label="Water Intake" value={form.waterIntake} />
            <Item label="Wake Up Time" value={form.wakeUpTime} />
            <Item label="Sleep Time" value={form.sleepTime} />
            <Item label="Sleep Quality" value={form.sleepQuality} />
          </Section>
        </div>

        {/* -------------------------------------------------
            NAVIGATION BUTTONS
        -------------------------------------------------- */}
        <div className="flex justify-between mt-8">
          <button
            onClick={goBack}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            ← Back
          </button>

          <button
            onClick={goToSlotSelection}
            className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:brightness-110"
          >
            Proceed to Slot Selection →
          </button>
        </div>
      </div>
    </main>
  );
}

/* -------------------------------------------------
    UI SUBCOMPONENTS
-------------------------------------------------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
      <h3 className="font-semibold text-slate-800 mb-3">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Item({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="text-slate-900 font-medium">{value ? value : "—"}</span>
    </div>
  );
}
