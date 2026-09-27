import { coreApi } from '../api/core';
import type { StaffAppStoreTransaction } from '../api/core.gen';

export type AppleEnvironment = StaffAppStoreTransaction['environment'];
export type AppleAccessStatus = StaffAppStoreTransaction['status'];
export type AppleTransaction = StaffAppStoreTransaction;
export type AppleTransactionsPage = Awaited<ReturnType<typeof coreApi.staff.appStoreTransactions>>;

export function listAppStoreTransactions(filters: {
  environment: AppleEnvironment;
  search: string;
  status: AppleAccessStatus | '';
  page: number;
}): Promise<AppleTransactionsPage> {
  return coreApi.staff.appStoreTransactions({
    environment: filters.environment,
    search: filters.search.trim() || null,
    status: filters.status || null,
    limit: 25,
    offset: filters.page * 25,
  });
}

export function appleMoney(value: number | null, currency: string | null): string {
  if (value === null || !Number.isFinite(value) || !currency || !/^[A-Z]{3}$/.test(currency)) return '—';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value);
}
