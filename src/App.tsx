import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { BracketPage } from "@/pages/BracketPage";
import { LivePage } from "@/pages/LivePage";
import { MatchDetailPage } from "@/pages/MatchDetailPage";
import { MorePage } from "@/pages/MorePage";
import { SchedulePage } from "@/pages/SchedulePage";
import { ScorersPage } from "@/pages/ScorersPage";
import { SearchPage } from "@/pages/SearchPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { StadiumDetailPage } from "@/pages/StadiumDetailPage";
import { StadiumsPage } from "@/pages/StadiumsPage";
import { TeamDetailPage } from "@/pages/TeamDetailPage";
import { TeamsPage } from "@/pages/TeamsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<SchedulePage />} />
            <Route path="live" element={<LivePage />} />
            <Route
              path="groups"
              element={<Navigate to="/bracket?tab=groups" replace />}
            />
            <Route path="more" element={<MorePage />} />
            <Route path="teams" element={<TeamsPage />} />
            <Route path="team/:id" element={<TeamDetailPage />} />
            <Route path="stadiums" element={<StadiumsPage />} />
            <Route path="stadium/:id" element={<StadiumDetailPage />} />
            <Route path="bracket" element={<BracketPage />} />
            <Route path="scorers" element={<ScorersPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="match/:id" element={<MatchDetailPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
