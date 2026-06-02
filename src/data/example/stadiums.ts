import type { Stadium } from "@/api/types";

export const EXAMPLE_STADIUMS: Stadium[] = [
  {
    id: "ex-stadium-sofi",
    name_en: "SoFi Stadium",
    name_fa: "SoFi Stadium",
    fifa_name: "Los Angeles Stadium",
    city_en: "Los Angeles (Inglewood)",
    country_en: "United States",
    capacity: 70000,
    region: "Pacific",
  },
  {
    id: "ex-stadium-azteca",
    name_en: "Estadio Azteca",
    name_fa: "Estadio Azteca",
    fifa_name: "Estadio Azteca",
    city_en: "Mexico City",
    country_en: "Mexico",
    capacity: 87523,
    region: "Central",
  },
  {
    id: "ex-stadium-bmo",
    name_en: "BMO Field",
    name_fa: "BMO Field",
    fifa_name: "Toronto Stadium",
    city_en: "Toronto",
    country_en: "Canada",
    capacity: 45600,
    region: "Eastern",
  },
];

export function getExampleStadiums(): Stadium[] {
  return EXAMPLE_STADIUMS;
}
