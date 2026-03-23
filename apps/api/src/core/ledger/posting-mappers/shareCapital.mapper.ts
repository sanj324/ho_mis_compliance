import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const mapShareCapitalPosting = async (allotmentId: string) => {
  const allotment = await prisma.shareAllotment.findUnique({
    where: { id: allotmentId },
    include: { member: true, shareClass: true }
  });
  if (!allotment) {
    return null;
  }

  return {
    moduleName: "SHARE_CAPITAL" as const,
    eventCode: "SHARE_ALLOTMENT",
    referenceType: "ShareAllotment",
    referenceId: allotment.id,
    branchId: allotment.member.branchId,
    postingDate: new Date(),
    amount: Number(allotment.paidUpValue),
    narration: `Share allotment posting for ${allotment.member.memberCode}`
  };
};
