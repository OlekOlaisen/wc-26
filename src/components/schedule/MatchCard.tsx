import { WinnerTrophy } from "@/components/shared/WinnerTrophy";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { EnrichedMatch, GoalScorer } from "@/api/types";
import { getMatchWinnerSide } from "@/lib/matchWinner";
import {
  formatDateInUserTimezone,
  formatKickoffInUserTimezone,
} from "@/lib/formatMatchTime";
import { useFavoriteTeamIds } from "@/stores/favoritesStore";
import { usePreferences } from "@/stores/preferencesStore";
import { StadiumVenueLine } from "@/components/stadiums/StadiumMeta";
import { cn } from "@/lib/utils";

interface MatchCardProps {
  match: EnrichedMatch;
  onSelect: (match: EnrichedMatch) => void;
  showVenue?: boolean;
}

function TeamColumn({
  name,
  flag,
  scorers,
  align,
  isWinner,
}: {
  name: string;
  flag?: string;
  scorers: GoalScorer[];
  align: "left" | "right";
  isWinner?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-1",
        align === "right" && "items-end text-right",
      )}
    >
      <div
        className={cn(
          "flex w-full items-center gap-2",
          align === "right" && "flex-row-reverse",
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
        {isWinner && <WinnerTrophy className="h-5 w-5 shrink-0" />}
      </div>
      {scorers.length > 0 && (
        <ul
          className={cn(
            "flex flex-col gap-0.5 text-xs leading-snug text-muted-foreground",
            align === "right" ? "items-end text-right" : "items-start text-left",
          )}
        >
          {scorers.map((scorer) => (
            <li key={`${scorer.name}-${scorer.minute}`}>
              {scorer.name} {scorer.minute}&apos;
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function MatchCard({
  match,
  onSelect,
  showVenue = true,
}: MatchCardProps) {
  usePreferences();
  const favoriteTeamIds = useFavoriteTeamIds();
  const showScore =
    match.status === "live" || match.status === "finished";
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
          <div className="flex shrink-0 items-center gap-1.5">
            {match.status === "live" && (
              <Badge variant="live">LIVE</Badge>
            )}
            {!showScore && (
              <Badge
                variant="secondary"
                className="h-auto flex-col items-end gap-0 px-1.5 py-0.5 text-right text-[10px] leading-tight"
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
        </div>

        <div className="flex items-start gap-2">
          <TeamColumn
            name={match.homeDisplayName}
            flag={match.homeFlag}
            scorers={match.homeScorersList}
            align="left"
            isWinner={winnerSide === "home"}
          />
          {showScore && (
            <div
              className="flex shrink-0 items-center gap-1 self-start pt-0.5 text-muted-foreground"
              aria-label={`${match.home_score} to ${match.away_score}`}
            >
              <span className="min-w-[1.25rem] text-center text-2xl font-bold tabular-nums leading-none text-foreground">
                {match.home_score}
              </span>
              <span className="text-xs" aria-hidden>
                –
              </span>
              <span className="min-w-[1.25rem] text-center text-2xl font-bold tabular-nums leading-none text-foreground">
                {match.away_score}
              </span>
            </div>
          )}
          <TeamColumn
            name={match.awayDisplayName}
            flag={match.awayFlag}
            scorers={match.awayScorersList}
            align="right"
            isWinner={winnerSide === "away"}
          />
        </div>

        {match.status === "live" && match.time_elapsed !== "notstarted" && (
          <p className="text-center text-xs text-primary">
            {match.time_elapsed}
            &apos;
          </p>
        )}

        {showVenue && match.stadium && (
          <StadiumVenueLine stadium={match.stadium} />
        )}
      </CardContent>
    </Card>
  );
}
