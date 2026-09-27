import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const data = readFileSync(new URL('../src/lib/firstContact.ts', import.meta.url), 'utf8');
const hook = readFileSync(new URL('../src/hooks/useFirstContact.ts', import.meta.url), 'utf8');
const component = readFileSync(new URL('../src/components/FirstContact.tsx', import.meta.url), 'utf8');

test('uses only the typed Core first-contact contracts', () => {
  assert.match(data, /coreApi\.staff\.firstContactSettings\(\)/);
  assert.match(data, /coreApi\.staff\.firstContactSettingsSave/);
  assert.match(data, /coreApi\.staff\.firstContacts/);
  assert.doesNotMatch(data, /control_(?:get_service_settings|set_first_contact_deadlines|list_contracts_without_first_contact)/);
  assert.doesNotMatch(data, /api\.staff\.rpc/);
  assert.doesNotMatch(data, /asRecord|parseSettings|parseContract/);
});

test('sends the optimistic concurrency version through the hook and screen', () => {
  assert.match(hook, /expectedVersion: number/);
  assert.match(hook, /setFirstContactDeadlines\(reminderHours, alertHours, expectedVersion\)/);
  assert.match(component, /expectedVersion: settings\.version/);
});

test('keeps deadline and pagination semantics visible', () => {
  assert.match(component, /min=\{1\}/);
  assert.match(component, /max=\{720\}/);
  assert.match(component, /PAGE_SIZE = 50/);
  assert.match(data, /hasMore: result\.has_more/);
  assert.match(data, /staff\.first_contact_settings_changed/);
});
