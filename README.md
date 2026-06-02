# World Cup 2026 PWA

A mobile-first Progressive Web App for the FIFA World Cup 2026 — live scores, schedule, knockouts, group standings, teams, venues, and more.

Data is provided by the free [World Cup 2026 API](https://worldcup26.ir) ([GitHub](https://github.com/rezarahiminia/worldcup2026)).

## Features

### Main tabs
- **Schedule** — date strip (Jun 11 – Jul 19), status filters (all/live/upcoming/finished), goal scorers on cards, favorite-team highlights
- **Live** — all in-progress matches across the tournament; red dot on tab when any match is live
- **Standings** — tabs for knockout bracket (R32–Final) and group standings A–L
- **More** — hub for teams, venues, groups, scorers, search, settings

### More section
- **Teams** — search, group filter, team detail with full fixtures, favorites
- **Venues** — stadium list by country, venue detail with full match schedule
- **Top scorers** — leaderboard from live goal data when available
- **Search** — matches, teams, and venues
- **Settings** — timezone, calendar export (.ics), API health

### Other
- **Match pages** — `/match/:id` deep links with goal timeline and share/copy link
- **Favorites** — star teams on match/team pages and filter the schedule
- **PWA** — installable, offline-friendly API cache via service worker

## Setup

```bash
npm install
npm run dev
```

Local dev proxies API requests through `/api` → `worldcup26.ir` so the browser never hits cross-origin CORS limits.

Open [http://localhost:5173](http://localhost:5173).

## Environment variables

| Variable | Description |
| -------- | ----------- |
| `VITE_API_BASE_URL` | API base URL (localhost default: `/api` proxy; deployed default: `https://worldcup26.ir`) |
| `VITE_API_TOKEN` | Optional JWT Bearer token if the API requires auth |

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start development server |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview production build |

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 + shadcn/ui (Radix)
- TanStack Query · React Router · date-fns-tz
- vite-plugin-pwa (Workbox)

## API attribution

Match, team, group, and stadium data © [worldcup26.ir](https://worldcup26.ir) / [rezarahiminia/worldcup2026](https://github.com/rezarahiminia/worldcup2026). This app is not affiliated with FIFA.
