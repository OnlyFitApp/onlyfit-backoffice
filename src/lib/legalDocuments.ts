import { supabase } from './supabase';

export type LegalDocumentKind = 'acceptance' | 'notice' | 'declaration';

/**
 * A jornada que exige o documento. É ela que o produto consulta: o cadastro
 * pede os documentos de `signup`, e não uma lista de chaves fixa no código.
 * Documento sem jornada não entra em fluxo nenhum e continua apenas na central
 * de Privacidade e Termos.
 */
export const LEGAL_JOURNEYS = [
  { value: 'signup', label: 'Cadastro' },
  { value: 'consultancy_hire', label: 'Contratação de consultoria' },
  { value: 'become_professional', label: 'Tornar-me profissional' },
  { value: 'account_deletion', label: 'Exclusão de conta' },
] as const;

export type LegalDocumentJourney = (typeof LEGAL_JOURNEYS)[number]['value'];

export function legalJourneyLabel(value: string | null): string {
  return LEGAL_JOURNEYS.find((entry) => entry.value === value)?.label ?? 'Nenhuma';
}

/**
 * Os documentos legais que a plataforma reconhece. A chave é PK em
 * `legal_documents`: existe um único documento vigente por chave, global, sem
 * variação por profissional, organização ou oferta. Publicar uma versão nova
 * reabre o aceite de quem já tinha aceitado a anterior.
 *
 * Os padrões abaixo espelham o que está publicado em produção; o de
 * `service_terms` vem do G02 §2.2, que ainda aguarda o PDF do advogado.
 */
export const LEGAL_DOCUMENT_CATALOG = [
  {
    key: 'terms_of_use',
    name: 'Termos de Uso',
    summary: 'Regras gerais da plataforma. Aceito no cadastro, por todas as contas.',
    kind: 'acceptance' as LegalDocumentKind,
    title: 'Termos de Uso',
    description:
      'Regras gerais da plataforma, comunidade, conteúdo, responsabilidades, suspensão de conta e limitações do serviço.',
    acceptanceText: 'Li e aceito os Termos de Uso da OnlyFit.',
    actionLabel: 'Registrar aceite',
    isRequired: true,
    sortOrder: 10,
  },
  {
    key: 'privacy_notice',
    name: 'Política de Privacidade',
    summary: 'Tratamento de dados pessoais e de saúde. Apresentada no cadastro para ciência.',
    kind: 'notice' as LegalDocumentKind,
    title: 'Política de Privacidade',
    description:
      'Como a OnlyFit trata dados pessoais, dados de saúde e fitness, compartilhamentos, prazos e direitos do titular.',
    acceptanceText: 'Declaro que li e estou ciente da Política de Privacidade da OnlyFit.',
    actionLabel: 'Registrar ciência',
    isRequired: true,
    sortOrder: 20,
  },
  {
    key: 'age_declaration',
    name: 'Declaração de idade',
    summary: 'Confirmação de 16 anos ou mais para criar e manter conta. Declarada no cadastro.',
    kind: 'declaration' as LegalDocumentKind,
    title: 'Declaração de idade',
    description: 'Confirmação obrigatória de idade mínima para criar e manter uma conta OnlyFit.',
    acceptanceText: 'Declaro que tenho 16 anos ou mais.',
    actionLabel: 'Confirmar declaração',
    isRequired: true,
    sortOrder: 30,
  },
  {
    key: 'service_terms',
    name: 'Condições de prestação de serviço',
    summary:
      'Aceito na contratação de uma consultoria, junto do escopo de acesso aos dados. Sem ele ativo, nenhum contrato de consultoria abre.',
    kind: 'acceptance' as LegalDocumentKind,
    title: 'Condições de prestação de serviço',
    description:
      'Condições em que o profissional atende o membro: obrigações das duas partes, encerramento sem reembolso, retenção do termo e exclusão de conta.',
    acceptanceText: 'Li e aceito as condições de prestação de serviço.',
    actionLabel: 'Registrar aceite',
    isRequired: true,
    sortOrder: 40,
  },
  {
    key: 'operational_data_consent',
    name: 'Consentimento para dados operacionais',
    summary:
      'Apresentado na contratação de consultoria quando a oferta solicita acesso a Treino, Nutrição ou Protocolos.',
    kind: 'acceptance' as LegalDocumentKind,
    title: 'Consentimento para dados operacionais',
    description:
      'Documento de consentimento específico para os dados operacionais declarados na oferta de consultoria.',
    // O texto exibido para aceite e o PDF são fornecidos ou aprovados pelo jurídico.
    acceptanceText: '',
    actionLabel: 'Registrar consentimento',
    isRequired: true,
    sortOrder: 50,
  },
  {
    key: 'health_data_consent',
    name: 'Consentimento para dados de saúde',
    summary:
      'Apresentado na contratação de consultoria quando a oferta solicita tratamento ou compartilhamento de dados de saúde.',
    kind: 'acceptance' as LegalDocumentKind,
    title: 'Consentimento para dados de saúde',
    description:
      'Documento de consentimento específico para o tratamento e o compartilhamento de dados de saúde declarados na oferta.',
    // O texto exibido para aceite e o PDF são fornecidos ou aprovados pelo jurídico.
    acceptanceText: '',
    actionLabel: 'Registrar consentimento',
    isRequired: true,
    sortOrder: 60,
  },
  {
    key: 'physical_activity_risk_acknowledgement',
    name: 'Declaração de ciência dos riscos da atividade física',
    summary:
      'Apresentada na contratação de consultoria quando a oferta envolver atividade física.',
    kind: 'declaration' as LegalDocumentKind,
    title: 'Declaração de ciência dos riscos da atividade física',
    description:
      'Documento de declaração de ciência dos riscos aplicáveis à atividade física prevista na oferta de consultoria.',
    // O texto exibido para aceite e o PDF são fornecidos ou aprovados pelo jurídico.
    acceptanceText: '',
    actionLabel: 'Registrar declaração',
    isRequired: true,
    sortOrder: 70,
  },
] as const;

