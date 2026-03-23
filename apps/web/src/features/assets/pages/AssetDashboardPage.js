import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { PageTitle } from "../../../components/common/PageTitle";
import { StatCard } from "../../../components/common/StatCard";
import { assetApi } from "../services/assetApi";
export const AssetDashboardPage = () => {
    const { data } = useQuery({
        queryKey: ["assets", "dashboard"],
        queryFn: assetApi.getDashboardSummary
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "Asset Dashboard", subtitle: "Fixed Asset Control View" }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: [_jsx(StatCard, { label: "Total Assets", value: data?.totalAssets ?? 0 }), _jsx(StatCard, { label: "Original Cost", value: data?.totalOriginalCost ?? 0 }), _jsx(StatCard, { label: "Net Book Value", value: data?.totalNetBookValue ?? 0 }), _jsx(StatCard, { label: "Insurance Expiring", value: data?.insuranceExpiring ?? 0 })] })] }));
};
