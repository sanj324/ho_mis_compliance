import clsx from "clsx";
import type { ReactElement } from "react";

import type { StatusTone } from "../../types";

type StatusBadgeProps = {
  label: string;
  tone?: StatusTone;
};

export const StatusBadge = ({ label, tone = "default" }: StatusBadgeProps): ReactElement => (
  <span
    className={clsx("rounded-full px-3 py-1 text-xs font-semibold", {
      "bg-slate-100 text-slate-700": tone === "default",
      "bg-emerald-100 text-emerald-700": tone === "success",
      "bg-amber-100 text-amber-700": tone === "warning"
    })}
  >
    {label}
  </span>
);
