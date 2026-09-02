import { supabase } from './supabase';

export type AmbassadorRole = 'principal' | 'associate';
export type AmbassadorStatus = 'draft' | 'pending' | 'active' | 'suspended' | 'ended';

export type AmbassadorImpact = {
  activeAssociates: number;
  currentMemberships: number;
  pendingRequests: number;
  activeCodes: number;
};

export type AmbassadorAssignment = {
  id: string;
  profileId: string;
  profileName: string;
  username: string | null;
  avatarUrl: string | null;
  followerCount: number;
  role: AmbassadorRole;
  affinityGroupKey: string;
  affinityGroupLabel: string;
  regionId: string;
  regionName: string;
  regionCountryCode: string;
  principalAssignmentId: string | null;
  principalName: string | null;
  status: AmbassadorStatus;
  publicVisible: boolean;
  displayOrder: number;
  headline: string | null;
  badgeLabel: string | null;
  contractReference: string | null;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
  impact: AmbassadorImpact;
};

export type CommercialRegion = {
  id: string;
  name: string;
  slug: string;
  scopeType: 'global' | 'country' | 'state' | 'city' | 'custom';
  countryCode: string | null;
  stateCode: string | null;
  cityName: string | null;
  parentId: string | null;
  specificity: number;
  priority: number;
  active: boolean;
  assignmentCount: number;
  currentMembershipCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AmbassadorNetworkSetting = {
  id: string;
  affinityGroupKey: string;
  regionId: string | null;
  followerThreshold: number;
  manualChoiceEnabled: boolean;
  referralCodeEnabled: boolean;
  automaticPrincipalEnabled: boolean;
  moderationEnabled: boolean;
  published: boolean;
  version: number;
  updatedAt: string;
};

export type AffinityOption = { key: string; label: string; active: boolean; sortOrder: number };
export type AmbassadorProgramState = {
  networkEnabled: boolean;
  onboardingEnabled: boolean;
  financialAllocationEnabled: boolean;
};

export type AmbassadorSnapshot = {
  program: AmbassadorProgramState;
  affinityGroups: AffinityOption[];
  regions: CommercialRegion[];
  networkSettings: AmbassadorNetworkSetting[];
  assignments: AmbassadorAssignment[];
  total: number;
  limit: number;
  offset: number;
  pendingMemberships: number;
  pendingPromotions: number;
};

export type AmbassadorCandidate = {
  id: string;
  profileName: string;
  username: string | null;
  avatarUrl: string | null;
  followerCount: number;
  activeAssignmentCount: number;
  activeAssignments: Array<{
    assignmentId: string;
    role: AmbassadorRole;
    affinityGroupLabel: string;
    regionName: string;
    countryCode: string;
  }>;
};

export type AmbassadorMembership = {
  id: string;
  professionalProfileId: string;
  professionalName: string;
  username: string | null;
  avatarUrl: string | null;
  affinityGroupKey: string;
  affinityGroupLabel: string;
  regionId: string;
  regionName: string;
  requestedAssignmentId: string | null;
  linkedAssignmentId: string | null;
  source: string;
  status: string;
  followerCountSnapshot: number | null;
  ambassadorName: string | null;
  ambassadorRole: AmbassadorRole | null;
  decisionReasonCode: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AmbassadorPromotion = {
  id: string;
  professionalProfileId: string;
  professionalName: string;
  avatarUrl: string | null;
  requestedByPrincipalAssignmentId: string | null;
  principalName: string | null;
  affinityGroupKey: string;
  affinityGroupLabel: string;
  regionId: string;
  regionName: string;
  justification: string | null;
  status: string;
  createdAt: string;
  updatedAt: string | null;
};

export type AmbassadorRequests = {
  memberships: AmbassadorMembership[];
  promotions: AmbassadorPromotion[];
};

export type AmbassadorAuditEntry = {
  id: string;
  actorProfileId: string | null;
  actorName: string;
  entityTable: string;
  entityId: string;
  action: 'insert' | 'update' | 'delete';
  beforeState: Record<string, unknown> | null;
  afterState: Record<string, unknown> | null;
  occurredAt: string;
};

export type LegacyMigrationCandidate = {
  id: string; source: 'editorial_highlight' | 'professional_affinity'; profileId: string;
  profileName: string; username: string | null; suggestedAffinityGroupKeys: string[];
  status: 'pending_review' | 'needs_regularization';
};
export type RolloutCheck = { checkKey: string; status: string; evidenceReference: string | null; checkedAt: string | null };
export type AmbassadorRollout = {
  id: string; name: string; affinityGroupKey: string; affinityGroupLabel: string;
  regionId: string; regionName: string; offeringTypeSlug: string; environment: 'sandbox' | 'production';
  stage: string; updatedAt: string; checks: RolloutCheck[];
};
export type AmbassadorOperationsDashboard = {
  migration: { editorialActive: number; pendingReview: number; needsRegularization: number; migrated: number; candidates: LegacyMigrationCandidate[] };
  rollouts: AmbassadorRollout[];
  runtime: Record<string, boolean>;
  alerts: Array<{ key: string; severity: string; count: number }>;
  indicators: Record<string, number>;
};

type RecordValue = Record<string, unknown>;
const record = (value: unknown): RecordValue => value && typeof value === 'object' && !Array.isArray(value) ? value as RecordValue : {};
const stringOrNull = (value: unknown) => typeof value === 'string' && value !== '' ? value : null;
const number = (value: unknown) => Number.isFinite(Number(value)) ? Number(value) : 0;

function impactFrom(value: unknown): AmbassadorImpact {
  const row = record(value);
  return {
    activeAssociates: number(row.active_associates),
    currentMemberships: number(row.current_memberships),
    pendingRequests: number(row.pending_requests),
    activeCodes: number(row.active_codes),
  };
}

function assignmentFrom(value: unknown): AmbassadorAssignment {
  const row = record(value);
  return {
    id: String(row.id ?? ''), profileId: String(row.profile_id ?? ''),
    profileName: String(row.profile_name ?? 'Perfil'), username: stringOrNull(row.username),
    avatarUrl: stringOrNull(row.avatar_url), followerCount: number(row.follower_count),
    role: row.role === 'principal' ? 'principal' : 'associate',
    affinityGroupKey: String(row.affinity_group_key ?? ''), affinityGroupLabel: String(row.affinity_group_label ?? ''),
    regionId: String(row.region_id ?? ''), regionName: String(row.region_name ?? ''),
    regionCountryCode: String(row.region_country_code ?? ''),
    principalAssignmentId: stringOrNull(row.principal_assignment_id), principalName: stringOrNull(row.principal_name),
    status: String(row.status ?? 'draft') as AmbassadorStatus, publicVisible: row.public_visible === true,
    displayOrder: number(row.display_order), headline: stringOrNull(row.headline), badgeLabel: stringOrNull(row.badge_label),
    contractReference: stringOrNull(row.contract_reference), startsAt: stringOrNull(row.starts_at), endsAt: stringOrNull(row.ends_at),
    createdAt: String(row.created_at ?? ''), updatedAt: String(row.updated_at ?? ''), impact: impactFrom(row.impact),
  };
}

function regionFrom(value: unknown): CommercialRegion {
  const row = record(value);
  return {
    id: String(row.id ?? ''), name: String(row.name ?? ''), slug: String(row.slug ?? ''),
    scopeType: String(row.scope_type ?? 'custom') as CommercialRegion['scopeType'],
    countryCode: stringOrNull(row.country_code), stateCode: stringOrNull(row.state_code), cityName: stringOrNull(row.city_name),
    parentId: stringOrNull(row.parent_id), specificity: number(row.specificity), priority: number(row.priority), active: row.active === true,
    assignmentCount: number(row.assignment_count), currentMembershipCount: number(row.current_membership_count),
    createdAt: String(row.created_at ?? ''), updatedAt: String(row.updated_at ?? ''),
  };
}

function settingFrom(value: unknown): AmbassadorNetworkSetting {
  const row = record(value);
  return {
    id: String(row.id ?? ''), affinityGroupKey: String(row.affinity_group_key ?? ''), regionId: stringOrNull(row.region_id),
    followerThreshold: number(row.follower_threshold), manualChoiceEnabled: row.manual_choice_enabled === true,
    referralCodeEnabled: row.referral_code_enabled === true, automaticPrincipalEnabled: row.automatic_principal_enabled === true,
    moderationEnabled: row.moderation_enabled === true, published: row.published === true,
    version: number(row.version), updatedAt: String(row.updated_at ?? ''),
  };
}

function membershipFrom(value: unknown): AmbassadorMembership {
  const row = record(value);
  const ambassadorRole = row.ambassador_role ?? row.requested_ambassador_role;
  return {
    id: String(row.id ?? ''), professionalProfileId: String(row.professional_profile_id ?? ''),
    professionalName: String(row.professional_name ?? 'Profissional'), username: stringOrNull(row.username), avatarUrl: stringOrNull(row.avatar_url),
    affinityGroupKey: String(row.affinity_group_key ?? ''), affinityGroupLabel: String(row.affinity_group_label ?? ''),
    regionId: String(row.region_id ?? ''), regionName: String(row.region_name ?? ''),
    requestedAssignmentId: stringOrNull(row.requested_assignment_id), linkedAssignmentId: stringOrNull(row.linked_assignment_id),
    source: String(row.source ?? ''), status: String(row.status ?? ''), followerCountSnapshot: row.follower_count_snapshot == null ? null : number(row.follower_count_snapshot),
    ambassadorName: stringOrNull(row.ambassador_name ?? row.requested_ambassador_name),
    ambassadorRole: ambassadorRole === 'principal' || ambassadorRole === 'associate' ? ambassadorRole : null,
    decisionReasonCode: stringOrNull(row.decision_reason_code), createdAt: String(row.created_at ?? ''), updatedAt: String(row.updated_at ?? ''),
  };
}

export async function getAmbassadorSnapshot(filters: { affinityGroupKey?: string; regionId?: string; status?: string; limit?: number; offset?: number } = {}): Promise<AmbassadorSnapshot> {
  const { data, error } = await supabase.rpc('control_get_ambassador_network_snapshot', {
    p_affinity_group_key: filters.affinityGroupKey || null, p_region_id: filters.regionId || null,
    p_status: filters.status || null, p_limit: filters.limit ?? 100, p_offset: filters.offset ?? 0,
  });
  if (error) throw error;
  const row = record(data); const program = record(row.program);
  return {
    program: { networkEnabled: program.network_enabled === true, onboardingEnabled: program.onboarding_enabled === true, financialAllocationEnabled: program.financial_allocation_enabled === true },
    affinityGroups: Array.isArray(row.affinity_groups) ? row.affinity_groups.map((value) => { const item = record(value); return { key: String(item.key ?? ''), label: String(item.label ?? ''), active: item.active === true, sortOrder: number(item.sort_order) }; }) : [],
    regions: Array.isArray(row.regions) ? row.regions.map(regionFrom) : [], networkSettings: Array.isArray(row.network_settings) ? row.network_settings.map(settingFrom) : [],
    assignments: Array.isArray(row.assignments) ? row.assignments.map(assignmentFrom) : [], total: number(row.total), limit: number(row.limit), offset: number(row.offset),
    pendingMemberships: number(row.pending_memberships), pendingPromotions: number(row.pending_promotions),
  };
}

export async function searchAmbassadorCandidates(query: string): Promise<AmbassadorCandidate[]> {
  const { data, error } = await supabase.rpc('control_search_ambassador_candidates', { p_query: query, p_limit: 20 });
  if (error) throw error;
  return Array.isArray(data) ? data.map((value) => { const row = record(value); return {
    id: String(row.id ?? ''), profileName: String(row.profile_name ?? ''), username: stringOrNull(row.username),
    avatarUrl: stringOrNull(row.avatar_url), followerCount: number(row.follower_count),
    activeAssignmentCount: number(row.active_assignment_count),
    activeAssignments: Array.isArray(row.active_assignments) ? row.active_assignments.map((entry) => {
      const assignment = record(entry); return {
        assignmentId: String(assignment.assignment_id ?? ''),
        role: assignment.role === 'principal' ? 'principal' : 'associate',
        affinityGroupLabel: String(assignment.affinity_group_label ?? assignment.affinity_group_key ?? ''),
        regionName: String(assignment.region_name ?? ''), countryCode: String(assignment.country_code ?? ''),
      };
    }) : [],
  }; }) : [];
}

export type RegionInput = Omit<CommercialRegion, 'id' | 'active' | 'assignmentCount' | 'currentMembershipCount' | 'createdAt' | 'updatedAt'> & { id?: string; expectedUpdatedAt?: string };
export async function saveCommercialRegion(input: RegionInput): Promise<void> {
  const { error } = await supabase.rpc('control_save_commercial_region', { p_region_id: input.id ?? null, p_name: input.name, p_slug: input.slug, p_scope_type: input.scopeType, p_country_code: input.countryCode, p_state_code: input.stateCode, p_city_name: input.cityName, p_parent_id: input.parentId, p_specificity: input.specificity, p_priority: input.priority, p_expected_updated_at: input.expectedUpdatedAt ?? null });
  if (error) throw error;
}
export async function setCommercialRegionActive(input: { id: string; active: boolean; expectedUpdatedAt: string }): Promise<void> { const { error } = await supabase.rpc('control_set_commercial_region_active', { p_region_id: input.id, p_active: input.active, p_expected_updated_at: input.expectedUpdatedAt }); if (error) throw error; }

export type AssignmentInput = { id?: string; profileId: string; role: AmbassadorRole; affinityGroupKey: string; regionId: string; principalAssignmentId: string | null; publicVisible: boolean; displayOrder: number; headline: string; badgeLabel: string; contractReference: string; startsAt: string | null; endsAt: string | null; expectedUpdatedAt?: string };
export async function saveAmbassadorAssignment(input: AssignmentInput): Promise<void> { const { error } = await supabase.rpc('control_save_ambassador_assignment', { p_assignment_id: input.id ?? null, p_profile_id: input.profileId, p_role: input.role, p_affinity_group_key: input.affinityGroupKey, p_region_id: input.regionId, p_principal_assignment_id: input.principalAssignmentId, p_public_visible: input.publicVisible, p_display_order: input.displayOrder, p_headline: input.headline || null, p_badge_label: input.badgeLabel || null, p_contract_reference: input.contractReference || null, p_starts_at: input.startsAt, p_ends_at: input.endsAt, p_expected_updated_at: input.expectedUpdatedAt ?? null }); if (error) throw error; }
export async function getAmbassadorAssignmentImpact(id: string): Promise<AmbassadorImpact> { const { data, error } = await supabase.rpc('control_get_ambassador_assignment_impact', { p_assignment_id: id }); if (error) throw error; return impactFrom(data); }
export async function transitionAmbassadorAssignment(input: { id: string; action: string; publicVisible: boolean; expectedUpdatedAt: string }): Promise<void> { const { error } = await supabase.rpc('control_transition_ambassador_assignment', { p_assignment_id: input.id, p_action: input.action, p_public_visible: input.publicVisible, p_expected_updated_at: input.expectedUpdatedAt }); if (error) throw error; }
export async function transferAmbassadorAssociate(input: { id: string; principalAssignmentId: string | null; expectedUpdatedAt: string }): Promise<void> { const { error } = await supabase.rpc('control_transfer_ambassador_associate', { p_assignment_id: input.id, p_principal_assignment_id: input.principalAssignmentId, p_expected_updated_at: input.expectedUpdatedAt }); if (error) throw error; }


export async function listAmbassadorMemberships(input: { assignmentId?: string; status?: string; limit?: number; offset?: number }): Promise<{ items: AmbassadorMembership[]; total: number }> { const { data, error } = await supabase.rpc('control_list_ambassador_memberships', { p_assignment_id: input.assignmentId ?? null, p_status: input.status ?? null, p_limit: input.limit ?? 50, p_offset: input.offset ?? 0 }); if (error) throw error; const row = record(data); return { items: Array.isArray(row.items) ? row.items.map(membershipFrom) : [], total: number(row.total) }; }
export async function listAmbassadorRequests(): Promise<AmbassadorRequests> { const { data, error } = await supabase.rpc('control_list_ambassador_requests', { p_limit: 100, p_offset: 0 }); if (error) throw error; const row = record(data); return { memberships: Array.isArray(row.memberships) ? row.memberships.map(membershipFrom) : [], promotions: Array.isArray(row.promotions) ? row.promotions.map((value) => { const item = record(value); return { id: String(item.id ?? ''), professionalProfileId: String(item.professional_profile_id ?? ''), professionalName: String(item.professional_name ?? ''), avatarUrl: stringOrNull(item.avatar_url), requestedByPrincipalAssignmentId: stringOrNull(item.requested_by_principal_assignment_id), principalName: stringOrNull(item.principal_name), affinityGroupKey: String(item.affinity_group_key ?? ''), affinityGroupLabel: String(item.affinity_group_label ?? ''), regionId: String(item.region_id ?? ''), regionName: String(item.region_name ?? ''), justification: stringOrNull(item.justification), status: String(item.status ?? ''), createdAt: String(item.created_at ?? ''), updatedAt: stringOrNull(item.updated_at) }; }) : [] }; }
export async function reviewAmbassadorMembership(input: { id: string; decision: string; assignmentId: string | null; reasonCode: string; reasonText: string; expectedUpdatedAt: string }): Promise<void> { const { error } = await supabase.rpc('control_review_ambassador_membership', { p_membership_id: input.id, p_decision: input.decision, p_assignment_id: input.assignmentId, p_reason_code: input.reasonCode || null, p_reason_text: input.reasonText || null, p_expected_updated_at: input.expectedUpdatedAt }); if (error) throw error; }
export async function transferAmbassadorMembership(input: { id: string; assignmentId: string | null; reasonCode: string; expectedUpdatedAt: string }): Promise<void> { const { error } = await supabase.rpc('control_transfer_ambassador_membership', { p_membership_id: input.id, p_assignment_id: input.assignmentId, p_reason_code: input.reasonCode || null, p_expected_updated_at: input.expectedUpdatedAt }); if (error) throw error; }
export async function reviewAmbassadorPromotion(input: { id: string; decision: string; principalAssignmentId: string | null; reasonCode: string; expectedUpdatedAt: string | null }): Promise<void> { const { error } = await supabase.rpc('control_review_ambassador_promotion', { p_promotion_id: input.id, p_decision: input.decision, p_principal_assignment_id: input.principalAssignmentId, p_reason_code: input.reasonCode || null, p_expected_updated_at: input.expectedUpdatedAt }); if (error) throw error; }

export async function saveAmbassadorNetworkSetting(input: { id?: string; affinityGroupKey: string; regionId: string | null; followerThreshold: number; manualChoiceEnabled: boolean; referralCodeEnabled: boolean; automaticPrincipalEnabled: boolean; moderationEnabled: boolean; published: boolean; expectedUpdatedAt?: string }): Promise<void> { const { error } = await supabase.rpc('control_save_ambassador_network_setting', { p_setting_id: input.id ?? null, p_affinity_group_key: input.affinityGroupKey, p_region_id: input.regionId, p_follower_threshold: input.followerThreshold, p_manual_choice_enabled: input.manualChoiceEnabled, p_referral_code_enabled: input.referralCodeEnabled, p_automatic_principal_enabled: input.automaticPrincipalEnabled, p_moderation_enabled: input.moderationEnabled, p_published: input.published, p_expected_updated_at: input.expectedUpdatedAt ?? null }); if (error) throw error; }

export async function setAmbassadorProgramFlags(input: { networkEnabled: boolean; onboardingEnabled: boolean }): Promise<void> {
  const { error } = await supabase.rpc('control_set_ambassador_program_flags', {
    p_network_enabled: input.networkEnabled,
    p_onboarding_enabled: input.onboardingEnabled,
    p_expected_updated_at: null,
  });
  if (error) throw error;
}

export async function listAmbassadorAudit(): Promise<{ items: AmbassadorAuditEntry[]; total: number }> { const { data, error } = await supabase.rpc('control_list_ambassador_audit', { p_entity_table: null, p_limit: 100, p_offset: 0 }); if (error) throw error; const row = record(data); return { total: number(row.total), items: Array.isArray(row.items) ? row.items.map((value) => { const item = record(value); return { id: String(item.id ?? ''), actorProfileId: stringOrNull(item.actor_profile_id), actorName: String(item.actor_name ?? 'Sistema'), entityTable: String(item.entity_table ?? ''), entityId: String(item.entity_id ?? ''), action: String(item.action ?? 'update') as AmbassadorAuditEntry['action'], beforeState: item.before_state ? record(item.before_state) : null, afterState: item.after_state ? record(item.after_state) : null, occurredAt: String(item.occurred_at ?? '') }; }) : [] }; }

export async function getAmbassadorOperationsDashboard(): Promise<AmbassadorOperationsDashboard> {
  const { data, error } = await supabase.rpc('control_get_ambassador_operations_dashboard');
  if (error) throw error;
  const root = record(data); const migration = record(root.migration);
  return {
    migration: {
      editorialActive: number(migration.editorial_active), pendingReview: number(migration.pending_review),
      needsRegularization: number(migration.needs_regularization), migrated: number(migration.migrated),
      candidates: Array.isArray(migration.candidates) ? migration.candidates.map((value) => { const row = record(value); return {
        id: String(row.id ?? ''), source: row.source === 'editorial_highlight' ? 'editorial_highlight' : 'professional_affinity',
        profileId: String(row.profile_id ?? ''), profileName: String(row.profile_name ?? 'Perfil'), username: stringOrNull(row.username),
        suggestedAffinityGroupKeys: Array.isArray(row.suggested_affinity_group_keys) ? row.suggested_affinity_group_keys.map(String) : [],
        status: row.status === 'needs_regularization' ? 'needs_regularization' : 'pending_review',
      }; }) : [],
    },
    rollouts: Array.isArray(root.rollouts) ? root.rollouts.map((value) => { const row = record(value); return {
      id: String(row.id ?? ''), name: String(row.name ?? ''), affinityGroupKey: String(row.affinity_group_key ?? ''),
      affinityGroupLabel: String(row.affinity_group_label ?? ''), regionId: String(row.region_id ?? ''), regionName: String(row.region_name ?? ''),
      offeringTypeSlug: String(row.offering_type_slug ?? ''), environment: row.environment === 'production' ? 'production' : 'sandbox',
      stage: String(row.stage ?? 'draft'), updatedAt: String(row.updated_at ?? ''),
      checks: Array.isArray(row.checks) ? row.checks.map((item) => { const check = record(item); return { checkKey: String(check.check_key ?? ''), status: String(check.status ?? 'pending'), evidenceReference: stringOrNull(check.evidence_reference), checkedAt: stringOrNull(check.checked_at) }; }) : [],
    }; }) : [],
    runtime: Object.fromEntries(Object.entries(record(root.runtime)).map(([key, value]) => [key, value === true])),
    alerts: Array.isArray(root.alerts) ? root.alerts.map((value) => { const row = record(value); return { key: String(row.key ?? ''), severity: String(row.severity ?? ''), count: number(row.count) }; }) : [],
    indicators: Object.fromEntries(Object.entries(record(root.indicators)).map(([key, value]) => [key, number(value)])),
  };
}
export async function refreshAmbassadorLegacyInventory(): Promise<void> { const { error } = await supabase.rpc('control_refresh_ambassador_legacy_inventory'); if (error) throw error; }
export async function resolveAmbassadorLegacyCandidate(input: { id: string; resolutionKind: string; affinityGroupKey: string | null; regionId: string | null; role: string | null; principalAssignmentId?: string | null; reasonCode: string }): Promise<void> { const { error } = await supabase.rpc('control_resolve_ambassador_legacy_candidate', { p_candidate_id: input.id, p_resolution_kind: input.resolutionKind, p_affinity_group_key: input.affinityGroupKey, p_region_id: input.regionId, p_role: input.role, p_principal_assignment_id: input.principalAssignmentId ?? null, p_reason_code: input.reasonCode }); if (error) throw error; }
export async function saveAmbassadorRollout(input: { id?: string; name: string; affinityGroupKey: string; regionId: string; environment: 'sandbox' | 'production'; expectedUpdatedAt?: string }): Promise<void> { const { error } = await supabase.rpc('control_save_ambassador_rollout', { p_rollout_id: input.id ?? null, p_name: input.name, p_affinity_group_key: input.affinityGroupKey, p_region_id: input.regionId, p_offering_type_slug: 'premium_content', p_environment: input.environment, p_expected_updated_at: input.expectedUpdatedAt ?? null }); if (error) throw error; }
export async function setAmbassadorRolloutCheck(input: { rolloutId: string; checkKey: string; status: string; evidenceReference: string }): Promise<void> { const { error } = await supabase.rpc('control_set_ambassador_rollout_check', { p_rollout_id: input.rolloutId, p_check_key: input.checkKey, p_status: input.status, p_evidence_reference: input.evidenceReference }); if (error) throw error; }
export async function transitionAmbassadorRollout(input: { rolloutId: string; targetStage: string; expectedUpdatedAt: string }): Promise<void> { const { error } = await supabase.rpc('control_transition_ambassador_rollout', { p_rollout_id: input.rolloutId, p_target_stage: input.targetStage, p_expected_updated_at: input.expectedUpdatedAt }); if (error) throw error; }
export async function rollbackAmbassadorRollout(input: { rolloutId: string; evidenceReference: string }): Promise<void> { const { error } = await supabase.rpc('control_rollback_ambassador_rollout', { p_rollout_id: input.rolloutId, p_evidence_reference: input.evidenceReference }); if (error) throw error; }

export function ambassadorErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(record(error).message ?? '');
  if (message.includes('forbidden')) return 'Sua função não permite esta operação ou a sessão MFA expirou.';
  if (message.includes('changed')) return 'O registro mudou em outra sessão. Atualize antes de tentar novamente.';
  if (message.includes('one_active_principal') || message.includes('duplicate key')) return 'Já existe uma atribuição ativa conflitante.';
  if (message.includes('active_network')) return 'Existem vínculos ativos que precisam ser encerrados ou transferidos primeiro.';
  if (message.includes('requires_transfer')) return 'Use a ação de transferência para mudar a estrutura de uma atribuição ativa.';
  if (message.includes('invalid_principal')) return 'O Principal precisa estar ativo na mesma vertical e região.';
  if (message.includes('storekit_financial_runtime_not_connected')) return 'O piloto financeiro está bloqueado até a integração e validação do StoreKit.';
  if (message.includes('readiness_checks_incomplete')) return 'Conclua todos os gates obrigatórios antes de avançar.';
  return 'Não foi possível concluir a operação.';
}
