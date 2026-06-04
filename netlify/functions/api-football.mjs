const API_FOOTBALL_ORIGIN = "https://v3.football.api-sports.io";

export default async (request) => {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ errors: { config: "API_FOOTBALL_KEY is not set" } }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  const requestUrl = new URL(request.url);
  const pathAfterFunction = requestUrl.pathname.replace(
    /^\/\.netlify\/functions\/api-football\/?/,
    "",
  );
  const upstreamPath = pathAfterFunction
    ? `/${pathAfterFunction}`
    : requestUrl.search
      ? ""
      : "/";
  const targetUrl = `${API_FOOTBALL_ORIGIN}${upstreamPath}${requestUrl.search}`;

  const upstreamResponse = await fetch(targetUrl, {
    headers: {
      Accept: "application/json",
      "x-apisports-key": apiKey,
    },
  });

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: {
      "Content-Type":
        upstreamResponse.headers.get("Content-Type") ?? "application/json",
    },
  });
};
