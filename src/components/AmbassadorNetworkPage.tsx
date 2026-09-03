import {
  AlertTriangle,
  ArrowRightLeft,
  Check,
  ChevronRight,
  CircleOff,
  Crown,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  UserRoundCheck,
  UsersRound,
} from 'lucide-react';
import { FormEvent, type ReactNode, useDeferredValue, useState } from 'react';
import {
  useAmbassadorAssignmentImpact,
  useAmbassadorAudit,
  useAmbassadorCandidates,
  useAmbassadorMemberships,
  useAmbassadorOperations,
  usePrepareAmbassadorCandidate,
  useAmbassadorRequests,
  useAmbassadorSnapshot,
  useRefreshAmbassadorLegacyInventory,
  useReviewAmbassadorMembership,
  useReviewAmbassadorPromotion,
  useResolveAmbassadorLegacyCandidate,
  useRollbackAmbassadorRollout,
  useSaveAmbassadorRollout,
  useSaveAmbassadorAssignment,
  useSaveAmbassadorNetworkSetting,
  useSaveCommercialRegion,
  useSetCommercialRegionActive,
  useSetAmbassadorProgramFlags,
  useSetAmbassadorRolloutCheck,
  useTransitionAmbassadorAssignment,
  useTransferAmbassadorAssociate,
  useTransferAmbassadorMembership,
  useTransitionAmbassadorRollout,
} from '../hooks/useAmbassadorNetwork';
import { useCurrentStaffRole } from '../hooks/useStaffManagement';
import {
  ambassadorErrorMessage,
  type AmbassadorAssignment,
  type AmbassadorCandidate,
  type AmbassadorMembership,
  type AmbassadorNetworkSetting,
  type AmbassadorPromotion,
  type CommercialRegion,
} from '../lib/ambassadorNetwork';
import { formatDateTime, formatNumber } from '../lib/format';
import {
  AmbassadorDialog,
  AmbassadorTabPanel,
  AmbassadorTabs,
  CloseButton,
} from './AmbassadorUi';
import { useUnsavedWarning } from '../hooks/useUnsavedWarning';

type Tab = 'network' | 'regions' | 'settings' | 'requests' | 'technical' | 'audit';
type Filters = { affinityGroupKey: string; regionId: string; status: string; offset: number };

type AssignmentDraft = {
  id?: string;
  expectedUpdatedAt?: string;
  profileId: string;
  profileLabel: string;
  profileIsProfessional: boolean;
  profileHasBrCpf: boolean;
  role: 'principal' | 'associate';
  affinityGroupKey: string;
  regionId: string;
  principalAssignmentId: string;
  publicVisible: boolean;
  displayOrder: string;
  headline: string;
  badgeLabel: string;
  contractReference: string;
  startsAt: string;
  endsAt: string;
};

const defaultAmbassadorPreparationReason = 'Embaixador de pré-lançamento; documento fiscal será exigido antes de pagamentos.';

type RegionDraft = {
  id?: string;
  expectedUpdatedAt?: string;
  name: string;
  slug: string;
  scopeType: CommercialRegion['scopeType'];
  countryCode: string;
  stateCode: string;
  cityName: string;
  parentId: string;
  specificity: string;
  priority: string;
};

type SettingDraft = {
  id?: string;
  expectedUpdatedAt?: string;
  affinityGroupKey: string;
  regionId: string;
  followerThreshold: string;
  manualChoiceEnabled: boolean;
  referralCodeEnabled: boolean;
  automaticPrincipalEnabled: boolean;
  moderationEnabled: boolean;
  published: boolean;
};

const statusLabel: Record<string, string> = {
  draft: 'Rascunho', pending: 'Pendente', active: 'Ativo', suspended: 'Suspenso', ended: 'Encerrado',
  pending_approval: 'Aguardando aprovação', pending_moderation: 'Em moderação', approved: 'Aprovado', rejected: 'Rejeitado',
};

