# College Readiness Tracker (PASEv2)

A web app that helps students track their path to college readiness — to-dos, a
calendar, events, notifications, and analytics — with an admin portal for
oversight. Built with **Next.js** (App Router) and **Postgres**, deployed on
**Vercel**.

---

## 👥 The 50/50 split — Part A & Part B

The work is divided into two **equal, self-contained workstreams**. The 3-person
team splits these half-and-half. Full task breakdowns live in
[`docs/PART-A.md`](docs/PART-A.md) and [`docs/PART-B.md`](docs/PART-B.md).

| | **Part A — Auth & Admin** | **Part B — Student Features** |
|---|---|---|
| **Scope** | Getting users in + admin oversight | Everything a logged-in student uses |
| **Screens** | Login, Register, Admin overview, Admin students | Dashboard, Calendar, To-dos, Events, Notifications, Analytics |
| **Owns** | `users` table, sessions, middleware | `todos`, `events`, `notifications` tables |
| **Key files** | `src/app/(auth)/**`, `src/app/admin/**`, `src/lib/auth.ts`, `src/lib/session.ts`, `src/middleware.ts` | `src/app/dashboard/**`, `src/app/api/{events,todos,notifications,analytics}` |
| **Owners** | _fill in names_ | _fill in names_ |

**The one cross-part touchpoint:** admins create *school-wide events* in Part A;
Part B's calendar and notifications read them. Everything else is independent.
Both parts share the database schema in
[`src/db/schema.ts`](src/db/schema.ts) — change it together.

> Each half is sized to be roughly equal effort: auth + admin ≈ the student
> feature set. See the per-part docs for the task-level breakdown to divide.

---

## 🧱 Tech stack

- **Next.js 14** (App Router, React + API route handlers)
- **Postgres** via **Drizzle ORM** (Vercel Postgres / Neon)
- **Custom auth**: student ID + bcrypt-hashed password, JWT session cookie (`jose`)
- **Tailwind CSS**
- **Vercel** for hosting

## 🚀 Getting started

See [`docs/SETUP.md`](docs/SETUP.md) for full setup. Quick version:

```bash
npm install
cp .env.example .env.local   # then fill in DATABASE_URL and JWT_SECRET
npm run db:generate && npm run db:migrate
npm run db:seed              # creates a demo admin + student
npm run dev
```

Open http://localhost:3000. Every route is scaffolded as a navigable
placeholder, so you can click through the whole app on day one — building each
feature means replacing its placeholder, not creating routes.

**Demo logins after seeding:** admin `admin` / `admin1234`, student `S1000` /
`student1234` (login itself is a Part A task still to be wired up).

## 📁 Project structure

```
src/
├── app/
│   ├── (auth)/         login, register            [Part A]
│   ├── admin/          overview, students         [Part A]
│   ├── dashboard/      home, calendar, todos,
│   │                   events, analytics,
│   │                   notifications              [Part B]
│   └── api/            route handlers per feature
├── db/                 schema.ts (shared contract), seed
├── lib/                auth.ts, session.ts, utils  [Part A / shared]
├── components/         ui/ primitives + app shell  [shared]
└── middleware.ts       route protection            [Part A]
```

## 🌿 Workflow

- Shared foundation (this scaffold) is on `main`.
- Do Part A work on `partA/*` branches, Part B on `partB/*` branches.
- Open PRs into `main`. Coordinate on `src/db/schema.ts` since both parts use it.
