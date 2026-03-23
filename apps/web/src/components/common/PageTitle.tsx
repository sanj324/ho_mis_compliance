import type { ReactElement } from "react";
import { useLocation } from "react-router-dom";

import { resolveModuleTheme } from "../../utils/moduleTheme";

type PageTitleProps = {
  title: string;
  subtitle: string;
};

export const PageTitle = ({ title, subtitle }: PageTitleProps): ReactElement => {
  const location = useLocation();
  const theme = resolveModuleTheme(location.pathname);

  return (
    <div className="app-hero" style={{ background: theme.heroBackground }}>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-40 opacity-90" style={{ background: theme.glowBackground }} />
      <div className="relative">
        <div className="page-toolbar">
          <span className={`inline-flex items-center rounded-full border border-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] shadow-sm ${theme.badgeTextClass}`} style={{ background: theme.badgeBackground }}>
            {theme.label}
          </span>
        </div>
        <p className="page-kicker">{subtitle}</p>
        <h1 className="page-heading">{title}</h1>
        <p className="page-copy">Structured entry workflows, stronger visual hierarchy, and polished report surfaces designed for board-level demos and daily operations.</p>
      </div>
    </div>
  );
};
