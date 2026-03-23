import { PrismaClient } from "@prisma/client";

import { StockTransactionTypeEnum } from "../../../common/enums/inventory.enum.js";
import { stockRepository } from "./stock.repository.js";

const prisma = new PrismaClient();

const negativeTransactions = new Set<string>([
  StockTransactionTypeEnum.ISSUE,
  StockTransactionTypeEnum.TRANSFER_OUT
]);

export class StockService {
  async getCurrentStockMap(branchId?: string): Promise<Map<string, number>> {
    const ledger = await stockRepository.findLedger(branchId);
    const stockMap = new Map<string, number>();

    for (const entry of ledger) {
      const current = stockMap.get(entry.itemId) ?? 0;
      const quantity = Number(entry.quantity);
      const next = negativeTransactions.has(entry.transactionType) ? current - quantity : current + quantity;
      stockMap.set(entry.itemId, next);
    }

    return stockMap;
  }

  async getStockRegister(branchId?: string) {
    const items = await prisma.stationeryItem.findMany({
      include: { itemCategory: true }
    });
    const stockMap = await this.getCurrentStockMap(branchId);

    return items.map((item) => ({
      itemCode: item.itemCode,
      itemName: item.itemName,
      category: item.itemCategory.name,
      unitOfMeasure: item.unitOfMeasure,
      reorderLevel: Number(item.reorderLevel).toFixed(2),
      currentStock: (stockMap.get(item.id) ?? 0).toFixed(2)
    }));
  }
}

export const stockService = new StockService();
