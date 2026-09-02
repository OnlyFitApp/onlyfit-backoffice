import { supabase } from './supabase';

export type CompensationScenario =
  | 'direct_to_principal'
  | 'via_associate'
  | 'no_principal'
  | 'via_associate_without_principal';
export type CompensationRole = 'professional' | 'associate' | 'principal' | 'platform';
export type FinancialPolicyStatus = 'draft' | 'scheduled' | 'active' | 'retired';

export type CompensationShares = Record<CompensationRole, number>;

export type CompensationScenarioPolicy = {
  policyId: string;
  scenario: CompensationScenario;
  updatedAt: string;
  lastChangeReason: string | null;
  shares: Partial<CompensationShares>;
};

export type CompensationMatrix = {
  matrixId: string;
  offeringTypeSlug: string;
  offeringTypeName: string;
  affinityGroupKey: string | null;
  affinityGroupLabel: string | null;
  regionId: string | null;
  regionName: string | null;
  version: number;
  status: FinancialPolicyStatus;
  currency: string;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  approvedAt: string | null;
  updatedAt: string;
  publicationReason: string | null;
  retirementReason: string | null;
  snapshotHash: string | null;
  scenarios: CompensationScenarioPolicy[];
  previousVersion: number | null;
  previousScenarios: CompensationScenarioPolicy[];
};

export type ChannelCostPolicy = {
  id: string;
  provider: string;
  paymentMethod: string;
  offeringTypeSlug: string | null;
  offeringTypeName: string | null;
  status: FinancialPolicyStatus;
  version: number;
  commissionPercentage: number;
  processingPercentage: number;
  fixedAmount: number;
  roundingMode: 'half_up' | 'down' | 'up';
  roundingIncrement: number;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  lastChangeReason: string | null;
  publicationReason: string | null;
  retirementReason: string | null;
  snapshotHash: string | null;
  updatedAt: string;
};

export type LegacyIosCostSettings = {
  provider: 'apple';
  paymentMethod: string;
  commissionPercentage: number;
  processingPercentage: number;
  fixedAmount: number;
  roundingIncrement: number;
  enabled: boolean;
  version: number;
  source: string;
};

export type CompensationSnapshot = {
  financialAllocationEnabled: boolean;
  offeringTypes: Array<{ slug: string; name: string; enabled: boolean; sortOrder: number }>;
  affinityGroups: Array<{ key: string; label: string; active: boolean }>;
  regions: Array<{ id: string; name: string; active: boolean }>;
  matrices: CompensationMatrix[];
  costPolicies: ChannelCostPolicy[];
  legacyIosCostSettings: LegacyIosCostSettings | null;
  total: number;
  limit: number;
  offset: number;
  costTotal: number;
  costLimit: number;
  costOffset: number;
};

export type CompensationSimulation = {
  matrixId: string;
  offeringTypeSlug: string;
  grossAmount: number;
  externalCosts: {
    storeCommission: number;
    processing: number;
    fixed: number;
    total: number;
    policies: Array<Record<string, unknown>>;
  };
  netDistributable: number;
  scenarios: Array<{
    scenario: CompensationScenario;
    complete: boolean;
    allocations: Array<{ beneficiaryRole: CompensationRole; percentage: number; amount: number }>;
  }>;
  simulationOnly: boolean;
};

