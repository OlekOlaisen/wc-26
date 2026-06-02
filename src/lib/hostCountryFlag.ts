import type { Team } from "@/api/types";

const hostCountryFifaCode: Record<string, string> = {
  "United States": "USA",
  Mexico: "MEX",
  Canada: "CAN",
};

export function getHostCountryFlag(
  countryEn: string,
  teams: Team[],
): string | undefined {
  const fifaCode = hostCountryFifaCode[countryEn];
  if (fifaCode) {
    const byCode = teams.find((team) => team.fifa_code === fifaCode);
    if (byCode?.flag) {
      return byCode.flag;
    }
  }

  return teams.find((team) => team.name_en === countryEn)?.flag;
}
