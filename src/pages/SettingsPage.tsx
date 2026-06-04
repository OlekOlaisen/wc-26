import { BackLink } from "@/components/layout/BackLink";
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

  const favoriteMatches = matches.filter(
    (match) =>
      favoriteTeamIds.includes(match.home_team_id) ||
      favoriteTeamIds.includes(match.away_team_id),
  );

  return (
    <div className="space-y-4">
      <div>
        <BackLink to="/more">More</BackLink>
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
            Kickoffs are scheduled at the venue&apos;s local time and shown in
            your selected timezone.
          </p>

          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">Time format</p>
            <Select
              value={preferences.use24HourClock ? "24" : "12"}
              onValueChange={(value) =>
                updatePreferences({ use24HourClock: value === "24" })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24">24-hour (16:00)</SelectItem>
                <SelectItem value="12">12-hour (4:00 PM)</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
            Download favorite teams only (.ics)
          </Button>
        </CardContent>
      </Card>

     {/*  <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Use example data</p>
              <p className="text-xs text-muted-foreground">
                Replaces live API data for offline UI testing. On the Live tab,
                use &quot;Simulate goal&quot; buttons to test score toasts (star
                a team first).
              </p>
            </div>
            <Switch
              checked={preferences.useExampleData}
              onCheckedChange={handleExampleDataChange}
              aria-label="Use example data"
            />
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
