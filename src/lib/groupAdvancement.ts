import type { Group, GroupStandingEntry } from "@/api/types";

export function isAdvancementPosition(rankIndex: number): boolean {
  return rankIndex < 2;
}

export function getGroupSummaryMessage(
  standings: GroupStandingEntry[],
): string | null {
  if (standings.length === 0) {
    return null;
  }

  const sorted = [...standings].sort((left, right) => {
    const pointsDiff = Number(right.pts) - Number(left.pts);
    if (pointsDiff !== 0) {
      return pointsDiff;
    }
    return Number(right.gd) - Number(left.gd);
  });

  const leader = sorted[0];
  const leaderPoints = Number(leader.pts);

  if (leaderPoints === 0 && Number(leader.mp) === 0) {
    return "Tournament not started — top 2 advance";
  }

  return `Top 2 advance · Leader on ${leaderPoints} pts`;
}

export function sortStandingsForGroup(group: Group): GroupStandingEntry[] {
  return [...group.teams].sort((left, right) => {
    const pointsDiff = Number(right.pts) - Number(left.pts);
    if (pointsDiff !== 0) {
      return pointsDiff;
    }
    return Number(right.gd) - Number(left.gd);
  });
}
