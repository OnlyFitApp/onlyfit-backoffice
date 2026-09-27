import { coreApi } from '../api/core';
import type { StaffAppStoreCatalogItem, StaffAppStoreMetadataInput } from '../api/core.gen';

export type AppStoreCatalogState = StaffAppStoreCatalogItem;
export type CatalogAction = 'prepare' | 'sync' | 'publish';
export type CatalogMetadataDraft = Omit<StaffAppStoreMetadataInput, 'screenshot_file_id'>;

export const catalogMessages: Record<string, string> = {
  app_store_catalog_disabled: 'A preparação automática ainda não foi ativada neste ambiente.',
  forbidden: 'Você não tem permissão para preparar esta oferta.',
  ios_price_not_configured: 'Configure o preço final para iPhone antes de preparar a oferta.',
  unsupported_offering: 'Este tipo de oferta ainda não está habilitado para preparação automática.',
  catalog_retry_later: 'Aguarde um minuto antes de tentar novamente.',
  offering_changed: 'A oferta mudou durante a preparação. Confira os dados e tente novamente.',
  catalog_metadata_required: 'Preencha os dados para análise da Apple.',
  catalog_job_active: 'Há uma operação em andamento. Aguarde a conclusão.',
  apple_review_screenshot_required: 'Anexe uma captura real da oferta no app para análise da Apple.',
  'staff.app_store_product_not_approved': 'A Apple ainda não aprovou este produto para venda.',
};

export async function getAppStoreCatalogItem(offeringId: string): Promise<AppStoreCatalogState> {
  const page = await coreApi.staff.appStoreCatalog({ limit: 200, offset: 0 });
  const item = page.items.find((candidate) => candidate.offering.id === offeringId);
  if (!item) throw new Error('A oferta não está disponível no catálogo Apple.');
  return item;
}

export function appStoreCatalogCommand(item: AppStoreCatalogState, action: CatalogAction) {
  return coreApi.staff.appStoreCatalogAct({
    offerId: item.offering.id,
    action,
    metadata: null,
    expectedVersion: item.version,
    idempotencyKey: crypto.randomUUID(),
  });
}

async function uploadReviewImage(file: File): Promise<string> {
  if (file.type !== 'image/png' && file.type !== 'image/jpeg') throw new Error('Use uma imagem PNG ou JPG.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Use uma imagem de até 5 MB.');
  const requestId = crypto.randomUUID();
  const pending = await coreApi.staff.appStoreReviewUpload({
    upload: { action: 'prepare', request_id: requestId, filename: file.name, mime: file.type, bytes: file.size },
  });
  if (pending.status !== 'pending') throw new Error('O envio da captura não foi preparado.');
  const response = await fetch(pending.upload_url, {
    method: 'PUT',
    headers: { 'Content-Type': pending.upload_headers['Content-Type'] },
    body: file,
  });
  if (!response.ok) throw new Error('Não foi possível enviar a captura.');
  const ready = await coreApi.staff.appStoreReviewUpload({
    upload: { action: 'complete', request_id: requestId, idempotency_key: crypto.randomUUID() },
  });
  if (ready.status !== 'ready') throw new Error('A captura enviada não ficou disponível.');
  return ready.file_id;
}

export async function saveCatalogMetadata(
  item: AppStoreCatalogState,
  draft: CatalogMetadataDraft,
  file?: File,
) {
  const screenshotFileId = file
    ? await uploadReviewImage(file)
    : item.metadata?.screenshot_file_id ?? null;
  return coreApi.staff.appStoreCatalogAct({
    offerId: item.offering.id,
    action: 'saveMetadata',
    metadata: { ...draft, screenshot_file_id: screenshotFileId },
    expectedVersion: item.version,
    idempotencyKey: crypto.randomUUID(),
  });
}
