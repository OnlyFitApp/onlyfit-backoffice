import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const page = readFileSync(new URL('../src/components/MarketSettingsPage.tsx', import.meta.url), 'utf8');
const library = readFileSync(new URL('../src/lib/marketSettings.ts', import.meta.url), 'utf8');

test('official and featured stores use the typed Core contracts', () => {
  assert.match(library, /coreApi\.staff\.marketStores/);
  assert.match(library, /coreApi\.staff\.marketStoreSave/);
  assert.doesNotMatch(library, /control_(?:list|search|upsert|delete)_official/);
});

test('store configuration does not write media to the legacy project', () => {
  assert.doesNotMatch(library, /business-media/);
  assert.doesNotMatch(library, /\.storage\./);
});

test('the Market panel configures official status and featured placement separately', () => {
  assert.match(page, /title="Lojas oficiais e destaque"/);
  assert.match(page, /Contrato verificado · loja oficial/);
  assert.match(page, /Exibir como loja destaque/);
  assert.match(page, /Editar \$\{store\.name\}/);
  assert.match(page, /business_id/);
  assert.doesNotMatch(page, /Apagar \$\{store\.name\}/);
});
