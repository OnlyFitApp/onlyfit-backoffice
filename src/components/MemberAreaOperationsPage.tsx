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
  useSetMemberAreaAccess,
} from '../hooks/useMemberAreaOperations';
import { useCurrentStaffRole } from '../hooks/useStaffManagement';
import type { AccessStatus, CourseCommentReport, MemberAreaAccess, ReportStatus } from '../lib/memberAreaOperations';

type OperationsTab = 'accesses' | 'reports' | 'audit';
const PAGE_SIZE = 40;

const accessFilters: Array<{ value: AccessStatus; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Ativos' },
  { value: 'held', label: 'Suspensos' },
  { value: 'ended', label: 'Encerrados' },
];
const reportFilters: Array<{ value: ReportStatus; label: string }> = [
  { value: 'open', label: 'Pendentes' },
  { value: 'resolved', label: 'Removidas' },
  { value: 'rejected', label: 'Mantidas' },
];

function dateLabel(value: string | null) {
  if (!value) return 'Sem prazo';
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
}

function Navigation({ page, total, onPrevious, onNext }: { page: number; total: number; onPrevious: () => void; onNext: () => void }) {
  if (page === 0 && total <= PAGE_SIZE) return null;
  return <div className="member-ops-pagination"><button className="button secondary" type="button" disabled={page === 0} onClick={onPrevious}><ChevronLeft size={16} /> Anterior</button><span>Página {page + 1} de {Math.max(1, Math.ceil(total / PAGE_SIZE))}</span><button className="button secondary" type="button" disabled={(page + 1) * PAGE_SIZE >= total} onClick={onNext}>Próxima <ChevronRight size={16} /></button></div>;
}

