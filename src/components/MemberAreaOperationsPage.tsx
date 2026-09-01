import {
  AlertTriangle,
  Ban,
  BookOpen,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  EyeOff,
  History,
  RefreshCw,
  Search,
  ShieldAlert,
  UserRound,
  X,
} from 'lucide-react';
import { type FormEvent, useState } from 'react';
import {
  useCourseCommentReports,
  useMemberAreaAccesses,
  useMemberAreaAudit,
  useModerateCourseCommentReport,
  useSuspendMemberAreaAccess,
} from '../hooks/useMemberAreaOperations';
import { useCurrentStaffRole } from '../hooks/useStaffManagement';
import type {
  AccessStatus,
  AuditAction,
  CourseCommentReport,
  MemberAreaAccess,
  PageCursor,
  ReportStatus,
} from '../lib/memberAreaOperations';
import type { StaffRole } from '../lib/staff';

type OperationsTab = 'accesses' | 'reports' | 'audit';

const accessFilters: Array<{ value: AccessStatus; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Ativos' },
  { value: 'suspended', label: 'Suspensos' },
  { value: 'revoked', label: 'Revogados' },
  { value: 'expired', label: 'Expirados' },
];

const reportFilters: Array<{ value: ReportStatus; label: string }> = [
  { value: 'open', label: 'Pendentes' },
  { value: 'resolved', label: 'Ocultadas' },
  { value: 'dismissed', label: 'Mantidas' },
];

const auditFilters: Array<{ value: AuditAction; label: string }> = [
  { value: 'all', label: 'Todas' },
  { value: 'access_suspended', label: 'Suspensões' },
  { value: 'comment_hidden', label: 'Comentários ocultados' },
  { value: 'report_dismissed', label: 'Denúncias mantidas' },
];

const accessStatusLabel: Record<Exclude<AccessStatus, 'all'>, string> = {
  active: 'Ativo',
  suspended: 'Suspenso',
  revoked: 'Revogado',
  expired: 'Expirado',
};

const auditActionLabel: Record<Exclude<AuditAction, 'all'>, string> = {
  access_suspended: 'Acesso suspenso',
  comment_hidden: 'Comentário ocultado',
  report_dismissed: 'Denúncia mantida',
};

