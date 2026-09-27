import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const page = readFileSync(new URL('../src/components/AmbassadorCompensationPage.tsx', import.meta.url), 'utf8');
const api = readFileSync(new URL('../src/lib/ambassadorCompensation.ts', import.meta.url), 'utf8');
test('exposes the canonical remuneration workspace', () => {
  assert.match(app, /id: 'ambassador-compensation', label: 'Remuneração'/);
  for (const label of ['Percentuais', 'Custos por canal', 'Simulador']) assert.match(page, new RegExp(label));
});
test('supports every canonical scenario with optimistic concurrency', () => {
  for (const scenario of ['direct_to_principal', 'via_associate', 'no_principal', 'via_associate_without_principal']) assert.match(page, new RegExp(scenario));
  assert.match(page, /expectedVersion: matrix\.version/);
  assert.match(api, /idempotencyKey: crypto\.randomUUID/);
});
test('uses only generated Core staff operations and removes legacy readiness', () => {
  for (const operation of ['compensationPolicies', 'channelCostPolicies', 'compensationMatrixAct', 'channelCostPolicyAct', 'compensationSimulate']) assert.match(api, new RegExp(`coreApi\\.staff\\.${operation}`));
  assert.doesNotMatch(api + page, /control_|legacyIos|wave3|wave4|wave5|\.rpc\(|\.from\(/);
});
