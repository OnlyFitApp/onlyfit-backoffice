import { coreApi } from "../api/core";
import type {
  StaffMarketStore,
  StaffMarketStoreBusiness,
  StaffMarketStoreInput,
  StaffProductCategoryItem,
} from "../api/core.gen";

export type ProductCategory = {
  slug: string;
  label: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
};

export type MarketStore = StaffMarketStore;
export type MarketStoreBusiness = StaffMarketStoreBusiness;
export type MarketStoreInput = StaffMarketStoreInput;

function requireProductCategory(
  item: Awaited<ReturnType<typeof coreApi.staff.catalogSave>>,
): StaffProductCategoryItem {
  if (item.kind !== "product_categories") throw new Error("staff.invalid_catalog_response");
  return item;
}

async function productCategories(): Promise<StaffProductCategoryItem[]> {
  const catalog = await coreApi.staff.catalog({ kind: "product_categories" });
  return catalog.items.filter(
    (item): item is StaffProductCategoryItem => item.kind === "product_categories",
  );
}

export async function listProductCategories(): Promise<ProductCategory[]> {
  return (await productCategories()).map((row) => ({
    slug: row.key,
    label: row.data.label,
    icon: row.data.icon,
    sort_order: row.position,
    is_active: row.active,
  }));
}

export async function saveProductCategory(
  category: ProductCategory,
): Promise<void> {
  const current = (await productCategories())
    .find((item) => item.key === category.slug);
  const saved = requireProductCategory(await coreApi.staff.catalogSave({
    item: {
      kind: "product_categories",
      key: category.slug,
      label: category.label.trim(),
      public: current?.public ?? true,
      position: category.sort_order,
      expected_version: current?.version,
      data: { icon: category.icon },
    },
  }));
  if (saved.active === category.is_active) return;
  const changed = category.is_active
    ? await coreApi.staff.catalogActivate({
      kind: "product_categories", key: saved.key, expectedVersion: saved.version,
    })
    : await coreApi.staff.catalogDeactivate({
      kind: "product_categories", key: saved.key, expectedVersion: saved.version,
      confirmation: saved.data.label,
    });
  requireProductCategory(changed);
}

export async function listMarketStores(): Promise<MarketStore[]> {
  return (await coreApi.staff.marketStores()).items;
}

export async function searchMarketStoreBusinesses(
  query = "",
): Promise<MarketStoreBusiness[]> {
  return (await coreApi.staff.marketStores({ query: query.trim() || null }))
    .businesses;
}

export async function saveMarketStore(
  input: MarketStoreInput,
): Promise<MarketStore> {
  return coreApi.staff.marketStoreSave({ store: input });
}
