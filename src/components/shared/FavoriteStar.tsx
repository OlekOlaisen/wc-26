import { Star } from "lucide-react";
import { toggleFavoriteTeam, useIsFavoriteTeam } from "@/stores/favoritesStore";
import { cn } from "@/lib/utils";

interface FavoriteStarProps {
  teamId: string;
  className?: string;
}

export function FavoriteStar({ teamId, className }: FavoriteStarProps) {
  const isFavorite = useIsFavoriteTeam(teamId);

  if (teamId === "0") {
    return null;
  }

  return (
    <button
      type="button"
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "cursor-pointer rounded p-1 transition-colors hover:bg-accent",
        className,
      )}
      onClick={(event) => {
        event.stopPropagation();
        toggleFavoriteTeam(teamId);
      }}
    >
      <Star
        className={cn(
          "h-4 w-4",
          isFavorite ? "fill-primary text-primary" : "text-muted-foreground",
        )}
      />
    </button>
  );
}
