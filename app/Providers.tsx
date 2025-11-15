"use client";

import { BookingFormProvider } from "./book/context/BookingFormContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <BookingFormProvider>{children}</BookingFormProvider>;
}
