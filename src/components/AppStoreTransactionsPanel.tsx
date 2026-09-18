import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { appleMoney, listAppStoreTransactions, type AppleAccessStatus, type AppleEnvironment } from '../lib/appStoreTransactions';
import { formatDateTime } from '../lib/format';

const accessLabels = { active: 'Vigente', expired: 'Expirada', revoked: 'Revogada' };
const date = (value: string | null) => value ? formatDateTime(new Date(value)) : '—';

export function AppStoreTransactionsPanel() {
  const [environment, setEnvironment] = useState<AppleEnvironment>('Production');
  const [status, setStatus] = useState<AppleAccessStatus | ''>('');
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const query = useQuery({
    queryKey: ['app-store-transactions', environment, status, search, page],
    queryFn: () => listAppStoreTransactions({ environment, status, search, page }),
    staleTime: 15_000,
  });
  return <section className="finance-section apple-transactions" aria-labelledby="apple-transactions-title">
    <div className="section-heading">
      <div><h2 id="apple-transactions-title">Compras Apple</h2><p>{environment === 'Sandbox' ? 'Testes — sem cobrança, saldo ou repasse real.' : 'Comprador, profissional e acesso vinculado à transação.'}</p></div>
      <button className="button secondary" type="button" disabled={query.isFetching} onClick={() => void query.refetch()}><RefreshCw size={16} />Atualizar</button>
    </div>
    <form className="header-actions finance-filter-row" onSubmit={event => { event.preventDefault(); setSearch(input); setPage(0); }}>
      <select aria-label="Ambiente Apple" value={environment} onChange={event => { setEnvironment(event.target.value as AppleEnvironment); setPage(0); }}>
        <option value="Production">Produção</option><option value="Sandbox">TestFlight / Sandbox</option>
      </select>
      <select aria-label="Estado da compra Apple" value={status} onChange={event => { setStatus(event.target.value as AppleAccessStatus | ''); setPage(0); }}>
        <option value="">Todos os estados</option><option value="active">Vigente</option><option value="expired">Expirada</option><option value="revoked">Revogada</option>
      </select>
      <input aria-label="Buscar comprador, profissional, oferta ou transação" placeholder="Pessoa, oferta ou transação" maxLength={200} value={input} onChange={event => setInput(event.target.value)} />
      <button type="submit" className="button secondary">Buscar</button>
    </form>
    {query.isError ? <p role="alert">Não foi possível carregar as compras Apple.</p> : query.isPending ? <p role="status">Carregando…</p> : <>
      {query.data.items.length === 0 ? <p role="status">Nenhuma compra neste filtro.</p> : <div className="table-wrapper"><table className="staff-table">
        <thead><tr><th>Data</th><th>Oferta / negócio</th><th>Comprador</th><th>Profissional</th><th>{environment === 'Sandbox' ? 'Valor simulado' : 'Bruto'}</th><th>Vigência</th><th>Detalhes</th></tr></thead>
        <tbody>{query.data.items.map(item => <tr key={item.id}>
          <td>{date(item.purchase_date)}</td>
          <td><strong>{item.offering_name ?? '—'}</strong><span>{item.organization_name ?? '—'}</span></td>
          <td>{item.buyer_name}</td><td>{item.professional_name}</td>
          <td>{appleMoney(item.gross_value, item.currency)}</td>
          <td><strong>{accessLabels[item.status] ?? '—'}</strong><span>{date(item.expires_date)}</span></td>
          <td><details><summary>Ver transação</summary><dl className="status-list">
            <div><dt>Ambiente</dt><dd>{item.environment === 'Sandbox' ? 'Sandbox — teste' : 'Produção'}</dd></div>
            <div><dt>Transação</dt><dd>{item.transaction_id}</dd></div>
            <div><dt>Assinatura original</dt><dd>{item.original_transaction_id}</dd></div>
            <div><dt>Produto Apple</dt><dd>{item.product_id}</dd></div>
            <div><dt>Acesso atual à oferta</dt><dd>{item.has_access ? 'Liberado' : 'Sem acesso'}</dd></div>
            {item.revoked_at && <div><dt>Revogada em</dt><dd>{date(item.revoked_at)}</dd></div>}
            {item.environment === 'Production' && <>
              <div><dt>Pagamento interno</dt><dd>{item.payment_transaction_id ?? '—'}</dd></div>
              <div><dt>Taxa Apple</dt><dd>{appleMoney(item.provider_fee, item.currency)}</dd></div>
              <div><dt>Comissão</dt><dd>{appleMoney(item.platform_commission, item.currency)}</dd></div>
              <div><dt>Líquido profissional</dt><dd>{appleMoney(item.professional_net, item.currency)}</dd></div>
              <div><dt>Liquidação</dt><dd>{item.settlement_status === 'settled' ? 'Liquidada' : item.settlement_status === 'refunded' ? 'Estornada' : 'Pendente'}</dd></div>
            </>}
          </dl></details></td>
        </tr>)}</tbody>
      </table></div>}
      <div className="header-actions"><span>{query.data.total} compra(s)</span>
        <button type="button" className="button secondary" disabled={page === 0} onClick={() => setPage(page - 1)}>Anterior</button>
        <button type="button" className="button secondary" disabled={(page + 1) * 25 >= query.data.total} onClick={() => setPage(page + 1)}>Próxima</button>
      </div>
    </>}
  </section>;
}
