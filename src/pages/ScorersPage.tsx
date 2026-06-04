import { useMemo } from "react";
import { BackLink } from "@/components/layout/BackLink";
import { ScorerAvatar } from "@/components/scorers/ScorerAvatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useScorerPhotos } from "@/hooks/useScorerPhotos";
import { useTournamentData } from "@/hooks/useTournamentData";
import { buildScorerLeaderboard } from "@/lib/aggregateScorers";
import { enrichLeaderboardWithPhotos } from "@/lib/matchScorerPhotos";

export function ScorersPage() {
  const { matches, isLoading, isError } = useTournamentData();

  const leaderboard = useMemo(() => buildScorerLeaderboard(matches), [matches]);

  const scorerPhotosQuery = useScorerPhotos(leaderboard);

  const leaderboardWithPhotos = useMemo(
    () =>
      enrichLeaderboardWithPhotos(leaderboard, scorerPhotosQuery.data ?? []),
    [leaderboard, scorerPhotosQuery.data],
  );

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (isError) {
    return (
      <p className="text-sm text-muted-foreground">Could not load scorers.</p>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Top scorers</h2>
      </div>

      {leaderboardWithPhotos.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No goals recorded yet. Scorer data appears during the tournament.
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboardWithPhotos.map((entry, index) => {
            const displayName = entry.displayName ?? entry.playerName;

            return (
              <Card key={`${entry.playerName}-${entry.teamName}`}>
                <CardContent className="flex items-center gap-3 p-4">
                  <span className="w-6 text-center text-sm font-bold text-muted-foreground">
                    {index + 1}
                  </span>
                  <ScorerAvatar
                    playerName={displayName}
                    photoUrl={entry.photoUrl}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{displayName}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.teamName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{entry.goals}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {entry.matchIds.length} match
                      {entry.matchIds.length === 1 ? "" : "es"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <p className="flex justify-center">
        <BackLink to="/" className="text-xs">
          Schedule
        </BackLink>
      </p>
    </div>
  );
}
