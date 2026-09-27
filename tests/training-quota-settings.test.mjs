import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const component = readFileSync(new URL('../src/components/TrainingQuotaSettingsPage.tsx', import.meta.url), 'utf8');
const data = readFileSync(new URL('../src/lib/trainingQuotaSettings.ts', import.meta.url), 'utf8');

test('exposes the personal-workout quota in the platform library navigation', () => {
  assert.match(app, /id: 'training-quotas', label: 'Cotas de treinos'/);
  assert.match(app, /activeSection === 'training-quotas'.*TrainingQuotaSettingsPage/s);
});

test('uses only staff RPCs and sends an optimistic concurrency version', () => {
  assert.match(data, /coreApi\.staff\.trainingQuota\(\)/);
  assert.match(data, /coreApi\.staff\.trainingQuotaSave/);
  assert.match(data, /expectedVersion: input\.expectedVersion/);
  assert.doesNotMatch(data, /control_(?:get|update)_personal_workout_quota/);
  assert.doesNotMatch(data, /\.from\(/);
});

test('allows edits only for admin roles and keeps the Club allowance read-only', () => {
  assert.match(component, /role\.data === 'admin' \|\| role\.data === 'super_admin'/);
  assert.match(component, /OnlyFit Club/);
  assert.match(component, /settings\.data\.clubPersonalWorkoutLimit/);
  assert.doesNotMatch(component, /setClub|clubPersonalWorkoutLimit:/);
});
