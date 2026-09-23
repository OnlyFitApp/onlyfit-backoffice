import { DOMAIN_BY_OPERATION, type Domain } from './contract.gen';

/**
 * Telemetria por operação, medida num único ponto: o fetch do cliente Supabase
 * (`src/lib/supabase.ts`). Nada nas telas precisa mudar para ser medido.
 *
 * Operação = `<tipo>:<nome>`, com tipo table | rpc | edge | bucket, e o
 * domínio vem do contrato. Em desenvolvimento, `window.__onlyfitBackend()`
 * mostra a tabela no console.
 */
export type OperationStats = {
  operation: string;
  domain: Domain | 'desconhecido';
  calls: number;
  errors: number;
  totalMs: number;
  maxMs: number;
};

const stats = new Map<string, OperationStats>();

export function operationFromUrl(url: string): string | null {
  let path: string;
  try {
    path = new URL(url).pathname;
  } catch {
    return null;
  }
  let m = /\/rest\/v1\/rpc\/([\w-]+)/.exec(path);
  if (m) return `rpc:${m[1]}`;
  m = /\/rest\/v1\/([\w-]+)/.exec(path);
  if (m) return `table:${m[1]}`;
  m = /\/functions\/v1\/([\w-]+)/.exec(path);
  if (m) return `edge:${m[1]}`;
  m = /\/storage\/v1\/object\/(?:sign\/|public\/|upload\/sign\/|authenticated\/|info\/|list\/)?([\w-]+)/.exec(path);
  if (m) return `bucket:${m[1]}`;
  return null;
}

export function recordBackendCall(url: string, ms: number, ok: boolean): void {
  const operation = operationFromUrl(url);
  if (!operation) return;
  let entry = stats.get(operation);
  if (!entry) {
    entry = {
      operation,
      domain: DOMAIN_BY_OPERATION[operation] ?? 'desconhecido',
      calls: 0,
      errors: 0,
      totalMs: 0,
      maxMs: 0,
    };
    stats.set(operation, entry);
  }
  entry.calls += 1;
  if (!ok) entry.errors += 1;
  entry.totalMs += ms;
  if (ms > entry.maxMs) entry.maxMs = ms;
}

export function getBackendTelemetry(): OperationStats[] {
  return [...stats.values()].sort((a, b) => b.totalMs - a.totalMs);
}

export function resetBackendTelemetry(): void {
  stats.clear();
}

if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as unknown as { __onlyfitBackend?: () => void }).__onlyfitBackend = () => {
    console.table(
      getBackendTelemetry().map((s) => ({
        operacao: s.operation,
        dominio: s.domain,
        chamadas: s.calls,
        erros: s.errors,
        media_ms: Math.round(s.totalMs / s.calls),
        max_ms: Math.round(s.maxMs),
      })),
    );
  };
}
