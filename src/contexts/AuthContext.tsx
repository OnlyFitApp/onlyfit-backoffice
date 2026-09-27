import type { Session, User } from '@supabase/supabase-js';
import { useEffect, useMemo, useState } from 'react';
import { requireCoreClient, signOut } from '../api/core';
import { AuthContext } from './auth-context';

export type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const client = requireCoreClient();

    const acceptSession = (nextSession: Session | null) => {
      if (alive) setSession(nextSession);
      if (alive) setIsLoading(false);
    };

    client.auth.getSession()
      .then(({ data }) => acceptSession(data.session), () => acceptSession(null));

    const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => {
      acceptSession(nextSession);
    });

    return () => {
      alive = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isLoading,
      signOut,
    }),
    [isLoading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
