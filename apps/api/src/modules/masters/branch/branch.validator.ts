import { z } from "zod";

export const createBranchSchema = z.object({
  code: z.string().min(2).max(20),
  name: z.string().min(3).max(120),
  addressLine1: z.string().max(255).optional(),
  city: z.string().max(120).optional(),
  state: z.string().max(120).optional(),
  isHeadOffice: z.boolean().optional()
});

export const updateBranchSchema = z.object({
  name: z.string().min(3).max(120).optional(),
  addressLine1: z.string().max(255).optional(),
  city: z.string().max(120).optional(),
  state: z.string().max(120).optional(),
  isHeadOffice: z.boolean().optional(),
  isActive: z.boolean().optional(),
  approvalState: z.enum(["DRAFT", "PENDING_APPROVAL", "APPROVED", "REJECTED"]).optional()
});
