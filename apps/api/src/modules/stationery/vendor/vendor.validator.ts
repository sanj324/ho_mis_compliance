import { z } from "zod";

export const createVendorSchema = z.object({
  code: z.string().min(2).max(20),
  name: z.string().min(2).max(120),
  gstNo: z.string().max(30).optional(),
  contactPerson: z.string().max(120).optional(),
  phoneNo: z.string().max(20).optional()
});
