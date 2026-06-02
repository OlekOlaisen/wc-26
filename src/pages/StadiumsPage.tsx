import { useMemo } from "react";
import { Link } from "react-router-dom";
import { StadiumCard } from "@/components/stadiums/StadiumCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useTournamentData } from "@/hooks/useTournamentData";
import type { Stadium } from "@/api/types";

const countryOrder = ["United States", "Mexico", "Canada"];

function sortStadiums(stadiums: Stadium[]): Stadium[] {
  return [...stadiums].sort((left, right) => {
    const leftCountry = countryOrder.indexOf(left.country_en);
    const rightCountry = countryOrder.indexOf(right.country_en);
    const leftRank = leftCountry === -1 ? 99 : leftCountry;
    const rightRank = rightCountry === -1 ? 99 : rightCountry;
    if (leftRank !== rightRank) {
      return leftRank - rightRank;
    }
    return right.capacity - left.capacity;
  });
}

export function StadiumsPage() {
  const { stadiums, isLoading, isError } = useTournamentData();

  const sortedStadiums = useMemo(
    () => sortStadiums(stadiums),
    [stadiums],
  );

  const byCountry = useMemo(() => {
    const map = new Map<string, Stadium[]>();
    for (const stadium of sortedStadiums) {
      const list = map.get(stadium.country_en) ?? [];
      list.push(stadium);
      map.set(stadium.country_en, list);
    }
    return map;
  }, [sortedStadiums]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/50 p-4 text-center text-sm">
        Could not load stadiums.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Venues</h2>
          <p className="text-sm text-muted-foreground">
            {stadiums.length} host stadiums
          </p>
        </div>
        <Link to="/more" className="text-sm text-primary underline">
          More
        </Link>
      </div>

      {[...byCountry.entries()].map(([country, countryStadiums]) => (
        <section key={country} className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {country}
          </h3>
          <div className="space-y-3">
            {countryStadiums.map((stadium) => (
              <Link key={stadium.id} to={`/stadium/${stadium.id}`}>
                <StadiumCard stadium={stadium} />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
