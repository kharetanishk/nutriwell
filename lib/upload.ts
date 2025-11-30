import api from "./api";

export interface UploadedFile {
  id: string;
  url: string;
  publicId: string;
  fileName: string;
  mimeType: string;
  sizeInBytes: number;
  patientId: string | null;
}

export interface UploadResponse {
  message: string;
  files: UploadedFile[];
}

export async function uploadFiles(files: File[]): Promise<UploadedFile[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const res = await api.post<UploadResponse>("upload/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.files;
}

export async function deleteFile(fileId: string): Promise<void> {
  await api.delete(`patients/file/${fileId}`);
}

export async function linkFilesToPatient(
  patientId: string,
  fileIds: string[]
): Promise<void> {
  await api.patch(`patients/${patientId}/files`, { fileIds });
}
