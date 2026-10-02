import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const staff = readFileSync(new URL('../src/lib/staff.ts', import.meta.url), 'utf8');
const users = readFileSync(new URL('../src/lib/users.ts', import.meta.url), 'utf8');
const staffHooks = readFileSync(new URL('../src/hooks/useStaffManagement.ts', import.meta.url), 'utf8');
const userHooks = readFileSync(new URL('../src/hooks/useUsers.ts', import.meta.url), 'utf8');
const detail = readFileSync(new URL('../src/components/UserDetail.tsx', import.meta.url), 'utf8');
const directory = readFileSync(new URL('../src/components/UsersDirectory.tsx', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');

test('uses only the typed Core staff account contracts', () => {
  assert.match(staff, /coreApi\.staff\.accounts/);
  assert.match(staff, /coreApi\.staff\.accountAct/);
  assert.match(users, /coreApi\.staff\.accounts/);
  assert.match(users, /coreApi\.staff\.account/);
  for (const source of [staff, users]) {
    assert.doesNotMatch(source, /api\.staff\.(?:rpc|functions)/);
    assert.doesNotMatch(source, /control[_-](?:platform_staff|directory|user_account|list_platform_staff)/);
    assert.doesNotMatch(source, /asRecord|parseProfile|parseFootprint|throwFunctionError/);
  }
});

test('keeps canonical role management and credential reset without accepting passwords', () => {
  assert.match(staff, /action: 'setStaffRole'/);
  assert.match(staff, /action: 'removeFromStaff'/);
  assert.match(detail, /CredentialResetDialog/);
  assert.doesNotMatch(app, /Senha inicial|Nova senha|Confirmar nova senha/);
  assert.doesNotMatch(staff, /password|fullName/);
});

test('removes parallel identity editing, footprint scans and purge', () => {
  assert.doesNotMatch(userHooks, /useUpdateUserAccount|useDeleteUserAccount|useUserFootprint/);
  assert.doesNotMatch(users, /updateUserAccount|deleteUserAccount|fetchUserFootprint/);
  assert.doesNotMatch(detail, /app_lockdown|identity_documents|raio-x|purge/i);
  assert.equal(existsSync(new URL('../src/components/UserDeleteDialog.tsx', import.meta.url)), false);
});

test('preserves search, period filters and cursor pagination', () => {
  assert.match(users, /createdFrom: filters\.createdFrom/);
  assert.match(users, /createdTo: filters\.createdTo/);
  assert.match(users, /cursor: filters\.cursor/);
  assert.match(directory, /document_last4/);
  assert.match(staffHooks, /invalidateQueries\(\{ queryKey: \['staff-accounts'\]/);
});
