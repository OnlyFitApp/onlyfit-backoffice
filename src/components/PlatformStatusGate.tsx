import type { ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { coreApi } from '../api/core';

export function PlatformStatusGate({ children }: { children: ReactNode }) {
  const status = useQuery({
    queryKey: ['core-system-status'],
    queryFn: () => coreApi.app.systemStatus(),
    refetchInterval: 60_000,
    retry: 1,
  });
  if (status.data && !status.data.maintenance && !status.isError) return children;

  return (
    <main className="login-shell">
      <section className="access-panel" aria-live="polite">
        <RefreshCw size={28} />
        <h1>{status.isPending ? 'Verificando disponibilidade' : status.isError ? 'Não foi possível conectar' : 'OnlyFit em manutenção'}</h1>
        <p>
          {status.isPending ? 'Aguarde um instante.' : status.isError
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
