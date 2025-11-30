import api from "./api";

export interface RecallEntry {
  mealType: string;
  time: string;
  foodItem: string;
  quantity: string;
  notes?: string;
}

export interface CreateRecallRequest {
  patientId: string;
  notes?: string;
  entries: RecallEntry[];
  appointmentId?: string; // Optional - link recall to appointment
}

export interface CreateRecallResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    patientId: string;
    notes: string | null;
    entries: Array<{
      id: string;
      mealType: string;
      time: string;
      foodItem: string;
      quantity: string;
      notes: string | null;
    }>;
  };
}

export async function createRecall(
  data: CreateRecallRequest
): Promise<CreateRecallResponse> {
  console.log(
    "[API] Creating recall - Request URL:",
    `${process.env.NEXT_PUBLIC_API_URL}/patients/recall`
  );
  console.log("[API] Creating recall - Request data:", {
    patientId: data.patientId,
    entriesCount: data.entries.length,
    hasNotes: !!data.notes,
    appointmentId: data.appointmentId,
  });

  try {
    const res = await api.post<CreateRecallResponse>("patients/recall", data);
    console.log("[API] Recall creation response status:", res.status);
    console.log("[API] Recall creation response data:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("[API] Recall creation error:", {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
      config: {
        url: error?.config?.url,
        method: error?.config?.method,
      },
    });
    throw error;
  }
}
