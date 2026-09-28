import { Check, Database, Pencil, Plus, RefreshCw, Save, X } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import type {
  StaffFoodSourceSave,
  StaffNutrientSave,
} from '../api/core.gen';
import {
  useNutritionCatalog,
  useSaveNutritionCatalogItem,
  useSetNutritionCatalogItemActive,
} from '../hooks/useNutritionCatalogs';
import { useCurrentStaffRole } from '../hooks/useStaffManagement';
import {
  nutritionCatalogErrorMessage,
  type NutritionCatalogItem,
  type NutritionCatalogKind,
  type NutritionCatalogSave,
} from '../lib/nutritionCatalogs';

type Draft = NutritionCatalogSave;

function newDraft(kind: NutritionCatalogKind, position: number): Draft {
  if (kind === 'food_sources') return {
    kind,
    key: '',
    public: true,
    position,
    expected_version: null,
    data: {
      origin: 'brand',
      display_name_key: '',
      license_name: null,
      license_url: null,
      attribution_text: null,
      homepage_url: null,
      verified_by_default: false,
      search_priority: position,
    },
  };
  return {
    kind,
    key: '',
    public: true,
    position,
    expected_version: null,
    data: { unit: 'g', display_name_key: '' },
  };
}

function draftFrom(item: NutritionCatalogItem): Draft {
  if (item.kind === 'food_sources') return {
    kind: item.kind,
    key: item.key,
    public: item.public,
    position: item.position,
    expected_version: item.version,
    data: { ...item.data },
  };
  return {
    kind: item.kind,
    key: item.key,
    public: item.public,
    position: item.position,
    expected_version: item.version,
    data: { ...item.data },
  };
}

function withDisplayName(draft: Draft, displayName: string): Draft {
  if (draft.kind === 'food_sources') return {
    ...draft,
    data: { ...draft.data, display_name_key: displayName },
  };
  return { ...draft, data: { ...draft.data, display_name_key: displayName } };
}

function normalizedDraft(draft: Draft): Draft {
  const key = draft.key.trim();
  const displayName = draft.data.display_name_key.trim();
  if (draft.kind === 'food_sources') return {
    ...draft,
    key,
    data: {
      ...draft.data,
      display_name_key: displayName,
      license_name: draft.data.license_name?.trim() || null,
      license_url: draft.data.license_url?.trim() || null,
      attribution_text: draft.data.attribution_text?.trim() || null,
      homepage_url: draft.data.homepage_url?.trim() || null,
    },
  };
  return { ...draft, key, data: { ...draft.data, display_name_key: displayName } };
}

