import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { appStoreCatalogCommand, catalogMessages, getAppStoreCatalogItem, saveCatalogMetadata, type AppStoreCatalogState, type CatalogAction } from '../lib/appStoreCatalog';
import { appleReviewStateLabel } from '../lib/offeringMonetization';

function ReviewMetadata({ item, disabled, onSaved }: {
  item: AppStoreCatalogState; disabled: boolean; onSaved: () => void;
}) {
  const metadata = item.metadata;
  const [displayName, setDisplayName] = useState(metadata?.display_name ?? (item.offering.name.length <= 30 ? item.offering.name : ''));
  const [description, setDescription] = useState(metadata?.description ?? '');
  const [notes, setNotes] = useState(metadata?.review_notes ?? '');
  const [locale, setLocale] = useState(metadata?.locale ?? 'pt-BR');
  const [baseTerritory, setBaseTerritory] = useState(metadata?.base_territory ?? 'BRA');
  const [territories, setTerritories] = useState((metadata?.available_territories ?? ['BRA']).join(', '));
  const [newTerritories, setNewTerritories] = useState(metadata?.available_in_new_territories ?? true);
  const [file, setFile] = useState<File>();
  const territoryCodes = territories.split(',').map(value => value.trim().toUpperCase()).filter(Boolean);
  const validTerritories = territoryCodes.length > 0 && territoryCodes.length === new Set(territoryCodes).size
    && territoryCodes.every(code => /^[A-Z]{3}$/.test(code)) && territoryCodes.includes(baseTerritory.trim().toUpperCase());
  const valid = displayName.trim().length >= 2 && description.trim().length > 0 && notes.trim().length > 0
    && /^[a-z]{2,3}(?:-[A-Za-z]{2,4})?$/.test(locale.trim()) && /^[A-Z]{3}$/.test(baseTerritory.trim().toUpperCase())
    && validTerritories && Boolean(file || metadata?.screenshot_file_id);
  const save = useMutation({
    mutationFn: () => saveCatalogMetadata(item, {
      display_name: displayName.trim(),
      description: description.trim(),
      review_notes: notes.trim(),
      locale: locale.trim(),
      base_territory: baseTerritory.trim().toUpperCase(),
      available_territories: territoryCodes,
      available_in_new_territories: newTerritories,
    }, file),
    onSuccess: onSaved,
  });
  return <details><summary>Dados para análise da Apple</summary>
    <label>Nome exibido na App Store<input value={displayName} minLength={2} maxLength={30} onChange={e => setDisplayName(e.target.value)} disabled={disabled || save.isPending} /></label>
    <label>Descrição curta<input value={description} maxLength={45} onChange={e => setDescription(e.target.value)} disabled={disabled || save.isPending} /></label>
    <label>Instruções de acesso para a equipe de análise<textarea value={notes} maxLength={4000} onChange={e => setNotes(e.target.value)} disabled={disabled || save.isPending} /></label>
    <label>Idioma dos textos<input value={locale} maxLength={16} placeholder="pt-BR" onChange={e => setLocale(e.target.value)} disabled={disabled || save.isPending} /></label>
    <label>Território base (código Apple de três letras)<input value={baseTerritory} maxLength={3} placeholder="BRA" onChange={e => setBaseTerritory(e.target.value.toUpperCase())} disabled={disabled || save.isPending} /></label>
    <label>Territórios disponíveis, separados por vírgula<input value={territories} placeholder="BRA" onChange={e => setTerritories(e.target.value)} disabled={disabled || save.isPending} /></label>
    <label><input type="checkbox" checked={newTerritories} onChange={e => setNewTerritories(e.target.checked)} disabled={disabled || save.isPending} /> Disponibilizar também em novos territórios adicionados pela Apple</label>
    <label>Captura real da oferta no app (PNG/JPG, até 5 MB)<input type="file" accept="image/png,image/jpeg" onChange={e => setFile(e.target.files?.[0])} disabled={disabled || save.isPending} /></label>
    {metadata?.screenshot_file_id && <p>Captura anexada.</p>}
    {!validTerritories && <p role="alert">Use códigos Apple de três letras, sem repetição, e inclua o território base.</p>}
    {save.error && <p role="alert">{save.error.message}</p>}
    <button type="button" className="button secondary" disabled={disabled || save.isPending || !valid} onClick={() => save.mutate()}>{save.isPending ? 'Salvando…' : 'Salvar dados'}</button>
  </details>;
}

