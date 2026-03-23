import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { appMenuSections } from "../../utils/menu";
export const AppSidebar = ({ mobileOpen = false, onNavigate }) => {
    const location = useLocation();
    const activeSectionTitle = useMemo(() => appMenuSections.find((section) => section.items.some((item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)))?.title ?? "Overview", [location.pathname]);
    const [expandedSection, setExpandedSection] = useState(activeSectionTitle);
    return (_jsxs("aside", { className: `fixed inset-y-0 left-0 z-40 w-80 flex-col border-r border-white/10 bg-[linear-gradient(180deg,#0f172a_0%,#102a43_52%,#0f766e_100%)] text-white shadow-[0_22px_80px_-30px_rgba(15,23,42,0.9)] transition-transform ${mobileOpen ? "flex translate-x-0" : "hidden -translate-x-full"}`, children: [_jsxs("div", { className: "border-b border-white/10 px-6 py-7", children: [_jsx("p", { className: "text-[11px] font-semibold uppercase tracking-[0.32em] text-teal-100/90", children: "HO MIS" }), _jsx("h2", { className: "mt-3 text-2xl font-semibold tracking-tight", children: "Compliance Workflow" }), _jsx("p", { className: "mt-2 text-sm leading-6 text-slate-200/75", children: "Navigate module masters, entry screens, dashboards, and audit-ready reports." })] }), _jsx("nav", { className: "space-y-4 overflow-y-auto px-4 py-5", children: appMenuSections.map((section) => {
                    const expanded = expandedSection === section.title;
                    return (_jsxs("section", { className: "rounded-[22px] border border-white/10 bg-white/[0.05] backdrop-blur-sm", children: [_jsxs("button", { type: "button", className: "flex w-full items-center justify-between px-4 py-3.5 text-left", onClick: () => setExpandedSection(expanded ? "" : section.title), children: [_jsx("span", { className: "text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-100/80", children: section.title }), _jsx(ChevronDown, { className: `h-4 w-4 text-slate-200/70 transition-transform ${expanded ? "rotate-180" : ""}` })] }), expanded ? (_jsx("div", { className: "space-y-1 px-2 pb-2", children: section.items.map((item) => (_jsxs(NavLink, { to: item.path, onClick: onNavigate, className: ({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm ${isActive ? "bg-white/14 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]" : "text-slate-100/90 hover:bg-white/8"}`, children: [_jsx(item.icon, { className: "h-4 w-4" }), item.label] }, item.path))) })) : null] }, section.title));
                }) })] }));
};
