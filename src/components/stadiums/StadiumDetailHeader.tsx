import { MapPin, Users } from "lucide-react";
import { VenueFlagIcon } from "@/components/stadiums/StadiumMeta";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Stadium } from "@/api/types";
import { getStadiumCountryAccentClass } from "@/lib/stadiumAccent";
import { cn } from "@/lib/utils";

interface StadiumDetailHeaderProps {
  stadium: Stadium;
  matchCount?: number;
}

function MetaChip({
  icon: Icon,
  children,
}: {
  icon: typeof MapPin;
  children: string;
}) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-border/80 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
      <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
      <span className="truncate">{children}</span>
    </span>
  );
}

export function StadiumDetailHeader({
  stadium,
  matchCount,
}: StadiumDetailHeaderProps) {
  const showFifaName =
    stadium.fifa_name.trim().length > 0 &&
    stadium.fifa_name.trim() !== stadium.name_en;

  return (
    <Card className="overflow-hidden">
      <div className="flex items-stretch">
        <div
          className={cn(
            "w-1.5 shrink-0",
            getStadiumCountryAccentClass(stadium.country_en),
          )}
          aria-hidden
        />
        <CardContent className="relative min-w-0 flex-1 p-4 sm:p-5">
          {stadium.region ? (
            <Badge
              variant="secondary"
              className="absolute right-4 top-4 shrink-0 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide"
            >
              {stadium.region}
            </Badge>
          ) : null}

          <div
            className={cn(
              "flex gap-4",
              stadium.region && "pr-16 sm:pr-20",
            )}
          >
            <VenueFlagIcon
              countryEn={stadium.country_en}
              className="h-14 w-14 rounded-2xl sm:h-16 sm:w-16"
            />
            <div className="min-w-0 flex-1 space-y-1">
              <h2 className="text-xl font-bold leading-tight tracking-tight sm:text-2xl">
                {stadium.name_en}
              </h2>
              {showFifaName ? (
                <p className="text-sm text-muted-foreground">
                  {stadium.fifa_name}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2 pt-2">
                <MetaChip icon={MapPin}>
                  {stadium.city_en}, {stadium.country_en}
                </MetaChip>
                <MetaChip icon={Users}>
                  {stadium.capacity.toLocaleString()} seats
                </MetaChip>
              </div>
              {matchCount !== undefined && matchCount > 0 ? (
                <p className="pt-1 text-xs text-muted-foreground">
                  {matchCount} {matchCount === 1 ? "match" : "matches"} at this
                  venue
                </p>
              ) : null}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