export function NutritionCatalogsPage() {
  const role = useCurrentStaffRole();
  const canGovern = role.data === 'admin' || role.data === 'super_admin';
  const [kind, setKind] = useState<NutritionCatalogKind>('food_sources');
  const [draft, setDraft] = useState<Draft | null>(null);
  const query = useNutritionCatalog(kind);
  const save = useSaveNutritionCatalogItem();
  const setActive = useSetNutritionCatalogItemActive();
  const items = useMemo(
    () => [...(query.data ?? [])].sort((left, right) => left.position - right.position),
    [query.data],
  );
  const busy = save.isPending || setActive.isPending;
  const failure = save.error ?? setActive.error;
  const nextPosition = items.length ? Math.max(...items.map((item) => item.position)) + 10 : 0;

  function changeKind(next: NutritionCatalogKind) {
    setKind(next);
    setDraft(null);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft || !canGovern || !draft.key.trim() || !draft.data.display_name_key.trim()) return;
    await save.mutateAsync(normalizedDraft(draft));
    setDraft(null);
  }

  return <>
    <header className="page-header">
      <div><p className="section-label">Biblioteca da plataforma</p><h1>Catálogos nutricionais</h1><p className="ohlib-lead">Fontes de alimentos e nutrientes reconhecidos pelo OnlyFit Core.</p></div>
      <div className="pcat-row-actions">{canGovern ? <button className="button primary" type="button" onClick={() => setDraft(newDraft(kind, nextPosition))} disabled={busy}><Plus size={16} />Novo item</button> : null}<button className="button secondary" type="button" onClick={() => void query.refetch()} disabled={query.isFetching}><RefreshCw className={query.isFetching ? 'spin' : ''} size={16} />Atualizar</button></div>
    </header>
    <section className="content pcat-page nutrition-catalog-page">
      <nav className="ohlib-tabs" aria-label="Catálogos nutricionais"><button type="button" className={kind === 'food_sources' ? 'active' : ''} onClick={() => changeKind('food_sources')}><Database size={19} /><span><strong>Fontes de alimentos</strong><small>Origem, licença e prioridade</small></span></button><button type="button" className={kind === 'nutrients' ? 'active' : ''} onClick={() => changeKind('nutrients')}><Database size={19} /><span><strong>Nutrientes</strong><small>Código, nome e unidade</small></span></button></nav>
      <div className="pcat-summary"><span><strong>{items.length}</strong> cadastrados</span><span><strong>{items.filter((item) => item.active).length}</strong> ativos</span><span><strong>{items.filter((item) => item.public).length}</strong> públicos</span></div>
      {failure ? <p className="form-error" role="alert">{nutritionCatalogErrorMessage(failure)}</p> : null}
      {query.isError ? <p className="form-error" role="alert">Não foi possível carregar o catálogo nutricional.</p> : null}
      <div className={draft ? 'pcat-workspace has-editor' : 'pcat-workspace'}>
        <div className="pcat-list-panel">
          {query.isLoading ? <div className="pcat-loading"><RefreshCw className="spin" size={22} /></div> : null}
          {!query.isLoading && !items.length ? <div className="pcat-empty"><Database size={26} /><strong>Nenhum item neste catálogo</strong></div> : null}
          {items.length ? <ul className="pcat-list">{items.map((item) => <CatalogRow key={`${item.kind}:${item.key}`} item={item} busy={busy} canGovern={canGovern} onEdit={() => setDraft(draftFrom(item))} onSetActive={(active) => setActive.mutate({ item, active })} />)}</ul> : null}
        </div>
        {draft ? <CatalogEditor draft={draft} busy={busy} onChange={setDraft} onCancel={() => setDraft(null)} onSubmit={submit} /> : null}
      </div>
    </section>
  </>;
}

function CatalogRow({ item, busy, canGovern, onEdit, onSetActive }: {
  item: NutritionCatalogItem;
  busy: boolean;
  canGovern: boolean;
  onEdit: () => void;
  onSetActive: (active: boolean) => void;
}) {
  const detail = item.kind === 'food_sources'
    ? `${item.data.origin} · prioridade ${item.data.search_priority}${item.data.license_name ? ` · ${item.data.license_name}` : ''}`
    : `Unidade: ${item.data.unit}`;
  return <li className={item.active ? 'pcat-row' : 'pcat-row inactive'}>
    <span className="pcat-icon"><Database size={19} /></span>
    <div className="pcat-row-main"><div><strong>{item.data.display_name_key}</strong><code>{item.key}</code></div><span className={item.active ? 'pcat-status active' : 'pcat-status'}>{item.active ? 'Ativo' : 'Inativo'}</span><span className="pcat-muted">{detail} · posição {item.position} · {item.public ? 'público' : 'interno'}</span></div>
    {canGovern ? <div className="pcat-row-actions"><button className="button secondary compact" type="button" disabled={busy} onClick={onEdit}><Pencil size={14} />Editar</button><button className={item.active ? 'button danger compact' : 'button primary compact'} type="button" disabled={busy} onClick={() => onSetActive(!item.active)}>{item.active ? <X size={14} /> : <Check size={14} />}{item.active ? 'Desativar' : 'Ativar'}</button></div> : null}
  </li>;
}