function slugify(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function assignmentDraft(item?: AmbassadorAssignment): AssignmentDraft {
  return item ? {
    id: item.id, expectedUpdatedAt: item.updatedAt, profileId: item.profileId, profileLabel: item.profileName,
    profileIsProfessional: true, profileHasBrCpf: true,
    role: item.role, affinityGroupKey: item.affinityGroupKey, regionId: item.regionId,
    principalAssignmentId: item.principalAssignmentId ?? '', publicVisible: item.publicVisible,
    displayOrder: String(item.displayOrder), headline: item.headline ?? '', badgeLabel: item.badgeLabel ?? '',
    contractReference: item.contractReference ?? '', startsAt: item.startsAt?.slice(0, 16) ?? '', endsAt: item.endsAt?.slice(0, 16) ?? '',
  } : {
    profileId: '', profileLabel: '', profileIsProfessional: false, profileHasBrCpf: false,
    role: 'principal', affinityGroupKey: '', regionId: '', principalAssignmentId: '',
    publicVisible: true, displayOrder: '0', headline: '', badgeLabel: '', contractReference: '', startsAt: '', endsAt: '',
  };
}

function regionDraft(item?: CommercialRegion): RegionDraft {
  return item ? {
    id: item.id, expectedUpdatedAt: item.updatedAt, name: item.name, slug: item.slug, scopeType: item.scopeType,
    countryCode: item.countryCode ?? '', stateCode: item.stateCode ?? '', cityName: item.cityName ?? '',
    parentId: item.parentId ?? '', specificity: String(item.specificity), priority: String(item.priority),
  } : { name: '', slug: '', scopeType: 'custom', countryCode: '', stateCode: '', cityName: '', parentId: '', specificity: '0', priority: '0' };
}

function settingDraft(item?: AmbassadorNetworkSetting): SettingDraft {
  return item ? {
    id: item.id, expectedUpdatedAt: item.updatedAt, affinityGroupKey: item.affinityGroupKey, regionId: item.regionId ?? '',
    followerThreshold: String(item.followerThreshold), manualChoiceEnabled: item.manualChoiceEnabled,
    referralCodeEnabled: false, automaticPrincipalEnabled: false,
    moderationEnabled: item.moderationEnabled, published: item.published,
  } : { affinityGroupKey: '', regionId: '', followerThreshold: '50000', manualChoiceEnabled: true, referralCodeEnabled: false, automaticPrincipalEnabled: true, moderationEnabled: true, published: false };
}

export function AmbassadorNetworkPage() {
  const [tab, setTab] = useState<Tab>('network');
  const [filters, setFilters] = useState<Filters>({ affinityGroupKey: '', regionId: '', status: '', offset: 0 });
  const snapshot = useAmbassadorSnapshot(filters);
  const role = useCurrentStaffRole();
  const canEdit = role.data === 'admin' || role.data === 'super_admin';
  const canSeeTechnical = role.data === 'super_admin';
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = snapshot.data?.assignments.find((item) => item.id === selectedId) ?? null;
  const [assignmentEditor, setAssignmentEditor] = useState<AssignmentDraft | null>(null);
  const [regionEditor, setRegionEditor] = useState<RegionDraft | null>(null);
  const [settingEditor, setSettingEditor] = useState<SettingDraft | null>(null);
  const [candidateQuery, setCandidateQuery] = useState('');
  const deferredCandidateQuery = useDeferredValue(candidateQuery);
  const candidates = useAmbassadorCandidates(deferredCandidateQuery);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const setProgramFlags = useSetAmbassadorProgramFlags();
  const [programAction, setProgramAction] = useState<'network' | 'onboarding' | null>(null);

  const assignments = snapshot.data?.assignments ?? [];
  const principals = assignments.filter((item) => item.role === 'principal');
  const orphanAssociates = assignments.filter((item) => item.role === 'associate' && !item.principalAssignmentId);
  const activeCount = assignments.filter((item) => item.status === 'active').length;
  const pendingCount = (snapshot.data?.pendingMemberships ?? 0) + (snapshot.data?.pendingPromotions ?? 0);

  const begin = async (operation: () => Promise<unknown>, success: string) => {
    setError(null); setMessage(null);
    try { await operation(); setMessage(success); return true; }
    catch (caught) { setError(ambassadorErrorMessage(caught)); return false; }
  };

  const tabs = [
    { id: 'network' as const, label: 'Rede', icon: <UsersRound size={16} /> },
    { id: 'regions' as const, label: 'Países e regiões', icon: <MapPin size={16} /> },
    { id: 'settings' as const, label: 'Regras', icon: <SlidersHorizontal size={16} /> },
    { id: 'requests' as const, label: `Solicitações${pendingCount ? ` (${pendingCount})` : ''}`, icon: <UserRoundCheck size={16} /> },
    { id: 'audit' as const, label: 'Histórico', icon: <ShieldCheck size={16} /> },
    ...(canSeeTechnical ? [{ id: 'technical' as const, label: 'Ferramentas técnicas', icon: <RefreshCw size={16} /> }] : []),
  ];

  return (
    <>
      <header className="page-header ambassador-header">
        <div>
          <p className="section-label">Comercial</p>
          <h1>Rede de Embaixadores</h1>
          <span>Principais e Associados por vertical e país.</span>
        </div>
        <button className="button secondary" type="button" onClick={() => void snapshot.refetch()} disabled={snapshot.isFetching}>
          <RefreshCw className={snapshot.isFetching ? 'spin' : ''} size={16} /> Atualizar
        </button>
      </header>

      <section className="content ambassador-page">
        <div className="ambassador-summary">
          <span><strong>{formatNumber(snapshot.data?.total ?? 0)}</strong> atribuições</span>
          <span><strong>{formatNumber(activeCount)}</strong> ativas</span>
          <span><strong>{formatNumber(pendingCount)}</strong> pendências</span>
          <span><strong>{formatNumber(snapshot.data?.regions.filter((item) => item.active).length ?? 0)}</strong> regiões ativas</span>
        </div>

        {snapshot.data && !snapshot.data.program.networkEnabled ? (
          <div className="inline-alert ambassador-safe-mode"><ShieldCheck size={18} /><span>A infraestrutura está em modo seguro: rede, onboarding e alocação financeira permanecem desligados globalmente.</span></div>
        ) : null}
        {snapshot.data && canEdit ? <div className="ambassador-actions ambassador-program-actions"><button className="button secondary compact" onClick={() => setProgramAction('network')}>{snapshot.data.program.networkEnabled ? 'Desativar rede' : 'Ativar rede'}</button><button className="button primary compact" disabled={!snapshot.data.program.networkEnabled} onClick={() => setProgramAction('onboarding')}>{snapshot.data.program.onboardingEnabled ? 'Pausar onboarding profissional' : 'Ativar onboarding profissional'}</button><span>Financeiro: {snapshot.data.program.financialAllocationEnabled ? 'ativo' : 'bloqueado'}.</span></div> : null}
        {message ? <div className="inline-alert" role="status"><Check size={18} />{message}</div> : null}
        {error ? <div className="inline-alert danger" role="alert"><AlertTriangle size={18} />{error}</div> : null}

        <AmbassadorTabs label="Operação da rede" value={tab} items={tabs} onChange={setTab} />

        {snapshot.isLoading ? <div className="ambassador-loading"><RefreshCw className="spin" size={24} /></div> : null}
        {snapshot.isError ? <div className="inline-alert danger" role="alert"><AlertTriangle size={18} /><span>Não foi possível carregar a rede.</span><button className="button secondary compact" onClick={() => void snapshot.refetch()}>Tentar novamente</button></div> : null}

        {snapshot.data ? <AmbassadorTabPanel id="network" activeTab={tab}><NetworkTab
            snapshot={snapshot.data} filters={filters} setFilters={setFilters} principals={principals}
            orphanAssociates={orphanAssociates} selected={selected} setSelectedId={setSelectedId}
            canEdit={canEdit} isSuperAdmin={role.data === 'super_admin'} assignmentEditor={assignmentEditor} setAssignmentEditor={setAssignmentEditor}
            candidateQuery={candidateQuery} setCandidateQuery={setCandidateQuery} candidates={candidates.data ?? []}
            candidatesLoading={candidates.isFetching} candidatesError={candidates.isError}
            begin={begin}
          /></AmbassadorTabPanel> : null}
        {snapshot.data ? <AmbassadorTabPanel id="regions" activeTab={tab}><RegionsTab regions={snapshot.data.regions} canEdit={canEdit} editor={regionEditor} setEditor={setRegionEditor} begin={begin} /></AmbassadorTabPanel> : null}
        {snapshot.data ? <AmbassadorTabPanel id="settings" activeTab={tab}><SettingsTab settings={snapshot.data.networkSettings} groups={snapshot.data.affinityGroups} regions={snapshot.data.regions} canEdit={canEdit} editor={settingEditor} setEditor={setSettingEditor} begin={begin} /></AmbassadorTabPanel> : null}
        {snapshot.data ? <AmbassadorTabPanel id="requests" activeTab={tab}><RequestsTab assignments={assignments} canEdit={canEdit} begin={begin} /></AmbassadorTabPanel> : null}
        {snapshot.data && canSeeTechnical ? <AmbassadorTabPanel id="technical" activeTab={tab}><OperationsTab snapshot={snapshot.data} canEdit={canEdit} begin={begin} /></AmbassadorTabPanel> : null}
        <AmbassadorTabPanel id="audit" activeTab={tab}><AuditTab /></AmbassadorTabPanel>
      </section>
      <AmbassadorDialog
        open={programAction !== null}
        eyebrow="Configuração global"
        title={programAction === 'network' ? `${snapshot.data?.program.networkEnabled ? 'Desativar' : 'Ativar'} a rede?` : `${snapshot.data?.program.onboardingEnabled ? 'Pausar' : 'Ativar'} o onboarding profissional?`}
        description={programAction === 'network' ? 'A mudança afeta a disponibilidade global da rede.' : 'Somente o onboarding de profissionais será alterado; o onboarding padrão permanece intacto.'}
        confirmLabel="Confirmar"
        tone={programAction === 'network' && snapshot.data?.program.networkEnabled ? 'danger' : 'primary'}
        pending={setProgramFlags.isPending}
        onCancel={() => setProgramAction(null)}
        onConfirm={async () => {
          if (!snapshot.data || !programAction) return;
          const enabled = programAction === 'network' ? !snapshot.data.program.networkEnabled : !snapshot.data.program.onboardingEnabled;
          const succeeded = await begin(
            () => setProgramFlags.mutateAsync(programAction === 'network'
              ? { networkEnabled: enabled, onboardingEnabled: false }
              : { networkEnabled: true, onboardingEnabled: enabled }),
            programAction === 'network' ? `Rede ${enabled ? 'ativada' : 'desativada'}.` : `Onboarding profissional ${enabled ? 'ativado' : 'pausado'}.`,
          );
          if (succeeded) setProgramAction(null);
        }}
      />
    </>
  );
}

function NetworkTab({ snapshot, filters, setFilters, principals, orphanAssociates, selected, setSelectedId, canEdit, isSuperAdmin, assignmentEditor, setAssignmentEditor, candidateQuery, setCandidateQuery, candidates, candidatesLoading, candidatesError, begin }: {
  snapshot: NonNullable<ReturnType<typeof useAmbassadorSnapshot>['data']>;
  filters: Filters; setFilters: (value: Filters) => void; principals: AmbassadorAssignment[]; orphanAssociates: AmbassadorAssignment[];
  selected: AmbassadorAssignment | null; setSelectedId: (id: string | null) => void; canEdit: boolean; isSuperAdmin: boolean;
  assignmentEditor: AssignmentDraft | null; setAssignmentEditor: (value: AssignmentDraft | null) => void;
  candidateQuery: string; setCandidateQuery: (value: string) => void;
  candidates: AmbassadorCandidate[];
  candidatesLoading: boolean; candidatesError: boolean;
  begin: (operation: () => Promise<unknown>, success: string) => Promise<boolean>;
}) {
  const save = useSaveAmbassadorAssignment();
  const prepareCandidate = usePrepareAmbassadorCandidate();
  const transition = useTransitionAmbassadorAssignment();
  const transfer = useTransferAmbassadorAssociate();
  const impact = useAmbassadorAssignmentImpact(selected?.id ?? null);
  const memberships = useAmbassadorMemberships(selected?.id ?? null);
  const transferMembership = useTransferAmbassadorMembership();
  const [discardOpen, setDiscardOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [preparationReason, setPreparationReason] = useState(defaultAmbassadorPreparationReason);
  const [action, setAction] = useState<{
    title: string; description: string; label: string; tone?: 'primary' | 'danger'; run: () => Promise<unknown>; success: string;
  } | null>(null);
  const assignmentBaseline = assignmentEditor?.id ? assignmentDraft(snapshot.assignments.find((item) => item.id === assignmentEditor.id)) : assignmentDraft();
  const assignmentDirty = Boolean(assignmentEditor && JSON.stringify(assignmentEditor) !== JSON.stringify(assignmentBaseline));
  useUnsavedWarning(assignmentDirty);

  const compatiblePrincipals = snapshot.assignments.filter((item) => item.role === 'principal' && item.status === 'active'
    && (!assignmentEditor || (item.affinityGroupKey === assignmentEditor.affinityGroupKey && item.regionId === assignmentEditor.regionId)));

  const closeEditor = () => {
    if (assignmentDirty) setDiscardOpen(true);
    else setAssignmentEditor(null);
  };
  const discardEditor = () => {
    setAssignmentEditor(null); setCandidateQuery(''); setFormError(null);
    setPreparationReason(defaultAmbassadorPreparationReason); setDiscardOpen(false);
  };

  const saveAssignment = async (event: FormEvent) => {
    event.preventDefault();
    if (!assignmentEditor?.profileId || !assignmentEditor.affinityGroupKey || !assignmentEditor.regionId) {
      setFormError('Selecione o perfil, a vertical e o país.');
      return;
    }
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const intent = assignmentEditor.id || submitter?.value === 'draft' ? 'draft' : 'activate';
    const needsPreparation = !assignmentEditor.profileIsProfessional;
    if (needsPreparation && !isSuperAdmin) {
      setFormError('Este perfil ainda é membro. Somente um superadministrador pode habilitá-lo como profissional.');
      return;
    }
    if (needsPreparation && preparationReason.trim().length < 10) {
      setFormError('Informe o motivo da habilitação profissional com pelo menos 10 caracteres.');
      return;
    }
    setFormError(null);
    let persistedId = '';
    let persistedUpdatedAt = '';
    const succeeded = await begin(async () => {
      if (needsPreparation) {
        await prepareCandidate.mutateAsync({ profileId: assignmentEditor.profileId, reason: preparationReason.trim() });
      }
      const persisted = await save.mutateAsync({
        id: assignmentEditor.id, expectedUpdatedAt: assignmentEditor.expectedUpdatedAt,
        profileId: assignmentEditor.profileId, role: assignmentEditor.role,
        affinityGroupKey: assignmentEditor.affinityGroupKey, regionId: assignmentEditor.regionId,
        principalAssignmentId: assignmentEditor.role === 'associate' ? assignmentEditor.principalAssignmentId || null : null,
        publicVisible: assignmentEditor.publicVisible, displayOrder: Number(assignmentEditor.displayOrder) || 0,
        headline: assignmentEditor.headline, badgeLabel: assignmentEditor.badgeLabel,
        contractReference: assignmentEditor.contractReference,
        startsAt: assignmentEditor.startsAt ? new Date(assignmentEditor.startsAt).toISOString() : null,
        endsAt: assignmentEditor.endsAt ? new Date(assignmentEditor.endsAt).toISOString() : null,
      });
      persistedId = persisted.id;
      persistedUpdatedAt = persisted.updatedAt;
      if (!assignmentEditor.id && intent === 'activate') {
        await transition.mutateAsync({
          id: persisted.id, action: 'activate', publicVisible: assignmentEditor.publicVisible,
          expectedUpdatedAt: persisted.updatedAt,
        });
      }
    }, assignmentEditor.id ? 'Atribuição atualizada.' : intent === 'activate'
      ? `Embaixador ativado${assignmentEditor.publicVisible ? ' e publicado no app' : ''}.`
      : 'Atribuição salva como rascunho.');
    if (!succeeded && persistedId && !assignmentEditor.id) {
      setAssignmentEditor({ ...assignmentEditor, id: persistedId, expectedUpdatedAt: persistedUpdatedAt, profileIsProfessional: true });
    }
    if (succeeded) discardEditor();
  };

  const runTransition = async (item: AmbassadorAssignment, action: string, publicVisible = item.publicVisible) => {
    const currentImpact = await impact.refetch();
    const value = currentImpact.data ?? item.impact;
    const labels: Record<string, string> = { submit: 'Enviar para aprovação', activate: 'Ativar', suspend: 'Suspender', end: 'Encerrar', reactivate: 'Reativar' };
    setAction({
      title: `${labels[action] ?? 'Alterar'} ${item.profileName}?`,
      description: ['suspend', 'end'].includes(action)
        ? `Impacto: ${value.currentMemberships} vínculos, ${value.pendingRequests} pedidos e ${value.activeAssociates} Associados.`
        : `A atribuição ficará como ${action === 'submit' ? 'pendente' : action === 'activate' || action === 'reactivate' ? 'ativa' : action}.`,
      label: labels[action] ?? 'Confirmar', tone: ['suspend', 'end'].includes(action) ? 'danger' : 'primary',
      run: () => transition.mutateAsync({ id: item.id, action, publicVisible: action === 'activate' || action === 'reactivate' ? publicVisible : false, expectedUpdatedAt: item.updatedAt }),
      success: 'Estado da atribuição atualizado.',
    });
  };

  const publishAssignment = (item: AmbassadorAssignment) => {
    setAction({
      title: `Publicar ${item.profileName} no aplicativo?`,
      description: 'O embaixador já está ativo e passará a aparecer imediatamente nas áreas públicas do aplicativo.',
      label: 'Publicar no app',
      tone: 'primary',
      run: () => save.mutateAsync({
        id: item.id, expectedUpdatedAt: item.updatedAt, profileId: item.profileId, role: item.role,
        affinityGroupKey: item.affinityGroupKey, regionId: item.regionId,
        principalAssignmentId: item.principalAssignmentId, publicVisible: true,
        displayOrder: item.displayOrder, headline: item.headline ?? '', badgeLabel: item.badgeLabel ?? '',
        contractReference: item.contractReference ?? '', startsAt: item.startsAt, endsAt: item.endsAt,
      }),
      success: 'Embaixador publicado no aplicativo.',
    });
  };

  return (
    <div className="ambassador-network-layout">
      <div className="ambassador-tree-panel">
        <div className="ambassador-toolbar">
          <select value={filters.affinityGroupKey} onChange={(event) => setFilters({ ...filters, affinityGroupKey: event.target.value, offset: 0 })}><option value="">Todas as verticais</option>{snapshot.affinityGroups.map((item) => <option value={item.key} key={item.key}>{item.label}</option>)}</select>
          <select value={filters.regionId} onChange={(event) => setFilters({ ...filters, regionId: event.target.value, offset: 0 })}><option value="">Todas as regiões</option>{snapshot.regions.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select>
          <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value, offset: 0 })}><option value="">Todos os estados</option>{['draft', 'pending', 'active', 'suspended', 'ended'].map((status) => <option value={status} key={status}>{statusLabel[status]}</option>)}</select>
          {canEdit ? <button className="button primary compact" type="button" onClick={() => { setAssignmentEditor(assignmentDraft()); setSelectedId(null); }}><Plus size={15} />Nova atribuição</button> : null}
        </div>
        <div className="ambassador-tree">
          {principals.map((principal) => <AssignmentBranch key={principal.id} principal={principal} associates={snapshot.assignments.filter((item) => item.principalAssignmentId === principal.id)} selectedId={selected?.id ?? null} onSelect={setSelectedId} />)}
          {orphanAssociates.length ? <div className="ambassador-orphans"><h3><CircleOff size={16} />Associados sob supervisão da plataforma</h3>{orphanAssociates.map((item) => <AssignmentCard item={item} selected={selected?.id === item.id} onSelect={setSelectedId} key={item.id} />)}</div> : null}
          {!snapshot.assignments.length ? <div className="ambassador-empty"><UsersRound size={28} /><strong>Nenhuma atribuição encontrada</strong><span>Cadastre uma região e escolha os primeiros embaixadores.</span></div> : null}
        </div>
        {snapshot.total > snapshot.limit ? <div className="ambassador-pagination"><button className="button secondary compact" disabled={filters.offset === 0} onClick={() => setFilters({ ...filters, offset: Math.max(0, filters.offset - snapshot.limit) })}>Anterior</button><span>{filters.offset + 1}–{Math.min(filters.offset + snapshot.limit, snapshot.total)} de {snapshot.total}</span><button className="button secondary compact" disabled={filters.offset + snapshot.limit >= snapshot.total} onClick={() => setFilters({ ...filters, offset: filters.offset + snapshot.limit })}>Próxima</button></div> : null}
      </div>

      {assignmentEditor ? (
        <form className="ambassador-editor" onSubmit={saveAssignment}>
          <div className="ambassador-panel-head"><div><span>Atribuição</span><h2>{assignmentEditor.id ? 'Editar embaixador' : 'Novo embaixador'}</h2></div><CloseButton label="Fechar editor" onClick={closeEditor} /></div>
          {!assignmentEditor.id ? <label className="ambassador-field"><span>Usuário</span><div className="ambassador-search"><Search aria-hidden="true" size={16} /><input aria-autocomplete="list" aria-controls="ambassador-candidate-list" aria-expanded={candidateQuery.trim().length >= 2} aria-haspopup="listbox" role="combobox" required value={candidateQuery} onChange={(event) => { setCandidateQuery(event.target.value); setAssignmentEditor({ ...assignmentEditor, profileId: '', profileLabel: '', profileIsProfessional: false, profileHasBrCpf: false }); }} placeholder="Nome ou @usuário" /></div>{candidatesLoading ? <small className="ambassador-search-state"><RefreshCw className="spin" size={13} />Buscando…</small> : candidatesError ? <small className="ambassador-search-state danger">Não foi possível buscar usuários.</small> : candidateQuery.trim().length >= 2 && !candidates.length ? <small className="ambassador-search-state">Nenhum usuário encontrado. Confira a grafia do nome ou @usuário.</small> : null}{candidates.length ? <div className="ambassador-candidates" id="ambassador-candidate-list" role="listbox">{candidates.map((candidate) => <button aria-selected={assignmentEditor.profileId === candidate.id} role="option" type="button" key={candidate.id} onClick={() => { setAssignmentEditor({ ...assignmentEditor, profileId: candidate.id, profileLabel: candidate.profileName, profileIsProfessional: candidate.isProfessional, profileHasBrCpf: candidate.hasBrCpf }); setCandidateQuery(candidate.profileName); }}><strong>{candidate.profileName}</strong><span>{candidate.username ? `@${candidate.username}` : 'sem usuário'} · {candidate.isProfessional ? 'Profissional' : 'Membro'} · {formatNumber(candidate.followerCount)} seguidores{candidate.activeAssignmentCount ? ` · ${candidate.activeAssignmentCount} vínculo(s)` : ''}</span>{candidate.activeAssignments.length ? <small>{candidate.activeAssignments.map((item) => `${item.countryCode} · ${item.affinityGroupLabel} · ${item.role === 'principal' ? 'Principal' : 'Associado'}`).join(' | ')}</small> : null}</button>)}</div> : null}</label> : <div className="ambassador-selected-profile"><UserRoundCheck size={18} /><strong>{assignmentEditor.profileLabel}</strong></div>}
          {assignmentEditor.profileId && !assignmentEditor.profileIsProfessional ? <div className={`inline-alert ${isSuperAdmin ? '' : 'danger'}`}><ShieldCheck size={18} /><span>{isSuperAdmin ? `Este usuário ainda é membro. Ao continuar, ele será habilitado como profissional${assignmentEditor.profileHasBrCpf ? '.' : ' com dispensa temporária de CPF; pagamentos continuarão bloqueados até o documento fiscal.'}` : 'Este usuário ainda é membro. Peça a um superadministrador para habilitá-lo como profissional.'}</span></div> : null}
          {assignmentEditor.profileId && !assignmentEditor.profileIsProfessional && isSuperAdmin ? <label className="ambassador-field"><span>Motivo da habilitação profissional</span><textarea required minLength={10} maxLength={500} value={preparationReason} onChange={(event) => setPreparationReason(event.target.value)} /></label> : null}
          <div className="ambassador-form-grid">
            <label className="ambassador-field"><span>Nível</span><select value={assignmentEditor.role} onChange={(event) => setAssignmentEditor({ ...assignmentEditor, role: event.target.value as AssignmentDraft['role'], principalAssignmentId: '' })}><option value="principal">Principal</option><option value="associate">Associado</option></select></label>
            <label className="ambassador-field"><span>Vertical</span><select required value={assignmentEditor.affinityGroupKey} onChange={(event) => setAssignmentEditor({ ...assignmentEditor, affinityGroupKey: event.target.value, principalAssignmentId: '' })}><option value="">Selecione</option>{snapshot.affinityGroups.map((item) => <option value={item.key} key={item.key}>{item.label}{item.active ? '' : ' (inativa)'}</option>)}</select></label>
            <label className="ambassador-field"><span>País / região contratual</span><select required value={assignmentEditor.regionId} onChange={(event) => setAssignmentEditor({ ...assignmentEditor, regionId: event.target.value, principalAssignmentId: '' })}><option value="">Selecione o país</option>{snapshot.regions.filter((item) => item.countryCode).map((item) => <option value={item.id} key={item.id}>[{item.countryCode}] {item.name}{item.stateCode ? ` · ${item.stateCode}` : ''}{item.cityName ? ` · ${item.cityName}` : ''}{item.active ? '' : ' (inativa)'}</option>)}</select></label>
            {assignmentEditor.role === 'associate' ? <label className="ambassador-field"><span>Principal</span><select value={assignmentEditor.principalAssignmentId} onChange={(event) => setAssignmentEditor({ ...assignmentEditor, principalAssignmentId: event.target.value })}><option value="">Supervisão da plataforma</option>{compatiblePrincipals.map((item) => <option value={item.id} key={item.id}>{item.profileName}</option>)}</select></label> : null}
          </div>
          <small className="ambassador-muted">Principal representa a vertical no país. Associado atua sob um principal ou sob supervisão direta da plataforma.</small>
          <label className="ambassador-check"><input type="checkbox" checked={assignmentEditor.publicVisible} onChange={(event) => setAssignmentEditor({ ...assignmentEditor, publicVisible: event.target.checked })} /><span>Exibir no aplicativo assim que estiver ativo</span></label>
          <details className="ambassador-progressive"><summary>Personalização pública</summary><div className="ambassador-form-grid"><label className="ambassador-field"><span>Ordem</span><input type="number" value={assignmentEditor.displayOrder} onChange={(event) => setAssignmentEditor({ ...assignmentEditor, displayOrder: event.target.value })} /></label><label className="ambassador-field"><span>Selo</span><input maxLength={40} value={assignmentEditor.badgeLabel} onChange={(event) => setAssignmentEditor({ ...assignmentEditor, badgeLabel: event.target.value })} /></label><label className="ambassador-field wide"><span>Chamada</span><input maxLength={160} value={assignmentEditor.headline} onChange={(event) => setAssignmentEditor({ ...assignmentEditor, headline: event.target.value })} /></label></div></details>
          <details className="ambassador-progressive"><summary>Avançado</summary><div className="ambassador-form-grid"><label className="ambassador-field wide"><span>Referência contratual</span><input maxLength={160} value={assignmentEditor.contractReference} onChange={(event) => setAssignmentEditor({ ...assignmentEditor, contractReference: event.target.value })} /></label><label className="ambassador-field"><span>Início</span><input type="datetime-local" value={assignmentEditor.startsAt} onChange={(event) => setAssignmentEditor({ ...assignmentEditor, startsAt: event.target.value })} /></label><label className="ambassador-field"><span>Fim</span><input type="datetime-local" value={assignmentEditor.endsAt} onChange={(event) => setAssignmentEditor({ ...assignmentEditor, endsAt: event.target.value })} /></label></div></details>
          {formError ? <div className="inline-alert danger" role="alert"><AlertTriangle size={18} />{formError}</div> : null}
          <div className="ambassador-editor-actions"><button className="button secondary" type="button" onClick={closeEditor}>Cancelar</button>{!assignmentEditor.id ? <button className="button secondary" type="submit" name="intent" value="draft" disabled={save.isPending || transition.isPending || prepareCandidate.isPending || !assignmentEditor.profileId || !assignmentEditor.affinityGroupKey || !assignmentEditor.regionId || (!assignmentEditor.profileIsProfessional && !isSuperAdmin)}><Save size={16} />Salvar rascunho</button> : null}<button className="button primary" type="submit" name="intent" value="activate" disabled={save.isPending || transition.isPending || prepareCandidate.isPending || !assignmentEditor.profileId || !assignmentEditor.affinityGroupKey || !assignmentEditor.regionId || (!assignmentEditor.profileIsProfessional && !isSuperAdmin)}><Check size={16} />{assignmentEditor.id ? 'Salvar alterações' : assignmentEditor.profileIsProfessional ? 'Criar e publicar' : 'Habilitar, criar e publicar'}</button></div>
        </form>
      ) : selected ? (
        <aside className="ambassador-detail-panel">
          <div className="ambassador-panel-head"><div><span>{selected.role === 'principal' ? 'Embaixador Principal' : 'Embaixador Associado'}</span><h2>{selected.profileName}</h2><p>{selected.affinityGroupLabel} · {selected.regionCountryCode} · {selected.regionName}</p></div><CloseButton label="Fechar detalhes" onClick={() => setSelectedId(null)} /></div>
          <div className="ambassador-impact-grid"><span><strong>{selected.impact.currentMemberships}</strong>profissionais</span><span><strong>{selected.impact.pendingRequests}</strong>pedidos</span><span><strong>{selected.impact.activeAssociates}</strong>Associados</span></div>
          {selected.status === 'active' && !selected.publicVisible ? <div className="inline-alert danger"><AlertTriangle size={18} /><span>Este embaixador está ativo, mas oculto no aplicativo.</span></div> : null}
          {canEdit ? <div className="ambassador-actions"><button className="button secondary compact" onClick={() => setAssignmentEditor(assignmentDraft(selected))}><Pencil size={14} />Editar</button>{selected.status === 'draft' ? <><button className="button primary compact" onClick={() => void runTransition(selected, 'activate', true)}><Check size={14} />Ativar e publicar</button><button className="button secondary compact" onClick={() => void runTransition(selected, 'submit')}>Enviar para revisão</button></> : null}{selected.status === 'pending' ? <button className="button primary compact" onClick={() => void runTransition(selected, 'activate', true)}><Check size={14} />Aprovar e publicar</button> : null}{selected.status === 'active' && !selected.publicVisible ? <button className="button primary compact" onClick={() => publishAssignment(selected)}><Check size={14} />Publicar no app</button> : null}{selected.status === 'active' ? <><button className="button secondary compact" onClick={() => void runTransition(selected, 'suspend')}><CircleOff size={14} />Suspender</button><button className="button danger compact" onClick={() => void runTransition(selected, 'end')}>Encerrar</button></> : null}{selected.status === 'suspended' ? <button className="button primary compact" onClick={() => void runTransition(selected, 'reactivate', true)}>Reativar e publicar</button> : null}</div> : null}
          {selected.role === 'associate' && canEdit && selected.status !== 'ended' ? <label className="ambassador-field"><span>Transferir supervisão</span><select value={selected.principalAssignmentId ?? ''} onChange={(event) => { const target = event.target.value; if (target === (selected.principalAssignmentId ?? '')) return; const principal = snapshot.assignments.find((item) => item.id === target); setAction({ title: `Transferir ${selected.profileName}?`, description: `Nova supervisão: ${principal?.profileName ?? 'Plataforma'}. O histórico será preservado.`, label: 'Transferir', run: () => transfer.mutateAsync({ id: selected.id, principalAssignmentId: target || null, expectedUpdatedAt: selected.updatedAt }), success: 'Associado transferido com histórico preservado.' }); }}><option value="">Plataforma</option>{snapshot.assignments.filter((item) => item.role === 'principal' && item.status === 'active' && item.affinityGroupKey === selected.affinityGroupKey && item.regionId === selected.regionId).map((item) => <option value={item.id} key={item.id}>{item.profileName}</option>)}</select></label> : null}
          <section className="ambassador-detail-section"><h3>Profissionais vinculados</h3>{memberships.isLoading ? <RefreshCw className="spin" size={18} /> : memberships.isError ? <div className="inline-alert danger" role="alert">Não foi possível carregar os vínculos.</div> : memberships.data?.items.length ? <div className="ambassador-member-list">{memberships.data.items.map((member) => <div key={member.id}><div><strong>{member.professionalName}</strong><span>{statusLabel[member.status] ?? member.status} · {member.affinityGroupLabel}</span></div>{canEdit && member.status === 'approved' ? <button className="button secondary compact" onClick={() => setAction({ title: `Desvincular ${member.professionalName}?`, description: 'O profissional passará para supervisão direta da plataforma.', label: 'Desvincular', tone: 'danger', run: () => transferMembership.mutateAsync({ id: member.id, assignmentId: null, reasonCode: 'staff_transfer', expectedUpdatedAt: member.updatedAt }), success: 'Profissional transferido para supervisão da plataforma.' })}><ArrowRightLeft size={13} />Desvincular</button> : null}</div>)}</div> : <p className="ambassador-muted">Nenhum profissional nesta atribuição.</p>}</section>
        </aside>
      ) : <aside className="ambassador-detail-panel ambassador-empty"><ChevronRight size={28} /><strong>Selecione uma atribuição</strong><span>Veja impacto, profissionais e ações operacionais.</span></aside>}
      <AmbassadorDialog open={discardOpen} eyebrow="Alterações não salvas" title="Descartar alterações?" description="O conteúdo preenchido será perdido." confirmLabel="Descartar" tone="danger" onCancel={() => setDiscardOpen(false)} onConfirm={discardEditor} />
      <AmbassadorDialog open={action !== null} eyebrow="Revisar ação" title={action?.title ?? ''} description={action?.description} confirmLabel={action?.label ?? 'Confirmar'} tone={action?.tone} pending={save.isPending || transition.isPending || transfer.isPending || transferMembership.isPending} onCancel={() => setAction(null)} onConfirm={async () => { if (!action) return; if (await begin(action.run, action.success)) setAction(null); }} />
    </div>
  );
}

