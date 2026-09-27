import { affinityAccents, affinityIcons, type AffinityAccent, type AffinityIcon } from './affinityCatalog';
import { coreApi } from '../api/core';
import type { StaffAffinityGroupItem, StaffCatalogImpact } from '../api/core.gen';
import { catalogKeyFromLabel } from './catalogKey';
export type { AffinityAccent, AffinityIcon };

export type AffinityImpact = StaffCatalogImpact & { token: string };

export type AffinityGroup = AffinityImpact & {
  key: string;
  label: string;
  icon: AffinityIcon;
  accent: AffinityAccent;
  aliases: string[];
  sort_order: number;
  active: boolean;
};

export type AffinityGroupInput = Pick<AffinityGroup, 'label' | 'icon' | 'accent' | 'aliases'>;

export type AffinityAuditEntry = {
  id: number;
  group_key: string | null;
  action: 'create' | 'update' | 'reorder' | 'activate' | 'deactivate';
  created_at: string;
};

function affinityIcon(value: string): AffinityIcon {
  for (const icon of affinityIcons) if (icon === value) return icon;
  throw new Error('staff.invalid_affinity_icon');
}

function affinityAccent(value: string): AffinityAccent {
  for (const accent of affinityAccents) if (accent === value) return accent;
  throw new Error('staff.invalid_affinity_accent');
}

function affinityItem(item: StaffAffinityGroupItem): AffinityGroup {
  return {
    ...item.impact,
    token: String(item.version),
    key: item.key,
    label: item.data.label,
    icon: affinityIcon(item.data.icon),
    accent: affinityAccent(item.data.accent),
    aliases: item.data.aliases,
    sort_order: item.position,
    active: item.active,
  };
}

function requireAffinityItem(item: Awaited<ReturnType<typeof coreApi.staff.catalogSave>>): StaffAffinityGroupItem {
  if (item.kind !== 'affinity_groups') throw new Error('staff.invalid_catalog_response');
  return item;
}

async function affinityItems(): Promise<StaffAffinityGroupItem[]> {
  const catalog = await coreApi.staff.catalog({ kind: 'affinity_groups' });
  return catalog.items.filter((item): item is StaffAffinityGroupItem => item.kind === 'affinity_groups');
}

export async function listAffinityGroups(): Promise<AffinityGroup[]> {
  return (await affinityItems()).map(affinityItem);
}

export async function getAffinityGroupImpact(key: string): Promise<AffinityImpact> {
  const item = (await affinityItems()).find((candidate) => candidate.key === key);
  if (!item) throw new Error('staff.catalog_item_not_found');
  return { ...item.impact, token: String(item.version) };
}

export async function createAffinityGroup(input: AffinityGroupInput): Promise<AffinityGroup> {
  const item = await coreApi.staff.catalogSave({
    item: {
      kind: 'affinity_groups',
      key: catalogKeyFromLabel(input.label),
      label: input.label.trim(),
      public: true,
      position: 0,
      data: { icon: input.icon, accent: input.accent, aliases: input.aliases },
    },
  });
  const saved = requireAffinityItem(item);
  const activated = await coreApi.staff.catalogActivate({
    kind: 'affinity_groups',
    key: saved.key,
    expectedVersion: saved.version,
  });
  return affinityItem(requireAffinityItem(activated));
}

export async function updateAffinityGroup(input: AffinityGroupInput & { key: string }): Promise<AffinityGroup> {
  const current = (await affinityItems()).find((item) => item.key === input.key);
  if (!current) throw new Error('staff.catalog_item_not_found');
  const item = await coreApi.staff.catalogSave({
    item: {
      kind: 'affinity_groups',
      key: input.key,
      label: input.label.trim(),
      public: current.public,
      position: current.position,
      expected_version: current.version,
      data: { icon: input.icon, accent: input.accent, aliases: input.aliases },
    },
  });
  return affinityItem(requireAffinityItem(item));
}

export async function reorderAffinityGroups(keys: string[]): Promise<void> {
  await coreApi.staff.catalogReorder({ kind: 'affinity_groups', keys });
}

