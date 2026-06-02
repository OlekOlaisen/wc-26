import type { Game } from "@/api/types";

export function getStageLabel(game: Game): string {
  switch (game.type) {
    case "group":
      return `Group ${game.group}`;
    case "r32":
      return "Round of 32";
    case "r16":
      return "Round of 16";
    case "qf":
      return "Quarter-final";
    case "sf":
      return "Semi-final";
    case "third":
      return "Third place";
    case "final":
      return "Final";
    default:
      return game.group;
  }
}