function AssignmentBranch({ principal, associates, selectedId, onSelect }: { principal: AmbassadorAssignment; associates: AmbassadorAssignment[]; selectedId: string | null; onSelect: (id: string) => void }) {
  return <div className="ambassador-branch"><AssignmentCard item={principal} selected={principal.id === selectedId} onSelect={onSelect} />{associates.length ? <div className="ambassador-associates">{associates.map((item) => <AssignmentCard item={item} selected={item.id === selectedId} onSelect={onSelect} key={item.id} />)}</div> : null}</div>;
}

function AssignmentCard({ item, selected, onSelect }: { item: AmbassadorAssignment; selected: boolean; onSelect: (id: string) => void }) {
  return <button type="button" className={`ambassador-card ${selected ? 'selected' : ''} ${item.status}`} onClick={() => onSelect(item.id)}><span className="ambassador-avatar">{item.avatarUrl ? <img src={item.avatarUrl} alt="" /> : item.role === 'principal' ? <Crown size={18} /> : <UsersRound size={18} />}</span><span className="ambassador-card-copy"><strong>{item.profileName}</strong><small>{item.role === 'principal' ? 'Principal' : 'Associado'} · {item.affinityGroupLabel} · {item.regionCountryCode} · {item.regionName}</small><em>{item.headline || 'Sem chamada pública'}</em></span><span className={`ambassador-status ${item.status}`}>{item.status === 'active' && !item.publicVisible ? 'Ativo · oculto' : statusLabel[item.status]}</span><ChevronRight size={16} /></button>;
}

