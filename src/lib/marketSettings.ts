import { supabase } from './supabase';

export type MarketMode = 'algorithm' | 'random';

export type MarketAlgorithmSettings = {
  mode: MarketMode;
  weight_affinity: number;
  weight_sales: number;
  weight_rating: number;
  weight_novelty: number;
  weight_exploration: number;
  diversity_seller_penalty: number;
  diversity_category_penalty: number;
  novelty_half_life_hours: number;
  penalty_already_owned: number;
  updated_at: string | null;
};

export type MarketAlgorithmInput = Omit<MarketAlgorithmSettings, 'updated_at'>;

export type ProductCategory = {
  slug: string;
  label: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
};

export type AdPackage = {
  id: string;
  placement: string;
  duration_days: number;
  price: number | null;
  currency: string;
  is_active: boolean;
};

export type AdPlacement = {
  slug: string;
  name: string;
  max_slots: number;
  is_active: boolean;
  occupied_slots: number;
  reserved_slots: number;
  packages: AdPackage[];
};

export type AdBooking = {
  id: string;
  placement: string;
  duration_days: number;
  price_paid: number;
  status: string;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  offering_name: string;
  purchaser_name: string;
  transaction_id: string | null;
};

export type OfficialMarketStore = {
  id: string;
  organization_id: string;
  organization_name: string;
  organization_slug: string;
  organization_status: string;
  slug: string;
  name: string;
  tagline: string | null;
  category: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  website_url: string | null;
  sponsor_tier: 'official' | 'premium' | 'founding';
  badge_label: string;
  sort_order: number;
  active: boolean;
  starts_at: string | null;
  ends_at: string | null;
};

export type OfficialStoreOrganization = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  status: string;
};

export type OfficialMarketStoreInput = Omit<
  OfficialMarketStore,
  'id' | 'organization_name' | 'organization_slug' | 'organization_status'
> & { id?: string };

const numberFrom = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export async function getMarketAlgorithmSettings(): Promise<MarketAlgorithmSettings> {
  const { data, error } = await supabase.rpc('control_get_market_algorithm_settings');
  if (error) throw error;
  const row = (data ?? {}) as Record<string, unknown>;
  return {
    mode: row.mode === 'random' ? 'random' : 'algorithm',
    weight_affinity: numberFrom(row.weight_affinity),
    weight_sales: numberFrom(row.weight_sales),
    weight_rating: numberFrom(row.weight_rating),
    weight_novelty: numberFrom(row.weight_novelty),
    weight_exploration: numberFrom(row.weight_exploration),
    diversity_seller_penalty: numberFrom(row.diversity_seller_penalty),
    diversity_category_penalty: numberFrom(row.diversity_category_penalty),
    novelty_half_life_hours: numberFrom(row.novelty_half_life_hours),
    penalty_already_owned: numberFrom(row.penalty_already_owned),
    updated_at: typeof row.updated_at === 'string' ? row.updated_at : null,
  };
}

export async function setMarketAlgorithmSettings(input: MarketAlgorithmInput) {
  const { data, error } = await supabase.rpc('control_set_market_algorithm_settings', {
    p_mode: input.mode,
    p_weight_affinity: input.weight_affinity,
    p_weight_sales: input.weight_sales,
    p_weight_rating: input.weight_rating,
    p_weight_novelty: input.weight_novelty,
    p_weight_exploration: input.weight_exploration,
    p_diversity_seller_penalty: input.diversity_seller_penalty,
    p_diversity_category_penalty: input.diversity_category_penalty,
    p_novelty_half_life_hours: input.novelty_half_life_hours,
    p_penalty_already_owned: input.penalty_already_owned,
  });
  if (error) throw error;
  return data;
}

export async function listProductCategories(): Promise<ProductCategory[]> {
  const { data, error } = await supabase.rpc('control_list_product_categories', {
    p_include_inactive: true,
  });
  if (error) throw error;
  return (data ?? []).map((row: Record<string, unknown>) => ({
    slug: String(row.slug),
    label: String(row.label),
    icon: String(row.icon),
    sort_order: numberFrom(row.sort_order),
    is_active: row.is_active === true,
  }));
}

export async function saveProductCategory(category: ProductCategory): Promise<void> {
  const { error } = await supabase.rpc('control_save_product_category', {
    p_slug: category.slug,
    p_label: category.label,
    p_icon: category.icon,
    p_sort_order: category.sort_order,
    p_is_active: category.is_active,
  });
  if (error) throw error;
}

