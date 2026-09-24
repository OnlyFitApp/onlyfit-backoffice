import { createClient, processLock, type SupabaseClient } from '@supabase/supabase-js';
import { createApi } from './core.gen';
import { supabase } from '../lib/supabase';

const productionCoreUrl = 'https://rjwyfhfwhpwesfpdddkr.supabase.co';
const productionCorePublishableKey = 'sb_publishable_lHf07wq2Z84Tt5csq2SNpA_k8KpeqQG';
const coreUrl = String(import.meta.env.VITE_ONLYFIT_CORE_URL ?? (import.meta.env.PROD ? productionCoreUrl : '')).trim();
const coreKey = String(import.meta.env.VITE_ONLYFIT_CORE_PUBLISHABLE_KEY
  ?? (import.meta.env.PROD ? productionCorePublishableKey : '')).trim();

export const coreConfigError = Boolean(coreUrl) === Boolean(coreKey)
  ? null
  : 'VITE_ONLYFIT_CORE_URL e VITE_ONLYFIT_CORE_PUBLISHABLE_KEY devem ser configuradas juntas.';

function storageKey(url: string): string {
  const project = /^https:\/\/([a-z0-9]+)\.supabase\.co$/i.exec(url)?.[1] ?? 'local';
  return `onlyfit-backoffice-core-${project}`;
}

export const coreClient: SupabaseClient | null = coreUrl && coreKey
  ? createClient(coreUrl, coreKey, {
      auth: {
        storage: typeof window === 'undefined' ? undefined : window.localStorage,
        storageKey: storageKey(coreUrl),
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        lock: typeof window === 'undefined' ? undefined : processLock,
      },
    })
  : null;

export function requireCoreClient(): SupabaseClient {
  if (coreConfigError) throw new Error(coreConfigError);
  if (!coreClient) throw new Error('OnlyFit Core não está configurado neste ambiente.');
  return coreClient;
}

export async function requireCoreSession(): Promise<SupabaseClient> {
  const client = requireCoreClient();
  const [{ data: legacy }, { data: core }] = await Promise.all([
    supabase.auth.getSession(),
    client.auth.getSession(),
  ]);
  if (!legacy.session?.user.id || legacy.session.user.id !== core.session?.user.id) {
    throw new Error('As sessões do legado e do OnlyFit Core não identificam a mesma conta.');
  }
  return client;
}

export const coreApi = createApi(
  async (fn, args) => {
    const client = await requireCoreSession();
    const { data, error } = await client.schema('api').rpc(fn, args);
    if (error) throw error;
    return data;
  },
  async (functionName, path, body) => {
    const client = requireCoreClient();
    const { data, error } = await client.functions.invoke(`${functionName}${path}`, { body });
    if (error) throw error;
    return data;
  },
);

export async function signInBoth(email: string, password: string): Promise<void> {
  const client = requireCoreClient();
  try {
    // The Core session must exist before the legacy client emits SIGNED_IN.
    // This keeps the application closed until both projects agree on identity.
    const { data: core, error: coreError } = await client.auth.signInWithPassword({ email, password });
    if (coreError) throw coreError;
    const { data: legacy, error: legacyError } = await supabase.auth.signInWithPassword({ email, password });
    if (legacyError) throw legacyError;
    if (!legacy.session?.user.id || legacy.session.user.id !== core.session?.user.id) {
      throw new Error('O OnlyFit Core autenticou uma conta diferente.');
    }
  } catch (error) {
    await Promise.allSettled([
      supabase.auth.signOut({ scope: 'local' }),
      client.auth.signOut({ scope: 'local' }),
    ]);
    throw error;
  }
}

export async function coreSessionMatches(userId: string): Promise<boolean> {
  const client = requireCoreClient();
  const { data } = await client.auth.getSession();
  return data.session?.user.id === userId;
}

export async function signOutCore(): Promise<void> {
  if (coreClient) await coreClient.auth.signOut({ scope: 'local' });
}
