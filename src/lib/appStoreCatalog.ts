import { coreApi } from '../api/core';
import type { StaffAppStoreCatalogItem } from '../api/core.gen';

export type AppStoreCatalogState = StaffAppStoreCatalogItem;

export async function getAppStoreCatalogItem(offeringId: string): Promise<AppStoreCatalogState> {
  const page = await coreApi.staff.appStoreCatalog({ limit: 100, offset: 0 });
  const item = page.items.find((candidate) => candidate.offering.id === offeringId);
  if (item) return item;
  if (page.total > page.items.length) {
    throw new Error('A oferta não foi localizada nesta consulta limitada a 100 ofertas do catálogo Apple. As demais ofertas não foram consultadas.');
  }
  throw new Error('A oferta não está disponível no catálogo Apple.');
}
