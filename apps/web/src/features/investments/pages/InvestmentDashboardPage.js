import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageTitle } from "../../../components/common/PageTitle";
import { StatCard } from "../../../components/common/StatCard";
import { investmentApi } from "../services/investmentApi";
export const InvestmentDashboardPage = () => {
    const { data } = useQuery({
        queryKey: ["investments", "dashboard"],
        queryFn: investmentApi.getDashboardSummary
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "Investment Dashboard", subtitle: "Treasury Portfolio Control" }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: [_jsx(StatCard, { label: "Total Investments", value: data?.totalCount ?? 0 }), _jsx(StatCard, { label: "Book Value", value: data?.totalBookValue ?? 0 }), _jsx(StatCard, { label: "Market Value", value: data?.totalMarketValue ?? 0 }), _jsx(StatCard, { label: "Rating Buckets", value: data?.byRating.length ?? 0 })] }), _jsxs("div", { className: "grid gap-6 xl:grid-cols-2", children: [_jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-6 shadow-panel", children: [_jsx("h3", { className: "text-sm font-semibold text-slate-900", children: "Classification Mix" }), _jsx("div", { className: "mt-4 h-72", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: data?.byClassification ?? [], children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "classification" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "bookValue", fill: "#0f4c81", radius: [8, 8, 0, 0] })] }) }) })] }), _jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-6 shadow-panel", children: [_jsx("h3", { className: "text-sm font-semibold text-slate-900", children: "Maturity Buckets" }), _jsx("div", { className: "mt-4 h-72", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(PieChart, { children: [_jsx(Pie, { data: data?.byMaturityBucket ?? [], dataKey: "count", nameKey: "bucket", outerRadius: 100, fill: "#0f4c81", label: true }), _jsx(Tooltip, {})] }) }) })] })] })] }));
};
