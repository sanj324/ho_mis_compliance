import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { PageTitle } from "../../../components/common/PageTitle";
import { StatCard } from "../../../components/common/StatCard";
import { shareCapitalApi } from "../services/shareCapitalApi";
export const ShareCapitalDashboardPage = () => {
    const { data } = useQuery({
        queryKey: ["share-capital", "dashboard"],
        queryFn: shareCapitalApi.getDashboardSummary
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "Share Capital Dashboard", subtitle: "Member Capital Oversight" }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: [_jsx(StatCard, { label: "Total Members", value: data?.totalMembers ?? 0 }), _jsx(StatCard, { label: "Active Members", value: data?.activeMembers ?? 0 }), _jsx(StatCard, { label: "Total Share Capital", value: data?.totalShareCapital ?? 0 }), _jsx(StatCard, { label: "Pending Dividend", value: data?.pendingDividendAmount ?? 0 })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: [_jsx(StatCard, { label: "KYC Deficient", value: data?.kycDeficientMembers ?? 0 }), _jsx(StatCard, { label: "Frozen Members", value: data?.frozenMembers ?? 0 })] })] }));
};
