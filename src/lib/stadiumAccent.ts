export function getStadiumCountryAccentClass(country: string): string {
  switch (country) {
    case "United States":
      return "bg-blue-500/70";
    case "Mexico":
      return "bg-emerald-500/70";
    case "Canada":
      return "bg-red-500/70";
    default:
      return "bg-primary/50";
  }
}
