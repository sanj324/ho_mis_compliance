import { InvestmentMaturityBucketEnum } from "../../../common/enums/investment.enum.js";

export class MaturityService {
  getBucket(maturityDate?: Date | null): InvestmentMaturityBucketEnum {
    if (!maturityDate) {
      return InvestmentMaturityBucketEnum.PERPETUAL;
    }

    const now = new Date();
    const diffInDays = Math.ceil((maturityDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays <= 365) {
      return InvestmentMaturityBucketEnum.WITHIN_1_YEAR;
    }
    if (diffInDays <= 365 * 3) {
      return InvestmentMaturityBucketEnum.FROM_1_TO_3_YEARS;
    }

    return InvestmentMaturityBucketEnum.ABOVE_3_YEARS;
  }
}

export const maturityService = new MaturityService();
