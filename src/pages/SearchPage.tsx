import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useTournamentData } from "@/hooks/useTournamentData";
import { searchTournament } from "@/lib/searchMatches";

export function SearchPage() {
  const { matches, teams, stadiums, isLoading, isError } = useTournamentData();
  const [query, setQuery] = useState("");

  const results = useMemo(
    () => searchTournament(query, matches, teams, stadiums),
    [query, matches, teams, stadiums],
  );

  const hasQuery = query.trim().length > 0;

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (isError) {
    return (
      <p className="text-sm text-muted-foreground">Could not load data.</p>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Search</h2>
        <p className="text-sm text-muted-foreground">
          Matches, teams, and venues
        </p>
      </div>

      <Input
        placeholder="Search…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        autoFocus
      />

      {!hasQuery && (
        <p className="text-center text-sm text-muted-foreground">
          Type to search the tournament
        </p>
      )}

      {hasQuery && (
        <div className="space-y-6">
          <section className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Matches ({results.matches.length})
            </h3>
            {results.matches.length === 0 ? (
              <p className="text-sm text-muted-foreground">No matches found</p>
            ) : (
              results.matches.map((match) => (
                <Link
                  key={match.id}
                  to={`/match/${match.id}`}
                  className="block rounded-lg border p-3 text-sm transition-colors hover:bg-accent/30"
                >
                  <p className="font-medium">
                    {match.homeDisplayName} vs {match.awayDisplayName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    #{match.id} · {match.stageLabel}
                  </p>
                </Link>
              ))
            )}
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Teams ({results.teams.length})
            </h3>
            {results.teams.map((team) => (
              <Link
                key={team.id}
                to={`/team/${team.id}`}
                className="flex items-center gap-2 rounded-lg border p-3 text-sm hover:bg-accent/30"
              >
                <img
                  src={team.flag}
                  alt=""
                  className="h-5 w-7 rounded object-cover"
                />
                {team.name_en}
              </Link>
            ))}
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Venues ({results.stadiums.length})
            </h3>
            {results.stadiums.map((stadium) => (
              <Link
                key={stadium.id}
                to={`/stadium/${stadium.id}`}
                className="block rounded-lg border p-3 text-sm hover:bg-accent/30"
              >
                <p className="font-medium">{stadium.name_en}</p>
                <p className="text-xs text-muted-foreground">
                  {stadium.city_en}
                </p>
              </Link>
            ))}
          </section>
        </div>
      )}
    </div>
  );
}
