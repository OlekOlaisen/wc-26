import { useMemo } from "react";
import { BackLink } from "@/components/layout/BackLink";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTournamentData } from "@/hooks/useTournamentData";
import { buildScorerLeaderboard } from "@/lib/aggregateScorers";

export function ScorersPage() {
  const { matches, isLoading, isError } = useTournamentData();

  const leaderboard = useMemo(
    () => buildScorerLeaderboard(matches),
    [matches],
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
        <p className="text-sm text-muted-foreground">
          Updated when goal data is available from live matches
        </p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No goals recorded yet. Scorer data appears during the tournament.
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((entry, index) => (
            <Card key={`${entry.playerName}-${entry.teamName}`}>
              <CardContent className="flex items-center gap-3 p-4">
                <span className="w-6 text-center text-sm font-bold text-muted-foreground">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{entry.playerName}</p>
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
          ))}
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
