import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation } from "react-router-dom";
import { resolveModuleTheme } from "../../utils/moduleTheme";
export const PageTitle = ({ title, subtitle }) => {
    const location = useLocation();
    const theme = resolveModuleTheme(location.pathname);
    return (_jsxs("div", { className: "app-hero", style: { background: theme.heroBackground }, children: [_jsx("div", { className: "pointer-events-none absolute inset-y-0 right-0 w-40 opacity-90", style: { background: theme.glowBackground } }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "page-toolbar", children: _jsx("span", { className: `inline-flex items-center rounded-full border border-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] shadow-sm ${theme.badgeTextClass}`, style: { background: theme.badgeBackground }, children: theme.label }) }), _jsx("p", { className: "page-kicker", children: subtitle }), _jsx("h1", { className: "page-heading", children: title }), _jsx("p", { className: "page-copy", children: "Structured entry workflows, stronger visual hierarchy, and polished report surfaces designed for board-level demos and daily operations." })] })] }));
};
