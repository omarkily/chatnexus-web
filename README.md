# ChatNexus — frontend (Next.js)

## What it is

ChatNexus is a full-stack messaging / integration control panel. This repo is the **web app**: dashboard UI for accounts, channels, integrations, API keys, request logs, and realtime updates.

Built as a portfolio showcase of production-style fullstack work (auth, API-driven UI, realtime).

## Stack

- **Next.js 15** (App Router) + TypeScript
- **React 18** + HeroUI + Tailwind CSS
- **Zustand** for client state
- JWT cookie/session flow against the ChatNexus API
- Axios for REST calls

Companion API: [`chatnexus-api`](https://github.com/omarkily/chatnexus-api)

## Features

- Auth (login / guarded dashboard routes)
- Overview dashboard
- Integrations & application setup
- API key management
- Channels & chats views
- Request/activity logs with detail pages
- Analytics / settings / support shells

## Quick start

```bash
# 1. Start the API first (see chatnexus-api README)
# 2. Configure env
cp .env.example .env.local

# 3. Install & run
npm install
npm run dev
```

App: [http://localhost:3000](http://localhost:3000)

## Environment

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend base URL (default `http://localhost:3001`) |

## Project layout

```
app/           # App Router pages (marketing + dashboard)
components/    # UI building blocks
context/       # Auth provider
lib/           # API/auth helpers
store/         # Zustand stores
config/        # Site metadata
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |

## Notes

- This is a **sanitized public portfolio copy**. Secrets and private env files were removed.
- Pair with `chatnexus-api` for a full local demo.

## License

MIT
