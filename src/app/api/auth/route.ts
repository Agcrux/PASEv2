import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { createSession, destroySession } from "@/lib/session";

/**
 * Auth endpoints — [Part A]
 *
 *   POST { action: "login",    studentId, password }
 *   POST { action: "register", studentId, password, gradYear }
 *   DELETE                     -> logout
 */

const currentYear = new Date().getFullYear();

export async function POST(request: Request) {
  let body: {
    action?: string;
    studentId?: string;
    password?: string;
    gradYear?: number | string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const action = body.action;
  const studentId = body.studentId?.trim();
  const password = body.password ?? "";

  if (!studentId || !password) {
    return NextResponse.json(
      { error: "Student ID and password are required." },
      { status: 400 },
    );
  }

  if (action === "register") {
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const gradYear = Number(body.gradYear);
    if (
      !Number.isInteger(gradYear) ||
      gradYear < currentYear ||
      gradYear > currentYear + 10
    ) {
      return NextResponse.json(
        { error: `Enter a graduation year between ${currentYear} and ${currentYear + 10}.` },
        { status: 400 },
      );
    }

    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.studentId, studentId))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "That student ID is already registered." },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(password);
    const [created] = await db
      .insert(users)
      .values({ studentId, passwordHash, gradYear, role: "student" })
      .returning();

    await createSession({
      userId: created.id,
      studentId: created.studentId,
      role: created.role,
    });

    return NextResponse.json({ role: created.role });
  }

  if (action === "login") {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.studentId, studentId))
      .limit(1);

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json(
        { error: "Invalid student ID or password." },
        { status: 401 },
      );
    }

    await createSession({
      userId: user.id,
      studentId: user.studentId,
      role: user.role,
    });

    return NextResponse.json({ role: user.role });
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}

export async function DELETE() {
  destroySession();
  return NextResponse.json({ ok: true });
}
