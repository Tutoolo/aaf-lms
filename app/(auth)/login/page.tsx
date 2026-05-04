"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const STAFF_ROLES = [
  "INSTRUCTOR",
  "COHORT_COORDINATOR",
  "CHIEF_PROGRAM_COORDINATOR",
  "ADMIN",
  "DEVELOPER",
];

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const explicitCallback = params.get("callbackUrl");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: explicitCallback ?? "/dashboard",
    });

    if (res?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }
    if (res?.ok) {
      // Decide where to send them. If the URL had a callbackUrl param (e.g.
      // they tried to access a protected page), respect it. Otherwise route
      // staff to /admin and students to /dashboard.
      let dest = explicitCallback;
      if (!dest) {
        try {
          const sessRes = await fetch("/api/auth/session");
          const sess = await sessRes.json();
          const role = sess?.user?.role;
          dest = role && STAFF_ROLES.includes(role) ? "/admin" : "/dashboard";
        } catch {
          dest = "/dashboard";
        }
      }
      router.push(dest);
      router.refresh();
    }
  }

  return (
    <Card className="border-cream-mid">
      <CardHeader>
        <CardTitle className="font-display text-3xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in to continue your fellowship journey.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-gold hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="rounded-md bg-terra/10 px-3 py-2 text-sm text-terra">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>

          {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => signIn("google", { callbackUrl })}
            >
              Continue with Google
            </Button>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          New here?{" "}
          <Link href="/register" className="text-gold hover:underline">
            Create an account
          </Link>
        </p>

        <div className="mt-6 rounded-lg bg-cream-mid/40 p-4 text-xs text-muted">
          <p className="font-medium text-brown-deep">Demo accounts (password: <code>fellowship2025</code>):</p>
          <ul className="mt-2 space-y-1">
            <li>• <code>admin@fellowship.local</code></li>
            <li>• <code>instructor@fellowship.local</code></li>
            <li>• <code>adaeze@fellowship.local</code> (student)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