function CatalogEditor({ draft, busy, onChange, onCancel, onSubmit }: {
  draft: Draft;
  busy: boolean;
  onChange: (draft: Draft) => void;
  onCancel: () => void;
  onSubmit: (event: FormEvent) => Promise<void>;
}) {
  const existing = draft.expected_version !== null && draft.expected_version !== undefined;
  return <form className="pcat-editor" onSubmit={onSubmit}>
    <h2 className="pcat-section-heading">{existing ? 'Editar item' : 'Novo item'}</h2>
    <label className="pcat-field"><span>Chave</span><input required pattern="[a-z0-9_]{2,60}" value={draft.key} readOnly={existing} onChange={(event) => onChange({ ...draft, key: event.target.value })} /></label>
    <label className="pcat-field"><span>Chave de exibição</span><input required minLength={2} maxLength={120} value={draft.data.display_name_key} onChange={(event) => onChange(withDisplayName(draft, event.target.value))} /></label>
    <div className="exercise-editor-grid"><label className="pcat-field"><span>Posição</span><input required type="number" min={0} max={100000} value={draft.position} onChange={(event) => onChange({ ...draft, position: Number(event.target.value) })} /></label><label className="ohlib-check"><input type="checkbox" checked={draft.public} onChange={(event) => onChange({ ...draft, public: event.target.checked })} /><span>Disponível publicamente</span></label></div>
    {draft.kind === 'food_sources' ? <FoodSourceFields draft={draft} onChange={onChange} /> : <NutrientFields draft={draft} onChange={onChange} />}
    <div className="pcat-editor-actions"><button className="button secondary" type="button" onClick={onCancel} disabled={busy}>Cancelar</button><button className="button primary" type="submit" disabled={busy || !draft.key.trim() || !draft.data.display_name_key.trim()}>{busy ? <RefreshCw className="spin" size={16} /> : <Save size={16} />}Salvar</button></div>
  </form>;
}

function FoodSourceFields({ draft, onChange }: {
  draft: StaffFoodSourceSave;
  onChange: (draft: Draft) => void;
}) {
  const patch = (data: Partial<StaffFoodSourceSave['data']>) => onChange({ ...draft, data: { ...draft.data, ...data } });
  return <section className="exercise-editor-section"><h3>Origem e licença</h3><label className="pcat-field"><span>Origem</span><select value={draft.data.origin} onChange={(event) => patch({ origin: event.target.value === 'taco' ? 'taco' : event.target.value === 'tbca' ? 'tbca' : event.target.value === 'usda' ? 'usda' : event.target.value === 'restaurant' ? 'restaurant' : event.target.value === 'personal' ? 'personal' : 'brand' })}><option value="taco">TACO</option><option value="tbca">TBCA</option><option value="usda">USDA</option><option value="brand">Marca</option><option value="restaurant">Restaurante</option><option value="personal">Pessoal</option></select></label><div className="exercise-editor-grid"><label className="pcat-field"><span>Prioridade de busca</span><input type="number" min={0} max={1000} value={draft.data.search_priority} onChange={(event) => patch({ search_priority: Number(event.target.value) })} /></label><label className="ohlib-check"><input type="checkbox" checked={draft.data.verified_by_default} onChange={(event) => patch({ verified_by_default: event.target.checked })} /><span>Verificada por padrão</span></label></div><label className="pcat-field"><span>Nome da licença</span><input value={draft.data.license_name ?? ''} onChange={(event) => patch({ license_name: event.target.value || null })} /></label><label className="pcat-field"><span>URL da licença</span><input type="url" value={draft.data.license_url ?? ''} onChange={(event) => patch({ license_url: event.target.value || null })} /></label><label className="pcat-field"><span>Texto de atribuição</span><textarea rows={3} value={draft.data.attribution_text ?? ''} onChange={(event) => patch({ attribution_text: event.target.value || null })} /></label><label className="pcat-field"><span>Site oficial</span><input type="url" value={draft.data.homepage_url ?? ''} onChange={(event) => patch({ homepage_url: event.target.value || null })} /></label></section>;
}

function NutrientFields({ draft, onChange }: {
  draft: StaffNutrientSave;
  onChange: (draft: Draft) => void;
}) {
  return <section className="exercise-editor-section"><h3>Unidade</h3><label className="pcat-field"><span>Unidade canônica</span><select value={draft.data.unit} onChange={(event) => onChange({ ...draft, data: { ...draft.data, unit: event.target.value === 'kcal' ? 'kcal' : event.target.value === 'mg' ? 'mg' : event.target.value === 'mcg' ? 'mcg' : 'g' } })}><option value="kcal">kcal</option><option value="g">g</option><option value="mg">mg</option><option value="mcg">mcg</option></select></label></section>;
}
