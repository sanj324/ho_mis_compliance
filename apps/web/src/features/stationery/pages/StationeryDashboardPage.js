import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { PageTitle } from "../../../components/common/PageTitle";
import { StatCard } from "../../../components/common/StatCard";
import { stationeryApi } from "../services/stationeryApi";
export const StationeryDashboardPage = () => {
    const { data } = useQuery({
        queryKey: ["stationery", "dashboard"],
        queryFn: stationeryApi.getDashboardSummary
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "Stationery Dashboard", subtitle: "Inventory Control View" }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: [_jsx(StatCard, { label: "Total Items", value: data?.totalItems ?? 0 }), _jsx(StatCard, { label: "Low Stock", value: data?.lowStockCount ?? 0 }), _jsx(StatCard, { label: "Total Issued", value: data?.totalIssued ?? 0 }), _jsx(StatCard, { label: "Open Exceptions", value: data?.exceptionCount ?? 0 })] })] }));
};
