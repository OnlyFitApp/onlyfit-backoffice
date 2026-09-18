import { supabase } from './supabase';

export type AppStoreCatalogState = {
  enabled: boolean;
  offering: { id: string; name: string; ios_price: number | null; currency: string };
  product: { product_id: string; status: string; apple_review_state: string | null; sync_reason?: string | null } | null;
  metadata: { description: string; review_notes: string; screenshot_path: string | null } | null;
  job: { id: string; operation: string; state: 'queued' | 'running' | 'succeeded' | 'blocked'; error_code: string | null; source_current: boolean } | null;
};
export type CatalogAction = 'status' | 'prepare' | 'configure' | 'submit' | 'sync' | 'publish';

export const catalogMessages: Record<string, string> = {
  app_store_catalog_disabled: 'A preparação automática ainda não foi ativada neste ambiente.',
  forbidden: 'Você não tem permissão para preparar esta oferta.',
  ios_price_not_configured: 'Configure o preço final para iPhone antes de preparar a oferta.',
  unsupported_offering: 'Este tipo de oferta ainda não está habilitado para preparação automática.',
  catalog_retry_later: 'Aguarde um minuto antes de tentar novamente.',
  offering_changed: 'A oferta mudou durante a preparação. Confira os dados e tente novamente.',
  existing_manual_mapping: 'Esta oferta já tem um produto vinculado manualmente. O vínculo foi preservado.',
  apple_display_name_too_long: 'A Apple aceita até 30 caracteres no nome exibido. A oferta original não foi alterada.',
  apple_api_403: 'A credencial Apple não tem permissão para esta operação.',
  apple_api_401: 'É necessário revisar a credencial Apple no servidor.',
  apple_app_mismatch: 'O aplicativo configurado na Apple não corresponde ao bundle da OnlyFit. Nenhum produto foi criado.',
  attempts_exhausted: 'As tentativas automáticas terminaram. Revise a configuração antes de tentar novamente.',
  catalog_metadata_required: 'Preencha os dados para análise da Apple.',
  catalog_job_active: 'Há uma operação em andamento. Aguarde a conclusão.',
  apple_review_screenshot_required: 'Anexe uma captura real da oferta no app para análise da Apple.',
  calculated_price_not_available_on_apple: 'O preço cheio calculado não corresponde a um preço da Apple. Ajuste a oferta; nenhum arredondamento foi aplicado.',
  apple_not_ready_to_submit: 'A Apple ainda não considera este produto pronto para envio. Confira os dados e a primeira submissão junto à versão do app.',
  apple_price_not_current: 'O preço vigente na Apple ainda não corresponde ao preço cheio da oferta.',
  apple_metadata_not_current: 'Os metadados na Apple precisam ser atualizados.',
  apple_territory_configuration_conflict: 'Confira a disponibilidade na Apple. O fluxo atual atende compras em BRL no Brasil.',
  invalid_apple_description: 'Use uma descrição entre 1 e 45 caracteres.',
  invalid_apple_review_notes: 'Preencha as instruções de análise (até 4.000 caracteres).',
  apple_app_version_required: 'O primeiro produto deste tipo exige uma nova versão do app disponível para envio. A revisão atual foi preservada.',
  apple_app_build_required: 'Vincule uma build válida à versão do app antes de enviar este produto.',
  apple_app_version_metadata_missing: 'Complete os metadados da versão do app antes de enviar.',
  apple_review_submission_has_other_items: 'Já existe um envio em preparação com outros itens. Revise o conjunto no App Store Connect; nada foi enviado automaticamente.',
  apple_review_in_progress: 'Este produto está em revisão na Apple. Aguarde a análise para alterar sua configuração; você pode atualizar o status.',
  ambiguous_apple_iap_version: 'Há mais de uma versão editável desta compra na Apple. Confira antes de reenviar.',
  ambiguous_apple_review_submission: 'Há mais de um envio em preparação na Apple. Confira antes de continuar.',
  invalid_access_duration: 'Confira a duração do acesso da oferta antes de preparar na Apple.',
  apple_product_type_conflict: 'O tipo cadastrado na Apple não corresponde à cobrança e ao prazo desta oferta.',
  apple_pricing_incomplete: 'A Apple ainda exige dados de preço antes de aceitar o envio.',
};

export async function appStoreCatalogCommand(offeringId: string, action: CatalogAction): Promise<AppStoreCatalogState> {
  const { data, error } = await supabase.functions.invoke('app-store-catalog', {
    body: { offering_id: offeringId, action },
  });
  if (error) {
    let code: string | undefined;
    if (error.context instanceof Response) {
      const body = await error.context.json().catch(() => null);
      if (typeof body?.error === 'string') code = body.error;
    }
    throw new Error(code && catalogMessages[code] ? catalogMessages[code] : 'Não foi possível consultar a preparação Apple. Verifique se o backend está disponível.');
  }
  if (!data?.offering?.id || typeof data.enabled !== 'boolean') throw new Error('Resposta inválida da preparação Apple.');
  return data as AppStoreCatalogState;
}

export async function saveCatalogMetadata(offeringId: string, description: string, notes: string, currentPath: string | null, file?: File) {
  let path = currentPath;
  if (file) {
    if (!['image/png', 'image/jpeg'].includes(file.type) || file.size > 5 * 1024 * 1024) throw new Error('Use PNG ou JPG de até 5 MB.');
    path = `${offeringId}/${crypto.randomUUID()}.${file.type === 'image/png' ? 'png' : 'jpg'}`;
    const upload = await supabase.storage.from('app-store-review').upload(path, file, { upsert: false, contentType: file.type });
    if (upload.error) throw new Error('Não foi possível enviar a captura. Verifique sua sessão e tente novamente.');
  }
  const { error } = await supabase.rpc('save_app_store_catalog_metadata', {
    p_offering_id: offeringId, p_description: description, p_review_notes: notes, p_screenshot_path: path,
  });
  if (error) throw new Error('Não foi possível salvar. Verifique sua sessão MFA e aguarde operações em andamento.');
}
