import { coreApi } from '../api/core';
import type { StaffFightTechniqueItem } from '../api/core.gen';
import { catalogKeyFromLabel } from './catalogKey';

export type CombatTechnique = {
  id: string;
  namePtbr: string;
  nameEn: string;
  nameEs: string;
  descriptionPtbr: string;
  techniqueType: StaffFightTechniqueItem['data']['technique_type'];
  distance: StaffFightTechniqueItem['data']['distance'];
  disciplines: string[];
  videoUrl: string;
  thumbUrl: string;
  active: boolean;
  inUseCount: number;
};

export type CombatTechniqueInput = Omit<CombatTechnique, 'inUseCount'>;

export type CombatTechniqueFilters = {
  search: string;
  active: boolean | null;
  discipline: string | null;
  techniqueType: string | null;
  distance: string | null;
  limit: number;
  offset: number;
};

function technique(item: StaffFightTechniqueItem): CombatTechnique {
  return {
    id: item.key,
    namePtbr: item.data.label,
    nameEn: item.data.name_en ?? '',
    nameEs: item.data.name_es ?? '',
    descriptionPtbr: item.data.description_ptbr ?? '',
    techniqueType: item.data.technique_type,
    distance: item.data.distance,
    disciplines: item.data.disciplines,
    videoUrl: item.data.video_url ?? '',
    thumbUrl: item.data.thumb_url ?? '',
    active: item.active,
    inUseCount: item.impact.total_links,
  };
}

function requireTechnique(item: Awaited<ReturnType<typeof coreApi.staff.catalogSave>>): StaffFightTechniqueItem {
  if (item.kind !== 'fight_techniques') throw new Error('staff.invalid_catalog_response');
  return item;
}

async function techniqueItems(): Promise<StaffFightTechniqueItem[]> {
  const catalog = await coreApi.staff.catalog({ kind: 'fight_techniques' });
  return catalog.items.filter((item): item is StaffFightTechniqueItem => item.kind === 'fight_techniques');
}

export async function listCombatTechniques(filters: CombatTechniqueFilters) {
  const query = filters.search.trim().toLocaleLowerCase('pt-BR');
  const all = (await techniqueItems())
    .map(technique)
    .filter((item) =>
      (filters.active == null || item.active === filters.active)
      && (!filters.discipline || item.disciplines.includes(filters.discipline))
      && (!filters.techniqueType || item.techniqueType === filters.techniqueType)
      && (!filters.distance || item.distance === filters.distance)
      && (!query || `${item.namePtbr} ${item.nameEn} ${item.nameEs}`.toLocaleLowerCase('pt-BR').includes(query))
    );
  return { items: all.slice(filters.offset, filters.offset + filters.limit), total: all.length };
}

export async function upsertCombatTechnique(input: CombatTechniqueInput): Promise<string> {
  const current = input.id
    ? (await techniqueItems()).find((item) => item.key === input.id)
    : undefined;
  const saved = requireTechnique(await coreApi.staff.catalogSave({
    item: {
      kind: 'fight_techniques',
      key: input.id || catalogKeyFromLabel(input.namePtbr),
      label: input.namePtbr.trim(),
      public: current?.public ?? true,
      position: current?.position ?? 0,
      expected_version: current?.version,
      data: {
        name_en: input.nameEn.trim() || null,
        name_es: input.nameEs.trim() || null,
        description_ptbr: input.descriptionPtbr.trim() || null,
        technique_type: input.techniqueType,
        distance: input.distance,
        disciplines: input.disciplines,
        video_url: input.videoUrl.trim() || null,
        thumb_url: input.thumbUrl.trim() || null,
      },
    },
  }));
  if (saved.active !== input.active) {
    const changed = input.active
      ? await coreApi.staff.catalogActivate({ kind: 'fight_techniques', key: saved.key, expectedVersion: saved.version })
      : await coreApi.staff.catalogDeactivate({
        kind: 'fight_techniques', key: saved.key, expectedVersion: saved.version, confirmation: saved.data.label,
      });
    requireTechnique(changed);
  }
  return saved.key;
}

export async function setCombatTechniqueActive(input: { id: string; active: boolean }): Promise<void> {
  const current = (await techniqueItems()).find((item) => item.key === input.id);
  if (!current) throw new Error('staff.catalog_item_not_found');
  if (current.active === input.active) return;
  const changed = input.active
    ? await coreApi.staff.catalogActivate({ kind: 'fight_techniques', key: input.id, expectedVersion: current.version })
    : await coreApi.staff.catalogDeactivate({
      kind: 'fight_techniques', key: input.id, expectedVersion: current.version, confirmation: current.data.label,
    });
  requireTechnique(changed);
}

export function combatTechniqueErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : '';
  if (message.includes('invalid_combat_technique_name')) return 'Informe um nome em português com até 120 caracteres.';
  if (message.includes('invalid_combat_technique_description')) return 'A descrição pode ter até 4.000 caracteres.';
  if (message.includes('invalid_combat_disciplines')) return 'Selecione ao menos uma disciplina válida.';
  if (message.includes('invalid_combat_technique_media_url')) return 'A mídia precisa usar uma URL HTTPS.';
  if (message.includes('combat_technique_not_found')) return 'Essa técnica não existe mais.';
  if (message.includes('staff_role_required')) return 'Seu perfil não tem permissão para alterar a biblioteca.';
  return 'Não foi possível concluir a operação.';
}
