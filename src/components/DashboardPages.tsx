import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BadgeCheck,
  CreditCard,
  Dumbbell,
  Gauge,
  HandCoins,
  HeartHandshake,
  Heart,
  Hourglass,
  Mail,
  MessageCircle,
  ReceiptText,
  RefreshCw,
  Repeat2,
  Rss,
  Bookmark,
  Sparkles,
  TrendingUp,
  UserMinus,
  UserPlus,
  Users,
  UsersRound,
  WalletCards,
} from 'lucide-react';
import { type ReactNode, useMemo, useState } from 'react';
import { formatCurrency, formatCurrencyExact, formatDateTime, formatDecimal, formatNumber, formatPercent, parseSnapshotDay } from '../lib/format';
import { displayName } from '../lib/users';
import type { DashboardSnapshot } from '../lib/dashboard';
import {
  NETWORK_USER_SEGMENTS,
  type DashboardSectionId,
  type NetworkHealthSnapshot,
  type NetworkHealthUser,
  type NetworkUserSegment,
} from '../lib/networkHealth';
import { useNetworkHealthSnapshot, useNetworkHealthUsers } from '../hooks/useNetworkHealth';
import { useDashboardSnapshot } from '../hooks/useDashboardSnapshot';
import { useCurrentStaffRole } from '../hooks/useStaffManagement';
import { DashboardBoundary, DashboardSection, MetricCard, MetricGrid, MetricSkeleton } from './DashboardKit';
import { AppActivityChart, DauChart, FinanceChart, SystemEventsPanel } from './DashboardCharts';
import { UserDetail } from './UserDetail';

const PAGE_SIZE = 25;
const POST_SAVING_VISIBLE = false;

const SECTION_COPY: Record<DashboardSectionId, { title: string; subtitle: string }> = {
  'health-overview': { title: 'Visão geral', subtitle: 'O funil da rede em um só lugar, 30 dias contra os 30 anteriores' },
  'health-growth': { title: 'Crescimento', subtitle: 'Aquisição, ativação e retenção da base' },
  'health-engagement': { title: 'Engajamento', subtitle: 'Uso recorrente e valor produzido pela rede' },
  'health-business': { title: 'Negócio', subtitle: 'Receita, monetização e liquidação' },
  'health-operations': { title: 'Operação', subtitle: 'Volume do app, moderação e filas do sistema' },
  'health-users': { title: 'Recortes da rede', subtitle: 'Quem está por trás de cada indicador' },
};

function PageHeader({
  title,
  subtitle,
  generatedAt,
  fetching,
  onRefresh,
}: {
  title: string;
  subtitle: string;
  generatedAt?: string;
  fetching: boolean;
  onRefresh: () => void;
}) {
  return (
    <header className="page-header">
      <div>
        <p className="section-label">Dashboard</p>
        <h1>{title}</h1>
        <span>{generatedAt ? `${subtitle} · atualizado em ${formatDateTime(new Date(generatedAt))}` : subtitle}</span>
      </div>
      <div className="header-actions">
        <button className="button secondary" type="button" onClick={onRefresh} disabled={fetching}>
          <RefreshCw className={fetching ? 'spin' : ''} size={16} />
          Atualizar
        </button>
      </div>
    </header>
  );
}

function QueryState<TData>({
  query,
  message,
  skeletonCount = 6,
  children,
}: {
  query: { isLoading: boolean; isError: boolean; data: TData | undefined };
  message: string;
  skeletonCount?: number;
  children: (data: TData) => ReactNode;
}) {
  if (query.isLoading) return <MetricSkeleton count={skeletonCount} />;

  if (query.isError || !query.data) {
    return (
      <div className="inline-alert soft" role="alert">
        <AlertTriangle size={18} />
        {message}
      </div>
    );
  }

  return <>{children(query.data)}</>;
}

function SnapshotNotes({ notes }: { notes: string[] }) {
  if (notes.length === 0) return null;
  return (
    <div className="inline-alert soft" role="status">
      <AlertTriangle size={18} />
      {notes.join(' ')}
    </div>
  );
}

type DrillDown = (segment: NetworkUserSegment) => void;

function cohortWeekLabel(weekStart: string): string {
  const day = parseSnapshotDay(weekStart);
  if (!day) return '—';
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(day);
}

