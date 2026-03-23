import { PrismaClient } from "@prisma/client";

import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { assetCategoryRepository } from "./assetCategory.repository.js";

const prisma = new PrismaClient();

export class AssetCategoryService {
  list() {
    return assetCategoryRepository.findMany();
  }

  async create(
    input: { code: string; name: string; usefulLifeMonths: number },
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const category = await assetCategoryRepository.create(input);
    await prisma.auditLog.create({
      data: {
        moduleName: "ASSETS",
        entityName: "AssetCategory",
        entityId: category.id,
        action: AuditActionEnum.CREATE,
        requestId: context.requestId,
        ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
        ...(context.branchId ? { branch: { connect: { id: context.branchId } } } : {}),
        newValues: category
      }
    });
    return category;
  }
}

export const assetCategoryService = new AssetCategoryService();
