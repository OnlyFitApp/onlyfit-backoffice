import { supabase } from './supabase';

/**
 * O catálogo de protocolos da plataforma (F4 da jornada de templates).
 *
 * É a vitrine do My Fit: água, sono, jejum, suplementação, recuperação. Vivia
 * em três lugares — a tabela `myfit_protocol_templates`, um const no app
 * Flutter e um espelho em `protocol_templates` — e agora é dado mantido por
 * aqui, sem release de cliente.
 *
 * Não existe exclusão: a chave da entrada fica guardada em
 * `user_daily_protocols.template_key` de quem já segue o protocolo. Desativar
 * tira da vitrine e preserva o histórico.
 */
export type ProtocolFlow = 'water' | 'supplement' | 'generic';

export const protocolFlows: ReadonlyArray<{ value: ProtocolFlow; label: string; hint: string }> = [
  { value: 'generic', label: 'Etapas livres', hint: 'Etapas com horário, como sono e foco.' },
  { value: 'water', label: 'Meta de água', hint: 'Tela de hidratação, com meta em mililitros.' },
  { value: 'supplement', label: 'Suplementação', hint: 'Tela de itens, dose e lembrete.' },
];

export type ProtocolStep = {
  name: string;
  time: string;
  durationMinutes: number | null;
};

export type ProtocolCatalogEntry = {
  id: string;
  name: string;
  category: string;
  description: string;
  flow: ProtocolFlow;
  iconKey: string;
  structureLocked: boolean;
  clinicalNotice: boolean;
  featured: boolean;
  defaultSteps: ProtocolStep[];
  sortOrder: number;
  active: boolean;
  inUseCount: number;
  updatedAt: string | null;
};

export type ProtocolCatalogInput = {
  id: string;
  name: string;
  category: string;
  description: string;
  flow: ProtocolFlow;
  iconKey: string;
  structureLocked: boolean;
  clinicalNotice: boolean;
  featured: boolean;
  defaultSteps: ProtocolStep[];
  sortOrder: number;
  active: boolean;
};

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseStep(value: unknown): ProtocolStep {
  const row = record(value);
  const duration = Number(row.duration_minutes);
  return {
    name: String(row.name ?? ''),
    time: String(row.time ?? ''),
    durationMinutes: Number.isFinite(duration) && duration > 0 ? duration : null,
  };
}

function parse(value: unknown): ProtocolCatalogEntry {
  const row = record(value);
  const flow = row.flow === 'water' || row.flow === 'supplement' ? row.flow : 'generic';
  return {
    id: String(row.id ?? ''),
    name: String(row.name ?? ''),
    category: String(row.category ?? ''),
    description: String(row.description ?? ''),
    flow,
    iconKey: String(row.icon_key ?? ''),
    structureLocked: Boolean(row.structure_locked),
    clinicalNotice: Boolean(row.clinical_notice),
    featured: Boolean(row.featured),
    defaultSteps: Array.isArray(row.default_steps) ? row.default_steps.map(parseStep) : [],
    sortOrder: Number(row.sort_order) || 0,
    active: Boolean(row.active),
    inUseCount: Number(row.in_use_count) || 0,
    updatedAt: typeof row.updated_at === 'string' ? row.updated_at : null,
  };
}

function stepPayload(steps: ProtocolStep[]) {
  return steps
    .filter((step) => step.name.trim() && step.time.trim())
    .map((step) => ({
      name: step.name.trim(),
      time: step.time.trim(),
      ...(step.durationMinutes ? { duration_minutes: step.durationMinutes } : {}),
    }));
}

export async function listProtocolCatalog(): Promise<ProtocolCatalogEntry[]> {
  const { data, error } = await supabase.rpc('control_list_protocol_catalog');
  if (error) throw error;
  return Array.isArray(data) ? data.map(parse) : [];
}

export async function upsertProtocolCatalogEntry(input: ProtocolCatalogInput): Promise<string> {
  const { data, error } = await supabase.rpc('control_upsert_protocol_catalog_entry', {
    p_id: input.id.trim(),
    p_name: input.name.trim(),
    p_category: input.category.trim(),
    p_icon_key: input.iconKey.trim(),
    p_flow: input.flow,
    p_description: input.description.trim(),
    p_default_steps: stepPayload(input.defaultSteps),
    p_structure_locked: input.structureLocked,
    p_clinical_notice: input.clinicalNotice,
    p_sort_order: input.sortOrder,
    p_active: input.active,
    p_featured: input.featured,
  });
  if (error) throw error;
  return String(record(data).id ?? input.id);
}

export async function setProtocolCatalogEntryActive(input: {
  id: string;
  active: boolean;
}): Promise<void> {
  const { error } = await supabase.rpc('control_set_protocol_catalog_active', {
    p_id: input.id,
    p_active: input.active,
  });
  if (error) throw error;
}

export function protocolCatalogErrorMessage(error: unknown): string {
  const code = (error as { message?: string })?.message ?? '';
  if (code.includes('catalog_id_required')) return 'Informe a chave técnica da entrada.';
  if (code.includes('catalog_id_too_long')) return 'A chave técnica passa de 80 caracteres.';
  if (code.includes('catalog_name_required')) return 'O nome é obrigatório e vai até 120 caracteres.';
  if (code.includes('catalog_category_required')) return 'A categoria é obrigatória e vai até 80 caracteres.';
  if (code.includes('catalog_description_required')) return 'A descrição é obrigatória e vai até 240 caracteres.';
  if (code.includes('catalog_icon_required')) return 'Escolha um ícone.';
  if (code.includes('invalid_protocol_flow')) return 'Fluxo inválido.';
  if (code.includes('default_steps_must_be_array')) return 'As etapas padrão vieram em formato inválido.';
  if (code.includes('protocol_catalog_entry_not_found')) return 'Essa entrada não existe mais no catálogo.';
  if (code.includes('staff_role_required')) return 'Seu perfil não tem permissão para manter o catálogo.';
  return 'Não foi possível concluir a operação.';
}
