import { Calendar, ChevronRight, MapPin } from "lucide-react";
import { MatchDetailMetaRow } from "@/components/shared/MatchDetailMetaRow";
import { FinalMatchAtmosphere } from "@/components/shared/FinalMatchAtmosphere";
import { WinnerTrophy } from "@/components/shared/WinnerTrophy";
import { Link, useNavigate } from "react-router-dom";
import { StageBadge } from "@/components/shared/StageBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { HostCountryFlag, StadiumMeta } from "@/components/stadiums/StadiumMeta";
import type { EnrichedMatch, GoalScorer, MatchStatus } from "@/api/types";
import {
  formatDateInUserTimezone,
  formatKickoffInUserTimezone,
} from "@/lib/formatMatchTime";
import { getMatchWinnerSide, type MatchWinnerSide } from "@/lib/matchWinner";
import { isFinalMatchType } from "@/lib/stageBadgeStyles";
import { usePreferences } from "@/stores/preferencesStore";
import { cn } from "@/lib/utils";
import { FavoriteStar } from "./FavoriteStar";

function TeamScorersList({
  scorers,
  className,
}: {
  scorers: GoalScorer[];
  className?: string;
}) {
  if (scorers.length === 0) {
    return null;
  }

  return (
    <ul
      className={cn(
        "flex flex-col gap-0.5 text-xs leading-snug",
        className,
      )}
    >
      {scorers.map((scorer) => (
        <li key={`${scorer.name}-${scorer.minute}`}>
          {scorer.name} {scorer.minute}&apos;
        </li>
      ))}
    </ul>
  );
}

function TeamFlagWithFavorite({
  flag,
  teamId,
  isFinal,
  flagClassName,
}: {
  flag?: string;
  teamId: string;
  isFinal: boolean;
  flagClassName: string;
}) {
  if (!flag) {
    return null;
  }

  return (
    <div className={cn("relative shrink-0", flagClassName)}>
      <img
        src={flag}
        alt=""
        className={cn(
          "h-full w-full rounded object-cover shadow-md",
          flagClassName,
        )}
      />
      <FavoriteStar
        teamId={teamId}
        className={cn(
          "absolute -right-1.5 -top-1.5 z-10 rounded-full p-0.5 shadow-sm ring-1 backdrop-blur-sm",
          isFinal
            ? "bg-amber-950/95 ring-amber-400/30 hover:bg-amber-900/95"
            : "bg-background/90 ring-border/50 hover:bg-background",
        )}
      />
    </div>
  );
}

function getFinalTeamSideClassName(
  side: MatchWinnerSide,
  winnerSide: MatchWinnerSide | null,
): string {
  if (!winnerSide) {
    return "";
  }

  if (winnerSide === side) {
    return "rounded-xl bg-amber-500/10 px-2 py-2 ring-1 ring-amber-400/25";
  }

  return "opacity-45";
}

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

interface MatchDetailContentProps {
  match: EnrichedMatch;
  showStageHeader?: boolean;
  layout?: "default" | "drawer";
  onNavigateAway?: () => void;
}

