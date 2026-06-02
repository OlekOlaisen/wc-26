import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getHealth } from "@/api/endpoints";
import { queryKeys } from "@/api/queryKeys";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTournamentData } from "@/hooks/useTournamentData";
import { downloadCalendarIcs } from "@/lib/exportCalendar";
import {
  TIMEZONE_OPTIONS,
  updatePreferences,
  usePreferences,
} from "@/stores/preferencesStore";
import { useFavoriteTeamIds } from "@/stores/favoritesStore";

export function SettingsPage() {
  const preferences = usePreferences();
  const favoriteTeamIds = useFavoriteTeamIds();
  const { matches } = useTournamentData();

  const healthQuery = useQuery({
    queryKey: queryKeys.health,
    queryFn: getHealth,
    staleTime: 60_000,
  });

  const favoriteMatches = matches.filter(
    (match) =>
      favoriteTeamIds.includes(match.home_team_id) ||
      favoriteTeamIds.includes(match.away_team_id),
  );

  return (
    <div className="space-y-4">
      <div>
        <Link to="/more" className="text-sm text-primary underline">
          ← More
        </Link>
        <h2 className="mt-2 text-lg font-semibold">Settings</h2>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Timezone</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={preferences.timezone}
            onValueChange={(timezone) => updatePreferences({ timezone })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="mt-2 text-xs text-muted-foreground">
            Match times use your selected timezone.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Calendar export</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            className="w-full"
            variant="outline"
            onClick={() => downloadCalendarIcs(matches)}
          >
            Download all matches (.ics)
          </Button>
          <Button
            className="w-full"
            variant="outline"
            disabled={favoriteMatches.length === 0}
            onClick={() =>
              downloadCalendarIcs(favoriteMatches, "world-cup-2026-favorites.ics")
            }
          >
            Download favorite teams only
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            Status:{" "}
            {healthQuery.data?.status === "healthy" ? "Healthy" : "Unknown"}
          </p>
          {healthQuery.data?.version && (
            <p className="text-muted-foreground">
              Version {healthQuery.data.version}
            </p>
          )}
          <a
            href="https://worldcup26.ir/api-docs/"
            target="_blank"
            rel="noreferrer"
            className="inline-block text-primary underline"
          >
            API documentation
          </a>
          <p className="text-xs text-muted-foreground">
            Data from{" "}
            <a
              href="https://github.com/rezarahiminia/worldcup2026"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              worldcup2026
            </a>
            . Not affiliated with FIFA.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
