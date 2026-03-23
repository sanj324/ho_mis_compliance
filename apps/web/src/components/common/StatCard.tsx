import type { ReactElement } from "react";

type StatCardProps = {
  label: string;
  value: string | number;
};

export const StatCard = ({ label, value }: StatCardProps): ReactElement => (
  <article className="rounded-[24px] border border-white/80 bg-[linear-gradient(145deg,rgba(240,253,250,0.96),rgba(255,255,255,0.98)_48%,rgba(224,242,254,0.92))] p-5 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.38)]">
    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
    <p className="mt-4 text-3xl font-semibold tracking-tight text-transparent bg-clip-text bg-[linear-gradient(135deg,#0f172a_0%,#0f766e_48%,#0284c7_100%)]">{value}</p>
  </article>
);
