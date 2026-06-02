import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Group, Team } from "@/api/types";
import {
  getGroupSummaryMessage,
  isAdvancementPosition,
  sortStandingsForGroup,
} from "@/lib/groupAdvancement";
import { cn } from "@/lib/utils";

interface GroupStandingsTableProps {
  group: Group;
  teamMap: Map<string, Team>;
}

export function GroupStandingsTable({
  group,
  teamMap,
}: GroupStandingsTableProps) {
  const standings = sortStandingsForGroup(group);
  const summary = getGroupSummaryMessage(standings);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Group {group.name}</CardTitle>
        {summary && (
          <p className="text-xs text-muted-foreground">{summary}</p>
        )}
      </CardHeader>
      <CardContent className="overflow-x-auto p-0 pb-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-xs text-muted-foreground">
              <th className="px-4 py-2 text-left font-medium">Team</th>
              <th className="px-1 py-2 text-center font-medium">MP</th>
              <th className="px-1 py-2 text-center font-medium">W</th>
              <th className="px-1 py-2 text-center font-medium">D</th>
              <th className="px-1 py-2 text-center font-medium">L</th>
              <th className="px-1 py-2 text-center font-medium">Pts</th>
              <th className="px-1 py-2 text-center font-medium">GF</th>
              <th className="px-1 py-2 text-center font-medium">GA</th>
              <th className="px-1 py-2 text-center font-medium">GD</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((entry, index) => {
              const team = teamMap.get(entry.team_id);
              const advances = isAdvancementPosition(index);
              return (
                <tr
                  key={entry.team_id}
                  className={cn(
                    "border-b border-border/50 last:border-0",
                    advances && "bg-primary/5",
                  )}
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-4 text-xs text-muted-foreground">
                        {index + 1}
                      </span>
                      <Link
                        to={`/team/${entry.team_id}`}
                        className="flex min-w-0 flex-1 items-center gap-2 rounded-md py-0.5 pr-1 transition-colors hover:bg-accent/40 hover:text-primary"
                      >
                        {team?.flag && (
                          <img
                            src={team.flag}
                            alt=""
                            className="h-4 w-6 shrink-0 rounded object-cover"
                            loading="lazy"
                          />
                        )}
                        <span className="truncate font-medium">
                          {team?.name_en ?? `Team ${entry.team_id}`}
                        </span>
                      </Link>
                    </div>
                  </td>
                  <td className="px-1 py-2.5 text-center tabular-nums">
                    {entry.mp}
                  </td>
                  <td className="px-1 py-2.5 text-center tabular-nums">
                    {entry.w}
                  </td>
                  <td className="px-1 py-2.5 text-center tabular-nums">
                    {entry.d}
                  </td>
                  <td className="px-1 py-2.5 text-center tabular-nums">
                    {entry.l}
                  </td>
                  <td className="px-1 py-2.5 text-center font-semibold tabular-nums">
                    {entry.pts}
                  </td>
                  <td className="px-1 py-2.5 text-center tabular-nums">
                    {entry.gf}
                  </td>
                  <td className="px-1 py-2.5 text-center tabular-nums">
                    {entry.ga}
                  </td>
                  <td className="px-1 py-2.5 text-center tabular-nums">
                    {entry.gd}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
