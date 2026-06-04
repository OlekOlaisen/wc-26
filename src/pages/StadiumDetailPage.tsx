import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { BackLink } from "@/components/layout/BackLink";
import { StadiumDetailHeader } from "@/components/stadiums/StadiumDetailHeader";
import { MatchCard } from "@/components/schedule/MatchCard";
import { MatchDetailSheet } from "@/components/schedule/MatchDetailSheet";
import { Skeleton } from "@/components/ui/skeleton";
import type { EnrichedMatch } from "@/api/types";
import { useTournamentData } from "@/hooks/useTournamentData";
import { getStadiumMatches } from "@/lib/stadiumSchedule";

export function StadiumDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { matches, stadiumMap, isLoading, isError } = useTournamentData();
  const [selectedMatch, setSelectedMatch] = useState<EnrichedMatch | null>(
    null,
  );

  const stadium = id ? stadiumMap.get(id) : undefined;

  const venueMatches = useMemo(
    () => (id ? getStadiumMatches(matches, id) : []),
    [matches, id],
  );

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (isError || !stadium) {
    return (
      <div className="space-y-4 text-center text-sm">
        <p>Venue not found.</p>
        <BackLink to="/stadiums">Back to venues</BackLink>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BackLink to="/stadiums">Venues</BackLink>

      <StadiumDetailHeader
        stadium={stadium}
        matchCount={venueMatches.length}
      />

      <section className="space-y-3">
        <h3 className="font-semibold">Matches at this venue</h3>
        <div className="space-y-3">
          {venueMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onSelect={setSelectedMatch}
              showVenue={false}
            />
          ))}
        </div>
      </section>

      <MatchDetailSheet
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
      />
    </div>
  );
}
