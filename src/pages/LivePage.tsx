import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ExampleGoalTestButtons } from "@/components/dev/ExampleGoalTestButtons";
import { MatchCard } from "@/components/schedule/MatchCard";
import { Button } from "@/components/ui/button";
import { MatchDetailSheet } from "@/components/schedule/MatchDetailSheet";
import { Skeleton } from "@/components/ui/skeleton";
import type { EnrichedMatch } from "@/api/types";
import { useTournamentData } from "@/hooks/useTournamentData";
import {
  useExampleDataEnabled,
  usePreferences,
} from "@/stores/preferencesStore";

export function LivePage() {
  usePreferences();
  const useExampleData = useExampleDataEnabled();
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
        <div className="space-y-8">
          <div className="flex min-h-[min(42vh,320px)] flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/10 px-6 py-16 text-center">
            <p className="text-base font-medium text-foreground/90">
              No live matches right now
            </p>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Scores and match updates will appear here once play begins.
            </p>
          </div>

          {nextUpcoming && (
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Next up
              </h3>
              <MatchCard
                match={nextUpcoming}
                onSelect={setSelectedMatch}
              />
            </section>
          )}

          <div className="flex justify-center pb-2">
            <Button asChild>
              <Link to="/">View full schedule</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {liveMatches.map((match) =>
            useExampleData ? (
              <div key={match.id} className="space-y-0">
                <MatchCard match={match} onSelect={setSelectedMatch} />
                <div className="-mt-2 rounded-b-xl border border-t-0 border-border/60 bg-muted/20 px-4 pb-3">
                  <ExampleGoalTestButtons match={match} />
                </div>
              </div>
            ) : (
              <MatchCard
                key={match.id}
                match={match}
                onSelect={setSelectedMatch}
              />
            ),
          )}
        </div>
      )}

      <MatchDetailSheet
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
      />
    </div>
  );
}
