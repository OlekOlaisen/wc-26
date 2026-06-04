import { useEffect, useRef } from "react";
import type { EnrichedMatch } from "@/api/types";
import {
  createMatchScoreSnapshot,
  detectFavoriteGoalEvents,
  type FavoriteGoalEvent,
  type MatchScoreSnapshot,
} from "@/lib/detectFavoriteGoals";
import { useFavoriteTeamIds } from "@/stores/favoritesStore";
import {
  pushGoalToast,
  type GoalToastVariant,
} from "@/stores/toastStore";

function formatGoalToast(event: FavoriteGoalEvent): {
  title: string;
  description: string;
  variant: GoalToastVariant;
} {
  const scoreLine = `${event.match.homeDisplayName} ${event.match.home_score}–${event.match.away_score} ${event.match.awayDisplayName}`;
  const variant: GoalToastVariant = event.scoredByFavorite
    ? "favorite"
    : "opponent";

  const title = event.scoredByFavorite
    ? `Goal for ${event.teamName}!`
    : `${event.teamName} scores`;

  const description = event.scorer
    ? `${event.scorer.name} ${event.scorer.minute}' · ${scoreLine}`
    : scoreLine;

  return { title, description, variant };
}

export function useFavoriteGoalToasts(matches: EnrichedMatch[]): void {
  const favoriteTeamIds = useFavoriteTeamIds();
  const snapshotsRef = useRef(new Map<string, MatchScoreSnapshot>());

  useEffect(() => {
    if (favoriteTeamIds.length === 0) {
      snapshotsRef.current.clear();
      return;
    }

    const snapshots = snapshotsRef.current;
    const liveMatchIds = new Set<string>();

    for (const match of matches) {
      if (match.status !== "live") {
        snapshots.delete(match.id);
        continue;
      }

      liveMatchIds.add(match.id);
      const currentSnapshot = createMatchScoreSnapshot(match);
      const previousSnapshot = snapshots.get(match.id);
      const goalEvents = detectFavoriteGoalEvents(
        match,
        previousSnapshot,
        favoriteTeamIds,
      );

      for (const goalEvent of goalEvents) {
        const { title, description, variant } = formatGoalToast(goalEvent);
        pushGoalToast(title, description, variant);
      }

      snapshots.set(match.id, currentSnapshot);
    }

    for (const matchId of snapshots.keys()) {
      if (!liveMatchIds.has(matchId)) {
        snapshots.delete(matchId);
      }
    }
  }, [matches, favoriteTeamIds]);
}
