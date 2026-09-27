import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const staff = readFileSync(new URL('../src/lib/staff.ts', import.meta.url), 'utf8');
const platformStaffHook = readFileSync(new URL('../src/hooks/usePlatformStaff.ts', import.meta.url), 'utf8');
const dashboard = readFileSync(new URL('../src/lib/dashboard.ts', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');

test('uses the three canonical staff access levels', () => {
  assert.match(staff, /'super_admin' \| 'admin' \| 'operator'/);
  assert.doesNotMatch(staff, /'moderator'|'support'/);
  assert.match(app, /value: 'operator', label: 'Operador'/);
  assert.doesNotMatch(app, /value: 'moderator'|value: 'support'/);
});

test('reads the current staff role from the typed Core account contract', () => {
  assert.match(staff, /coreApi\.staff\.account\(\{ id: userId \}\)/);
  assert.doesNotMatch(staff, /platform_current_staff_role/);
  assert.match(platformStaffHook, /fetchCurrentStaffRole\(user!\.id\)/);
  assert.doesNotMatch(dashboard, /platform_is_staff/);
});