export type AmbassadorFinanceReadiness = {
  runtime: {
    financialAllocationEnabled: boolean;
    allocationShadowEnabled: boolean;
    appStoreFinancialIngestionEnabled: boolean;
    appStoreReconciliationEnabled: boolean;
  };
  wave3: Record<string, boolean>;
  wave4: Record<string, boolean>;
  wave5: Record<string, boolean>;
};

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}
function number(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
function nullableString(value: unknown): string | null {
  return typeof value === 'string' && value.length ? value : null;
}
function status(value: unknown): FinancialPolicyStatus {
  return value === 'scheduled' || value === 'active' || value === 'retired' ? value : 'draft';
}
function scenario(value: unknown): CompensationScenario {
  if (value === 'via_associate' || value === 'no_principal' || value === 'via_associate_without_principal') return value;
  return 'direct_to_principal';
}
function parseShares(value: unknown): Partial<CompensationShares> {
  const row = record(value);
  const result: Partial<CompensationShares> = {};
  for (const role of ['professional', 'associate', 'principal', 'platform'] as const) {
    if (row[role] !== undefined) result[role] = number(row[role]);
  }
  return result;
}
function parseScenarioPolicy(value: unknown): CompensationScenarioPolicy {
  const row = record(value);
  return {
    policyId: String(row.policy_id ?? ''), scenario: scenario(row.scenario),
    updatedAt: String(row.updated_at ?? ''), lastChangeReason: nullableString(row.last_change_reason),
    shares: parseShares(row.shares),
  };
}
function parseMatrix(value: unknown): CompensationMatrix {
  const row = record(value);
  return {
    matrixId: String(row.matrix_id ?? ''), offeringTypeSlug: String(row.offering_type_slug ?? ''),
    offeringTypeName: String(row.offering_type_name ?? row.offering_type_slug ?? ''),
    affinityGroupKey: nullableString(row.affinity_group_key), affinityGroupLabel: nullableString(row.affinity_group_label),
    regionId: nullableString(row.region_id), regionName: nullableString(row.region_name),
    version: number(row.version), status: status(row.status), currency: String(row.currency ?? 'BRL'),
    effectiveFrom: nullableString(row.effective_from), effectiveTo: nullableString(row.effective_to),
    approvedAt: nullableString(row.approved_at), updatedAt: String(row.updated_at ?? ''),
    publicationReason: nullableString(row.publication_reason), retirementReason: nullableString(row.retirement_reason),
    snapshotHash: nullableString(row.snapshot_hash),
    scenarios: Array.isArray(row.scenarios) ? row.scenarios.map(parseScenarioPolicy) : [],
    previousVersion: row.previous_version == null ? null : number(row.previous_version),
    previousScenarios: Array.isArray(row.previous_scenarios) ? row.previous_scenarios.map(parseScenarioPolicy) : [],
  };
}
function parseCostPolicy(value: unknown): ChannelCostPolicy {
  const row = record(value);
  const roundingMode = row.rounding_mode === 'down' || row.rounding_mode === 'up' ? row.rounding_mode : 'half_up';
  return {
    id: String(row.id ?? ''), provider: String(row.provider ?? ''), paymentMethod: String(row.payment_method ?? ''),
    offeringTypeSlug: nullableString(row.offering_type_slug), offeringTypeName: nullableString(row.offering_type_name),
    status: status(row.status), version: number(row.version), commissionPercentage: number(row.commission_percentage),
    processingPercentage: number(row.processing_percentage), fixedAmount: number(row.fixed_amount), roundingMode,
    roundingIncrement: number(row.rounding_increment), effectiveFrom: nullableString(row.effective_from),
    effectiveTo: nullableString(row.effective_to), lastChangeReason: nullableString(row.last_change_reason),
    publicationReason: nullableString(row.publication_reason), retirementReason: nullableString(row.retirement_reason),
    snapshotHash: nullableString(row.snapshot_hash), updatedAt: String(row.updated_at ?? ''),
  };
}

export async function getCompensationSnapshot(filters: { offeringType?: string; status?: string; offset?: number; costOffset?: number } = {}): Promise<CompensationSnapshot> {
  const { data, error } = await supabase.rpc('control_get_ambassador_compensation_snapshot', {
    p_offering_type_slug: filters.offeringType || null, p_status: filters.status || null,
    p_limit: 50, p_offset: filters.offset ?? 0, p_cost_limit: 50, p_cost_offset: filters.costOffset ?? 0,
  });
  if (error) throw error;
  const row = record(data); const program = record(row.program); const legacy = record(row.legacy_ios_cost_settings);
  return {
    financialAllocationEnabled: program.financial_allocation_enabled === true,
    offeringTypes: Array.isArray(row.offering_types) ? row.offering_types.map((item) => { const value = record(item); return { slug: String(value.slug ?? ''), name: String(value.name ?? ''), enabled: value.enabled === true, sortOrder: number(value.sort_order) }; }) : [],
    affinityGroups: Array.isArray(row.affinity_groups) ? row.affinity_groups.map((item) => { const value = record(item); return { key: String(value.key ?? ''), label: String(value.label ?? ''), active: value.active === true }; }) : [],
    regions: Array.isArray(row.regions) ? row.regions.map((item) => { const value = record(item); return { id: String(value.id ?? ''), name: String(value.name ?? ''), active: value.active === true }; }) : [],
    matrices: Array.isArray(row.matrices) ? row.matrices.map(parseMatrix) : [],
    costPolicies: Array.isArray(row.cost_policies) ? row.cost_policies.map(parseCostPolicy) : [],
    legacyIosCostSettings: Object.keys(legacy).length ? {
      provider: 'apple', paymentMethod: String(legacy.payment_method ?? 'in_app_purchase'),
      commissionPercentage: number(legacy.commission_percentage), processingPercentage: number(legacy.processing_percentage),
      fixedAmount: number(legacy.fixed_amount), roundingIncrement: number(legacy.rounding_increment),
      enabled: legacy.enabled === true, version: number(legacy.version), source: String(legacy.source ?? ''),
    } : null,
    total: number(row.total), limit: number(row.limit), offset: number(row.offset),
    costTotal: number(row.cost_total), costLimit: number(row.cost_limit), costOffset: number(row.cost_offset),
  };
}

export async function createCompensationMatrix(input: { offeringTypeSlug: string; affinityGroupKey: string | null; regionId: string | null; currency: string; effectiveFrom: string | null; effectiveTo: string | null }): Promise<void> {
  const { error } = await supabase.rpc('control_create_ambassador_compensation_matrix', {
    p_offering_type_slug: input.offeringTypeSlug, p_affinity_group_key: input.affinityGroupKey,
    p_region_id: input.regionId, p_currency: input.currency, p_effective_from: input.effectiveFrom,
    p_effective_to: input.effectiveTo,
  });
  if (error) throw error;
}
export async function saveCompensationScenario(input: { matrixId: string; scenario: CompensationScenario; shares: CompensationShares; changeReason: string; expectedUpdatedAt: string }): Promise<void> {
  const { error } = await supabase.rpc('control_save_ambassador_compensation_scenario', {
    p_matrix_id: input.matrixId, p_scenario: input.scenario, p_shares: input.shares,
    p_change_reason: input.changeReason, p_expected_updated_at: input.expectedUpdatedAt,
  });
  if (error) throw error;
}
export async function publishCompensationMatrix(input: { matrixId: string; effectiveFrom: string; effectiveTo: string | null; reason: string; expectedUpdatedAt: string }): Promise<void> {
  const { error } = await supabase.rpc('control_publish_ambassador_compensation_matrix', {
    p_matrix_id: input.matrixId, p_effective_from: input.effectiveFrom, p_effective_to: input.effectiveTo,
    p_publication_reason: input.reason, p_expected_updated_at: input.expectedUpdatedAt,
  });
  if (error) throw error;
}
export async function activateCompensationMatrix(matrixId: string): Promise<void> {
  const { error } = await supabase.rpc('control_activate_ambassador_compensation_matrix', { p_matrix_id: matrixId });
  if (error) throw error;
}
export async function retireCompensationMatrix(input: { matrixId: string; reason: string }): Promise<void> {
  const { error } = await supabase.rpc('control_retire_ambassador_compensation_matrix', { p_matrix_id: input.matrixId, p_reason: input.reason });
  if (error) throw error;
}

export type ChannelCostPolicyInput = {
  id?: string; provider: string; paymentMethod: string; offeringTypeSlug: string | null;
  commissionPercentage: number; processingPercentage: number; fixedAmount: number;
  roundingMode: 'half_up' | 'down' | 'up'; roundingIncrement: number;
  changeReason: string; expectedUpdatedAt?: string;
};
export async function saveChannelCostPolicy(input: ChannelCostPolicyInput): Promise<void> {
  const { error } = await supabase.rpc('control_save_payment_channel_cost_policy', {
    p_policy_id: input.id ?? null, p_provider: input.provider, p_payment_method: input.paymentMethod,
    p_offering_type_slug: input.offeringTypeSlug, p_commission_percentage: input.commissionPercentage,
    p_processing_percentage: input.processingPercentage, p_fixed_amount: input.fixedAmount,
    p_rounding_mode: input.roundingMode, p_rounding_increment: input.roundingIncrement,
    p_change_reason: input.changeReason, p_expected_updated_at: input.expectedUpdatedAt ?? null,
  });
  if (error) throw error;
}
export async function publishChannelCostPolicy(input: { id: string; effectiveFrom: string; effectiveTo: string | null; reason: string; expectedUpdatedAt: string }): Promise<void> {
  const { error } = await supabase.rpc('control_publish_payment_channel_cost_policy', {
    p_policy_id: input.id, p_effective_from: input.effectiveFrom, p_effective_to: input.effectiveTo,
    p_publication_reason: input.reason, p_expected_updated_at: input.expectedUpdatedAt,
  });
  if (error) throw error;
}
export async function activateChannelCostPolicy(id: string): Promise<void> {
  const { error } = await supabase.rpc('control_activate_payment_channel_cost_policy', { p_policy_id: id });
  if (error) throw error;
}
export async function retireChannelCostPolicy(input: { id: string; reason: string }): Promise<void> {
  const { error } = await supabase.rpc('control_retire_payment_channel_cost_policy', { p_policy_id: input.id, p_reason: input.reason });
  if (error) throw error;
}
export async function simulateCompensation(input: { matrixId: string; grossAmount: number; costPolicyIds: string[]; useLegacyIosSettings: boolean }): Promise<CompensationSimulation> {
  const { data, error } = await supabase.rpc('control_simulate_ambassador_compensation', {
    p_matrix_id: input.matrixId, p_gross_amount: input.grossAmount,
    p_cost_policy_ids: input.costPolicyIds.length ? input.costPolicyIds : null,
    p_use_legacy_ios_settings: input.useLegacyIosSettings,
  });
  if (error) throw error;
  const row = record(data); const costs = record(row.external_costs);
  return {
    matrixId: String(row.matrix_id ?? ''), offeringTypeSlug: String(row.offering_type_slug ?? ''),
    grossAmount: number(row.gross_amount), netDistributable: number(row.net_distributable),
    externalCosts: {
      storeCommission: number(costs.store_commission), processing: number(costs.processing),
      fixed: number(costs.fixed), total: number(costs.total),
      policies: Array.isArray(costs.policies) ? costs.policies.map(record) : [],
    },
    scenarios: Array.isArray(row.scenarios) ? row.scenarios.map((item) => { const value = record(item); return {
      scenario: scenario(value.scenario), complete: value.complete === true,
      allocations: Array.isArray(value.allocations) ? value.allocations.map((allocation) => { const parsed = record(allocation); return {
        beneficiaryRole: String(parsed.beneficiary_role) as CompensationRole,
        percentage: number(parsed.percentage), amount: number(parsed.amount),
      }; }) : [],
    }; }) : [],
    simulationOnly: row.simulation_only === true,
  };
}

function booleanMap(value: unknown): Record<string, boolean> {
  return Object.fromEntries(Object.entries(record(value)).map(([key, enabled]) => [key, enabled === true]));
}

export async function getAmbassadorFinanceReadiness(): Promise<AmbassadorFinanceReadiness> {
  const { data, error } = await supabase.rpc('control_get_ambassador_finance_readiness');
  if (error) throw error;
  const row = record(data); const runtime = record(row.runtime);
  return {
    runtime: {
      financialAllocationEnabled: runtime.financial_allocation_enabled === true,
      allocationShadowEnabled: runtime.allocation_shadow_enabled === true,
      appStoreFinancialIngestionEnabled: runtime.app_store_financial_ingestion_enabled === true,
      appStoreReconciliationEnabled: runtime.app_store_reconciliation_enabled === true,
    },
    wave3: booleanMap(row.wave_3), wave4: booleanMap(row.wave_4), wave5: booleanMap(row.wave_5),
  };
}

export function compensationErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(record(error).message ?? '');
  if (message.includes('forbidden')) return 'Esta operação exige administrador com MFA válido.';
  if (message.includes('changed')) return 'A política foi alterada em outra sessão. Atualize a tela.';
  if (message.includes('shares_must_total_100')) return 'Os quatro percentuais precisam somar exatamente 100%.';
  if (message.includes('matrix_incomplete') || message.includes('four_numeric_shares')) return 'Preencha os quatro participantes em todos os quatro cenários.';
  if (message.includes('share_must_be_zero') || message.includes('network_shares_must_be_zero')) return 'O cenário contém percentual para um participante que não existe nele.';
  if (message.includes('period_overlap')) return 'A vigência se sobrepõe a outra política publicada ou agendada.';
  if (message.includes('reason_required')) return 'Informe uma justificativa com pelo menos 8 caracteres.';
  if (message.includes('external_costs_exceed_gross')) return 'Os custos externos são maiores ou iguais ao valor bruto simulado.';
  if (message.includes('duplicate_apple_cost_source')) return 'Escolha a configuração iOS existente ou uma política Apple, não as duas.';
  if (message.includes('not_due')) return 'A vigência desta política ainda não começou.';
  return 'Não foi possível concluir a operação financeira.';
}
