import type { TournamentDataSource } from "@/stores/preferencesStore";

export const queryKeys = {
  games: (source: TournamentDataSource) => ["games", source] as const,
  teams: (source: TournamentDataSource) => ["teams", source] as const,
  stadiums: (source: TournamentDataSource) => ["stadiums", source] as const,
  groups: (source: TournamentDataSource) => ["groups", source] as const,
  health: ["health"] as const,
  game: (id: string, source: TournamentDataSource) =>
    ["game", id, source] as const,
};
