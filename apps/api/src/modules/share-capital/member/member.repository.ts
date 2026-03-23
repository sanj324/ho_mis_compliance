import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class MemberRepository {
  findMany(branchId?: string) {
    return prisma.member.findMany({
      ...(branchId ? { where: { branchId } } : {}),
      include: {
        branch: true,
        memberKyc: true
      },
      orderBy: { memberName: "asc" }
    });
  }

  findById(id: string) {
    return prisma.member.findUnique({
      where: { id },
      include: {
        branch: true,
        memberKyc: true
      }
    });
  }

  create(data: Prisma.MemberCreateInput) {
    return prisma.member.create({
      data,
      include: {
        branch: true,
        memberKyc: true
      }
    });
  }

  update(id: string, data: Prisma.MemberUpdateInput) {
    return prisma.member.update({
      where: { id },
      data,
      include: {
        branch: true,
        memberKyc: true
      }
    });
  }

  upsertKyc(memberId: string, data: Prisma.MemberKycUncheckedCreateInput) {
    return prisma.memberKyc.upsert({
      where: { memberId },
      update: {
        panVerified: data.panVerified ?? false,
        aadhaarVerified: data.aadhaarVerified ?? false,
        remarks: data.remarks ?? null
      },
      create: data
    });
  }

  findOpenException(memberId: string, exceptionCode: string) {
    return prisma.shareCapitalException.findFirst({
      where: {
        memberId,
        exceptionCode,
        isResolved: false
      }
    });
  }

  createException(data: Prisma.ShareCapitalExceptionCreateInput) {
    return prisma.shareCapitalException.create({ data });
  }

  aggregateAllotments(memberId: string, shareClassId?: string) {
    return prisma.shareAllotment.aggregate({
      where: {
        memberId,
        ...(shareClassId ? { shareClassId } : {})
      },
      _sum: { noOfShares: true }
    });
  }

  aggregateIncomingTransfers(memberId: string, shareClassId?: string) {
    return prisma.shareTransfer.aggregate({
      where: {
        toMemberId: memberId,
        ...(shareClassId ? { shareClassId } : {})
      },
      _sum: { noOfShares: true }
    });
  }

  aggregateOutgoingTransfers(memberId: string, shareClassId?: string) {
    return prisma.shareTransfer.aggregate({
      where: {
        fromMemberId: memberId,
        ...(shareClassId ? { shareClassId } : {})
      },
      _sum: { noOfShares: true }
    });
  }

  aggregateRedemptions(memberId: string, shareClassId?: string) {
    return prisma.shareRedemption.aggregate({
      where: {
        memberId,
        ...(shareClassId ? { shareClassId } : {})
      },
      _sum: { noOfShares: true }
    });
  }
}

export const memberRepository = new MemberRepository();
