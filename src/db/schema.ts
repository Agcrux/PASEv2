import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

/**
 * Shared database schema — the contract between Part A and Part B.
 *
 *  - Part A (Auth & Admin) owns `users`.
 *  - Part B (Student features) owns `todos`, `events` (personal), `notifications`.
 *  - School-wide events created by admins (Part A) also live in `events`
 *    with `isSchoolWide = true` and are read by Part B's calendar/notifications.
 *
 * Change this file together as a team — both parts depend on it.
 */

export const roleEnum = pgEnum("role", ["student", "admin"]);

// --- users (Part A owns) ---
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  studentId: varchar("student_id", { length: 64 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  gradYear: integer("grad_year"), // expected graduation year (nullable for admins)
  role: roleEnum("role").notNull().default("student"),
  fullName: varchar("full_name", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// --- todos (Part B owns) ---
export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  completed: boolean("completed").notNull().default(false),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// --- events (Part B owns; admins create school-wide ones via Part A) ---
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  // Personal events belong to a user; school-wide events have null userId.
  userId: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at"),
  isSchoolWide: boolean("is_school_wide").notNull().default(false),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// --- notifications (Part B owns) ---
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Inferred types for use across the app.
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Todo = typeof todos.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
