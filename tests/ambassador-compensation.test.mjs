import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const page = readFileSync(new URL('../src/components/AmbassadorCompensationPage.tsx', import.meta.url), 'utf8');
const api = readFileSync(new URL('../src/lib/ambassadorCompensation.ts', import.meta.url), 'utf8');

test('adds remuneration infrastructure to the commercial backoffice', () => {
  assert.match(app, /id: 'ambassador-compensation', label: 'Remuneração'/);
  assert.match(app, /activeSection === 'ambassador-compensation'/);
  for (const label of ['Percentuais', 'Taxas', 'Simulador', 'Validação técnica']) assert.match(page, new RegExp(label));
});

test('edits every product, scenario and beneficiary role', () => {
  for (const label of [
    'Direto ao Principal', 'Via Associado', 'Sem Principal', 'Associado sem Principal',
    'Profissional', 'Associado', 'Principal', 'Plataforma',
  ]) assert.match(page, new RegExp(label));
  assert.match(page, /Publicar percentuais/);
  assert.match(page, /Comparação com v/);
});

test('integrates existing iOS settings without calling Apple', () => {
  assert.match(page, /Usar configuração iOS/);
  assert.match(api, /p_use_legacy_ios_settings/);
  assert.doesNotMatch(api, /fetch\s*\(|appstoreconnect|storekit|service_role/i);
});

test('keeps runtime allocation visibly disabled', () => {
  assert.match(page, /Este módulo não executa Apple API, StoreKit, checkout, ledger ou repasse/);
  assert.match(page, /Nada é persistido em transações ou carteiras/);
  assert.doesNotMatch(api, /payment_transactions|payment_revenue_allocations|wallet|ledger/i);
});

test('shows waves 4 and 5 readiness without activation controls', () => {
  assert.match(api, /control_get_ambassador_finance_readiness/);
  assert.match(page, /Motor determinístico sem efeitos colaterais/);
  assert.match(page, /Ingestão financeira Apple/);
  assert.match(page, /Nenhuma destas travas pode ser ativada por esta tela/);
});

test('uses only staff financial RPCs', () => {
  for (const rpc of [
    'control_get_ambassador_compensation_snapshot',
    'control_save_ambassador_compensation_scenario',
    'control_publish_ambassador_compensation_matrix',
    'control_save_payment_channel_cost_policy',
    'control_simulate_ambassador_compensation',
  ]) assert.match(api, new RegExp(rpc));
  assert.doesNotMatch(api, /\.from\(/);
});
