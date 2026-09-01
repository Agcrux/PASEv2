# Part B — Student Features

**Owners:** _fill in name(s)_

Everything a logged-in student uses. A self-contained vertical slice: UI + API +
data for the student experience. Assumes Part A provides an authenticated user
(`getCurrentUser()`).

## Scope / deliverables

### 1. Student dashboard (home)
- File: [`src/app/dashboard/page.tsx`](../src/app/dashboard/page.tsx)
- Summary widgets: days-to-graduation (`daysUntilGraduation`), open to-dos, next events, unread notifications

### 2. Calendar
- File: [`src/app/dashboard/calendar/page.tsx`](../src/app/dashboard/calendar/page.tsx)
- Month grid rendering personal events **and** school-wide events (from Part A)
- Query: `events` where `userId = me OR isSchoolWide = true`

### 3. To-do list
- File: [`src/app/dashboard/todos/page.tsx`](../src/app/dashboard/todos/page.tsx)
- Add / complete / delete readiness tasks, optional due dates
- API: [`src/app/api/todos/route.ts`](../src/app/api/todos/route.ts)

### 4. Events
- File: [`src/app/dashboard/events/page.tsx`](../src/app/dashboard/events/page.tsx)
- Add personal events; list upcoming (personal + school-wide)
- API: [`src/app/api/events/route.ts`](../src/app/api/events/route.ts)

### 5. Notifications
- File: [`src/app/dashboard/notifications/page.tsx`](../src/app/dashboard/notifications/page.tsx)
- List with read/unread; feed unread count to the top-bar bell
  ([`src/components/notification-bell.tsx`](../src/components/notification-bell.tsx))
- API: [`src/app/api/notifications/route.ts`](../src/app/api/notifications/route.ts)

### 6. Analytics
- File: [`src/app/dashboard/analytics/page.tsx`](../src/app/dashboard/analytics/page.tsx)
- Charts: tasks completed vs. open, upcoming deadlines, days remaining
- API: [`src/app/api/analytics/route.ts`](../src/app/api/analytics/route.ts)
- Add a charting lib (e.g. Recharts) as part of this work

## Owns in the database
`todos`, `events` (personal), `notifications`.

## Depends on Part A
- An authenticated user in `/dashboard` (Part A middleware + session)
- School-wide events created by admins (read-only for Part B)

## Definition of done
- Student can add/complete/delete to-dos and personal events
- Calendar shows personal + school-wide events
- Notifications list works with an accurate unread badge
- Analytics renders real charts from the student's data