function dateLabel(value: string | null) {
  if (!value) return 'Sem prazo';
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

function CursorNavigation({
  page,
  hasMore,
  onPrevious,
  onNext,
}: {
  page: number;
  hasMore: boolean;
  onPrevious: () => void;
  onNext: () => void;
}) {
  if (page === 0 && !hasMore) return null;
  return <div className="member-ops-pagination">
    <button className="button secondary" type="button" disabled={page === 0} onClick={onPrevious}>
      <ChevronLeft size={16} /> Anterior
    </button>
    <span>Página {page + 1}</span>
    <button className="button secondary" type="button" disabled={!hasMore} onClick={onNext}>
      Próxima <ChevronRight size={16} />
    </button>
  </div>;
}

function OperationReasonDialog({
  title,
  description,
  confirmLabel,
  busy,
  onClose,
  onConfirm,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  busy: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState('');
  const valid = reason.trim().length >= 5;
  return <div className="member-ops-dialog-backdrop" role="presentation" onMouseDown={(event) => {
    if (event.target === event.currentTarget && !busy) onClose();
  }}>
    <section className="member-ops-dialog" role="dialog" aria-modal="true" aria-labelledby="member-ops-dialog-title">
      <button className="icon-button member-ops-dialog-close" type="button" aria-label="Fechar" onClick={onClose} disabled={busy}>
        <X size={18} />
      </button>
      <span className="member-ops-dialog-icon"><ShieldAlert size={20} /></span>
      <h2 id="member-ops-dialog-title">{title}</h2>
      <p>{description}</p>
      <label>
        <span>Justificativa</span>
        <textarea
          autoFocus
          rows={4}
          maxLength={500}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Explique o motivo da decisão"
        />
        <small>{reason.length}/500</small>
      </label>
      <div className="member-ops-dialog-actions">
        <button className="button secondary" type="button" onClick={onClose} disabled={busy}>Cancelar</button>
        <button className="button danger" type="button" onClick={() => onConfirm(reason.trim())} disabled={busy || !valid}>
          {busy ? <RefreshCw className="spin" size={16} /> : <Check size={16} />} {confirmLabel}
        </button>
      </div>
    </section>
  </div>;
}

function AccessesPanel({ canSuspend }: { canSuspend: boolean }) {
  const [status, setStatus] = useState<AccessStatus>('all');
  const [queryInput, setQueryInput] = useState('');
  const [query, setQuery] = useState('');
  const [cursors, setCursors] = useState<Array<PageCursor | null>>([null]);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<{ access: MemberAreaAccess; key: string } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const accesses = useMemberAreaAccesses(status, query, cursors[page], true);
  const suspend = useSuspendMemberAreaAccess();

  const resetPage = () => {
    setCursors([null]);
    setPage(0);
  };
  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    setQuery(queryInput.trim());
    resetPage();
  };
  const chooseStatus = (value: AccessStatus) => {
    setStatus(value);
    resetPage();
  };
  const next = () => {
    if (!accesses.data?.next_cursor) return;
    setCursors((current) => [...current.slice(0, page + 1), accesses.data!.next_cursor]);
    setPage((current) => current + 1);
  };
  const confirmSuspension = (reason: string) => {
    if (!selected) return;
    setMessage(null);
    suspend.mutate({
      entitlementId: selected.access.id,
      reason,
      idempotencyKey: selected.key,
    }, {
      onSuccess: () => {
        setSelected(null);
        setMessage('Acesso suspenso. A compra foi preservada.');
      },
      onError: () => setMessage('Não foi possível suspender o acesso.'),
    });
  };

  return <>
    <div className="member-ops-toolbar">
      <div className="member-ops-filters" role="tablist" aria-label="Filtrar acessos">
        {accessFilters.map((filter) => <button key={filter.value} type="button" role="tab"
          aria-selected={status === filter.value} className={status === filter.value ? 'active' : ''}
          onClick={() => chooseStatus(filter.value)}>{filter.label}</button>)}
      </div>
      <form className="member-ops-search" role="search" onSubmit={submitSearch}>
        <Search size={16} />
        <input value={queryInput} maxLength={120} onChange={(event) => setQueryInput(event.target.value)}
          placeholder="Membro, e-mail, produto ou negócio" aria-label="Buscar acessos" />
        <button className="button secondary" type="submit">Buscar</button>
      </form>
    </div>

    {message && <div className={`inline-alert ${message.startsWith('Não') ? 'danger' : ''}`} role="status">{message}</div>}
    {accesses.isLoading ? <div className="beta-empty"><RefreshCw className="spin" size={22} /> Carregando acessos…</div>
      : accesses.isError ? <div className="inline-alert danger" role="alert"><AlertTriangle size={18} /> Não foi possível carregar os acessos.</div>
        : accesses.data?.items.length === 0 ? <div className="beta-empty"><BookOpen size={30} /><strong>Nenhum acesso encontrado</strong></div>
          : <div className="member-access-list">{accesses.data?.items.map((access) => <article className="member-access-card" key={access.id}>
            <div className="member-access-main">
              <span className="member-access-avatar" aria-hidden="true"><UserRound size={19} /></span>
              <div>
                <h3>{access.member_name}</h3>
                <p>{access.member_email || 'E-mail não disponível'}</p>
              </div>
            </div>
            <div className="member-access-product">
              <span><Building2 size={14} /> {access.organization_name}</span>
              <strong>{access.offering_name}</strong>
              <small>{access.content_count} {access.content_count === 1 ? 'conteúdo' : 'conteúdos'}</small>
            </div>
            <div className="member-access-dates">
              <span>Concedido em {dateLabel(access.granted_at)}</span>
              <small>{access.expires_at ? `Válido até ${dateLabel(access.expires_at)}` : 'Acesso sem vencimento'}</small>
            </div>
            <div className="member-access-state">
              <span className={`member-ops-status ${access.effective_status}`}>{accessStatusLabel[access.effective_status]}</span>
              {access.suspension_reason && <small title={access.suspension_reason}>{access.suspension_reason}</small>}
              {canSuspend && access.effective_status === 'active' && <button className="button danger compact" type="button"
                onClick={() => setSelected({ access, key: crypto.randomUUID() })}><Ban size={15} /> Suspender</button>}
            </div>
          </article>)}</div>}

    <CursorNavigation page={page} hasMore={accesses.data?.has_more === true}
      onPrevious={() => setPage((current) => Math.max(0, current - 1))} onNext={next} />

    {selected && <OperationReasonDialog
      title={`Suspender acesso de ${selected.access.member_name}?`}
      description="O conteúdo ficará indisponível imediatamente. A compra e o histórico financeiro não serão alterados."
      confirmLabel="Suspender acesso"
      busy={suspend.isPending}
      onClose={() => !suspend.isPending && setSelected(null)}
      onConfirm={confirmSuspension}
    />}
  </>;
}

function ReportsPanel() {
  const [status, setStatus] = useState<ReportStatus>('open');
  const [cursors, setCursors] = useState<Array<PageCursor | null>>([null]);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<{ report: CourseCommentReport; action: 'hide' | 'dismiss' } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const reports = useCourseCommentReports(status, cursors[page], true);
  const moderate = useModerateCourseCommentReport();

  const chooseStatus = (value: ReportStatus) => {
    setStatus(value);
    setCursors([null]);
    setPage(0);
  };
  const next = () => {
    if (!reports.data?.next_cursor) return;
    setCursors((current) => [...current.slice(0, page + 1), reports.data!.next_cursor]);
    setPage((current) => current + 1);
  };
  const confirmModeration = (reason: string) => {
    if (!selected) return;
    setMessage(null);
    moderate.mutate({ reportId: selected.report.id, action: selected.action, reason }, {
      onSuccess: () => {
        setMessage(selected.action === 'hide' ? 'Comentário ocultado.' : 'Denúncia encerrada e comentário mantido.');
        setSelected(null);
      },
      onError: () => setMessage('Não foi possível concluir a moderação.'),
    });
  };

  return <>
    <div className="member-ops-toolbar">
      <div className="member-ops-filters" role="tablist" aria-label="Filtrar denúncias de comentários">
        {reportFilters.map((filter) => <button key={filter.value} type="button" role="tab"
          aria-selected={status === filter.value} className={status === filter.value ? 'active' : ''}
          onClick={() => chooseStatus(filter.value)}>{filter.label}</button>)}
      </div>
      <button className="button secondary" type="button" onClick={() => reports.refetch()} disabled={reports.isFetching}>
        <RefreshCw className={reports.isFetching ? 'spin' : ''} size={16} /> Atualizar
      </button>
    </div>

    {message && <div className={`inline-alert ${message.startsWith('Não') ? 'danger' : ''}`} role="status">{message}</div>}
    {reports.isLoading ? <div className="beta-empty"><RefreshCw className="spin" size={22} /> Carregando denúncias…</div>
      : reports.isError ? <div className="inline-alert danger" role="alert"><AlertTriangle size={18} /> Não foi possível carregar as denúncias.</div>
        : reports.data?.items.length === 0 ? <div className="beta-empty"><ShieldAlert size={30} /><strong>Fila vazia</strong></div>
          : <div className="member-report-list">{reports.data?.items.map((report) => <article className="member-report-card" key={report.id}>
            <header>
              <div>
                <span>{report.organization_name}</span>
                <h3>{report.course_title}</h3>
                <small>{report.lesson_title} · {dateLabel(report.created_at)}</small>
              </div>
              <span className={`member-ops-status ${report.status}`}>{reportFilters.find((item) => item.value === report.status)?.label}</span>
            </header>
            <blockquote className="member-report-comment">
              <strong>Comentário de {report.author_name}</strong>
              {report.comment_body}
            </blockquote>
            <div className="member-report-reason">
              <span>Denúncia de {report.reporter_name}</span>
              <p>{report.reason}</p>
            </div>
            {status === 'open' && <div className="member-report-actions">
              <button className="button secondary" type="button" disabled={moderate.isPending}
                onClick={() => setSelected({ report, action: 'dismiss' })}><Check size={16} /> Manter comentário</button>
              <button className="button danger" type="button" disabled={moderate.isPending}
                onClick={() => setSelected({ report, action: 'hide' })}><EyeOff size={16} /> Ocultar comentário</button>
            </div>}
          </article>)}</div>}

    <CursorNavigation page={page} hasMore={reports.data?.has_more === true}
      onPrevious={() => setPage((current) => Math.max(0, current - 1))} onNext={next} />

    {selected && <OperationReasonDialog
      title={selected.action === 'hide' ? 'Ocultar este comentário?' : 'Manter este comentário?'}
      description={selected.action === 'hide'
        ? 'O comentário deixará de aparecer para todos os membros e as denúncias abertas sobre ele serão encerradas.'
        : 'A denúncia será encerrada e o comentário continuará visível.'}
      confirmLabel={selected.action === 'hide' ? 'Ocultar comentário' : 'Manter comentário'}
      busy={moderate.isPending}
      onClose={() => !moderate.isPending && setSelected(null)}
      onConfirm={confirmModeration}
    />}
  </>;
}

function AuditPanel({ role }: { role: StaffRole }) {
  const [action, setAction] = useState<AuditAction>('all');
  const [cursors, setCursors] = useState<Array<PageCursor | null>>([null]);
  const [page, setPage] = useState(0);
  const audit = useMemberAreaAudit(action, cursors[page], true);
  const visibleFilters = role === 'support'
    ? auditFilters.filter((item) => item.value === 'all' || item.value === 'access_suspended')
    : role === 'moderator'
      ? auditFilters.filter((item) => item.value === 'all' || item.value !== 'access_suspended')
      : auditFilters;

  const chooseAction = (value: AuditAction) => {
    setAction(value);
    setCursors([null]);
    setPage(0);
  };
  const next = () => {
    if (!audit.data?.next_cursor) return;
    setCursors((current) => [...current.slice(0, page + 1), audit.data!.next_cursor]);
    setPage((current) => current + 1);
  };

  return <>
    <div className="member-ops-toolbar">
      <div className="member-ops-filters" role="tablist" aria-label="Filtrar auditoria">
        {visibleFilters.map((filter) => <button key={filter.value} type="button" role="tab"
          aria-selected={action === filter.value} className={action === filter.value ? 'active' : ''}
          onClick={() => chooseAction(filter.value)}>{filter.label}</button>)}
      </div>
      <button className="button secondary" type="button" onClick={() => audit.refetch()} disabled={audit.isFetching}>
        <RefreshCw className={audit.isFetching ? 'spin' : ''} size={16} /> Atualizar
      </button>
    </div>

    {audit.isLoading ? <div className="beta-empty"><RefreshCw className="spin" size={22} /> Carregando histórico…</div>
      : audit.isError ? <div className="inline-alert danger" role="alert"><AlertTriangle size={18} /> Não foi possível carregar o histórico.</div>
        : audit.data?.items.length === 0 ? <div className="beta-empty"><History size={30} /><strong>Nenhuma ação registrada</strong></div>
          : <ol className="member-audit-list">{audit.data?.items.map((entry) => <li key={entry.id}>
            <span className={`member-audit-mark ${entry.action}`} aria-hidden="true" />
            <div>
              <header>
                <strong>{auditActionLabel[entry.action]}</strong>
                <time dateTime={entry.occurred_at}><Clock3 size={13} /> {dateLabel(entry.occurred_at)}</time>
              </header>
              <p>{entry.organization_name}{entry.subject_name ? ` · ${entry.subject_name}` : ''}</p>
              <blockquote>{entry.reason}</blockquote>
              <small>Responsável: {entry.actor_name}</small>
            </div>
          </li>)}</ol>}

    <CursorNavigation page={page} hasMore={audit.data?.has_more === true}
      onPrevious={() => setPage((current) => Math.max(0, current - 1))} onNext={next} />
  </>;
}

export function MemberAreaOperationsPage() {
  const { data: role, isLoading, isError } = useCurrentStaffRole();
  const [tab, setTab] = useState<OperationsTab>('accesses');
  const canViewAccesses = role === 'support' || role === 'admin' || role === 'super_admin';
  const canModerate = role === 'moderator' || role === 'admin' || role === 'super_admin';
  const canSuspend = role === 'admin' || role === 'super_admin';
  const tabs: Array<{ id: OperationsTab; label: string; icon: typeof BookOpen }> = [
    ...(canViewAccesses ? [{ id: 'accesses' as const, label: 'Acessos', icon: BookOpen }] : []),
    ...(canModerate ? [{ id: 'reports' as const, label: 'Denúncias', icon: ShieldAlert }] : []),
    { id: 'audit', label: 'Histórico', icon: History },
  ];
  const activeTab = tabs.some((item) => item.id === tab) ? tab : tabs[0]?.id ?? 'audit';

  return <>
    <header className="page-header">
      <div>
        <p className="section-label">Operação</p>
        <h1>Área de membros</h1>
        <span>Acessos, denúncias de comentários e decisões administrativas.</span>
      </div>
    </header>
    <section className="content member-ops-page">
      {isLoading ? <div className="beta-empty"><RefreshCw className="spin" size={22} /> Verificando permissões…</div>
        : isError || !role ? <div className="inline-alert danger" role="alert"><AlertTriangle size={18} /> Não foi possível verificar suas permissões.</div> : <>
        <nav className="member-ops-tabs" aria-label="Operação da área de membros">
          {tabs.map((item) => <button key={item.id} type="button" className={activeTab === item.id ? 'active' : ''}
            aria-current={activeTab === item.id ? 'page' : undefined} onClick={() => setTab(item.id)}>
            <item.icon size={17} /> {item.label}
          </button>)}
        </nav>
        <div className="member-ops-panel">
          {activeTab === 'accesses' && <AccessesPanel canSuspend={canSuspend} />}
          {activeTab === 'reports' && <ReportsPanel />}
          {activeTab === 'audit' && <AuditPanel role={role} />}
        </div>
      </>}
    </section>
  </>;
}
