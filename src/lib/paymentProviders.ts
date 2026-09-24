import { coreApi } from '../api/core';
import type {
  PaymentProviderCredentials,
  PaymentProviderEnvironment,
  PaymentProviderSettings,
} from '../api/core.gen';

export type PaymentEnvironment = PaymentProviderEnvironment['environment'];
export type PaymentEnvironmentStatus = PaymentProviderEnvironment;

export async function getPaymentProviderStatus(): Promise<PaymentProviderSettings> {
  return coreApi.staff.paymentProviders();
}

export async function setPaymentProviderCredentials(input: {
  environment: PaymentEnvironment;
  credentials: PaymentProviderCredentials;
}): Promise<PaymentEnvironmentStatus> {
  return coreApi.staff.paymentProviderSave(input);
}
