"use client";

import React, { ChangeEvent, useState } from "react";
import { useBookingForm } from "../context/BookingFormContext";
import { UploadCloud, X } from "lucide-react";

export default function StepMedical() {
  const { form, setForm } = useBookingForm();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  /* ------------------------------
      HANDLE FILE UPLOAD
  ------------------------------ */
  function handleFiles(selected: FileList) {
    const files = Array.from(selected).filter((f) =>
      f.type.startsWith("image/")
    );

    // Fake small upload progress animation
    setUploadProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) clearInterval(interval);
    }, 60);

    setForm({ reports: files });
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) handleFiles(e.target.files);
  }

  /* ------------------------------
      REMOVE A SINGLE IMAGE
  ------------------------------ */
  function removeImage(index: number) {
    const updated = [...(form.reports || [])];
    updated.splice(index, 1);
    setForm({ reports: updated });
  }

  /* ------------------------------
      DRAG & DROP HANDLER
  ------------------------------ */
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  }

  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold text-slate-800 mb-5">
        Medical & Reports
      </h3>

      <div className="flex flex-col gap-6">
        {/* Medical History (Required) */}
        <textarea
          rows={4}
          className={`w-full border rounded-xl px-4 py-3 text-sm shadow-sm 
             focus:ring-2 focus:ring-emerald-500 
             ${!form.medicalHistory ? "border-red-500" : "border-gray-300"}`}
          placeholder="Medical history (required)"
          value={form.medicalHistory || ""}
          onChange={(e) => setForm({ medicalHistory: e.target.value })}
        />

        {/* UPLOAD AREA */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Upload Medical Reports (optional)
          </label>

          {/* Drag & Drop */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`
              border-2 rounded-xl p-5 text-center transition-all cursor-pointer
              ${
                dragActive
                  ? "border-emerald-600 bg-emerald-50"
                  : "border-gray-300 bg-white"
              }
            `}
          >
            <label
              htmlFor="report-upload"
              className="flex flex-col items-center gap-2"
            >
              <span className="p-3 bg-emerald-50 rounded-full text-emerald-700">
                <UploadCloud size={22} />
              </span>

              <div className="text-sm text-slate-600">
                Tap to upload or drag images here
              </div>

              <div className="text-xs text-slate-400">
                Supports camera · JPG · PNG · HEIC
              </div>

              <input
                id="report-upload"
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                className="hidden"
                onChange={onFileChange}
              />
            </label>
          </div>

          {/* Progress Bar */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          {/* Thumbnails */}
          {form.reports && form.reports.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4">
              {form.reports.map((file, index) => {
                const url = URL.createObjectURL(file);
                return (
                  <div
                    key={index}
                    className="relative group rounded-lg overflow-hidden border"
                  >
                    <img
                      src={url}
                      alt="Uploaded"
                      className="w-full h-24 object-cover"
                    />

                    <button
                      onClick={() => removeImage(index)}
                      className="
                        absolute top-1 right-1 bg-black/50 hover:bg-black 
                        text-white p-1 rounded-full transition
                      "
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Appointment Concerns (Optional) */}
        <textarea
          rows={3}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 shadow-sm"
          placeholder="Appointment concerns (optional)"
          value={form.appointmentConcerns || ""}
          onChange={(e) => setForm({ appointmentConcerns: e.target.value })}
        />
      </div>

      {/* NAVIGATION BUTTONS */}
    </div>
  );
}
