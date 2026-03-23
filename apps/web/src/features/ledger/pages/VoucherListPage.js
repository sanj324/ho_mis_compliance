import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { ledgerApi } from "../services/ledgerApi";
export const VoucherListPage = () => {
    const { data } = useQuery({
        queryKey: ["ledger", "vouchers"],
        queryFn: ledgerApi.listVouchers
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "Vouchers", subtitle: "Ledger Posting Register" }), _jsx(DataTablePlaceholder, { columns: ["Voucher No", "Module", "Reference", "Narration", "Amount", "Posting Date"], rows: (data ?? []).map((item) => ({
                    "Voucher No": item.voucherNo,
                    Module: item.moduleName,
                    Reference: `${item.referenceType}/${item.referenceId}`,
                    Narration: item.narration,
                    Amount: String(item.totalAmount),
                    "Posting Date": new Date(item.postingDate).toLocaleString()
                })) })] }));
};
