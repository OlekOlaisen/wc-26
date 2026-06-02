import type { Team } from "@/api/types";

export const EXAMPLE_TEAMS: Team[] = [
  {
    id: "ex-team-usa",
    name_en: "United States",
    name_fa: "United States",
    flag: "https://flagcdn.com/w80/us.png",
    fifa_code: "USA",
    iso2: "US",
    groups: "D",
  },
  {
    id: "ex-team-mex",
    name_en: "Mexico",
    name_fa: "Mexico",
    flag: "https://flagcdn.com/w80/mx.png",
    fifa_code: "MEX",
    iso2: "MX",
    groups: "A",
  },
  {
    id: "ex-team-can",
    name_en: "Canada",
    name_fa: "Canada",
    flag: "https://flagcdn.com/w80/ca.png",
    fifa_code: "CAN",
    iso2: "CA",
    groups: "B",
  },
  {
    id: "ex-team-eng",
    name_en: "England",
    name_fa: "England",
    flag: "https://flagcdn.com/w80/gb-eng.png",
    fifa_code: "ENG",
    iso2: "ENG",
    groups: "L",
  },
  {
    id: "ex-team-fra",
    name_en: "France",
    name_fa: "France",
    flag: "https://flagcdn.com/w80/fr.png",
    fifa_code: "FRA",
    iso2: "FR",
    groups: "I",
  },
  {
    id: "ex-team-bra",
    name_en: "Brazil",
    name_fa: "Brazil",
    flag: "https://flagcdn.com/w80/br.png",
    fifa_code: "BRA",
    iso2: "BR",
    groups: "C",
  },
  {
    id: "ex-team-jpn",
    name_en: "Japan",
    name_fa: "Japan",
    flag: "https://flagcdn.com/w80/jp.png",
    fifa_code: "JPN",
    iso2: "JP",
    groups: "F",
  },
  {
    id: "ex-team-ger",
    name_en: "Germany",
    name_fa: "Germany",
    flag: "https://flagcdn.com/w80/de.png",
    fifa_code: "GER",
    iso2: "DE",
    groups: "E",
  },
];

export function getExampleTeams(): Team[] {
  return EXAMPLE_TEAMS;
}
