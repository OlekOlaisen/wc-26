import { format, formatDistanceToNow } from "date-fns";
import { useMemo, useState } from "react";
import { DateStrip, dateKeyToDate } from "@/components/schedule/DateStrip";
import { MatchCard } from "@/components/schedule/MatchCard";
import { MatchDetailSheet } from "@/components/schedule/MatchDetailSheet";
import { MatchFilters } from "@/components/schedule/MatchFilters";
import { Skeleton } from "@/components/ui/skeleton";
import type { EnrichedMatch, MatchFilter } from "@/api/types";
import { useTournamentData } from "@/hooks/useTournamentData";
import { filterFavoriteMatches } from "@/lib/favoriteMatches";
import { groupMatchesByDate, sortMatchesByKickoff } from "@/lib/groupByDate";
import { useFavoriteTeamIds } from "@/stores/favoritesStore";
import { usePreferences } from "@/stores/preferencesStore";

export function SchedulePage() {
  const { matches, isLoading, isError, error, dataUpdatedAt } =
    useTournamentData();
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<MatchFilter>("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<EnrichedMatch | null>(
    null,
  );
  const favoriteTeamIds = useFavoriteTeamIds();
  const preferences = usePreferences();

  const showAllDates =
    favoritesOnly || activeFilter === "upcoming" || selectedDateKey === null;

  const matchesByDate = useMemo(
    () => groupMatchesByDate(matches),
    [matches, preferences.timezone],
  );

  const filteredMatches = useMemo(() => {
    let pool: EnrichedMatch[] = showAllDates
      ? matches
      : (matchesByDate.get(selectedDateKey!) ?? []);

    if (favoritesOnly) {
      pool = filterFavoriteMatches(pool, favoriteTeamIds);
    }

    const filtered =
      activeFilter === "all"
        ? pool
        : pool.filter((match) => match.status === activeFilter);
    return sortMatchesByKickoff(filtered);
  }, [
    matches,
    matchesByDate,
    selectedDateKey,
    showAllDates,
    favoritesOnly,
    favoriteTeamIds,
    activeFilter,
  ]);

  const filteredMatchesByDate = useMemo(() => {
    if (!showAllDates) {
      return null;
    }
    return groupMatchesByDate(filteredMatches);
  }, [showAllDates, filteredMatches, preferences.timezone]);

  const filteredDateKeys = useMemo(() => {
    if (!filteredMatchesByDate) {
      return [];
    }
    return [...filteredMatchesByDate.keys()].sort((left, right) =>
      left.localeCompare(right),
    );
  }, [filteredMatchesByDate]);

  function handleFavoritesOnlyChange(enabled: boolean) {
    setFavoritesOnly(enabled);
    if (enabled) {
      setSelectedDateKey(null);
    }
  }

  function handleFilterChange(filter: MatchFilter) {
    setActiveFilter(filter);
    if (filter === "live") {
      setFavoritesOnly(false);
    }
    if (filter === "upcoming") {
      setSelectedDateKey(null);
    }
  }

  function handleSelectDateKey(dateKey: string) {
    setFavoritesOnly(false);
    if (activeFilter === "upcoming") {
      setActiveFilter("all");
    }
    setSelectedDateKey((currentDateKey) =>
      currentDateKey === dateKey ? null : dateKey,
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-sm">
        <p className="font-medium">Could not load matches</p>
        <p className="mt-1 text-muted-foreground">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  const dateStripSelection =
    favoritesOnly || activeFilter === "upcoming" ? null : selectedDateKey;

  function getScheduleSubtitle(): string {
    if (favoritesOnly && activeFilter === "upcoming") {
      return "Favorite teams · upcoming";
    }
    if (favoritesOnly) {
      return "Favorite teams · all dates";
    }
    if (activeFilter === "upcoming") {
      return "All upcoming matches";
    }
    if (selectedDateKey) {
      return format(dateKeyToDate(selectedDateKey), "EEEE, MMMM d, yyyy");
    }
    if (activeFilter === "live") {
      return "All live matches";
    }
    if (activeFilter === "finished") {
      return "All finished matches";
    }
    return "All dates";
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Schedule</h2>
          <p className="text-xs text-muted-foreground">
            {getScheduleSubtitle()}
          </p>
        </div>
        {dataUpdatedAt > 0 && (
          <span className="text-[10px] text-muted-foreground">
            Updated {formatDistanceToNow(dataUpdatedAt, { addSuffix: true })}
          </span>
        )}
      </div>

      <DateStrip
        selectedDateKey={dateStripSelection}
        onSelectDateKey={handleSelectDateKey}
      />

      <MatchFilters
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        favoritesOnly={favoritesOnly}
        onFavoritesOnlyChange={handleFavoritesOnlyChange}
      />

      {favoritesOnly && favoriteTeamIds.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          <p>
            No favorite teams yet. Star teams from a team or match page to
            track their fixtures here.
          </p>
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          <p>
            {favoritesOnly
              ? "No favorite team matches match your filters."
              : activeFilter === "upcoming"
                ? "No upcoming matches."
                : selectedDateKey
                  ? "No matches match your filters on this day."
                  : "No matches match your filters."}
          </p>
        </div>
      ) : showAllDates ? (
        <div className="space-y-6">
          {filteredDateKeys.map((dateKey) => (
            <section key={dateKey} className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">
                {format(dateKeyToDate(dateKey), "EEEE, MMMM d, yyyy")}
              </h3>
              <div className="space-y-3">
                {(filteredMatchesByDate?.get(dateKey) ?? []).map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onSelect={setSelectedMatch}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMatches.map((match) => (
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