export function AppStorePreparation({ offeringId }: { offeringId: string }) {
  const cache = useQueryClient();
  const queryKey = ['app-store-preparation', offeringId];
  const status = useQuery({
    queryKey,
    queryFn: () => getAppStoreCatalogItem(offeringId),
    staleTime: 10_000,
    retry: false,
    refetchInterval: query => ['queued', 'running'].includes(query.state.data?.job?.state ?? '') ? 5_000 : false,
  });
  const prepare = useMutation({
    mutationFn: ({ item, action }: { item: AppStoreCatalogState; action: CatalogAction }) => appStoreCatalogCommand(item, action),
    onSuccess: result => {
      cache.setQueryData(queryKey, result);
      void cache.invalidateQueries({ queryKey: ['offering-catalog'] });
    },
  });
  const data = status.data;
  const active = ['queued', 'running'].includes(data?.job?.state ?? '');
  const awaitingAppVersion = data?.state === 'awaiting_app_version';
  const inReview = ['WAITING_FOR_REVIEW', 'IN_REVIEW', 'PENDING_BINARY_APPROVAL'].includes(data?.apple_review_state ?? '');
  const label = active ? (data?.job?.state === 'queued' ? 'Na fila de preparação' : 'Preparando na Apple')
    : data?.job?.state === 'blocked' ? 'Preparação precisa de atenção'
    : data?.product ? 'Produto vinculado' : 'Ainda não preparado';
  const error = prepare.error ?? status.error;
  const metadataReady = Boolean(data?.metadata?.display_name && data.metadata.description && data.metadata.review_notes
    && data.metadata.screenshot_file_id && data.metadata.available_territories.length > 0);

  return <section aria-label="Preparação automática Apple">
    <h3>Catálogo Apple</h3>
    <p>Cria um produto exclusivo para esta oferta. O preço cheio vem do cálculo do backend; o líquido do profissional não é usado.</p>
    <p role="status" aria-live="polite">{status.isPending ? 'Consultando preparação…' : status.isError ? 'Preparação indisponível' : label}</p>
    {data && <p>Preço cheio para iPhone: {data.offering.price === null ? 'Sem preço' : new Intl.NumberFormat('pt-BR', {
      style: 'currency', currency: data.offering.currency,
    }).format(data.offering.price)}</p>}
    {data?.product && <p>Apple: {appleReviewStateLabel(data.apple_review_state)}</p>}
    {awaitingAppVersion && <p>A primeira compra deste tipo precisa acompanhar uma nova versão do aplicativo na análise da Apple.</p>}
    {data?.product?.status === 'ready' && <p>Produto aprovado e preço conferido.</p>}
    {data?.error_code && <p role="alert">{catalogMessages[data.error_code] ?? 'A configuração precisa ser conferida antes de liberar novas compras.'}</p>}
    {data?.job?.error_code && <p className="inline-alert danger" role="alert">{catalogMessages[data.job.error_code] ?? 'A preparação não terminou. Revise a configuração da integração no servidor.'}</p>}
    {error && <p className="inline-alert danger" role="alert">{error.message}</p>}
    {data && !data.enabled && <p>A automação está desativada neste ambiente.</p>}
    {data && <ReviewMetadata key={`${offeringId}:${data.version}`} item={data}
      disabled={active || inReview} onSaved={() => void status.refetch()} />}
    <div className="user-dialog-actions">
      <button type="button" className="button secondary" onClick={() => void status.refetch()} disabled={status.isFetching}>
        <RefreshCw size={16} className={status.isFetching ? 'spin' : undefined} /> Atualizar
      </button>
      {data?.product && <button type="button" className="button secondary" onClick={() => prepare.mutate({ item: data, action: 'sync' })} disabled={!data.enabled || active || prepare.isPending}>Conferir na Apple</button>}
      <button type="button" className="button primary" onClick={() => data && prepare.mutate({ item: data, action: data.product ? 'publish' : 'prepare' })}
        disabled={!data?.enabled || active || inReview || prepare.isPending || data.offering.price === null || data.offering.price <= 0 || data.product?.status === 'ready' || Boolean(data.product && !metadataReady)}>
        {prepare.isPending ? 'Solicitando…' : inReview ? 'Enviado para revisão' : data?.product ? 'Configurar e enviar à Apple' : 'Preparar na Apple'}
      </button>
    </div>
    <p>Preparar não libera vendas. Metadados, preço disponível na loja e aprovação da Apple são etapas separadas.</p>
  </section>;
}
