import { coreApi } from '../api/core';
import type { StaffPaymentTransaction } from '../api/core.gen';

export type TransactionStatus = StaffPaymentTransaction['status'];
export type SettlementStatus = StaffPaymentTransaction['settlement_status'];
export type PaymentTransaction = StaffPaymentTransaction;
export type TransactionsPage = Awaited<ReturnType<typeof coreApi.staff.paymentTransactions>>;

export type TransactionFilters = {
  from?: string | null;
  to?: string | null;
  status?: TransactionStatus | null;
  settlementStatus?: SettlementStatus | null;
  limit?: number;
  offset?: number;
};

export function listPaymentTransactions(filters: TransactionFilters): Promise<TransactionsPage> {
  return coreApi.staff.paymentTransactions(filters);
}

export function transactionStatusLabel(status: TransactionStatus): string {
  switch (status) {
    case 'created': return 'Criada';
    case 'pending': return 'Pendente';
    case 'confirmed': return 'Autorizada';
    case 'settled': return 'Liquidada';
    case 'failed': return 'Falhou';
    case 'refunded': return 'Estornada';
    case 'chargeback': return 'Chargeback';
  }
}

export function paymentProviderLabel(provider: PaymentTransaction['provider']): string {
  return { asaas: 'Asaas', stripe: 'Stripe', app_store: 'App Store', free: 'Gratuito', unknown: 'Não identificado' }[provider];
}

export function paymentMethodLabel(method: PaymentTransaction['payment_method']): string {
  return method ? { card: 'Cartão', pix: 'PIX', app_store: 'Compra no app', free: 'Gratuito' }[method] : '—';
}
