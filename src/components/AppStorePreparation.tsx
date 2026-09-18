import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { appStoreCatalogCommand, catalogMessages, saveCatalogMetadata, type AppStoreCatalogState, type CatalogAction } from '../lib/appStoreCatalog';
import { appleReviewStateLabel } from '../lib/offeringMonetization';

function ReviewMetadata({ offeringId, metadata, disabled, onSaved }: {
  offeringId: string; metadata: AppStoreCatalogState['metadata']; disabled: boolean; onSaved: () => void;
}) {
  const [description, setDescription] = useState(metadata?.description ?? '');
  const [notes, setNotes] = useState(metadata?.review_notes ?? '');
  const [file, setFile] = useState<File>();
  const save = useMutation({ mutationFn: () => saveCatalogMetadata(offeringId, description, notes, metadata?.screenshot_path ?? null, file), onSuccess: onSaved });
  return <details><summary>Dados para análise da Apple</summary>
    <label>Descrição curta<input value={description} maxLength={45} onChange={e => setDescription(e.target.value)} disabled={disabled || save.isPending} /></label>
    <label>Instruções de acesso para a equipe de análise<textarea value={notes} maxLength={4000} onChange={e => setNotes(e.target.value)} disabled={disabled || save.isPending} /></label>
    <label>Captura real da oferta no app (PNG/JPG, até 5 MB)<input type="file" accept="image/png,image/jpeg" onChange={e => setFile(e.target.files?.[0])} disabled={disabled || save.isPending} /></label>
    {metadata?.screenshot_path && <p>Captura anexada.</p>}
    {save.error && <p role="alert">{save.error.message}</p>}
    <button type="button" className="button secondary" disabled={disabled || save.isPending || !description.trim() || !notes.trim()} onClick={() => save.mutate()}>{save.isPending ? 'Salvando…' : 'Salvar dados'}</button>
  </details>;
}

export function AppStorePreparation({ offeringId }: { offeringId: string }) {
  const cache = useQueryClient();
  const queryKey = ['app-store-preparation', offeringId];
  const status = useQuery({
    queryKey,
    queryFn: () => appStoreCatalogCommand(offeringId, 'status'),
    staleTime: 10_000,
    retry: false,
    refetchInterval: query => ['queued', 'running'].includes(query.state.data?.job?.state ?? '') ? 5_000 : false,
  });
  const prepare = useMutation({
    mutationFn: (action: CatalogAction) => appStoreCatalogCommand(offeringId, action),
    onSuccess: result => {
      cache.setQueryData(queryKey, result);
      void cache.invalidateQueries({ queryKey: ['offering-catalog'] });
    },
  });
  const data = status.data;
  const active = ['queued', 'running'].includes(data?.job?.state ?? '');
  const inReview = ['WAITING_FOR_REVIEW', 'IN_REVIEW', 'PENDING_BINARY_APPROVAL'].includes(data?.product?.apple_review_state ?? '');
  const label = active ? (data?.job?.state === 'queued' ? 'Na fila de preparação' : 'Preparando na Apple')
    : data?.job?.state === 'blocked' ? 'Preparação precisa de atenção'
    : data?.product ? 'Produto vinculado' : 'Ainda não preparado';
  const error = prepare.error ?? status.error;

  return <section aria-label="Preparação automática Apple">
    <h3>Catálogo Apple</h3>
    <p>Cria um produto exclusivo para esta oferta. O preço cheio vem do cálculo do backend; o líquido do profissional não é usado.</p>
    <p role="status" aria-live="polite">{status.isPending ? 'Consultando preparação…' : status.isError ? 'Preparação indisponível' : label}</p>
    {data && <p>Preço cheio para iPhone: {data.offering.ios_price === null ? 'Não configurado' : new Intl.NumberFormat('pt-BR', {
      style: 'currency', currency: data.offering.currency,
    }).format(data.offering.ios_price)}</p>}
    {data?.product && <p>Apple: {appleReviewStateLabel(data.product.apple_review_state)}</p>}
    {data?.product?.status === 'ready' && <p>Produto aprovado e preço conferido.</p>}
    {data?.product?.sync_reason && <p role="alert">{catalogMessages[data.product.sync_reason] ?? 'A configuração precisa ser conferida antes de liberar novas compras.'}</p>}
    {data?.job?.error_code && <p className="inline-alert danger" role="alert">{catalogMessages[data.job.error_code] ?? 'A preparação não terminou. Revise a configuração da integração no servidor.'}</p>}
    {error && <p className="inline-alert danger" role="alert">{error.message}</p>}
    {data && !data.enabled && <p>A automação está desativada neste ambiente.</p>}
    {data && <ReviewMetadata key={`${offeringId}:${JSON.stringify(data.metadata)}`} offeringId={offeringId} metadata={data.metadata}
      disabled={active || inReview} onSaved={() => void status.refetch()} />}
    <div className="user-dialog-actions">
      <button type="button" className="button secondary" onClick={() => void status.refetch()} disabled={status.isFetching}>
        <RefreshCw size={16} className={status.isFetching ? 'spin' : undefined} /> Atualizar
      </button>
      {data?.product && <button type="button" className="button secondary" onClick={() => prepare.mutate('sync')} disabled={!data.enabled || active || prepare.isPending}>Conferir na Apple</button>}
      <button type="button" className="button primary" onClick={() => prepare.mutate(data?.metadata ? 'publish' : 'prepare')}
        disabled={!data?.enabled || active || inReview || prepare.isPending || data.offering.ios_price === null || data.offering.ios_price <= 0 || (data.product?.status === 'ready' && data.job?.source_current)}>
        {prepare.isPending ? 'Solicitando…' : inReview ? 'Enviado para revisão' : data?.metadata ? 'Configurar e enviar à Apple' : 'Preparar na Apple'}
      </button>
    </div>
    <p>Preparar não libera vendas. Metadados, preço disponível na loja e aprovação da Apple são etapas separadas.</p>
  </section>;
}
