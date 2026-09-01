import { NextResponse } from "next/server";

// Notifications — [Part B]
// TODO(Part B): GET (mine, newest first), PATCH (mark read).

export async function GET() {
  return NextResponse.json(
    { error: "Not implemented — Part B owns /api/notifications" },
    { status: 501 },
  );
}
