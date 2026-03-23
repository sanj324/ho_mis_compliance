import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class DividendRepository {
  createDeclaration(data: Prisma.DividendDeclarationCreateInput) {
    return prisma.dividendDeclaration.create({
      data,
      include: {
        shareClass: true
      }
    });
  }

  createPayments(data: Prisma.DividendPaymentCreateManyInput[]) {
    return prisma.dividendPayment.createMany({
      data
    });
  }

  listDeclarations() {
    return prisma.dividendDeclaration.findMany({
      include: {
        shareClass: true,
        payments: true
      },
      orderBy: { declarationDate: "desc" }
    });
  }
}

export const dividendRepository = new DividendRepository();
