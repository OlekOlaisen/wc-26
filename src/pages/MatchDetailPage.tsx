import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getGames } from "@/api/endpoints";
import { queryKeys } from "@/api/queryKeys";
import { MatchDetailContent } from "@/components/shared/MatchDetailContent";
import { Skeleton } from "@/components/ui/skeleton";
import { enrichMatch } from "@/lib/enrichMatch";
import { useTournamentData } from "@/hooks/useTournamentData";

export function MatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { matches, teamMap, stadiumMap, isLoading } = useTournamentData();

  const cached = matches.find((match) => match.id === id);

  const fallbackQuery = useQuery({
    queryKey: queryKeys.game(id ?? ""),
    queryFn: async () => {
      const response = await getGames();
      return response.games.find((game) => game.id === id) ?? null;
    },
    enabled: !cached && Boolean(id),
  });

  const match =
    cached ??
    (fallbackQuery.data
      ? enrichMatch(fallbackQuery.data, teamMap, stadiumMap)
      : null);

  if (isLoading || fallbackQuery.isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!match) {
    return (
      <div className="space-y-4 text-center text-sm">
        <p>Match not found.</p>
        <Link to="/" className="text-primary underline">
          Back to schedule
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link to="/" className="text-sm text-primary underline">
        ← Schedule
      </Link>
      <h2 className="text-lg font-semibold">Match #{match.id}</h2>
      <MatchDetailContent match={match} showShareLink={false} />
    </div>
  );
}
