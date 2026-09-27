import { coreApi } from '../api/core';
import type { StaffFinancialOffering, StaffNativeProductInput } from '../api/core.gen';

export type OfferingCatalogItem = StaffFinancialOffering;
export type OfferingCatalogStatus = string;

export type OfferingCatalogFilters = {
  offeringType?: string | null;
  status?: string | null;
  limit?: number;
  offset?: number;
};

export function listOfferingCatalog(filters: OfferingCatalogFilters) {
  return coreApi.staff.financialOfferings({
    type: filters.offeringType,
    status: filters.status,
    limit: filters.limit,
    offset: filters.offset,
  });
}

export type NativeStoreProductInput = StaffNativeProductInput;

export function saveNativeStoreProduct(product: NativeStoreProductInput) {
  return coreApi.staff.nativeProductSave({ product });
}

export function listNativeProducts() {
  return coreApi.staff.nativeProducts();
}
