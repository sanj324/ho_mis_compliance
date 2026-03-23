import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";
import { Breadcrumbs } from "./Breadcrumbs";
export const AppLayout = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (_jsxs("div", { className: "app-shell", children: [mobileMenuOpen ? _jsx("button", { className: "fixed inset-0 z-30 bg-slate-950/30 lg:hidden", onClick: () => setMobileMenuOpen(false) }) : null, _jsx(AppSidebar, { mobileOpen: mobileMenuOpen, onNavigate: () => setMobileMenuOpen(false) }), _jsxs("div", { className: "flex min-h-screen flex-col lg:pl-0", children: [_jsx(AppHeader, { onToggleMenu: () => setMobileMenuOpen((current) => !current) }), _jsx("main", { className: "app-main", children: _jsxs("div", { className: "app-main-content", children: [_jsx(Breadcrumbs, {}), _jsx(Outlet, {})] }) })] })] }));
};
