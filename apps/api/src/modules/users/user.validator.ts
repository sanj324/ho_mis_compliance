import { z } from "zod";

export const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  fullName: z.string().min(3).max(120),
  email: z.string().email().optional(),
  password: z.string().min(8).max(128),
  branchId: z.string().uuid().nullable().optional(),
  roleIds: z.array(z.string().uuid()).min(1)
});

export const updateUserSchema = z.object({
  fullName: z.string().min(3).max(120).optional(),
  email: z.string().email().optional(),
  branchId: z.string().uuid().nullable().optional(),
  isActive: z.boolean().optional(),
  approvalState: z.enum(["DRAFT", "PENDING_APPROVAL", "APPROVED", "REJECTED"]).optional()
});
