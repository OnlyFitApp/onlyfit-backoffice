import { createClient, processLock, type SupabaseClient } from '@supabase/supabase-js';
import { createApi } from './core.gen';

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
  const { data, error } = await client.auth.getSession();
  if (error || !data.session?.user.id) throw new Error('auth.required');
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

export async function signIn(email: string, password: string): Promise<void> {
  const client = requireCoreClient();
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw new Error('identity.invalid_credentials');
}

export async function signOut(): Promise<void> {
  if (coreClient) await coreClient.auth.signOut({ scope: 'local' });
}
