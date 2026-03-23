import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";

import { AppError } from "../../../common/errors/app-error.js";
import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { StockTransactionTypeEnum } from "../../../common/enums/inventory.enum.js";
import { stockRepository } from "../stock/stock.repository.js";
import { stockService } from "../stock/stock.service.js";
import { stockTransferRepository } from "./stockTransfer.repository.js";

const prisma = new PrismaClient();

export class StockTransferService {
  list() {
    return stockTransferRepository.findMany();
  }

  async create(
    input: { itemId: string; fromBranchId: string; toBranchId: string; quantity: number; transferDate: string },
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const stockMap = await stockService.getCurrentStockMap(input.fromBranchId);
    const available = stockMap.get(input.itemId) ?? 0;
    if (input.quantity > available) {
      throw new AppError("Transfer quantity exceeds available stock", StatusCodes.BAD_REQUEST);
    }

    const transferNo = `TRF-${Date.now()}`;
    const transfer = await stockTransferRepository.create({
      transferNo,
      item: { connect: { id: input.itemId } },
      fromBranch: { connect: { id: input.fromBranchId } },
      toBranch: { connect: { id: input.toBranchId } },
      quantity: input.quantity,
      transferDate: new Date(input.transferDate),
      approvalState: "PENDING_APPROVAL"
    });

    await stockRepository.createLedgerEntry({
      item: { connect: { id: input.itemId } },
      branch: { connect: { id: input.fromBranchId } },
      transactionType: StockTransactionTypeEnum.TRANSFER_OUT,
      quantity: input.quantity,
      transactionDate: new Date(input.transferDate),
      referenceType: "STOCK_TRANSFER",
      referenceId: transfer.id,
      remarks: `Transfer to branch ${input.toBranchId}`
    });
    await stockRepository.createLedgerEntry({
      item: { connect: { id: input.itemId } },
      branch: { connect: { id: input.toBranchId } },
      transactionType: StockTransactionTypeEnum.TRANSFER_IN,
      quantity: input.quantity,
      transactionDate: new Date(input.transferDate),
      referenceType: "STOCK_TRANSFER",
      referenceId: transfer.id,
      remarks: `Transfer from branch ${input.fromBranchId}`
    });

    await prisma.auditLog.create({
      data: {
        moduleName: "STATIONERY",
        entityName: "StockTransfer",
        entityId: transfer.id,
        action: AuditActionEnum.CREATE,
        requestId: context.requestId,
        ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
        ...(input.fromBranchId ? { branch: { connect: { id: input.fromBranchId } } } : {}),
        newValues: transfer
      }
    });

    return transfer;
  }
}

export const stockTransferService = new StockTransferService();
