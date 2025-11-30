"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import {
  getDoctorFieldGroups,
  searchDoctorFields,
  saveDoctorSession,
  type DoctorFieldMaster,
  type DoctorFieldGroup,
  type DoctorFormFieldValue,
} from "@/lib/doctor-notes";
import { getAppointmentDetails } from "@/lib/appointments-admin";
import {
  X,
  Plus,
  Search,
  Loader2,
  Stethoscope,
  Save,
  ChevronLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import SuccessNotification from "@/components/SuccessNotification";

interface FieldValue {
  fieldId: string;
  value: {
    stringValue?: string | null;
    numberValue?: number | null;
    booleanValue?: boolean | null;
    dateValue?: string | null;
    timeValue?: string | null;
    jsonValue?: any;
    notes?: string | null;
  };
}

export default function DoctorNotesPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const appointmentId = params.id as string;

  const [groups, setGroups] = useState<DoctorFieldGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddField, setShowAddField] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DoctorFieldMaster[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
  const [fieldValues, setFieldValues] = useState<Record<string, FieldValue>>(
    {}
  );
  const [notes, setNotes] = useState("");
  const [patientId, setPatientId] = useState<string>("");
  const [patientName, setPatientName] = useState<string>("");
  const [planName, setPlanName] = useState<string>("");
  const [existingSession, setExistingSession] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "ADMIN") {
      router.replace("/");
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === "ADMIN" && appointmentId) {
      loadAppointmentData();
      loadFieldGroups();
    }
  }, [appointmentId, user]);

  // Disable body scroll when search modal is open
  useEffect(() => {
    if (showAddField) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [showAddField]);

  async function loadAppointmentData() {
    try {
      const response = await getAppointmentDetails(appointmentId);
      setPatientId(response.appointment.patient.id);
      setPatientName(response.appointment.patient.name);
      setPlanName(response.appointment.planName);

      if (
        response.appointment.DoctorFormSession &&
        response.appointment.DoctorFormSession.length > 0
      ) {
        const session = response.appointment.DoctorFormSession[0];
        setExistingSession(session);
        setNotes(session.notes || "");

        // Load existing values
        const values: Record<string, FieldValue> = {};
        const selected = new Set<string>();
        session.values.forEach((v: any) => {
          selected.add(v.fieldId);
          values[v.fieldId] = {
            fieldId: v.fieldId,
            value: {
              stringValue: v.stringValue ?? null,
              numberValue: v.numberValue ?? null,
              booleanValue: v.booleanValue ?? null,
              dateValue: v.dateValue ?? null,
              timeValue: v.timeValue ?? null,
              jsonValue: v.jsonValue ?? null,
              notes: v.notes ?? null,
            },
          };
        });
        setFieldValues(values);
        setSelectedFields(selected);
      }
    } catch (error: any) {
      console.error("Failed to load appointment data:", error);
      toast.error("Failed to load appointment data");
    }
  }

  async function loadFieldGroups() {
    setLoading(true);
    try {
      const response = await getDoctorFieldGroups();
      setGroups(response.groups);

      // If no existing session, pre-select some common fields
      if (!existingSession && response.groups.length > 0) {
        const commonFields = response.groups[0].fields.slice(0, 5);
        const initialSelected = new Set(commonFields.map((f) => f.id));
        setSelectedFields(initialSelected);
      }
    } catch (error: any) {
      console.error("Failed to load field groups:", error);
      toast.error("Failed to load form fields");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(query: string) {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await searchDoctorFields(query);
      setSearchResults(response.fields);
    } catch (error: any) {
      console.error("Failed to search fields:", error);
      toast.error("Failed to search fields");
    } finally {
      setSearching(false);
    }
  }

  function addField(field: DoctorFieldMaster) {
    if (selectedFields.has(field.id)) return;
    setSelectedFields((prev) => new Set([...prev, field.id]));
    if (!fieldValues[field.id]) {
      setFieldValues((prev) => ({
        ...prev,
        [field.id]: {
          fieldId: field.id,
          value: {},
        },
      }));
    }
    setShowAddField(false);
    setSearchQuery("");
    setSearchResults([]);
  }

  function removeField(fieldId: string) {
    setSelectedFields((prev) => {
      const next = new Set(prev);
      next.delete(fieldId);
      return next;
    });
    setFieldValues((prev) => {
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  }

  function updateFieldValue(
    fieldId: string,
    value: Partial<FieldValue["value"]>
  ) {
    setFieldValues((prev) => ({
      ...prev,
      [fieldId]: {
        fieldId,
        value: {
          ...prev[fieldId]?.value,
          ...value,
        },
      },
    }));
  }

  function getFieldValue(fieldId: string, type: string) {
    const fv = fieldValues[fieldId];
    if (!fv) return null;

    switch (type) {
      case "TEXT":
      case "TEXTAREA":
        return fv.value.stringValue || "";
      case "NUMBER":
        return fv.value.numberValue ?? "";
      case "BOOLEAN":
        return fv.value.booleanValue ?? null;
      case "DATE":
        return fv.value.dateValue || "";
      case "TIME":
        return fv.value.timeValue || "";
      case "SELECT":
      case "RADIO":
        return fv.value.stringValue || "";
      case "MULTISELECT":
        return fv.value.jsonValue || [];
      default:
        return null;
    }
  }

  async function handleSave() {
    if (!patientId) {
      toast.error("Patient ID is missing");
      return;
    }

    setSaving(true);
    try {
      const fieldValuesArray = Object.values(fieldValues).filter((fv) =>
        selectedFields.has(fv.fieldId)
      );

      await saveDoctorSession({
        appointmentId,
        patientId,
        title: "Doctor Notes",
        notes,
        fieldValues: fieldValuesArray,
      });

      setShowSuccess(true);
      setTimeout(() => {
        router.push(`/admin/appointments/${appointmentId}`);
      }, 1500);
    } catch (error: any) {
      console.error("Failed to save doctor notes:", error);
      toast.error(
        error?.response?.data?.error || "Failed to save doctor notes"
      );
    } finally {
      setSaving(false);
    }
  }

  function renderFieldInput(field: DoctorFieldMaster) {
    const value = getFieldValue(field.id, field.type);

    switch (field.type) {
      case "TEXT":
        return (
          <input
            type="text"
            value={value || ""}
            onChange={(e) =>
              updateFieldValue(field.id, { stringValue: e.target.value })
            }
            placeholder={field.placeholder || field.label}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        );

      case "TEXTAREA":
        return (
          <textarea
            value={value || ""}
            onChange={(e) =>
              updateFieldValue(field.id, { stringValue: e.target.value })
            }
            placeholder={field.placeholder || field.label}
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        );

      case "NUMBER":
        return (
          <input
            type="number"
            value={value ?? ""}
            onChange={(e) =>
              updateFieldValue(field.id, {
                numberValue: e.target.value ? parseFloat(e.target.value) : null,
              })
            }
            placeholder={field.placeholder || field.label}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        );

      case "BOOLEAN":
        return (
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={value === true}
                onChange={() =>
                  updateFieldValue(field.id, { booleanValue: true })
                }
                className="w-4 h-4 text-emerald-600"
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={value === false}
                onChange={() =>
                  updateFieldValue(field.id, { booleanValue: false })
                }
                className="w-4 h-4 text-emerald-600"
              />
              <span>No</span>
            </label>
          </div>
        );

      case "DATE":
        return (
          <input
            type="date"
            value={value || ""}
            onChange={(e) =>
              updateFieldValue(field.id, { dateValue: e.target.value })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        );

      case "TIME":
        return (
          <input
            type="time"
            value={value || ""}
            onChange={(e) =>
              updateFieldValue(field.id, { timeValue: e.target.value })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        );

      case "SELECT":
        return (
          <select
            value={value || ""}
            onChange={(e) =>
              updateFieldValue(field.id, { stringValue: e.target.value })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">Select an option</option>
            {field.options.map((opt) => (
              <option key={opt.id} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "RADIO":
        return (
          <div className="space-y-2">
            {field.options.map((opt) => (
              <label
                key={opt.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name={`field-${field.id}`}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={() =>
                    updateFieldValue(field.id, { stringValue: opt.value })
                  }
                  className="w-4 h-4 text-emerald-600"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case "MULTISELECT":
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            {field.options.map((opt) => (
              <label
                key={opt.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(opt.value)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...selectedValues, opt.value]
                      : selectedValues.filter((v) => v !== opt.value);
                    updateFieldValue(field.id, { jsonValue: newValues });
                  }}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  }

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white to-emerald-50/40 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-emerald-50/40 px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push(`/admin/appointments/${appointmentId}`)}
            className="text-emerald-600 hover:text-emerald-700 mb-4 flex items-center gap-2 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Appointment Details
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Stethoscope className="w-8 h-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-slate-900">
              Add Doctor Notes
            </h1>
          </div>
          {patientName && planName ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mt-4">
              <p className="text-emerald-900 font-medium">
                Adding notes for{" "}
                <span className="font-semibold">{patientName}</span> for{" "}
                <span className="font-semibold">{planName}</span> plan
              </p>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-4 animate-pulse">
              <div className="h-5 bg-slate-200 rounded w-64"></div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {loading ? (
            <div className="space-y-6">
              {/* Skeleton Loaders */}
              <div className="space-y-4">
                <div className="h-6 bg-slate-200 rounded w-32 animate-pulse"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="border border-slate-200 rounded-lg p-4 space-y-3"
                    >
                      <div className="h-4 bg-slate-200 rounded w-48 animate-pulse"></div>
                      <div className="h-10 bg-slate-200 rounded w-full animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-32 animate-pulse"></div>
                <div className="h-24 bg-slate-200 rounded w-full animate-pulse"></div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Add Field Button */}
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-slate-900">
                  Form Fields
                </h4>
                <button
                  onClick={() => setShowAddField(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Field
                </button>
              </div>

              {/* Field Groups */}
              {groups.map((group) => {
                const groupFields = group.fields.filter((f) =>
                  selectedFields.has(f.id)
                );
                if (groupFields.length === 0) return null;

                return (
                  <div
                    key={group.id}
                    className="border border-slate-200 rounded-lg p-4"
                  >
                    <h5 className="text-md font-semibold text-slate-900 mb-4">
                      {group.title}
                    </h5>
                    <div className="space-y-4">
                      {groupFields.map((field) => (
                        <div key={field.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-slate-700">
                              {field.label}
                              {field.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </label>
                            <button
                              onClick={() => removeField(field.id)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                          {field.description && (
                            <p className="text-xs text-slate-500">
                              {field.description}
                            </p>
                          )}
                          {renderFieldInput(field)}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Notes Section */}
              <div className="border border-slate-200 rounded-lg p-4">
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Additional Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes or observations..."
                  rows={6}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={() => router.push(`/admin/appointments/${appointmentId}`)}
            className="px-6 py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !patientId}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Notes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Notification */}
      <SuccessNotification
        message="Note saved successfully!"
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        duration={3000}
      />

      {/* Add Field Search Modal */}
      {showAddField && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAddField(false)}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
          >
            {/* Search Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h4 className="text-lg font-semibold text-slate-900">
                Search and Add Field
              </h4>
              <button
                onClick={() => setShowAddField(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-slate-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search fields by name or key..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  autoFocus
                />
              </div>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto p-4">
              {searching ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  {searchQuery.length < 2
                    ? "Type at least 2 characters to search"
                    : "No fields found"}
                </div>
              ) : (
                <div className="space-y-2">
                  {searchResults.map((field) => (
                    <button
                      key={field.id}
                      onClick={() => addField(field)}
                      disabled={selectedFields.has(field.id)}
                      className="w-full text-left p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="font-medium text-slate-900">
                        {field.label}
                      </div>
                      {field.description && (
                        <div className="text-sm text-slate-500 mt-1">
                          {field.description}
                        </div>
                      )}
                      <div className="text-xs text-slate-400 mt-1">
                        Type: {field.type}
                      </div>
                      {selectedFields.has(field.id) && (
                        <div className="text-xs text-emerald-600 mt-1">
                          Already added
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}
