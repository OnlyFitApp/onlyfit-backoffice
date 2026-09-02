import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const page = readFileSync(new URL('../src/components/AmbassadorNetworkPage.tsx', import.meta.url), 'utf8');
const api = readFileSync(new URL('../src/lib/ambassadorNetwork.ts', import.meta.url), 'utf8');

test('adds the ambassador network to the commercial backoffice', () => {
  assert.match(app, /id: 'ambassador-network', label: 'Rede de Embaixadores'/);
  assert.match(app, /activeSection === 'ambassador-network'/);
  for (const label of ['Rede', 'Países e regiões', 'Regras', 'Solicitações', 'Histórico']) assert.match(page, new RegExp(label));
});

test('covers identity, hierarchy and operational queues without association codes', () => {
  for (const text of [
    'Nova atribuição', 'Embaixador Principal', 'Embaixador Associado',
    'Transferir supervisão', 'Promoções',
  ]) assert.match(page, new RegExp(text));
  assert.match(page, /Principal do novo Associado/);
  assert.match(page, /Supervisão da plataforma/);
  assert.doesNotMatch(page, /Códigos de indicação|Gerar código|Permitir código/);
});

test('allows the same profile to receive roles in multiple countries', () => {
  assert.match(page, /País \/ região contratual/);
  assert.match(page, /activeAssignmentCount/);
  assert.match(page, /item\.countryCode/);
  assert.doesNotMatch(page, /disabled=\{candidate\.hasActiveAssignment\}/);
  assert.match(api, /active_assignment_count/);
  assert.match(api, /active_assignments/);
  assert.match(api, /region_country_code/);
});

test('uses staff RPCs without client-side table access or secrets', () => {
  for (const rpc of [
    'control_get_ambassador_network_snapshot',
    'control_save_ambassador_assignment',
    'control_transition_ambassador_assignment',
    'control_review_ambassador_membership',
    'control_review_ambassador_promotion',
  ]) assert.match(api, new RegExp(rpc));
  assert.doesNotMatch(api, /control_(?:list|generate|revoke)_ambassador_codes?/);
  assert.doesNotMatch(api, /\.from\(['"]ambassador_|service_role|VITE_.*SECRET/);
});

test('keeps payment runtime explicitly outside wave 2', () => {
  assert.match(page, /alocação financeira permanecem desligados/);
  assert.doesNotMatch(api, /checkout|webhook|wallet|ledger|payment_transactions/i);
});
