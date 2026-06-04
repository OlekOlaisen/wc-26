const knockoutStageBadgeStyles: Record<string, string> = {
  r32:
    "border-teal-500/45 bg-teal-500/20 text-teal-100 shadow-[0_0_10px] shadow-teal-500/10",
  r16:
    "border-blue-500/45 bg-blue-600/25 text-blue-100 shadow-[0_0_10px] shadow-blue-500/10",
  qf:
    "border-rose-400/45 bg-rose-500/20 text-rose-100 shadow-[0_0_10px] shadow-rose-500/10",
  sf:
    "border-orange-400/45 bg-orange-500/20 text-orange-100 shadow-[0_0_10px] shadow-orange-500/10",
  third:
    "border-amber-700/40 bg-amber-900/30 text-amber-100/90 shadow-[0_0_10px] shadow-amber-800/10",
};

const groupBadgeStyles: Record<string, string> = {
  A: "border-sky-500/45 bg-sky-500/20 text-sky-100 shadow-[0_0_10px] shadow-sky-500/10",
  B: "border-emerald-500/45 bg-emerald-500/20 text-emerald-100 shadow-[0_0_10px] shadow-emerald-500/10",
  C: "border-lime-500/45 bg-lime-500/20 text-lime-100 shadow-[0_0_10px] shadow-lime-500/10",
  D: "border-amber-400/45 bg-amber-500/20 text-amber-100 shadow-[0_0_10px] shadow-amber-500/10",
  E: "border-yellow-500/45 bg-yellow-500/15 text-yellow-100 shadow-[0_0_10px] shadow-yellow-500/10",
  F: "border-red-500/45 bg-red-500/20 text-red-100 shadow-[0_0_10px] shadow-red-500/10",
  G: "border-fuchsia-400/45 bg-fuchsia-500/20 text-fuchsia-100 shadow-[0_0_10px] shadow-fuchsia-500/10",
  H: "border-pink-500/45 bg-pink-500/20 text-pink-100 shadow-[0_0_10px] shadow-pink-500/10",
  I: "border-purple-500/45 bg-purple-500/20 text-purple-100 shadow-[0_0_10px] shadow-purple-500/10",
  J: "border-indigo-400/45 bg-indigo-500/20 text-indigo-100 shadow-[0_0_10px] shadow-indigo-500/10",
  K: "border-violet-400/45 bg-violet-500/20 text-violet-100 shadow-[0_0_10px] shadow-violet-500/10",
  L: "border-cyan-500/45 bg-cyan-500/20 text-cyan-100 shadow-[0_0_10px] shadow-cyan-500/10",
};

const defaultStageBadgeClassName =
  "border-border/80 bg-secondary text-secondary-foreground";

function normalizeGroupKey(group: string): string {
  return group.trim().toUpperCase().slice(0, 1);
}

export function getStageBadgeClassName(
  matchType: string,
  group?: string,
): string {
  if (matchType === "group") {
    if (group) {
      const groupKey = normalizeGroupKey(group);
      return groupBadgeStyles[groupKey] ?? defaultStageBadgeClassName;
    }
    return groupBadgeStyles.A;
  }

  return knockoutStageBadgeStyles[matchType] ?? defaultStageBadgeClassName;
}

export function isFinalMatchType(matchType: string): boolean {
  return matchType === "final";
}
