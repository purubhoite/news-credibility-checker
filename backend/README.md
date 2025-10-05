News Check Analysis - Backend

Setup

1. Install dependencies

```bash
cd backend
npm install
```

2. Configure environment

Copy `.env.example` to `.env` and fill in values as needed:

```bash
cp .env.example .env
```

Required keys:
- `PORT` (default 8080)
- `FRONTEND_ORIGIN` (e.g., http://localhost:5173)
- `PERPLEXITY_API_KEY` (Phase 2)
- `GEMINI_API_KEY` (Phase 2)
 - `DATABASE_URL` (Prisma SQLite, e.g., file:./dev.db)
 - `REDIS_URL` (optional)

3. Run the server

Development (watch):

```bash
npm run dev
```

Build and start:

```bash
npm run build
npm start
```

Database (Prisma + SQLite)

```bash
npx prisma generate
npx prisma migrate dev --name init
```

History API

- `GET /api/history`
- `DELETE /api/history/:id`

API

- `GET /` → `{ status: "ok" }` health check
- `POST /api/check-claim` → Mock fact-check result with 2s delay. Body:

```json
{ "claim": "Your claim text here" }
```

Security & Limits

- CORS restricted by `FRONTEND_ORIGIN`
- Helmet security headers
- Rate limiting: 10 requests/minute per IP

