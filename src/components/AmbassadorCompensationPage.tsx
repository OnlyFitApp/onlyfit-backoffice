import { AlertTriangle, Calculator, RefreshCw, Save } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import type { StaffAffinityGroupItem, StaffChannelCostPolicy, StaffCompensationMatrix, StaffOfferTypeItem } from '../api/core.gen';
import { useCurrentStaffRole } from '../hooks/useStaffManagement';
import { useChannelCostPolicyAction, useCompensationMatrixAction, useCompensationSnapshot, useSimulateCompensation } from '../hooks/useAmbassadorCompensation';
import { compensationErrorMessage, type CompensationScenario } from '../lib/ambassadorCompensation';
import { formatCurrencyExact } from '../lib/format';

const scenarios: CompensationScenario[] = ['direct_to_principal', 'via_associate', 'no_principal', 'via_associate_without_principal'];
const scenarioNames: Record<CompensationScenario, string> = {
  direct_to_principal: 'Direto ao principal', via_associate: 'Via associado', no_principal: 'Sem principal',
  via_associate_without_principal: 'Associado sem principal',
};

function matrixStatus(value: string): StaffCompensationMatrix['status'] | '' {
  return value === 'draft' || value === 'scheduled' || value === 'active' || value === 'retired' ? value : '';
}

export function AmbassadorCompensationPage() {
  const [status, setStatus] = useState<StaffCompensationMatrix['status'] | ''>('');
  const query = useCompensationSnapshot({ status });
  const role = useCurrentStaffRole();
  const canEdit = role.data === 'admin' || role.data === 'super_admin';
  const [selected, setSelected] = useState<StaffCompensationMatrix>();
  const [selectedCost, setSelectedCost] = useState<StaffChannelCostPolicy>();
  const offerTypes = query.data?.offerTypes.items.filter((item): item is StaffOfferTypeItem => item.kind === 'offer_types') ?? [];
  const affinities = query.data?.affinityGroups.items.filter((item): item is StaffAffinityGroupItem => item.kind === 'affinity_groups') ?? [];
  return <>
    <header className="page-header"><div><p className="section-label">Comercial</p><h1>Remuneração dos Embaixadores</h1><span>Percentuais e custos externos versionados no Core.</span></div><button className="button secondary" onClick={() => void query.refetch()}><RefreshCw size={16} />Atualizar</button></header>
    <section className="content compensation-page">
      <select value={status} onChange={(event) => setStatus(matrixStatus(event.target.value))}><option value="">Todos os estados</option><option value="draft">Rascunho</option><option value="scheduled">Agendada</option><option value="active">Ativa</option><option value="retired">Encerrada</option></select>
      {query.isLoading ? <div className="skeleton staff-skeleton" /> : query.isError ? <div className="inline-alert danger"><AlertTriangle size={18} />Não foi possível carregar as políticas.</div> : null}
      {query.data ? <div className="compensation-layout">
        <section className="ambassador-list-panel"><h2>Percentuais</h2>{canEdit ? <MatrixCreate offerTypes={offerTypes} affinities={affinities} regions={query.data.regions} /> : null}<div className="channel-cost-list">{query.data.matrices.items.map((matrix) => <button key={matrix.id} type="button" onClick={() => setSelected(matrix)}><strong>{offerTypes.find((item) => item.key === matrix.offering_type)?.label ?? matrix.offering_type}</strong><span>{matrix.status} · v{matrix.version} · {matrix.scenarios.length}/4 cenários</span></button>)}</div></section>
        <section className="ambassador-list-panel"><h2>Custos por canal</h2>{canEdit ? <CostCreate offerTypes={offerTypes} /> : null}<div className="channel-cost-list">{query.data.costs.items.map((cost) => <button key={cost.id} type="button" onClick={() => setSelectedCost(cost)}><strong>{cost.provider} · {cost.payment_method}</strong><span>{cost.status} · {cost.commission_percentage}% + {formatCurrencyExact(cost.fixed_amount)}</span></button>)}</div></section>
        <Simulator offerTypes={offerTypes} affinities={affinities} />
      </div> : null}
    </section>
    {selected ? <MatrixEditor matrix={selected} close={() => setSelected(undefined)} /> : null}
    {selectedCost ? <LifecycleEditor kind="cost" item={selectedCost} close={() => setSelectedCost(undefined)} /> : null}
  </>;
}

