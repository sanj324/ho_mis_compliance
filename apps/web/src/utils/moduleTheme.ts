export type ModuleTheme = {
  key: string;
  label: string;
  heroBackground: string;
  glowBackground: string;
  badgeBackground: string;
  badgeTextClass: string;
};

const defaultTheme: ModuleTheme = {
  key: "overview",
  label: "Overview",
  heroBackground: "linear-gradient(135deg, rgba(13, 148, 136, 0.16), rgba(255, 255, 255, 0.96) 42%, rgba(224, 242, 254, 0.9) 74%, rgba(255, 247, 237, 0.78))",
  glowBackground: "radial-gradient(circle at top right, rgba(14, 165, 233, 0.22), transparent 38%)",
  badgeBackground: "linear-gradient(135deg, rgba(204, 251, 241, 0.96), rgba(224, 242, 254, 0.95))",
  badgeTextClass: "text-teal-800"
};

const themeByModule: Record<string, ModuleTheme> = {
  overview: defaultTheme,
  governance: {
    key: "governance",
    label: "Governance",
    heroBackground: "linear-gradient(135deg, rgba(30, 64, 175, 0.16), rgba(255, 255, 255, 0.96) 40%, rgba(219, 234, 254, 0.92) 72%, rgba(226, 232, 240, 0.82))",
    glowBackground: "radial-gradient(circle at top right, rgba(59, 130, 246, 0.24), transparent 36%)",
    badgeBackground: "linear-gradient(135deg, rgba(219, 234, 254, 0.98), rgba(224, 231, 255, 0.94))",
    badgeTextClass: "text-blue-900"
  },
  compliance: {
    key: "compliance",
    label: "Compliance",
    heroBackground: "linear-gradient(135deg, rgba(15, 118, 110, 0.18), rgba(255, 255, 255, 0.96) 42%, rgba(220, 252, 231, 0.9) 72%, rgba(236, 253, 245, 0.82))",
    glowBackground: "radial-gradient(circle at top right, rgba(34, 197, 94, 0.22), transparent 38%)",
    badgeBackground: "linear-gradient(135deg, rgba(209, 250, 229, 0.98), rgba(204, 251, 241, 0.94))",
    badgeTextClass: "text-emerald-900"
  },
  masters: {
    key: "masters",
    label: "Masters",
    heroBackground: "linear-gradient(135deg, rgba(71, 85, 105, 0.18), rgba(255, 255, 255, 0.96) 42%, rgba(226, 232, 240, 0.92) 72%, rgba(248, 250, 252, 0.84))",
    glowBackground: "radial-gradient(circle at top right, rgba(100, 116, 139, 0.22), transparent 36%)",
    badgeBackground: "linear-gradient(135deg, rgba(241, 245, 249, 0.98), rgba(226, 232, 240, 0.94))",
    badgeTextClass: "text-slate-800"
  },
  payroll: {
    key: "payroll",
    label: "Payroll",
    heroBackground: "linear-gradient(135deg, rgba(124, 58, 237, 0.14), rgba(255, 255, 255, 0.96) 42%, rgba(233, 213, 255, 0.9) 72%, rgba(243, 232, 255, 0.82))",
    glowBackground: "radial-gradient(circle at top right, rgba(168, 85, 247, 0.22), transparent 36%)",
    badgeBackground: "linear-gradient(135deg, rgba(233, 213, 255, 0.98), rgba(245, 208, 254, 0.94))",
    badgeTextClass: "text-violet-900"
  },
  investments: {
    key: "investments",
    label: "Investments",
    heroBackground: "linear-gradient(135deg, rgba(2, 132, 199, 0.16), rgba(255, 255, 255, 0.96) 42%, rgba(191, 219, 254, 0.92) 70%, rgba(224, 242, 254, 0.82))",
    glowBackground: "radial-gradient(circle at top right, rgba(14, 165, 233, 0.24), transparent 38%)",
    badgeBackground: "linear-gradient(135deg, rgba(219, 234, 254, 0.98), rgba(186, 230, 253, 0.94))",
    badgeTextClass: "text-sky-900"
  },
  assets: {
    key: "assets",
    label: "Assets",
    heroBackground: "linear-gradient(135deg, rgba(217, 119, 6, 0.16), rgba(255, 255, 255, 0.96) 42%, rgba(254, 215, 170, 0.9) 72%, rgba(255, 237, 213, 0.82))",
    glowBackground: "radial-gradient(circle at top right, rgba(251, 146, 60, 0.24), transparent 38%)",
    badgeBackground: "linear-gradient(135deg, rgba(254, 215, 170, 0.98), rgba(254, 240, 138, 0.92))",
    badgeTextClass: "text-amber-900"
  },
  stationery: {
    key: "stationery",
    label: "Stationery",
    heroBackground: "linear-gradient(135deg, rgba(5, 150, 105, 0.16), rgba(255, 255, 255, 0.96) 42%, rgba(187, 247, 208, 0.9) 70%, rgba(220, 252, 231, 0.82))",
    glowBackground: "radial-gradient(circle at top right, rgba(16, 185, 129, 0.22), transparent 38%)",
    badgeBackground: "linear-gradient(135deg, rgba(209, 250, 229, 0.98), rgba(187, 247, 208, 0.94))",
    badgeTextClass: "text-green-900"
  },
  "share-capital": {
    key: "share-capital",
    label: "Share Capital",
    heroBackground: "linear-gradient(135deg, rgba(190, 24, 93, 0.14), rgba(255, 255, 255, 0.96) 42%, rgba(251, 207, 232, 0.9) 72%, rgba(253, 242, 248, 0.84))",
    glowBackground: "radial-gradient(circle at top right, rgba(244, 114, 182, 0.22), transparent 36%)",
    badgeBackground: "linear-gradient(135deg, rgba(251, 207, 232, 0.98), rgba(254, 205, 211, 0.94))",
    badgeTextClass: "text-pink-900"
  }
};

export const resolveModuleTheme = (pathname: string): ModuleTheme => {
  const firstSegment = pathname.split("/").filter(Boolean)[0] ?? "overview";
  return themeByModule[firstSegment] ?? defaultTheme;
};
