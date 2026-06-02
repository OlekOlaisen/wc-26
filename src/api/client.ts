const hostedApiOrigin = "https://worldcup26.ir";

function resolveDefaultApiBaseUrl(): string {
  if (typeof window === "undefined") {
    return hostedApiOrigin;
  }

  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  return isLocalhost ? "/api" : hostedApiOrigin;
}

/**
 * On localhost, defaults to `/api` (Vite proxy → worldcup26.ir) to avoid CORS.
 * On deployed hosts, defaults to the hosted API origin.
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