function RegionsTab({ regions, canEdit, editor, setEditor, begin }: { regions: CommercialRegion[]; canEdit: boolean; editor: RegionDraft | null; setEditor: (value: RegionDraft | null) => void; begin: (operation: () => Promise<unknown>, success: string) => Promise<boolean> }) {
  const save = useSaveCommercialRegion();
  const toggle = useSetCommercialRegionActive();
  const [discardOpen, setDiscardOpen] = useState(false);
  const [toggleRegion, setToggleRegion] = useState<CommercialRegion | null>(null);
  const regionBaseline = editor?.id ? regionDraft(regions.find((item) => item.id === editor.id)) : regionDraft();
  const dirty = Boolean(editor && JSON.stringify(editor) !== JSON.stringify(regionBaseline));
  useUnsavedWarning(dirty);
  const close = () => dirty ? setDiscardOpen(true) : setEditor(null);
  const discard = () => { setEditor(null); setDiscardOpen(false); };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!editor) return;
    const succeeded = await begin(() => save.mutateAsync({
      id: editor.id, expectedUpdatedAt: editor.expectedUpdatedAt, name: editor.name.trim(), slug: editor.slug,
      scopeType: editor.scopeType, countryCode: editor.countryCode || null, stateCode: editor.stateCode || null,
      cityName: editor.cityName || null, parentId: editor.parentId || null,
      specificity: Number(editor.specificity) || 0, priority: Number(editor.priority) || 0,
    }), editor.id ? 'Região atualizada.' : 'Região criada.');
    if (succeeded) discard();
  };
  return <div className={`ambassador-regions-layout ${editor ? 'has-editor' : ''}`}>
    <div className="ambassador-list-panel">
      <div className="ambassador-section-head"><div><h2>Países e regiões</h2><p>Definem onde cada embaixador atua.</p></div>{canEdit ? <button className="button primary compact" onClick={() => setEditor(regionDraft())}><Plus size={15} />Nova região</button> : null}</div>
      <div className="ambassador-region-list">{regions.map((region) => <div key={region.id} className={!region.active ? 'inactive' : ''}><MapPin size={17} /><div><strong>{region.name}</strong><span>{region.countryCode ?? 'Global'} · prioridade {region.priority}</span><small>{region.assignmentCount} atribuições · {region.currentMembershipCount} vínculos</small></div><span className={`ambassador-status ${region.active ? 'active' : 'ended'}`}>{region.active ? 'Ativa' : 'Inativa'}</span>{canEdit ? <><button className="button secondary compact" onClick={() => setEditor(regionDraft(region))}><Pencil size={13} />Editar</button><button className={region.active ? 'button danger compact' : 'button primary compact'} onClick={() => setToggleRegion(region)}>{region.active ? 'Desativar' : 'Ativar'}</button></> : null}</div>)}</div>
      {!regions.length ? <div className="ambassador-empty"><MapPin size={28} /><strong>Nenhuma região</strong><span>Cadastre o primeiro país ou território.</span></div> : null}
    </div>
    {editor ? <form className="ambassador-editor" onSubmit={submit}><div className="ambassador-panel-head"><div><span>Território</span><h2>{editor.id ? 'Editar região' : 'Nova região'}</h2></div><CloseButton label="Fechar editor" onClick={close} /></div><label className="ambassador-field"><span>Nome</span><input required minLength={2} value={editor.name} onChange={(event) => setEditor({ ...editor, name: event.target.value, slug: editor.id ? editor.slug : slugify(event.target.value) })} /></label><label className="ambassador-field"><span>Identificador</span><input required pattern="[a-z0-9-]+" value={editor.slug} onChange={(event) => setEditor({ ...editor, slug: slugify(event.target.value) })} /></label><label className="ambassador-field"><span>Tipo</span><select value={editor.scopeType} onChange={(event) => setEditor({ ...editor, scopeType: event.target.value as RegionDraft['scopeType'] })}><option value="global">Global</option><option value="country">País</option><option value="state">Estado</option><option value="city">Cidade</option><option value="custom">Personalizada</option></select></label><div className="ambassador-form-grid"><label className="ambassador-field"><span>País</span><input required={editor.scopeType !== 'global'} pattern="[A-Z]{2}" maxLength={2} value={editor.countryCode} onChange={(event) => setEditor({ ...editor, countryCode: event.target.value.toUpperCase() })} placeholder="BR" /></label><label className="ambassador-field"><span>Estado</span><input maxLength={8} value={editor.stateCode} onChange={(event) => setEditor({ ...editor, stateCode: event.target.value.toUpperCase() })} /></label><label className="ambassador-field"><span>Cidade</span><input maxLength={100} value={editor.cityName} onChange={(event) => setEditor({ ...editor, cityName: event.target.value })} /></label><label className="ambassador-field"><span>Região pai</span><select value={editor.parentId} onChange={(event) => setEditor({ ...editor, parentId: event.target.value })}><option value="">Nenhuma</option>{regions.filter((item) => item.id !== editor.id).map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label></div><details className="ambassador-progressive"><summary>Avançado</summary><div className="ambassador-form-grid"><label className="ambassador-field"><span>Especificidade</span><input type="number" min="0" max="100" value={editor.specificity} onChange={(event) => setEditor({ ...editor, specificity: event.target.value })} /></label><label className="ambassador-field"><span>Prioridade</span><input type="number" value={editor.priority} onChange={(event) => setEditor({ ...editor, priority: event.target.value })} /></label></div></details><div className="ambassador-editor-actions"><button className="button secondary" type="button" onClick={close}>Cancelar</button><button className="button primary" type="submit" disabled={save.isPending || !editor.name.trim() || !editor.slug}><Save size={16} />Salvar</button></div></form> : null}
    <AmbassadorDialog open={discardOpen} eyebrow="Alterações não salvas" title="Descartar alterações?" description="O conteúdo preenchido será perdido." confirmLabel="Descartar" tone="danger" onCancel={() => setDiscardOpen(false)} onConfirm={discard} />
    <AmbassadorDialog open={toggleRegion !== null} eyebrow="Revisar ação" title={`${toggleRegion?.active ? 'Desativar' : 'Ativar'} ${toggleRegion?.name ?? ''}?`} description={toggleRegion?.active ? `A região possui ${toggleRegion.assignmentCount} atribuições e ${toggleRegion.currentMembershipCount} vínculos.` : 'A região voltará a ficar disponível para configuração.'} confirmLabel={toggleRegion?.active ? 'Desativar' : 'Ativar'} tone={toggleRegion?.active ? 'danger' : 'primary'} pending={toggle.isPending} onCancel={() => setToggleRegion(null)} onConfirm={async () => { if (!toggleRegion) return; if (await begin(() => toggle.mutateAsync({ id: toggleRegion.id, active: !toggleRegion.active, expectedUpdatedAt: toggleRegion.updatedAt }), toggleRegion.active ? 'Região desativada.' : 'Região ativada.')) setToggleRegion(null); }} />
  </div>;
}

