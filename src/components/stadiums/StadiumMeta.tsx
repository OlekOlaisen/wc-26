import { Building2, MapPin, Users } from "lucide-react";
import type { Stadium } from "@/api/types";
import { useTeams } from "@/hooks/useCatalog";
import { getHostCountryFlag } from "@/lib/hostCountryFlag";
import { cn } from "@/lib/utils";

const metaIconClass = "h-3.5 w-3.5 shrink-0 opacity-70";

export function HostCountryFlag({
  countryEn,
  className,
}: {
  countryEn: string;
  className?: string;
}) {
  const { data: teams = [] } = useTeams();
  const flagUrl = getHostCountryFlag(countryEn, teams);

  if (!flagUrl) {
    return null;
  }

  return (
    <img
      src={flagUrl}
      alt=""
      className={cn("shrink-0 rounded object-cover", className)}
      loading="lazy"
    />
  );
}

export function VenueFlagIcon({ countryEn }: { countryEn: string }) {
  const { data: teams = [] } = useTeams();
  const flagUrl = getHostCountryFlag(countryEn, teams);

  if (flagUrl) {
    return (
      <img
        src={flagUrl}
        alt=""
        className="h-11 w-11 shrink-0 rounded-xl object-cover ring-1 ring-border"
        loading="lazy"
      />
    );
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
      <Building2 className="h-5 w-5" aria-hidden />
    </div>
  );
}

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
      <HostCountryFlag
        countryEn={stadium.country_en}
        className="h-3 w-4"
      />
      <span className="truncate">
        {stadium.name_en} · {stadium.city_en}
      </span>
    </p>
  );
}
