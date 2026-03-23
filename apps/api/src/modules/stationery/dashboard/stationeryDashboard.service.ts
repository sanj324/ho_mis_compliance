import { PrismaClient } from "@prisma/client";

import { StockTransactionTypeEnum } from "../../../common/enums/inventory.enum.js";
import { stockService } from "../stock/stock.service.js";

const prisma = new PrismaClient();

export class StationeryDashboardService {
  async summary(branchId?: string) {
    const items = await prisma.stationeryItem.findMany();
    const stockRegister = await stockService.getStockRegister(branchId);
    const issues = branchId
      ? await prisma.stockLedger.findMany({
          where: {
            branchId,
            transactionType: StockTransactionTypeEnum.ISSUE
          }
        })
      : await prisma.stockLedger.findMany({
          where: { transactionType: StockTransactionTypeEnum.ISSUE }
        });
    const lowStockCount = stockRegister.filter((row) => Number(row.currentStock) <= Number(row.reorderLevel)).length;
    const totalIssued = issues.reduce((sum, row) => sum + Number(row.quantity), 0);
    const exceptions = await prisma.stationeryException.count({
      where: branchId ? { branchId, isResolved: false } : { isResolved: false }
    });

    return {
      totalItems: items.length,
      lowStockCount,
      totalIssued,
      exceptionCount: exceptions,
      stockSummary: stockRegister.slice(0, 5)
    };
  }
}

export const stationeryDashboardService = new StationeryDashboardService();
