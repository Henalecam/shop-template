import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const isAdmin = process.env.NEXT_PUBLIC_IS_ADMIN === "true";
  if (!isAdmin) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.next();
}