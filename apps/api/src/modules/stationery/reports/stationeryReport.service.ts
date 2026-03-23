import { PrismaClient } from "@prisma/client";

import { StockTransactionTypeEnum } from "../../../common/enums/inventory.enum.js";
import { stockService } from "../stock/stock.service.js";

const prisma = new PrismaClient();

export class StationeryReportService {
  async stockRegister(branchId?: string) {
    return stockService.getStockRegister(branchId);
  }

  async consumption(branchId?: string) {
    const ledger = branchId
      ? await prisma.stockLedger.findMany({
          where: {
            branchId,
            transactionType: StockTransactionTypeEnum.ISSUE
          },
          include: { item: true, branch: true },
          orderBy: { transactionDate: "desc" }
        })
      : await prisma.stockLedger.findMany({
          where: { transactionType: StockTransactionTypeEnum.ISSUE },
          include: { item: true, branch: true },
          orderBy: { transactionDate: "desc" }
        });

    const summary = new Map<string, { itemName: string; branchName: string; quantity: number }>();
    for (const entry of ledger) {
      const key = `${entry.itemId}-${entry.branchId}`;
      const current = summary.get(key) ?? {
        itemName: entry.item.itemName,
        branchName: entry.branch.name,
        quantity: 0
      };
      current.quantity += Number(entry.quantity);
      summary.set(key, current);
    }

    return Array.from(summary.values()).map((row) => ({
      itemName: row.itemName,
      branchName: row.branchName,
      quantityIssued: row.quantity.toFixed(2)
    }));
  }

  async lowStock(branchId?: string) {
    const register = await stockService.getStockRegister(branchId);
    return register.filter((row) => Number(row.currentStock) <= Number(row.reorderLevel));
  }
}

export const stationeryReportService = new StationeryReportService();
