import type { ReactElement } from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";

import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";
import { Breadcrumbs } from "./Breadcrumbs";

export const AppLayout = (): ReactElement => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      {mobileMenuOpen ? <button className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" onClick={() => setMobileMenuOpen(false)} /> : null}
      <AppSidebar mobileOpen={mobileMenuOpen} onNavigate={() => setMobileMenuOpen(false)} />
      <div className="flex min-h-screen flex-col lg:pl-0">
        <AppHeader onToggleMenu={() => setMobileMenuOpen((current) => !current)} />
        <main className="app-main">
          <div className="app-main-content">
            <Breadcrumbs />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
