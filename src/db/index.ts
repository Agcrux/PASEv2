import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Shared database client. Import `db` anywhere you need to query.
 *
 *   import { db } from "@/db";
 *   import { users } from "@/db/schema";
 */

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Surfaced at import time so misconfiguration fails loudly in dev.
  console.warn(
    "[db] DATABASE_URL is not set — copy .env.example to .env.local and fill it in.",
  );
}

// `postgres` lazily connects, so this is safe even before env is configured.
const client = postgres(connectionString ?? "", { prepare: false });

export const db = drizzle(client, { schema });
