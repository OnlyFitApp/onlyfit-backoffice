import { coreApi } from '../api/core';
import type { StaffAppStoreCatalogItem } from '../api/core.gen';

export type AppStoreCatalogState = StaffAppStoreCatalogItem;

export async function getAppStoreCatalogItem(offeringId: string): Promise<AppStoreCatalogState> {
  const page = await coreApi.staff.appStoreCatalog({ limit: 200, offset: 0 });
  const item = page.items.find((candidate) => candidate.offering.id === offeringId);
  if (!item) throw new Error('A oferta não está disponível no catálogo Apple.');
  return item;
}
