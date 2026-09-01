# Setup — local development

For all teammates. Get the app running locally, then pick up your Part.

## Prerequisites
- **Node.js 18+** (this repo was scaffolded on Node 24)
- A **Postgres** database — easiest is a free [Neon](https://neon.tech) project
  or [Vercel Postgres](https://vercel.com/storage/postgres)

## 1. Install
```bash
npm install
```

## 2. Environment
```bash
cp .env.example .env.local
```
Fill in `.env.local`:
- `DATABASE_URL` — your Postgres connection string
- `JWT_SECRET` — generate one:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

`.env.local` is git-ignored — **never commit secrets.**

## 3. Database
```bash
npm run db:generate   # generate SQL migration from src/db/schema.ts
npm run db:migrate    # apply it to your database
npm run db:seed       # optional: demo admin + student
```

## 4. Run
```bash
npm run dev
```
Open http://localhost:3000. You'll be redirected to `/login`. Every route is a
navigable placeholder — click through the sidebar to see all screens.

## 5. Build (what Vercel runs)
```bash
npm run build
```

## Branch workflow
- `main` — shared foundation (this scaffold)
- `partA/<feature>` — Part A work → PR into `main`
- `partB/<feature>` — Part B work → PR into `main`
- Coordinate before editing `src/db/schema.ts` (both parts depend on it).

## Deploying to Vercel
1. Import the GitHub repo at [vercel.com/new](https://vercel.com/new)
2. Add a Postgres store (Storage tab) — it sets `DATABASE_URL` automatically
3. Add `JWT_SECRET` under Project → Settings → Environment Variables
4. Deploy. Run migrations against the production DB (`npm run db:migrate` with
   the production `DATABASE_URL`).

## Windows note
If PowerShell blocks `npm`/`vercel` with "running scripts is disabled", call the
`.cmd` form (e.g. `npm.cmd`, `vercel.cmd`) or set:
```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```
