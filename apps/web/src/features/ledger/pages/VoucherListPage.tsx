import type { ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";

import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { ledgerApi } from "../services/ledgerApi";

export const VoucherListPage = (): ReactElement => {
  const { data } = useQuery({
    queryKey: ["ledger", "vouchers"],
    queryFn: ledgerApi.listVouchers
  });

  return (
    <div className="space-y-6">
      <PageTitle title="Vouchers" subtitle="Ledger Posting Register" />
      <DataTablePlaceholder
        columns={["Voucher No", "Module", "Reference", "Narration", "Amount", "Posting Date"]}
        rows={(data ?? []).map((item) => ({
          "Voucher No": item.voucherNo,
          Module: item.moduleName,
          Reference: `${item.referenceType}/${item.referenceId}`,
          Narration: item.narration,
          Amount: String(item.totalAmount),
          "Posting Date": new Date(item.postingDate).toLocaleString()
        }))}
      />
    </div>
  );
};
