import { Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { EnrichedMatch } from "@/api/types";
import {
  formatDateInUserTimezone,
  formatKickoffInUserTimezone,
} from "@/lib/formatMatchTime";
import { getMatchWinnerSide } from "@/lib/matchWinner";
import { usePreferences } from "@/stores/preferencesStore";

interface BracketMatchSlotProps {
  match: EnrichedMatch;
}

export function BracketMatchSlot({ match }: BracketMatchSlotProps) {
  usePreferences();
  const showScore =
    match.status === "live" || match.status === "finished";
  const winnerSide =
    match.status === "finished"
      ? getMatchWinnerSide(match.home_score, match.away_score)
      : null;

  return (
    <Link to={`/match/${match.id}`} className="block cursor-pointer">
      <Card className="transition-colors hover:bg-accent/30">
        <CardContent className="space-y-2 p-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs text-muted-foreground">#{match.id}</span>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
              {match.status === "live" && (
                <Badge variant="live">LIVE</Badge>
              )}
              <Badge
                variant="secondary"
                className="h-auto flex-col items-end gap-0 py-0.5 text-right text-[10px] leading-tight"
              >
                <span>
                  {formatDateInUserTimezone(match.kickoffAt, "EEE, MMM d")}
                </span>
                <span className="font-normal text-muted-foreground">
                  {formatKickoffInUserTimezone(match.kickoffAt)}
                </span>
              </Badge>
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-2">
              <span className="flex min-w-0 items-center gap-1 line-clamp-1">
                {winnerSide === "home" && (
                  <Trophy
                    className="h-3.5 w-3.5 shrink-0 text-amber-500"
                    aria-label="Winner"
                  />
                )}
                {match.homeDisplayName}
              </span>
              {showScore && (
                <span className="font-bold tabular-nums">
                  {match.home_score}
                </span>
              )}
            </div>
            <div className="flex justify-between gap-2">
              <span className="flex min-w-0 items-center gap-1 line-clamp-1">
                {winnerSide === "away" && (
                  <Trophy
                    className="h-3.5 w-3.5 shrink-0 text-amber-500"
                    aria-label="Winner"
                  />
                )}
                {match.awayDisplayName}
              </span>
              {showScore && (
                <span className="font-bold tabular-nums">
                  {match.away_score}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
