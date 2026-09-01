import { NextResponse } from "next/server";

// To-dos — [Part B]
// TODO(Part B): GET (mine), POST (create), PATCH (toggle), DELETE.

export async function GET() {
  return NextResponse.json(
    { error: "Not implemented — Part B owns /api/todos" },
    { status: 501 },
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "Not implemented — Part B owns /api/todos" },
    { status: 501 },
  );
}
