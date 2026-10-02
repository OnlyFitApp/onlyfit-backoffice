import type { ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { coreApi } from '../api/core';

export function PlatformStatusGate({ children }: { children: ReactNode }) {
  const status = useQuery({
    queryKey: ['core-system-status'],
    queryFn: () => coreApi.app.systemStatus(),
    refetchInterval: 60_000,
    staleTime: 60_000,
    retry: 1,
  });
  // Availability is checked in the background, not as a startup screen.
  // Authentication and MFA remain enforced by the application and the Core.
  if (status.isPending) return <>{children}</>;
  // A failed background check is not evidence of maintenance. Keep the mounted
  // application (including MFA and unsaved forms), while the Core still
  // authorizes every operation and rejects traffic during actual maintenance.
  if (status.data && !status.data.maintenance) return <>
    {status.isError && <div className="inline-alert platform-status-notice" role="status">
      <span>Não foi possível atualizar a disponibilidade. Tentaremos novamente automaticamente.</span>
      <button className="button secondary" type="button" disabled={status.isFetching} onClick={() => void status.refetch()}>
        Tentar novamente
      </button>
    </div>}
    {children}
  </>;

  return (
    <main className="login-shell">
      <section className="access-panel" aria-live="polite">
        <RefreshCw size={28} />
        <h1>{status.isError ? 'Não foi possível conectar' : 'OnlyFit em manutenção'}</h1>
        <p>
          {status.isError
            ? 'Confira sua conexão e tente novamente.'
            : 'A operação está temporariamente pausada. Tente novamente em instantes.'}
        </p>
        <button className="button secondary" type="button" disabled={status.isFetching} onClick={() => void status.refetch()}>
          Tentar novamente
        </button>
      </section>
    </main>
  );
}
