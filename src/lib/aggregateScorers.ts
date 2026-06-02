import type { EnrichedMatch, GoalScorer } from "@/api/types";

export interface ScorerLeaderboardEntry {
  playerName: string;
  teamName: string;
  goals: number;
  matchIds: string[];
}

function addScorerGoals(
  leaderboard: Map<string, ScorerLeaderboardEntry>,
  scorers: GoalScorer[],
  teamName: string,
  matchId: string,
): void {
  for (const scorer of scorers) {
    const key = `${scorer.name}::${teamName}`;
    const existing = leaderboard.get(key);
    if (existing) {
      existing.goals += 1;
      if (!existing.matchIds.includes(matchId)) {
        existing.matchIds.push(matchId);
      }
    } else {
      leaderboard.set(key, {
        playerName: scorer.name,
        teamName,
        goals: 1,
        matchIds: [matchId],
      });
    }
  }
}

export function buildScorerLeaderboard(
  matches: EnrichedMatch[],
): ScorerLeaderboardEntry[] {
  const leaderboard = new Map<string, ScorerLeaderboardEntry>();

  for (const match of matches) {
    addScorerGoals(
      leaderboard,
      match.homeScorersList,
      match.homeDisplayName,
      match.id,
    );
    addScorerGoals(
      leaderboard,
      match.awayScorersList,
      match.awayDisplayName,
      match.id,
    );
  }

  return [...leaderboard.values()].sort((left, right) => {
    if (right.goals !== left.goals) {
      return right.goals - left.goals;
    }
    return left.playerName.localeCompare(right.playerName);
  });
}
