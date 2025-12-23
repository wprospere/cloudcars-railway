import { useCallback, useEffect, useMemo, useState } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string; // default: /admin/login
};

export type AdminUser = {
  id: number | string;
  email: string;
  role: string;
};

export function useAuth(options?: UseAuthOptions) {
  const {
    redirectOnUnauthenticated = false,
    redirectPath = "/admin/login",
  } = options ?? {};

  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchMe = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/me", {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        setUser(null);
        return null;
      }

      const data = (await res.json()) as { ok?: boolean; admin?: AdminUser };
      const admin = data?.admin ?? null;

      setUser(admin);
      return admin;
    } catch (e) {
      setError(e);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load session on mount
  useEffect(() => {
    void fetchMe();
  }, [fetchMe]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
    } finally {
      setUser(null);
    }
  }, []);

  const state = useMemo(
    () => ({
      user,
      loading,
      error,
      isAuthenticated: Boolean(user),
    }),
    [user, loading, error]
  );

  // Optional redirect if user is not authenticated
  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (loading) return;
    if (user) return;
    if (typeof window === "undefined") return;

    // Avoid redirect loop if already on login page
    if (window.location.pathname.startsWith(redirectPath)) return;

    const next = encodeURIComponent(
      window.location.pathname + window.location.search
    );
    window.location.href = `${redirectPath}?next=${next}`;
  }, [redirectOnUnauthenticated, redirectPath, loading, user]);

  return {
    ...state,
    refresh: fetchMe,
    logout,
  };
}
