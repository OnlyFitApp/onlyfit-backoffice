import { coreApi } from '../api/core';
import type { StaffBusinessVerification } from '../api/core.gen';

/**
 * Fila de verificação de empresas.
 *
 * A empresa cadastrada nos apps nasce em análise e não vai ao ar antes de a
 * operação decidir. A decisão é humana hoje e usa o contrato administrativo
 * tipado do Core; uma automação futura reutiliza a mesma operação.
 */
export type CompanyVerificationStatus = StaffBusinessVerification['status'];
export type CompanyVerification = StaffBusinessVerification;

export async function listCompanyVerifications(
  status: CompanyVerificationStatus,
  limit: number,
  offset: number,
) {
  return coreApi.staff.businessVerifications({
    status,
    limit,
    offset,
  });
}

export async function reviewCompanyVerification(input: {
  organizationId: string;
  action: 'approve' | 'reject';
  notes?: string;
}) {
  return coreApi.staff.businessVerificationAct({
    businessId: input.organizationId,
    action: input.action,
    reason: input.notes ?? null,
  });
}

export function formatCompanyDocumentLast4(value: string | null) {
  return value ? `••.•••.•••/••${value.slice(-4)}` : '—';
}
