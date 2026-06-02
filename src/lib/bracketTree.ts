import type { EnrichedMatch } from "@/api/types";

export type BracketRoundKey =
  | "r32"
  | "r16"
  | "qf"
  | "sf"
  | "third"
  | "final";

export interface BracketRound {
  key: BracketRoundKey;
  label: string;
  matches: EnrichedMatch[];
}

const roundOrder: BracketRoundKey[] = [
  "r32",
  "r16",
  "qf",
  "sf",
  "third",
  "final",
];

const roundLabels: Record<BracketRoundKey, string> = {
  r32: "Round of 32",
  r16: "Round of 16",
  qf: "Quarter-finals",
  sf: "Semi-finals",
  third: "Third place",
  final: "Final",
};

export function buildBracketRounds(
  matches: EnrichedMatch[],
): BracketRound[] {
  const knockout = matches.filter((match) => match.type !== "group");

  return roundOrder
    .map((key) => ({
      key,
      label: roundLabels[key],
      matches: knockout
        .filter((match) => match.type === key)
        .sort(
          (left, right) =>
            Number(left.id) - Number(right.id) ||
            left.kickoffAt.getTime() - right.kickoffAt.getTime(),
        ),
    }))
    .filter((round) => round.matches.length > 0);
}
