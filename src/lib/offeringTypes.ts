import { coreApi } from '../api/core';

export type BillingType = 'one_time' | 'recurring' | 'free';
export type BillingInterval = 'week' | 'month' | '2month' | 'quarter' | 'semester' | 'year';
export type OfferDelivery = 'club' | 'consultancy' | 'workout' | 'diet' | 'physical_product'
  | 'course' | 'challenge' | 'community' | 'platform_membership';

export interface StaffOfferTypeSaveInput {
  key: string;
  label: string;
  description: string;
  icon: string | null;
  position: number;
  delivery: OfferDelivery;
  billing_type: BillingType;
  billing_interval: BillingInterval | null;
  allowed_billing_intervals: BillingInterval[];
  minimum_price: number;
  minimum_monthly_price: number | null;
  platform_fee_percent: number;
  platform_fee_fixed: number;
  max_per_business: number | null;
  unique_per_owner_profile: boolean;
  requires_affinity_group: boolean;
  requires_product_category: boolean;
  expected_version?: number | null;
}

interface StaffOfferType extends StaffOfferTypeSaveInput {
  active: boolean;
  version: number;
  active_offers_count: number;
  configured: boolean;
}

export type OfferingTypeBilling = StaffOfferType & {
  slug: string;
  name: string;
  enabled: boolean;
  sort_order: number;
  minimum_price: number;
  platform_fee_percent: number;
  platform_fee_fixed: number;
  active_offerings_count: number;
};

export type OfferingTypesSnapshot = {
  canEdit: boolean;
  items: OfferingTypeBilling[];
};

function toOfferingType(raw: unknown): OfferingTypeBilling {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('staff.invalid_offer_type');
  const item = raw as Record<string, unknown>;
  const data = item.data && typeof item.data === 'object' && !Array.isArray(item.data)
    ? item.data as Record<string, unknown> : item;
  const impact = item.impact && typeof item.impact === 'object' && !Array.isArray(item.impact)
    ? item.impact as Record<string, unknown> : item;
  const value = { ...data, ...item } as Record<string, unknown>;
  const result = {
    key: String(value.key ?? ''),
    label: String(value.label ?? value.name_key ?? ''),
    description: String(value.description ?? ''),
    icon: typeof value.icon === 'string' ? value.icon : null,
    active: value.active === true,
    position: Number(value.position ?? 0),
    version: Number(value.version ?? 1),
    delivery: String(value.delivery ?? '') as OfferDelivery,
    billing_type: String(value.billing_type ?? '') as BillingType,
    billing_interval: typeof value.billing_interval === 'string' ? value.billing_interval as BillingInterval : null,
    allowed_billing_intervals: Array.isArray(value.allowed_billing_intervals)
      ? value.allowed_billing_intervals.filter((interval): interval is BillingInterval =>
        typeof interval === 'string' && ['week', 'month', '2month', 'quarter', 'semester', 'year'].includes(interval))
      : typeof value.billing_interval === 'string' ? [value.billing_interval as BillingInterval] : [],
    minimum_price: Number(value.minimum_price ?? 0),
    minimum_monthly_price: value.minimum_monthly_price == null ? null : Number(value.minimum_monthly_price),
    platform_fee_percent: Number(value.platform_fee_percent ?? 0),
    platform_fee_fixed: Number(value.platform_fee_fixed ?? 0),
    max_per_business: value.max_per_business == null ? null : Number(value.max_per_business),
    unique_per_owner_profile: value.unique_per_owner_profile === true,
    requires_affinity_group: value.requires_affinity_group === true,
    requires_product_category: value.requires_product_category === true,
    expected_version: undefined,
    active_offers_count: Number(value.active_offers_count ?? impact.offers ?? 0),
    configured: value.configured === true || (value.minimum_price != null
      && value.platform_fee_percent != null && value.platform_fee_fixed != null),
  } satisfies StaffOfferType;
  return {
    ...result,
    slug: result.key,
    name: result.label,
    enabled: result.active,
    sort_order: result.position,
    minimum_price: result.minimum_price ?? 0,
    platform_fee_percent: result.platform_fee_percent ?? 0,
    platform_fee_fixed: result.platform_fee_fixed ?? 0,
    active_offerings_count: result.active_offers_count,
  };
}

export async function listOfferingTypeBilling(): Promise<OfferingTypesSnapshot> {
  const result = await coreApi.staff.catalog({ kind: 'offer_types' });
  return { canEdit: result.can_edit, items: result.items.map(toOfferingType) };
}

export async function saveOfferingType(item: StaffOfferTypeSaveInput): Promise<OfferingTypeBilling> {
  return toOfferingType(await coreApi.staff.catalogSave({ kind: 'offer_types', item: { ...item } }));
}

export async function setOfferingTypeActive(input: {
  key: string;
  active: boolean;
  expectedVersion: number;
}): Promise<OfferingTypeBilling> {
  return toOfferingType(await coreApi.staff.catalogAct({
    kind: 'offer_types',
    key: input.key,
    action: input.active ? 'activate' : 'deactivate',
    data: { expected_version: input.expectedVersion },
  }));
}

export function offeringTypeErrorMessage(error: unknown): string {
  const raw = error instanceof Error
    ? error.message
    : typeof error === 'object' && error !== null && 'message' in error
      ? String((error as { message: unknown }).message)
      : String(error ?? '');
  if (raw.includes('staff.catalog_changed')) return 'Outra pessoa alterou este tipo. Atualize a lista antes de salvar.';
  if (raw.includes('staff.delivery_in_use')) return 'A capacidade de entrega não muda depois que o tipo possui ofertas.';
  if (raw.includes('staff.offer_type_in_use')) return 'Pause ou arquive as ofertas vinculadas antes de desativar este tipo.';
  if (raw.includes('staff.offer_type_not_configured')) return 'Preencha preço mínimo e taxas antes de ativar.';
  if (raw.includes('staff.unsupported_delivery')) return 'Escolha uma capacidade de entrega implementada.';
  if (raw.includes('staff.invalid_billing')) return 'A cobrança e o intervalo não formam uma configuração válida.';
  if (raw.includes('staff.invalid_offer_type')) return 'Revise os limites; ofertas gratuitas precisam ter preço e taxas zerados.';
  if (raw.includes('staff.mfa_required')) return 'Confirme o segundo fator do OnlyFit Core.';
  if (raw.includes('staff.forbidden')) return 'Sua função no OnlyFit Core não permite esta alteração.';
  return 'Não foi possível salvar o tipo de oferta.';
}

export function billingTypeLabel(value: BillingType): string {
  if (value === 'recurring') return 'Recorrente';
  if (value === 'free') return 'Gratuita';
  return 'Pagamento único';
}

export function billingIntervalLabel(value: BillingInterval | null): string {
  switch (value) {
    case 'week': return 'Semanal';
    case 'month': return 'Mensal';
    case '2month': return 'Bimestral';
    case 'quarter': return 'Trimestral';
    case 'semester': return 'Semestral';
    case 'year': return 'Anual';
    default: return 'Sem intervalo';
  }
}
