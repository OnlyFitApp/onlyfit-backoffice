import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const library = readFileSync(new URL('../src/lib/inviteOnly.ts', import.meta.url), 'utf8');
const hook = readFileSync(new URL('../src/hooks/useInviteOnly.ts', import.meta.url), 'utf8');
const screen = readFileSync(new URL('../src/components/InviteOnly.tsx', import.meta.url), 'utf8');

test('invite-only uses the eight typed Core operations and no legacy transport', () => {
  for (const operation of [
    'inviteSettings',
    'inviteSettingsSave',
    'invitedEmails',
    'invitedEmailsAdd',
    'invitedEmailRemove',
    'inviteWaitlist',
    'inviteWaitlistRelease',
    'inviteEmailsSend',
  ]) {
    assert.match(library, new RegExp(`coreApi\\.staff\\.${operation}`));
  }
  assert.doesNotMatch(library, /\.rpc\(|functions\.invoke|asRecord|\bas\s+Record/);
  assert.doesNotMatch(library, /control_(?:get|set|list|add|remove)|invite-(?:release-access|send-email)/);
});

test('mutations carry concurrency and one idempotency key per user intention', () => {
  assert.match(library, /expectedVersion/);
  assert.match(library, /crypto\.randomUUID\(\)/);
  assert.match(hook, /enabled, expectedVersion/);
  assert.match(screen, /expectedVersion: settings\.version/);
});

test('the UI reports queued mail instead of claiming synchronous delivery', () => {
  assert.match(screen, /sendResult\.queued/);
  assert.match(screen, /result\.email_queued/);
  assert.match(screen, /fila de envio/);
  assert.doesNotMatch(screen, /sendResult\.sent|result\.emailSent/);
});
