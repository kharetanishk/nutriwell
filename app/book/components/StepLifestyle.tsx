"use client";

import { useBookingForm } from "../context/BookingFormContext";

export default function StepLifestyle() {
  const { form, setForm } = useBookingForm();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Lifestyle & Habits</h3>

      <div className="grid gap-4">
        {/* Bowel Movement (Required) */}
        <label className="text-sm">Bowel movement</label>
        <select
          className={`input ${!form.bowel ? "border-red-500" : ""}`}
          value={form.bowel || ""}
          onChange={(e) => setForm({ bowel: e.target.value })}
        >
          <option value="">Select</option>
          <option>Normal</option>
          <option>Constipation</option>
          <option>Diarrhea</option>
          <option>Irregular</option>
        </select>

        {/* Daily Food (Required) */}
        <textarea
          rows={3}
          className={`input ${!form.dailyFood ? "border-red-500" : ""}`}
          placeholder="Daily food intake (items, quantities & timings)"
          value={form.dailyFood || ""}
          onChange={(e) => setForm({ dailyFood: e.target.value })}
        />

        {/* Water Intake (Required) */}
        <input
          className={`input ${!form.waterIntake ? "border-red-500" : ""}`}
          placeholder="Daily water intake (liters)"
          value={form.waterIntake || ""}
          onChange={(e) => setForm({ waterIntake: e.target.value })}
        />

        {/* Wake + Sleep Time (Required) */}
        <div className="grid grid-cols-2 gap-4">
          <input
            className={`input ${!form.wakeUpTime ? "border-red-500" : ""}`}
            type="time"
            placeholder="Wake up time"
            value={form.wakeUpTime || ""}
            onChange={(e) => setForm({ wakeUpTime: e.target.value })}
          />

          <input
            className={`input ${!form.sleepTime ? "border-red-500" : ""}`}
            type="time"
            placeholder="Sleep time"
            value={form.sleepTime || ""}
            onChange={(e) => setForm({ sleepTime: e.target.value })}
          />
        </div>

        {/* Sleep Quality (Required) */}
        <select
          className={`input ${!form.sleepQuality ? "border-red-500" : ""}`}
          value={form.sleepQuality || ""}
          onChange={(e) => setForm({ sleepQuality: e.target.value })}
        >
          <option value="">Sleep quality</option>
          <option>Normal</option>
          <option>Irregular</option>
          <option>Disturbed</option>
          <option>Insomnia</option>
        </select>
      </div>
    </div>
  );
}
