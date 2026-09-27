import { coreApi } from '../api/core';
import type { StaffReconciliationRun, StaffTreasuryMovement } from '../api/core.gen';

export type ReconciliationRun = StaffReconciliationRun;
export type ReconciliationProvider = 'stripe' | 'asaas';

export async function listFinancialReconciliationRuns(): Promise<ReconciliationRun[]> {
  const page = await coreApi.staff.reconciliationRuns({ limit: 100, offset: 0 });
  return page.items;
}

export function runFinancialReconciliation(input: {
  provider: ReconciliationProvider;
  from: string;
  to: string;
}): Promise<ReconciliationRun> {
  return coreApi.staff.reconciliationStart({
    ...input,
    idempotencyKey: crypto.randomUUID(),
  });
}

export function recordTreasuryMovement(input: {
  direction: 'invest' | 'redeem';
  amount: number;
  currency: string;
  reference: string;
}): Promise<StaffTreasuryMovement> {
  return coreApi.staff.treasuryMovement({
    ...input,
    note: null,
    idempotencyKey: crypto.randomUUID(),
  });
}
