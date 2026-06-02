import { useQuery } from "@tanstack/react-query";
import {
  LayoutGrid,
  MapPin,
  Search,
  Settings,
  Target,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getHealth } from "@/api/endpoints";
import { queryKeys } from "@/api/queryKeys";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const links = [
  { to: "/teams", label: "Teams", description: "48 nations", icon: Users },
  { to: "/stadiums", label: "Venues", description: "16 stadiums", icon: MapPin },
  {
    to: "/bracket?tab=groups",
    label: "Groups",
    description: "Standings A–L",
    icon: LayoutGrid,
  },
  {
    to: "/scorers",
    label: "Top scorers",
    description: "Goal leaderboard",
    icon: Target,
  },
  {
    to: "/search",
    label: "Search",
    description: "Matches, teams, venues",
    icon: Search,
  },
  {
    to: "/settings",
    label: "Settings",
    description: "Timezone, calendar export",
    icon: Settings,
  },
] as const;

export function MorePage() {
  const healthQuery = useQuery({
    queryKey: queryKeys.health,
    queryFn: getHealth,
    staleTime: 60_000,
    retry: 1,
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">More</h2>
        <p className="text-sm text-muted-foreground">
          Teams, venues, groups, and settings
        </p>
      </div>

      <div className="grid gap-2">
        {links.map(({ to, label, description, icon: Icon }) => (
          <Link key={to} to={to} className="block cursor-pointer">
            <Card className="transition-colors hover:bg-accent/30">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardContent className="p-4 text-sm">
          <p className="font-medium">API status</p>
          <p
            className={cn(
              "mt-1",
              healthQuery.data?.status === "healthy"
                ? "text-primary"
                : "text-muted-foreground",
            )}
          >
            {healthQuery.isLoading
              ? "Checking…"
              : healthQuery.data?.status === "healthy"
                ? `Healthy · v${healthQuery.data.version ?? "?"}`
                : "Unavailable"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
