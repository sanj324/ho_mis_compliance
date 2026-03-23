import type { ReactElement } from "react";
import { useLocation } from "react-router-dom";

import { resolveModuleTheme } from "../../utils/moduleTheme";

export const Breadcrumbs = (): ReactElement => {
  const location = useLocation();
  const theme = resolveModuleTheme(location.pathname);

  const segments = location.pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => segment.replace(/-/g, " "));

  return (
    <div className="app-panel mb-4 px-4 py-3.5 sm:px-5">
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <span className="font-medium text-slate-600">Workspace</span>
        <span className={`rounded-full border border-white/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${theme.badgeTextClass}`} style={{ background: theme.badgeBackground }}>
          {theme.label}
        </span>
        {segments.length ? (
          segments.map((segment, index) => (
            <span key={`${segment}-${index}`} className="inline-flex items-center gap-2">
              <span className="text-slate-300">/</span>
              <span className={index === segments.length - 1 ? "font-semibold capitalize text-slate-900" : "capitalize"}>{segment}</span>
            </span>
          ))
        ) : (
          <span className="font-semibold capitalize text-slate-900">dashboard</span>
        )}
      </div>
    </div>
  );
};
