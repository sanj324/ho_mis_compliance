import type { ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";

import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { shareCapitalApi } from "../services/shareCapitalApi";

export const ShareCapitalReportsPage = (): ReactElement => {
  const { data: shareRegister } = useQuery({
    queryKey: ["share-capital", "reports", "share-register"],
    queryFn: shareCapitalApi.shareRegister
  });
  const { data: dividendRegister } = useQuery({
    queryKey: ["share-capital", "reports", "dividend-register"],
    queryFn: shareCapitalApi.dividendRegister
  });
  const { data: kycDeficient } = useQuery({
    queryKey: ["share-capital", "reports", "kyc-deficient"],
    queryFn: shareCapitalApi.kycDeficientMembers
  });

  return (
    <div className="space-y-8">
      <PageTitle title="Share Capital Reports" subtitle="Registers and Compliance Reports" />
      <DataTablePlaceholder
        columns={["Member Code", "Member Name", "Share Class", "No Of Shares", "Share Capital Value", "KYC Status"]}
        rows={(shareRegister ?? []).map((item) => ({
          "Member Code": String(item.memberCode ?? ""),
          "Member Name": String(item.memberName ?? ""),
          "Share Class": String(item.shareClass ?? ""),
          "No Of Shares": String(item.noOfShares ?? ""),
          "Share Capital Value": String(item.shareCapitalValue ?? ""),
          "KYC Status": String(item.kycStatus ?? "")
        }))}
      />
      <DataTablePlaceholder
        columns={["Member Code", "Member Name", "Share Class", "Dividend Amount", "Payment Status"]}
        rows={(dividendRegister ?? []).map((item) => ({
          "Member Code": String(item.memberCode ?? ""),
          "Member Name": String(item.memberName ?? ""),
          "Share Class": String(item.shareClass ?? ""),
          "Dividend Amount": String(item.dividendAmount ?? ""),
          "Payment Status": String(item.paymentStatus ?? "")
        }))}
      />
      <DataTablePlaceholder
        columns={["Member Code", "Member Name", "Branch", "KYC Status"]}
        rows={(kycDeficient ?? []).map((item) => {
          const branch = item.branch && typeof item.branch === "object" ? (item.branch as Record<string, unknown>) : null;
          return {
            "Member Code": String(item.memberCode ?? ""),
            "Member Name": String(item.memberName ?? ""),
            Branch: branch ? String(branch.name ?? "") : "",
            "KYC Status": String(item.kycStatus ?? "")
          };
        })}
      />
    </div>
  );
};
