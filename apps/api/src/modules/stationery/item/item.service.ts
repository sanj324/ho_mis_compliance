import { PrismaClient } from "@prisma/client";

import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { InventoryExceptionSeverityEnum } from "../../../common/enums/inventory.enum.js";
import { itemRepository } from "./item.repository.js";

const prisma = new PrismaClient();

export class ItemService {
  list() {
    return itemRepository.findMany();
  }

  async create(
    input: {
      itemCode: string;
      itemName: string;
      itemCategoryId: string;
      unitOfMeasure: string;
      reorderLevel: number;
      maxLevel: number;
      gstRate: number;
    },
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const item = await itemRepository.create({
      itemCode: input.itemCode,
      itemName: input.itemName,
      itemCategory: { connect: { id: input.itemCategoryId } },
      unitOfMeasure: input.unitOfMeasure,
      reorderLevel: input.reorderLevel,
      maxLevel: input.maxLevel,
      gstRate: input.gstRate
    });

    if (input.reorderLevel > input.maxLevel) {
      await itemRepository.createException({
        item: { connect: { id: item.id } },
        exceptionCode: "INVALID_REORDER_CONFIG",
        exceptionMessage: "Reorder level is higher than max level",
        severity: InventoryExceptionSeverityEnum.MEDIUM
      });
    }

    await prisma.auditLog.create({
      data: {
        moduleName: "STATIONERY",
        entityName: "StationeryItem",
        entityId: item.id,
        action: AuditActionEnum.CREATE,
        requestId: context.requestId,
        ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
        ...(context.branchId ? { branch: { connect: { id: context.branchId } } } : {}),
        newValues: item
      }
    });

    return item;
  }
}

export const itemService = new ItemService();
