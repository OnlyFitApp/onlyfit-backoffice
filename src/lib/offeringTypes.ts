import { coreApi } from '../api/core';
import type { StaffOfferType, StaffOfferTypeSaveInput } from '../api/core.gen';

export type BillingType = StaffOfferType['billing_type'];
export type BillingInterval = NonNullable<StaffOfferType['billing_interval']>;
export type OfferDelivery = StaffOfferType['delivery'];
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

function toOfferingType(item: StaffOfferType): OfferingTypeBilling {
  return {
    ...item,
    slug: item.key,
    name: item.label,
    enabled: item.active,
    sort_order: item.position,
    minimum_price: item.minimum_price ?? 0,
    platform_fee_percent: item.platform_fee_percent ?? 0,
    platform_fee_fixed: item.platform_fee_fixed ?? 0,
    active_offerings_count: item.active_offers_count,
  };
}

export async function listOfferingTypeBilling(): Promise<OfferingTypesSnapshot> {
  const result = await coreApi.staff.offerTypes();
  return { canEdit: result.can_edit, items: result.items.map(toOfferingType) };
}

export async function saveOfferingType(item: StaffOfferTypeSaveInput): Promise<OfferingTypeBilling> {
  return toOfferingType(await coreApi.staff.offerTypeSave({ item }));
}

export async function setOfferingTypeActive(input: {
  key: string;
  active: boolean;
  expectedVersion: number;
}): Promise<OfferingTypeBilling> {
  return toOfferingType(await coreApi.staff.offerTypeAct({
    key: input.key,
    action: input.active ? 'activate' : 'deactivate',
    expectedVersion: input.expectedVersion,
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
