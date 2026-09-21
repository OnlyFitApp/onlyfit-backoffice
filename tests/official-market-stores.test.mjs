import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const page = readFileSync(new URL('../src/components/MarketSettingsPage.tsx', import.meta.url), 'utf8');
const library = readFileSync(new URL('../src/lib/marketSettings.ts', import.meta.url), 'utf8');

test('official stores use the canonical admin contracts', () => {
  assert.match(library, /control_list_official_market_stores/);
  assert.match(library, /control_search_official_store_organizations/);
  assert.match(library, /control_upsert_official_market_store/);
  assert.match(library, /control_delete_official_market_store/);
});

test('official store media stays in the existing business-media bucket', () => {
  assert.match(library, /from\('business-media'\)/);
  assert.match(library, /official-stores\/\$\{safeKey\}/);
  assert.match(library, /5 \* 1024 \* 1024/);
});

test('the Market panel provides create, edit, delete and organization binding', () => {
  assert.match(page, /title="Lojas oficiais"/);
  assert.match(page, /Nova loja/);
  assert.match(page, /Editar \$\{store\.name\}/);
  assert.match(page, /Apagar \$\{store\.name\}/);
  assert.match(page, /organization_id/);
});
