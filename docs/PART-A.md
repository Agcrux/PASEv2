# Part A — Authentication & Admin

**Owners:** _fill in name(s)_

Everything needed to get users into the app and let admins oversee students.
This is a self-contained vertical slice: UI + API + data for auth and admin.

## Scope / deliverables

### 1. Student login page
- File: [`src/app/(auth)/login/page.tsx`](../src/app/(auth)/login/page.tsx)
- Form: student ID + password, with validation and error states
- Submit → `/api/auth` (login), then `createSession()` and redirect by role

### 2. Student registration
- File: [`src/app/(auth)/register/page.tsx`](../src/app/(auth)/register/page.tsx)
- Fields: student ID, password, **expected graduation year**
- Hash password with `hashPassword()`, insert into `users`, start a session

### 3. Custom auth core (shared foundation — others depend on this)
- [`src/lib/auth.ts`](../src/lib/auth.ts) — `hashPassword` / `verifyPassword` (done)
- [`src/lib/session.ts`](../src/lib/session.ts) — JWT cookie issue/verify, `getCurrentUser()` (done; wire into routes)
- [`src/middleware.ts`](../src/middleware.ts) — protect `/dashboard` and `/admin`, enforce roles

### 4. Auth API
- [`src/app/api/auth/route.ts`](../src/app/api/auth/route.ts) — `POST` login & register, logout
- [`src/app/api/students/route.ts`](../src/app/api/students/route.ts) — admin-only list/search

### 5. Admin portal
- [`src/app/admin/page.tsx`](../src/app/admin/page.tsx) — overview widgets, "create school-wide event" action
- [`src/app/admin/students/page.tsx`](../src/app/admin/students/page.tsx) — searchable student table + drill-in
- Admin layout guard in [`src/app/admin/layout.tsx`](../src/app/admin/layout.tsx)

### 6. Roles
- `role` column already in schema (`student` | `admin`); enforce in middleware + admin layout

## Owns in the database
`users` table. **School-wide events**: admins insert into `events` with
`isSchoolWide = true` — this is the handoff Part B reads.

## Provides to Part B
`getCurrentUser()` (who's logged in) and route protection. Part B assumes an
authenticated user is available in `/dashboard`.

## Definition of done
- Register → login → redirected to `/dashboard` (student) or `/admin` (admin)
- Non-admins are blocked from `/admin`; unauthenticated users are sent to `/login`
- Admin can create a school-wide event that shows up for students
