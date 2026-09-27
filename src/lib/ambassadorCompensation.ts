import { coreApi } from '../api/core';
import type { StaffChannelCostPolicy, StaffCompensationMatrix } from '../api/core.gen';

export type CompensationScenario = StaffCompensationMatrix['scenarios'][number]['scenario'];
export type CompensationMatrix = StaffCompensationMatrix;
export type ChannelCostPolicy = StaffChannelCostPolicy;

export async function getCompensationSnapshot(filters: { status?: string; offset?: number; costOffset?: number } = {}) {
  const [matrices, costs, offerTypes, affinityGroups, network] = await Promise.all([
    coreApi.staff.compensationPolicies({ status: filters.status || null, limit: 50, offset: filters.offset ?? 0 }),
    coreApi.staff.channelCostPolicies({ status: filters.status || null, limit: 50, offset: filters.costOffset ?? 0 }),
    coreApi.staff.catalog({ kind: 'offer_types' }),
    coreApi.staff.catalog({ kind: 'affinity_groups' }),
    coreApi.staff.ambassadorNetwork({ limit: 1 }),
  ]);
  return { matrices, costs, offerTypes, affinityGroups, regions: network.regions };
}

type MatrixData = {
  offering_type?: string;
  affinity_group?: string | null;
  region_code?: string | null;
  currency?: string;
  effective_from?: string;
  effective_to?: string | null;
  scenario?: CompensationScenario;
  professional_share?: number;
  associate_share?: number;
  principal_share?: number;
  platform_share?: number;
  rationale?: string;
};

export function actCompensationMatrix(input: {
  action: 'create' | 'saveScenario' | 'publish' | 'activate' | 'retire';
  matrixId: string | null;
  data: MatrixData;
  expectedVersion: number | null;
}) {
  return coreApi.staff.compensationMatrixAct({ ...input, idempotencyKey: crypto.randomUUID() });
}

type CostData = {
  provider?: StaffChannelCostPolicy['provider'];
  payment_method?: StaffChannelCostPolicy['payment_method'];
  offering_type?: string | null;
  commission_percentage?: number;
  processing_percentage?: number;
  fixed_amount?: number;
  rounding_mode?: StaffChannelCostPolicy['rounding_mode'];
  rounding_increment?: number;
  effective_from?: string;
  effective_to?: string | null;
};

export function actChannelCostPolicy(input: {
  action: 'create' | 'publish' | 'activate' | 'retire';
  policyId: string | null;
  data: CostData;
  expectedVersion: number | null;
}) {
  return coreApi.staff.channelCostPolicyAct({ ...input, idempotencyKey: crypto.randomUUID() });
}

export function simulateCompensation(input: {
  amount: number;
  currency: string;
  offeringType: string;
  scenario: CompensationScenario;
  provider: StaffChannelCostPolicy['provider'];
  paymentMethod: StaffChannelCostPolicy['payment_method'];
  affinityGroup?: string | null;
  regionCode?: string | null;
}) {
  return coreApi.staff.compensationSimulate(input);
}

export function compensationErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : '';
  if (message.includes('forbidden')) return 'Esta operação exige administrador com MFA válido.';
  if (message.includes('changed') || message.includes('version')) return 'A política mudou em outra sessão. Atualize a tela.';
  if (message.includes('100')) return 'Os percentuais precisam somar exatamente 100%.';
  if (message.includes('overlap')) return 'A vigência se sobrepõe a outra política.';
  return 'Não foi possível concluir a operação financeira.';
}