function MatrixCreate({ offerTypes, affinities, regions }: { offerTypes: StaffOfferTypeItem[]; affinities: StaffAffinityGroupItem[]; regions: { id: string; name: string; active: boolean }[] }) {
  const mutation = useCompensationMatrixAction(); const [offeringType, setOfferingType] = useState(''); const [affinity, setAffinity] = useState(''); const [region, setRegion] = useState('');
  const submit = (event: FormEvent) => { event.preventDefault(); mutation.mutate({ action: 'create', matrixId: null, expectedVersion: null, data: { offering_type: offeringType, affinity_group: affinity || null, region_code: region || null, currency: 'BRL' } }); };
  return <form onSubmit={submit} className="ambassador-form-grid"><select required value={offeringType} onChange={(e) => setOfferingType(e.target.value)}><option value="">Tipo de oferta</option>{offerTypes.filter((item) => item.active).map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}</select><select value={affinity} onChange={(e) => setAffinity(e.target.value)}><option value="">Todas as verticais</option>{affinities.filter((item) => item.active).map((item) => <option key={item.key} value={item.key}>{item.data.label}</option>)}</select><select value={region} onChange={(e) => setRegion(e.target.value)}><option value="">Todas as regiões</option>{regions.filter((item) => item.active).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><button className="button primary" disabled={mutation.isPending}>Criar matriz</button></form>;
}

function MatrixEditor({ matrix, close }: { matrix: StaffCompensationMatrix; close: () => void }) {
  const mutation = useCompensationMatrixAction();
  const firstScenario = matrix.scenarios[0]?.scenario ?? 'direct_to_principal';
  const valuesFor = (value: CompensationScenario) => {
    const saved = matrix.scenarios.find((item) => item.scenario === value);
    return { professional: String(saved?.professional_share ?? 0), associate: String(saved?.associate_share ?? 0), principal: String(saved?.principal_share ?? 0), platform: String(saved?.platform_share ?? 0) };
  };
  const [scenario, setScenario] = useState<CompensationScenario>(firstScenario);
  const [shares, setShares] = useState(() => valuesFor(firstScenario));
  const [reason, setReason] = useState(matrix.scenarios.find((item) => item.scenario === firstScenario)?.rationale ?? '');
  const selectScenario = (value: string) => {
    const selected = scenarios.find((item) => item === value) ?? 'direct_to_principal';
    setScenario(selected); setShares(valuesFor(selected)); setReason(matrix.scenarios.find((item) => item.scenario === selected)?.rationale ?? '');
  };
  const save = (event: FormEvent) => { event.preventDefault(); mutation.mutate({ action: 'saveScenario', matrixId: matrix.id, expectedVersion: matrix.version, data: { scenario, professional_share: Number(shares.professional), associate_share: Number(shares.associate), principal_share: Number(shares.principal), platform_share: Number(shares.platform), rationale: reason } }); };
  return <div className="user-dialog" role="dialog"><h2>Editar matriz v{matrix.version}</h2><form onSubmit={save}><select value={scenario} onChange={(e) => selectScenario(e.target.value)}>{scenarios.map((item) => <option key={item} value={item}>{scenarioNames[item]}</option>)}</select>{Object.entries(shares).map(([key, value]) => <label key={key}>{key}<input type="number" min="0" max="100" step="0.0001" value={value} onChange={(e) => setShares({ ...shares, [key]: e.target.value })} /></label>)}<textarea required minLength={3} value={reason} onChange={(e) => setReason(e.target.value)} /><button className="button primary"><Save size={16} />Salvar cenário</button></form><LifecycleEditor kind="matrix" item={matrix} close={close} /></div>;
}

function CostCreate({ offerTypes }: { offerTypes: StaffOfferTypeItem[] }) {
  const mutation = useChannelCostPolicyAction(); const [provider, setProvider] = useState<StaffChannelCostPolicy['provider']>('apple'); const [method, setMethod] = useState<StaffChannelCostPolicy['payment_method']>('app_store'); const [type, setType] = useState('');
  return <form className="ambassador-form-grid" onSubmit={(e) => { e.preventDefault(); mutation.mutate({ action: 'create', policyId: null, expectedVersion: null, data: { provider, payment_method: method, offering_type: type || null, commission_percentage: 0, processing_percentage: 0, fixed_amount: 0, rounding_mode: 'half_up', rounding_increment: 0.01 } }); }}><select value={provider} onChange={(e) => setProvider(e.target.value === 'google' || e.target.value === 'stripe' || e.target.value === 'asaas' ? e.target.value : 'apple')}><option value="apple">Apple</option><option value="google">Google</option><option value="stripe">Stripe</option><option value="asaas">Asaas</option></select><select value={method} onChange={(e) => setMethod(e.target.value === 'google_play' || e.target.value === 'card' || e.target.value === 'pix' ? e.target.value : 'app_store')}><option value="app_store">App Store</option><option value="google_play">Google Play</option><option value="card">Cartão</option><option value="pix">Pix</option></select><select value={type} onChange={(e) => setType(e.target.value)}><option value="">Todas as ofertas</option>{offerTypes.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}</select><button className="button primary">Criar taxa</button></form>;
}

function LifecycleEditor({ kind, item, close }: { kind: 'matrix'; item: StaffCompensationMatrix; close: () => void } | { kind: 'cost'; item: StaffChannelCostPolicy; close: () => void }) {
  const matrixMutation = useCompensationMatrixAction(); const costMutation = useChannelCostPolicyAction();
  const act = (action: 'publish' | 'activate' | 'retire') => {
    const data = action === 'publish' ? { effective_from: new Date().toISOString() } : {};
    return kind === 'matrix'
      ? matrixMutation.mutate({ action, matrixId: item.id, expectedVersion: item.version, data })
      : costMutation.mutate({ action, policyId: item.id, expectedVersion: item.version, data });
  };
  return <div className="user-dialog-actions"><button className="button secondary" onClick={close}>Fechar</button>{item.status === 'draft' ? <button className="button primary" onClick={() => act('publish')}>Publicar</button> : null}{item.status === 'scheduled' ? <button className="button primary" onClick={() => act('activate')}>Ativar</button> : null}{item.status !== 'retired' ? <button className="button danger" onClick={() => act('retire')}>Encerrar</button> : null}</div>;
}

function Simulator({ offerTypes, affinities }: { offerTypes: StaffOfferTypeItem[]; affinities: StaffAffinityGroupItem[] }) {
  const mutation = useSimulateCompensation(); const [type, setType] = useState(''); const [amount, setAmount] = useState('100'); const [affinity, setAffinity] = useState('');
  return <section className="ambassador-list-panel"><h2><Calculator size={18} /> Simulador</h2><form onSubmit={(e) => { e.preventDefault(); mutation.mutate({ amount: Number(amount), currency: 'BRL', offeringType: type, scenario: 'direct_to_principal', provider: 'stripe', paymentMethod: 'card', affinityGroup: affinity || null }); }}><select required value={type} onChange={(e) => setType(e.target.value)}><option value="">Tipo de oferta</option>{offerTypes.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}</select><select value={affinity} onChange={(e) => setAffinity(e.target.value)}><option value="">Todas as verticais</option>{affinities.map((item) => <option key={item.key} value={item.key}>{item.data.label}</option>)}</select><input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} /><button className="button primary">Simular</button></form>{mutation.data ? <div><strong>Plataforma líquida: {formatCurrencyExact(mutation.data.platform_net)}</strong><p>Custo do canal: {formatCurrencyExact(mutation.data.channel_cost)}</p></div> : null}{mutation.error ? <div className="inline-alert danger">{compensationErrorMessage(mutation.error)}</div> : null}</section>;
}
