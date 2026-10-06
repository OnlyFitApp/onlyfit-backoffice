import { useQuery } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { getAppStoreCatalogItem } from '../lib/appStoreCatalog';
import { nativeStoreProductTypeLabel } from '../lib/offeringMonetization';

export function AppStorePreparation({ offeringId }: { offeringId: string }) {
  const status = useQuery({
    queryKey: ['app-store-preparation', offeringId],
    queryFn: () => getAppStoreCatalogItem(offeringId),
    staleTime: 10_000,
    retry: false,
  });
  const data = status.data;
  const advanced = data?.management?.mode === 'advanced_commerce';
  const type = data?.product?.product_type;
  const typeLabel = type === 'consumable' || type === 'auto_renewable_subscription'
    ? nativeStoreProductTypeLabel(type) : 'Vínculo Apple';

  return <section aria-label="Catálogo Apple">
    <h3>{advanced ? 'Advanced Commerce Apple' : 'Catálogo Apple'}</h3>
    {status.isPending && <p role="status">Consultando vínculo…</p>}
    {status.error && <p role="alert">{status.error.message}</p>}
    {data && <>
      <p>{typeLabel}</p>
      {advanced ? <>
        <p>Produto genérico compartilhado. A oferta e seus preços são administrados no cadastro do negócio.</p>
        <p>O vínculo não comprova a habilitação da Apple nem um pagamento confirmado.</p>
      </> : <p>Não há vínculo Advanced Commerce confirmado nesta leitura. A preparação antiga por oferta foi retirada.</p>}
      {data.product && <p>Product ID: {data.product.product_id}</p>}
    </>}
    <button type="button" className="button secondary" onClick={() => void status.refetch()} disabled={status.isFetching}>
      <RefreshCw size={16} className={status.isFetching ? 'spin' : undefined} /> Atualizar
    </button>
  </section>;
}
