import { Calendar, ChevronRight, MapPin, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { EnrichedMatch, MatchStatus, Stadium } from "@/api/types";
import { buildGoalTimeline } from "@/lib/goalTimeline";
import {
  formatDateInUserTimezone,
  formatKickoffInUserTimezone,
} from "@/lib/formatMatchTime";
import { getMatchWinnerSide } from "@/lib/matchWinner";
import { usePreferences } from "@/stores/preferencesStore";
import { cn } from "@/lib/utils";
import { FavoriteStar } from "./FavoriteStar";

function formatStadiumSummary(stadium: Stadium): string {
  const location = `${stadium.city_en}, ${stadium.country_en}`;
  const capacity = `${stadium.capacity.toLocaleString()} seats`;
  const fifaName = stadium.fifa_name.trim();

  if (!fifaName || fifaName === stadium.name_en) {
    return `${location} · ${capacity}`;
  }

  return `${fifaName} · ${location} · ${capacity}`;
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
  showShareLink?: boolean;
}

export function MatchDetailContent({
  match,
  showShareLink = true,
}: MatchDetailContentProps) {
  usePreferences();
  const timeline = buildGoalTimeline(match);
  const matchUrl = `${window.location.origin}/match/${match.id}`;
  const winnerSide =
    match.status === "finished"
      ? getMatchWinnerSide(match.home_score, match.away_score)
      : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {match.status === "live" && <Badge variant="live">LIVE</Badge>}
        <Badge variant="secondary">{match.stageLabel}</Badge>
        <Badge variant="outline">#{match.id}</Badge>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 flex-col items-center gap-2 text-center">
          {match.homeFlag && (
            <img
              src={match.homeFlag}
              alt=""
              className="h-10 w-14 rounded object-cover"
            />
          )}
          <div className="flex items-center gap-1">
            {winnerSide === "home" && (
              <Trophy
                className="h-4 w-4 shrink-0 text-amber-500"
                aria-label="Winner"
              />
            )}
            <p className="font-semibold">{match.homeDisplayName}</p>
            <FavoriteStar teamId={match.home_team_id} />
          </div>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold tabular-nums">
            {match.home_score} – {match.away_score}
          </p>
          {match.status === "live" && (
            <p className="text-sm text-primary">{match.time_elapsed}&apos;</p>
          )}
        </div>
        <div className="flex flex-1 flex-col items-center gap-2 text-center">
          {match.awayFlag && (
            <img
              src={match.awayFlag}
              alt=""
              className="h-10 w-14 rounded object-cover"
            />
          )}
          <div className="flex items-center gap-1">
            {winnerSide === "away" && (
              <Trophy
                className="h-4 w-4 shrink-0 text-amber-500"
                aria-label="Winner"
              />
            )}
            <p className="font-semibold">{match.awayDisplayName}</p>
            <FavoriteStar teamId={match.away_team_id} />
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="flex h-full flex-col">
          <CardContent className="flex flex-1 items-center gap-3 p-4 pt-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
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

        <Card className="flex h-full flex-col">
          <CardContent className="flex flex-1 items-center gap-3 p-4 pt-4">
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                match.status === "live"
                  ? "bg-red-600/20 text-red-500"
                  : match.status === "finished"
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary/15 text-primary",
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
            <div className="min-w-0">
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

      {match.stadium && (
        <Card className="overflow-hidden transition-colors hover:bg-accent/20">
          <Link
            to={`/stadium/${match.stadium.id}`}
            className="flex items-center gap-3 p-4"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <MapPin className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Venue
              </p>
              <p className="mt-0.5 truncate text-base font-semibold leading-tight">
                {match.stadium.name_en}
              </p>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {formatStadiumSummary(match.stadium)}
              </p>
            </div>
            <ChevronRight
              className="h-5 w-5 shrink-0 text-muted-foreground"
              aria-hidden
            />
          </Link>
        </Card>
      )}

      {showShareLink && (
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/match/${match.id}`}>Open match page</Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigator.clipboard.writeText(matchUrl)}
          >
            Copy link
          </Button>
        </div>
      )}

      {timeline.length > 0 && (
        <>
          <Separator />
          <div>
            <p className="mb-2 text-sm font-medium">Goal timeline</p>
            <ul className="space-y-1.5 text-sm">
              {timeline.map((entry, index) => (
                <li
                  key={`${entry.playerName}-${entry.minute}-${index}`}
                  className="flex justify-between gap-2"
                >
                  <span>
                    {entry.playerName}{" "}
                    <span className="text-muted-foreground">
                      ({entry.teamName})
                    </span>
                  </span>
                  <span className="text-muted-foreground">
                    {entry.minute}&apos;
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

    </div>
  );
}
