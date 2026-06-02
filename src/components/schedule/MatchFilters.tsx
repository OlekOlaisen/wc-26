import { Button } from "@/components/ui/button";
import type { MatchFilter } from "@/api/types";
import { cn } from "@/lib/utils";

const filters: { value: MatchFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "live", label: "Live" },
  { value: "upcoming", label: "Upcoming" },
  { value: "finished", label: "Finished" },
];

interface MatchFiltersProps {
  activeFilter: MatchFilter;
  onFilterChange: (filter: MatchFilter) => void;
  favoritesOnly: boolean;
  onFavoritesOnlyChange: (enabled: boolean) => void;
}

export function MatchFilters({
  activeFilter,
  onFilterChange,
  favoritesOnly,
  onFavoritesOnlyChange,
}: MatchFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {filters.map(({ value, label }) => (
        <Button
          key={value}
          size="sm"
          variant={activeFilter === value ? "default" : "outline"}
          className={cn("shrink-0")}
          onClick={() => onFilterChange(value)}
        >
          {label}
        </Button>
      ))}
      <Button
        size="sm"
        variant={favoritesOnly ? "default" : "outline"}
        className={cn("shrink-0")}
        onClick={() => onFavoritesOnlyChange(!favoritesOnly)}
      >
        ★ Favorites
      </Button>
    </div>
  );
}
