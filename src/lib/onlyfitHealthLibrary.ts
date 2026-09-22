import { supabase } from './supabase';

export type LibraryKind = 'workouts' | 'programs' | 'diets';
export type LibraryPage<T> = { items: T[]; total: number };

export type WorkoutCatalogItem = {
  id: string; catalogKey: string; version: number; title: string; description: string;
  modality: string; level: string; active: boolean; featured: boolean; sortOrder: number;
  updatedAt: string | null; prescription: Record<string, unknown>; exercises: Array<Record<string, unknown>>;
};
export type DietCatalogItem = {
  id: string; catalogKey: string; version: number; name: string; title: string; description: string;
  objective: string; targetCalories: number | null; targetProteinG: number | null;
  targetCarbsG: number | null; targetFatsG: number | null; active: boolean; featured: boolean;
  sortOrder: number; updatedAt: string | null; meals: Array<Record<string, unknown>>;
};
export type ProgramCatalogItem = {
  id: string; slug: string; version: number; sport: string; name: string; goal: string;
  level: string; durationWeeks: number; coverUrl: string; description: string;
  weeklySessions: number | null; estMinutesPerWeek: number | null; equipment: string[];
  sortOrder: number; active: boolean; enrollmentCount: number;
  weeks: Array<Record<string, unknown>>; sessions: Array<Record<string, unknown>>;
};

export type WorkoutInput = Omit<WorkoutCatalogItem, 'id' | 'version' | 'updatedAt'> & { sourceId?: string };
export type DietInput = Omit<DietCatalogItem, 'id' | 'version' | 'updatedAt'> & { sourceId?: string };
export type ProgramInput = Omit<ProgramCatalogItem, 'id' | 'version' | 'enrollmentCount'> & { sourceId?: string };

function object(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}
function array(value: unknown): Array<Record<string, unknown>> {
  return Array.isArray(value) ? value.map(object) : [];
}
function numberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
function page<T>(data: unknown, parse: (value: unknown) => T): LibraryPage<T> {
  const row = object(data);
  return { items: Array.isArray(row.items) ? row.items.map(parse) : [], total: Number(row.total) || 0 };
}

const parseWorkout = (value: unknown): WorkoutCatalogItem => {
  const row = object(value);
  return { id: String(row.id ?? ''), catalogKey: String(row.catalog_key ?? ''), version: Number(row.version) || 1,
    title: String(row.title ?? ''), description: String(row.description ?? ''), modality: String(row.modality ?? ''),
    level: String(row.level ?? 'beginner'), active: Boolean(row.active), featured: Boolean(row.featured),
    sortOrder: Number(row.sort_order) || 0, updatedAt: typeof row.updated_at === 'string' ? row.updated_at : null,
    prescription: object(row.prescription), exercises: array(row.exercises) };
};
const parseDiet = (value: unknown): DietCatalogItem => {
  const row = object(value);
  return { id: String(row.id ?? ''), catalogKey: String(row.catalog_key ?? ''), version: Number(row.version) || 1,
    name: String(row.name ?? ''), title: String(row.title ?? ''), description: String(row.description ?? ''),
    objective: String(row.objective ?? ''), targetCalories: numberOrNull(row.target_calories), targetProteinG: numberOrNull(row.target_protein_g),
    targetCarbsG: numberOrNull(row.target_carbs_g), targetFatsG: numberOrNull(row.target_fats_g), active: Boolean(row.active),
    featured: Boolean(row.featured), sortOrder: Number(row.sort_order) || 0,
    updatedAt: typeof row.updated_at === 'string' ? row.updated_at : null, meals: array(row.meals) };
};
const parseProgram = (value: unknown): ProgramCatalogItem => {
  const row = object(value);
  return { id: String(row.id ?? ''), slug: String(row.slug ?? ''), version: Number(row.version) || 1,
    sport: String(row.sport ?? ''), name: String(row.name ?? ''), goal: String(row.goal ?? ''),
    level: String(row.level ?? 'beginner'), durationWeeks: Number(row.duration_weeks) || 1,
    coverUrl: String(row.cover_url ?? ''), description: String(row.description ?? ''),
    weeklySessions: numberOrNull(row.weekly_sessions), estMinutesPerWeek: numberOrNull(row.est_minutes_per_week),
    equipment: Array.isArray(row.equipment) ? row.equipment.map(String) : [], sortOrder: Number(row.sort_order) || 0,
    active: Boolean(row.active), enrollmentCount: Number(row.enrollment_count) || 0,
    weeks: array(row.weeks), sessions: array(row.sessions) };
};

export async function listWorkouts(filters: { search?: string; modality?: string; active?: boolean; limit?: number; offset?: number } = {}) {
  const { data, error } = await supabase.rpc('control_list_onlyfit_health_workouts', {
    p_search: filters.search || null, p_modality: filters.modality || null, p_active: filters.active ?? null,
    p_limit: filters.limit ?? 50, p_offset: filters.offset ?? 0,
  });
  if (error) throw error;
  return page(data, parseWorkout);
}
export async function listDiets(filters: { search?: string; active?: boolean; limit?: number; offset?: number } = {}) {
  const { data, error } = await supabase.rpc('control_list_onlyfit_health_diets', {
    p_search: filters.search || null, p_active: filters.active ?? null, p_limit: filters.limit ?? 50, p_offset: filters.offset ?? 0,
  });
  if (error) throw error;
  return page(data, parseDiet);
}
export async function listPrograms(filters: { search?: string; sport?: string; active?: boolean; limit?: number; offset?: number } = {}) {
  const { data, error } = await supabase.rpc('control_list_onlyfit_health_programs', {
    p_search: filters.search || null, p_sport: filters.sport || null, p_active: filters.active ?? null,
    p_limit: filters.limit ?? 50, p_offset: filters.offset ?? 0,
  });
  if (error) throw error;
  return page(data, parseProgram);
}

