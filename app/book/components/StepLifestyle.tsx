"use client";

import { useBookingForm } from "../context/BookingFormContext";

interface StepLifestyleProps {
  error?: string | null;
  fieldErrors?: Record<string, string>;
  showErrors?: boolean;
}

export default function StepLifestyle({
  error,
  fieldErrors,
  showErrors = false,
}: StepLifestyleProps) {
  const { form, setForm } = useBookingForm();

  const hasError = (field: string) => {
    return showErrors && !form[field as keyof typeof form];
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Lifestyle & Habits</h3>

      <div className="grid gap-5">
        {/* Bowel Movement */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Bowel movement
          </label>
          <select
            className={`input ${fieldErrors?.bowel ? "border-red-500" : ""}`}
            value={form.bowel || ""}
            onChange={(e) => setForm({ bowel: e.target.value })}
          >
            <option value="">Select</option>
            <option>Normal</option>
            <option>Constipation</option>
            <option>Diarrhea</option>
            <option>Irregular</option>
          </select>

          {fieldErrors?.bowel && (
            <p className="text-xs text-red-600 mt-1">{fieldErrors.bowel}</p>
          )}
          {hasError("bowel") && !fieldErrors?.bowel && (
            <p className="text-xs text-red-600 mt-1">This field is required.</p>
          )}
        </div>

        {/* Daily Food Intake */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Daily food intake
          </label>
          <textarea
            rows={3}
            className={`input ${
              fieldErrors?.dailyFood ? "border-red-500" : ""
            }`}
            placeholder="What do you eat throughout the day?"
            value={form.dailyFood || ""}
            onChange={(e) => setForm({ dailyFood: e.target.value })}
          />

          {fieldErrors?.dailyFood && (
            <p className="text-xs text-red-600 mt-1">{fieldErrors.dailyFood}</p>
          )}
          {hasError("dailyFood") && !fieldErrors?.dailyFood && (
            <p className="text-xs text-red-600 mt-1">
              Please enter your daily food intake.
            </p>
          )}
        </div>

        {/* Food Preference */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Food preference
          </label>
          <select
            className="input"
            value={form.foodPreference || ""}
            onChange={(e) => setForm({ foodPreference: e.target.value })}
          >
            <option value="">Select</option>
            <option>Vegetarian</option>
            <option>Non-Vegetarian</option>
            <option>Egg & Veg</option>
          </select>
        </div>

        {/* Allergies / Food Intolerance */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Allergies / food intolerances (if any)
          </label>
          <textarea
            rows={2}
            className="input"
            placeholder="e.g., lactose, gluten, soya"
            value={form.allergiesIntolerance || ""}
            onChange={(e) => setForm({ allergiesIntolerance: e.target.value })}
          />
        </div>

        {/* Water Intake */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Water intake (liters)
          </label>
          <input
            className={`input ${
              fieldErrors?.waterIntake ? "border-red-500" : ""
            }`}
            type="number"
            inputMode="decimal"
            placeholder="e.g., 2.5"
            min={0}
            step="0.1"
            value={form.waterIntake || ""}
            onChange={(e) => {
              const value = e.target.value;
              // Prevent negative numbers - only allow empty string or non-negative numbers
              if (value === "" || (value !== "-" && parseFloat(value) >= 0)) {
                setForm({ waterIntake: value });
              }
            }}
          />

          {fieldErrors?.waterIntake && (
            <p className="text-xs text-red-600 mt-1">
              {fieldErrors.waterIntake}
            </p>
          )}
          {hasError("waterIntake") && !fieldErrors?.waterIntake && (
            <p className="text-xs text-red-600 mt-1">
              Enter water intake in liters.
            </p>
          )}
        </div>

        {/* Wake & Sleep Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Wake Up */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Wake up time
            </label>
            <input
              type="time"
              className={`input ${
                fieldErrors?.wakeUpTime ? "border-red-500" : ""
              }`}
              value={form.wakeUpTime || ""}
              onChange={(e) => setForm({ wakeUpTime: e.target.value })}
            />

            {fieldErrors?.wakeUpTime && (
              <p className="text-xs text-red-600 mt-1">
                {fieldErrors.wakeUpTime}
              </p>
            )}
            {hasError("wakeUpTime") && !fieldErrors?.wakeUpTime && (
              <p className="text-xs text-red-600 mt-1">Select wake up time.</p>
            )}
          </div>

          {/* Sleep Time */}
          <div>
            <label className="block text-sm font-medium mb-1">Sleep time</label>
            <input
              type="time"
              className={`input ${
                fieldErrors?.sleepTime ? "border-red-500" : ""
              }`}
              value={form.sleepTime || ""}
              onChange={(e) => setForm({ sleepTime: e.target.value })}
            />

            {fieldErrors?.sleepTime && (
              <p className="text-xs text-red-600 mt-1">
                {fieldErrors.sleepTime}
              </p>
            )}
            {hasError("sleepTime") && !fieldErrors?.sleepTime && (
              <p className="text-xs text-red-600 mt-1">Select sleep time.</p>
            )}
          </div>
        </div>

        {/* Sleep Quality */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Sleep quality
          </label>
          <select
            className={`input ${
              fieldErrors?.sleepQuality ? "border-red-500" : ""
            }`}
            value={form.sleepQuality || ""}
            onChange={(e) => setForm({ sleepQuality: e.target.value })}
          >
            <option value="">Select</option>
            <option>Normal</option>
            <option>Irregular</option>
            <option>Disturbed</option>
            <option>Insomnia</option>
          </select>

          {fieldErrors?.sleepQuality && (
            <p className="text-xs text-red-600 mt-1">
              {fieldErrors.sleepQuality}
            </p>
          )}
          {hasError("sleepQuality") && !fieldErrors?.sleepQuality && (
            <p className="text-xs text-red-600 mt-1">This field is required.</p>
          )}
        </div>
      </div>
    </div>
  );
}
