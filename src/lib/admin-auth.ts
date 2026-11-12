import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "moments-admin";
export const SESSION_SECONDS = 8 * 60 * 60;

export function adminConfigured() {
  return (process.env.ADMIN_PASSWORD?.length ?? 0) >= 8;
}

export function passwordMatches(password: string) {
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return adminConfigured() && timingSafeEqual(digest(password), digest(process.env.ADMIN_PASSWORD!));
}

export function signSession(expires: number) {
  const signature = createHmac("sha256", process.env.ADMIN_PASSWORD!).update(`admin:${expires}`).digest("hex");
  return `${expires}.${signature}`;
}

export async function isAdmin() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!adminConfigured()) return false;
  if (!token || !/^\d{13}\.[a-f0-9]{64}$/.test(token)) return false;
  const expires = Number(token.split(".")[0]);
  return expires > Date.now() && timingSafeEqual(Buffer.from(token), Buffer.from(signSession(expires)));
}
