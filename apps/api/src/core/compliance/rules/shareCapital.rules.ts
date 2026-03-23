import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const evaluateShareCapitalRules = async () => {
  const members = await prisma.member.findMany({
    where: {
      OR: [{ kycStatus: { not: "COMPLETED" } }, { freezeStatus: true }, { lienStatus: true }]
    }
  });

  return members.map((member) => ({
    moduleName: "SHARE_CAPITAL" as const,
    entityType: "Member",
    entityId: member.id,
    ruleCode: member.kycStatus !== "COMPLETED" ? "MEMBER_KYC_DEFICIENT" : "MEMBER_RESTRICTION_ACTIVE",
    ruleDescription:
      member.kycStatus !== "COMPLETED"
        ? "Member KYC status is deficient"
        : "Member has freeze or lien restrictions active",
    severity: member.kycStatus !== "COMPLETED" ? "HIGH" : "MEDIUM",
    branchId: member.branchId,
    dueDate: null
  }));
};
