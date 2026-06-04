import path from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Connect } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const API_FOOTBALL_ORIGIN = "https://v3.football.api-sports.io";

function createApiFootballDevProxy(apiFootballKey: string | undefined): Plugin {
  return {
    name: "api-football-dev-proxy",
    configureServer(server) {
      server.middlewares.use(
        (
          request: Connect.IncomingMessage,
          response: ServerResponse,
          next: Connect.NextFunction,
        ) => {
          const requestUrl = request.url ?? "";
          if (!requestUrl.startsWith("/api-football")) {
            next();
            return;
          }

          void proxyApiFootballRequest(
            request,
            response,
            requestUrl,
            apiFootballKey,
          );
        },
      );
    },
    configurePreviewServer(server) {
      server.middlewares.use(
        (
          request: Connect.IncomingMessage,
          response: ServerResponse,
          next: Connect.NextFunction,
        ) => {
          const requestUrl = request.url ?? "";
          if (!requestUrl.startsWith("/api-football")) {
            next();
            return;
          }

          void proxyApiFootballRequest(
            request,
            response,
            requestUrl,
            apiFootballKey,
          );
        },
      );
    },
  };
}

async function proxyApiFootballRequest(
  request: IncomingMessage,
  response: ServerResponse,
  requestUrl: string,
  apiFootballKey: string | undefined,
): Promise<void> {
  const upstreamPath = requestUrl.replace(/^\/api-football/, "") || "/";
  const upstreamUrl = `${API_FOOTBALL_ORIGIN}${upstreamPath}`;

  const headers: HeadersInit = {
    Accept: "application/json",
  };

  if (apiFootballKey) {
    headers["x-apisports-key"] = apiFootballKey;
  }

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      method: request.method ?? "GET",
      headers,
    });

    const body = await upstreamResponse.text();
    response.statusCode = upstreamResponse.status;
    response.setHeader(
      "Content-Type",
      upstreamResponse.headers.get("Content-Type") ?? "application/json",
    );
    response.end(body);
  } catch {
    response.statusCode = 502;
    response.setHeader("Content-Type", "application/json");
    response.end(
      JSON.stringify({ errors: { proxy: "API-Football proxy failed" } }),
    );
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiFootballKey = env.API_FOOTBALL_KEY;

  return {
    plugins: [
      react(),
      tailwindcss(),
      createApiFootballDevProxy(apiFootballKey),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.svg", "icons/*.svg"],
        manifest: {
          name: "World Cup 2026",
          short_name: "WC 2026",
          description: "FIFA World Cup 2026 live scores and schedule",
          theme_color: "#0f172a",
          background_color: "#0f172a",
          display: "standalone",
          start_url: "/",
          icons: [
            {
              src: "/icons/icon-192.svg",
              sizes: "192x192",
              type: "image/svg+xml",
            },
            {
              src: "/icons/icon-512.svg",
              sizes: "512x512",
              type: "image/svg+xml",
            },
            {
              src: "/icons/icon-512.svg",
              sizes: "512x512",
              type: "image/svg+xml",
              purpose: "maskable",
            },
          ],
        },
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /\/api\/get\/.*/i,
              handler: "NetworkFirst",
              options: {
                cacheName: "worldcup-api",
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24,
                },
                networkTimeoutSeconds: 10,
              },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "https://worldcup26.ir",
          changeOrigin: true,
          rewrite: (requestPath) => requestPath.replace(/^\/api/, ""),
        },
      },
    },
    preview: {
      proxy: {
        "/api": {
          target: "https://worldcup26.ir",
          changeOrigin: true,
          rewrite: (requestPath) => requestPath.replace(/^\/api/, ""),
        },
      },
    },
  };
});
