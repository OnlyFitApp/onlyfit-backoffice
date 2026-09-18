import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

type Batch = { id: string; period_start: string; period_end: string; processed_rows: number; divergent_rows: number };
type Line = { id: string; product_id: string; result: string; currency: string; gross_amount: number | null; proceeds_amount: number | null };
const resultLabels: Record<string,string> = { matched: 'Conferido', missing_internal: 'Sem compra interna', missing_external: 'Ausente no relatório', amount_mismatch: 'Divergência', ignored: 'Fora do catálogo', pending: 'Pendente' };
const errors: Record<string,string> = {
  apple_finance_disabled: 'A importação financeira Apple ainda não foi ativada no servidor.',
  apple_finance_credentials_missing: 'Configure a credencial Apple e o número de fornecedor no servidor.',
  apple_finance_permission_required: 'A chave Apple precisa de permissão de Finanças para consultar relatórios.',
  apple_report_not_available: 'A Apple ainda não disponibilizou o relatório deste mês fiscal.',
  staff_mfa_required: 'Esta ação exige uma sessão administrativa com MFA.',
};
export function AppStoreReconciliation({ canEdit }: { canEdit: boolean }) {
  const cache = useQueryClient();
  const [month,setMonth] = useState(new Date().toISOString().slice(0,7));
  const [page,setPage] = useState(0);
  const [batch,setBatch] = useState<string | null>(null);
  const [linePage,setLinePage] = useState(0);
  const batches = useQuery({ queryKey: ['apple-reconciliation',page], queryFn: async () => {
    const {data,error} = await supabase.rpc('control_app_store_reconciliation',{p_limit:20,p_offset:page*20});
    if(error)throw new Error('Não foi possível consultar os relatórios Apple.'); return data as Batch[];
  } });
  const lines = useQuery({ queryKey: ['apple-reconciliation-lines',batch,linePage], enabled: !!batch, queryFn: async () => {
    const {data,error} = await supabase.rpc('control_app_store_reconciliation',{p_batch_id:batch,p_limit:20,p_offset:linePage*20});
    if(error)throw new Error('Não foi possível consultar os itens.'); return data as Line[];
  } });
  const run = useMutation({mutationFn: async () => {
    const {data,error} = await supabase.functions.invoke('app-store-financial-reconcile',{body:{month}});
    if(error){const body=error.context instanceof Response?await error.context.json().catch(()=>null):null;
      throw new Error(errors[body?.error] ?? 'Não foi possível importar o relatório Apple.');}
    if(!data?.ok)throw new Error('Importação não confirmada.'); return data;
  },onSuccess:()=>{void cache.invalidateQueries({queryKey:['apple-reconciliation']});}});
  return <details><summary>App Store — relatórios financeiros</summary>
    <p>Conferência por produto e mês fiscal. Não confirma depósito bancário nem libera repasse.</p>
    {canEdit && <div className="header-actions"><label>Mês fiscal<input type="month" value={month} onChange={e=>setMonth(e.target.value)} /></label>
      <button className="button secondary" type="button" disabled={run.isPending || !month} onClick={()=>run.mutate()}>{run.isPending?'Importando…':'Importar da Apple'}</button></div>}
    {(run.error || batches.error || lines.error) && <p role="alert">{(run.error ?? batches.error ?? lines.error)?.message}</p>}
    {batches.isPending ? <p>Carregando…</p> : <div className="table-wrapper"><table className="staff-table"><thead><tr><th>Período fiscal</th><th>Itens</th><th>Divergências</th><th /></tr></thead><tbody>
      {batches.data?.map(b=><tr key={b.id}><td>{b.period_start} — {b.period_end}</td><td>{b.processed_rows}</td><td>{b.divergent_rows}</td><td><button type="button" className="button secondary" onClick={()=>{setBatch(b.id);setLinePage(0);}}>Ver itens</button></td></tr>)}
    </tbody></table></div>}
    <div className="header-actions"><button type="button" disabled={page===0} onClick={()=>setPage(page-1)}>Anterior</button><button type="button" disabled={batches.data?.length!==20} onClick={()=>setPage(page+1)}>Próxima</button></div>
    {batch && <><div className="table-wrapper"><table className="staff-table"><thead><tr><th>Produto</th><th>Situação</th><th>Bruto</th><th>Receita no relatório</th></tr></thead><tbody>{lines.data?.map(l=><tr key={l.id}><td>{l.product_id}</td><td>{resultLabels[l.result] ?? 'Em análise'}</td><td>{l.gross_amount ?? '—'} {l.currency}</td><td>{l.proceeds_amount ?? '—'} {l.currency}</td></tr>)}</tbody></table></div>
      <div className="header-actions"><button type="button" disabled={linePage===0} onClick={()=>setLinePage(linePage-1)}>Anterior</button><button type="button" disabled={lines.data?.length!==20} onClick={()=>setLinePage(linePage+1)}>Próxima</button></div></>}
  </details>;
}
