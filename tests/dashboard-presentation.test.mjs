import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const source = readFileSync(new URL('../src/lib/dashboardPresentation.ts', import.meta.url), 'utf8');
const javascript = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { dashboardMetricCards } = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString('base64')}`);
const data = {
  totals: { accounts: 95, businesses: 77, open_queue: 5 },
  overview: { profiles_created_today: 2, pending_content_reports: 3, workout_sessions_completed_today: 4 },
  app_activity: { posts_total: 10, posts_published_today: 1, active_authors_total: 7, post_likes_total: 11, post_comments_total: 12, workout_sessions_total: 13 },
  finance: { gross_revenue_total: 100, net_revenue_total: 90, platform_commission_total: 10, transactions_paid_today_value: 20, transactions_paid_month_value: 30, active_subscriptions_total: 2 },
  outbox: { pending: 1, running: 2, done: 3, failed: 4 },
};
test('every dashboard section selects its own canonical facts without invented counters', () => {
  assert.deepEqual(dashboardMetricCards(data, 'health-growth').map(card => card.value), [95, 2]);
  assert.deepEqual(dashboardMetricCards(data, 'health-engagement').map(card => card.value), [10, 1, 7, 11, 12, 13]);
  assert.deepEqual(dashboardMetricCards(data, 'health-business').map(card => card.value), [100, 90, 10, 20, 30, 2]);
  assert.deepEqual(dashboardMetricCards(data, 'health-operations').map(card => card.value), [5, 3, 1, 2, 3, 4]);
  assert.deepEqual(dashboardMetricCards(data, 'health-users').map(card => card.value), [95, 2, 77]);
});
test('presentation preserves zero and negative money instead of hiding accounting faults', () => {
  const cards = dashboardMetricCards({ ...data, finance: { ...data.finance, platform_commission_total: -10 }, outbox: { ...data.outbox, failed: 0 } }, 'health-overview');
  assert.equal(cards.find(card => card.label === 'Comissão OnlyFit acumulada').value, -10);
  assert.equal(cards.find(card => card.label === 'Tarefas com falha').value, 0);
});
test('uses styled tables and civil-day series rather than raw technical telemetry', () => {
  const page = readFileSync(new URL('../src/components/DashboardPages.tsx', import.meta.url), 'utf8');
  assert.match(page, /className="table-wrapper"/);
  assert.equal((page.match(/<table className="staff-table">/g) ?? []).length, 2);
  assert.equal((page.match(/className="section-heading"><h2 id="dashboard-/g) ?? []).length, 2);
  assert.doesNotMatch(page, /data\.metrics\.map|className="table-wrap"/);
  assert.match(page, /parseSnapshotDay\(day\.date\)/);
});
