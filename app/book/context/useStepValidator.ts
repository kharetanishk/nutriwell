import { useBookingForm } from "./BookingFormContext";
import { validationConfig } from "./validationConfig";
import { BookingForm } from "./BookingFormContext";

// Allowed step IDs inferred from validationConfig
type StepId = keyof typeof validationConfig;

export function useStepValidator(stepId: StepId) {
  const { form } = useBookingForm();

  const requiredFields = validationConfig[stepId];

  function validate() {
    return requiredFields.every((field) => {
      const value = form[field as keyof BookingForm];
      return value !== null && value !== "" && value !== undefined;
    });
  }

  function getFirstMissingField() {
    return requiredFields.find((field) => {
      const value = form[field as keyof BookingForm];
      return value === null || value === "" || value === undefined;
    });
  }

  function getMissingFields() {
    return requiredFields.filter((field) => {
      const value = form[field as keyof BookingForm];
      return value === null || value === "" || value === undefined;
    });
  }

  function getFieldErrors() {
    const errors: Record<string, string> = {};
    requiredFields.forEach((field) => {
      const value = form[field as keyof BookingForm];
      if (value === null || value === "" || value === undefined) {
        errors[field] = `${toHumanLabel(field)} is required`;
      }
    });
    return errors;
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

  return { validate, getFirstMissingField, getMissingFields, getFieldErrors };
}
