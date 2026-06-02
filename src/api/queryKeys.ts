export const queryKeys = {
  games: ["games"] as const,
  teams: ["teams"] as const,
  stadiums: ["stadiums"] as const,
  groups: ["groups"] as const,
  health: ["health"] as const,
  game: (id: string) => ["game", id] as const,
};
