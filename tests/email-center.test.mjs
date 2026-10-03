import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const page = readFileSync(new URL('../src/components/EmailCenter.tsx', import.meta.url), 'utf8');
const api = readFileSync(new URL('../src/lib/emailCenter.ts', import.meta.url), 'utf8');
const sendApi = readFileSync(new URL('../src/lib/outboundEmail.ts', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

test('separa pastas de contas sem a terceira coluna e mantém navegação acessível', () => {
  assert.match(page, /aria-label="Pastas de e-mail"/);
  assert.match(page, /aria-label="Filtrar por conta"/);
  assert.match(page, /aria-pressed=\{box === 'inbox'\}/);
  assert.match(page, /aria-label="Buscar conversa"/);
  assert.match(page, /statusLabel\(thread.latestStatus\)/);
  assert.doesNotMatch(page, /email-sidebar|Sem destinatário externo/);
  assert.match(styles, /@media \(max-width: 1000px\)/);
  assert.match(styles, /\.email-thread-list\.has-selection\s*\{\s*display: none/);
});

test('permite voltar e tentar novamente quando a leitura falha', () => {
  assert.match(page, /query.isLoading \|\| query.isError \|\| !query.data/);
  assert.match(page, /Voltar às conversas/);
  assert.match(page, /onClick=\{\(\) => void query.refetch\(\)\}/);
});

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
  assert.match(page, /useState\(\(\) => crypto\.randomUUID\(\)\)/);
  assert.match(page, /idempotencyKey,/);
  assert.match(sendApi, /threadId\?: string/);
  assert.match(sendApi, /replyToMessageId\?: string/);
  assert.match(sendApi, /attachments\?: Array<\{/);
  assert.match(sendApi, /contentBase64: string/);
});

test('renderiza HTML recebido isolado e baixa anexos por autorização temporária', () => {
  assert.match(page, /sandbox=""/);
  assert.match(page, /referrerPolicy="no-referrer"/);
  assert.match(api, /coreApi\.staff\.emailAttachment/);
  assert.match(api, /coreApi\.staff\.emailThread/);
  assert.doesNotMatch(api + sendApi, /service_role|SUPABASE_SERVICE_ROLE_KEY|RESEND_API_KEY/);
});

test('remetente livre mantém domínio autorizado e mostra falhas específicas', () => {
  assert.match(page, /type="email" value=\{from\}/);
  assert.match(page, /endsWith\('@onlyfitapp.com'\)/);
  assert.match(page, /from: from.trim\(\).toLowerCase\(\)/);
  assert.match(page, /await outboundEmailErrorMessage\(error\)/);
  assert.match(sendApi, /error.context.clone\(\).json\(\)/);
  assert.match(sendApi, /staff.email_provider_unavailable/);
});
