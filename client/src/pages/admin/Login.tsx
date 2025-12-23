import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("wp@cloudcarsltd.com");
  const [password, setPassword] = useState("Medw@yStreet");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const next =
      new URLSearchParams(window.location.search).get("next") || "/admin/inquiries";

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || "Login failed");
        return;
      }

      // ✅ Only redirect AFTER successful login
      setLocation(next);
    } catch {
      setError("Network error. Is the server running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to manage inquiries.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <input
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary/40"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Password</label>
            <input
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary/40"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <button
            type="button"
            className="w-full text-sm text-muted-foreground hover:text-foreground"
            onClick={() => setLocation("/")}
          >
            Back to website
          </button>
        </form>
      </div>
    </div>
  );
}
