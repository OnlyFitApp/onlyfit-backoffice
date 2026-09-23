import { createClient } from '@supabase/supabase-js';
import { recordBackendCall } from '../api/telemetry';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error('VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórias.');
}

/** Mede cada chamada ao backend por operação (ver src/api/telemetry.ts). */
async function measuredFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const target = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
  if (target.includes('/auth/v1/')) return fetch(input, init);
  const started = performance.now();
  try {
    const response = await fetch(input, init);
    recordBackendCall(target, performance.now() - started, response.ok);
    return response;
  } catch (error) {
    recordBackendCall(target, performance.now() - started, false);
    throw error;
  }
}

export const supabase = createClient(url, anonKey, {
  global: { fetch: measuredFetch },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
