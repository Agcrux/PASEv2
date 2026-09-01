import { NextResponse } from "next/server";

// Analytics aggregates — [Part B]
// TODO(Part B): GET readiness stats for the current user.

export async function GET() {
  return NextResponse.json(
    { error: "Not implemented — Part B owns /api/analytics" },
    { status: 501 },
  );
}