export async function getAdInventory(): Promise<AdPlacement[]> {
  const { data, error } = await supabase.rpc('control_get_ad_inventory');
  if (error) throw error;
  return ((data ?? []) as Array<Record<string, unknown>>).map((row) => ({
    slug: String(row.slug),
    name: String(row.name),
    max_slots: numberFrom(row.max_slots),
    is_active: row.is_active === true,
    occupied_slots: numberFrom(row.occupied_slots),
    reserved_slots: numberFrom(row.reserved_slots),
    packages: ((row.packages ?? []) as Array<Record<string, unknown>>).map((item) => ({
      id: String(item.id),
      placement: String(item.placement),
      duration_days: numberFrom(item.duration_days),
      price: item.price == null ? null : numberFrom(item.price),
      currency: String(item.currency ?? 'BRL'),
      is_active: item.is_active === true,
    })),
  }));
}

export async function setAdPlacement(input: Pick<AdPlacement, 'slug' | 'max_slots' | 'is_active'>) {
  const { data, error } = await supabase.rpc('control_set_ad_placement', {
    p_slug: input.slug,
    p_max_slots: input.max_slots,
    p_is_active: input.is_active,
  });
  if (error) throw error;
  return data;
}

export async function setAdPackage(input: Pick<AdPackage, 'placement' | 'duration_days' | 'price' | 'is_active'>) {
  if (input.price == null || !Number.isFinite(input.price) || input.price <= 0) throw new Error('invalid_ad_package_price');
  const { data, error } = await supabase.rpc('control_set_ad_package', {
    p_placement: input.placement,
    p_duration_days: input.duration_days,
    p_price: input.price,
    p_is_active: input.is_active,
  });
  if (error) throw error;
  return data;
}

export async function listAdBookings(): Promise<{ items: AdBooking[]; total: number }> {
  const { data, error } = await supabase.rpc('control_list_ad_bookings', {
    p_status: null,
    p_limit: 100,
    p_offset: 0,
  });
  if (error) throw error;
  const result = (data ?? {}) as Record<string, unknown>;
  return {
    items: (result.items ?? []) as AdBooking[],
    total: numberFrom(result.total),
  };
}

export async function listOfficialMarketStores(): Promise<OfficialMarketStore[]> {
  const { data, error } = await supabase.rpc('control_list_official_market_stores', {
    p_limit: 200,
    p_offset: 0,
  });
  if (error) throw error;
  const result = (data ?? {}) as { items?: OfficialMarketStore[] };
  return result.items ?? [];
}

export async function searchOfficialStoreOrganizations(query = ''): Promise<OfficialStoreOrganization[]> {
  const { data, error } = await supabase.rpc('control_search_official_store_organizations', {
    p_query: query.trim() || null,
    p_limit: 30,
  });
  if (error) throw error;
  return (data ?? []) as OfficialStoreOrganization[];
}

export async function saveOfficialMarketStore(input: OfficialMarketStoreInput): Promise<void> {
  const { error } = await supabase.rpc('control_upsert_official_market_store', {
    p_id: input.id ?? null,
    p_organization_id: input.organization_id,
    p_slug: input.slug,
    p_name: input.name,
    p_tagline: input.tagline,
    p_category: input.category,
    p_logo_url: input.logo_url,
    p_cover_image_url: input.cover_image_url,
    p_website_url: input.website_url,
    p_sponsor_tier: input.sponsor_tier,
    p_badge_label: input.badge_label,
    p_sort_order: input.sort_order,
    p_active: input.active,
    p_starts_at: input.starts_at,
    p_ends_at: input.ends_at,
  });
  if (error) throw error;
}

export async function deleteOfficialMarketStore(id: string): Promise<void> {
  const { error } = await supabase.rpc('control_delete_official_market_store', { p_id: id });
  if (error) throw error;
}

export async function uploadOfficialStoreAsset(
  file: File,
  storeKey: string,
  kind: 'logo' | 'cover',
): Promise<string> {
  const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
  if (!allowed.has(file.type) || file.size > 5 * 1024 * 1024) {
    throw new Error('Use uma imagem JPG, PNG, WebP ou GIF de até 5 MB.');
  }
  const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
  const safeKey = storeKey.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
  const path = `official-stores/${safeKey}/${kind}-${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from('business-media').upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;
  return supabase.storage.from('business-media').getPublicUrl(path).data.publicUrl;
}
