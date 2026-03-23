import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { PageTitle } from "../../../components/common/PageTitle";
import { StatCard } from "../../../components/common/StatCard";
import { dashboardApi } from "../services/dashboardApi";
export const HODashboardPage = () => {
    const { data } = useQuery({
        queryKey: ["dashboard", "ho-summary"],
        queryFn: dashboardApi.getSummary
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "HO Dashboard", subtitle: "Executive Summary" }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-5", children: [_jsx(StatCard, { label: "Total Branches", value: data?.totalBranches ?? 0 }), _jsx(StatCard, { label: "Total Users", value: data?.totalUsers ?? 0 }), _jsx(StatCard, { label: "Active Users", value: data?.activeUsers ?? 0 }), _jsx(StatCard, { label: "Pending Approvals", value: data?.pendingUserApprovals ?? 0 }), _jsx(StatCard, { label: "Audit Events Today", value: data?.auditEventsToday ?? 0 })] })] }));
};
