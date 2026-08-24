import { supabase } from './supabase';

/**
 * O vocabulário de sessão de treino (F5.b da jornada de templates).
 *
 * Leve, longão, tiros, sweet spot, brick, metcon, push/pull/legs: era constante
 * no portal e array em cada builder, então tipo novo — ou esporte novo — exigia
 * release. Agora é `public.sport_session_types`, mantida por aqui.
 *
 * `sports` vazio significa **aparece em todo esporte**, que é como descanso e
 * mobilidade funcionam nos builders. Não existe exclusão: a chave fica gravada
 * nas sessões já montadas, e desativar tira só da escolha de sessão nova.
 */
export type SessionType = {
  key: string;
  label: string;
  iconKey: string;
  sports: string[];
  sortOrder: number;
  active: boolean;
  inUseCount: number;
  updatedAt: string | null;
};

export type SessionTypeInput = {
  key: string;
  label: string;
  iconKey: string;
  sports: string[];
  sortOrder: number;
  active: boolean;
};

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parse(value: unknown): SessionType {
  const row = record(value);
  return {
    key: String(row.key ?? ''),
    label: String(row.label ?? ''),
    iconKey: String(row.icon_key ?? ''),
    sports: Array.isArray(row.sports) ? row.sports.map((sport) => String(sport)) : [],
    sortOrder: Number(row.sort_order) || 0,
    active: Boolean(row.active),
    inUseCount: Number(row.in_use_count) || 0,
    updatedAt: typeof row.updated_at === 'string' ? row.updated_at : null,
  };
}

export async function listSessionTypes(): Promise<SessionType[]> {
  const { data, error } = await supabase.rpc('control_list_session_types');
  if (error) throw error;
  return Array.isArray(data) ? data.map(parse) : [];
}

export async function upsertSessionType(input: SessionTypeInput): Promise<string> {
  const { data, error } = await supabase.rpc('control_upsert_session_type', {
    p_key: input.key.trim().toLowerCase(),
    p_label: input.label.trim(),
    p_icon_key: input.iconKey.trim(),
    p_sports: input.sports,
    p_sort_order: input.sortOrder,
    p_active: input.active,
  });
  if (error) throw error;
  return String(record(data).key ?? input.key);
}

export async function setSessionTypeActive(input: { key: string; active: boolean }): Promise<void> {
  const { error } = await supabase.rpc('control_set_session_type_active', {
    p_key: input.key,
    p_active: input.active,
  });
  if (error) throw error;
}

export function sessionTypeErrorMessage(error: unknown): string {
  const code = (error as { message?: string })?.message ?? '';
  if (code.includes('invalid_session_type_key')) {
    return 'A chave aceita só letras minúsculas, números e _, começando por letra.';
  }
  if (code.includes('invalid_session_type_label')) return 'O rótulo é obrigatório e vai até 60 caracteres.';
  if (code.includes('invalid_session_type_icon')) return 'Escolha um ícone.';
  if (code.includes('too_many_sports')) return 'São no máximo 20 esportes por tipo.';
  if (code.includes('session_type_not_found')) return 'Esse tipo de sessão não existe mais.';
  if (code.includes('staff_role_required')) return 'Seu perfil não tem permissão para manter os tipos de sessão.';
  return 'Não foi possível concluir a operação.';
}
