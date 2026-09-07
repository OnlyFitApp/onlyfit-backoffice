import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ambassadorRoleLabel,
  ambassadorRoles,
  parseAmbassadorRole,
  requireAmbassadorRole,
} from '../src/lib/ambassadorRoleContract.ts';

test('keeps the persisted ambassador role values stable', () => {
  assert.deepEqual(ambassadorRoles, ['principal', 'associate']);
  assert.equal(parseAmbassadorRole('principal'), 'principal');
  assert.equal(parseAmbassadorRole('associate'), 'associate');
});

test('uses the approved public labels', () => {
  assert.equal(ambassadorRoleLabel('principal'), 'Embaixador');
  assert.equal(ambassadorRoleLabel('associate'), 'Associado');
});

test('fails closed when a server adds or corrupts a role', () => {
  for (const value of ['primary', 'associated', '', null, undefined, 1]) {
    assert.equal(parseAmbassadorRole(value), null);
    assert.throws(() => requireAmbassadorRole(value), /invalid_ambassador_role_contract/);
  }
});
