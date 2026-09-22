// Presentation only. Catalog commands and purchase validation remain server-side.
export type AppStoreProductType = 'auto_renewable_subscription' | 'non_consumable' | 'non_renewing_subscription';
type Offer = {
  offering_type: string | null;
  billing_type: string;
  price: number;
  settings: Record<string, unknown>;
};
type Monetization = { label: string; productType: AppStoreProductType | null; canPrepare: boolean; reason: string };

export function appStoreProductTypeLabel(type: AppStoreProductType): string {
  return {
    auto_renewable_subscription: 'Assinatura renovável',
    non_consumable: 'Compra única · sem expiração',
    non_renewing_subscription: 'Compra única · acesso com prazo',
  }[type];
}

export function offeringMonetization(offer: Offer): Monetization {
  const unavailable = (label: string, reason: string): Monetization => ({ label, reason, productType: null, canPrepare: false });
  if (offer.offering_type === 'physical_products') return unavailable('Pagamento de produto físico', 'Não usa StoreKit. O preço e o frete pertencem a cada item.');
  if (offer.offering_type === 'health_consultancy') return unavailable('Consultoria', 'Não está habilitada no catálogo Apple. O enquadramento depende do serviço prestado.');
  if (!['premium_content', 'standalone_workout', 'standalone_diet', 'courses'].includes(offer.offering_type ?? '')) {
    return unavailable('Não habilitado', 'Este tipo não está habilitado na automação Apple.');
  }
  if (offer.billing_type === 'free' || offer.price === 0) return unavailable('Gratuito', 'Aquisição sem produto ou cobrança da Apple.');
  if (!Number.isFinite(offer.price) || offer.price < 0) return unavailable('Preço inválido', 'Confira o preço da oferta.');
  let productType: AppStoreProductType;
  if (offer.billing_type === 'recurring') productType = 'auto_renewable_subscription';
  else if (offer.billing_type === 'one_time') {
    const duration = offer.settings.access_duration;
    if (!duration || duration === 'lifetime') productType = 'non_consumable';
    else {
      const days = offer.settings.access_duration_days;
      if (typeof days !== 'number' || !Number.isSafeInteger(days) || days <= 0 || days > 2147483647) {
        return unavailable('Prazo inválido', 'Defina a duração do acesso antes de preparar o produto.');
      }
      productType = 'non_renewing_subscription';
    }
  } else return unavailable('Cobrança não reconhecida', 'Confira o modelo de cobrança da oferta.');
  return { label: appStoreProductTypeLabel(productType), productType, canPrepare: true,
    reason: productType === 'non_renewing_subscription' ? `${offer.settings.access_duration_days} dias · sem renovação automática` : '' };
}

export function appleReviewStateLabel(state: string | null | undefined): string {
  if (!state) return 'Aguardando configuração';
  return ({ PREPARE_FOR_SUBMISSION: 'Preparando envio', READY_TO_SUBMIT: 'Pronto para envio', READY_FOR_REVIEW: 'Pronto para revisão',
    WAITING_FOR_REVIEW: 'Aguardando revisão', IN_REVIEW: 'Em revisão', APPROVED: 'Aprovado', ACCEPTED: 'Aceito pela Apple',
    REJECTED: 'Rejeitado', DEVELOPER_REJECTED: 'Retirado da revisão', MISSING_METADATA: 'Dados incompletos',
    PENDING_BINARY_APPROVAL: 'Aguardando aprovação do app', DEVELOPER_ACTION_NEEDED: 'Requer ação',
  } as Record<string, string>)[state] ?? 'Conferir estado na Apple';
}
