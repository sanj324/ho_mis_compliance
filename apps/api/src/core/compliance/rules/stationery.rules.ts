import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const evaluateStationeryRules = async () => {
  const items = await prisma.stationeryItem.findMany({
    include: { stockLedgers: true }
  });

  return items
    .map((item) => {
      const currentStock = item.stockLedgers.reduce((sum, row) => {
        const quantity = Number(row.quantity);
        return row.transactionType === "ISSUE" ? sum - quantity : sum + quantity;
      }, 0);
      if (currentStock > Number(item.reorderLevel)) {
        return null;
      }
      return {
        moduleName: "STATIONERY" as const,
        entityType: "StationeryItem",
        entityId: item.id,
        ruleCode: "LOW_STOCK_ALERT",
        ruleDescription: "Current stock is at or below reorder level",
        severity: "MEDIUM",
        branchId: null,
        dueDate: null
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
};
