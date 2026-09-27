import { coreApi } from '../api/core';
import type { StaffPaymentProviderItem } from '../api/core.gen';

export interface PaymentProviderCredentials {
  stripe_publishable_key?: string;
  stripe_secret_key?: string;
  stripe_webhook_secret?: string;
  asaas_api_key?: string;
  asaas_webhook_token?: string;
}

export interface PaymentProviderEnvironment {
  environment: 'sandbox' | 'production';
  stripe_publishable_key_configured: boolean;
  stripe_publishable_key_last4: string | null;
  stripe_secret_key_configured: boolean;
  stripe_secret_key_last4: string | null;
  stripe_webhook_secret_configured: boolean;
  stripe_webhook_secret_last4: string | null;
  asaas_api_key_configured: boolean;
  asaas_api_key_last4: string | null;
  asaas_webhook_token_configured: boolean;
  updated_at: string | null;
}

export interface PaymentProviderSettings {
  can_edit: boolean;
  environments: PaymentProviderEnvironment[];
}

export type PaymentEnvironment = PaymentProviderEnvironment['environment'];
export type PaymentEnvironmentStatus = PaymentProviderEnvironment;

function paymentEnvironment(value: StaffPaymentProviderItem): PaymentProviderEnvironment {
  return {
    environment: value.environment,
    stripe_publishable_key_configured: value.stripe_publishable_key_configured,
    stripe_publishable_key_last4: value.stripe_publishable_key_last4,
    stripe_secret_key_configured: value.stripe_secret_key_configured,
    stripe_secret_key_last4: value.stripe_secret_key_last4,
    stripe_webhook_secret_configured: value.stripe_webhook_secret_configured,
    stripe_webhook_secret_last4: value.stripe_webhook_secret_last4,
    asaas_api_key_configured: value.asaas_api_key_configured,
    asaas_api_key_last4: value.asaas_api_key_last4,
    asaas_webhook_token_configured: value.asaas_webhook_token_configured,
    updated_at: value.updated_at,
  };
}

export async function getPaymentProviderStatus(): Promise<PaymentProviderSettings> {
  const catalog = await coreApi.staff.catalog({ kind: 'payment_providers' });
  if (catalog.kind !== 'payment_providers') {
    throw new Error('Core returned the wrong payment provider catalog');
  }
  return {
    can_edit: catalog.can_edit,
    environments: catalog.items
      .filter((item): item is StaffPaymentProviderItem => item.kind === 'payment_providers')
      .map(paymentEnvironment),
  };
}

export async function setPaymentProviderCredentials(input: {
  environment: PaymentEnvironment;
  credentials: PaymentProviderCredentials;
}): Promise<PaymentEnvironmentStatus> {
  const saved = await coreApi.staff.catalogSave({
    item: { kind: 'payment_providers', environment: input.environment, credentials: input.credentials },
  });
  if (saved.kind !== 'payment_providers') throw new Error('Core returned the wrong catalog item');
  return paymentEnvironment(saved);
}
