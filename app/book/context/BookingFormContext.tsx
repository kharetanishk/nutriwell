"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type BookingForm = {
  fullName: string | null;
  mobile: string | null;
  email: string | null;
  dob: string | null;
  age: number | null;
  gender: string | null;
  address: string | null;

  weight: string | null;
  height: string | null;
  neck: string | null;
  waist: string | null;
  hip: string | null;

  medicalHistory: string | null;
  reports?: File[];
  appointmentConcerns: string | null;

  bowel: string | null;
  dailyFood: string | null;
  waterIntake: string | null;
  wakeUpTime: string | null;
  sleepTime: string | null;
  sleepQuality: string | null;

  planSlug: string | null;
  planName: string | null;
  planPrice: string | null;
  planPriceRaw: number | null;
  planPackageName: string | null;
  planPackageDuration: string | null;

  appointmentMode?: string | null;
  appointmentDate?: string | null;
  appointmentTime?: string | null;
};

const initialForm: BookingForm = {
  fullName: null,
  mobile: null,
  email: null,
  dob: null,
  age: null,
  gender: null,
  address: null,

  weight: null,
  height: null,
  neck: null,
  waist: null,
  hip: null,

  medicalHistory: null,
  reports: [],
  appointmentConcerns: null,

  bowel: null,
  dailyFood: null,
  waterIntake: null,
  wakeUpTime: null,
  sleepTime: null,
  sleepQuality: null,

  planSlug: null,
  planName: null,
  planPrice: null,
  planPriceRaw: null,
  planPackageName: null,
  planPackageDuration: null,

  appointmentMode: null,
  appointmentDate: null,
  appointmentTime: null,
};

type ContextType = {
  form: BookingForm;
  setForm: (data: Partial<BookingForm>) => void;
  resetForm: () => void;
};

const BookingFormContext = createContext<ContextType | undefined>(undefined);

export function BookingFormProvider({ children }: { children: ReactNode }) {
  const [form, setFormState] = useState<BookingForm>(initialForm);
  const [loaded, setLoaded] = useState(false);

  // Load on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bookingForm");
      if (saved) {
        setFormState({ ...initialForm, ...JSON.parse(saved) });
      }
    } catch (err) {
      console.error("Form restore error:", err);
    }
    setLoaded(true);
  }, []);

  // Save on change
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem("bookingForm", JSON.stringify(form));
    } catch (err) {
      console.error("Form save error:", err);
    }
  }, [form, loaded]);

  function setForm(data: Partial<BookingForm>) {
    setFormState((prev) => ({ ...prev, ...data }));
  }

  function resetForm() {
    setFormState(initialForm);
    localStorage.removeItem("bookingForm");
  }

  if (!loaded) return null; // prevent hydration mismatch

  return (
    <BookingFormContext.Provider value={{ form, setForm, resetForm }}>
      {children}
    </BookingFormContext.Provider>
  );
}

export function useBookingForm() {
  const ctx = useContext(BookingFormContext);
  if (!ctx)
    throw new Error("useBookingForm must be used inside BookingFormProvider");
  return ctx;
}
