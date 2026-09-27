import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useDashboardSnapshot } from '../hooks/useDashboardSnapshot';
import { formatCurrencyExact, formatDateTime, formatNumber } from '../lib/format';
import type { DashboardSectionId } from '../lib/networkHealth';

const COPY: Record<DashboardSectionId, { title: string; subtitle: string }> = {
  'health-overview': { title: 'Visão geral', subtitle: 'Indicadores canônicos do OnlyFit Core' },
  'health-growth': { title: 'Crescimento', subtitle: 'Aquisição, ativação e retenção' },
  'health-engagement': { title: 'Engajamento', subtitle: 'Atividade e recorrência da rede' },
  'health-business': { title: 'Negócio', subtitle: 'Receita e monetização' },
  'health-operations': { title: 'Operação', subtitle: 'Filas e saúde operacional' },
  'health-users': { title: 'Contas', subtitle: 'Resumo de contas e organizações' },
};

const CORE_SECTION: Record<DashboardSectionId, 'overview' | 'acquisition' | 'engagement' | 'business' | 'accounts'> = {
  'health-overview': 'overview', 'health-growth': 'acquisition',
  'health-engagement': 'engagement', 'health-business': 'business',
  'health-operations': 'overview', 'health-users': 'accounts',
};

function Metric({ label, value, money = false }: { label: string; value: number; money?: boolean }) {
  return <article className="report-metric"><span>{label}</span><strong>{money ? formatCurrencyExact(value) : formatNumber(value)}</strong></article>;
}

export function DashboardPage({ section }: {
  section: DashboardSectionId;
  onComposeEmail: (emails: string[]) => void;
  onNavigate: (section: DashboardSectionId) => void;
}) {
  const query = useDashboardSnapshot(CORE_SECTION[section]);
  const data = query.data;
  const copy = COPY[section];
  return <>
    <header className="page-header"><div><p className="section-label">Dashboard</p><h1>{copy.title}</h1>
      <span>{data ? `${copy.subtitle} · atualizado em ${formatDateTime(new Date(data.generatedAt))}` : copy.subtitle}</span></div>
      <button className="button secondary" type="button" onClick={() => query.refetch()} disabled={query.isFetching}><RefreshCw className={query.isFetching ? 'spin' : ''} size={16} /> Atualizar</button>
    </header>
    <section className="content">
      {query.isError ? <div className="inline-alert danger" role="alert"><AlertTriangle size={18} /> Não foi possível carregar o dashboard do Core.</div>
        : query.isLoading || !data ? <div className="skeleton staff-skeleton" /> : <>
          <div className="reports-grid">
            <Metric label="Contas" value={data.totals.accounts} />
            <Metric label="Negócios" value={data.totals.businesses} />
            <Metric label="Itens na fila" value={data.totals.open_queue} />
            <Metric label="Receita bruta" value={data.finance.gross_revenue_total} money />
            <Metric label="Comissão OnlyFit" value={data.finance.platform_commission_total} money />
            <Metric label="Sessões concluídas hoje" value={data.overview.workout_sessions_completed_today} />
            <Metric label="Criadores ativos" value={data.appActivity.active_creators_total} />
            <Metric label="Falhas operacionais" value={data.outbox.failed} />
          </div>
          {data.metrics.length ? <div className="table-wrap"><table><thead><tr><th>Data</th><th>Indicador</th><th>Escopo</th><th>Valor</th></tr></thead><tbody>
            {data.metrics.map((metric) => <tr key={`${metric.date}:${metric.name}:${metric.scope}:${metric.scope_id}`}><td>{metric.date}</td><td>{metric.name}</td><td>{metric.scope}</td><td>{formatNumber(metric.value)}</td></tr>)}
          </tbody></table></div> : null}
          {data.notes.length ? <div className="inline-alert soft" role="status">{data.notes.join(' · ')}</div> : null}
        </>}
    </section>
  </>;
}
