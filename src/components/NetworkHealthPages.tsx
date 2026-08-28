import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  HeartHandshake,
  Mail,
  MessageCircle,
  RefreshCw,
  Repeat2,
  Rss,
  Sparkles,
  TrendingUp,
  UserMinus,
  UserPlus,
  Users,
  UsersRound,
  WalletCards,
} from 'lucide-react';
import { type ReactNode, useMemo, useState } from 'react';
import { formatCurrencyExact, formatDateTime, formatDecimal, formatNumber, formatPercent } from '../lib/format';
import { displayName } from '../lib/users';
import {
  NETWORK_USER_SEGMENTS,
  trendLabel,
  trendOf,
  type HealthSectionId,
  type NetworkHealthSnapshot,
  type NetworkHealthUser,
  type NetworkUserSegment,
  type TrendDirection,
} from '../lib/networkHealth';
import { useNetworkHealthSnapshot, useNetworkHealthUsers } from '../hooks/useNetworkHealth';
import { useCurrentStaffRole } from '../hooks/useStaffManagement';
import { UserDetail } from './UserDetail';

const PAGE_SIZE = 25;

type HealthPageProps = {
  section: HealthSectionId;
  onComposeEmail: (emails: string[]) => void;
  onNavigate: (section: HealthSectionId) => void;
};

function KpiCard({
  title,
  value,
  detail,
  icon: Icon,
  onOpen,
}: {
  title: string;
  value: string;
  detail: string;
  icon: typeof Activity;
  onOpen?: () => void;
}) {
  const inner = (
    <>
      <div className="metric-title">
        <span>{title}</span>
        <Icon size={18} />
      </div>
      <strong>{value}</strong>
      <p>{detail}</p>
    </>
  );

  if (onOpen) {
    return (
      <button className="metric-card health-kpi-button" type="button" onClick={onOpen}>
        {inner}
      </button>
    );
  }

  return <article className="metric-card">{inner}</article>;
}

function TrendMark({ current, previous, invert = false }: { current: number | null | undefined; previous: number | null | undefined; invert?: boolean }) {
  const direction = trendOf(current, previous);
  const visual: TrendDirection = invert
    ? (direction === 'up' ? 'down' : direction === 'down' ? 'up' : 'flat')
    : direction;
  const tone = visual === 'flat' ? 'flat' : visual === 'up' ? 'up' : 'down';
  return <span className={`health-trend health-trend-${tone}`}>{trendLabel(direction)}</span>;
}

