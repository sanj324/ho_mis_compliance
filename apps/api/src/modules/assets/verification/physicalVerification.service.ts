import { PrismaClient } from "@prisma/client";

import { AssetVerificationStatusEnum } from "../../../common/enums/asset.enum.js";
import { physicalVerificationRepository } from "./physicalVerification.repository.js";

const prisma = new PrismaClient();

export class PhysicalVerificationService {
  list() {
    return physicalVerificationRepository.findMany();
  }

  async captureVariance(assetId: string, varianceRemarks: string) {
    const verification = await physicalVerificationRepository.create({
      asset: { connect: { id: assetId } },
      verificationDate: new Date(),
      status: AssetVerificationStatusEnum.VARIANCE,
      varianceRemarks
    });

    await prisma.assetException.create({
      data: {
        asset: { connect: { id: assetId } },
        exceptionCode: "PHYSICAL_VARIANCE",
        exceptionMessage: varianceRemarks,
        severity: "MEDIUM"
      }
    });

    return verification;
  }
}

export const physicalVerificationService = new PhysicalVerificationService();
