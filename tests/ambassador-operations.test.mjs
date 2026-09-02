import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const page = await readFile(new URL('../src/components/AmbassadorNetworkPage.tsx', import.meta.url), 'utf8');
const api = await readFile(new URL('../src/lib/ambassadorNetwork.ts', import.meta.url), 'utf8');

test('operates assisted migration without automatic commercial inference', () => {
  assert.match(page, /Migração controlada/);
  assert.match(page, /Decisão humana obrigatória/);
  assert.match(page, /legacy_membership/);
  assert.match(api, /control_resolve_ambassador_legacy_candidate/);
});

test('operates rollout checks, alerts and rollback from staff RPCs', () => {
  assert.match(page, /Piloto e rollout/);
  assert.match(page, /StoreKit ainda não conectado/);
  assert.match(api, /control_set_ambassador_rollout_check/);
  assert.match(api, /control_rollback_ambassador_rollout/);
  assert.doesNotMatch(api, /\.from\(['"]ambassador_(?:legacy_migration|rollout)/);
});
