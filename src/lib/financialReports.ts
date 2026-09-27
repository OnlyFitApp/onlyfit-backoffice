import { coreApi } from '../api/core';
import type { StaffFinancialReports } from '../api/core.gen';

export type FinancialReportsSnapshot = StaffFinancialReports;

export function fetchFinancialReportsSnapshot(filters: {
  from?: string | null;
  to?: string | null;
  currency?: string;
}): Promise<FinancialReportsSnapshot> {
  return coreApi.staff.financialReports(filters);
}
