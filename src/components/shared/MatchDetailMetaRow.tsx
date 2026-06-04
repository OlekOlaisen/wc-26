import { Calendar, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { EnrichedMatch, MatchStatus } from "@/api/types";
import {
  formatDateInUserTimezone,
  formatKickoffInUserTimezone,
} from "@/lib/formatMatchTime";
import { usePreferences } from "@/stores/preferencesStore";
import { cn } from "@/lib/utils";

function getStatusLabel(status: MatchStatus): string {
  switch (status) {
    case "live":
      return "Live";
    case "finished":
      return "Full time";
    default:
      return "Upcoming";
  }
}

interface MatchDetailMetaRowProps {
  match: EnrichedMatch;
  isFinal?: boolean;
}

export function MatchDetailMetaRow({
  match,
  isFinal = false,
}: MatchDetailMetaRowProps) {
  usePreferences();
  const labelClassName = isFinal
    ? "text-amber-200/50"
    : "text-muted-foreground";
  const valueClassName = isFinal ? "text-amber-50" : "text-foreground";
  const secondaryClassName = isFinal
    ? "text-amber-200/60"
    : "text-muted-foreground";
  const iconClassName = isFinal
    ? "final-detail-icon"
    : "bg-primary/15 text-primary";
  const shellClassName = isFinal
    ? "border-amber-400/25 bg-amber-950/25"
    : "border-border bg-card/60";
  const cellClassName = isFinal ? "bg-amber-950/15" : "bg-card/80";

  return (
    <div
      className={cn(
        "grid grid-cols-2 overflow-hidden rounded-xl border",
        shellClassName,
      )}
    >
      <section
        className={cn(
          "flex items-center gap-3 border-r px-3.5 py-3",
          isFinal ? "border-amber-400/20" : "border-border/80",
          cellClassName,
        )}
      >
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            iconClassName,
          )}
        >
          <Calendar className="h-4 w-4" aria-hidden />
        </div>
        <div className="min-w-0">
          <p
            className={cn(
              "text-[10px] font-semibold uppercase tracking-[0.14em]",
              labelClassName,
            )}
          >
            Kickoff
          </p>
          <p
            className={cn(
              "mt-1 text-sm font-semibold leading-tight",
              valueClassName,
            )}
          >
            {formatDateInUserTimezone(match.kickoffAt, "EEE, MMM d")}
          </p>
          <p className={cn("text-sm leading-tight", secondaryClassName)}>
            {formatKickoffInUserTimezone(match.kickoffAt)}
          </p>
        </div>
      </section>

      <section className={cn("flex items-center gap-3 px-3.5 py-3", cellClassName)}>
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            match.status === "live"
              ? "bg-red-600/20 text-red-500"
              : match.status === "finished"
                ? isFinal
                  ? "final-detail-icon"
                  : "bg-muted text-muted-foreground"
                : iconClassName,
          )}
        >
          {match.status === "live" ? (
            <span
              className="h-2 w-2 animate-pulse-live rounded-full bg-red-500"
              aria-hidden
            />
          ) : (
            <Circle className="h-3.5 w-3.5" aria-hidden />
          )}
        </div>
        <div className="flex min-w-0 flex-col items-center text-center">
          <p
            className={cn(
              "text-[10px] font-semibold uppercase tracking-[0.14em]",
              labelClassName,
            )}
          >
            Status
          </p>
          <div className="mt-1.5">
            {match.status === "live" ? (
              <Badge variant="live">{getStatusLabel(match.status)}</Badge>
            ) : (
              <Badge
                variant={
                  match.status === "finished" ? "secondary" : "outline"
                }
                className={cn(
                  isFinal &&
                    match.status === "finished" &&
                    "border-amber-400/30 bg-amber-500/15 text-amber-100",
                )}
              >
                {getStatusLabel(match.status)}
              </Badge>
            )}
          </div>
          {match.status === "live" &&
            match.time_elapsed !== "notstarted" && (
              <p className={cn("mt-1 text-xs", secondaryClassName)}>
                {match.time_elapsed}&apos; elapsed
              </p>
            )}
        </div>
      </section>
    </div>
  );
}
