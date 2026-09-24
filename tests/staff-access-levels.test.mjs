import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const staff = readFileSync(new URL('../src/lib/staff.ts', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');

test('uses the three canonical staff access levels', () => {
  assert.match(staff, /'super_admin' \| 'admin' \| 'operator'/);
  assert.doesNotMatch(staff, /'moderator'|'support'/);
  assert.match(app, /value: 'operator', label: 'Operador'/);
  assert.doesNotMatch(app, /value: 'moderator'|value: 'support'/);
});
