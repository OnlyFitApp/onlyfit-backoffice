import { coreApi } from '../api/core';
import type { StaffProtocolTemplateItem } from '../api/core.gen';
import { protocolIconKeys, type ProtocolIconKey } from './protocolIconCatalog';

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
export type ProtocolLocale = 'pt-BR' | 'pt-PT' | 'en';

export const protocolLocales: ReadonlyArray<{ value: ProtocolLocale; label: string }> = [
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'pt-PT', label: 'Português (Portugal)' },
  { value: 'en', label: 'English' },
];

export const protocolFlows: ReadonlyArray<{ value: ProtocolFlow; label: string; hint: string }> = [
  { value: 'generic', label: 'Etapas livres', hint: 'Etapas com horário, como sono e foco.' },
  { value: 'water', label: 'Meta de água', hint: 'Tela de hidratação, com meta em mililitros.' },
  { value: 'supplement', label: 'Suplementação', hint: 'Tela de itens, dose e lembrete.' },
];

export type ProtocolStep = {
  translations: ProtocolStepTranslation[];
  time: string;
  durationMinutes: number | null;
};

export type ProtocolTranslation = {
  locale: ProtocolLocale;
  name: string;
  category: string;
  description: string;
};

export type ProtocolStepTranslation = {
  locale: ProtocolLocale;
  name: string;
  instruction: string;
};

export type ProtocolCatalogEntry = {
  id: string;
  version: number;
  translations: ProtocolTranslation[];
  flow: ProtocolFlow;
  iconKey: ProtocolIconKey;
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
  expectedVersion: number | null;
  translations: ProtocolTranslation[];
  flow: ProtocolFlow;
  iconKey: ProtocolIconKey;
  structureLocked: boolean;
  clinicalNotice: boolean;
  featured: boolean;
  defaultSteps: ProtocolStep[];
  sortOrder: number;
  active: boolean;
};

const isProtocolLocale = (value: unknown): value is ProtocolLocale =>
  value === 'pt-BR' || value === 'pt-PT' || value === 'en';

const isProtocolIconKey = (value: string): value is ProtocolIconKey =>
  protocolIconKeys.some((key) => key === value);

function parseStepTranslation(value: {
  locale: string;
  name: string;
  instruction?: string | null;
}): ProtocolStepTranslation {
  if (!isProtocolLocale(value.locale)) throw new Error('staff.invalid_protocol_step_translation');
  return {
    locale: value.locale,
    name: value.name,
    instruction: value.instruction ?? '',
  };
}

function parseStep(value: StaffProtocolTemplateItem['data']['default_steps'][number]): ProtocolStep {
  return {
    translations: value.translations.map(parseStepTranslation),
    time: value.time ?? '',
    durationMinutes: value.duration_minutes,
  };
}

function parseTranslation(value: StaffProtocolTemplateItem['data']['translations'][number]): ProtocolTranslation {
  if (!isProtocolLocale(value.locale)) throw new Error('staff.invalid_protocol_translation');
  return {
    locale: value.locale,
    name: value.name,
    category: value.category,
    description: value.description,
  };
}

function parse(value: StaffProtocolTemplateItem): ProtocolCatalogEntry {
  const data = value.data;
  if (!isProtocolIconKey(data.icon_key)) {
    throw new Error('staff.invalid_protocol_template');
  }
  return {
    id: value.key,
    version: value.version,
    translations: data.translations.map(parseTranslation),
    flow: data.flow,
    iconKey: data.icon_key,
    structureLocked: data.structure_locked,
    clinicalNotice: data.clinical_notice,
    featured: data.featured,
    defaultSteps: data.default_steps.map(parseStep),
    sortOrder: value.position,
    active: value.active,
    inUseCount: value.impact.total_links,
    updatedAt: null,
  };
}

function stepPayload(steps: ProtocolStep[]) {
  return steps
    .map((step) => ({
      translations: step.translations.map((translation) => ({
        locale: translation.locale,
        name: translation.name.trim(),
        ...(translation.instruction.trim() ? { instruction: translation.instruction.trim() } : {}),
      })),
      time: step.time.trim() || null,
      duration_minutes: step.durationMinutes,
    }));
}

export async function listProtocolCatalog(): Promise<ProtocolCatalogEntry[]> {
  const catalog = await coreApi.staff.catalog({ kind: 'protocol_templates' });
  return catalog.items
    .filter((item): item is StaffProtocolTemplateItem => item.kind === 'protocol_templates')
    .map(parse);
}

