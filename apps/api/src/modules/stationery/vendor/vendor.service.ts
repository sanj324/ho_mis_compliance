import { PrismaClient } from "@prisma/client";

import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { vendorRepository } from "./vendor.repository.js";

const prisma = new PrismaClient();

export class VendorService {
  list() {
    return vendorRepository.findMany();
  }

  async create(
    input: {
      code: string;
      name: string;
      gstNo?: string;
      contactPerson?: string;
      phoneNo?: string;
    },
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const vendor = await vendorRepository.create({
      code: input.code,
      name: input.name,
      ...(input.gstNo ? { gstNo: input.gstNo } : {}),
      ...(input.contactPerson ? { contactPerson: input.contactPerson } : {}),
      ...(input.phoneNo ? { phoneNo: input.phoneNo } : {})
    });

    await prisma.auditLog.create({
      data: {
        moduleName: "STATIONERY",
        entityName: "Vendor",
        entityId: vendor.id,
        action: AuditActionEnum.CREATE,
        requestId: context.requestId,
        ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
        ...(context.branchId ? { branch: { connect: { id: context.branchId } } } : {}),
        newValues: vendor
      }
    });

    return vendor;
  }
}

export const vendorService = new VendorService();
