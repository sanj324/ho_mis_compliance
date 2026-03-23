import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const mapStationeryPosting = async (issueId: string) => {
  const issue = await prisma.stockIssue.findUnique({
    where: { id: issueId },
    include: { items: true }
  });
  if (!issue) {
    return null;
  }

  const amount = issue.items.reduce((sum, item) => sum + Number(item.quantity), 0);

  return {
    moduleName: "STATIONERY" as const,
    eventCode: "STATIONERY_ISSUE",
    referenceType: "StockIssue",
    referenceId: issue.id,
    branchId: issue.branchId,
    postingDate: new Date(),
    amount,
    narration: `Stationery issue posting for ${issue.issueNo}`
  };
};
