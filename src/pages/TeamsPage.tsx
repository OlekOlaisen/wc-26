import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { TeamCard } from "@/components/teams/TeamCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useTournamentData } from "@/hooks/useTournamentData";

export function TeamsPage() {
  const { teams, isLoading, isError } = useTournamentData();
  const [searchQuery, setSearchQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState<string | null>(null);

  const groupLetters = useMemo(() => {
    const letters = new Set(teams.map((team) => team.groups));
    return [...letters].sort();
  }, [teams]);

  const filteredTeams = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return teams
      .filter((team) => {
        if (groupFilter && team.groups !== groupFilter) {
          return false;
        }
        if (!query) {
          return true;
        }
        return (
          team.name_en.toLowerCase().includes(query) ||
          team.fifa_code.toLowerCase().includes(query)
        );
      })
      .sort((left, right) => left.name_en.localeCompare(right.name_en));
  }, [teams, searchQuery, groupFilter]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-36" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/50 p-4 text-center text-sm">
        Could not load teams.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Teams</h2>
          <p className="text-sm text-muted-foreground">
            {teams.length} nations
          </p>
        </div>
        <Link to="/more" className="text-sm text-primary underline">
          More
        </Link>
      </div>

      <Input
        placeholder="Search teams..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setGroupFilter(null)}
          className={`cursor-pointer rounded-md border px-2.5 py-1 text-xs ${groupFilter === null ? "border-primary bg-primary/15 text-primary" : "border-border"}`}
        >
          All
        </button>
        {groupLetters.map((letter) => (
          <button
            key={letter}
            type="button"
            onClick={() => setGroupFilter(letter)}
            className={`cursor-pointer rounded-md border px-2.5 py-1 text-xs ${groupFilter === letter ? "border-primary bg-primary/15 text-primary" : "border-border"}`}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filteredTeams.map((team) => (
          <Link key={team.id} to={`/team/${team.id}`} className="block cursor-pointer">
            <TeamCard team={team} />
          </Link>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          No teams match your search.
        </p>
      )}
    </div>
  );
}
