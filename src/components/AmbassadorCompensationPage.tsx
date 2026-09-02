import {
  AlertTriangle,
  Calculator,
  Check,
  Clock3,
  CopyPlus,
  HandCoins,
  Play,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import {
  useActivateChannelCostPolicy,
  useActivateCompensationMatrix,
  useAmbassadorFinanceReadiness,
  useCompensationSnapshot,
  useCreateCompensationMatrix,
  usePublishChannelCostPolicy,
  usePublishCompensationMatrix,
  useRetireChannelCostPolicy,
  useRetireCompensationMatrix,
  useSaveChannelCostPolicy,
  useSaveCompensationScenario,
  useSimulateCompensation,
} from '../hooks/useAmbassadorCompensation';
import { useCurrentStaffRole } from '../hooks/useStaffManagement';
import {
  compensationErrorMessage,
  type ChannelCostPolicy,
  type CompensationMatrix,
  type CompensationRole,
  type CompensationScenario,
  type CompensationScenarioPolicy,
  type CompensationShares,
  type CompensationSnapshot,
} from '../lib/ambassadorCompensation';
import { formatCurrencyExact, formatDateTime, formatNumber } from '../lib/format';
import { AmbassadorDialog, AmbassadorTabPanel, AmbassadorTabs, CloseButton } from './AmbassadorUi';
import { useUnsavedWarning } from '../hooks/useUnsavedWarning';

type Tab = 'matrices' | 'costs' | 'simulator' | 'readiness';

const scenarioLabels: Record<CompensationScenario, string> = {
  direct_to_principal: 'Direto ao Principal',
  via_associate: 'Via Associado',
  no_principal: 'Sem Principal',
  via_associate_without_principal: 'Associado sem Principal',
};
const roleLabels: Record<CompensationRole, string> = {
  professional: 'Profissional', associate: 'Associado', principal: 'Principal', platform: 'Plataforma',
};
const statusLabels = { draft: 'Rascunho', scheduled: 'Agendada', active: 'Ativa', retired: 'Encerrada' } as const;
const roles = ['professional', 'associate', 'principal', 'platform'] as const;

function iso(value: string): string | null {
  return value ? new Date(value).toISOString() : null;
}
function localDate(value: string | null): string {
  if (!value) return '';
  const date = new Date(value); const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}
function matrixComplete(matrix: CompensationMatrix): boolean {
  return matrix.scenarios.length === 4 && matrix.scenarios.every((item) => roles.every((role) => item.shares[role] !== undefined)
    && Math.round(roles.reduce((total, role) => total + (item.shares[role] ?? 0), 0) * 10_000) / 10_000 === 100);
}
function scopeLabel(matrix: CompensationMatrix): string {
  return [matrix.affinityGroupLabel ?? 'Regra geral', matrix.regionName].filter(Boolean).join(' · ');
}

export function AmbassadorCompensationPage() {
  const [tab, setTab] = useState<Tab>('matrices');
  const [filters, setFilters] = useState({ offeringType: '', status: '', offset: 0, costOffset: 0 });
  const snapshot = useCompensationSnapshot(filters);
  const readiness = useAmbassadorFinanceReadiness();
  const currentRole = useCurrentStaffRole();
  const canEdit = currentRole.data === 'admin' || currentRole.data === 'super_admin';
  const [selectedMatrixId, setSelectedMatrixId] = useState<string | null>(null);
  const [newMatrix, setNewMatrix] = useState(false);
  const [costEditor, setCostEditor] = useState<ChannelCostPolicy | 'new' | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const selected = snapshot.data?.matrices.find((item) => item.matrixId === selectedMatrixId) ?? null;
  const activeProducts = snapshot.data?.offeringTypes.filter((item) => item.enabled) ?? [];
  const configuredProducts = new Set(snapshot.data?.matrices.filter((item) => ['active', 'scheduled'].includes(item.status)).map((item) => item.offeringTypeSlug));

  const run = async (operation: () => Promise<unknown>, success: string) => {
    setError(null); setMessage(null);
    try { await operation(); setMessage(success); return true; }
    catch (caught) { setError(compensationErrorMessage(caught)); return false; }
  };

  const tabs = [
    { id: 'matrices' as const, label: 'Percentuais', icon: <HandCoins size={16} /> },
    { id: 'costs' as const, label: 'Taxas', icon: <SlidersHorizontal size={16} /> },
    { id: 'simulator' as const, label: 'Simulador', icon: <Calculator size={16} /> },
    { id: 'readiness' as const, label: 'Validação técnica', icon: <ShieldCheck size={16} /> },
  ];

  return <>
    <header className="page-header ambassador-header">
      <div><p className="section-label">Comercial</p><h1>Remuneração dos Embaixadores</h1><span>Percentuais por produto e cenário.</span></div>
      <button className="button secondary" type="button" onClick={() => void snapshot.refetch()} disabled={snapshot.isFetching}><RefreshCw className={snapshot.isFetching ? 'spin' : ''} size={16} />Atualizar</button>
    </header>
    <section className="content compensation-page">
      <div className="inline-alert ambassador-safe-mode"><ShieldCheck size={18} /><span>Modo de preparação: nenhum pagamento ou repasse é executado.</span><details><summary>Detalhes técnicos</summary>Este módulo não executa Apple API, StoreKit, checkout, ledger ou repasse.</details></div>
      {message ? <div className="inline-alert" role="status"><Check size={18} />{message}</div> : null}
      {error ? <div className="inline-alert danger" role="alert"><AlertTriangle size={18} />{error}</div> : null}
      <div className="ambassador-summary">
        <span><strong>{formatNumber(activeProducts.length)}</strong> tipos de produto</span>
        <span><strong>{formatNumber(configuredProducts.size)}</strong> configurados</span>
        <span><strong>{formatNumber(snapshot.data?.matrices.filter(matrixComplete).length ?? 0)}</strong> completos</span>
        <span><strong>{formatNumber(snapshot.data?.costPolicies.length ?? 0)}</strong> taxas</span>
      </div>
      <AmbassadorTabs label="Remuneração" value={tab} items={tabs} onChange={setTab} />
      {snapshot.isLoading ? <div className="ambassador-loading"><RefreshCw className="spin" size={24} /></div> : null}
      {snapshot.isError ? <div className="inline-alert danger" role="alert"><AlertTriangle size={18} /><span>Não foi possível carregar a remuneração.</span><button className="button secondary compact" onClick={() => void snapshot.refetch()}>Tentar novamente</button></div> : null}
      {snapshot.data ? <AmbassadorTabPanel id="matrices" activeTab={tab}><MatricesTab data={snapshot.data} filters={filters} setFilters={setFilters} selected={selected} setSelected={setSelectedMatrixId} canEdit={canEdit} newMatrix={newMatrix} setNewMatrix={setNewMatrix} run={run} /></AmbassadorTabPanel> : null}
      {snapshot.data ? <AmbassadorTabPanel id="costs" activeTab={tab}><CostsTab data={snapshot.data} filters={filters} setFilters={setFilters} editor={costEditor} setEditor={setCostEditor} canEdit={canEdit} run={run} /></AmbassadorTabPanel> : null}
      {snapshot.data ? <AmbassadorTabPanel id="simulator" activeTab={tab}><SimulatorTab data={snapshot.data} /></AmbassadorTabPanel> : null}
      <AmbassadorTabPanel id="readiness" activeTab={tab}><ReadinessTab readiness={readiness} /></AmbassadorTabPanel>
    </section>
  </>;
}

const readinessLabels: Record<string, string> = {
  configurable_cost_rounding: 'Arredondamento configurável aplicado',
  net_after_external_costs: 'Distribuição após custos externos',
  published_snapshot_immutable: 'Publicações não podem ser alteradas',
  deterministic_quote_contract: 'Motor determinístico sem efeitos colaterais',
  append_only_quote_snapshots: 'Histórico de cálculos preservado',
  shadow_comparison_contract: 'Contrato de comparação em sombra',
  payment_runtime_connected: 'Conexão com pagamentos',
  wallet_ledger_connected: 'Carteira e ledger conectados',
  apple_event_envelope_contract: 'Envelope financeiro Apple',
  apple_event_state_history: 'Histórico idempotente de estados Apple',
  reconciliation_contract: 'Contrato de reconciliação',
  apple_api_connected: 'App Store Server API conectada',
  storekit_financial_runtime_connected: 'StoreKit conectado ao financeiro',
};

function ReadinessTab({ readiness }: { readiness: ReturnType<typeof useAmbassadorFinanceReadiness> }) {
  if (readiness.isLoading) return <div className="ambassador-loading"><RefreshCw className="spin" size={24} /></div>;
  if (!readiness.data || readiness.isError) return <div className="inline-alert danger"><AlertTriangle size={18} />Não foi possível carregar a prontidão financeira.</div>;
  const runtime = readiness.data.runtime;
  return <div className="compensation-layout"><div className="ambassador-list-panel"><div className="ambassador-section-head"><div><h2>Infraestrutura preparada</h2><p>Sem movimentar dinheiro.</p></div></div>{([
    ['Percentuais', readiness.data.wave3], ['Cálculos', readiness.data.wave4], ['Integrações futuras', readiness.data.wave5],
  ] as const).map(([title, items]) => <section className="simulation-scenario" key={title}><h3>{title}</h3><div>{Object.entries(items).map(([key, enabled]) => <span key={key}><small>{readinessLabels[key] ?? 'Validação técnica'}</small><strong>{enabled ? 'Preparado' : 'Aguardando integração'}</strong></span>)}</div></section>)}</div><div className="ambassador-list-panel"><div className="ambassador-section-head"><div><h2>Controles de segurança</h2><p>Devem continuar desligados até a homologação.</p></div></div><div className="channel-cost-list">{[
    ['Alocação financeira', runtime.financialAllocationEnabled],
    ['Modo sombra com pagamentos reais', runtime.allocationShadowEnabled],
    ['Ingestão financeira Apple', runtime.appStoreFinancialIngestionEnabled],
    ['Reconciliação Apple', runtime.appStoreReconciliationEnabled],
  ].map(([label, enabled]) => <div className="legacy-ios-card" key={String(label)}><strong>{label}</strong><span className={`ambassador-status ${enabled ? 'active' : 'retired'}`}>{enabled ? 'Ligada' : 'Desligada'}</span></div>)}</div><div className="inline-alert ambassador-safe-mode"><ShieldCheck size={18} />Nenhuma destas travas pode ser ativada por esta tela.</div></div></div>;
}

function MatricesTab({ data, filters, setFilters, selected, setSelected, canEdit, newMatrix, setNewMatrix, run }: {
  data: CompensationSnapshot; filters: { offeringType: string; status: string; offset: number; costOffset: number };
  setFilters: (value: { offeringType: string; status: string; offset: number; costOffset: number }) => void;
  selected: CompensationMatrix | null; setSelected: (id: string | null) => void; canEdit: boolean;
  newMatrix: boolean; setNewMatrix: (value: boolean) => void;
  run: (operation: () => Promise<unknown>, success: string) => Promise<boolean>;
}) {
  return <div className="compensation-layout">
    <div className="ambassador-list-panel">
      <div className="ambassador-toolbar">
        <select value={filters.offeringType} onChange={(event) => setFilters({ ...filters, offeringType: event.target.value, offset: 0 })}><option value="">Todos os produtos</option>{data.offeringTypes.map((item) => <option value={item.slug} key={item.slug}>{item.name}{item.enabled ? '' : ' (inativo)'}</option>)}</select>
        <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value, offset: 0 })}><option value="">Todos os estados</option>{Object.entries(statusLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select>
        {canEdit ? <button className="button primary compact" type="button" onClick={() => { setNewMatrix(true); setSelected(null); }}><Plus size={15} />Novos percentuais</button> : null}
      </div>
      <div className="compensation-matrix-list">
        {data.matrices.map((matrix) => <button type="button" key={matrix.matrixId} className={selected?.matrixId === matrix.matrixId ? 'selected' : ''} onClick={() => { setSelected(matrix.matrixId); setNewMatrix(false); }}>
          <span className={`ambassador-status ${matrix.status}`}>{statusLabels[matrix.status]}</span>
          <div><strong>{matrix.offeringTypeName} · v{matrix.version}</strong><span>{scopeLabel(matrix)}</span><small>{matrixComplete(matrix) ? '4 cenários completos' : 'Configuração incompleta'} · atualizado em {formatDateTime(new Date(matrix.updatedAt))}</small></div>
          <span className={`compensation-total ${matrixComplete(matrix) ? 'valid' : ''}`}>{matrixComplete(matrix) ? '100%' : 'Pendente'}</span>
        </button>)}
        {!data.matrices.length ? <div className="ambassador-empty"><HandCoins size={28} /><strong>Nenhum percentual encontrado</strong><span>Crie a primeira configuração por produto e cenário.</span></div> : null}
      </div>
      {data.total > data.limit ? <div className="ambassador-pagination"><button className="button secondary compact" disabled={!filters.offset} onClick={() => setFilters({ ...filters, offset: Math.max(0, filters.offset - data.limit) })}>Anterior</button><span>{filters.offset + 1}–{Math.min(filters.offset + data.limit, data.total)} de {data.total}</span><button className="button secondary compact" disabled={filters.offset + data.limit >= data.total} onClick={() => setFilters({ ...filters, offset: filters.offset + data.limit })}>Próxima</button></div> : null}
    </div>
    {newMatrix ? <NewMatrixForm data={data} close={() => setNewMatrix(false)} run={run} /> : null}
    {selected ? <MatrixDetail key={`${selected.matrixId}-${selected.updatedAt}`} matrix={selected} canEdit={canEdit} close={() => setSelected(null)} run={run} /> : null}
  </div>;
}

function NewMatrixForm({ data, close, run }: { data: CompensationSnapshot; close: () => void; run: (operation: () => Promise<unknown>, success: string) => Promise<boolean> }) {
  const create = useCreateCompensationMatrix();
  const [draft, setDraft] = useState({ offeringTypeSlug: '', affinityGroupKey: '', regionId: '', currency: 'BRL', effectiveFrom: '', effectiveTo: '' });
  const [discardOpen, setDiscardOpen] = useState(false);
  useUnsavedWarning(Boolean(draft.offeringTypeSlug || draft.affinityGroupKey || draft.regionId || draft.effectiveFrom || draft.effectiveTo));
  const requestClose = () => setDiscardOpen(true);
  const submit = async (event: FormEvent) => { event.preventDefault(); if (await run(() => create.mutateAsync({ offeringTypeSlug: draft.offeringTypeSlug, affinityGroupKey: draft.affinityGroupKey || null, regionId: draft.regionId || null, currency: draft.currency, effectiveFrom: iso(draft.effectiveFrom), effectiveTo: iso(draft.effectiveTo) }), 'Matriz criada com quatro cenários vazios.')) close(); };
  return <><form className="ambassador-editor compensation-editor" onSubmit={submit}>
    <div className="ambassador-panel-head"><div><span>Nova configuração</span><h2>Criar percentuais</h2></div><CloseButton label="Fechar editor" onClick={requestClose} /></div>
    <p className="ambassador-muted">Nenhum percentual será preenchido automaticamente.</p>
    <label className="ambassador-field"><span>Tipo de produto</span><select required value={draft.offeringTypeSlug} onChange={(event) => setDraft({ ...draft, offeringTypeSlug: event.target.value })}><option value="">Selecione</option>{data.offeringTypes.filter((item) => item.enabled).map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}</select></label>
    <label className="ambassador-field"><span>Vertical opcional</span><select value={draft.affinityGroupKey} onChange={(event) => setDraft({ ...draft, affinityGroupKey: event.target.value, regionId: '' })}><option value="">Regra geral do produto</option>{data.affinityGroups.filter((item) => item.active).map((item) => <option value={item.key} key={item.key}>{item.label}</option>)}</select></label>
    <label className="ambassador-field"><span>Região opcional</span><select disabled={!draft.affinityGroupKey} value={draft.regionId} onChange={(event) => setDraft({ ...draft, regionId: event.target.value })}><option value="">Todas as regiões</option>{data.regions.filter((item) => item.active).map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
    <div className="ambassador-form-grid"><label className="ambassador-field"><span>Moeda</span><input value={draft.currency} maxLength={3} onChange={(event) => setDraft({ ...draft, currency: event.target.value.toUpperCase() })} /></label><label className="ambassador-field"><span>Início sugerido</span><input type="datetime-local" value={draft.effectiveFrom} onChange={(event) => setDraft({ ...draft, effectiveFrom: event.target.value })} /></label></div>
    <label className="ambassador-field"><span>Fim sugerido, opcional</span><input type="datetime-local" value={draft.effectiveTo} onChange={(event) => setDraft({ ...draft, effectiveTo: event.target.value })} /></label>
    <div className="ambassador-editor-actions"><button className="button secondary" type="button" onClick={requestClose}>Cancelar</button><button className="button primary" disabled={!draft.offeringTypeSlug || create.isPending}><CopyPlus size={16} />Criar rascunho</button></div>
  </form><AmbassadorDialog open={discardOpen} eyebrow="Alterações não salvas" title="Descartar alterações?" description="O conteúdo preenchido será perdido." confirmLabel="Descartar" tone="danger" onCancel={() => setDiscardOpen(false)} onConfirm={close} /></>;
}

function MatrixDetail({ matrix, canEdit, close, run }: { matrix: CompensationMatrix; canEdit: boolean; close: () => void; run: (operation: () => Promise<unknown>, success: string) => Promise<boolean> }) {
  const publish = usePublishCompensationMatrix(); const activate = useActivateCompensationMatrix(); const retire = useRetireCompensationMatrix();
  const [publication, setPublication] = useState({ effectiveFrom: localDate(matrix.effectiveFrom) || localDate(new Date().toISOString()), effectiveTo: localDate(matrix.effectiveTo), reason: '' });
  const [retirementReason, setRetirementReason] = useState('');
  const [action, setAction] = useState<'publish' | 'activate' | 'retire' | null>(null);
  const [discardOpen, setDiscardOpen] = useState(false);
  useUnsavedWarning(Boolean(publication.reason || retirementReason));
  const publishMatrix = (event: FormEvent) => { event.preventDefault(); setAction('publish'); };
  const performAction = async () => {
    let succeeded = false;
    if (action === 'publish') succeeded = await run(() => publish.mutateAsync({ matrixId: matrix.matrixId, effectiveFrom: iso(publication.effectiveFrom) ?? '', effectiveTo: iso(publication.effectiveTo), reason: publication.reason, expectedUpdatedAt: matrix.updatedAt }), 'Percentuais publicados.');
    if (action === 'activate') succeeded = await run(() => activate.mutateAsync(matrix.matrixId), 'Percentuais ativados.');
    if (action === 'retire') succeeded = await run(() => retire.mutateAsync({ matrixId: matrix.matrixId, reason: retirementReason }), 'Percentuais encerrados sem alterar o histórico.');
    if (succeeded) setAction(null);
  };
  return <div className="ambassador-editor compensation-editor matrix-detail">
    <div className="ambassador-panel-head"><div><span>{scopeLabel(matrix)}</span><h2>{matrix.offeringTypeName} · v{matrix.version}</h2></div><CloseButton label="Fechar detalhes" onClick={() => matrix.status === 'draft' ? setDiscardOpen(true) : close()} /></div>
    <div className="compensation-policy-meta"><span className={`ambassador-status ${matrix.status}`}>{statusLabels[matrix.status]}</span><span>Distribuição do líquido após taxas</span>{matrix.snapshotHash ? <details className="technical-details"><summary>Detalhes técnicos</summary><code title={matrix.snapshotHash}>Hash {matrix.snapshotHash.slice(0, 10)}…</code></details> : null}</div>
    {matrix.scenarios.map((item, index) => <ScenarioEditor defaultOpen={index === 0} key={`${item.policyId}-${item.updatedAt}`} matrix={matrix} policy={item} previous={matrix.previousScenarios.find((candidate) => candidate.scenario === item.scenario) ?? null} previousVersion={matrix.previousVersion} canEdit={canEdit && matrix.status === 'draft'} run={run} />)}
    {matrix.status === 'draft' && canEdit ? <form className="compensation-publication" onSubmit={publishMatrix}><h3>Publicar percentuais</h3><p>Os quatro cenários precisam somar 100%.</p><div className="ambassador-form-grid"><label className="ambassador-field"><span>Início</span><input required type="datetime-local" value={publication.effectiveFrom} onChange={(event) => setPublication({ ...publication, effectiveFrom: event.target.value })} /></label><label className="ambassador-field"><span>Fim opcional</span><input type="datetime-local" value={publication.effectiveTo} onChange={(event) => setPublication({ ...publication, effectiveTo: event.target.value })} /></label></div><label className="ambassador-field"><span>Justificativa</span><textarea required minLength={8} maxLength={1000} value={publication.reason} onChange={(event) => setPublication({ ...publication, reason: event.target.value })} /></label><button className="button primary" disabled={!matrixComplete(matrix) || publish.isPending}><ShieldCheck size={16} />Publicar</button></form> : null}
    {matrix.status === 'scheduled' && canEdit ? <button className="button primary" type="button" onClick={() => setAction('activate')}><Play size={16} />Ativar se vigente</button> : null}
    {['active', 'scheduled'].includes(matrix.status) && canEdit ? <div className="compensation-retire"><label className="ambassador-field"><span>Justificativa para encerrar</span><input minLength={8} value={retirementReason} onChange={(event) => setRetirementReason(event.target.value)} /></label><button className="button danger" disabled={retirementReason.trim().length < 8 || retire.isPending} onClick={() => setAction('retire')}><Clock3 size={16} />Encerrar</button></div> : null}
    <AmbassadorDialog open={action !== null} eyebrow="Revisar ação" title={action === 'publish' ? 'Publicar estes percentuais?' : action === 'activate' ? 'Ativar estes percentuais?' : 'Encerrar estes percentuais?'} description={action === 'publish' ? `Produto: ${matrix.offeringTypeName}. Início: ${publication.effectiveFrom}.` : action === 'activate' ? 'A configuração passará a ser a vigente quando a data permitir.' : 'O histórico será preservado e esta configuração não poderá ser editada.'} confirmLabel={action === 'retire' ? 'Encerrar' : action === 'activate' ? 'Ativar' : 'Publicar'} tone={action === 'retire' ? 'danger' : 'primary'} pending={publish.isPending || activate.isPending || retire.isPending} onCancel={() => setAction(null)} onConfirm={performAction} />
    <AmbassadorDialog open={discardOpen} eyebrow="Alterações não salvas" title="Fechar esta configuração?" description="Alterações ainda não salvas nos cenários serão perdidas." confirmLabel="Fechar" tone="danger" onCancel={() => setDiscardOpen(false)} onConfirm={close} />
  </div>;
}

function ScenarioEditor({ matrix, policy, previous, previousVersion, canEdit, defaultOpen, run }: { matrix: CompensationMatrix; policy: CompensationScenarioPolicy; previous: CompensationScenarioPolicy | null; previousVersion: number | null; canEdit: boolean; defaultOpen: boolean; run: (operation: () => Promise<unknown>, success: string) => Promise<boolean> }) {
  const save = useSaveCompensationScenario();
  const [shares, setShares] = useState<Record<CompensationRole, string>>({ professional: String(policy.shares.professional ?? ''), associate: String(policy.shares.associate ?? ''), principal: String(policy.shares.principal ?? ''), platform: String(policy.shares.platform ?? '') });
  const [reason, setReason] = useState('');
  const [expanded, setExpanded] = useState(defaultOpen);
  const total = Math.round(roles.reduce((sum, role) => sum + (Number(shares[role]) || 0), 0) * 10_000) / 10_000;
  const dirty = reason.length > 0 || roles.some((role) => String(policy.shares[role] ?? '') !== shares[role]);
  useUnsavedWarning(dirty);
  const roleAllowed = (role: CompensationRole) => !((policy.scenario === 'direct_to_principal' && role === 'associate') || (policy.scenario === 'no_principal' && (role === 'associate' || role === 'principal')) || (policy.scenario === 'via_associate_without_principal' && role === 'principal'));
  const submit = async (event: FormEvent) => { event.preventDefault(); const parsed = Object.fromEntries(roles.map((role) => [role, Number(shares[role])])) as CompensationShares; await run(() => save.mutateAsync({ matrixId: matrix.matrixId, scenario: policy.scenario, shares: parsed, changeReason: reason, expectedUpdatedAt: policy.updatedAt }), `${scenarioLabels[policy.scenario]} atualizado.`); };
  return <details className="compensation-scenario" open={expanded} onToggle={(event) => setExpanded(event.currentTarget.open)}><summary className="compensation-scenario-head"><div><h3>{scenarioLabels[policy.scenario]}</h3>{previous ? <span>Comparação com v{previousVersion}</span> : <span>Sem versão anterior</span>}</div><strong className={total === 100 ? 'valid' : 'invalid'}>{total.toFixed(2)}%</strong></summary><form onSubmit={submit}><div className="compensation-share-grid">{roles.map((role) => { const delta = previous?.shares[role] === undefined || shares[role] === '' ? null : Number(shares[role]) - (previous.shares[role] ?? 0); return <label key={role}><span>{roleLabels[role]}</span><div><input type="number" min="0" max="100" step="0.0001" required disabled={!canEdit || !roleAllowed(role)} value={roleAllowed(role) ? shares[role] : '0'} onChange={(event) => setShares({ ...shares, [role]: event.target.value })} /><small>%</small></div>{delta !== null ? <em className={delta > 0 ? 'up' : delta < 0 ? 'down' : ''}>{delta > 0 ? '+' : ''}{delta.toFixed(4)} p.p.</em> : null}</label>; })}</div>{canEdit ? <div className="compensation-scenario-actions"><input required minLength={8} maxLength={1000} placeholder="Motivo da alteração" value={reason} onChange={(event) => setReason(event.target.value)} /><button className="button secondary compact" disabled={total !== 100 || reason.trim().length < 8 || save.isPending}><Save size={14} />Salvar</button></div> : null}</form></details>;
}

function CostsTab({ data, filters, setFilters, editor, setEditor, canEdit, run }: { data: CompensationSnapshot; filters: { offeringType: string; status: string; offset: number; costOffset: number }; setFilters: (value: { offeringType: string; status: string; offset: number; costOffset: number }) => void; editor: ChannelCostPolicy | 'new' | null; setEditor: (value: ChannelCostPolicy | 'new' | null) => void; canEdit: boolean; run: (operation: () => Promise<unknown>, success: string) => Promise<boolean> }) {
  return <div className="compensation-layout"><div className="ambassador-list-panel"><div className="ambassador-section-head"><div><h2>Taxas externas</h2><p>Loja, processamento e valor fixo.</p></div>{canEdit ? <button className="button primary compact" onClick={() => setEditor('new')}><Plus size={15} />Nova taxa</button> : null}</div>{data.legacyIosCostSettings ? <div className="legacy-ios-card"><div><strong>Configuração iOS existente · v{data.legacyIosCostSettings.version}</strong><span>Apple {data.legacyIosCostSettings.commissionPercentage}% + processamento {data.legacyIosCostSettings.processingPercentage}% + {formatCurrencyExact(data.legacyIosCostSettings.fixedAmount)}</span></div><span className={`ambassador-status ${data.legacyIosCostSettings.enabled ? 'active' : 'retired'}`}>{data.legacyIosCostSettings.enabled ? 'Disponível' : 'Desativada'}</span></div> : null}<div className="channel-cost-list">{data.costPolicies.map((policy) => <button type="button" key={policy.id} onClick={() => setEditor(policy)}><span className={`ambassador-status ${policy.status}`}>{statusLabels[policy.status]}</span><div><strong>{policy.provider} · {policy.paymentMethod} · v{policy.version}</strong><span>{policy.offeringTypeName ?? 'Todos os produtos'} · {policy.commissionPercentage}% loja + {policy.processingPercentage}% processamento + {formatCurrencyExact(policy.fixedAmount)}</span></div></button>)}{!data.costPolicies.length ? <div className="ambassador-empty compact"><SlidersHorizontal size={24} /><strong>Nenhuma taxa</strong><span>Cadastre quando os canais estiverem definidos.</span></div> : null}</div>{data.costTotal > data.costLimit ? <div className="ambassador-pagination"><button className="button secondary compact" disabled={!filters.costOffset} onClick={() => setFilters({ ...filters, costOffset: Math.max(0, filters.costOffset - data.costLimit) })}>Anterior</button><span>{filters.costOffset + 1}–{Math.min(filters.costOffset + data.costLimit, data.costTotal)} de {data.costTotal}</span><button className="button secondary compact" disabled={filters.costOffset + data.costLimit >= data.costTotal} onClick={() => setFilters({ ...filters, costOffset: filters.costOffset + data.costLimit })}>Próxima</button></div> : null}</div>{editor ? <CostPolicyEditor data={data} policy={editor === 'new' ? null : editor} close={() => setEditor(null)} run={run} /> : null}</div>;
}

function CostPolicyEditor({ data, policy, close, run }: { data: CompensationSnapshot; policy: ChannelCostPolicy | null; close: () => void; run: (operation: () => Promise<unknown>, success: string) => Promise<boolean> }) {
  const save = useSaveChannelCostPolicy();
  const publish = usePublishChannelCostPolicy();
  const activate = useActivateChannelCostPolicy();
  const retire = useRetireChannelCostPolicy();
  const [draft, setDraft] = useState({ provider: policy?.provider ?? '', paymentMethod: policy?.paymentMethod ?? '', offeringTypeSlug: policy?.offeringTypeSlug ?? '', commission: String(policy?.commissionPercentage ?? ''), processing: String(policy?.processingPercentage ?? ''), fixed: String(policy?.fixedAmount ?? ''), roundingMode: policy?.roundingMode ?? 'half_up', roundingIncrement: String(policy?.roundingIncrement ?? '0.01'), changeReason: '' });
  const [lifecycle, setLifecycle] = useState({ effectiveFrom: localDate(policy?.effectiveFrom ?? null) || localDate(new Date().toISOString()), effectiveTo: localDate(policy?.effectiveTo ?? null), reason: '' });
  const [discardOpen, setDiscardOpen] = useState(false);
  const [action, setAction] = useState<'publish' | 'activate' | 'retire' | null>(null);
  const dirty = Boolean(draft.changeReason || lifecycle.reason || (!policy && (draft.provider || draft.paymentMethod || draft.commission || draft.processing || draft.fixed)) || (policy && (draft.provider !== policy.provider || draft.paymentMethod !== policy.paymentMethod || draft.offeringTypeSlug !== (policy.offeringTypeSlug ?? '') || draft.commission !== String(policy.commissionPercentage) || draft.processing !== String(policy.processingPercentage) || draft.fixed !== String(policy.fixedAmount))));
  useUnsavedWarning(dirty);
  const importIos = () => { const ios = data.legacyIosCostSettings; if (!ios) return; setDraft({ ...draft, provider: 'apple', paymentMethod: ios.paymentMethod, commission: String(ios.commissionPercentage), processing: String(ios.processingPercentage), fixed: String(ios.fixedAmount), roundingIncrement: '0.01' }); };
  const submit = async (event: FormEvent) => { event.preventDefault(); const succeeded = await run(() => save.mutateAsync({ id: policy?.id, expectedUpdatedAt: policy?.updatedAt, provider: draft.provider, paymentMethod: draft.paymentMethod, offeringTypeSlug: draft.offeringTypeSlug || null, commissionPercentage: Number(draft.commission), processingPercentage: Number(draft.processing), fixedAmount: Number(draft.fixed), roundingMode: draft.roundingMode, roundingIncrement: Number(draft.roundingIncrement), changeReason: draft.changeReason }), policy ? 'Rascunho de custo atualizado.' : 'Política de custo criada como rascunho.'); if (!policy && succeeded) close(); };
  const publishPolicy = (event: FormEvent) => { event.preventDefault(); if (policy) setAction('publish'); };
  const performAction = async () => {
    if (!policy) return;
    let succeeded = false;
    if (action === 'publish') succeeded = await run(() => publish.mutateAsync({ id: policy.id, effectiveFrom: iso(lifecycle.effectiveFrom) ?? '', effectiveTo: iso(lifecycle.effectiveTo), reason: lifecycle.reason, expectedUpdatedAt: policy.updatedAt }), 'Taxa publicada.');
    if (action === 'activate') succeeded = await run(() => activate.mutateAsync(policy.id), 'Taxa ativada.');
    if (action === 'retire') succeeded = await run(() => retire.mutateAsync({ id: policy.id, reason: lifecycle.reason }), 'Taxa encerrada.');
    if (succeeded) setAction(null);
  };
  return <div className="ambassador-editor compensation-editor">
    <div className="ambassador-panel-head"><div><span>Taxas antes da distribuição</span><h2>{policy ? `${policy.provider} · v${policy.version}` : 'Nova taxa'}</h2></div><CloseButton label="Fechar editor" onClick={() => dirty ? setDiscardOpen(true) : close()} /></div>
    {!policy || policy.status === 'draft' ? <form onSubmit={submit} className="ambassador-stack">{data.legacyIosCostSettings ? <button className="button secondary compact" type="button" onClick={importIos}><CopyPlus size={14} />Usar configuração iOS</button> : null}<div className="ambassador-form-grid"><label className="ambassador-field"><span>Provedor</span><input required pattern="[a-z0-9_]{2,40}" value={draft.provider} onChange={(event) => setDraft({ ...draft, provider: event.target.value.toLowerCase() })} placeholder="apple, stripe, asaas" /></label><label className="ambassador-field"><span>Canal</span><input required pattern="[a-z0-9_]{2,40}" value={draft.paymentMethod} onChange={(event) => setDraft({ ...draft, paymentMethod: event.target.value.toLowerCase() })} placeholder="in_app_purchase, card, pix" /></label></div><label className="ambassador-field"><span>Produto</span><select value={draft.offeringTypeSlug} onChange={(event) => setDraft({ ...draft, offeringTypeSlug: event.target.value })}><option value="">Todos os produtos</option>{data.offeringTypes.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}</select></label><div className="compensation-cost-grid"><label><span>Loja %</span><input type="number" min="0" max="99.9999" step="0.0001" required value={draft.commission} onChange={(event) => setDraft({ ...draft, commission: event.target.value })} /></label><label><span>Processamento %</span><input type="number" min="0" max="99.9999" step="0.0001" required value={draft.processing} onChange={(event) => setDraft({ ...draft, processing: event.target.value })} /></label><label><span>Taxa fixa</span><input type="number" min="0" step="0.01" required value={draft.fixed} onChange={(event) => setDraft({ ...draft, fixed: event.target.value })} /></label><label><span>Arredondamento</span><input type="number" min="0.01" step="0.01" required value={draft.roundingIncrement} onChange={(event) => setDraft({ ...draft, roundingIncrement: event.target.value })} /></label></div><details className="ambassador-progressive"><summary>Avançado</summary><label className="ambassador-field"><span>Regra de arredondamento</span><select value={draft.roundingMode} onChange={(event) => setDraft({ ...draft, roundingMode: event.target.value as typeof draft.roundingMode })}><option value="half_up">Comercial</option><option value="down">Para baixo</option><option value="up">Para cima</option></select></label></details><label className="ambassador-field"><span>Justificativa</span><textarea required minLength={8} maxLength={1000} value={draft.changeReason} onChange={(event) => setDraft({ ...draft, changeReason: event.target.value })} /></label><button className="button primary" disabled={save.isPending}><Save size={16} />Salvar rascunho</button></form> : <div className="compensation-policy-readonly"><span>Loja {policy.commissionPercentage}%</span><span>Processamento {policy.processingPercentage}%</span><span>Fixa {formatCurrencyExact(policy.fixedAmount)}</span>{policy.snapshotHash ? <details className="technical-details"><summary>Detalhes técnicos</summary><code>{policy.snapshotHash.slice(0, 12)}…</code></details> : null}</div>}
    {policy?.status === 'draft' ? <form className="compensation-publication" onSubmit={publishPolicy}><h3>Publicar taxa</h3><div className="ambassador-form-grid"><label className="ambassador-field"><span>Início</span><input required type="datetime-local" value={lifecycle.effectiveFrom} onChange={(event) => setLifecycle({ ...lifecycle, effectiveFrom: event.target.value })} /></label><label className="ambassador-field"><span>Fim opcional</span><input type="datetime-local" value={lifecycle.effectiveTo} onChange={(event) => setLifecycle({ ...lifecycle, effectiveTo: event.target.value })} /></label></div><label className="ambassador-field"><span>Justificativa</span><textarea required minLength={8} value={lifecycle.reason} onChange={(event) => setLifecycle({ ...lifecycle, reason: event.target.value })} /></label><button className="button primary" disabled={publish.isPending}><ShieldCheck size={16} />Publicar</button></form> : null}
    {policy?.status === 'scheduled' ? <button className="button primary" onClick={() => setAction('activate')}><Play size={16} />Ativar se vigente</button> : null}
    {policy && ['active', 'scheduled'].includes(policy.status) ? <div className="compensation-retire"><label className="ambassador-field"><span>Justificativa para encerrar</span><input minLength={8} value={lifecycle.reason} onChange={(event) => setLifecycle({ ...lifecycle, reason: event.target.value })} /></label><button className="button danger" disabled={lifecycle.reason.trim().length < 8 || retire.isPending} onClick={() => setAction('retire')}><Clock3 size={16} />Encerrar</button></div> : null}
    <AmbassadorDialog open={discardOpen} eyebrow="Alterações não salvas" title="Fechar esta configuração?" description="Alterações ainda não salvas serão perdidas." confirmLabel="Fechar" tone="danger" onCancel={() => setDiscardOpen(false)} onConfirm={close} />
    <AmbassadorDialog open={action !== null} eyebrow="Revisar ação" title={action === 'publish' ? 'Publicar esta taxa?' : action === 'activate' ? 'Ativar esta taxa?' : 'Encerrar esta taxa?'} description={`${policy?.provider ?? ''} · ${policy?.paymentMethod ?? ''} · ${policy?.offeringTypeName ?? 'Todos os produtos'}`} confirmLabel={action === 'retire' ? 'Encerrar' : action === 'activate' ? 'Ativar' : 'Publicar'} tone={action === 'retire' ? 'danger' : 'primary'} pending={publish.isPending || activate.isPending || retire.isPending} onCancel={() => setAction(null)} onConfirm={performAction} />
  </div>;
}

function SimulatorTab({ data }: { data: CompensationSnapshot }) {
  const simulate = useSimulateCompensation();
  const [matrixId, setMatrixId] = useState(''); const [gross, setGross] = useState('100');
  const [costIds, setCostIds] = useState<string[]>([]); const [useLegacyIos, setUseLegacyIos] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const selected = data.matrices.find((item) => item.matrixId === matrixId);
  const applicableCosts = data.costPolicies.filter((item) => !selected || !item.offeringTypeSlug || item.offeringTypeSlug === selected.offeringTypeSlug);
  const submit = (event: FormEvent) => { event.preventDefault(); setError(null); simulate.mutate({ matrixId, grossAmount: Number(gross), costPolicyIds: costIds, useLegacyIosSettings: useLegacyIos }, { onError: (caught) => setError(compensationErrorMessage(caught)) }); };
  return <div className="compensation-simulator"><form className="ambassador-list-panel" onSubmit={submit}><div className="ambassador-section-head"><div><h2>Simulação sem movimentação financeira</h2><p>Aplica custos estimados ao bruto e distribui somente o líquido. Nada é persistido em transações ou carteiras.</p></div></div><label className="ambassador-field"><span>Matriz</span><select required value={matrixId} onChange={(event) => { setMatrixId(event.target.value); setCostIds([]); }}><option value="">Selecione</option>{data.matrices.map((matrix) => <option value={matrix.matrixId} key={matrix.matrixId}>{matrix.offeringTypeName} · v{matrix.version} · {statusLabels[matrix.status]}</option>)}</select></label><label className="ambassador-field"><span>Valor bruto hipotético</span><input required type="number" min="0.01" step="0.01" value={gross} onChange={(event) => setGross(event.target.value)} /></label><fieldset className="compensation-cost-options"><legend>Custos aplicáveis</legend>{applicableCosts.map((policy) => <label key={policy.id}><input type="checkbox" checked={costIds.includes(policy.id)} onChange={(event) => setCostIds(event.target.checked ? [...costIds, policy.id] : costIds.filter((id) => id !== policy.id))} /><span>{policy.provider} · {policy.paymentMethod} · v{policy.version} ({statusLabels[policy.status]})</span></label>)}{data.legacyIosCostSettings?.enabled ? <label><input type="checkbox" checked={useLegacyIos} onChange={(event) => setUseLegacyIos(event.target.checked)} /><span>Configuração iOS existente · v{data.legacyIosCostSettings.version}</span></label> : null}</fieldset>{error ? <div className="inline-alert danger"><AlertTriangle size={18} />{error}</div> : null}<button className="button primary" disabled={!matrixId || simulate.isPending}><Calculator size={16} />Simular</button></form>{simulate.data ? <div className="ambassador-list-panel simulation-result"><div className="simulation-flow"><div><span>Bruto</span><strong>{formatCurrencyExact(simulate.data.grossAmount)}</strong></div><div><span>Custos externos</span><strong>− {formatCurrencyExact(simulate.data.externalCosts.total)}</strong></div><div className="net"><span>Líquido distribuível</span><strong>{formatCurrencyExact(simulate.data.netDistributable)}</strong></div></div><div className="simulation-cost-breakdown"><span>Loja: {formatCurrencyExact(simulate.data.externalCosts.storeCommission)}</span><span>Processamento: {formatCurrencyExact(simulate.data.externalCosts.processing)}</span><span>Fixas: {formatCurrencyExact(simulate.data.externalCosts.fixed)}</span></div>{simulate.data.scenarios.map((scenario) => <section className="simulation-scenario" key={scenario.scenario}><h3>{scenarioLabels[scenario.scenario]}</h3>{scenario.complete ? <div>{scenario.allocations.map((allocation) => <span key={allocation.beneficiaryRole}><small>{roleLabels[allocation.beneficiaryRole]} · {allocation.percentage}%</small><strong>{formatCurrencyExact(allocation.amount)}</strong></span>)}</div> : <p className="ambassador-muted">Cenário ainda incompleto.</p>}</section>)}<div className="inline-alert"><ShieldCheck size={18} />Resultado apenas estimado; custo efetivo do provedor prevalecerá futuramente.</div></div> : null}</div>;
}