export type LegalDocumentCatalogEntry = (typeof LEGAL_DOCUMENT_CATALOG)[number];
export type LegalDocumentKey = LegalDocumentCatalogEntry['key'];

export function legalDocumentCatalogEntry(key: string): LegalDocumentCatalogEntry | undefined {
  return LEGAL_DOCUMENT_CATALOG.find((entry) => entry.key === key);
}

/** O nome claro do documento, para telas. Chave desconhecida cai na própria chave. */
export function legalDocumentName(key: string): string {
  return legalDocumentCatalogEntry(key)?.name ?? key;
}

export type LegalDocumentVersion = {
  key: string;
  version: string;
  kind: LegalDocumentKind;
  title: string;
  description: string;
  pdfUrl: string;
  acceptanceText: string;
  actionLabel: string;
  isRequired: boolean;
  sortOrder: number;
  journey: string | null;
  publishedAt: string;
  isCurrent: boolean;
  isActive: boolean;
  acceptedCount: number;
  eligibleCount: number;
  pendingCount: number;
};

export type PublishLegalDocumentInput = {
  key: string;
  version: string;
  kind: LegalDocumentKind;
  title: string;
  description: string;
  acceptanceText: string;
  actionLabel: string;
  isRequired: boolean;
  sortOrder: number;
  activate: boolean;
  file: File;
};

const text = (value: unknown) => value?.toString() ?? '';
const number = (value: unknown) => Number.isFinite(Number(value)) ? Number(value) : 0;

export async function listLegalDocuments(): Promise<LegalDocumentVersion[]> {
  const { data, error } = await supabase.rpc('control_list_legal_documents');
  if (error) throw error;
  const rows = Array.isArray(data) ? data : [];
  return rows.map((raw) => {
    const row = raw as Record<string, unknown>;
    return {
      key: text(row.key), version: text(row.version), kind: text(row.kind) as LegalDocumentKind,
      title: text(row.title), description: text(row.description), pdfUrl: text(row.pdf_url),
      acceptanceText: text(row.acceptance_text), actionLabel: text(row.action_label),
      isRequired: row.is_required === true, sortOrder: number(row.sort_order),
      journey: row.journey == null ? null : text(row.journey) || null,
      publishedAt: text(row.published_at), isCurrent: row.is_current === true,
      isActive: row.is_active === true, acceptedCount: number(row.accepted_count),
      eligibleCount: number(row.eligible_count), pendingCount: number(row.pending_count),
    };
  });
}

export async function publishLegalDocument(input: PublishLegalDocumentInput): Promise<void> {
  if (input.file.type !== 'application/pdf') throw new Error('pdf_required');
  const key = input.key.trim().toLowerCase();
  const version = input.version.trim();
  const safeName = input.file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, '-');
  const path = `${version}/${key}-${Date.now()}-${safeName}`;
  const upload = await supabase.storage.from('legal-documents').upload(path, input.file, {
    contentType: 'application/pdf', upsert: false,
  });
  if (upload.error) throw upload.error;
  const { data: publicUrl } = supabase.storage.from('legal-documents').getPublicUrl(path);
  const { error } = await supabase.rpc('control_publish_legal_document', {
    p_key: key,
    p_version: version,
    p_kind: input.kind,
    p_title: input.title.trim(),
    p_description: input.description.trim(),
    p_pdf_url: publicUrl.publicUrl,
    p_acceptance_text: input.acceptanceText.trim(),
    p_action_label: input.actionLabel.trim(),
    p_is_required: input.isRequired,
    p_sort_order: input.sortOrder,
    p_activate: input.activate,
  });
  if (error) throw error;
}

/** A jornada é ato próprio: publicar versão nova não mexe nela. */
export async function setLegalDocumentJourney(
  key: string,
  journey: LegalDocumentJourney | null,
): Promise<void> {
  const { error } = await supabase.rpc('control_set_legal_document_journey', {
    p_key: key,
    p_journey: journey,
  });
  if (error) throw error;
}

export async function setLegalDocumentActive(key: string, active: boolean): Promise<void> {
  const { error } = await supabase.rpc('control_set_legal_document_active', {
    p_key: key,
    p_active: active,
  });
  if (error) throw error;
}
