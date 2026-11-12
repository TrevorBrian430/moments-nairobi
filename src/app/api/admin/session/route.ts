import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, SESSION_SECONDS, adminConfigured, passwordMatches, signSession } from "@/lib/admin-auth";
import { allowLoginAttempt } from "@/lib/store-db";

export async function POST(request: NextRequest) {
  if (!adminConfigured()) return NextResponse.json({ error: "Admin access has not been configured." }, { status: 503 });
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return NextResponse.json({ error: "Expected JSON." }, { status: 415 });
  }
  const body = await request.json().catch(() => null);
  if (!allowLoginAttempt()) return NextResponse.json({ error: "Too many attempts. Try again in a minute." }, { status: 429 });
  if (typeof body?.password !== "string" || !passwordMatches(body.password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, signSession(Date.now() + SESSION_SECONDS * 1000), {
    httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production",
    path: "/", maxAge: SESSION_SECONDS,
  });
  return response;
}

export function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(ADMIN_COOKIE);
  return response;
}
