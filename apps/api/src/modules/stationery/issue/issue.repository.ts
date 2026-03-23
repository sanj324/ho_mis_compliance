import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class IssueRepository {
  create(data: Prisma.StockIssueCreateInput) {
    return prisma.stockIssue.create({
      data,
      include: {
        branch: true,
        items: { include: { item: true } }
      }
    });
  }
}

export const issueRepository = new IssueRepository();
