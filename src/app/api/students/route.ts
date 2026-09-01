import { NextResponse } from "next/server";

// Admin student management — [Part A]
// TODO(Part A): GET list/search students (admin-only).

export async function GET() {
  return NextResponse.json(
    { error: "Not implemented — Part A owns /api/students" },
    { status: 501 },
  );
}
