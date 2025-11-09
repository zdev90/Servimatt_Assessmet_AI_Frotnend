# Servimatt Assessment (React + Vite + Express Proxy)

A lightweight web app where users enter a prompt, it calls an AI API (OpenAI Responses API),
and displays the result with nice UX. Includes chat history (localStorage) and a Clear button.

## Stack
- Frontend: React + Vite + TypeScript
- Backend: Express (TypeScript) as a tiny proxy to keep your API key off the client

## Quick Start

### 1) Server
```bash
cd server
cp .env.example .env     # paste your real OPENAI_API_KEY
npm i
npm run dev              # http://localhost:8787
```

### 2) Web
```bash
cd web
npm i
npm run dev              # http://localhost:5173
```

### 3) Use it
Open http://localhost:5173, type a prompt, hit **Send**.

## Notes
- Env var for client API base: `web/.env` => `VITE_API_BASE=http://localhost:8787`
- CORS: In `server/src/index.ts` adjust `origin` list for deployed domains.
- Model defaults to `gpt-4o-mini`. Change the dropdown if your account has different access.
- To switch to Hugging Face: edit `/api/ai` handler in `server/src/index.ts` accordingly.
