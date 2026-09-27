import { coreApi } from '../api/core';
import type { StaffOfferTypeItem, StaffOfferTypeSave } from '../api/core.gen';

export type BillingType = StaffOfferTypeItem['billing_type'];
export type BillingInterval = StaffOfferTypeItem['allowed_billing_intervals'][number];
export type OfferDelivery = StaffOfferTypeItem['delivery'];
export type StaffOfferTypeSaveInput = Omit<StaffOfferTypeSave, 'kind' | 'billing_interval'> & {
  billing_interval: BillingInterval | null;
};

export type OfferingTypeBilling = Omit<StaffOfferTypeItem, 'billing_interval'> & {
  billing_interval: BillingInterval | null;
  slug: string;
  name: string;
  enabled: boolean;
  sort_order: number;
  active_offerings_count: number;
};

export type OfferingTypesSnapshot = {
  canEdit: boolean;
  items: OfferingTypeBilling[];
};

function offeringType(item: StaffOfferTypeItem): OfferingTypeBilling {
  return {
    ...item,
    billing_interval: strictBillingInterval(item.billing_interval),
    slug: item.key,
    name: item.label,
    enabled: item.active,
    sort_order: item.position,
    active_offerings_count: item.active_offers_count,
  };
}

function strictBillingInterval(value: string | null): BillingInterval | null {
  if (value === null) return null;
  const interval = ['week', 'month', '2month', 'quarter', 'semester', 'year']
    .find((candidate) => candidate === value);
  if (interval === 'week' || interval === 'month' || interval === '2month'
    || interval === 'quarter' || interval === 'semester' || interval === 'year') return interval;
  throw new Error('staff.invalid_billing');
}

function requireOfferingType(item: Awaited<ReturnType<typeof coreApi.staff.catalogSave>>): StaffOfferTypeItem {
  if (item.kind !== 'offer_types') throw new Error('staff.invalid_catalog_response');
  return item;
}

export async function listOfferingTypeBilling(): Promise<OfferingTypesSnapshot> {
  const result = await coreApi.staff.catalog({ kind: 'offer_types' });
  return {
    canEdit: result.can_edit,
    items: result.items
      .filter((item): item is StaffOfferTypeItem => item.kind === 'offer_types')
      .map(offeringType),
  };
}

export async function saveOfferingType(item: StaffOfferTypeSaveInput): Promise<OfferingTypeBilling> {
  return offeringType(requireOfferingType(await coreApi.staff.catalogSave({
    item: { kind: 'offer_types', ...item },
  })));
}

export async function setOfferingTypeActive(input: {
  key: string;
  active: boolean;
  expectedVersion: number;
  confirmation: string;
}): Promise<OfferingTypeBilling> {
  const changed = input.active
    ? await coreApi.staff.catalogActivate({
      kind: 'offer_types', key: input.key, expectedVersion: input.expectedVersion,
    })
    : await coreApi.staff.catalogDeactivate({
      kind: 'offer_types', key: input.key, expectedVersion: input.expectedVersion,
      confirmation: input.confirmation,
    });
  return offeringType(requireOfferingType(changed));
}

export function offeringTypeErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : '';
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