function workoutPayload(input: WorkoutInput) {
  return { ...(input.sourceId ? { source_id: input.sourceId } : {}), catalog_key: input.catalogKey,
    title: input.title, description: input.description, modality: input.modality, level: input.level,
    active: input.active, featured: input.featured, sort_order: input.sortOrder,
    prescription: input.prescription, exercises: input.exercises };
}
function dietPayload(input: DietInput) {
  return { ...(input.sourceId ? { source_id: input.sourceId } : {}), catalog_key: input.catalogKey,
    name: input.name, title: input.title, description: input.description, objective: input.objective,
    target_calories: input.targetCalories, target_protein_g: input.targetProteinG,
    target_carbs_g: input.targetCarbsG, target_fats_g: input.targetFatsG,
    active: input.active, featured: input.featured, sort_order: input.sortOrder, meals: input.meals };
}
function programPayload(input: ProgramInput) {
  return { ...(input.sourceId ? { source_id: input.sourceId } : {}), slug: input.slug, sport: input.sport,
    name: input.name, goal: input.goal, level: input.level, duration_weeks: input.durationWeeks,
    cover_url: input.coverUrl, description: input.description, weekly_sessions: input.weeklySessions,
    est_minutes_per_week: input.estMinutesPerWeek, equipment: input.equipment, sort_order: input.sortOrder,
    active: input.active, weeks: input.weeks, sessions: input.sessions };
}

export async function saveWorkout(input: WorkoutInput) { const { data,error }=await supabase.rpc('control_upsert_onlyfit_health_workout',{p_payload:workoutPayload(input)}); if(error) throw error; return data; }
export async function saveDiet(input: DietInput) { const { data,error }=await supabase.rpc('control_upsert_onlyfit_health_diet',{p_payload:dietPayload(input)}); if(error) throw error; return data; }
export async function saveProgram(input: ProgramInput) { const { data,error }=await supabase.rpc('control_upsert_onlyfit_health_program',{p_payload:programPayload(input)}); if(error) throw error; return data; }
export async function setLibraryItemActive(kind: LibraryKind,id:string,active:boolean) {
  const rpc = kind === 'workouts' ? 'control_set_onlyfit_health_workout_active' : kind === 'diets' ? 'control_set_onlyfit_health_diet_active' : 'control_set_onlyfit_health_program_active';
  const params = kind === 'workouts' ? {p_workout_id:id,p_active:active} : kind === 'diets' ? {p_template_id:id,p_active:active} : {p_program_id:id,p_active:active};
  const { error } = await supabase.rpc(rpc, params); if (error) throw error;
}

export function libraryErrorMessage(error: unknown) {
  const code = (error as {message?:string})?.message ?? '';
  const map: Array<[string,string]> = [
    ['staff_role_required','Seu perfil não tem permissão para manter a biblioteca.'],
    ['onlyfit_health_curator_missing','A identidade institucional da OnlyFit Health ainda não está configurada.'],
    ['invalid_catalog_key','A chave técnica deve usar letras minúsculas, números, dois-pontos, hífen ou sublinhado.'],
    ['invalid_workout_title','Informe um título de treino entre 3 e 120 caracteres.'],
    ['invalid_workout_modality','A modalidade selecionada não é suportada.'],
    ['strength_workout_requires_exercises','Treinos de musculação precisam ter pelo menos um exercício.'],
    ['invalid_workout_prescription','O contrato da prescrição é inválido ou grande demais.'],
    ['invalid_diet_meals','A dieta precisa ter entre 1 e 20 refeições.'],
    ['invalid_diet_meal_items','Cada refeição precisa ter entre 1 e 30 alimentos.'],
    ['diet_food_required','Cada item da dieta precisa indicar um alimento ou nome personalizado.'],
    ['invalid_program_structure','O programa precisa ter uma semana para cada semana de duração e pelo menos uma sessão.'],
    ['invalid_program_session','Revise a semana e o dia das sessões.'],
    ['program_session_workout_required','Programas publicados de musculação, CrossFit e HYROX exigem um treino oficial em cada sessão.'],
    ['program_session_workout_not_available','Uma sessão aponta para um treino que não está publicado na biblioteca OnlyFit Health ou pertence a outra modalidade.'],
    ['invalid_program_session_workout','Revise o identificador do treino vinculado à sessão.'],
    ['newer_workout_version_active','Existe uma versão mais nova ativa desse treino.'],
    ['newer_diet_version_active','Existe uma versão mais nova ativa dessa dieta.'],
    ['newer_program_version_active','Existe uma versão mais nova ativa desse programa.'],
  ];
  return map.find(([key])=>code.includes(key))?.[1] ?? 'Não foi possível concluir a operação. Revise os campos e tente novamente.';
}
