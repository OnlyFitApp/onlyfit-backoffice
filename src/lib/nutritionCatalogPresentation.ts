import type { StaffFoodSourceData } from '../api/core.gen';
import type { NutritionCatalogItem } from './nutritionCatalogs';

const foodSourceNames: Readonly<Record<string, string>> = {
  personal: 'Pessoal',
  business: 'Negócio',
  taco: 'TACO',
  tbca: 'TBCA',
  usda: 'USDA',
  brand: 'Marca',
  restaurant: 'Restaurante',
};

// Presentation terms already used by the desktop nutrition editor (pt-BR).
const nutrientNames: Readonly<Record<string, string>> = {
  kcal: 'Calorias',
  protein_g: 'Proteínas',
  carbs_g: 'Carboidratos',
  fat_g: 'Lipídeos',
  fiber_g: 'Fibras',
  sodium_mg: 'Sódio',
  calcium: 'Cálcio',
  iron: 'Ferro',
  magnesium: 'Magnésio',
  phosphorus: 'Fósforo',
  potassium: 'Potássio',
  zinc: 'Zinco',
  vitamin_a: 'Vitamina A',
  vitamin_c: 'Vitamina C',
  vitamin_d: 'Vitamina D',
  vitamin_e: 'Vitamina E',
  vitamin_k: 'Vitamina K',
  thiamin: 'Tiamina (B1)',
  riboflavin: 'Riboflavina (B2)',
  niacin: 'Niacina (B3)',
  vitamin_b6: 'Vitamina B6',
  folate: 'Folato',
  vitamin_b12: 'Vitamina B12',
};

export function foodSourceOriginLabel(origin: StaffFoodSourceData['origin']): string {
  return foodSourceNames[origin];
}

/** The technical display key remains unchanged in the editor and save payload. */
export function nutritionCatalogLabel(item: Pick<NutritionCatalogItem, 'kind' | 'data'>): string {
  const name = item.data.display_name_key.trim();
  if (name.startsWith('food.source.')) {
    return foodSourceNames[name.slice('food.source.'.length)] ?? 'Fonte de alimento';
  }
  if (name.startsWith('nutrient.')) {
    return nutrientNames[name.slice('nutrient.'.length)] ?? 'Nutriente';
  }
  return name || (item.kind === 'food_sources' ? 'Fonte de alimento' : 'Nutriente');
}
