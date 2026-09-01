import "dotenv/config";
import { db } from "./index";
import { users } from "./schema";
import { hashPassword } from "@/lib/auth";

/**
 * Seed script — creates one admin and one demo student so the team can log in
 * immediately. Run with: `npm run db:seed`
 *
 * TODO(Part A): expand with more realistic demo data as auth solidifies.
 */
async function main() {
  const adminPassword = await hashPassword("admin1234");
  const studentPassword = await hashPassword("student1234");

  await db
    .insert(users)
    .values([
      {
        studentId: "admin",
        passwordHash: adminPassword,
        role: "admin",
        fullName: "Demo Admin",
      },
      {
        studentId: "S1000",
        passwordHash: studentPassword,
        role: "student",
        gradYear: 2027,
        fullName: "Demo Student",
      },
    ])
    .onConflictDoNothing();

  console.log("Seeded admin (admin / admin1234) and student (S1000 / student1234).");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
