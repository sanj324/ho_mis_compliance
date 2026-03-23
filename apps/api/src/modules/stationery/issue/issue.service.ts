import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";

import { AppError } from "../../../common/errors/app-error.js";
import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { InventoryExceptionSeverityEnum, StockTransactionTypeEnum } from "../../../common/enums/inventory.enum.js";
import { stockService } from "../stock/stock.service.js";
import { stockRepository } from "../stock/stock.repository.js";
import { issueRepository } from "./issue.repository.js";

const prisma = new PrismaClient();

export class IssueService {
  async create(
    input: {
      branchId: string;
      issueDate: string;
      issueReason: string;
      items: Array<{ itemId: string; quantity: number }>;
    },
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const stockMap = await stockService.getCurrentStockMap(input.branchId);

    for (const issueItem of input.items) {
      const available = stockMap.get(issueItem.itemId) ?? 0;
      if (issueItem.quantity > available) {
        throw new AppError("Issue quantity exceeds available stock", StatusCodes.BAD_REQUEST);
      }
    }

    const issueNo = `ISS-${Date.now()}`;
    const issue = await issueRepository.create({
      issueNo,
      branch: { connect: { id: input.branchId } },
      issueDate: new Date(input.issueDate),
      issueReason: input.issueReason,
      approvalState: "PENDING_APPROVAL",
      items: {
        create: input.items.map((item) => ({
          item: { connect: { id: item.itemId } },
          quantity: item.quantity
        }))
      }
    });

    for (const issueItem of input.items) {
      await stockRepository.createLedgerEntry({
        item: { connect: { id: issueItem.itemId } },
        branch: { connect: { id: input.branchId } },
        transactionType: StockTransactionTypeEnum.ISSUE,
        quantity: issueItem.quantity,
        transactionDate: new Date(input.issueDate),
        referenceType: "STOCK_ISSUE",
        referenceId: issue.id,
        remarks: input.issueReason
      });

      const item = await prisma.stationeryItem.findUnique({ where: { id: issueItem.itemId } });
      const available = (stockMap.get(issueItem.itemId) ?? 0) - issueItem.quantity;
      if (item && available <= Number(item.reorderLevel)) {
        await prisma.stationeryException.create({
          data: {
            item: { connect: { id: issueItem.itemId } },
            branch: { connect: { id: input.branchId } },
            exceptionCode: "LOW_STOCK",
            exceptionMessage: `${item.itemName} is at or below reorder level`,
            severity: InventoryExceptionSeverityEnum.HIGH
          }
        });
      }

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentIssues = await prisma.stockLedger.findMany({
        where: {
          itemId: issueItem.itemId,
          branchId: input.branchId,
          transactionType: StockTransactionTypeEnum.ISSUE,
          transactionDate: { gte: thirtyDaysAgo }
        }
      });
      const averageIssue =
        recentIssues.length > 0
          ? recentIssues.reduce((sum, entry) => sum + Number(entry.quantity), 0) / recentIssues.length
          : 0;

      if ((averageIssue > 0 && issueItem.quantity > averageIssue * 1.5) || (averageIssue === 0 && issueItem.quantity >= 20)) {
        await prisma.stationeryException.create({
          data: {
            item: { connect: { id: issueItem.itemId } },
            branch: { connect: { id: input.branchId } },
            exceptionCode: "ABNORMAL_USAGE",
            exceptionMessage: "Issue quantity is materially above recent usage pattern",
            severity: InventoryExceptionSeverityEnum.MEDIUM
          }
        });
      }
    }

    await prisma.auditLog.create({
      data: {
        moduleName: "STATIONERY",
        entityName: "StockIssue",
        entityId: issue.id,
        action: AuditActionEnum.CREATE,
        requestId: context.requestId,
        ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
        ...(input.branchId ? { branch: { connect: { id: input.branchId } } } : {}),
        newValues: issue
      }
    });

    return issue;
  }
}

export const issueService = new IssueService();