function OperationReasonDialog({ title, description, confirmLabel, busy, onClose, onConfirm }: {
  title: string;
  description: string;
  confirmLabel: string;
  busy: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState('');
  return <div className="member-ops-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onClose(); }}><section className="member-ops-dialog" role="dialog" aria-modal="true" aria-labelledby="member-ops-dialog-title"><button className="icon-button member-ops-dialog-close" type="button" aria-label="Fechar" onClick={onClose} disabled={busy}><X size={18} /></button><span className="member-ops-dialog-icon"><ShieldAlert size={20} /></span><h2 id="member-ops-dialog-title">{title}</h2><p>{description}</p><label><span>Justificativa</span><textarea autoFocus rows={4} maxLength={500} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Explique o motivo da decisão" /><small>{reason.length}/500</small></label><div className="member-ops-dialog-actions"><button className="button secondary" type="button" onClick={onClose} disabled={busy}>Cancelar</button><button className="button danger" type="button" onClick={() => onConfirm(reason.trim())} disabled={busy || reason.trim().length < 5}>{busy ? <RefreshCw className="spin" size={16} /> : <Check size={16} />} {confirmLabel}</button></div></section></div>;
}

function accessState(access: MemberAreaAccess): { key: AccessStatus; label: string } {
  if (access.held) return { key: 'held', label: 'Suspenso' };
  if (access.financial_status === 'ended') return { key: 'ended', label: 'Encerrado' };
  return { key: 'active', label: access.financial_status === 'past_due' ? 'Ativo · pagamento pendente' : 'Ativo' };
}

function AccessesPanel({ canSuspend }: { canSuspend: boolean }) {
  const [status, setStatus] = useState<AccessStatus>('all');
  const [queryInput, setQueryInput] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<{ access: MemberAreaAccess; action: 'suspend' | 'resume'; key: string } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const accesses = useMemberAreaAccesses(status, query, page, true);
  const act = useSetMemberAreaAccess();
  const submitSearch = (event: FormEvent) => { event.preventDefault(); setQuery(queryInput.trim()); setPage(0); };
  const confirm = (reason: string) => {
    if (!selected) return;
    act.mutate({ entitlementId: selected.access.id, action: selected.action, reason, expectedVersion: selected.access.version, idempotencyKey: selected.key }, {
      onSuccess: () => { setMessage(selected.action === 'suspend' ? 'Acesso suspenso. A compra foi preservada.' : 'Acesso retomado.'); setSelected(null); },
      onError: () => setMessage('Não foi possível alterar o acesso.'),
    });
  };
  return <>
    <div className="member-ops-toolbar"><div className="member-ops-filters" role="tablist" aria-label="Filtrar acessos">{accessFilters.map((filter) => <button key={filter.value} type="button" role="tab" aria-selected={status === filter.value} className={status === filter.value ? 'active' : ''} onClick={() => { setStatus(filter.value); setPage(0); }}>{filter.label}</button>)}</div><form className="member-ops-search" role="search" onSubmit={submitSearch}><Search size={16} /><input value={queryInput} maxLength={120} onChange={(event) => setQueryInput(event.target.value)} placeholder="Membro, produto ou negócio" aria-label="Buscar acessos" /><button className="button secondary" type="submit">Buscar</button></form></div>
    {message ? <div className={`inline-alert ${message.startsWith('Não') ? 'danger' : ''}`} role="status">{message}</div> : null}
    {accesses.isLoading ? <div className="beta-empty"><RefreshCw className="spin" size={22} /> Carregando acessos…</div> : accesses.isError ? <div className="inline-alert danger" role="alert"><AlertTriangle size={18} /> Não foi possível carregar os acessos.</div> : accesses.data?.items.length === 0 ? <div className="beta-empty"><BookOpen size={30} /><strong>Nenhum acesso encontrado</strong></div> : <div className="member-access-list">{accesses.data?.items.map((access) => {
      const state = accessState(access);
      return <article className="member-access-card" key={access.id}><div className="member-access-main"><span className="member-access-avatar" aria-hidden="true"><UserRound size={19} /></span><div><h3>{access.account.display_name}</h3><p>{access.account.username ? `@${access.account.username}` : 'Usuário sem identificador público'}</p></div></div><div className="member-access-product"><span><Building2 size={14} /> {access.business_id}</span><strong>{access.offer_name}</strong><small>{access.delivery} · {access.resource_type}</small></div><div className="member-access-dates"><span>Concedido em {dateLabel(access.valid_from)}</span><small>{access.valid_until ? `Válido até ${dateLabel(access.valid_until)}` : 'Acesso sem vencimento'}</small></div><div className="member-access-state"><span className={`member-ops-status ${state.key}`}>{state.label}</span>{access.hold ? <small title={access.hold.reason}>{access.hold.reason}</small> : null}{canSuspend && state.key !== 'ended' ? <button className={access.held ? 'button primary compact' : 'button danger compact'} type="button" disabled={act.isPending} onClick={() => setSelected({ access, action: access.held ? 'resume' : 'suspend', key: crypto.randomUUID() })}>{access.held ? <Check size={15} /> : <Ban size={15} />}{access.held ? 'Retomar' : 'Suspender'}</button> : null}</div></article>;
    })}</div>}
    <Navigation page={page} total={accesses.data?.total ?? 0} onPrevious={() => setPage((value) => Math.max(0, value - 1))} onNext={() => setPage((value) => value + 1)} />
    {selected ? <OperationReasonDialog title={`${selected.action === 'suspend' ? 'Suspender' : 'Retomar'} acesso de ${selected.access.account.display_name}?`} description={selected.action === 'suspend' ? 'O conteúdo ficará indisponível. A compra e o ciclo financeiro serão preservados.' : 'O bloqueio administrativo será removido sem modificar a compra.'} confirmLabel={selected.action === 'suspend' ? 'Suspender acesso' : 'Retomar acesso'} busy={act.isPending} onClose={() => !act.isPending && setSelected(null)} onConfirm={confirm} /> : null}
  </>;
}

function ReportsPanel() {
  const [status, setStatus] = useState<ReportStatus>('open');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<{ report: CourseCommentReport; action: 'remove' | 'dismiss'; key: string } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const reports = useCourseCommentReports(status, page, true);
  const moderate = useModerateCourseCommentReport();
  const confirm = (reason: string) => {
    if (!selected) return;
    moderate.mutate({ reportId: selected.report.id, action: selected.action, reason, expectedVersion: selected.report.version, idempotencyKey: selected.key }, {
      onSuccess: () => { setMessage(selected.action === 'remove' ? 'Comentário removido.' : 'Denúncia encerrada e comentário mantido.'); setSelected(null); },
      onError: () => setMessage('Não foi possível concluir a moderação.'),
    });
  };
  return <>
    <div className="member-ops-toolbar"><div className="member-ops-filters" role="tablist" aria-label="Filtrar denúncias de comentários">{reportFilters.map((filter) => <button key={filter.value} type="button" role="tab" aria-selected={status === filter.value} className={status === filter.value ? 'active' : ''} onClick={() => { setStatus(filter.value); setPage(0); }}>{filter.label}</button>)}</div><button className="button secondary" type="button" onClick={() => void reports.refetch()} disabled={reports.isFetching}><RefreshCw className={reports.isFetching ? 'spin' : ''} size={16} /> Atualizar</button></div>
    {message ? <div className={`inline-alert ${message.startsWith('Não') ? 'danger' : ''}`} role="status">{message}</div> : null}
    {reports.isLoading ? <div className="beta-empty"><RefreshCw className="spin" size={22} /> Carregando denúncias…</div> : reports.isError ? <div className="inline-alert danger" role="alert"><AlertTriangle size={18} /> Não foi possível carregar as denúncias.</div> : reports.data?.items.length === 0 ? <div className="beta-empty"><ShieldAlert size={30} /><strong>Fila vazia</strong></div> : <div className="member-report-list">{reports.data?.items.map((report) => <article className="member-report-card" key={report.id}><header><div><span>Curso {report.course_id}</span><h3>Lição {report.lesson_id}</h3><small>{dateLabel(report.created_at)}</small></div><span className={`member-ops-status ${report.status}`}>{reportFilters.find((item) => item.value === report.status)?.label ?? report.status}</span></header><blockquote className="member-report-comment"><strong>Comentário de {report.author.display_name}</strong>{report.body}</blockquote><div className="member-report-reason"><span>Motivo da denúncia</span><p>{report.reason ?? 'Não informado'}</p></div>{status === 'open' ? <div className="member-report-actions"><button className="button secondary" type="button" disabled={moderate.isPending} onClick={() => setSelected({ report, action: 'dismiss', key: crypto.randomUUID() })}><Check size={16} /> Manter comentário</button><button className="button danger" type="button" disabled={moderate.isPending} onClick={() => setSelected({ report, action: 'remove', key: crypto.randomUUID() })}><EyeOff size={16} /> Remover comentário</button></div> : null}</article>)}</div>}
    <Navigation page={page} total={reports.data?.total ?? 0} onPrevious={() => setPage((value) => Math.max(0, value - 1))} onNext={() => setPage((value) => value + 1)} />
    {selected ? <OperationReasonDialog title={selected.action === 'remove' ? 'Remover este comentário?' : 'Manter este comentário?'} description={selected.action === 'remove' ? 'O comentário deixará de aparecer e a denúncia será resolvida.' : 'A denúncia será rejeitada e o comentário continuará visível.'} confirmLabel={selected.action === 'remove' ? 'Remover comentário' : 'Manter comentário'} busy={moderate.isPending} onClose={() => !moderate.isPending && setSelected(null)} onConfirm={confirm} /> : null}
  </>;
}

function isoStart(date: string): string { return new Date(`${date}T00:00:00`).toISOString(); }
function isoEnd(date: string): string { return new Date(`${date}T23:59:59.999`).toISOString(); }
function dayInput(date: Date): string { return date.toISOString().slice(0, 10); }

function AuditPanel() {
  const now = new Date();
  const monthAgo = new Date(now); monthAgo.setDate(monthAgo.getDate() - 30);
  const [from, setFrom] = useState(dayInput(monthAgo));
  const [to, setTo] = useState(dayInput(now));
  const [page, setPage] = useState(0);
  const audit = useMemberAreaAudit(isoStart(from), isoEnd(to), page, true);
  return <><div className="member-ops-toolbar"><label>De<input type="date" required value={from} max={to} onChange={(event) => { if (event.target.value) setFrom(event.target.value); setPage(0); }} /></label><label>Até<input type="date" required value={to} min={from} onChange={(event) => { if (event.target.value) setTo(event.target.value); setPage(0); }} /></label><button className="button secondary" type="button" onClick={() => void audit.refetch()} disabled={audit.isFetching}><RefreshCw className={audit.isFetching ? 'spin' : ''} size={16} /> Atualizar</button></div>
    {audit.isLoading ? <div className="beta-empty"><RefreshCw className="spin" size={22} /> Carregando histórico…</div> : audit.isError ? <div className="inline-alert danger" role="alert"><AlertTriangle size={18} /> Não foi possível carregar o histórico.</div> : audit.data?.items.length === 0 ? <div className="beta-empty"><History size={30} /><strong>Nenhuma ação registrada</strong></div> : <ol className="member-audit-list">{audit.data?.items.map((entry) => <li key={entry.id}><span className="member-audit-mark" aria-hidden="true" /><div><header><strong>{entry.action}</strong><time dateTime={entry.created_at}><Clock3 size={13} /> {dateLabel(entry.created_at)}</time></header><p>{entry.subject_type} · {entry.subject_id}</p>{entry.reason ? <blockquote>{entry.reason}</blockquote> : null}<small>Responsável: {entry.actor_id ?? 'Sistema'}</small></div></li>)}</ol>}
    <Navigation page={page} total={audit.data?.total ?? 0} onPrevious={() => setPage((value) => Math.max(0, value - 1))} onNext={() => setPage((value) => value + 1)} />
  </>;
}

export function MemberAreaOperationsPage() {
  const { data: role, isLoading, isError } = useCurrentStaffRole();
  const [tab, setTab] = useState<OperationsTab>('accesses');
  const canOperate = role === 'admin' || role === 'super_admin';
  return <><header className="page-header"><div><p className="section-label">Operação</p><h1>Área de membros</h1><span>Acessos, denúncias de comentários e decisões administrativas.</span></div></header><section className="content member-ops-page">{isLoading ? <div className="beta-empty"><RefreshCw className="spin" size={22} /> Verificando permissões…</div> : isError || !role ? <div className="inline-alert danger" role="alert"><AlertTriangle size={18} /> Não foi possível verificar suas permissões.</div> : <><nav className="member-ops-tabs" aria-label="Operação da área de membros"><button type="button" className={tab === 'accesses' ? 'active' : ''} onClick={() => setTab('accesses')}><BookOpen size={17} /> Acessos</button><button type="button" className={tab === 'reports' ? 'active' : ''} onClick={() => setTab('reports')}><ShieldAlert size={17} /> Denúncias</button><button type="button" className={tab === 'audit' ? 'active' : ''} onClick={() => setTab('audit')}><History size={17} /> Histórico</button></nav><div className="member-ops-panel">{tab === 'accesses' ? <AccessesPanel canSuspend={canOperate} /> : tab === 'reports' ? <ReportsPanel /> : <AuditPanel />}</div></>}</section></>;
}
