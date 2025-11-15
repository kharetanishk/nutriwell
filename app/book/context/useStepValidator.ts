import { useBookingForm } from "./BookingFormContext";
import { validationConfig } from "./validationConfig";
import { BookingForm } from "./BookingFormContext";

export function useStepValidator(stepId: string) {
  const { form } = useBookingForm();

  const requiredFields = validationConfig[stepId] || [];

  // Returns true/false based on completeness
  function validate() {
    return requiredFields.every((field) => {
      const value = form[field as keyof BookingForm];
      return value !== null && value !== "" && value !== undefined;
    });
  }

  // Returns the first field that is missing
  function getFirstMissingField() {
    return requiredFields.find((field) => {
      const value = form[field as keyof BookingForm];
      return value === null || value === "" || value === undefined;
    });
  }

  return { validate, getFirstMissingField };
}
