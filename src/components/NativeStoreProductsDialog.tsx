import { AlertTriangle, RefreshCw, Save, ShoppingBag, X } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import type { StaffNativeProductInput, StaffNativeProductSummary } from '../api/core.gen';
import { useSaveNativeStoreProduct } from '../hooks/useOfferingCatalog';
import type { OfferingCatalogItem } from '../lib/offeringCatalog';
import {
  nativeStoreMonetization,
  nativeStoreProductTypeLabel,
} from '../lib/offeringMonetization';
import { AppStorePreparation } from './AppStorePreparation';

type NativeStoreChannel = StaffNativeProductInput['channel'];

type Props = {
  item: OfferingCatalogItem;
  onCancel: () => void;
  onSaved: () => void;
};

function nativeProductStatus(value: string): StaffNativeProductInput['status'] {
  if (value === 'ready' || value === 'retired') return value;
  return 'draft';
}

function storeName(channel: NativeStoreChannel): string {
  return channel === 'app_store' ? 'App Store' : 'Google Play';
}

function NativeProductForm({
  item,
  channel,
  current,
  onSaved,
}: {
  item: OfferingCatalogItem;
  channel: NativeStoreChannel;
  current?: StaffNativeProductSummary;
  onSaved: () => void;
}) {
  const monetization = nativeStoreMonetization(item);
  const expectedType = monetization.productType;
  const [productId, setProductId] = useState(current?.product_id ?? '');
  const [status, setStatus] = useState<StaffNativeProductInput['status']>(current?.status ?? 'draft');
  const [price, setPrice] = useState(String(current?.price ?? item.price));
  const [group, setGroup] = useState(current?.subscription_group_reference ?? '');
  const [error, setError] = useState('');
  const mutation = useSaveNativeStoreProduct();
  const name = storeName(channel);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    if (!expectedType) return;
    const parsedPrice = Number(price.replace(',', '.'));
    if (!productId.trim()) {
      setError(`Informe o Product ID configurado no ${name}.`);
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError('Informe um preço válido.');
      return;
    }
    try {
      await mutation.mutateAsync({
        offer_id: item.id,
        channel,
        product_id: productId.trim(),
        product_type: expectedType,
        status,
        price: parsedPrice,
        currency: item.currency || 'BRL',
        subscription_group_reference: expectedType === 'auto_renewable_subscription'
          ? group.trim() || null
          : null,
        expected_version: current?.version ?? null,
      });
      onSaved();
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : 'Não foi possível salvar.');
    }
  }

  if (!monetization.canPrepare || !expectedType) {
    return <p>{monetization.reason || 'Esta oferta não usa compra digital das lojas.'}</p>;
  }

  return <form onSubmit={submit}>
    <p>{monetization.label}</p>
    <label className="user-dialog-field">
      <span>Product ID</span>
      <input
        value={productId}
        autoComplete="off"
        spellCheck={false}
        placeholder={channel === 'app_store'
          ? 'com.onlyfitapp.app.oferta'
          : 'onlyfit_oferta'}
        onChange={(event) => setProductId(event.target.value)}
      />
    </label>
    <label className="user-dialog-field">
      <span>Tipo</span>
      <input value={nativeStoreProductTypeLabel(expectedType)} disabled />
    </label>
    <label className="user-dialog-field">
      <span>Preço no {name}</span>
      <input
        inputMode="decimal"
        value={price}
        placeholder="39,90"
        onChange={(event) => setPrice(event.target.value)}
      />
    </label>
    {expectedType === 'auto_renewable_subscription' && (
      <label className="user-dialog-field">
        <span>{channel === 'app_store' ? 'Grupo de assinatura' : 'Assinatura-base'}</span>
        <input value={group} onChange={(event) => setGroup(event.target.value)} />
      </label>
    )}
    <label className="user-dialog-field">
      <span>Status</span>
      <select
        value={status}
        onChange={(event) => setStatus(nativeProductStatus(event.target.value))}
      >
        <option value="draft">{channel === 'app_store' ? 'Aguardando aprovação' : 'Rascunho'}</option>
        <option value="ready" disabled={channel === 'app_store' && current?.status !== 'ready'}>
          {channel === 'app_store' ? 'Aprovado pela Apple' : 'Disponível no app'}
        </option>
        <option value="retired">Retirado</option>
      </select>
    </label>
    {error && <div className="inline-alert danger" role="alert">
      <AlertTriangle size={18} />{error}
    </div>}
    <button className="button secondary" type="submit" disabled={mutation.isPending}>
      {mutation.isPending ? <RefreshCw className="spin" size={16} /> : <Save size={16} />}
      Salvar {name}
    </button>
  </form>;
}

export function NativeStoreProductsDialog({ item, onCancel, onSaved }: Props) {
  const [channel, setChannel] = useState<NativeStoreChannel>('app_store');
  const current = item.native_products.find((product) => product.channel === channel);
  const name = storeName(channel);

  return <>
    <button className="scrim" type="button" aria-label="Fechar" onClick={onCancel} />
    <section
      className="user-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="native-store-product-title"
    >
      <header className="user-dialog-head">
        <div className="status-icon"><ShoppingBag size={22} /></div>
        <div>
          <h2 id="native-store-product-title">Produtos das lojas nativas</h2>
          <p>{item.name}</p>
        </div>
        <button className="icon-button" type="button" aria-label="Fechar" onClick={onCancel}>
          <X size={18} />
        </button>
      </header>

      <section className="user-dialog-body">
        <label className="user-dialog-field">
          <span>Loja</span>
          <select
            value={channel}
            onChange={(event) => setChannel(
              event.target.value === 'google_play' ? 'google_play' : 'app_store',
            )}
          >
            <option value="app_store">App Store</option>
            <option value="google_play">Google Play</option>
          </select>
        </label>
        <NativeProductForm
          key={`${item.id}:${channel}:${current?.version ?? 0}`}
          item={item}
          channel={channel}
          current={current}
          onSaved={onSaved}
        />
        {channel === 'app_store' && <AppStorePreparation offeringId={item.id} />}
        {channel === 'google_play' && <p>
          O Core confere a compra diretamente no Google Play antes de liberar o acesso.
          O aplicativo nunca envia preço nem decide a situação da assinatura.
        </p>}
      </section>

      <footer className="user-dialog-actions">
        <span>{name}: {current?.status === 'ready' ? 'configurado' : 'não liberado'}</span>
        <button className="button secondary" type="button" onClick={onCancel}>Fechar</button>
      </footer>
    </section>
  </>;
}
