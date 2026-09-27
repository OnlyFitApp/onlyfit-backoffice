import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

async function load(file) {
  const source = readFileSync(new URL(file, import.meta.url), 'utf8')
    .replace("import { coreApi } from '../api/core';", 'const coreApi = { staff: globalThis.__staffApi };');
  const js = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
}

const calls = [];
globalThis.__staffApi = {
  paymentTransactions: async (input) => {
    calls.push(['paymentTransactions', input]);
    return globalThis.__paymentPage;
  },
  appStoreTransactions: async (input) => {
    calls.push(['appStoreTransactions', input]);
    return globalThis.__applePage;
  },
};
const apple = await load('../src/lib/appStoreTransactions.ts');
const payments = await load('../src/lib/paymentTransactions.ts');

test('Apple and free payments are never labeled Asaas; unknown providers stay unknown', async () => {
  globalThis.__paymentPage = {
    total: 4,
    limit: 100,
    offset: 0,
    items: ['app_store', 'stripe', 'free', 'unknown'].map((provider) => ({ provider, payment_method: provider })),
  };
  const result = await payments.listPaymentTransactions({});
  assert.deepEqual(result.items.map((row) => payments.paymentProviderLabel(row.provider)), ['App Store', 'Stripe', 'Gratuito', 'Não identificado']);
  assert.equal(payments.paymentMethodLabel(result.items[0].payment_method), 'Compra no app');
});

test('Apple queries use typed server pagination and explicitly isolate Sandbox', async () => {
  calls.length = 0;
  globalThis.__applePage = { total: 0, items: [], limit: 25, offset: 50 };
  await apple.listAppStoreTransactions({ environment: 'Sandbox', search: '  buyer  ', status: 'expired', page: 2 });
  assert.deepEqual(calls, [[
    'appStoreTransactions',
    { environment: 'Sandbox', search: 'buyer', status: 'expired', limit: 25, offset: 50 },
  ]]);
});

test('unknown financial amounts stay unknown, not zero', () => {
  assert.equal(apple.appleMoney(null, 'BRL'), '—');
  assert.equal(apple.appleMoney(1.99, null), '—');
  assert.match(apple.appleMoney(1.99, 'BRL'), /1,99/);
});

test('Core errors propagate instead of becoming an empty list', async () => {
  globalThis.__staffApi.appStoreTransactions = async () => { throw new Error('staff.forbidden'); };
  await assert.rejects(
    apple.listAppStoreTransactions({ environment: 'Production', search: '', status: '', page: 0 }),
    /staff\.forbidden/,
  );
});
