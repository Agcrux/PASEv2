import { NextResponse } from "next/server";

// Auth endpoints (login / register / logout) — [Part A]
// TODO(Part A): implement POST for login & register, DELETE for logout.

export async function POST() {
  return NextResponse.json(
    { error: "Not implemented — Part A owns /api/auth" },
    { status: 501 },
  );
}
