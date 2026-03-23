import { PrismaClient } from "@prisma/client";

import { MemberKycStatusEnum } from "../../../common/enums/share-capital.enum.js";
import { memberService } from "../member/member.service.js";

const prisma = new PrismaClient();

export class ShareCapitalDashboardService {
  async summary(branchId?: string) {
    const members = await prisma.member.findMany({
      ...(branchId ? { where: { branchId } } : {})
    });
    const shareClasses = await prisma.shareClass.findMany();
    const pendingDividendPayments = await prisma.dividendPayment.findMany({
      where: { paymentStatus: "PENDING" }
    });

    let totalShareCapital = 0;
    const byShareClass: Array<{ shareClass: string; totalShares: number; capitalValue: number }> = [];

    for (const shareClass of shareClasses) {
      let totalShares = 0;
      for (const member of members) {
        totalShares += await memberService.getShareBalance(member.id, shareClass.id);
      }
      if (totalShares > 0) {
        byShareClass.push({
          shareClass: shareClass.name,
          totalShares,
          capitalValue: totalShares * Number(shareClass.faceValue)
        });
        totalShareCapital += totalShares * Number(shareClass.faceValue);
      }
    }

    const pendingDividendAmount = pendingDividendPayments.reduce(
      (sum, item) => sum + Number(item.dividendAmount),
      0
    );

    return {
      totalMembers: members.length,
      activeMembers: members.filter((member) => member.memberStatus === "ACTIVE").length,
      totalShareCapital,
      kycDeficientMembers: members.filter((member) => member.kycStatus !== MemberKycStatusEnum.COMPLETED).length,
      frozenMembers: members.filter((member) => member.freezeStatus).length,
      pendingDividendAmount,
      byShareClass
    };
  }
}

export const shareCapitalDashboardService = new ShareCapitalDashboardService();
