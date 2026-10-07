import { coreApi } from "../api/core";
import type {
  StaffMarketStore,
  StaffMarketStoreBusiness,
  StaffMarketStoreInput,
  StaffProductCategoryItem,
} from "../api/core.gen";

export type ProductCategory = {
  slug: string;
  version: number | null;
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

function productCategory(row: StaffProductCategoryItem): ProductCategory {
  return {
    slug: row.key,
    version: row.version,
    label: row.data.label,
    icon: row.data.icon,
    sort_order: row.position,
    is_active: row.active,
  };
}

export async function listProductCategories(): Promise<ProductCategory[]> {
  return (await productCategories()).map(productCategory);
}

export async function saveProductCategory(
  category: ProductCategory,
): Promise<ProductCategory> {
  const current = (await productCategories())
    .find((item) => item.key === category.slug);
  const saved = requireProductCategory(await coreApi.staff.catalogSave({
    item: {
      kind: "product_categories",
      key: category.slug,
      label: category.label.trim(),
      public: current?.public ?? true,
      position: category.sort_order,
      expected_version: category.version,
      data: { icon: category.icon },
    },
  }));
  if (saved.active === category.is_active) return productCategory(saved);
  const changed = category.is_active
    ? await coreApi.staff.catalogActivate({
      kind: "product_categories", key: saved.key, expectedVersion: saved.version,
    })
    : await coreApi.staff.catalogDeactivate({
      kind: "product_categories", key: saved.key, expectedVersion: saved.version,
      confirmation: saved.data.label,
    });
  return productCategory(requireProductCategory(changed));
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

type MarketStoreMediaMime = "image/jpeg" | "image/png" | "image/webp";

function marketStoreMediaMime(file: File): MarketStoreMediaMime {
  if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/webp") {
    return file.type;
  }
  throw new Error("staff.invalid_market_store_media");
}

/** Envia a foto de campanha do hero ao R2 e devolve a URL pública verificada. */
export async function uploadMarketStoreHero(file: File): Promise<string> {
  if (file.size <= 0) throw new Error("staff.invalid_market_store_media");
  const pending = await coreApi.staff.marketStoreMediaUpload({
    upload: {
      action: "prepare",
      request_id: crypto.randomUUID(),
      filename: file.name,
      mime: marketStoreMediaMime(file),
      bytes: file.size,
    },
  });
  if (pending.status !== "pending") throw new Error("staff.market_store_media_prepare_invalid");
  const uploaded = await fetch(pending.upload_url, {
    method: "PUT",
    headers: { "Content-Type": pending.upload_headers["Content-Type"] },
    body: file,
  });
  if (!uploaded.ok) throw new Error("staff.market_store_media_upload_failed");
  const ready = await coreApi.staff.marketStoreMediaUpload({
    upload: {
      action: "complete",
      request_id: pending.file_id,
      idempotency_key: crypto.randomUUID(),
    },
  });
  if (ready.status !== "ready") throw new Error("staff.market_store_media_complete_invalid");
  return ready.public_url;
}

export function marketStoreMediaErrorMessage(error: unknown): string {
  const code = error instanceof Error ? error.message : "";
  if (code.includes("staff.invalid_market_store_media")) return "Use foto JPG, PNG ou WebP de até 10 MB.";
  if (code.includes("staff.market_store_media_upload_failed")) return "Não foi possível enviar a foto. Tente novamente.";
  if (code.includes("staff.market_store_media_contract_mismatch")) return "O arquivo enviado não é uma imagem válida.";
  if (code.includes("staff.forbidden")) return "Seu perfil não pode alterar lojas.";
  return "Não foi possível enviar a foto.";
}
