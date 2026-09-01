import { NextResponse } from "next/server";

// Events — [Part B] (admins also create school-wide events via Part A UI)
// TODO(Part B): GET (personal + school-wide), POST (create), PATCH, DELETE.

export async function GET() {
  return NextResponse.json(
    { error: "Not implemented — Part B owns /api/events" },
    { status: 501 },
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "Not implemented — Part B owns /api/events" },
    { status: 501 },
  );
}
