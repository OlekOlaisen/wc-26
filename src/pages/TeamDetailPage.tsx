import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BackLink } from "@/components/layout/BackLink";
import { MatchCard } from "@/components/schedule/MatchCard";
import { MatchDetailSheet } from "@/components/schedule/MatchDetailSheet";
import { FavoriteStar } from "@/components/shared/FavoriteStar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { EnrichedMatch } from "@/api/types";
import { useTournamentData } from "@/hooks/useTournamentData";
import { getTeamFixtures } from "@/lib/teamFixtures";

export function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { matches, teamMap, isLoading, isError } = useTournamentData();
  const [selectedMatch, setSelectedMatch] = useState<EnrichedMatch | null>(
    null,
  );

  const team = id ? teamMap.get(id) : undefined;

  const fixtures = useMemo(
    () => (id ? getTeamFixtures(matches, id) : []),
    [matches, id],
  );

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (isError || !team) {
    return (
      <div className="space-y-4 text-center text-sm">
        <p>Team not found.</p>
        <BackLink to="/teams">Back to teams</BackLink>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BackLink to="/teams">Teams</BackLink>

      <div className="flex flex-col items-center gap-3 text-center">
        <img
          src={team.flag}
          alt=""
          className="h-16 w-24 rounded object-cover shadow"
        />
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">{team.name_en}</h2>
          <FavoriteStar teamId={team.id} />
        </div>
        <div className="flex gap-2">
          <Badge>{team.fifa_code}</Badge>
          <Badge variant="secondary">Group {team.groups}</Badge>
        </div>
        <Link
          to={`/bracket?tab=groups&group=${team.groups}`}
          className="text-sm text-primary underline"
        >
          View Group {team.groups} standings
        </Link>
      </div>

      <section className="space-y-3">
        <h3 className="font-semibold">Fixtures ({fixtures.length})</h3>
        <div className="space-y-3">
          {fixtures.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onSelect={setSelectedMatch}
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
