import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { EnrichedMatch } from "@/api/types";
import { formatScorerSummary } from "@/lib/goalTimeline";
import { getMatchWinnerSide } from "@/lib/matchWinner";
import {
  formatDateInUserTimezone,
  formatKickoffInUserTimezone,
} from "@/lib/formatMatchTime";
import { useFavoriteTeamIds } from "@/stores/favoritesStore";
import { usePreferences } from "@/stores/preferencesStore";
import { cn } from "@/lib/utils";

interface MatchCardProps {
  match: EnrichedMatch;
  onSelect: (match: EnrichedMatch) => void;
}

function TeamRow({
  name,
  flag,
  score,
  align,
  isWinner,
}: {
  name: string;
  flag?: string;
  score: string;
  align: "left" | "right";
  isWinner?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-1 items-center gap-2",
        align === "right" && "flex-row-reverse text-right",
      )}
    >
      {flag ? (
        <img
          src={flag}
          alt=""
          className="h-6 w-8 shrink-0 rounded object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-6 w-8 shrink-0 items-center justify-center rounded bg-muted text-[10px] text-muted-foreground">
          ?
        </div>
      )}
      <span className="line-clamp-2 text-sm font-medium leading-tight">
        {name}
      </span>
      {isWinner && (
        <Trophy
          className="h-4 w-4 shrink-0 text-amber-500"
          aria-label="Winner"
        />
      )}
      <span className="min-w-[1.5rem] text-2xl font-bold tabular-nums leading-none">
        {score}
      </span>
    </div>
  );
}

export function MatchCard({ match, onSelect }: MatchCardProps) {
  usePreferences();
  const favoriteTeamIds = useFavoriteTeamIds();
  const showScore =
    match.status === "live" || match.status === "finished";
  const scorerSummary = formatScorerSummary(match);
  const isFavorite =
    favoriteTeamIds.includes(match.home_team_id) ||
    favoriteTeamIds.includes(match.away_team_id);
  const winnerSide =
    match.status === "finished"
      ? getMatchWinnerSide(match.home_score, match.away_score)
      : null;

  return (
    <Card
      className={cn(
        "cursor-pointer transition-colors hover:bg-accent/30",
        isFavorite && "ring-1 ring-primary/30",
      )}
      onClick={() => onSelect(match)}
    >
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {match.status === "live" && (
              <Badge variant="live">LIVE</Badge>
            )}
            {isFavorite && (
              <Badge variant="outline" className="text-primary">
                ★
              </Badge>
            )}
            <Badge variant="secondary">{match.stageLabel}</Badge>
            <span className="text-xs text-muted-foreground">
              #{match.id}
            </span>
          </div>
          {!showScore && (
            <Badge
              variant="secondary"
              className="h-auto shrink-0 flex-col items-end gap-0 py-1 text-right text-sm leading-tight"
            >
              <span>
                {formatDateInUserTimezone(match.kickoffAt, "EEE, MMM d")}
              </span>
              <span className="font-normal text-muted-foreground">
                {formatKickoffInUserTimezone(match.kickoffAt)}
              </span>
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3">
          <TeamRow
            name={match.homeDisplayName}
            flag={match.homeFlag}
            score={showScore ? match.home_score : ""}
            align="left"
            isWinner={winnerSide === "home"}
          />
          {showScore && (
            <span className="text-xs text-muted-foreground">–</span>
          )}
          <TeamRow
            name={match.awayDisplayName}
            flag={match.awayFlag}
            score={showScore ? match.away_score : ""}
            align="right"
            isWinner={winnerSide === "away"}
          />
        </div>

        {scorerSummary && (
          <p className="truncate text-center text-xs text-muted-foreground">
            {scorerSummary}
          </p>
        )}

        {match.status === "live" && match.time_elapsed !== "notstarted" && (
          <p className="text-center text-xs text-primary">
            {match.time_elapsed}
            &apos;
          </p>
        )}

        {match.stadium && (
          <p className="truncate text-center text-xs text-muted-foreground">
            {match.stadium.name_en} · {match.stadium.city_en}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
