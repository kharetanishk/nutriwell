import api from "./api";

export interface DoctorFieldOption {
  id: string;
  value: string;
  label: string;
  order: number;
}

export interface DoctorFieldMaster {
  id: string;
  key: string;
  label: string;
  description: string | null;
  type:
    | "TEXT"
    | "NUMBER"
    | "SELECT"
    | "MULTISELECT"
    | "RADIO"
    | "BOOLEAN"
    | "DATE"
    | "TIME"
    | "TEXTAREA";
  placeholder: string | null;
  required: boolean;
  order: number;
  options: DoctorFieldOption[];
}

export interface DoctorFieldGroup {
  id: string;
  key: string;
  title: string;
  order: number;
  fields: DoctorFieldMaster[];
}

export interface DoctorFormFieldValue {
  id: string;
  fieldId: string;
  stringValue: string | null;
  numberValue: number | null;
  booleanValue: boolean | null;
  dateValue: string | null;
  timeValue: string | null;
  jsonValue: any;
  notes: string | null;
  field: DoctorFieldMaster;
}

export interface DoctorFormSession {
  id: string;
  appointmentId: string | null;
  patientId: string;
  doctorId: string;
  title: string | null;
  notes: string | null;
  values: DoctorFormFieldValue[];
  createdAt: string;
  updatedAt: string;
}

export interface GetDoctorFieldGroupsResponse {
  success: boolean;
  groups: DoctorFieldGroup[];
}

export interface SearchDoctorFieldsResponse {
  success: boolean;
  fields: DoctorFieldMaster[];
}

export interface CreateDoctorSessionRequest {
  appointmentId?: string;
  patientId: string;
  title?: string;
  notes?: string;
  fieldValues?: Array<{
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
  }>;
}

export interface CreateDoctorSessionResponse {
  success: boolean;
  session: DoctorFormSession;
}

export async function getDoctorFieldGroups(): Promise<GetDoctorFieldGroupsResponse> {
  const res = await api.get<GetDoctorFieldGroupsResponse>(
    "admin/doctor-fields/groups"
  );
  return res.data;
}

export async function searchDoctorFields(
  query: string
): Promise<SearchDoctorFieldsResponse> {
  const res = await api.get<SearchDoctorFieldsResponse>(
    "admin/doctor-fields/search",
    {
      params: { q: query },
    }
  );
  return res.data;
}

export async function createDoctorSession(
  data: CreateDoctorSessionRequest
): Promise<CreateDoctorSessionResponse> {
  const res = await api.post<CreateDoctorSessionResponse>(
    "admin/doctor-session",
    data
  );
  return res.data;
}

export async function saveDoctorSession(
  data: CreateDoctorSessionRequest
): Promise<CreateDoctorSessionResponse> {
  const res = await api.post<CreateDoctorSessionResponse>(
    "admin/doctor-session/save",
    data
  );
  return res.data;
}