export async function upsertProtocolCatalogEntry(input: ProtocolCatalogInput): Promise<string> {
  const saved = await coreApi.staff.catalogSave({ item: {
    kind: 'protocol_templates', key: input.id.trim(),
    label: protocolTranslation(input, 'pt-BR').name, public: true,
    position: input.sortOrder, expected_version: input.expectedVersion,
    data: {
      icon_key: input.iconKey,
      flow: input.flow,
      translations: input.translations.map((translation) => ({
        locale: translation.locale,
        name: translation.name.trim(),
        category: translation.category.trim(),
        description: translation.description.trim(),
      })),
      default_steps: stepPayload(input.defaultSteps),
      structure_locked: input.structureLocked,
      clinical_notice: input.clinicalNotice,
      featured: input.featured,
    },
  } });
  if (saved.kind !== 'protocol_templates') throw new Error('staff.invalid_protocol_template');
  if (saved.active !== input.active) {
    if (input.active) {
      await coreApi.staff.catalogActivate({
        kind: 'protocol_templates', key: saved.key, expectedVersion: saved.version,
      });
    } else {
      await coreApi.staff.catalogDeactivate({
        kind: 'protocol_templates', key: saved.key, expectedVersion: saved.version,
        confirmation: saved.data.label,
      });
    }
  }
  return saved.key;
}

export function protocolTranslation(
  input: Pick<ProtocolCatalogInput, 'translations'>,
  locale: ProtocolLocale,
): ProtocolTranslation {
  const translation = input.translations.find((item) => item.locale === locale);
  if (!translation) throw new Error('staff.invalid_protocol_translation');
  return translation;
}

export function protocolStepTranslation(step: ProtocolStep, locale: ProtocolLocale): ProtocolStepTranslation {
  const translation = step.translations.find((item) => item.locale === locale);
  if (!translation) throw new Error('staff.invalid_protocol_step_translation');
  return translation;
}

export async function setProtocolCatalogEntryActive(input: {
  id: string;
  active: boolean;
}): Promise<void> {
  const current = (await coreApi.staff.catalog({ kind: 'protocol_templates' })).items
    .find((item): item is StaffProtocolTemplateItem =>
      item.kind === 'protocol_templates' && item.key === input.id);
  if (!current) throw new Error('staff.catalog_item_not_found');
  if (current.active === input.active) return;
  if (input.active) {
    await coreApi.staff.catalogActivate({
      kind: 'protocol_templates', key: input.id, expectedVersion: current.version,
    });
  } else {
    await coreApi.staff.catalogDeactivate({
      kind: 'protocol_templates', key: input.id, expectedVersion: current.version,
      confirmation: current.data.label,
    });
  }
}

export function protocolCatalogErrorMessage(error: unknown): string {
  const code = (error as { message?: string })?.message ?? '';
  if (code.includes('staff.catalog_changed')) return 'Outra pessoa alterou este protocolo. Atualize a lista e reabra a edição.';
  if (code.includes('catalog_id_required')) return 'Informe a chave técnica da entrada.';
  if (code.includes('catalog_id_too_long')) return 'A chave técnica passa de 80 caracteres.';
  if (code.includes('catalog_name_required')) return 'O nome é obrigatório e vai até 120 caracteres.';
  if (code.includes('catalog_category_required')) return 'A categoria é obrigatória e vai até 80 caracteres.';
  if (code.includes('catalog_description_required')) return 'A descrição é obrigatória e vai até 240 caracteres.';
  if (code.includes('catalog_icon_required')) return 'Escolha um ícone.';
  if (code.includes('invalid_protocol_flow')) return 'Fluxo inválido.';
  if (code.includes('invalid_protocol_translation')) return 'Preencha nome, categoria e descrição nos três idiomas.';
  if (code.includes('invalid_protocol_step_translation')) return 'Preencha o nome de cada etapa nos três idiomas.';
  if (code.includes('invalid_protocol_step')) return 'Revise o horário, a duração e as traduções das etapas.';
  if (code.includes('default_steps_must_be_array')) return 'As etapas padrão vieram em formato inválido.';
  if (code.includes('protocol_catalog_entry_not_found')) return 'Essa entrada não existe mais no catálogo.';
  if (code.includes('staff_role_required')) return 'Seu perfil não tem permissão para manter o catálogo.';
  return 'Não foi possível concluir a operação.';
}
