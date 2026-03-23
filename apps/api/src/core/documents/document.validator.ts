import { z } from "zod";

export const uploadDocumentSchema = z.object({
  moduleName: z.string().min(1),
  entityType: z.string().min(1),
  entityId: z.string().min(1),
  documentType: z.string().min(1),
  fileName: z.string().min(1),
  filePath: z.string().min(1),
  mimeType: z.string().optional(),
  fileSize: z.coerce.number().int().positive().optional(),
  branchId: z.string().uuid().optional()
});
