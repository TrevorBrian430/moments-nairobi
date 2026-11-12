"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function AdminSignIn({ configured }: { configured: boolean }) {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, startTransition] = useTransition();
  const router = useRouter();
  const busy = submitting || refreshing;
  const [visible, setVisible] = useState(false);
  const pending = useRef(false);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current || refreshing) return;

    const password = new FormData(event.currentTarget).get("password");
    pending.current = true;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(typeof body?.error === "string" ? body.error : "Could not sign in. Try again.");
      } else {
        startTransition(() => router.refresh());
      }
    } catch {
      setError("Could not reach the store. Check your connection and try again.");
    } finally {
      pending.current = false;
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-dvh w-full place-items-center bg-[#35221b] px-4 py-8 sm:px-6 sm:py-12">
      <div className="w-full max-w-[420px]">
        <div className="mb-6 flex justify-center">
          <Image src="/brand/logo-full-white.svg" alt="Moments Nairobi" width={160} height={44} />
        </div>
        <section aria-labelledby="admin-sign-in-title" className="rounded-[20px] border border-[#e4d6ca] bg-[#fffaf5] p-5 sm:p-8">
          <h1 id="admin-sign-in-title" className="font-heading text-2xl font-semibold text-[#322019] sm:text-3xl">
            Admin sign-in
          </h1>
          {configured ? (
            <form onSubmit={signIn} aria-busy={busy} className="mt-6 space-y-4">
              <div>
                <label htmlFor="admin-password" className="text-sm font-semibold text-[#493128]">Password</label>
                <div className="relative mt-2">
                  <input id="admin-password" name="password" type={visible ? "text" : "password"}
                    autoComplete="current-password" required readOnly={busy}
                    aria-describedby={error ? "admin-sign-in-error" : undefined}
                    className="block min-h-12 w-full min-w-0 rounded-[9px] border border-[#b99e8c] bg-white py-2.5 pl-3 pr-14 text-base text-[#322019] focus-visible:outline-[#733d29]" />
                  <button type="button" aria-label={visible ? "Hide password" : "Show password"}
                    onClick={() => setVisible(!visible)}
                    className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-[9px] text-[#705648] hover:bg-[#f0e0d2] focus-visible:outline-[#733d29]">
                    {visible ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
                  </button>
                </div>
              </div>
              {error && (
                <p id="admin-sign-in-error" role="alert" className="rounded-[9px] border border-[#e8beb5] bg-[#fbebe6] px-3 py-2.5 text-sm text-[#86291c]">
                  {error}
                </p>
              )}
              <button type="submit" disabled={busy}
                className="min-h-12 w-full rounded-[9px] bg-[#733d29] px-4 py-3 text-sm font-semibold text-white hover:bg-[#582c1c] focus-visible:outline-[#733d29] disabled:cursor-wait disabled:opacity-70">
                {refreshing ? "Opening dashboard…" : submitting ? "Signing in…" : "Sign in"}
              </button>
            </form>
          ) : (
            <p className="mt-4 break-words text-sm leading-relaxed text-[#705648]">
              Set <code>ADMIN_PASSWORD</code> to a password of at least 8 characters and restart the server.
            </p>
          )}
        </section>
        <Link href="/" className="mx-auto mt-3 flex min-h-11 w-fit items-center justify-center gap-2 rounded-[9px] px-3 text-sm font-medium text-[#f6e8dc] hover:underline focus-visible:outline-[#f6e8dc]">
          <ArrowLeft size={16} aria-hidden="true" /> Back to storefront
        </Link>
      </div>
    </main>
  );
}
