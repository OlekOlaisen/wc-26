import { ChevronRight } from "lucide-react";
import { StadiumMeta, VenueFlagIcon } from "@/components/stadiums/StadiumMeta";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Stadium } from "@/api/types";
import { cn } from "@/lib/utils";

interface StadiumCardProps {
  stadium: Stadium;
}

function getCountryAccentClass(country: string): string {
  switch (country) {
    case "United States":
      return "bg-blue-500/70";
    case "Mexico":
      return "bg-emerald-500/70";
    case "Canada":
      return "bg-red-500/70";
    default:
      return "bg-primary/50";
  }
}

export function StadiumCard({ stadium }: StadiumCardProps) {
  const showFifaName =
    stadium.fifa_name.trim().length > 0 &&
    stadium.fifa_name.trim() !== stadium.name_en;

  return (
    <Card className="overflow-hidden transition-colors group-hover:bg-accent/30">
      <CardContent className="flex items-stretch p-0">
        <div
          className={cn(
            "w-1 shrink-0",
            getCountryAccentClass(stadium.country_en),
          )}
          aria-hidden
        />
        <div className="flex min-w-0 flex-1 items-center gap-3 p-4">
          <VenueFlagIcon countryEn={stadium.country_en} />

          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold leading-tight">{stadium.name_en}</p>
              {stadium.region && (
                <Badge
                  variant="secondary"
                  className="shrink-0 px-1.5 py-0 text-[10px] leading-tight"
                >
                  {stadium.region}
                </Badge>
              )}
            </div>

            {showFifaName && (
              <p className="truncate text-xs text-muted-foreground">
                {stadium.fifa_name}
              </p>
            )}

            <StadiumMeta stadium={stadium} />
          </div>

          <ChevronRight
            className="h-5 w-5 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground"
            aria-hidden
          />
        </div>
      </CardContent>
    </Card>
  );
}