function SettingsTab({ settings, groups, regions, canEdit, editor, setEditor, begin }: { settings: AmbassadorNetworkSetting[]; groups: Array<{ key: string; label: string }>; regions: CommercialRegion[]; canEdit: boolean; editor: SettingDraft | null; setEditor: (value: SettingDraft | null) => void; begin: (operation: () => Promise<unknown>, success: string) => Promise<boolean> }) {
  const save = useSaveAmbassadorNetworkSetting();
  const [discardOpen, setDiscardOpen] = useState(false);
  const settingBaseline = editor?.id ? settingDraft(settings.find((item) => item.id === editor.id)) : settingDraft();
  const dirty = Boolean(editor && JSON.stringify(editor) !== JSON.stringify(settingBaseline));
  useUnsavedWarning(dirty);
  const close = () => dirty ? setDiscardOpen(true) : setEditor(null);
  const discard = () => { setEditor(null); setDiscardOpen(false); };
  const submit = async (event: FormEvent) => {
    event.preventDefault(); if (!editor) return;
    const succeeded = await begin(() => save.mutateAsync({ id: editor.id, expectedUpdatedAt: editor.expectedUpdatedAt, affinityGroupKey: editor.affinityGroupKey, regionId: editor.regionId || null, followerThreshold: Number(editor.followerThreshold), manualChoiceEnabled: true, referralCodeEnabled: false, automaticPrincipalEnabled: false, moderationEnabled: editor.moderationEnabled, published: editor.published }), editor.id ? 'Regra atualizada.' : 'Regra criada.');
    if (succeeded) discard();
  };
  return <div className={`ambassador-regions-layout ${editor ? 'has-editor' : ''}`}><div className="ambassador-list-panel"><div className="ambassador-section-head"><div><h2>Regras da rede</h2><p>Uma regra por vertical e, se necessário, região.</p></div>{canEdit ? <button className="button primary compact" onClick={() => setEditor(settingDraft())}><Plus size={15} />Nova regra</button> : null}</div><div className="ambassador-setting-list">{settings.map((setting) => <div key={setting.id}><SlidersHorizontal size={17} /><div><strong>{groups.find((item) => item.key === setting.affinityGroupKey)?.label ?? setting.affinityGroupKey}</strong><span>{setting.regionId ? regions.find((item) => item.id === setting.regionId)?.name : 'Geral'}</span><small>Escolha por nome ou @usuário · v{setting.version}</small></div><span className={`ambassador-status ${setting.published ? 'active' : 'draft'}`}>{setting.published ? 'Publicada' : 'Rascunho'}</span>{canEdit ? <button className="button secondary compact" onClick={() => setEditor(settingDraft(setting))}><Pencil size={13} />Editar</button> : null}</div>)}</div>{!settings.length ? <div className="ambassador-empty"><SlidersHorizontal size={28} /><strong>Nenhuma regra</strong><span>Crie a primeira regra da rede.</span></div> : null}</div>{editor ? <form className="ambassador-editor" onSubmit={submit}><div className="ambassador-panel-head"><div><span>Configuração</span><h2>{editor.id ? 'Editar regra' : 'Nova regra'}</h2></div><CloseButton label="Fechar editor" onClick={close} /></div><label className="ambassador-field"><span>Vertical</span><select required value={editor.affinityGroupKey} onChange={(event) => setEditor({ ...editor, affinityGroupKey: event.target.value })}><option value="">Selecione</option>{groups.map((item) => <option value={item.key} key={item.key}>{item.label}</option>)}</select></label><label className="ambassador-field"><span>Região</span><select value={editor.regionId} onChange={(event) => setEditor({ ...editor, regionId: event.target.value })}><option value="">Geral</option>{regions.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>{([['moderationEnabled', 'Moderar recusas de Associados'], ['published', 'Regra publicada']] as const).map(([key, label]) => <label className="ambassador-check" key={key}><input type="checkbox" checked={editor[key]} onChange={(event) => setEditor({ ...editor, [key]: event.target.checked })} /><span>{label}</span></label>)}<details className="ambassador-progressive"><summary>Avançado</summary><label className="ambassador-field"><span>Mínimo de seguidores</span><input type="number" min="0" step="1" required value={editor.followerThreshold} onChange={(event) => setEditor({ ...editor, followerThreshold: event.target.value })} /><small>Valor existente usado pela regra; zero desativa o limite.</small></label></details><div className="ambassador-editor-actions"><button className="button secondary" type="button" onClick={close}>Cancelar</button><button className="button primary" type="submit" disabled={save.isPending || !editor.affinityGroupKey}><Save size={16} />Salvar</button></div></form> : null}<AmbassadorDialog open={discardOpen} eyebrow="Alterações não salvas" title="Descartar alterações?" description="O conteúdo preenchido será perdido." confirmLabel="Descartar" tone="danger" onCancel={() => setDiscardOpen(false)} onConfirm={discard} /></div>;
}

function RequestsTab({ assignments, canEdit, begin }: { assignments: AmbassadorAssignment[]; canEdit: boolean; begin: (operation: () => Promise<unknown>, success: string) => Promise<boolean> }) {
  const requests = useAmbassadorRequests(); const reviewMembership = useReviewAmbassadorMembership(); const reviewPromotion = useReviewAmbassadorPromotion();
  const [decision, setDecision] = useState<{ kind: 'membership' | 'promotion'; item: AmbassadorMembership | AmbassadorPromotion; action: string } | null>(null);
  const [targetId, setTargetId] = useState(''); const [reasonCode, setReasonCode] = useState(''); const [reasonText, setReasonText] = useState('');
  const close = () => { setDecision(null); setTargetId(''); setReasonCode(''); setReasonText(''); };
  const submit = async () => { if (!decision) return; let succeeded: boolean; if (decision.kind === 'membership') { const item = decision.item as AmbassadorMembership; succeeded = await begin(() => reviewMembership.mutateAsync({ id: item.id, decision: decision.action, assignmentId: ['approve', 'overturn_rejection'].includes(decision.action) ? targetId || null : null, reasonCode, reasonText, expectedUpdatedAt: item.updatedAt }), 'Solicitação decidida e auditada.'); } else { const item = decision.item as AmbassadorPromotion; succeeded = await begin(() => reviewPromotion.mutateAsync({ id: item.id, decision: decision.action, principalAssignmentId: decision.action === 'approve' ? targetId || null : null, reasonCode, expectedUpdatedAt: item.updatedAt }), 'Promoção decidida e auditada.'); } if (succeeded) close(); };
  if (requests.isLoading) return <div className="ambassador-loading"><RefreshCw className="spin" size={24} /></div>;
  if (requests.isError) return <div className="inline-alert danger" role="alert"><AlertTriangle size={18} /><span>Não foi possível carregar as solicitações.</span><button className="button secondary compact" onClick={() => void requests.refetch()}>Tentar novamente</button></div>;
  const approving = Boolean(decision && ['approve', 'overturn_rejection'].includes(decision.action));
  return <div className="ambassador-requests"><section><div className="ambassador-section-head"><div><h2>Moderação</h2><p>Recusas que precisam da plataforma.</p></div></div><div className="ambassador-request-list">{requests.data?.memberships.map((item) => <RequestCard key={item.id} title={item.professionalName} subtitle={`${item.affinityGroupLabel} · ${item.regionName}`} meta={`${statusLabel[item.status] ?? item.status} · ${item.followerCountSnapshot == null ? 'sem snapshot' : `${formatNumber(item.followerCountSnapshot)} seguidores`}`}><>{canEdit && item.status === 'pending_moderation' ? <><button className="button danger compact" onClick={() => setDecision({ kind: 'membership', item, action: 'uphold_rejection' })}>Manter recusa</button><button className="button primary compact" onClick={() => setDecision({ kind: 'membership', item, action: 'overturn_rejection' })}>Aprovar</button></> : null}</></RequestCard>)}{!requests.data?.memberships.length ? <div className="ambassador-empty compact"><Check size={24} /><strong>Tudo em dia</strong><span>Nenhuma moderação pendente.</span></div> : null}</div></section><section><div className="ambassador-section-head"><div><h2>Promoções</h2><p>Solicitações para se tornar Associado.</p></div></div><div className="ambassador-request-list">{requests.data?.promotions.map((item) => <RequestCard key={item.id} title={item.professionalName} subtitle={`${item.affinityGroupLabel} · ${item.regionName}`} meta={item.principalName ? `Solicitado por ${item.principalName}` : 'Supervisão da plataforma'}><>{canEdit ? <><button className="button primary compact" onClick={() => setDecision({ kind: 'promotion', item, action: 'approve' })}>Aprovar</button><button className="button danger compact" onClick={() => setDecision({ kind: 'promotion', item, action: 'reject' })}>Rejeitar</button></> : null}</></RequestCard>)}{!requests.data?.promotions.length ? <div className="ambassador-empty compact"><Check size={24} /><strong>Tudo em dia</strong><span>Nenhuma promoção pendente.</span></div> : null}</div></section><AmbassadorDialog open={decision !== null} eyebrow="Decisão administrativa" title={approving ? 'Confirmar aprovação?' : 'Confirmar recusa?'} description={decision ? `${decision.item.professionalName} · ${decision.item.affinityGroupLabel} · ${decision.item.regionName}` : undefined} confirmLabel={approving ? 'Aprovar' : 'Confirmar recusa'} tone={approving ? 'primary' : 'danger'} pending={reviewMembership.isPending || reviewPromotion.isPending} confirmDisabled={reasonCode.trim().length < 3} onCancel={close} onConfirm={submit}>{approving ? <label className="ambassador-field"><span>{decision?.kind === 'promotion' ? 'Principal do novo Associado' : 'Associado de destino'}</span><select value={targetId} onChange={(event) => setTargetId(event.target.value)}><option value="">Vínculo direto com a Plataforma</option>{decision ? assignments.filter((item) => item.status === 'active' && (decision.kind === 'membership' ? item.role === 'associate' : item.role === 'principal') && item.affinityGroupKey === decision.item.affinityGroupKey && item.regionId === decision.item.regionId).map((item) => <option value={item.id} key={item.id}>{item.profileName} · {item.role === 'principal' ? 'Principal' : 'Associado'}</option>) : null}</select></label> : null}<label className="ambassador-field"><span>Motivo</span><input required minLength={3} value={reasonCode} maxLength={64} onChange={(event) => setReasonCode(event.target.value.replace(/\s+/g, '_').toLowerCase())} placeholder="Ex.: cadastro_validado" /></label>{decision?.kind === 'membership' ? <label className="ambassador-field"><span>Observação interna</span><textarea maxLength={1000} value={reasonText} onChange={(event) => setReasonText(event.target.value)} /></label> : null}</AmbassadorDialog></div>;
}

function RequestCard({ title, subtitle, meta, children }: { title: string; subtitle: string; meta: string; children: ReactNode }) { return <article className="ambassador-request-card"><span className="ambassador-avatar"><UserRoundCheck size={18} /></span><div><strong>{title}</strong><span>{subtitle}</span><small>{meta}</small></div><div className="ambassador-actions">{children}</div></article>; }

function AuditTab() {
  const audit = useAmbassadorAudit();
  return <div className="ambassador-list-panel"><div className="ambassador-section-head"><div><h2>Histórico</h2><p>Alterações administrativas da rede.</p></div><span>{formatNumber(audit.data?.total ?? 0)} eventos</span></div>{audit.isLoading ? <div className="ambassador-loading"><RefreshCw className="spin" size={24} /></div> : audit.isError ? <div className="inline-alert danger" role="alert"><AlertTriangle size={18} /><span>Não foi possível carregar o histórico.</span><button className="button secondary compact" onClick={() => void audit.refetch()}>Tentar novamente</button></div> : audit.data?.items.length ? <div className="ambassador-audit-list">{audit.data.items.map((item) => { const beforeStatus = typeof item.beforeState?.status === 'string' ? item.beforeState.status : null; const afterStatus = typeof item.afterState?.status === 'string' ? item.afterState.status : null; return <div key={item.id}><span className={`ambassador-audit-dot ${item.action}`} /><div><strong>{item.actorName}</strong><span>{item.action === 'insert' ? 'criou' : item.action === 'delete' ? 'removeu' : 'alterou'} um registro</span><small>{beforeStatus || afterStatus ? `${statusLabel[beforeStatus ?? ''] ?? beforeStatus ?? '—'} → ${statusLabel[afterStatus ?? ''] ?? afterStatus ?? '—'} · ` : ''}{formatDateTime(new Date(item.occurredAt))}</small></div><code title={`Identificador ${item.entityId}`}>{item.entityId.slice(0, 8)}</code></div>; })}</div> : <div className="ambassador-empty compact"><ShieldCheck size={24} /><strong>Sem eventos</strong><span>As próximas alterações aparecerão aqui.</span></div>}</div>;
}

const checkLabels: Record<string, string> = {
  migration_gate: 'Migração legada concluída', public_clients_gate: 'Clientes sem dependência legada',
  compensation_policy_gate: 'Política de remuneração publicada', external_cost_policy_gate: 'Custos externos publicados',
  sandbox_validation: 'Sandbox validado', dashboard_alerts: 'Dashboards e alertas validados',
  support_training: 'Suporte treinado', finance_training: 'Financeiro treinado', rollback_rehearsal: 'Rollback ensaiado',
  billing_settlement_withdrawal: 'Cobrança, liquidação e saque', refund_chargeback: 'Estorno e chargeback',
};

function OperationsTab({ snapshot, canEdit, begin }: {
  snapshot: NonNullable<ReturnType<typeof useAmbassadorSnapshot>['data']>;
  canEdit: boolean; begin: (operation: () => Promise<unknown>, success: string) => Promise<boolean>;
}) {
  const operations = useAmbassadorOperations();
  const refreshInventory = useRefreshAmbassadorLegacyInventory();
  const resolveCandidate = useResolveAmbassadorLegacyCandidate();
  const saveRollout = useSaveAmbassadorRollout();
  const setCheck = useSetAmbassadorRolloutCheck();
  const transition = useTransitionAmbassadorRollout();
  const rollback = useRollbackAmbassadorRollout();
  const [candidateId, setCandidateId] = useState('');
  const candidate = operations.data?.migration.candidates.find((item) => item.id === candidateId);
  const [resolutionKind, setResolutionKind] = useState('legacy_membership');
  const [candidateAffinity, setCandidateAffinity] = useState('');
  const [candidateRegion, setCandidateRegion] = useState('');
  const [candidateRole, setCandidateRole] = useState('associate');
  const [reasonCode, setReasonCode] = useState('');
  const [rolloutName, setRolloutName] = useState('');
  const [rolloutAffinity, setRolloutAffinity] = useState('');
  const [rolloutRegion, setRolloutRegion] = useState('');
  const [evidenceAction, setEvidenceAction] = useState<{ kind: 'check' | 'rollback'; rolloutId: string; checkKey?: string } | null>(null);
  const [evidence, setEvidence] = useState('');

  const chooseCandidate = (id: string) => {
    setCandidateId(id);
    const item = operations.data?.migration.candidates.find((value) => value.id === id);
    setResolutionKind(item?.source === 'editorial_highlight' ? 'commercial_assignment' : 'legacy_membership');
    setCandidateAffinity(item?.suggestedAffinityGroupKeys.length === 1 ? item.suggestedAffinityGroupKeys[0] : '');
    setCandidateRegion(''); setReasonCode('');
  };
  const submitCandidate = async (event: FormEvent) => {
    event.preventDefault(); if (!candidate) return;
    const scoped = resolutionKind === 'commercial_assignment' || resolutionKind === 'legacy_membership';
    const succeeded = await begin(() => resolveCandidate.mutateAsync({ id: candidate.id, resolutionKind,
      affinityGroupKey: scoped ? candidateAffinity : null, regionId: scoped ? candidateRegion : null,
      role: resolutionKind === 'commercial_assignment' ? candidateRole : null, reasonCode }), 'Candidato legado resolvido com auditoria.');
    if (succeeded) setCandidateId('');
  };
  const submitRollout = async (event: FormEvent) => {
    event.preventDefault();
    const succeeded = await begin(() => saveRollout.mutateAsync({ name: rolloutName, affinityGroupKey: rolloutAffinity,
      regionId: rolloutRegion, environment: 'sandbox' }), 'Plano de piloto criado em sandbox para Conteúdo Premium.');
    if (succeeded) { setRolloutName(''); setRolloutAffinity(''); setRolloutRegion(''); }
  };
  const nextStage = (stage: string) => ({ draft: 'sandbox_validation', sandbox_validation: 'pilot_ready', pilot_ready: 'pilot_active', pilot_active: 'expanded', expanded: 'completed', paused: 'pilot_active' }[stage]);
  const stageLabels: Record<string, string> = { draft: 'Rascunho', sandbox_validation: 'Validação', pilot_ready: 'Pronto para piloto', pilot_active: 'Piloto ativo', expanded: 'Expandido', completed: 'Concluído', paused: 'Pausado', rolled_back: 'Revertido' };
  const submitEvidence = async () => {
    if (!evidenceAction || evidence.trim().length < 3) return;
    const succeeded = evidenceAction.kind === 'check'
      ? await begin(() => setCheck.mutateAsync({ rolloutId: evidenceAction.rolloutId, checkKey: evidenceAction.checkKey ?? '', status: 'passed', evidenceReference: evidence.trim() }), 'Validação registrada.')
      : await begin(() => rollback.mutateAsync({ rolloutId: evidenceAction.rolloutId, evidenceReference: evidence.trim() }), 'Reversão executada e controles desligados.');
    if (succeeded) { setEvidenceAction(null); setEvidence(''); }
  };

  if (operations.isLoading) return <div className="ambassador-loading"><RefreshCw className="spin" size={24} /></div>;
  if (operations.isError || !operations.data) return <div className="inline-alert danger"><AlertTriangle size={18} />Não foi possível carregar a operação.</div>;
  const data = operations.data;
  return <div className="ambassador-operations">
    <section className="ambassador-list-panel">
      <div className="ambassador-section-head"><div><h2>Migração controlada</h2><p>Nenhum destaque legado cria remuneração.</p></div>
        {canEdit ? <button className="button secondary compact" onClick={() => begin(() => refreshInventory.mutateAsync(undefined), 'Inventário legado atualizado.')}><RefreshCw size={15}/>Reindexar</button> : null}</div>
      <div className="ambassador-summary"><span><strong>{data.migration.editorialActive}</strong> destaques legados</span><span><strong>{data.migration.pendingReview}</strong> em revisão</span><span><strong>{data.migration.needsRegularization}</strong> para regularizar</span><span><strong>{data.migration.migrated}</strong> migrados</span></div>
      <div className="ambassador-request-list">{data.migration.candidates.map((item) => <button className="ambassador-request-card" type="button" key={item.id} onClick={() => chooseCandidate(item.id)}><span className="ambassador-avatar"><UserRoundCheck size={18}/></span><div><strong>{item.profileName}</strong><span>{item.source === 'editorial_highlight' ? 'Destaque legado' : 'Profissional atual'}</span><small>{item.suggestedAffinityGroupKeys.length ? item.suggestedAffinityGroupKeys.join(', ') : 'Vertical não identificada'} · {item.status === 'needs_regularization' ? 'precisa de revisão' : 'aguarda revisão'}</small></div><ChevronRight size={18}/></button>)}</div>
      {!data.migration.candidates.length ? <p className="ambassador-muted">Nenhuma pendência de migração.</p> : null}
      {candidate && canEdit ? <form className="ambassador-editor" onSubmit={submitCandidate}>
        <div className="ambassador-panel-head"><div><span>Decisão humana obrigatória</span><h2>{candidate.profileName}</h2></div><CloseButton label="Fechar decisão" onClick={() => setCandidateId('')} /></div>
        <label className="ambassador-field"><span>Resolução</span><select value={resolutionKind} onChange={(event) => setResolutionKind(event.target.value)}>{candidate.source === 'editorial_highlight' ? <><option value="commercial_assignment">Criar atribuição comercial em rascunho</option><option value="editorial_only">Manter somente no histórico legado</option></> : <><option value="legacy_membership">Preservar como vínculo legado aprovado</option><option value="not_applicable">Não se aplica</option></>}</select></label>
        {['commercial_assignment','legacy_membership'].includes(resolutionKind) ? <div className="ambassador-form-grid"><label className="ambassador-field"><span>Vertical confirmada</span><select required value={candidateAffinity} onChange={(event) => setCandidateAffinity(event.target.value)}><option value="">Selecione</option>{snapshot.affinityGroups.filter((item) => item.active).map((item) => <option value={item.key} key={item.key}>{item.label}</option>)}</select></label><label className="ambassador-field"><span>Região confirmada</span><select required value={candidateRegion} onChange={(event) => setCandidateRegion(event.target.value)}><option value="">Selecione</option>{snapshot.regions.filter((item) => item.active).map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>{resolutionKind === 'commercial_assignment' ? <label className="ambassador-field"><span>Papel</span><select value={candidateRole} onChange={(event) => setCandidateRole(event.target.value)}><option value="principal">Principal</option><option value="associate">Associado</option></select></label> : null}</div> : null}
        <label className="ambassador-field"><span>Código do motivo</span><input required maxLength={80} value={reasonCode} onChange={(event) => setReasonCode(event.target.value.replace(/\s+/g,'_').toLowerCase())}/></label><div className="ambassador-editor-actions"><button className="button primary" type="submit">Registrar decisão</button></div>
      </form> : null}
    </section>

    <section className="ambassador-list-panel"><div className="ambassador-section-head"><div><h2>Piloto e rollout</h2><p>O primeiro piloto é restrito a uma vertical, uma região, sandbox e Conteúdo Premium.</p></div></div>
      {!data.runtime.storekit_financial_runtime_connected ? <div className="inline-alert ambassador-safe-mode"><ShieldCheck size={18}/><span>StoreKit ainda não conectado: é possível preparar até “pronto para piloto”; ativação monetária é recusada pelo banco.</span></div> : null}
      {canEdit ? <form className="ambassador-toolbar" onSubmit={submitRollout}><input required minLength={3} placeholder="Nome do piloto" value={rolloutName} onChange={(event) => setRolloutName(event.target.value)}/><select required value={rolloutAffinity} onChange={(event) => setRolloutAffinity(event.target.value)}><option value="">Vertical</option>{snapshot.affinityGroups.filter((item) => item.active).map((item) => <option value={item.key} key={item.key}>{item.label}</option>)}</select><select required value={rolloutRegion} onChange={(event) => setRolloutRegion(event.target.value)}><option value="">Região</option>{snapshot.regions.filter((item) => item.active).map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select><button className="button primary compact" type="submit"><Plus size={15}/>Criar piloto</button></form> : null}
      <div className="ambassador-request-list">{data.rollouts.map((rollout) => <article className="ambassador-editor" key={rollout.id}><div className="ambassador-panel-head"><div><span>Ambiente de teste · Conteúdo Premium</span><h2>{rollout.name}</h2><p>{rollout.affinityGroupLabel} · {rollout.regionName} · {stageLabels[rollout.stage] ?? 'Etapa técnica'}</p></div></div><div className="ambassador-checks">{rollout.checks.map((check) => <div key={check.checkKey}><span>{check.status === 'passed' ? <Check size={15}/> : <CircleOff size={15}/>} {checkLabels[check.checkKey] ?? 'Validação técnica'}</span>{canEdit && check.status !== 'passed' ? <button className="button secondary compact" type="button" onClick={() => setEvidenceAction({ kind: 'check', rolloutId: rollout.id, checkKey: check.checkKey })}>Validar</button> : <small>{check.evidenceReference ?? (check.status === 'passed' ? 'Validado' : 'Pendente')}</small>}</div>)}</div>{canEdit ? <div className="ambassador-editor-actions">{nextStage(rollout.stage) ? <button className="button primary compact" type="button" onClick={() => begin(() => transition.mutateAsync({ rolloutId: rollout.id, targetStage: nextStage(rollout.stage)!, expectedUpdatedAt: rollout.updatedAt }), 'Etapa do piloto atualizada.')}>Avançar para {stageLabels[nextStage(rollout.stage)!] ?? 'próxima etapa'}</button> : null}{!['completed','rolled_back'].includes(rollout.stage) ? <button className="button danger compact" type="button" onClick={() => setEvidenceAction({ kind: 'rollback', rolloutId: rollout.id })}>Reverter</button> : null}</div> : null}</article>)}</div>
    </section>

    <section className="ambassador-list-panel"><div className="ambassador-section-head"><div><h2>Alertas operacionais</h2><p>Verificação das fontes oficiais.</p></div></div><div className="ambassador-summary">{data.alerts.map((alert) => <span className={alert.count ? 'danger' : ''} key={alert.key}><strong>{alert.count}</strong> {checkLabels[alert.key] ?? 'ocorrências técnicas'}</span>)}</div></section>
    <AmbassadorDialog open={evidenceAction !== null} eyebrow="Evidência obrigatória" title={evidenceAction?.kind === 'rollback' ? 'Reverter o piloto?' : 'Confirmar validação?'} description={evidenceAction?.kind === 'rollback' ? 'A reversão desliga os controles relacionados e fica registrada no histórico.' : 'Informe o ticket, relatório ou documento que comprova a validação.'} confirmLabel={evidenceAction?.kind === 'rollback' ? 'Reverter' : 'Validar'} tone={evidenceAction?.kind === 'rollback' ? 'danger' : 'primary'} pending={setCheck.isPending || rollback.isPending} confirmDisabled={evidence.trim().length < 3} onCancel={() => { setEvidenceAction(null); setEvidence(''); }} onConfirm={submitEvidence}><label className="ambassador-field"><span>Referência</span><input autoFocus required minLength={3} maxLength={240} value={evidence} onChange={(event) => setEvidence(event.target.value)} placeholder="Ticket, relatório ou documento" /></label></AmbassadorDialog>
  </div>;
}