function CompareTable({
  rows,
}: {
  rows: Array<{ label: string; current: string; previous: string; currentValue?: number | null; previousValue?: number | null; invert?: boolean }>;
}) {
  return (
    <div className="table-wrapper">
      <table className="staff-table health-compare-table">
        <thead>
          <tr>
            <th>Métrica</th>
            <th>Atual</th>
            <th>Período anterior</th>
            <th>Tendência</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td><strong>{row.label}</strong></td>
              <td>{row.current}</td>
              <td>{row.previous}</td>
              <td><TrendMark current={row.currentValue} previous={row.previousValue} invert={row.invert} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HealthHeader({
  kicker,
  title,
  subtitle,
  generatedAt,
  fetching,
  onRefresh,
}: {
  kicker: string;
  title: string;
  subtitle: string;
  generatedAt?: string;
  fetching: boolean;
  onRefresh: () => void;
}) {
  return (
    <header className="page-header">
      <div>
        <p className="section-label">{kicker}</p>
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

function SnapshotBody({
  query,
  children,
}: {
  query: ReturnType<typeof useNetworkHealthSnapshot>;
  children: (data: NetworkHealthSnapshot) => ReactNode;
}) {
  if (query.isLoading) {
    return (
      <div className="dashboard-grid" aria-label="Carregando indicadores">
        {Array.from({ length: 6 }, (_, index) => <div className="skeleton" key={index} />)}
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="inline-alert soft" role="alert">
        <AlertTriangle size={18} />
        Não foi possível montar os indicadores de saúde da rede. Atualize e confira se a migration do banco já foi aplicada.
      </div>
    );
  }

  return (
    <>
      {query.data.notes.length > 0 && (
        <div className="inline-alert soft" role="status">
          <AlertTriangle size={18} />
          {query.data.notes.join(' ')}
        </div>
      )}
      {children(query.data)}
    </>
  );
}

function OverviewPage({
  data,
  onOpenUsers,
}: {
  data: NetworkHealthSnapshot;
  onOpenUsers: (segment: NetworkUserSegment) => void;
}) {
  const k = data.kpis;
  const cards = [
    { title: 'MAU', value: formatNumber(k.mau), detail: `${formatNumber(k.mau_prev)} no período anterior`, icon: Users, onOpen: () => onOpenUsers('mau') },
    { title: 'DAU', value: formatNumber(k.dau), detail: `${formatNumber(k.dau_prev)} ontem`, icon: Activity, onOpen: () => onOpenUsers('dau') },
    { title: 'DAU / MAU', value: formatPercent(k.stickiness), detail: `${formatPercent(k.stickiness_prev)} no período anterior`, icon: Repeat2 },
    { title: 'Retenção D1 / D7 / D30', value: `${formatPercent(k.retention_d1)} · ${formatPercent(k.retention_d7)} · ${formatPercent(k.retention_d30)}`, detail: 'Quem voltou 1, 7 e 30 dias após o cadastro', icon: TrendingUp, onOpen: () => onOpenUsers('one_and_done') },
    { title: 'Ativação em 7 dias', value: formatPercent(k.activation_rate), detail: `${formatNumber(k.activation_cohort)} cadastros na coorte madura`, icon: Sparkles, onOpen: () => onOpenUsers('never_activated') },
    { title: 'Creators ativos', value: formatNumber(k.creators_active), detail: `${formatPercent(k.posted_share)} do MAU publicou nos últimos 30 dias`, icon: Rss },
    { title: 'Interações por MAU', value: formatDecimal(k.interactions_per_mau), detail: `${formatDecimal(k.meaningful_per_mau)} interações de relacionamento`, icon: MessageCircle },
    { title: 'Posts com interação', value: formatPercent(k.posts_with_interaction), detail: `${formatPercent(k.publishers_received_interaction)} dos que publicaram receberam retorno`, icon: HeartHandshake },
    { title: 'Crescimento líquido', value: formatNumber(k.net_growth), detail: `+${formatNumber(k.new_users)} novos · +${formatNumber(k.reactivated)} reativados · −${formatNumber(k.churned)} churn`, icon: UserPlus, onOpen: () => onOpenUsers('churned') },
    { title: 'WMEU', value: formatNumber(k.wmeu), detail: `${formatNumber(k.wmeu_prev)} na semana anterior`, icon: UsersRound, onOpen: () => onOpenUsers('wmeu') },
  ];

  return (
    <>
      <div className="dashboard-grid">
        {cards.map((card) => <KpiCard key={card.title} {...card} />)}
      </div>

      <section className="dashboard-section">
        <div className="dashboard-section-head">
          <div>
            <h2>Funil da rede</h2>
            <p>Cadastro → ativado → engajado → retido → monetizado. 30 dias vs 30 dias anteriores.</p>
          </div>
        </div>
        <CompareTable
          rows={[
            { label: 'Novos cadastros', current: formatNumber(k.new_users), previous: formatNumber(k.new_users_prev), currentValue: k.new_users, previousValue: k.new_users_prev },
            { label: 'Ativação em 7 dias', current: formatPercent(k.activation_rate), previous: formatPercent(k.activation_rate_prev), currentValue: k.activation_rate, previousValue: k.activation_rate_prev },
            { label: 'DAU', current: formatNumber(k.dau), previous: formatNumber(k.dau_prev), currentValue: k.dau, previousValue: k.dau_prev },
            { label: 'MAU', current: formatNumber(k.mau), previous: formatNumber(k.mau_prev), currentValue: k.mau, previousValue: k.mau_prev },
            { label: 'DAU/MAU', current: formatPercent(k.stickiness), previous: formatPercent(k.stickiness_prev), currentValue: k.stickiness, previousValue: k.stickiness_prev },
            { label: 'Retenção D30', current: formatPercent(k.retention_d30), previous: formatPercent(k.retention_d30_prev), currentValue: k.retention_d30, previousValue: k.retention_d30_prev },
            { label: 'Creators ativos', current: formatNumber(k.creators_active), previous: formatPercent(k.creators_share), currentValue: k.creators_share, previousValue: k.creators_share },
            { label: '% posts com interação', current: formatPercent(k.posts_with_interaction), previous: formatPercent(k.publishers_received_interaction), currentValue: k.posts_with_interaction, previousValue: k.publishers_received_interaction },
            { label: 'Churn mensal', current: formatPercent(k.churn_rate), previous: '—', currentValue: k.churn_rate, previousValue: k.churn_rate, invert: true },
            { label: 'WMEU', current: formatNumber(k.wmeu), previous: formatNumber(k.wmeu_prev), currentValue: k.wmeu, previousValue: k.wmeu_prev },
          ]}
        />
      </section>

      <p className="health-definition">{data.definitions.wmeu} North Star: WMEU.</p>
    </>
  );
}

function AcquisitionPage({ data, onOpenUsers }: { data: NetworkHealthSnapshot; onOpenUsers: (segment: NetworkUserSegment) => void }) {
  const a = data.acquisition;
  return (
    <>
      <div className="dashboard-grid">
        <KpiCard title="Novos cadastros" value={formatNumber(a.new_users)} detail={`${formatNumber(a.new_users_prev)} nos 30 dias anteriores`} icon={UserPlus} onOpen={() => onOpenUsers('never_activated')} />
        <KpiCard title="Base total" value={formatNumber(a.profiles_total)} detail="Contas com perfil na plataforma" icon={Users} />
        <KpiCard title="CAC" value="—" detail="Não há investimento de aquisição registrado" icon={WalletCards} />
        <KpiCard title="Visitante → cadastro" value="—" detail="A plataforma não registra tráfego anônimo" icon={ArrowUpRight} />
      </div>
    </>
  );
}

function ActivationPage({ data, onOpenUsers }: { data: NetworkHealthSnapshot; onOpenUsers: (segment: NetworkUserSegment) => void }) {
  const k = data.kpis;
  return (
    <>
      <div className="dashboard-grid">
        <KpiCard title="Ativação em 7 dias" value={formatPercent(k.activation_rate)} detail={`${formatPercent(k.activation_rate_prev)} na coorte anterior`} icon={Sparkles} onOpen={() => onOpenUsers('never_activated')} />
        <KpiCard title="Onboarding concluído" value={formatPercent(k.onboarding_completed_share)} detail="Sobre a base inteira, não só a coorte de 7 dias" icon={Users} />
        <KpiCard title="Coorte madura" value={formatNumber(k.activation_cohort)} detail="Cadastros com 7 a 36 dias, já passíveis de ativação" icon={UserPlus} />
      </div>
      <p className="health-definition">{data.definitions.activated}</p>
    </>
  );
}

function EngagementPage({ data, onOpenUsers }: { data: NetworkHealthSnapshot; onOpenUsers: (segment: NetworkUserSegment) => void }) {
  const k = data.kpis;
  const series = data.dauSeries;
  const width = 720;
  const height = 220;
  const max = Math.max(1, ...series.map((point) => point.dau));
  const denominator = Math.max(1, series.length - 1);
  const points = series.map((point, index) => ({
    ...point,
    x: 24 + (index * (width - 48)) / denominator,
    y: height - 28 - (point.dau / max) * (height - 56),
    label: new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(new Date(`${point.date}T12:00:00`)),
  }));
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');

  return (
    <>
      <div className="dashboard-grid">
        <KpiCard title="DAU" value={formatNumber(k.dau)} detail={`${formatNumber(k.dau_prev)} ontem`} icon={Activity} onOpen={() => onOpenUsers('dau')} />
        <KpiCard title="WAU" value={formatNumber(k.wau)} detail={`${formatNumber(k.wau_prev)} na semana anterior`} icon={Repeat2} />
        <KpiCard title="MAU" value={formatNumber(k.mau)} detail={`${formatNumber(k.mau_prev)} nos 30 dias anteriores`} icon={Users} onOpen={() => onOpenUsers('mau')} />
        <KpiCard title="Stickiness" value={formatPercent(k.stickiness)} detail={`${formatPercent(k.stickiness_prev)} no período anterior`} icon={TrendingUp} />
        <KpiCard title="Interações / MAU" value={formatDecimal(k.interactions_per_mau)} detail={`${formatDecimal(k.meaningful_per_mau)} de relacionamento (comentário, mensagem, follow)`} icon={MessageCircle} />
        <KpiCard title="WMEU" value={formatNumber(k.wmeu)} detail={`${formatNumber(k.wmeu_prev)} na semana anterior`} icon={UsersRound} onOpen={() => onOpenUsers('wmeu')} />
      </div>
      <figure className="chart-panel">
        <figcaption>
          <div>
            <strong>DAU dos últimos 30 dias</strong>
            <span>Usuários distintos com ação naquele dia</span>
          </div>
        </figcaption>
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="DAU diário">
          {[0, 1, 2, 3].map((line) => {
            const y = 28 + line * 44;
            return <line key={line} x1="24" x2={width - 24} y1={y} y2={y} className="grid-line" />;
          })}
          {points.length > 0 && <path d={path} className="chart-line chart-line-workouts" />}
          {points.filter((_, index) => index % 5 === 0 || index === points.length - 1).map((point) => (
            <text key={point.date} x={point.x} y={height - 8} textAnchor="middle">{point.label}</text>
          ))}
        </svg>
        <div className="chart-values" aria-label="DAU diário">
          {points.filter((_, index) => index % 5 === 0 || index === points.length - 1).map((point) => (
            <span key={point.date}>
              <small>{point.label}</small>
              <strong>{formatNumber(point.dau)}</strong>
            </span>
          ))}
        </div>
      </figure>
      <p className="health-definition">{data.definitions.active}</p>
    </>
  );
}

function RetentionPage({ data, onOpenUsers }: { data: NetworkHealthSnapshot; onOpenUsers: (segment: NetworkUserSegment) => void }) {
  const k = data.kpis;
  return (
    <>
      <div className="dashboard-grid">
        <KpiCard title="D1" value={formatPercent(k.retention_d1)} detail={`${formatPercent(k.retention_d1_prev)} na coorte anterior`} icon={TrendingUp} />
        <KpiCard title="D7" value={formatPercent(k.retention_d7)} detail={`${formatPercent(k.retention_d7_prev)} na coorte anterior`} icon={Repeat2} />
        <KpiCard title="D30" value={formatPercent(k.retention_d30)} detail={`${formatPercent(k.retention_d30_prev)} na coorte anterior`} icon={Activity} />
        <KpiCard title="Churn" value={formatPercent(k.churn_rate)} detail={`${formatNumber(k.churned)} saíram do MAU`} icon={UserMinus} onOpen={() => onOpenUsers('churned')} />
        <KpiCard title="Reativados" value={formatNumber(k.reactivated)} detail="Voltaram depois de 30 dias parados" icon={UserPlus} onOpen={() => onOpenUsers('reactivated')} />
        <KpiCard title="Não voltaram" value={formatNumber(k.one_and_done)} detail={data.definitions.one_and_done} icon={UsersRound} onOpen={() => onOpenUsers('one_and_done')} />
      </div>
      <section className="dashboard-section">
        <div className="dashboard-section-head">
          <div>
            <h2>Coortes semanais</h2>
            <p>Quem se cadastrou na semana e voltou no dia 1, 7 e 30.</p>
          </div>
        </div>
        <div className="table-wrapper">
          <table className="staff-table">
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
                  <td>{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(`${cohort.week_start}T12:00:00`))}</td>
                  <td>{formatNumber(cohort.cohort_n)}</td>
                  <td>{formatPercent(cohort.d1)}</td>
                  <td>{formatPercent(cohort.d7)}</td>
                  <td>{formatPercent(cohort.d30)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function NetworkPage({ data, onOpenUsers }: { data: NetworkHealthSnapshot; onOpenUsers: (segment: NetworkUserSegment) => void }) {
  const n = data.network;
  const k = data.kpis;
  return (
    <>
      <div className="dashboard-grid">
        <KpiCard title="Posts em 30 dias" value={formatNumber(n.posts_30)} detail={`${formatNumber(n.posts_prev)} no período anterior`} icon={Rss} />
        <KpiCard title="Comentários / follows / DMs" value={`${formatNumber(n.comments_30)} · ${formatNumber(n.follows_30)} · ${formatNumber(n.messages_30)}`} detail="Volume bruto dos últimos 30 dias" icon={MessageCircle} />
        <KpiCard title="Creators / MAU" value={formatPercent(k.creators_share)} detail={`${formatNumber(k.creators_active)} publicaram`} icon={Users} />
        <KpiCard title="Posts com interação" value={formatPercent(k.posts_with_interaction)} detail={`${formatPercent(n.posts_without_interaction_share)} ficaram sem retorno`} icon={HeartHandshake} onOpen={() => onOpenUsers('posted_no_interaction')} />
        <KpiCard title="Quem publicou e recebeu" value={formatPercent(k.publishers_received_interaction)} detail={k.hours_to_first_interaction == null ? 'Sem amostra de tempo até a primeira interação' : `${formatDecimal(k.hours_to_first_interaction, 1)} h até a primeira interação`} icon={Sparkles} />
        <KpiCard title="Sem conexões" value={formatPercent(n.no_connections_share)} detail={`${formatNumber(n.no_connections)} contas sem follow em nenhum sentido`} icon={UsersRound} onOpen={() => onOpenUsers('no_connections')} />
        <KpiCard title="Follows médios" value={formatDecimal(n.avg_follows)} detail="Conexões ativas por conta" icon={Repeat2} />
        <KpiCard title="Concentração top 1% / 10%" value={`${formatPercent(n.top1_content_share)} · ${formatPercent(n.top10_content_share)}`} detail="Fatia dos posts dos últimos 30 dias" icon={TrendingUp} />
        <KpiCard title="Pares distintos na semana" value={formatNumber(n.distinct_pairs_week)} detail="Mensagem, follow ou comentário entre duas pessoas" icon={Activity} />
      </div>
    </>
  );
}

function BusinessPage({ data }: { data: NetworkHealthSnapshot }) {
  const b = data.business;
  return (
    <>
      <div className="dashboard-grid">
        <KpiCard title="Receita 30 dias" value={formatCurrencyExact(b.gross_30)} detail={`${formatCurrencyExact(b.gross_prev)} no período anterior`} icon={WalletCards} />
        <KpiCard title="ARPU" value={formatCurrencyExact(b.arpu)} detail="Receita bruta do período ÷ MAU" icon={Activity} />
        <KpiCard title="Conversão paga" value={formatPercent(b.paid_conversion)} detail={`${formatNumber(b.paid_users_30)} pessoas pagaram nos últimos 30 dias`} icon={UserPlus} />
        <KpiCard title="LTV observado" value={formatCurrencyExact(b.ltv)} detail={`${formatNumber(b.paid_ever)} pessoas já pagaram alguma vez`} icon={TrendingUp} />
        <KpiCard title="CAC / LTV" value="—" detail="CAC indisponível sem investimento de aquisição" icon={AlertTriangle} />
        <KpiCard title="Assinaturas ativas" value={formatNumber(b.active_subscriptions)} detail="Recorrências vigentes" icon={Repeat2} />
      </div>
    </>
  );
}

function UsersHealthPage({
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

  return (
    <>
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
                  <th>
                    <span className="sr-only">Selecionar</span>
                  </th>
                  <th>Pessoa</th>
                  <th>Contato</th>
                  <th>Cadastro</th>
                  <th>Última atividade</th>
                  <th>Dias ativos</th>
                </tr>
              </thead>
              <tbody>
                {items.map((user) => (
                  <HealthUserRow
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
    </>
  );
}

function HealthUserRow({
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

export function NetworkHealthPage({ section, onComposeEmail, onNavigate }: HealthPageProps) {
  const query = useNetworkHealthSnapshot(section !== 'health-users');
  const [usersSegment, setUsersSegment] = useState<NetworkUserSegment>('one_and_done');
  const [usersNonce, setUsersNonce] = useState(0);

  const openUsers = (segment: NetworkUserSegment) => {
    setUsersSegment(segment);
    setUsersNonce((value) => value + 1);
    onNavigate('health-users');
  };

  const titles: Record<HealthSectionId, { kicker: string; title: string; subtitle: string }> = {
    'health-overview': { kicker: 'Saúde da rede', title: 'Visão geral', subtitle: 'Os 10 KPIs e o funil da plataforma' },
    'health-acquisition': { kicker: 'Saúde da rede', title: 'Aquisição', subtitle: 'Estamos conseguindo atrair pessoas?' },
    'health-activation': { kicker: 'Saúde da rede', title: 'Ativação', subtitle: 'Novos usuários entendem o valor da plataforma?' },
    'health-engagement': { kicker: 'Saúde da rede', title: 'Engajamento', subtitle: 'As pessoas realmente usam a rede?' },
    'health-retention': { kicker: 'Saúde da rede', title: 'Retenção', subtitle: 'Elas continuam usando depois de conhecer?' },
    'health-network': { kicker: 'Saúde da rede', title: 'Rede e conteúdo', subtitle: 'A rede está produzindo valor?' },
    'health-business': { kicker: 'Saúde da rede', title: 'Negócio', subtitle: 'O crescimento é economicamente sustentável?' },
    'health-users': { kicker: 'Saúde da rede', title: 'Usuários da rede', subtitle: 'Recortes para identificar quem voltou e quem não voltou' },
  };

  const copy = titles[section];

  if (section === 'health-users') {
    return (
      <>
        <HealthHeader kicker={copy.kicker} title={copy.title} subtitle={copy.subtitle} fetching={false} onRefresh={() => undefined} />
        <section className="content">
          <UsersHealthPage key={`${usersSegment}-${usersNonce}`} initialSegment={usersSegment} onComposeEmail={onComposeEmail} />
        </section>
      </>
    );
  }

  return (
    <>
      <HealthHeader
        kicker={copy.kicker}
        title={copy.title}
        subtitle={copy.subtitle}
        generatedAt={query.data?.generatedAt}
        fetching={query.isFetching}
        onRefresh={() => { void query.refetch(); }}
      />
      <section className="content">
        <SnapshotBody query={query}>
          {(data) => {
            if (section === 'health-overview') return <OverviewPage data={data} onOpenUsers={openUsers} />;
            if (section === 'health-acquisition') return <AcquisitionPage data={data} onOpenUsers={openUsers} />;
            if (section === 'health-activation') return <ActivationPage data={data} onOpenUsers={openUsers} />;
            if (section === 'health-engagement') return <EngagementPage data={data} onOpenUsers={openUsers} />;
            if (section === 'health-retention') return <RetentionPage data={data} onOpenUsers={openUsers} />;
            if (section === 'health-network') return <NetworkPage data={data} onOpenUsers={openUsers} />;
            return <BusinessPage data={data} />;
          }}
        </SnapshotBody>
      </section>
    </>
  );
}
