import { Calendar, Menu, Radio, Timeline } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTournamentData } from "@/hooks/useTournamentData";
import { hasAnyLiveMatch } from "@/lib/matchStatus";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Schedule", icon: Calendar, end: true },
  { to: "/live", label: "Live", icon: Radio, end: false },
  { to: "/bracket", label: "Standings", icon: Timeline, end: false },
  { to: "/more", label: "More", icon: Menu, end: false },
] as const;

export function BottomNav() {
  const { matches } = useTournamentData();
  const hasLive = hasAnyLiveMatch(matches.map((match) => match.status));

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 translate-z-0 border-t border-border bg-background pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto grid max-w-lg grid-cols-4">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "relative flex flex-col items-center gap-1 py-2 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
                <span>{label}</span>
                {to === "/live" && hasLive && (
                  <span className="absolute right-[calc(50%-18px)] top-1.5 h-2 w-2 rounded-full bg-red-500 animate-pulse-live" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
