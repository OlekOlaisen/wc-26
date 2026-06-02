import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MatchCard } from "@/components/schedule/MatchCard";
import { Button } from "@/components/ui/button";
import { MatchDetailSheet } from "@/components/schedule/MatchDetailSheet";
import { Skeleton } from "@/components/ui/skeleton";
import type { EnrichedMatch } from "@/api/types";
import { useTournamentData } from "@/hooks/useTournamentData";
import { usePreferences } from "@/stores/preferencesStore";

export function LivePage() {
  usePreferences();
  const { matches, isLoading, isError } = useTournamentData();
  const [selectedMatch, setSelectedMatch] = useState<EnrichedMatch | null>(
    null,
  );

  const liveMatches = useMemo(
    () =>
      matches
        .filter((match) => match.status === "live")
        .sort((left, right) => left.kickoffAt.getTime() - right.kickoffAt.getTime()),
    [matches],
  );

  const nextUpcoming = useMemo(
    () => matches.find((match) => match.status === "upcoming"),
    [matches],
  );

  if (isLoading) {
    return <Skeleton className="h-40 w-full" />;
  }

  if (isError) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Could not load live matches.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Live now</h2>
        <p className="text-sm text-muted-foreground">
          {liveMatches.length} match{liveMatches.length === 1 ? "" : "es"} in
          progress
        </p>
      </div>

      {liveMatches.length === 0 ? (
        <div className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            No live matches right now.
          </p>
          {nextUpcoming && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Next up
              </p>
              <MatchCard
                match={nextUpcoming}
                onSelect={setSelectedMatch}
              />
            </div>
          )}
          <div className="flex justify-center">
            <Button asChild>
              <Link to="/">View full schedule</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {liveMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onSelect={setSelectedMatch}
            />
          ))}
        </div>
      )}

      <MatchDetailSheet
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
      />
    </div>
  );
}
