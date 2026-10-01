import type { ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { getApiRoutingSnapshot } from '../api/apiRouting';

export function PlatformStatusGate({ children }: { children: ReactNode }) {
  const status = getApiRoutingSnapshot();
  if (status.availability === 'AVAILABLE' && !status.updateRequired) return children;

  return (
    <main className="login-shell">
      <section className="access-panel" aria-live="polite">
        <RefreshCw size={28} />
        <h1>{status.updateRequired ? 'Atualização necessária' : 'OnlyFit em manutenção'}</h1>
        <p>
          {status.updateRequired
            ? 'Atualize o backoffice para continuar.'
            : 'A operação está temporariamente pausada. Tente novamente em instantes.'}
        </p>
        <button className="button secondary" type="button" onClick={() => window.location.reload()}>
          Tentar novamente
        </button>
      </section>
    </main>
  );
}
