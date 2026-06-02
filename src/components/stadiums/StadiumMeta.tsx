import { MapPin, Users } from "lucide-react";
import type { Stadium } from "@/api/types";
import { cn } from "@/lib/utils";

const metaIconClass = "h-3.5 w-3.5 shrink-0 opacity-70";

interface StadiumMetaProps {
  stadium: Stadium;
  showCapacity?: boolean;
  className?: string;
}

export function StadiumMeta({
  stadium,
  showCapacity = true,
  className,
}: StadiumMetaProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground",
        className,
      )}
    >
      <span className="inline-flex min-w-0 items-center gap-1">
        <MapPin className={metaIconClass} aria-hidden />
        <span className="truncate">
          {stadium.city_en}, {stadium.country_en}
        </span>
      </span>
      {showCapacity && (
        <span className="inline-flex items-center gap-1">
          <Users className={metaIconClass} aria-hidden />
          <span>{stadium.capacity.toLocaleString()} seats</span>
        </span>
      )}
    </div>
  );
}

interface StadiumVenueLineProps {
  stadium: Stadium;
  className?: string;
}

export function StadiumVenueLine({ stadium, className }: StadiumVenueLineProps) {
  return (
    <p
      className={cn(
        "flex items-center justify-center gap-1 truncate text-center text-xs text-muted-foreground",
        className,
      )}
    >
      <MapPin className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
      <span className="truncate">
        {stadium.name_en} · {stadium.city_en}
      </span>
    </p>
  );
}
