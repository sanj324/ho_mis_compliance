import { z } from "zod";

export const createCostCenterSchema = z.object({
  code: z.string().min(2).max(30),
  name: z.string().min(3).max(120),
  branchId: z.string().uuid().optional(),
  isActive: z.boolean().optional()
});

export const updateCostCenterSchema = z.object({
  name: z.string().min(3).max(120).optional(),
  branchId: z.string().uuid().nullable().optional(),
  isActive: z.boolean().optional(),
  approvalState: z.enum(["DRAFT", "PENDING_APPROVAL", "APPROVED", "REJECTED"]).optional()
});
