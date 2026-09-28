import { coreApi } from '../api/core';
import type {
  StaffFoodSourceItem,
  StaffFoodSourceSave,
  StaffNutrientItem,
  StaffNutrientSave,
} from '../api/core.gen';

export type NutritionCatalogKind = 'food_sources' | 'nutrients';
export type NutritionCatalogItem = StaffFoodSourceItem | StaffNutrientItem;
export type NutritionCatalogSave = StaffFoodSourceSave | StaffNutrientSave;

function requireNutritionCatalogItem(
  item: Awaited<ReturnType<typeof coreApi.staff.catalogSave>>,
): NutritionCatalogItem {
  if (item.kind !== 'food_sources' && item.kind !== 'nutrients') {
    throw new Error('staff.invalid_catalog_response');
  }
  return item;
}

export async function listNutritionCatalog(kind: NutritionCatalogKind): Promise<NutritionCatalogItem[]> {
  const catalog = await coreApi.staff.catalog({ kind });
  return catalog.items.filter((item): item is NutritionCatalogItem => item.kind === kind);
}

export async function saveNutritionCatalogItem(item: NutritionCatalogSave): Promise<NutritionCatalogItem> {
  return requireNutritionCatalogItem(await coreApi.staff.catalogSave({ item }));
}

export async function setNutritionCatalogItemActive(input: {
  item: NutritionCatalogItem;
  active: boolean;
}): Promise<NutritionCatalogItem> {
  if (input.item.active === input.active) return input.item;
  const result = input.active
    ? await coreApi.staff.catalogActivate({
      kind: input.item.kind,
      key: input.item.key,
      expectedVersion: input.item.version,
    })
    : await coreApi.staff.catalogDeactivate({
      kind: input.item.kind,
      key: input.item.key,
      expectedVersion: input.item.version,
      confirmation: input.item.key,
    });
  return requireNutritionCatalogItem(result);
}

export function nutritionCatalogErrorMessage(error: unknown): string {
  const code = error instanceof Error ? error.message : '';
  if (code.includes('staff.catalog_changed')) return 'Outra pessoa alterou este item. Atualize a lista antes de salvar.';
  if (code.includes('staff.catalog_in_use')) return 'Este item ainda está em uso e não pode ser desativado.';
  if (code.includes('staff.last_catalog_item')) return 'O catálogo precisa manter ao menos um item ativo.';
  if (code.includes('staff.invalid_catalog_item')) return 'Revise os campos do catálogo.';
  if (code.includes('staff.forbidden')) return 'Seu perfil não tem permissão para manter este catálogo.';
  return 'Não foi possível concluir a operação.';
}
