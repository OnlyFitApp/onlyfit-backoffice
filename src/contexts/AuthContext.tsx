import type { Session, User } from '@supabase/supabase-js';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { coreSessionMatches, signOutCore } from '../api/core';
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
    let validation = 0;

    const acceptSession = async (nextSession: Session | null) => {
      const attempt = ++validation;
      try {
        if (nextSession && !await coreSessionMatches(nextSession.user.id)) {
          throw new Error('dual_session_mismatch');
        }
        if (alive && attempt === validation) setSession(nextSession);
      } catch {
        await Promise.allSettled([supabase.auth.signOut({ scope: 'local' }), signOutCore()]);
        if (alive && attempt === validation) setSession(null);
      }
      if (alive) setIsLoading(false);
    };

    supabase.auth.getSession()
      .then(({ data }) => acceptSession(data.session))
      .catch(() => acceptSession(null));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void acceptSession(nextSession);
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
      signOut: async () => {
        await Promise.allSettled([supabase.auth.signOut(), signOutCore()]);
      },
    }),
    [isLoading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
