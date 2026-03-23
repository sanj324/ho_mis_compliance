import { PrismaClient } from "@prisma/client";

import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { itemCategoryRepository } from "./itemCategory.repository.js";

const prisma = new PrismaClient();

export class ItemCategoryService {
  list() {
    return itemCategoryRepository.findMany();
  }

  async create(
    input: { code: string; name: string },
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const category = await itemCategoryRepository.create(input);
    await prisma.auditLog.create({
      data: {
        moduleName: "STATIONERY",
        entityName: "ItemCategory",
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

export const itemCategoryService = new ItemCategoryService();
