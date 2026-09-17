import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const page = readFileSync(new URL('../src/components/EmailCenter.tsx', import.meta.url), 'utf8');
const api = readFileSync(new URL('../src/lib/emailCenter.ts', import.meta.url), 'utf8');
const sendApi = readFileSync(new URL('../src/lib/outboundEmail.ts', import.meta.url), 'utf8');

test('organiza entrada, enviados e caixas locais em uma única central', () => {
  assert.match(page, />Todas</);
  assert.match(page, />Entrada</);
  assert.match(page, />Enviados</);
  assert.match(page, /useEmailMailboxes/);
  assert.match(page, /useEmailThreads/);
  assert.match(page, /useEmailThread/);
});

test('responde na conversa existente e envia anexos', () => {
  assert.match(page, /threadId: thread\?\.id/);
  assert.match(page, /replyToMessageId: latestMessage\?\.id/);
  assert.match(page, /contentBase64/);
  assert.match(sendApi, /threadId\?: string/);
  assert.match(sendApi, /replyToMessageId\?: string/);
  assert.match(sendApi, /attachments\?: Array<\{/);
  assert.match(sendApi, /contentBase64: string/);
});

test('renderiza HTML recebido isolado e baixa anexos por autorização temporária', () => {
  assert.match(page, /sandbox=""/);
  assert.match(page, /referrerPolicy="no-referrer"/);
  assert.match(api, /control-email-attachment/);
  assert.match(api, /control_get_email_thread/);
  assert.doesNotMatch(api + sendApi, /service_role|SUPABASE_SERVICE_ROLE_KEY|RESEND_API_KEY/);
});
