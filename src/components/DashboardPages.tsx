import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useDashboardSnapshot } from '../hooks/useDashboardSnapshot';
import { formatCurrencyExact, formatDateTime, formatNumber, parseSnapshotDay } from '../lib/format';
import { dashboardMetricCards } from '../lib/dashboardPresentation';
import type { DashboardSectionId } from '../lib/networkHealth';

const COPY: Record<DashboardSectionId, { title: string; subtitle: string }> = {
  'health-overview': { title: 'Visão geral', subtitle: 'Indicadores canônicos do OnlyFit Core' },
  'health-growth': { title: 'Crescimento', subtitle: 'Cadastros na base do Core' },
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
  return <article className="report-metric"><div><span>{label}</span></div><strong>{money ? formatCurrencyExact(value) : formatNumber(value)}</strong></article>;
}

export function DashboardPage({ section }: {
  section: DashboardSectionId;
  onComposeEmail: (emails: string[]) => void;
  onNavigate: (section: DashboardSectionId) => void;
}) {
  const query = useDashboardSnapshot(CORE_SECTION[section]);
  const data = query.data;
  const copy = COPY[section];
  const cards = data ? dashboardMetricCards({
    totals: data.totals,
    overview: data.overview,
    app_activity: data.appActivity,
    finance: data.finance,
    outbox: data.outbox,
  }, section) : [];
  return <>
    <header className="page-header"><div><p className="section-label">Dashboard</p><h1>{copy.title}</h1>
      <span>{data ? `${copy.subtitle} · atualizado em ${formatDateTime(new Date(data.generatedAt))}` : copy.subtitle}</span></div>
      <button className="button secondary" type="button" onClick={() => query.refetch()} disabled={query.isFetching}><RefreshCw className={query.isFetching ? 'spin' : ''} size={16} /> Atualizar</button>
    </header>
    <section className="content">
      {query.isError ? <div className="inline-alert danger" role="alert"><AlertTriangle size={18} /> Não foi possível carregar o dashboard do Core.</div>
        : query.isLoading || !data ? <div className="skeleton staff-skeleton" /> : <>
          <div className="reports-grid">
            {cards.map((card) => <Metric key={card.label} label={card.label} value={card.value} money={card.format === 'money'} />)}
          </div>
          {(section === 'health-overview' || section === 'health-engagement') ? (
            <section className="staff-list-section" aria-labelledby="dashboard-activity-title">
              <div className="section-heading"><h2 id="dashboard-activity-title">Atividade nos últimos sete dias</h2></div>
              <div className="table-wrapper"><table className="staff-table">
                <thead><tr><th>Dia</th><th>Sessões concluídas</th><th>Publicações</th><th>Comentários</th></tr></thead>
                <tbody>{data.weeklyActivity.map((day) => (
                  <tr key={day.date}>
                    <td>{parseSnapshotDay(day.date)?.toLocaleDateString('pt-BR') ?? '—'}</td>
                    <td>{formatNumber(day.completed_sessions)}</td>
                    <td>{formatNumber(day.posts_created)}</td>
                    <td>{formatNumber(day.comments_created)}</td>
                  </tr>
                ))}</tbody>
              </table></div>
            </section>
          ) : null}
          {section === 'health-business' ? (
            <section className="staff-list-section" aria-labelledby="dashboard-finance-title">
              <div className="section-heading"><h2 id="dashboard-finance-title">Financeiro nos últimos sete dias</h2></div>
              <div className="table-wrapper"><table className="staff-table">
                <thead><tr><th>Dia</th><th>Receita bruta</th><th>Comissão OnlyFit</th></tr></thead>
                <tbody>{data.weeklyFinance.map((day) => (
                  <tr key={day.date}>
                    <td>{parseSnapshotDay(day.date)?.toLocaleDateString('pt-BR') ?? '—'}</td>
                    <td>{formatCurrencyExact(day.gross_value)}</td>
                    <td>{formatCurrencyExact(day.platform_commission)}</td>
                  </tr>
                ))}</tbody>
              </table></div>
            </section>
          ) : null}
          {data.notes.length ? <div className="inline-alert soft" role="status">{data.notes.join(' · ')}</div> : null}
        </>}
    </section>
  </>;
}