function OverviewPage({ data, onOpenUsers }: { data: NetworkHealthSnapshot; onOpenUsers: DrillDown }) {
  const k = data.kpis;
  const b = data.business;

  return (
    <>
      <DashboardSection
        title="Funil da rede"
        description="Cadastro → ativação → engajamento → retenção → monetização. Cada número traz o período anterior e a tendência."
      >
        <MetricGrid>
          <MetricCard
            title="WMEU · North Star"
            value={formatNumber(k.wmeu)}
            icon={UsersRound}
            comparison={{ label: `${formatNumber(k.wmeu_prev)} na semana anterior`, current: k.wmeu, previous: k.wmeu_prev }}
            onOpen={() => onOpenUsers('wmeu')}
          />
          <MetricCard
            title="Novos cadastros"
            value={formatNumber(k.new_users)}
            icon={UserPlus}
            comparison={{ label: `${formatNumber(k.new_users_prev)} no período anterior`, current: k.new_users, previous: k.new_users_prev }}
          />
          <MetricCard
            title="Ativação em 7 dias"
            value={formatPercent(k.activation_rate)}
            icon={Sparkles}
            comparison={{ label: `${formatPercent(k.activation_rate_prev)} na coorte anterior`, current: k.activation_rate, previous: k.activation_rate_prev }}
            detail={`${formatNumber(k.activation_cohort)} cadastros na coorte madura`}
            onOpen={() => onOpenUsers('never_activated')}
          />
          <MetricCard
            title="DAU"
            value={formatNumber(k.dau)}
            icon={Activity}
            comparison={{ label: `${formatNumber(k.dau_prev)} ontem`, current: k.dau, previous: k.dau_prev }}
            onOpen={() => onOpenUsers('dau')}
          />
          <MetricCard
            title="MAU"
            value={formatNumber(k.mau)}
            icon={Users}
            comparison={{ label: `${formatNumber(k.mau_prev)} no período anterior`, current: k.mau, previous: k.mau_prev }}
            onOpen={() => onOpenUsers('mau')}
          />
          <MetricCard
            title="DAU / MAU"
            value={formatPercent(k.stickiness)}
            icon={Repeat2}
            comparison={{ label: `${formatPercent(k.stickiness_prev)} no período anterior`, current: k.stickiness, previous: k.stickiness_prev }}
          />
          <MetricCard
            title="Interações por MAU"
            value={formatDecimal(k.interactions_per_mau)}
            icon={MessageCircle}
            detail={`${formatDecimal(k.meaningful_per_mau)} de relacionamento`}
          />
          <MetricCard
            title="Creators ativos"
            value={formatNumber(k.creators_active)}
            icon={Rss}
            detail={`${formatPercent(k.posted_share)} do MAU publicou nos últimos 30 dias`}
          />
          <MetricCard
            title="Posts com interação"
            value={formatPercent(k.posts_with_interaction)}
            icon={HeartHandshake}
            detail={`${formatPercent(k.publishers_received_interaction)} de quem publicou recebeu retorno`}
          />
          <MetricCard
            title="Retenção D30"
            value={formatPercent(k.retention_d30)}
            icon={TrendingUp}
            comparison={{ label: `${formatPercent(k.retention_d30_prev)} na coorte anterior`, current: k.retention_d30, previous: k.retention_d30_prev }}
            detail={`D1 ${formatPercent(k.retention_d1)} · D7 ${formatPercent(k.retention_d7)}`}
          />
          <MetricCard
            title="Churn mensal"
            value={formatPercent(k.churn_rate)}
            icon={UserMinus}
            detail={`${formatNumber(k.churned)} saíram do MAU`}
            onOpen={() => onOpenUsers('churned')}
          />
          <MetricCard
            title="Crescimento líquido"
            value={formatNumber(k.net_growth)}
            icon={UsersRound}
            detail={`+${formatNumber(k.new_users)} novos · +${formatNumber(k.reactivated)} reativados · −${formatNumber(k.churned)} churn`}
            onOpen={() => onOpenUsers('reactivated')}
          />
          <MetricCard
            title="Receita em 30 dias"
            value={formatCurrencyExact(b.gross_30)}
            icon={WalletCards}
            tone="finance"
            comparison={{ label: `${formatCurrencyExact(b.gross_prev)} no período anterior`, current: b.gross_30, previous: b.gross_prev }}
            detail={`${formatPercent(b.paid_conversion)} do MAU pagou`}
          />
        </MetricGrid>
      </DashboardSection>

      <p className="health-definition"><strong>WMEU</strong> {data.definitions.wmeu}</p>
    </>
  );
}

