"use client";

import { useCallback, useEffect, useState } from "react";

export type SessionUser = { id: number; username: string; balance: number; role?: string };

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session");
      const body = await response.json();
      setUser(body.user ?? null);
    } catch { setUser(null); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void Promise.resolve().then(refresh); }, [refresh]);
  return { user, setUser, loading, refresh };
}
