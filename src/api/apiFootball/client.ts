import { ApiError } from "@/api/client";

function resolveApiFootballBaseUrl(): string {
  return import.meta.env.VITE_API_FOOTBALL_BASE_URL ?? "/api-football";
}

const apiFootballBaseUrl = resolveApiFootballBaseUrl();

export async function apiFootballFetch<T>(path: string): Promise<T> {
  const url = `${apiFootballBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new ApiError(
      `API-Football request failed: ${response.status} ${response.statusText}`,
      response.status,
    );
  }

  return response.json() as Promise<T>;
}
