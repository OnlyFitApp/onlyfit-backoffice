import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
const source = readFileSync(new URL('../src/lib/appStoreCatalog.ts', import.meta.url), 'utf8');
const ui = readFileSync(new URL('../src/components/AppStorePreparation.tsx', import.meta.url), 'utf8');
const javascript = ts.transpileModule(source, { compilerOptions: {
  module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
} }).outputText;

function catalogWith(appStoreCatalog) {
  const exports = {};
  runInNewContext(javascript, { exports, require: (name) => {
    assert.equal(name, '../api/core');
    return { coreApi: { staff: { appStoreCatalog } } };
  } });
  return exports.getAppStoreCatalogItem;
}

function catalogPage(items, total) {
  return { items, total, limit: 100, offset: 0 };
}

test('Apple catalog uses only the generated Core read operation', () => {
  assert.match(source, /coreApi\.staff\.appStoreCatalog/);
  assert.doesNotMatch(source, /coreApi\.staff\.appStoreCatalogAct/);
  assert.doesNotMatch(source, /coreApi\.staff\.appStoreReviewUpload/);
  assert.doesNotMatch(source, /storage\.|functions\.invoke|\.rpc\(|supabase/);
});
test('ACA view is read-only and does not presume Apple activation', () => {
  assert.doesNotMatch(source, /action: 'prepare'|method: 'PUT'|action: 'complete'/);
  assert.match(ui, /não comprova a habilitação/);
});

test('Apple lookup respects the Core filter bounds and stops at the matching offer', async () => {
  const item = { offering: { id: 'offer-target' } };
  const calls = [];
  const getItem = catalogWith(async ({ limit, offset }) => {
    calls.push({ limit, offset });
    if (limit < 1 || limit > 100 || offset < 0) {
      throw new Error('staff.invalid_app_store_catalog_filter');
    }
    return catalogPage([item], 200);
  });
  assert.equal(await getItem('offer-target'), item);
  assert.deepEqual(calls, [{ limit: 100, offset: 0 }]);
});

test('Apple lookup reports a partial result without fetching the remaining catalog', async () => {
  const firstPage = Array.from({ length: 100 }, (_, index) => ({ offering: { id: `offer-${index}` } }));
  const calls = [];
  const getItem = catalogWith(async ({ limit, offset }) => {
    calls.push({ limit, offset });
    if (calls.length > 1) throw new Error('unexpected extra page');
    return catalogPage(firstPage, 101);
  });
  await assert.rejects(getItem('offer-outside-page'), /consulta limitada a 100 ofertas.*As demais ofertas não foram consultadas\./);
  assert.deepEqual(calls, [{ limit: 100, offset: 0 }]);
});

test('Apple lookup preserves the unavailable message when the full catalog was returned', async () => {
  const items = Array.from({ length: 100 }, (_, index) => ({ offering: { id: `offer-${index}` } }));
  const calls = [];
  const getItem = catalogWith(async ({ limit, offset }) => {
    calls.push({ limit, offset });
    return catalogPage(items, 100);
  });
  await assert.rejects(getItem('missing-offer'), /A oferta não está disponível no catálogo Apple\./);
  assert.deepEqual(calls, [{ limit: 100, offset: 0 }]);
});

test('Apple lookup propagates Core errors instead of reporting a missing offer', async () => {
  const error = new Error('staff.forbidden');
  let calls = 0;
  const getItem = catalogWith(async () => {
    calls += 1;
    throw error;
  });
  await assert.rejects(getItem('offer-target'), (actual) => actual === error);
  assert.equal(calls, 1);
});
