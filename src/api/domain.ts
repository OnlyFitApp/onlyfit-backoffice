import { supabase } from '../lib/supabase';
import type { Domain } from './contract.gen';

type Client = typeof supabase;

/**
 * Escape temporário para as chamadas que hoje já contornam os tipos gerados
 * (`supabase as any`). Fica concentrado aqui para a F2 trocar por fachadas
 * `api.<domínio>_v1` tipadas; não use em código novo.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- ver comentário acima
type Loose = any;

export type LooseClient = {
  from(relation: string): Loose;
  rpc(fn: string, args?: Record<string, unknown>, options?: Record<string, unknown>): Loose;
};

/**
 * Uma porta de domínio: a mesma forma do cliente Supabase, restrita às
 * operações daquele domínio pelo contrato (`contract.gen.ts`), que o teste
 * `gateway.contract.test.ts` verifica em todo o `src`.
 */
export type DomainClient = {
  readonly domain: Domain;
  readonly from: Client['from'];
  readonly rpc: Client['rpc'];
  readonly functions: Client['functions'];
  readonly storage: Client['storage'];
  readonly channel: Client['channel'];
  readonly removeChannel: Client['removeChannel'];
  /** Ver `LooseClient`. */
  readonly loose: LooseClient;
};

// Cada método resolve `supabase.<método>` na hora da chamada (e não no import),
// para que mocks de teste e o cliente real sejam sempre os do momento.
export function createDomainClient(domain: Domain): DomainClient {
  // Repassa exatamente os argumentos recebidos: o comportamento é o do método
  // original, inclusive nos parâmetros opcionais.
  type AnyFn = (...args: unknown[]) => unknown;
  const forward = (pick: () => unknown, owner: () => unknown) =>
    (...args: unknown[]) => (pick() as AnyFn).apply(owner(), args);
  return {
    domain,
    from: forward(() => supabase.from, () => supabase) as unknown as Client['from'],
    rpc: forward(() => supabase.rpc, () => supabase) as unknown as Client['rpc'],
    // Getters: o supabase-js cria FunctionsClient/StorageClient a cada acesso,
    // com os cabeçalhos de autenticação do momento.
    get functions() {
      return supabase.functions;
    },
    get storage() {
      return supabase.storage;
    },
    channel: forward(() => supabase.channel, () => supabase) as unknown as Client['channel'],
    removeChannel: forward(() => supabase.removeChannel, () => supabase) as unknown as Client['removeChannel'],
    loose: {
      from: forward(() => supabase.from, () => supabase) as LooseClient['from'],
      rpc: forward(() => supabase.rpc, () => supabase) as LooseClient['rpc'],
    },
  };
}
