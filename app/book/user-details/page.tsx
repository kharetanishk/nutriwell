"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createPatient } from "@/lib/patient";
import toast from "react-hot-toast";

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
  const [isCreatingPatient, setIsCreatingPatient] = useState(false);

  const router = useRouter();
  const total = 5;

  const { form, setForm } = useBookingForm();

  /* -------------------------------------------------
      1️⃣ IF NO PLAN SELECTED → BLOCK PAGE
  --------------------------------------------------*/
  useEffect(() => {
    if (!form.planSlug || !form.planName || !form.planPrice) {
      router.replace("/services");
    }
  }, [form]);

  /* -------------------------------------------------
      STEP-ID MAPPER
  --------------------------------------------------*/
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
        return null; // review step → no validation needed
      default:
        return "user-details";
    }
  }

  const stepId = stepIndexToId(internalStep);

  // Only use validator for steps 1–4
  const validator = stepId ? useStepValidator(stepId) : null;
  const validate = validator?.validate;
  const getFirstMissingField = validator?.getFirstMissingField;

  /* -------------------------------------------------
      NEXT BUTTON
  --------------------------------------------------*/
  async function next() {
    setError(null);

    // Only validate if validator exists (steps 1–4)
    if (validate) {
      const ok = validate();
      if (!ok) {
        const missing = getFirstMissingField?.();
        setError(
          missing
            ? `Please fill the required field: ${toHumanLabel(missing)}`
            : "Please complete all required fields."
        );
        return;
      }
    }

    // If on last step (review), create patient and proceed to recall
    if (internalStep >= total) {
      console.log("[PATIENT CREATION] User clicked 'Proceed to Recall'");
      console.log("[PATIENT CREATION] Current form state:", {
        patientId: form.patientId,
        planSlug: form.planSlug,
        planName: form.planName,
        hasAllFields: !!(form.fullName && form.mobile && form.email),
      });

      // IMPORTANT: Always create a new patient when user fills the form and proceeds to recall
      // Clear any stale patientId from localStorage/form state before creating new patient
      if (form.patientId) {
        console.log(
          "[PATIENT CREATION] Clearing stale patientId:",
          form.patientId
        );
        setForm({ patientId: null });
      }

      console.log("[PATIENT CREATION] Creating new patient from form data");

      // Create a new patient from the form data when user clicks "Proceed to Recall"

      // Validate all required fields (matching Prisma schema)
      // Required: name, phone, gender, email, dateOfBirth, age, address,
      // weight, height, neck, waist, hip, bowelMovement, foodPreference,
      // dailyWaterIntake, wakeUpTime, sleepTime, sleepQuality
      const missingFields: string[] = [];

      if (!form.fullName) missingFields.push("Full name");
      if (!form.mobile) missingFields.push("Mobile number");
      if (!form.email) missingFields.push("Email");
      if (!form.dob) missingFields.push("Date of birth");
      if (!form.age) missingFields.push("Age");
      if (!form.gender) missingFields.push("Gender");
      if (!form.address) missingFields.push("Address");
      if (!form.weight) missingFields.push("Weight");
      if (!form.height) missingFields.push("Height");
      if (!form.neck) missingFields.push("Neck measurement");
      if (!form.waist) missingFields.push("Waist measurement");
      if (!form.hip) missingFields.push("Hip measurement");
      if (!form.bowel) missingFields.push("Bowel movement");
      if (!form.foodPreference) missingFields.push("Food preference");
      if (!form.waterIntake) missingFields.push("Water intake");
      if (!form.wakeUpTime) missingFields.push("Wake up time");
      if (!form.sleepTime) missingFields.push("Sleep time");
      if (!form.sleepQuality) missingFields.push("Sleep quality");

      if (missingFields.length > 0) {
        const errorMsg = `Please complete the following required fields: ${missingFields.join(
          ", "
        )}`;
        console.error(
          "[PATIENT CREATION] Missing required fields:",
          missingFields
        );
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      console.log("[PATIENT CREATION] All required fields validated");

      setIsCreatingPatient(true);
      setError(null);

      try {
        console.log("[PATIENT CREATION] Starting patient creation API call...");
        // Map food preference from form to backend format
        // Backend enum: VEG, NON_VEG, EGG_VEG (with underscores)
        const foodPreferenceMap: Record<string, string> = {
          Vegetarian: "VEG",
          "Non-Vegetarian": "NON_VEG",
          "Egg & Veg": "EGG_VEG",
        };
        const mappedFoodPreference =
          form.foodPreference && foodPreferenceMap[form.foodPreference]
            ? foodPreferenceMap[form.foodPreference]
            : "VEG"; // Default to VEG

        // Map form fields to backend schema
        // At this point, all required fields are validated and not null
        const patientData = {
          name: form.fullName!,
          phone: form.mobile!.replace(/\D/g, ""), // Remove non-digits
          gender: form.gender!.toUpperCase() as "MALE" | "FEMALE" | "OTHER", // MALE, FEMALE, OTHER
          email: form.email!,
          dateOfBirth: form.dob!,
          age: Number(form.age!),
          address: form.address!,
          weight: Number(form.weight!),
          height: Number(form.height!),
          neck: Number(form.neck!),
          waist: Number(form.waist!),
          hip: Number(form.hip!),
          medicalHistory: form.medicalHistory || undefined,
          appointmentConcerns: form.appointmentConcerns || undefined,
          bowelMovement: form.bowel!.toUpperCase() as
            | "NORMAL"
            | "CONSTIPATION"
            | "DIARRHEA"
            | "IRREGULAR", // NORMAL, CONSTIPATION, etc.
          foodPreference: mappedFoodPreference as "VEG" | "NON_VEG" | "EGG_VEG",
          allergic: form.allergiesIntolerance || undefined,
          dailyFoodIntake: form.dailyFood || undefined,
          dailyWaterIntake: Number(form.waterIntake!),
          wakeUpTime: form.wakeUpTime!,
          sleepTime: form.sleepTime!,
          sleepQuality: form.sleepQuality!.toUpperCase() as
            | "NORMAL"
            | "IRREGULAR"
            | "DISTURBED"
            | "INSOMNIA", // NORMAL, IRREGULAR, etc.
          fileIds: [], // Files will be uploaded in recall page
        };

        console.log("[PATIENT CREATION] Sending patient data to backend:", {
          ...patientData,
          phone: patientData.phone.substring(0, 3) + "****", // Mask phone for privacy
        });

        const response = await createPatient(patientData);

        console.log("[PATIENT CREATION] Backend response:", {
          success: response.success,
          message: response.message,
          patientId: response.patient?.id,
          fullResponse: response,
        });

        if (response.success && response.patient?.id) {
          console.log(
            "[PATIENT CREATION] Patient created successfully with ID:",
            response.patient.id
          );
          // Update form with the created patient ID and ensure plan details are preserved
          const updatedFormData = {
            patientId: response.patient.id,
            // Preserve all plan details
            planSlug: form.planSlug,
            planName: form.planName,
            planPrice: form.planPrice,
            planPriceRaw: form.planPriceRaw,
            planPackageName: form.planPackageName,
            planPackageDuration: form.planPackageDuration,
          };

          console.log(
            "[PATIENT CREATION] Updating form context with patientId:",
            updatedFormData
          );
          setForm(updatedFormData);

          console.log(
            "[PATIENT CREATION] Form updated, navigating to recall page"
          );
          toast.success("Patient details saved successfully!");
          router.push("/book/recall");
        } else {
          console.error(
            "[PATIENT CREATION] Response indicates failure:",
            response
          );
          throw new Error(response.message || "Failed to create patient");
        }
      } catch (error: any) {
        console.error("[PATIENT CREATION] Error creating patient:", error);
        console.error("[PATIENT CREATION] Error details:", {
          message: error?.message,
          response: error?.response?.data,
          status: error?.response?.status,
          statusText: error?.response?.statusText,
        });

        // Extract detailed error message
        let errorMessage = "Failed to save patient details. Please try again.";

        if (error?.response?.data) {
          const data = error.response.data;

          // Handle Zod validation errors
          if (data.errors && Array.isArray(data.errors)) {
            const validationErrors = data.errors
              .map((err: any) => {
                if (typeof err === "string") return err;
                if (err.path && err.message) {
                  return `${err.path.join(".")}: ${err.message}`;
                }
                return err.message || JSON.stringify(err);
              })
              .join(", ");
            errorMessage = `Validation errors: ${validationErrors}`;
          } else if (data.message) {
            errorMessage = data.message;
          } else if (data.error) {
            errorMessage = data.error;
          }
        } else if (error?.message) {
          errorMessage = error.message;
        }

        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsCreatingPatient(false);
      }
      return;
    }

    setInternalStep((s) => s + 1);
  }

  /* -------------------------------------------------
      PREV BUTTON
  --------------------------------------------------*/
  function prev() {
    setError(null);
    if (internalStep > 1) setInternalStep((s) => s - 1);
  }

  /* -------------------------------------------------
      LABEL NORMALIZER
  --------------------------------------------------*/
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
        {/* Mini Stepper */}
        <FloatingMiniStepper step={internalStep} total={total} />

        {/* Plan Banner */}
        {form.planName && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 p-4 rounded-lg text-center sm:text-left">
            <p className="font-semibold text-emerald-900 text-base sm:text-lg">
              Booking: {form.planName}
              {form.planPackageName ? ` — ${form.planPackageName}` : ""}
            </p>
            <p className="text-emerald-700 text-sm sm:text-base">
              Price: {form.planPrice}
            </p>
          </div>
        )}

        {/* Steps */}
        <div className="mb-4">
          {internalStep === 1 && <StepPersonal />}
          {internalStep === 2 && <StepMeasurements />}
          {internalStep === 3 && <StepMedical />}
          {internalStep === 4 && <StepLifestyle />}
          {internalStep === 5 && <ReviewStep />}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded">
            {error}
          </div>
        )}

        {/* Navigation */}
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
              onClick={() => router.push("/services")}
              className="px-4 py-2 text-sm sm:text-base text-gray-600"
            >
              Cancel
            </button>

            <button
              onClick={next}
              disabled={isCreatingPatient}
              className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isCreatingPatient ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Patient...
                </>
              ) : internalStep === total ? (
                "Proceed to Recall"
              ) : (
                "Next"
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
