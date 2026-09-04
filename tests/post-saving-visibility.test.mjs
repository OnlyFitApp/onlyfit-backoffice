import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('keeps the saved-post metric visually hidden without deleting its data contract', () => {
  const dashboard = readFileSync('src/components/DashboardPages.tsx', 'utf8');
  const snapshot = readFileSync('src/lib/dashboard.ts', 'utf8');

  assert.match(dashboard, /POST_SAVING_VISIBLE = false/);
  assert.match(dashboard, /POST_SAVING_VISIBLE \? <MetricCard/);
  assert.match(snapshot, /feed_saves_total/);
});
