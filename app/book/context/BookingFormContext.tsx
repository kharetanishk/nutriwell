"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

/* -------------------------------------------------
    BOOKING FORM TYPE (NULLABLE FIELDS)
--------------------------------------------------*/
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
};

/* -------------------------------------------------
    INITIAL STATE
--------------------------------------------------*/
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
};

/* -------------------------------------------------
    CONTEXT TYPE
--------------------------------------------------*/
type ContextType = {
  form: BookingForm;
  setForm: (data: Partial<BookingForm>) => void;
  resetForm: () => void;
};

const BookingFormContext = createContext<ContextType | undefined>(undefined);

/* -------------------------------------------------
    PROVIDER WITH LOCAL STORAGE SYNC
--------------------------------------------------*/
export function BookingFormProvider({ children }: { children: ReactNode }) {
  const [form, setFormState] = useState<BookingForm>(initialForm);
  const [loaded, setLoaded] = useState(false); // hydration-safe flag

  // 1️⃣ Load data from localStorage on mount (CSR ONLY)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bookingForm");
      if (saved) {
        setFormState(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed loading saved booking form:", error);
    }
    setLoaded(true);
  }, []);

  // 2️⃣ Save into localStorage whenever form changes
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("bookingForm", JSON.stringify(form));
    }
  }, [form, loaded]);

  function setForm(data: Partial<BookingForm>) {
    setFormState((prev) => ({ ...prev, ...data }));
  }

  function resetForm() {
    setFormState(initialForm);
    localStorage.removeItem("bookingForm");
  }

  // Avoid hydration mismatch by not rendering children until loaded
  if (!loaded) return null;

  return (
    <BookingFormContext.Provider value={{ form, setForm, resetForm }}>
      {children}
    </BookingFormContext.Provider>
  );
}

/* -------------------------------------------------
    HOOK
--------------------------------------------------*/
export function useBookingForm() {
  const ctx = useContext(BookingFormContext);
  if (!ctx)
    throw new Error("useBookingForm must be used inside BookingFormProvider");
  return ctx;
}