export async function activateAffinityGroup(key: string): Promise<AffinityGroup> {
  const current = (await affinityItems()).find((item) => item.key === key);
  if (!current) throw new Error('staff.catalog_item_not_found');
  if (current.active) return affinityItem(current);
  const changed = await coreApi.staff.catalogActivate({
    kind: 'affinity_groups', key, expectedVersion: current.version,
  });
  return affinityItem(requireAffinityItem(changed));
}

export async function deactivateAffinityGroup(input: {
  key: string;
  confirmation: string;
  expectedToken: string;
}): Promise<{ group: AffinityGroup; impact: AffinityImpact; alreadyInactive: boolean }> {
  const current = (await affinityItems()).find((item) => item.key === input.key);
  if (!current) throw new Error('staff.catalog_item_not_found');
  if (String(current.version) !== input.expectedToken) throw new Error('affinity_group_impact_changed');
  if (current.data.label !== input.confirmation) throw new Error('affinity_group_confirmation_mismatch');
  const impact = { ...current.impact, token: String(current.version) };
  if (!current.active) return { group: affinityItem(current), impact, alreadyInactive: true };
  const changed = await coreApi.staff.catalogDeactivate({
    kind: 'affinity_groups',
    key: input.key,
    expectedVersion: current.version,
    confirmation: input.confirmation,
  });
  return { group: affinityItem(requireAffinityItem(changed)), impact, alreadyInactive: false };
}

function auditAction(value: string, created: boolean): AffinityAuditEntry['action'] | null {
  const action = value.replace('staff.catalog_', '');
  if (action === 'saved') return created ? 'create' : 'update';
  if (action === 'create' || action === 'update' || action === 'reorder'
    || action === 'activate' || action === 'deactivate') return action;
  return null;
}

export async function listAffinityGroupAudit(): Promise<AffinityAuditEntry[]> {
  const [itemsAudit, catalogAudit] = await Promise.all([
    coreApi.staff.audit({ targetType: 'catalog_item', limit: 100 }),
    coreApi.staff.audit({ targetType: 'catalog', targetId: 'affinity_groups', limit: 100 }),
  ]);
  return [...itemsAudit.items, ...catalogAudit.items].flatMap((item) => {
    if (item.target_type === 'catalog_item' && !item.target_id.startsWith('affinity_groups:')) return [];
    const action = auditAction(item.action, item.before === null);
    if (!action) return [];
    return [{
      id: item.id,
      group_key: item.target_type === 'catalog_item' ? item.target_id.split(':')[1] || null : null,
      action,
      created_at: item.at,
    }];
  }).sort((left, right) => right.id - left.id).slice(0, 100);
}

function affinityGroupErrorText(error: unknown): string {
  return error instanceof Error ? error.message : '';
}

export function isAffinityGroupImpactChanged(error: unknown): boolean {
  return affinityGroupErrorText(error).includes('affinity_group_impact_changed');
}

export function affinityGroupErrorMessage(error: unknown): string {
  const message = affinityGroupErrorText(error);
  if (message.includes('affinity_group_value_conflict')) return 'Nome, chave ou alias já usado por outro grupo.';
  if (message.includes('last_active_affinity_group')) return 'O último grupo ativo não pode ser desativado.';
  if (message.includes('affinity_group_impact_changed')) return 'Os vínculos mudaram. Revise o impacto atualizado e confirme novamente.';
  if (message.includes('affinity_group_confirmation_mismatch')) return 'O nome digitado não confere.';
  if (message.includes('affinity_group_has_active_ambassador_network')) return 'A vertical possui configuração ou vínculos na Rede de Embaixadores. Encerre-os antes de desativar.';
  if (message.includes('invalid_affinity_group_order')) return 'A ordem mudou em outra sessão. Atualize a lista e tente novamente.';
  if (message.includes('forbidden')) return 'Seu perfil não possui permissão para esta ação.';
  return 'Não foi possível concluir a ação. Tente novamente.';
}
