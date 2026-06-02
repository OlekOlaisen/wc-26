import type { EnrichedMatch, GoalScorer } from "@/api/types";

export interface GoalTimelineEntry {
  minute: string;
  playerName: string;
  teamName: string;
  minuteValue: number;
}

export function buildGoalTimeline(match: EnrichedMatch): GoalTimelineEntry[] {
  const entries: GoalTimelineEntry[] = [];

  for (const scorer of match.homeScorersList) {
    entries.push({
      minute: scorer.minute,
      playerName: scorer.name,
      teamName: match.homeDisplayName,
      minuteValue: Number.parseInt(scorer.minute, 10) || 0,
    });
  }

  for (const scorer of match.awayScorersList) {
    entries.push({
      minute: scorer.minute,
      playerName: scorer.name,
      teamName: match.awayDisplayName,
      minuteValue: Number.parseInt(scorer.minute, 10) || 0,
    });
  }

  return entries.sort((left, right) => left.minuteValue - right.minuteValue);
}

export function formatTeamScorers(scorers: GoalScorer[]): string | null {
  if (scorers.length === 0) {
    return null;
  }
  return scorers.map((scorer) => `${scorer.name} ${scorer.minute}'`).join(" · ");
}

export function formatScorerSummary(match: EnrichedMatch): string | null {
  const all = [
    ...match.homeScorersList.map(
      (scorer) => `${scorer.name} ${scorer.minute}'`,
    ),
    ...match.awayScorersList.map(
      (scorer) => `${scorer.name} ${scorer.minute}'`,
    ),
  ];
  if (all.length === 0) {
    return null;
  }
  return all.slice(0, 4).join(" · ") + (all.length > 4 ? "…" : "");
}
