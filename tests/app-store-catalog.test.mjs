import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../src/lib/appStoreCatalog.ts', import.meta.url), 'utf8');
const ui = readFileSync(new URL('../src/components/AppStorePreparation.tsx', import.meta.url), 'utf8');
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
