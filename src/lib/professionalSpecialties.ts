import { coreApi } from '../api/core';
import type { StaffProfessionalSpecialtyItem } from '../api/core.gen';
import { catalogKeyFromLabel } from './catalogKey';

export type ProfessionalSpecialty = {
  key: string;
  label: string;
  council: string;
  regulated: boolean;
  active: boolean;
  sortOrder: number;
  approvedCredentials: number;
  pendingCredentials: number;
  declaredBy: number;
};

function specialty(item: StaffProfessionalSpecialtyItem): ProfessionalSpecialty {
  return {
    key: item.key,
    label: item.data.label,
    council: item.data.council,
    regulated: item.data.regulated,
    active: item.active,
    sortOrder: item.position,
    approvedCredentials: item.impact.approved_credentials,
    pendingCredentials: item.impact.pending_credentials,
    declaredBy: item.impact.accounts,
  };
}

function requireSpecialty(item: Awaited<ReturnType<typeof coreApi.staff.catalogSave>>): StaffProfessionalSpecialtyItem {
  if (item.kind !== 'professional_specialties') throw new Error('staff.invalid_catalog_response');
  return item;
}

async function specialtyItems(): Promise<StaffProfessionalSpecialtyItem[]> {
  const catalog = await coreApi.staff.catalog({ kind: 'professional_specialties' });
  return catalog.items.filter((item): item is StaffProfessionalSpecialtyItem => item.kind === 'professional_specialties');
}

export async function listProfessionalSpecialties(): Promise<ProfessionalSpecialty[]> {
  return (await specialtyItems()).map(specialty);
}

export async function createProfessionalSpecialty(input: {
  label: string;
  council: string;
  regulated: boolean;
}): Promise<ProfessionalSpecialty> {
  const saved = requireSpecialty(await coreApi.staff.catalogSave({
    item: {
      kind: 'professional_specialties',
      key: catalogKeyFromLabel(input.label),
      label: input.label.trim(),
      public: true,
      position: 0,
      data: { council: input.council.trim(), regulated: input.regulated },
    },
  }));
  const activated = await coreApi.staff.catalogActivate({
    kind: 'professional_specialties', key: saved.key, expectedVersion: saved.version,
  });
  return specialty(requireSpecialty(activated));
}

export async function updateProfessionalSpecialty(input: {
  key: string;
  label: string;
  council: string;
  regulated: boolean;
}): Promise<ProfessionalSpecialty> {
  const current = (await specialtyItems()).find((item) => item.key === input.key);
  if (!current) throw new Error('staff.catalog_item_not_found');
  return specialty(requireSpecialty(await coreApi.staff.catalogSave({
    item: {
      kind: 'professional_specialties',
      key: input.key,
      label: input.label.trim(),
      public: current.public,
      position: current.position,
      expected_version: current.version,
      data: { council: input.council.trim(), regulated: input.regulated },
    },
  })));
}

export async function setProfessionalSpecialtyActive(input: {
  key: string;
  active: boolean;
}): Promise<ProfessionalSpecialty> {
  const current = (await specialtyItems()).find((item) => item.key === input.key);
  if (!current) throw new Error('staff.catalog_item_not_found');
  if (current.active === input.active) return specialty(current);
  const changed = input.active
    ? await coreApi.staff.catalogActivate({ kind: 'professional_specialties', key: input.key, expectedVersion: current.version })
    : await coreApi.staff.catalogDeactivate({
      kind: 'professional_specialties', key: input.key, expectedVersion: current.version, confirmation: current.data.label,
    });
  return specialty(requireSpecialty(changed));
}

export async function reorderProfessionalSpecialties(keys: string[]): Promise<ProfessionalSpecialty[]> {
  await coreApi.staff.catalogReorder({ kind: 'professional_specialties', keys });
  return listProfessionalSpecialties();
}
