import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class InvestmentRepository {
  findMany(filters: { branchId?: string; classification?: string; rating?: string }) {
    return prisma.investment.findMany({
      where: {
        ...(filters.branchId ? { branchId: filters.branchId } : {}),
        ...(filters.classification ? { classification: filters.classification } : {}),
        ...(filters.rating ? { rating: filters.rating } : {})
      },
      include: {
        branch: true,
        securityType: true,
        issuer: true,
        counterparty: true,
        broker: true,
        exceptions: true
      },
      orderBy: {
        purchaseDate: "desc"
      }
    });
  }

  findById(id: string) {
    return prisma.investment.findUnique({
      where: { id },
      include: {
        branch: true,
        securityType: true,
        issuer: true,
        counterparty: true,
        broker: true,
        accruals: true,
        transactions: true,
        exposureSnapshots: true,
        exceptions: true
      }
    });
  }

  create(data: Prisma.InvestmentCreateInput) {
    return prisma.investment.create({
      data,
      include: {
        branch: true,
        securityType: true,
        issuer: true,
        counterparty: true,
        broker: true,
        exceptions: true
      }
    });
  }

  update(id: string, data: Prisma.InvestmentUpdateInput) {
    return prisma.investment.update({
      where: { id },
      data,
      include: {
        branch: true,
        securityType: true,
        issuer: true,
        counterparty: true,
        broker: true,
        exceptions: true
      }
    });
  }

  createException(data: Prisma.InvestmentExceptionCreateInput) {
    return prisma.investmentException.create({ data });
  }
}

export const investmentRepository = new InvestmentRepository();
