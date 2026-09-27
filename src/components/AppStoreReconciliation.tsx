import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { coreApi } from '../api/core';
import type { StaffAppStoreReconciliationLine } from '../api/core.gen';

const resultLabels: Record<StaffAppStoreReconciliationLine['result'], string> = {
  matched: 'Conferido',
  missing_internal: 'Sem compra interna',
  missing_external: 'Ausente no relatório',
  amount_mismatch: 'Divergência',
  ignored: 'Fora do catálogo',
  pending: 'Pendente',
};

export function AppStoreReconciliation({ canEdit }: { canEdit: boolean }) {
  const cache = useQueryClient();
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [page, setPage] = useState(0);
  const [batch, setBatch] = useState<string | null>(null);
  const [linePage, setLinePage] = useState(0);
  const batches = useQuery({
    queryKey: ['apple-reconciliation', page],
    queryFn: () => coreApi.staff.appStoreReconciliationBatches({ limit: 20, offset: page * 20 }),
  });
  const lines = useQuery({
    queryKey: ['apple-reconciliation-lines', batch, linePage],
    enabled: Boolean(batch),
    queryFn: () => {
      if (!batch) throw new Error('Selecione um lote para consultar os itens.');
      return coreApi.staff.appStoreReconciliationLines({
        batchId: batch,
        limit: 20,
        offset: linePage * 20,
      });
    },
  });
  const run = useMutation({
    mutationFn: () => coreApi.staff.appStoreReconciliationStart({
      month,
      idempotencyKey: crypto.randomUUID(),
    }),
    onSuccess: () => { void cache.invalidateQueries({ queryKey: ['apple-reconciliation'] }); },
  });

  return <details><summary>App Store — relatórios financeiros</summary>
    <p>Conferência por produto e mês fiscal. Não confirma depósito bancário nem libera repasse.</p>
    {canEdit && <div className="header-actions"><label>Mês fiscal<input type="month" value={month} onChange={event => setMonth(event.target.value)} /></label>
      <button className="button secondary" type="button" disabled={run.isPending || !month} onClick={() => run.mutate()}>{run.isPending ? 'Importando…' : 'Importar da Apple'}</button></div>}
    {(run.error || batches.error || lines.error) && <p role="alert">Não foi possível consultar ou importar o relatório financeiro Apple.</p>}
    {batches.isPending ? <p>Carregando…</p> : <div className="table-wrapper"><table className="staff-table"><thead><tr><th>Período fiscal</th><th>Itens</th><th>Divergências</th><th /></tr></thead><tbody>
      {batches.data?.items.map(item => <tr key={item.id}><td>{item.period_start} — {item.period_end}</td><td>{item.processed_rows}</td><td>{item.divergent_rows}</td><td><button type="button" className="button secondary" onClick={() => { setBatch(item.id); setLinePage(0); }}>Ver itens</button></td></tr>)}
    </tbody></table></div>}
    <div className="header-actions"><button type="button" disabled={page === 0} onClick={() => setPage(page - 1)}>Anterior</button><button type="button" disabled={batches.data?.items.length !== 20} onClick={() => setPage(page + 1)}>Próxima</button></div>
    {batch && <><div className="table-wrapper"><table className="staff-table"><thead><tr><th>Produto</th><th>Situação</th><th>Bruto</th><th>Receita no relatório</th></tr></thead><tbody>{lines.data?.items.map(item => <tr key={item.id}><td>{item.product_id}</td><td>{resultLabels[item.result]}</td><td>{item.gross_amount ?? '—'} {item.currency}</td><td>{item.proceeds_amount ?? '—'} {item.currency}</td></tr>)}</tbody></table></div>
      <div className="header-actions"><button type="button" disabled={linePage === 0} onClick={() => setLinePage(linePage - 1)}>Anterior</button><button type="button" disabled={lines.data?.items.length !== 20} onClick={() => setLinePage(linePage + 1)}>Próxima</button></div></>}
  </details>;
}
