import { MatchCardStageHeader } from "@/components/shared/MatchCardStageHeader";
import {
  finalMatchCardClassName,
  getWinnerGradientVariant,
  isFinalMatch,
  WinnerGradientOverlay,
} from "@/components/shared/WinnerGradientOverlay";
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
}: {
  name: string;
  flag?: string;
  scorers: GoalScorer[];
  align: "left" | "right";
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
  const isFinal = isFinalMatch(match.type);

  return (
    <Card
      className={cn(
        "relative overflow-hidden cursor-pointer transition-colors hover:bg-accent/30",
        isFavorite && "ring-1 ring-primary/30",
        isFinal && finalMatchCardClassName,
      )}
      onClick={() => onSelect(match)}
    >
      <WinnerGradientOverlay
        winnerSide={winnerSide}
        variant={getWinnerGradientVariant(match.type)}
      />
      <CardContent className="relative z-10 space-y-3 p-4">
        <MatchCardStageHeader
          stageLabel={match.stageLabel}
          matchType={match.type}
          group={match.group}
          winnerSide={winnerSide}
          isFavorite={isFavorite}
          trailing={
            <>
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
            </>
          }
        />

        <div className="flex items-start gap-2">
          <TeamColumn
            name={match.homeDisplayName}
            flag={match.homeFlag}
            scorers={match.homeScorersList}
            align="left"
          />
          {showScore && (
            <div
              className={cn(
                "flex shrink-0 items-center gap-1 self-start pt-0.5",
                isFinal ? "text-amber-200/70" : "text-muted-foreground",
              )}
              aria-label={`${match.home_score} to ${match.away_score}`}
            >
              <span
                className={cn(
                  "min-w-[1.25rem] text-center font-bold tabular-nums leading-none",
                  isFinal
                    ? "text-3xl text-amber-50 drop-shadow-[0_0_12px_oklch(0.75_0.12_85/0.35)]"
                    : "text-2xl text-foreground",
                )}
              >
                {match.home_score}
              </span>
              <span className="text-xs" aria-hidden>
                –
              </span>
              <span
                className={cn(
                  "min-w-[1.25rem] text-center font-bold tabular-nums leading-none",
                  isFinal
                    ? "text-3xl text-amber-50 drop-shadow-[0_0_12px_oklch(0.75_0.12_85/0.35)]"
                    : "text-2xl text-foreground",
                )}
              >
                {match.away_score}
              </span>
            </div>
          )}
          <TeamColumn
            name={match.awayDisplayName}
            flag={match.awayFlag}
            scorers={match.awayScorersList}
            align="right"
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
