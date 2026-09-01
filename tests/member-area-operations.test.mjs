import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const page = readFileSync(new URL('../src/components/MemberAreaOperationsPage.tsx', import.meta.url), 'utf8');
const api = readFileSync(new URL('../src/lib/memberAreaOperations.ts', import.meta.url), 'utf8');

test('exposes one operational member-area destination in the backoffice', () => {
  assert.match(app, /id: 'member-area-operations', label: 'Área de membros'/);
  assert.match(app, /activeSection === 'member-area-operations'/);
  assert.match(page, /label: 'Acessos'/);
  assert.match(page, /label: 'Denúncias'/);
  assert.match(page, /label: 'Histórico'/);
});

test('uses only staff RPC contracts', () => {
  for (const rpc of [
    'control_list_member_area_accesses_v1',
    'control_suspend_member_area_access_v1',
    'control_list_course_comment_reports_v1',
    'control_moderate_course_comment_report_v1',
    'control_list_member_area_audit_v1',
  ]) assert.match(api, new RegExp(rpc));
  assert.doesNotMatch(api, /service_role|VITE_.*SECRET|payment_transactions/);
});

test('keeps high-impact actions role gated and justified', () => {
  assert.match(page, /role === 'admin' \|\| role === 'super_admin'/);
  assert.match(page, /reason\.trim\(\)\.length >= 5/);
  assert.match(page, /crypto\.randomUUID\(\)/);
  assert.match(page, /A compra e o histórico financeiro não serão alterados/);
});

test('does not add authoring or financial controls', () => {
  assert.doesNotMatch(page, /Criar curso|Editar curso|Publicar curso|Reembolso|Cobrança|Repasse/);
  assert.doesNotMatch(api, /create_course|update_course|refund|payout|checkout/);
});
