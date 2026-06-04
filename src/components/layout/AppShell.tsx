import { Outlet } from "react-router-dom";
import { GoalToastViewport } from "@/components/shared/GoalToastViewport";
import { useFavoriteGoalToasts } from "@/hooks/useFavoriteGoalToasts";
import { useTournamentData } from "@/hooks/useTournamentData";
import { BottomNav } from "./BottomNav";
import { Header } from "./Header";

export function AppShell() {
  const { matches } = useTournamentData();
  useFavoriteGoalToasts(matches);

  return (
    <div className="min-h-dvh pb-[calc(5rem+env(safe-area-inset-bottom,0px))]">
      <GoalToastViewport />
      <Header />
      <main className="mx-auto max-w-lg px-4 py-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
