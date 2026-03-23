import { jsx as _jsx } from "react/jsx-runtime";
import clsx from "clsx";
export const StatusBadge = ({ label, tone = "default" }) => (_jsx("span", { className: clsx("rounded-full px-3 py-1 text-xs font-semibold", {
        "bg-slate-100 text-slate-700": tone === "default",
        "bg-emerald-100 text-emerald-700": tone === "success",
        "bg-amber-100 text-amber-700": tone === "warning"
    }), children: label }));
