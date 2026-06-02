import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Group, Team } from "@/api/types";
import { GroupStandingsTable } from "./GroupStandingsTable";
import { cn } from "@/lib/utils";

const GROUP_LETTERS = "ABCDEFGHIJKL".split("");

function sortGroupsByLetter(groups: Group[]): Group[] {
  return [...groups].sort(
    (left, right) =>
      GROUP_LETTERS.indexOf(left.name) - GROUP_LETTERS.indexOf(right.name),
  );
}

interface GroupTabsProps {
  groups: Group[];
  teamMap: Map<string, Team>;
  initialGroup?: string;
}

export function GroupTabs({ groups, teamMap, initialGroup }: GroupTabsProps) {
  const sortedGroups = sortGroupsByLetter(groups);
  const defaultGroup = sortedGroups[0]?.name ?? "A";
  const resolvedInitialGroup = sortedGroups.some(
    (group) => group.name === initialGroup,
  )
    ? initialGroup
    : defaultGroup;

  return (
    <Tabs
      key={resolvedInitialGroup}
      defaultValue={resolvedInitialGroup}
      className="space-y-4"
    >
      <TabsList
        className={cn(
          "grid h-auto w-full grid-cols-6 gap-1.5 rounded-xl bg-muted p-2",
          "sm:grid-cols-12 sm:gap-1",
        )}
      >
        {sortedGroups.map((group) => (
          <TabsTrigger
            key={group.name}
            value={group.name}
            className={cn(
              "h-10 w-full rounded-lg px-0 text-sm font-semibold",
              "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm",
            )}
          >
            {group.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {sortedGroups.map((group) => (
        <TabsContent key={group.name} value={group.name} className="mt-0">
          <GroupStandingsTable group={group} teamMap={teamMap} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
