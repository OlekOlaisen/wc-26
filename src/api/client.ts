function resolveDefaultApiBaseUrl(): string {
  return "/api";
}

/**
 * Defaults to `/api`, proxied to worldcup26.ir (Vite in dev, Netlify in production).
 * Set VITE_API_BASE_URL only if you host your own API proxy or CORS-enabled origin.
 */
const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ?? resolveDefaultApiBaseUrl();

const apiToken = import.meta.env.VITE_API_TOKEN;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(path: string): Promise<T> {
  const headers: HeadersInit = {
    Accept: "application/json",
  };

  if (apiToken) {
    headers.Authorization = `Bearer ${apiToken}`;
  }

  const response = await fetch(`${apiBaseUrl}${path}`, { headers });

  if (!response.ok) {
    throw new ApiError(
      `Request failed: ${response.status} ${response.statusText}`,
      response.status,
    );
  }

  return response.json() as Promise<T>;
}

export function getApiBaseUrl(): string {
  return apiBaseUrl;
}
