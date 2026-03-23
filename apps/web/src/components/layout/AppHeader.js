import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Menu } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { notificationApi } from "../../features/notifications/services/notificationApi";
import { useAuthStore } from "../../features/auth/store/authStore";
import { appMenuSections } from "../../utils/menu";
export const AppHeader = ({ onToggleMenu }) => {
    const location = useLocation();
    const user = useAuthStore((state) => state.user);
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const { data } = useQuery({
        queryKey: ["notifications", "header"],
        queryFn: notificationApi.list
    });
    const unreadCount = (data ?? []).filter((item) => !item.isRead).length;
    const activeSection = useMemo(() => appMenuSections.find((section) => section.items.some((item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`))) ?? appMenuSections[0] ?? { title: "", items: [] }, [location.pathname]);
    return (_jsxs("header", { className: "sticky top-0 z-20 border-b border-white/60 bg-white/78 backdrop-blur-xl", children: [_jsxs("div", { className: "flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { type: "button", className: "rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm lg:hidden", onClick: onToggleMenu, children: _jsx(Menu, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-[11px] font-semibold uppercase tracking-[0.28em] text-teal-700/80", children: "Head Office Control Tower" }), _jsx("p", { className: "mt-1 text-xl font-semibold tracking-tight text-slate-950", children: user?.fullName ?? "Guest User" }), _jsx("p", { className: "mt-1 text-sm text-slate-500", children: "Operational oversight across governance, compliance, treasury, assets, and inventory." })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs(Link, { className: "hidden rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm sm:inline-flex", to: "/notifications", children: ["Notifications (", unreadCount, ")"] }), _jsx("button", { type: "button", className: "rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm", onClick: () => {
                                    clearAuth();
                                    window.localStorage.removeItem("accessToken");
                                }, children: "Logout" })] })] }), _jsx("div", { className: "hidden border-t border-slate-200/80 lg:block", children: _jsx("div", { className: "overflow-x-auto px-6 lg:px-8", children: _jsx("nav", { className: "flex min-w-max items-center gap-2 py-3.5", children: appMenuSections.map((section) => {
                            const active = activeSection.title === section.title;
                            const href = section.items[0]?.path ?? "/";
                            return (_jsx(NavLink, { to: href, className: `rounded-full px-4 py-2 text-sm font-medium transition-colors ${active ? "bg-slate-950 text-white shadow-[0_10px_30px_-18px_rgba(15,23,42,0.9)]" : "bg-white text-slate-700 hover:bg-slate-100"}`, children: section.title }, section.title));
                        }) }) }) }), _jsx("div", { className: "hidden border-t border-slate-200/80 bg-white/65 lg:block", children: _jsx("div", { className: "overflow-x-auto px-6 lg:px-8", children: _jsx("nav", { className: "flex min-w-max items-center gap-2 py-3.5", children: activeSection.items.map((item) => (_jsx(NavLink, { to: item.path, className: ({ isActive }) => `rounded-full px-3 py-2 text-sm transition-colors ${isActive ? "bg-teal-50 text-teal-900 shadow-sm ring-1 ring-teal-200" : "text-slate-600 hover:bg-slate-100"}`, children: item.label }, item.path))) }) }) })] }));
};
