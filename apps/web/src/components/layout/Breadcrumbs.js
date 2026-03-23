import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation } from "react-router-dom";
import { resolveModuleTheme } from "../../utils/moduleTheme";
export const Breadcrumbs = () => {
    const location = useLocation();
    const theme = resolveModuleTheme(location.pathname);
    const segments = location.pathname
        .split("/")
        .filter(Boolean)
        .map((segment) => segment.replace(/-/g, " "));
    return (_jsx("div", { className: "app-panel mb-4 px-4 py-3.5 sm:px-5", children: _jsxs("div", { className: "flex flex-wrap items-center gap-2 text-sm text-slate-500", children: [_jsx("span", { className: "font-medium text-slate-600", children: "Workspace" }), _jsx("span", { className: `rounded-full border border-white/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${theme.badgeTextClass}`, style: { background: theme.badgeBackground }, children: theme.label }), segments.length ? (segments.map((segment, index) => (_jsxs("span", { className: "inline-flex items-center gap-2", children: [_jsx("span", { className: "text-slate-300", children: "/" }), _jsx("span", { className: index === segments.length - 1 ? "font-semibold capitalize text-slate-900" : "capitalize", children: segment })] }, `${segment}-${index}`)))) : (_jsx("span", { className: "font-semibold capitalize text-slate-900", children: "dashboard" }))] }) }));
};
