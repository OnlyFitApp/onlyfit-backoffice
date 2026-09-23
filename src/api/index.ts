import { createDomainClient } from './domain';

/**
 * Porta única do app para o backend, separada pelos 8 domínios do plano.
 *
 *   api.treino.rpc('get_student_workouts_for_date_v4', …)
 *   api.social.from('posts').select(…)
 *   api.staff.functions.invoke('control-send-email', …)
 *
 * Cada nome precisa estar no domínio certo do contrato (`contract.gen.ts`,
 * gerado pelo `onlyfit-supabase/contract`). Fora de `src/api` e do transporte
 * (`src/lib/supabase.ts`) ninguém chama o Supabase direto.
 */
export const api = {
  identidade: createDomainClient('identidade'),
  organizacoes: createDomainClient('organizacoes'),
  treino: createDomainClient('treino'),
  nutricao: createDomainClient('nutricao'),
  saude: createDomainClient('saude'),
  social: createDomainClient('social'),
  comercio: createDomainClient('comercio'),
  staff: createDomainClient('staff'),
} as const;

export type Api = typeof api;
export type { Domain } from './contract.gen';
export { getBackendTelemetry, resetBackendTelemetry } from './telemetry';
