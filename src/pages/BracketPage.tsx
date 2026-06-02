import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { BracketMatchSlot } from "@/components/bracket/BracketMatchSlot";
import { GroupTabs } from "@/components/groups/GroupTabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTournamentData } from "@/hooks/useTournamentData";
import { buildBracketRounds } from "@/lib/bracketTree";

type TournamentTab = "knockouts" | "groups";

function parseTournamentTab(tabParam: string | null): TournamentTab {
  return tabParam === "groups" ? "groups" : "knockouts";
}

export function BracketPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = parseTournamentTab(searchParams.get("tab"));
  const initialGroup = searchParams.get("group") ?? undefined;

  const { matches, groups, teamMap, isLoading, isError, error } =
    useTournamentData();

  const rounds = useMemo(() => buildBracketRounds(matches), [matches]);

  function handleTabChange(nextTab: string) {
    const tab = parseTournamentTab(nextTab);
    if (tab === "groups") {
      const groupParam = searchParams.get("group");
      setSearchParams(
        groupParam ? { tab: "groups", group: groupParam } : { tab: "groups" },
      );
      return;
    }
    setSearchParams({});
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid h-10 w-full grid-cols-2">
          <TabsTrigger value="knockouts">Knockouts</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="knockouts" className="mt-4 space-y-6">
          {isError ? (
            <p className="text-sm text-muted-foreground">
              Could not load knockouts.
            </p>
          ) : (
            <>
              <div>
                <p className="text-sm text-muted-foreground">
                  Round of 32 through the Final
                </p>
              </div>

              {rounds.map((round) => (
                <section key={round.key} className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {round.label}
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {round.matches.map((match) => (
                      <BracketMatchSlot key={match.id} match={match} />
                    ))}
                  </div>
                </section>
              ))}
            </>
          )}
        </TabsContent>

        <TabsContent value="groups" className="mt-4 space-y-4">
          {isError ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-sm">
              Could not load group standings.
              {error instanceof Error && (
                <p className="mt-1 text-muted-foreground">{error.message}</p>
              )}
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Top 2 advance · Tap a team for details
              </p>
              <GroupTabs
                groups={groups}
                teamMap={teamMap}
                initialGroup={initialGroup}
              />
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
