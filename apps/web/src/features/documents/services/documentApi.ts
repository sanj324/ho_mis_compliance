import { api } from "../../../lib/api";

const unwrap = <T>(payload: { success: true; data: T }): T => payload.data;

export type DocumentItem = {
  id: string;
  moduleName: string;
  entityType: string;
  entityId: string;
  documentType: string;
  fileName: string;
  filePath: string;
  createdAt: string;
};

export const documentApi = {
  upload: async (payload: Record<string, unknown>): Promise<DocumentItem> =>
    unwrap((await api.post<{ success: true; data: DocumentItem }>("/documents/upload", payload)).data),
  list: async (): Promise<DocumentItem[]> =>
    unwrap((await api.get<{ success: true; data: DocumentItem[] }>("/documents")).data),
  getById: async (id: string): Promise<DocumentItem> =>
    unwrap((await api.get<{ success: true; data: DocumentItem }>(`/documents/${id}`)).data)
};
