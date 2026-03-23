import { PrismaClient } from "@prisma/client";

import { MemberKycStatusEnum } from "../../../common/enums/share-capital.enum.js";
import { memberService } from "../member/member.service.js";

const prisma = new PrismaClient();

export class ShareCapitalReportService {
  async shareRegister(branchId?: string) {
    const members = await prisma.member.findMany({
      ...(branchId ? { where: { branchId } } : {}),
      include: { branch: true }
    });
    const shareClasses = await prisma.shareClass.findMany();

    const rows: Array<Record<string, string | number | null>> = [];
    for (const member of members) {
      for (const shareClass of shareClasses) {
        const balance = await memberService.getShareBalance(member.id, shareClass.id);
        if (balance <= 0) {
          continue;
        }

        rows.push({
          memberCode: member.memberCode,
          memberName: member.memberName,
          branchName: member.branch.name,
          shareClass: shareClass.name,
          noOfShares: balance,
          shareCapitalValue: balance * Number(shareClass.faceValue),
          kycStatus: member.kycStatus,
          freezeStatus: member.freezeStatus ? "YES" : "NO",
          lienStatus: member.lienStatus ? "YES" : "NO"
        });
      }
    }

    return rows;
  }

  async dividendRegister() {
    const payments = await prisma.dividendPayment.findMany({
      include: {
        member: true,
        dividendDeclaration: {
          include: {
            shareClass: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return payments.map((payment) => ({
      memberCode: payment.member.memberCode,
      memberName: payment.member.memberName,
      shareClass: payment.dividendDeclaration.shareClass.name,
      declarationDate: payment.dividendDeclaration.declarationDate.toISOString(),
      noOfShares: payment.noOfShares,
      dividendAmount: Number(payment.dividendAmount),
      paymentStatus: payment.paymentStatus
    }));
  }

  async kycDeficientMembers(branchId?: string) {
    return prisma.member.findMany({
      where: {
        ...(branchId ? { branchId } : {}),
        OR: [
          { kycStatus: { not: MemberKycStatusEnum.COMPLETED } },
          { panNo: null },
          { aadhaarNo: null }
        ]
      },
      include: {
        branch: true,
        memberKyc: true
      },
      orderBy: { memberName: "asc" }
    });
  }
}

export const shareCapitalReportService = new ShareCapitalReportService();
