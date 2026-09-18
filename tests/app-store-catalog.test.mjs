import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/lib/appStoreCatalog.ts', import.meta.url), 'utf8')
  .replace("import { supabase } from './supabase';", 'const supabase = { functions: { invoke: (...args) => globalThis.__catalogInvoke(...args) } };');
const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const { appStoreCatalogCommand } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);

test('catalog preparation sends only offer identity and action, not a client price', async () => {
  let request;
  globalThis.__catalogInvoke = async (...args) => {
    request = args;
    return { data: { enabled: false, offering: { id: 'offer' }, product: null, job: null }, error: null };
  };
  await appStoreCatalogCommand('offer', 'prepare');
  assert.deepEqual(request, ['app-store-catalog', { body: { offering_id: 'offer', action: 'prepare' } }]);
});

test('provider failures show a safe operational message, not arbitrary response data', async () => {
  globalThis.__catalogInvoke = async () => ({ data: null, error: { context: new Response(JSON.stringify({ error: 'private-provider-details' })) } });
  await assert.rejects(appStoreCatalogCommand('offer', 'status'), error => !error.message.includes('private-provider-details'));
});

test('preparation controls do not offer approval and stop polling outside active work', () => {
  const ui = readFileSync(new URL('../src/components/AppStorePreparation.tsx', import.meta.url), 'utf8');
  assert.match(ui, /Preparar não libera vendas/);
  assert.match(ui, /source_current/);
  assert.match(ui, /refetchInterval:[\s\S]*?5_000 : false/);
  assert.doesNotMatch(ui, /service_role|APP_STORE_CONNECT_PRIVATE_KEY/);
});
