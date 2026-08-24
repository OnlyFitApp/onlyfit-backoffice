import { supabase } from './supabase';

export type CombatTechnique = {
  id: string;
  namePtbr: string;
  nameEn: string;
  nameEs: string;
  descriptionPtbr: string;
  techniqueType: 'attack' | 'defense';
  distance: 'long' | 'mid' | 'close' | 'clinch' | 'ground';
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

const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};

function parseTechnique(value: unknown): CombatTechnique {
  const row = record(value);
  return {
    id: String(row.id ?? ''),
    namePtbr: String(row.name_ptbr ?? ''),
    nameEn: String(row.name_en ?? ''),
    nameEs: String(row.name_es ?? ''),
    descriptionPtbr: String(row.description_ptbr ?? ''),
    techniqueType: row.technique_type === 'defense' ? 'defense' : 'attack',
    distance: ['long', 'mid', 'close', 'clinch', 'ground'].includes(String(row.distance))
      ? row.distance as CombatTechnique['distance']
      : 'mid',
    disciplines: Array.isArray(row.disciplines) ? row.disciplines.map(String) : [],
    videoUrl: String(row.video_url ?? ''),
    thumbUrl: String(row.thumb_url ?? ''),
    active: Boolean(row.active),
    inUseCount: Number(row.in_use_count) || 0,
  };
}

export async function listCombatTechniques(filters: CombatTechniqueFilters) {
  const { data, error } = await supabase.rpc('control_list_combat_techniques', {
    p_search: filters.search.trim() || null,
    p_active: filters.active,
    p_discipline: filters.discipline,
    p_technique_type: filters.techniqueType,
    p_distance: filters.distance,
    p_limit: filters.limit,
    p_offset: filters.offset,
  });
  if (error) throw error;
  const payload = record(data);
  return {
    items: Array.isArray(payload.items) ? payload.items.map(parseTechnique) : [],
    total: Number(payload.total) || 0,
  };
}

export async function upsertCombatTechnique(input: CombatTechniqueInput): Promise<string> {
  const { data, error } = await supabase.rpc('control_upsert_combat_technique', {
    p_entry: {
      id: input.id || null,
      name_ptbr: input.namePtbr.trim(),
      name_en: input.nameEn.trim() || null,
      name_es: input.nameEs.trim() || null,
      description_ptbr: input.descriptionPtbr.trim() || null,
      technique_type: input.techniqueType,
      distance: input.distance,
      disciplines: input.disciplines,
      video_url: input.videoUrl.trim() || null,
      thumb_url: input.thumbUrl.trim() || null,
      active: input.active,
    },
  });
  if (error) throw error;
  return String(record(data).id ?? input.id);
}

export async function setCombatTechniqueActive(input: { id: string; active: boolean }): Promise<void> {
  const { error } = await supabase.rpc('control_set_combat_technique_active', {
    p_id: input.id,
    p_active: input.active,
  });
  if (error) throw error;
}

export function combatTechniqueErrorMessage(error: unknown): string {
  const message = (error as { message?: string })?.message ?? '';
  if (message.includes('invalid_combat_technique_name')) return 'Informe um nome em português com até 120 caracteres.';
  if (message.includes('invalid_combat_technique_description')) return 'A descrição pode ter até 4.000 caracteres.';
  if (message.includes('invalid_combat_disciplines')) return 'Selecione ao menos uma disciplina válida.';
  if (message.includes('invalid_combat_technique_media_url')) return 'A mídia precisa usar uma URL HTTPS.';
  if (message.includes('combat_technique_not_found')) return 'Essa técnica não existe mais.';
  if (message.includes('staff_role_required')) return 'Seu perfil não tem permissão para alterar a biblioteca.';
  return 'Não foi possível concluir a operação.';
}
