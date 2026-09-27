import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../src/lib/appStoreCatalog.ts', import.meta.url), 'utf8');
const ui = readFileSync(new URL('../src/components/AppStorePreparation.tsx', import.meta.url), 'utf8');
test('catalog and metadata use only generated Core staff operations', () => {
  assert.match(source, /coreApi\.staff\.appStoreCatalog/);
  assert.match(source, /coreApi\.staff\.appStoreCatalogAct/);
  assert.match(source, /coreApi\.staff\.appStoreReviewUpload/);
  assert.doesNotMatch(source, /storage\.|functions\.invoke|\.rpc\(|supabase/);
});
test('review image follows prepare, signed PUT and complete', () => {
  assert.match(source, /action: 'prepare'/); assert.match(source, /method: 'PUT'/); assert.match(source, /action: 'complete'/);
  assert.match(source, /expectedVersion: item\.version/); assert.match(ui, /Preparar não libera vendas/);
});