export function MatchDetailContent({
  match,
  showStageHeader = true,
  layout = "default",
  onNavigateAway,
}: MatchDetailContentProps) {
  usePreferences();
  const navigate = useNavigate();
  const winnerSide =
    match.status === "finished"
      ? getMatchWinnerSide(match.home_score, match.away_score)
      : null;
  const isFinal = isFinalMatchType(match.type);
  const showFinalWinner =
    isFinal && match.status === "finished" && winnerSide !== null;
  const winnerDisplayName =
    winnerSide === "home"
      ? match.homeDisplayName
      : winnerSide === "away"
        ? match.awayDisplayName
        : null;
  const detailIconClassName = isFinal
    ? "final-detail-icon"
    : "bg-primary/15 text-primary";

  return (
    <div className={cn("space-y-6", isFinal && "final-detail-content")}>
      {showStageHeader ? (
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div className="flex justify-start">
            {winnerSide === "home" && (
              <WinnerTrophy className={isFinal ? "h-6 w-6" : "h-5 w-5"} />
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {match.status === "live" && <Badge variant="live">LIVE</Badge>}
            <StageBadge
              stageLabel={match.stageLabel}
              matchType={match.type}
              group={match.group}
              className={isFinal ? "final-stage-badge--prominent" : undefined}
            />
          </div>
          <div className="flex justify-end">
            {winnerSide === "away" && (
              <WinnerTrophy className={isFinal ? "h-6 w-6" : "h-5 w-5"} />
            )}
          </div>
        </div>
      ) : null}

      <div
        className={cn(
          isFinal &&
            "relative overflow-hidden rounded-2xl border border-amber-200/20 bg-amber-950/20",
        )}
      >
        {showFinalWinner ? (
          <FinalMatchAtmosphere winnerSide={winnerSide} />
        ) : null}
        <div
          className={cn(
            "mx-auto flex w-full max-w-sm items-start justify-center gap-5 sm:gap-6",
            isFinal && "relative z-10 px-2 py-4",
            layout === "drawer" && !isFinal && "py-1",
          )}
        >
          <div
            className={cn(
              "flex w-[5.5rem] shrink-0 flex-col items-center gap-2 text-center",
              showFinalWinner &&
                getFinalTeamSideClassName("home", winnerSide),
            )}
          >
            <TeamFlagWithFavorite
              flag={match.homeFlag}
              teamId={match.home_team_id}
              isFinal={isFinal}
              flagClassName={isFinal ? "h-12 w-[4.25rem]" : "h-10 w-14"}
            />
            <div className="flex w-full flex-col items-center gap-1">
              <p
                className={cn(
                  "font-semibold",
                  showFinalWinner &&
                    (winnerSide === "home"
                      ? "text-amber-50"
                      : "text-amber-200/40"),
                )}
              >
                {match.homeDisplayName}
              </p>
              <TeamScorersList
                scorers={match.homeScorersList}
                className={
                  showFinalWinner
                    ? winnerSide === "home"
                      ? "text-amber-100/75"
                      : "text-amber-200/30"
                    : isFinal
                      ? "text-amber-200/55"
                      : "text-muted-foreground"
                }
              />
            </div>
          </div>
          <div className="shrink-0 self-start pt-0.5 text-center">
            <p
              className={cn(
                "font-bold tabular-nums",
                isFinal
                  ? "text-4xl text-amber-50 drop-shadow-[0_0_16px_oklch(0.75_0.12_85/0.4)]"
                  : "text-3xl",
              )}
            >
              {match.home_score} – {match.away_score}
            </p>
            {match.status === "live" && (
              <p className="text-sm text-primary">{match.time_elapsed}&apos;</p>
            )}
          </div>
          <div
            className={cn(
              "flex w-[5.5rem] shrink-0 flex-col items-center gap-2 text-center",
              showFinalWinner &&
                getFinalTeamSideClassName("away", winnerSide),
            )}
          >
            <TeamFlagWithFavorite
              flag={match.awayFlag}
              teamId={match.away_team_id}
              isFinal={isFinal}
              flagClassName={isFinal ? "h-12 w-[4.25rem]" : "h-10 w-14"}
            />
            <div className="flex w-full flex-col items-center gap-1">
              <p
                className={cn(
                  "font-semibold",
                  showFinalWinner &&
                    (winnerSide === "away"
                      ? "text-amber-50"
                      : "text-amber-200/40"),
                )}
              >
                {match.awayDisplayName}
              </p>
              <TeamScorersList
                scorers={match.awayScorersList}
                className={
                  showFinalWinner
                    ? winnerSide === "away"
                      ? "text-amber-100/75"
                      : "text-amber-200/30"
                    : isFinal
                      ? "text-amber-200/55"
                      : "text-muted-foreground"
                }
              />
            </div>
          </div>
        </div>
        {showFinalWinner && winnerDisplayName ? (
          <div className="relative z-10 border-t border-amber-400/20 px-4 py-3 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-300/80">
              Winner
            </p>
            <p className="mt-1 text-sm font-semibold text-amber-50">
              {winnerDisplayName}
            </p>
          </div>
        ) : null}
      </div>

      {layout === "drawer" ? (
        <MatchDetailMetaRow match={match} isFinal={isFinal} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <Card
            className={cn("flex h-full flex-col", isFinal && "final-detail-card")}
          >
            <CardContent className="flex flex-1 items-center gap-3 p-4 pt-4">
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                  detailIconClassName,
                )}
              >
                <Calendar className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Kickoff
                </p>
                <p className="mt-0.5 font-semibold leading-tight">
                  {formatDateInUserTimezone(match.kickoffAt)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatKickoffInUserTimezone(match.kickoffAt)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card
            className={cn("flex h-full flex-col", isFinal && "final-detail-card")}
          >
            <CardContent className="flex flex-1 items-center gap-3 p-4 pt-4">
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                  match.status === "live"
                    ? "bg-red-600/20 text-red-500"
                    : match.status === "finished"
                      ? isFinal
                        ? "final-detail-icon"
                        : "bg-muted text-muted-foreground"
                      : detailIconClassName,
                )}
              >
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    match.status === "live"
                      ? "animate-pulse-live bg-red-500"
                      : match.status === "finished"
                        ? "bg-muted-foreground"
                        : "bg-primary",
                  )}
                  aria-hidden
                />
              </div>
              <div className="flex min-w-0 flex-col items-center text-center">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
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
                    >
                      {getStatusLabel(match.status)}
                    </Badge>
                  )}
                </div>
                {match.status === "live" &&
                  match.time_elapsed !== "notstarted" && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {match.time_elapsed}&apos; elapsed
                    </p>
                  )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {match.stadium && (
        <Card
          className={cn(
            "overflow-hidden",
            isFinal && "final-detail-card",
            onNavigateAway && "relative z-10",
          )}
        >
          {onNavigateAway ? (
            <button
              type="button"
              className="flex w-full cursor-pointer items-center gap-3 p-4 text-left transition-colors hover:bg-accent/20"
              onClick={() => {
                onNavigateAway();
                navigate(`/stadium/${match.stadium!.id}`);
              }}
            >
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                  detailIconClassName,
                )}
              >
                <MapPin className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Venue
                </p>
                <p className="mt-0.5 flex min-w-0 items-center gap-2 text-base font-semibold leading-tight">
                  <HostCountryFlag
                    countryEn={match.stadium.country_en}
                    className="h-4 w-6"
                  />
                  <span className="truncate">{match.stadium.name_en}</span>
                </p>
                {match.stadium.fifa_name.trim() &&
                  match.stadium.fifa_name.trim() !== match.stadium.name_en && (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {match.stadium.fifa_name}
                    </p>
                  )}
                <div className="mt-1.5">
                  <StadiumMeta stadium={match.stadium} />
                </div>
              </div>
              <ChevronRight
                className="h-5 w-5 shrink-0 text-muted-foreground"
                aria-hidden
              />
            </button>
          ) : (
            <Link
              to={`/stadium/${match.stadium.id}`}
              className="flex items-center gap-3 p-4 transition-colors hover:bg-accent/20"
            >
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                  detailIconClassName,
                )}
              >
                <MapPin className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Venue
                </p>
                <p className="mt-0.5 flex min-w-0 items-center gap-2 text-base font-semibold leading-tight">
                  <HostCountryFlag
                    countryEn={match.stadium.country_en}
                    className="h-4 w-6"
                  />
                  <span className="truncate">{match.stadium.name_en}</span>
                </p>
                {match.stadium.fifa_name.trim() &&
                  match.stadium.fifa_name.trim() !== match.stadium.name_en && (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {match.stadium.fifa_name}
                    </p>
                  )}
                <div className="mt-1.5">
                  <StadiumMeta stadium={match.stadium} />
                </div>
              </div>
              <ChevronRight
                className="h-5 w-5 shrink-0 text-muted-foreground"
                aria-hidden
              />
            </Link>
          )}
        </Card>
      )}

    </div>
  );
}
