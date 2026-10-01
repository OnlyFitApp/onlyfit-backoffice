// Presentation only. Catalog commands and purchase validation remain server-side.
export type NativeStoreProductType = 'auto_renewable_subscription' | 'non_consumable' | 'non_renewing_subscription';
type Offer = {
  type: string | null;
  billing_type: string;
  price: number | null;
};
type Monetization = { label: string; productType: NativeStoreProductType | null; canPrepare: boolean; reason: string };

export function nativeStoreProductTypeLabel(type: NativeStoreProductType): string {
  return {
    auto_renewable_subscription: 'Assinatura renovável',
    non_consumable: 'Compra única · sem expiração',
    non_renewing_subscription: 'Compra única · acesso com prazo',
  }[type];
}

export function nativeStoreMonetization(offer: Offer): Monetization {
  const unavailable = (label: string, reason: string): Monetization => ({ label, reason, productType: null, canPrepare: false });
  if (offer.type === 'physical_products') return unavailable('Pagamento de produto físico', 'Não usa compra digital das lojas. O preço e o frete pertencem a cada item.');
  if (offer.type === 'health_consultancy') return unavailable('Consultoria', 'Não usa compra digital das lojas; o checkout externo é validado pelo Core.');
  if (![
    'premium_content',
    'standalone_workout',
    'standalone_diet',
    'courses',
    'community_access',
    'challenge',
  ].includes(offer.type ?? '')) {
    return unavailable('Não habilitado', 'Este tipo não está habilitado para compra digital nas lojas.');
  }
  if (offer.price === null) return unavailable('Sem preço', 'Configure o preço antes de preparar o produto.');
  if (offer.billing_type === 'free' || offer.price === 0) return unavailable('Gratuito', 'Aquisição sem produto ou cobrança da Apple.');
  if (!Number.isFinite(offer.price) || offer.price < 0) return unavailable('Preço inválido', 'Confira o preço da oferta.');
  let productType: NativeStoreProductType;
  if (offer.billing_type === 'recurring') productType = 'auto_renewable_subscription';
  else if (offer.billing_type === 'one_time') productType = 'non_consumable';
  else return unavailable('Cobrança não reconhecida', 'Confira o modelo de cobrança da oferta.');
  return { label: nativeStoreProductTypeLabel(productType), productType, canPrepare: true,
    reason: '' };
}

export function appleReviewStateLabel(state: string | null | undefined): string {
  if (!state) return 'Aguardando configuração';
  return ({ PREPARE_FOR_SUBMISSION: 'Preparando envio', READY_TO_SUBMIT: 'Pronto para envio', READY_FOR_REVIEW: 'Pronto para revisão',
    WAITING_FOR_REVIEW: 'Aguardando revisão', IN_REVIEW: 'Em revisão', APPROVED: 'Aprovado', ACCEPTED: 'Aceito pela Apple',
    REJECTED: 'Rejeitado', DEVELOPER_REJECTED: 'Retirado da revisão', MISSING_METADATA: 'Dados incompletos',
    PENDING_BINARY_APPROVAL: 'Aguardando aprovação do app', DEVELOPER_ACTION_NEEDED: 'Requer ação',
  } as Record<string, string>)[state] ?? 'Conferir estado na Apple';
}