function GrowthPage({ data, onOpenUsers }: { data: NetworkHealthSnapshot; onOpenUsers: DrillDown }) {
  const k = data.kpis;
  const a = data.acquisition;

  return (
    <>
      <DashboardSection title="Aquisição" description="Estamos conseguindo atrair pessoas?">
        <MetricGrid>
          <MetricCard
            title="Novos cadastros"
            value={formatNumber(a.new_users)}
            icon={UserPlus}
            comparison={{ label: `${formatNumber(a.new_users_prev)} nos 30 dias anteriores`, current: a.new_users, previous: a.new_users_prev }}
            onOpen={() => onOpenUsers('never_activated')}
          />
          <MetricCard
            title="Base total"
            value={formatNumber(a.profiles_total)}
            icon={Users}
            detail="Contas com perfil na plataforma"
          />
          <MetricCard
            title="CAC"
            value={a.cac == null ? '—' : formatCurrencyExact(a.cac)}
            icon={WalletCards}
            detail={a.cac == null ? 'Sem investimento de aquisição registrado' : 'Custo médio por cadastro'}
          />
          <MetricCard
            title="Visitante → cadastro"
            value={formatPercent(a.visitor_conversion)}
            icon={ArrowUpRight}
            detail={a.visitor_conversion == null ? 'A plataforma não registra tráfego anônimo' : 'Conversão do tráfego que chega'}
          />
        </MetricGrid>
      </DashboardSection>

      <DashboardSection title="Ativação" description="Novos usuários entendem o valor da plataforma?">
        <MetricGrid>
          <MetricCard
            title="Ativação em 7 dias"
            value={formatPercent(k.activation_rate)}
            icon={Sparkles}
            comparison={{ label: `${formatPercent(k.activation_rate_prev)} na coorte anterior`, current: k.activation_rate, previous: k.activation_rate_prev }}
            onOpen={() => onOpenUsers('never_activated')}
          />
          <MetricCard
            title="Onboarding concluído"
            value={formatPercent(k.onboarding_completed_share)}
            icon={BadgeCheck}
            detail="Sobre a base inteira, não só a coorte de 7 dias"
          />
          <MetricCard
            title="Coorte madura"
            value={formatNumber(k.activation_cohort)}
            icon={UserPlus}
            detail="Cadastros com 7 a 36 dias, já passíveis de ativação"
          />
        </MetricGrid>
        <p className="health-definition"><strong>Ativado</strong> {data.definitions.activated}</p>
      </DashboardSection>

      <DashboardSection title="Retenção" description="Elas continuam usando depois de conhecer?">
        <MetricGrid>
          <MetricCard
            title="Retenção D1"
            value={formatPercent(k.retention_d1)}
            icon={TrendingUp}
            comparison={{ label: `${formatPercent(k.retention_d1_prev)} na coorte anterior`, current: k.retention_d1, previous: k.retention_d1_prev }}
          />
          <MetricCard
            title="Retenção D7"
            value={formatPercent(k.retention_d7)}
            icon={Repeat2}
            comparison={{ label: `${formatPercent(k.retention_d7_prev)} na coorte anterior`, current: k.retention_d7, previous: k.retention_d7_prev }}
          />
          <MetricCard
            title="Retenção D30"
            value={formatPercent(k.retention_d30)}
            icon={Activity}
            comparison={{ label: `${formatPercent(k.retention_d30_prev)} na coorte anterior`, current: k.retention_d30, previous: k.retention_d30_prev }}
          />
          <MetricCard
            title="Churn"
            value={formatPercent(k.churn_rate)}
            icon={UserMinus}
            detail={`${formatNumber(k.churned)} saíram do MAU`}
            onOpen={() => onOpenUsers('churned')}
          />
          <MetricCard
            title="Reativados"
            value={formatNumber(k.reactivated)}
            icon={UserPlus}
            detail="Voltaram depois de 30 dias parados"
            onOpen={() => onOpenUsers('reactivated')}
          />
          <MetricCard
            title="Não voltaram"
            value={formatNumber(k.one_and_done)}
            icon={UsersRound}
            detail={data.definitions.one_and_done}
            onOpen={() => onOpenUsers('one_and_done')}
          />
        </MetricGrid>

        <div className="table-wrapper">
          <table className="staff-table">
            <caption className="sr-only">Coortes semanais de cadastro e retorno em D1, D7 e D30</caption>
            <thead>
              <tr>
                <th>Semana</th>
                <th>Cadastros</th>
                <th>D1</th>
                <th>D7</th>
                <th>D30</th>
              </tr>
            </thead>
            <tbody>
              {data.cohorts.length === 0 ? (
                <tr><td colSpan={5}>Ainda não há coortes suficientes.</td></tr>
              ) : data.cohorts.map((cohort) => (
                <tr key={cohort.week_start}>
                  <td>{cohortWeekLabel(cohort.week_start)}</td>
                  <td>{formatNumber(cohort.cohort_n)}</td>
                  <td>{formatPercent(cohort.d1)}</td>
                  <td>{formatPercent(cohort.d7)}</td>
                  <td>{formatPercent(cohort.d30)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardSection>
    </>
  );
}

function EngagementPage({ data, onOpenUsers }: { data: NetworkHealthSnapshot; onOpenUsers: DrillDown }) {
  const k = data.kpis;
  const n = data.network;

  return (
    <>
      <DashboardSection title="Uso" description="As pessoas realmente voltam e agem na rede?">
        <MetricGrid>
          <MetricCard
            title="DAU"
            value={formatNumber(k.dau)}
            icon={Activity}
            comparison={{ label: `${formatNumber(k.dau_prev)} ontem`, current: k.dau, previous: k.dau_prev }}
            onOpen={() => onOpenUsers('dau')}
          />
          <MetricCard
            title="WAU"
            value={formatNumber(k.wau)}
            icon={Repeat2}
            comparison={{ label: `${formatNumber(k.wau_prev)} na semana anterior`, current: k.wau, previous: k.wau_prev }}
          />
          <MetricCard
            title="MAU"
            value={formatNumber(k.mau)}
            icon={Users}
            comparison={{ label: `${formatNumber(k.mau_prev)} nos 30 dias anteriores`, current: k.mau, previous: k.mau_prev }}
            onOpen={() => onOpenUsers('mau')}
          />
          <MetricCard
            title="Stickiness"
            value={formatPercent(k.stickiness)}
            icon={TrendingUp}
            comparison={{ label: `${formatPercent(k.stickiness_prev)} no período anterior`, current: k.stickiness, previous: k.stickiness_prev }}
          />
          <MetricCard
            title="Interações / MAU"
            value={formatDecimal(k.interactions_per_mau)}
            icon={MessageCircle}
            detail={`${formatDecimal(k.meaningful_per_mau)} de relacionamento (comentário, mensagem, follow)`}
          />
          <MetricCard
            title="WMEU"
            value={formatNumber(k.wmeu)}
            icon={UsersRound}
            comparison={{ label: `${formatNumber(k.wmeu_prev)} na semana anterior`, current: k.wmeu, previous: k.wmeu_prev }}
            onOpen={() => onOpenUsers('wmeu')}
          />
        </MetricGrid>
        <DauChart series={data.dauSeries} />
        <p className="health-definition"><strong>Ativo</strong> {data.definitions.active}</p>
      </DashboardSection>

      <DashboardSection title="Rede e conteúdo" description="A rede está produzindo valor e conectando gente?">
        <MetricGrid>
          <MetricCard
            title="Posts em 30 dias"
            value={formatNumber(n.posts_30)}
            icon={Rss}
            comparison={{ label: `${formatNumber(n.posts_prev)} no período anterior`, current: n.posts_30, previous: n.posts_prev }}
          />
          <MetricCard
            title="Comentários / follows / DMs"
            value={`${formatNumber(n.comments_30)} · ${formatNumber(n.follows_30)} · ${formatNumber(n.messages_30)}`}
            icon={MessageCircle}
            detail="Volume bruto dos últimos 30 dias"
          />
          <MetricCard
            title="Creators / MAU"
            value={formatPercent(k.creators_share)}
            icon={Users}
            detail={`${formatNumber(k.creators_active)} publicaram`}
          />
          <MetricCard
            title="Posts com interação"
            value={formatPercent(k.posts_with_interaction)}
            icon={HeartHandshake}
            detail={`${formatPercent(n.posts_without_interaction_share)} ficaram sem retorno`}
            onOpen={() => onOpenUsers('posted_no_interaction')}
          />
          <MetricCard
            title="Quem publicou e recebeu"
            value={formatPercent(k.publishers_received_interaction)}
            icon={Sparkles}
            detail={k.hours_to_first_interaction == null
              ? 'Sem amostra de tempo até a primeira interação'
              : `${formatDecimal(k.hours_to_first_interaction, 1)} h até a primeira interação`}
          />
          <MetricCard
            title="Sem conexões"
            value={formatPercent(n.no_connections_share)}
            icon={UsersRound}
            detail={`${formatNumber(n.no_connections)} contas sem follow em nenhum sentido`}
            onOpen={() => onOpenUsers('no_connections')}
          />
          <MetricCard
            title="Follows médios"
            value={formatDecimal(n.avg_follows)}
            icon={Repeat2}
            detail="Conexões ativas por conta"
          />
          <MetricCard
            title="Concentração top 1% / 10%"
            value={`${formatPercent(n.top1_content_share)} · ${formatPercent(n.top10_content_share)}`}
            icon={TrendingUp}
            detail="Fatia dos posts dos últimos 30 dias"
          />
          <MetricCard
            title="Pares distintos na semana"
            value={formatNumber(n.distinct_pairs_week)}
            icon={Activity}
            detail="Mensagem, follow ou comentário entre duas pessoas"
          />
        </MetricGrid>
      </DashboardSection>
    </>
  );
}

function BusinessNetworkBlock({ data }: { data: NetworkHealthSnapshot }) {
  const b = data.business;
  const cacLtv = b.cac != null && b.cac > 0 ? formatDecimal(b.ltv / b.cac) : '—';

  return (
    <MetricGrid>
      <MetricCard
        title="Receita em 30 dias"
        value={formatCurrencyExact(b.gross_30)}
        icon={WalletCards}
        tone="finance"
        comparison={{ label: `${formatCurrencyExact(b.gross_prev)} no período anterior`, current: b.gross_30, previous: b.gross_prev }}
      />
      <MetricCard
        title="ARPU"
        value={formatCurrencyExact(b.arpu)}
        icon={Activity}
        tone="finance"
        detail="Receita bruta do período ÷ MAU"
      />
      <MetricCard
        title="Conversão paga"
        value={formatPercent(b.paid_conversion)}
        icon={UserPlus}
        tone="finance"
        comparison={{ label: `${formatNumber(b.paid_users_prev)} pagantes no período anterior`, current: b.paid_users_30, previous: b.paid_users_prev }}
        detail={`${formatNumber(b.paid_users_30)} pessoas pagaram nos últimos 30 dias`}
      />
      <MetricCard
        title="LTV observado"
        value={formatCurrencyExact(b.ltv)}
        icon={TrendingUp}
        tone="finance"
        detail={`${formatNumber(b.paid_ever)} pessoas já pagaram alguma vez`}
      />
      <MetricCard
        title="LTV / CAC"
        value={cacLtv}
        icon={Gauge}
        tone="finance"
        detail={b.cac == null
          ? 'CAC indisponível sem investimento de aquisição registrado'
          : `CAC ${formatCurrencyExact(b.cac)} por cliente`}
      />
      <MetricCard
        title="Assinaturas ativas"
        value={formatNumber(b.active_subscriptions)}
        icon={Repeat2}
        tone="finance"
        detail="Recorrências vigentes na plataforma"
      />
    </MetricGrid>
  );
}

function BusinessCashBlock({ data }: { data: DashboardSnapshot }) {
  const f = data.finance;

  return (
    <>
      <MetricGrid>
        <MetricCard
          title="Receita acumulada"
          value={formatCurrency(f.gross_revenue_total)}
          icon={CreditCard}
          tone="finance"
          detail={`${formatNumber(f.transactions_total)} transações registradas`}
        />
        <MetricCard
          title="Receita no mês"
          value={formatCurrency(f.transactions_paid_month_value)}
          icon={ReceiptText}
          tone="finance"
          detail={`${formatNumber(f.transactions_paid_month_count)} pagamentos confirmados`}
        />
        <MetricCard
          title="Pagamentos hoje"
          value={formatCurrency(f.transactions_paid_today_value)}
          icon={Gauge}
          tone="finance"
          detail={`${formatNumber(f.transactions_paid_today_count)} cobranças confirmadas`}
        />
        <MetricCard
          title="Comissão acumulada"
          value={formatCurrency(f.platform_commission_total)}
          icon={WalletCards}
          tone="finance"
          detail="Receita OnlyFit retida nas transações"
        />
        <MetricCard
          title="Repasse acumulado"
          value={formatCurrency(f.net_revenue_total)}
          icon={HandCoins}
          tone="finance"
          detail="Valor líquido devido aos profissionais"
        />
        <MetricCard
          title="Liquidação pendente"
          value={formatCurrency(f.pending_settlement_value)}
          icon={Hourglass}
          tone="finance"
          detail="Valor líquido ainda não liquidado"
        />
      </MetricGrid>

      {f.transactions_total === 0 && (
        <div className="inline-alert soft" role="status">
          <CreditCard size={18} />
          Nenhuma transação financeira foi registrada ainda. Os indicadores ficam zerados até a primeira cobrança confirmada.
        </div>
      )}

      <FinanceChart finance={data.weeklyFinance} />
    </>
  );
}

function OperationsPage({ data }: { data: DashboardSnapshot }) {
  const o = data.overview;
  const app = data.appActivity;

  return (
    <>
      <DashboardSection title="Volume do app" description="O que a base produziu, no acumulado e hoje.">
        <MetricGrid>
          <MetricCard
            title="Cadastros hoje"
            value={formatNumber(o.profiles_created_today)}
            icon={UserPlus}
            detail={`${formatNumber(o.profiles_total)} contas na base`}
          />
          <MetricCard
            title="Treinos hoje"
            value={formatNumber(o.workout_sessions_completed_today)}
            icon={Dumbbell}
            detail={`${formatNumber(app.workout_sessions_total)} sessões concluídas no histórico`}
          />
          <MetricCard
            title="Posts publicados"
            value={formatNumber(app.posts_total)}
            icon={Rss}
            detail={`${formatNumber(app.posts_published_today)} novos hoje`}
          />
          <MetricCard
            title="Criadores"
            value={formatNumber(app.active_creators_total)}
            icon={Users}
            detail="Contas que já publicaram conteúdo"
          />
          <MetricCard
            title="Curtidas"
            value={formatNumber(app.post_likes_total)}
            icon={Heart}
            detail="Interações registradas em posts"
          />
          <MetricCard
            title="Comentários"
            value={formatNumber(app.post_comments_total)}
            icon={MessageCircle}
            detail="Conversas registradas no feed"
          />
          {POST_SAVING_VISIBLE ? <MetricCard
            title="Salvos"
            value={formatNumber(app.feed_saves_total)}
            icon={Bookmark}
            detail="Conteúdos guardados pelos usuários"
          /> : null}
        </MetricGrid>
      </DashboardSection>

      <DashboardSection title="Filas operacionais" description="O que espera ação da equipe agora.">
        <MetricGrid>
          <MetricCard
            title="Denúncias pendentes"
            value={formatNumber(o.pending_content_reports)}
            icon={AlertTriangle}
            tone={o.pending_content_reports > 0 ? 'attention' : 'neutral'}
            detail="Fila de moderação aguardando triagem"
          />
        </MetricGrid>
        <div className="lower-grid split">
          <AppActivityChart activity={data.weeklyActivity} />
          <SystemEventsPanel outbox={data.outbox} />
        </div>
      </DashboardSection>
    </>
  );
}

function UserSegmentsPage({
  initialSegment,
  onComposeEmail,
}: {
  initialSegment: NetworkUserSegment;
  onComposeEmail: (emails: string[]) => void;
}) {
  const { data: currentRole } = useCurrentStaffRole();
  const canEdit = currentRole === 'super_admin' || currentRole === 'admin';
  const canDelete = currentRole === 'super_admin';
  const [segment, setSegment] = useState<NetworkUserSegment>(initialSegment);
  const [page, setPage] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const query = useNetworkHealthUsers(segment, page, PAGE_SIZE, !selectedUserId);
  const items = useMemo(() => query.data?.items ?? [], [query.data]);
  const total = query.data?.total ?? 0;
  const maxPage = Math.max(0, Math.ceil(total / PAGE_SIZE) - 1);

  const selectedEmails = useMemo(
    () => items.filter((item) => selected.has(item.id) && item.email).map((item) => item.email as string),
    [items, selected],
  );

  if (selectedUserId) {
    return (
      <UserDetail
        userId={selectedUserId}
        canEdit={canEdit}
        canDelete={canDelete}
        onBack={() => setSelectedUserId(null)}
        onDeleted={() => setSelectedUserId(null)}
      />
    );
  }

  const copyEmails = async () => {
    const emails = selectedEmails.length > 0
      ? selectedEmails
      : items.map((item) => item.email).filter((email): email is string => Boolean(email));
    if (emails.length === 0) return;
    await navigator.clipboard.writeText(emails.join(', '));
  };

  const copy = SECTION_COPY['health-users'];

  return (
    <>
      <PageHeader
        title={copy.title}
        subtitle={copy.subtitle}
        generatedAt={query.data?.generatedAt || undefined}
        fetching={query.isFetching}
        onRefresh={() => { void query.refetch(); }}
      />

      <section className="content">
        <div className="beta-segments" role="tablist" aria-label="Segmentos de usuários">
          {NETWORK_USER_SEGMENTS.map((option) => (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={segment === option.id}
              className={segment === option.id ? 'active' : ''}
              onClick={() => { setSegment(option.id); setPage(0); setSelected(new Set()); }}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="health-users-toolbar">
          <p>{formatNumber(total)} pessoa(s) neste recorte</p>
          <div className="header-actions">
            <button className="button secondary" type="button" onClick={() => void copyEmails()} disabled={items.every((item) => !item.email)}>
              Copiar e-mails
            </button>
            <button
              className="button primary"
              type="button"
              disabled={selectedEmails.length === 0}
              onClick={() => onComposeEmail(selectedEmails.slice(0, 50))}
            >
              <Mail size={16} />
              Escrever e-mail
            </button>
          </div>
        </div>

        {query.isLoading ? (
          <div className="skeleton staff-skeleton" />
        ) : query.isError ? (
          <div className="inline-alert danger" role="alert">
            <AlertTriangle size={18} />
            Não foi possível listar este recorte.
          </div>
        ) : items.length === 0 ? (
          <div className="access-panel inline-access" role="status">
            <div className="status-icon"><UsersRound size={24} /></div>
            <div>
              <h2>Ninguém neste recorte</h2>
              <p>Quando houver contas que se encaixem na definição, elas aparecem aqui.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="staff-table user-table">
                <thead>
                  <tr>
                    <th><span className="sr-only">Selecionar</span></th>
                    <th>Pessoa</th>
                    <th>Contato</th>
                    <th>Cadastro</th>
                    <th>Última atividade</th>
                    <th>Dias ativos</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((user) => (
                    <SegmentUserRow
                      key={user.id}
                      user={user}
                      checked={selected.has(user.id)}
                      onToggle={() => {
                        setSelected((current) => {
                          const next = new Set(current);
                          if (next.has(user.id)) next.delete(user.id);
                          else next.add(user.id);
                          return next;
                        });
                      }}
                      onOpen={() => setSelectedUserId(user.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="user-pagination">
              <span>{formatNumber(total)} resultado(s)</span>
              <button className="button secondary" type="button" onClick={() => setPage((current) => Math.max(0, current - 1))} disabled={page === 0}>Anterior</button>
              <button className="button secondary" type="button" onClick={() => setPage((current) => Math.min(maxPage, current + 1))} disabled={page >= maxPage}>Próxima</button>
            </div>
          </>
        )}
      </section>
    </>
  );
}

function SegmentUserRow({
  user,
  checked,
  onToggle,
  onOpen,
}: {
  user: NetworkHealthUser;
  checked: boolean;
  onToggle: () => void;
  onOpen: () => void;
}) {
  const name = displayName(user);
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <tr className="user-row">
      <td onClick={(event) => event.stopPropagation()}>
        <input type="checkbox" checked={checked} onChange={onToggle} aria-label={`Selecionar ${name}`} disabled={!user.email} />
      </td>
      <td>
        <div className="user-identity">
          {user.avatar_url
            ? <img className="user-avatar" src={user.avatar_url} alt="" />
            : <div className="user-avatar placeholder" aria-hidden="true">{initials}</div>}
          <div>
            <button className="user-row-open" type="button" onClick={onOpen}>{name}</button>
            <span>{user.username ? `@${user.username}` : 'sem @usuário'}</span>
          </div>
        </div>
      </td>
      <td>
        <strong>{user.email ?? '—'}</strong>
        <span>{user.onboarding_completed ? 'onboarding ok' : 'onboarding pendente'}</span>
      </td>
      <td>{user.created_at ? formatDateTime(new Date(user.created_at)) : '—'}</td>
      <td>{user.last_activity_at ? formatDateTime(new Date(user.last_activity_at)) : 'nunca'}</td>
      <td>{formatNumber(user.activity_days)}</td>
    </tr>
  );
}

const HEALTH_ERROR = 'Não foi possível montar os indicadores da rede. Atualize e confira se a migration do banco já foi aplicada.';
const OPS_ERROR = 'O snapshot operacional não respondeu agora. Atualize para tentar de novo.';

export function DashboardPage({
  section,
  onComposeEmail,
  onNavigate,
}: {
  section: DashboardSectionId;
  onComposeEmail: (emails: string[]) => void;
  onNavigate: (section: DashboardSectionId) => void;
}) {
  const needsHealth = section !== 'health-operations' && section !== 'health-users';
  const needsOps = section === 'health-operations' || section === 'health-business';
  const healthQuery = useNetworkHealthSnapshot(needsHealth);
  const opsQuery = useDashboardSnapshot(needsOps);
  const [usersSegment, setUsersSegment] = useState<NetworkUserSegment>('one_and_done');
  const [usersNonce, setUsersNonce] = useState(0);

  if (section === 'health-users') {
    return (
      <UserSegmentsPage
        key={`${usersSegment}-${usersNonce}`}
        initialSegment={usersSegment}
        onComposeEmail={onComposeEmail}
      />
    );
  }

  const openUsers = (segment: NetworkUserSegment) => {
    setUsersSegment(segment);
    setUsersNonce((value) => value + 1);
    onNavigate('health-users');
  };

  const copy = SECTION_COPY[section];
  const generatedAt = needsHealth ? healthQuery.data?.generatedAt : opsQuery.data?.generatedAt;
  const fetching = (needsHealth && healthQuery.isFetching) || (needsOps && opsQuery.isFetching);

  const refresh = () => {
    if (needsHealth) void healthQuery.refetch();
    if (needsOps) void opsQuery.refetch();
  };

  return (
    <>
      <PageHeader
        title={copy.title}
        subtitle={copy.subtitle}
        generatedAt={generatedAt}
        fetching={fetching}
        onRefresh={refresh}
      />

      <section className="content">
        <DashboardBoundary key={section}>
          {section === 'health-overview' && (
            <QueryState query={healthQuery} message={HEALTH_ERROR} skeletonCount={12}>
              {(data) => (
                <>
                  <SnapshotNotes notes={data.notes} />
                  <OverviewPage data={data} onOpenUsers={openUsers} />
                </>
              )}
            </QueryState>
          )}

          {section === 'health-growth' && (
            <QueryState query={healthQuery} message={HEALTH_ERROR}>
              {(data) => (
                <>
                  <SnapshotNotes notes={data.notes} />
                  <GrowthPage data={data} onOpenUsers={openUsers} />
                </>
              )}
            </QueryState>
          )}

          {section === 'health-engagement' && (
            <QueryState query={healthQuery} message={HEALTH_ERROR}>
              {(data) => (
                <>
                  <SnapshotNotes notes={data.notes} />
                  <EngagementPage data={data} onOpenUsers={openUsers} />
                </>
              )}
            </QueryState>
          )}

          {section === 'health-business' && (
            <>
              <DashboardSection title="Resultado da rede" description="Monetização dos últimos 30 dias contra os 30 anteriores.">
                <QueryState query={healthQuery} message={HEALTH_ERROR}>
                  {(data) => (
                    <>
                      <SnapshotNotes notes={data.notes} />
                      <BusinessNetworkBlock data={data} />
                    </>
                  )}
                </QueryState>
              </DashboardSection>

              <DashboardSection title="Caixa e liquidação" description="Cobranças confirmadas, comissão retida e repasse pendente.">
                <QueryState query={opsQuery} message={OPS_ERROR}>
                  {(data) => (
                    <>
                      <SnapshotNotes notes={data.notes} />
                      <BusinessCashBlock data={data} />
                    </>
                  )}
                </QueryState>
              </DashboardSection>
            </>
          )}

          {section === 'health-operations' && (
            <QueryState query={opsQuery} message={OPS_ERROR} skeletonCount={7}>
              {(data) => (
                <>
                  <SnapshotNotes notes={data.notes} />
                  <OperationsPage data={data} />
                </>
              )}
            </QueryState>
          )}
        </DashboardBoundary>
      </section>
    </>
  );
}
