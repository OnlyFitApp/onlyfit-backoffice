import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const lib = readFileSync(new URL('../src/lib/paymentProviders.ts', import.meta.url), 'utf8');
const hook = readFileSync(new URL('../src/hooks/usePaymentProviders.ts', import.meta.url), 'utf8');
const panel = readFileSync(new URL('../src/components/FinancePanels.tsx', import.meta.url), 'utf8');

test('configura provedores exclusivamente pelo contrato tipado do Core', () => {
  assert.match(lib, /coreApi\.staff\.paymentProviders\(\)/);
  assert.match(lib, /coreApi\.staff\.paymentProviderSave\(input\)/);
  assert.doesNotMatch(lib, /api\.staff\.rpc|control_set_payment_provider_credentials|control_get_asaas/);
});

test('envia apenas campos preenchidos e nunca tenta reler segredos', () => {
  assert.match(panel, /stripe_secret_key: stripeSecretKey\.trim\(\)/);
  assert.match(panel, /asaas_webhook_token: webhookToken\.trim\(\)/);
  assert.match(panel, /Segredos protegidos no OnlyFit Core/);
  assert.match(panel, /canEdit && query\.data\?\.can_edit === true/);
  assert.doesNotMatch(panel, /pending_transactions|expired_pix_transactions/);
  assert.match(hook, /core-payment-providers/);
});
