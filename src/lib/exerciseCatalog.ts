import { supabase } from './supabase';

export type ExerciseCatalogEntry = {
  id: string;
  source: string;
  sourceId: string;
  namePtbr: string;
  nameEn: string;
  nameEs: string;
  instructionsPtbr: string;
  instructionsEn: string;
  instructionsEs: string;
  category: string;
  equipment: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  difficulty: string;
  force: string;
  mechanic: string;
  grips: string[];
  videoUrl: string;
  thumbUrl: string;
  mediaStatus: string;
  mediaLastError: string;
  sports: string[];
  active: boolean;
  inUseCount: number;
  updatedAt: string | null;
};

export type ExerciseCatalogInput = Omit<
  ExerciseCatalogEntry,
  'source' | 'sourceId' | 'mediaStatus' | 'mediaLastError' | 'inUseCount' | 'updatedAt'
>;

export type ExerciseCatalogFilters = {
  search: string;
  active: boolean | null;
  sport: string | null;
  limit: number;
  offset: number;
};

export type ExerciseCatalogPage = {
  items: ExerciseCatalogEntry[];
  total: number;
};

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}

function parseEntry(value: unknown): ExerciseCatalogEntry {
  const row = record(value);
  return {
    id: String(row.id ?? ''),
    source: String(row.source ?? ''),
    sourceId: String(row.source_id ?? ''),
    namePtbr: String(row.name_ptbr ?? ''),
    nameEn: String(row.name_en ?? ''),
    nameEs: String(row.name_es ?? ''),
    instructionsPtbr: String(row.instructions_ptbr ?? ''),
    instructionsEn: String(row.instructions_en ?? ''),
    instructionsEs: String(row.instructions_es ?? ''),
    category: String(row.category ?? ''),
    equipment: String(row.equipment ?? ''),
    primaryMuscles: strings(row.primary_muscles),
    secondaryMuscles: strings(row.secondary_muscles),
    difficulty: String(row.difficulty ?? ''),
    force: String(row.force ?? ''),
    mechanic: String(row.mechanic ?? ''),
    grips: strings(row.grips),
    videoUrl: String(row.video_url ?? ''),
    thumbUrl: String(row.thumb_url ?? ''),
    mediaStatus: String(row.media_status ?? ''),
    mediaLastError: String(row.media_last_error ?? ''),
    sports: strings(row.sports),
    active: Boolean(row.active),
    inUseCount: Number(row.in_use_count) || 0,
    updatedAt: typeof row.updated_at === 'string' ? row.updated_at : null,
  };
}

export async function listExerciseCatalog(filters: ExerciseCatalogFilters): Promise<ExerciseCatalogPage> {
  const { data, error } = await supabase.rpc('control_list_exercise_catalog', {
    p_search: filters.search.trim() || null,
    p_active: filters.active,
    p_sport: filters.sport,
    p_limit: filters.limit,
    p_offset: filters.offset,
  });
  if (error) throw error;
  const payload = record(data);
  return {
    items: Array.isArray(payload.items) ? payload.items.map(parseEntry) : [],
    total: Number(payload.total) || 0,
  };
}

export async function upsertExerciseCatalogEntry(input: ExerciseCatalogInput): Promise<string> {
  const { data, error } = await supabase.rpc('control_upsert_exercise_catalog_entry', {
    p_entry: {
      id: input.id || null,
      name_ptbr: input.namePtbr.trim(),
      name_en: input.nameEn.trim(),
      name_es: input.nameEs.trim() || null,
      instructions_ptbr: input.instructionsPtbr.trim() || null,
      instructions_en: input.instructionsEn.trim() || null,
      instructions_es: input.instructionsEs.trim() || null,
      category: input.category.trim() || null,
      equipment: input.equipment.trim() || null,
      primary_muscles: input.primaryMuscles,
      secondary_muscles: input.secondaryMuscles,
      difficulty: input.difficulty.trim() || null,
      force: input.force.trim() || null,
      mechanic: input.mechanic.trim() || null,
      grips: input.grips,
      video_url: input.videoUrl.trim() || null,
      thumb_url: input.thumbUrl.trim() || null,
      sports: input.sports,
      active: input.active,
    },
  });
  if (error) throw error;
  return String(record(data).id ?? input.id);
}

export async function setExerciseCatalogActive(input: { id: string; active: boolean }): Promise<void> {
  const { error } = await supabase.rpc('control_set_exercise_catalog_active', {
    p_id: input.id,
    p_active: input.active,
  });
  if (error) throw error;
}

export function exerciseCatalogErrorMessage(error: unknown): string {
  const message = (error as { message?: string })?.message ?? '';
  if (message.includes('invalid_exercise_name')) return 'Preencha os nomes em português e inglês com até 120 caracteres.';
  if (message.includes('invalid_exercise_instructions')) return 'Cada instrução pode ter até 10.000 caracteres.';
  if (message.includes('invalid_exercise_media_url')) return 'A mídia precisa usar uma URL HTTPS.';
  if (message.includes('invalid_exercise_sports')) return 'Selecione Força, CrossFit ou os dois.';
  if (message.includes('too_many_exercise_tags')) return 'Cada grupo aceita até 20 itens.';
  if (message.includes('exercise_not_found')) return 'Esse exercício não existe mais.';
  if (message.includes('staff_role_required')) return 'Seu perfil não tem permissão para alterar a biblioteca.';
  return 'Não foi possível concluir a operação.';
}
