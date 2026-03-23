import { z } from "zod";

export const createMemberSchema = z.object({
  memberCode: z.string().trim().min(1).max(50),
  memberName: z.string().trim().min(2).max(150),
  branchId: z.string().uuid(),
  panNo: z.string().trim().max(20).optional(),
  aadhaarNo: z.string().trim().max(20).optional(),
  kycStatus: z.string().trim().max(30).optional(),
  memberStatus: z.string().trim().max(30).optional(),
  freezeStatus: z.boolean().optional(),
  lienStatus: z.boolean().optional(),
  registrarRefNo: z.string().trim().max(100).optional(),
  panVerified: z.boolean().optional(),
  aadhaarVerified: z.boolean().optional(),
  remarks: z.string().trim().max(500).optional()
});

export const updateMemberSchema = createMemberSchema.partial();
