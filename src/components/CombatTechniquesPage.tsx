import {
  Check,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Shield,
  Swords,
  X,
} from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import {
  useCombatTechniques,
  useSetCombatTechniqueActive,
  useUpsertCombatTechnique,
} from '../hooks/useCombatTechniques';
import { useCurrentStaffRole } from '../hooks/useStaffManagement';
import {
  combatTechniqueErrorMessage,
  type CombatTechnique,
  type CombatTechniqueInput,
} from '../lib/combatTechniques';
import { formatNumber } from '../lib/format';

const PAGE_SIZE = 40;
const DISCIPLINES = [
  ['generic', 'Geral'],
  ['boxing', 'Boxe'],
  ['muay_thai', 'Muay Thai'],
  ['mma', 'MMA'],
  ['bjj', 'Jiu-jitsu'],
  ['judo', 'Judô'],
  ['karate', 'Karatê'],
] as const;
const DISTANCES = [
  ['long', 'Longa'],
  ['mid', 'Média'],
  ['close', 'Curta'],
  ['clinch', 'Clinch'],
  ['ground', 'Solo'],
] as const;

const emptyDraft: CombatTechniqueInput = {
  id: '',
  namePtbr: '',
  nameEn: '',
  nameEs: '',
  descriptionPtbr: '',
  techniqueType: 'attack',
  distance: 'mid',
  disciplines: ['generic'],
  videoUrl: '',
  thumbUrl: '',
  active: true,
};

const disciplineLabel = (key: string) => DISCIPLINES.find(([value]) => value === key)?.[1] ?? key;
const distanceLabel = (key: string) => DISTANCES.find(([value]) => value === key)?.[1] ?? key;

export function CombatTechniquesPage() {
  const role = useCurrentStaffRole();
  const canGovern = role.data === 'admin' || role.data === 'super_admin';
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [discipline, setDiscipline] = useState('all');
  const [techniqueType, setTechniqueType] = useState('all');
  const [distance, setDistance] = useState('all');
  const [page, setPage] = useState(0);
  const [draft, setDraft] = useState<CombatTechniqueInput | null>(null);

  const filters = useMemo(() => ({
    search,
    active: status === 'all' ? null : status === 'active',
    discipline: discipline === 'all' ? null : discipline,
    techniqueType: techniqueType === 'all' ? null : techniqueType,
    distance: distance === 'all' ? null : distance,
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
  }), [discipline, distance, page, search, status, techniqueType]);

  const query = useCombatTechniques(filters);
  const upsert = useUpsertCombatTechnique();
  const setActive = useSetCombatTechniqueActive();
  const items = query.data?.items ?? [];
  const total = query.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const busy = upsert.isPending || setActive.isPending;
  const failure = upsert.error ?? setActive.error;

  function openNew() {
    setDraft({ ...emptyDraft, disciplines: [...emptyDraft.disciplines] });
    upsert.reset();
    setActive.reset();
  }

  function openEdit(entry: CombatTechnique) {
    setDraft({
      id: entry.id,
      namePtbr: entry.namePtbr,
      nameEn: entry.nameEn,
      nameEs: entry.nameEs,
      descriptionPtbr: entry.descriptionPtbr,
      techniqueType: entry.techniqueType,
      distance: entry.distance,
      disciplines: [...entry.disciplines],
      videoUrl: entry.videoUrl,
      thumbUrl: entry.thumbUrl,
      active: entry.active,
    });
    upsert.reset();
    setActive.reset();
  }

  function patch(values: Partial<CombatTechniqueInput>) {
    setDraft((current) => current ? { ...current, ...values } : current);
  }

  function toggleDiscipline(key: string) {
    setDraft((current) => {
      if (!current) return current;
      const disciplines = current.disciplines.includes(key)
        ? current.disciplines.filter((item) => item !== key)
        : [...current.disciplines, key];
      return { ...current, disciplines };
    });
  }

  function applyFilter(change: () => void) {
    change();
    setPage(0);
  }

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    applyFilter(() => setSearch(searchInput.trim()));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft || !canGovern || !draft.namePtbr.trim() || draft.disciplines.length === 0) return;
    try {
      await upsert.mutateAsync(draft);
      setDraft(null);
    } catch {
      // A mutation mantém o erro visível no formulário.
    }
  }

  const first = total === 0 ? 0 : page * PAGE_SIZE + 1;
  const last = Math.min(total, (page + 1) * PAGE_SIZE);

  return (
    <>
      <header className="page-header">
        <div>
          <p className="section-label">Biblioteca da plataforma</p>
          <h1>Técnicas de luta</h1>
        </div>
        <div className="pcat-row-actions">
          {canGovern ? <button className="button primary" type="button" onClick={openNew} disabled={busy}><Plus size={16} /> Nova técnica</button> : null}
          <button className="button secondary" type="button" onClick={() => void query.refetch()} disabled={query.isFetching}>
            <RefreshCw className={query.isFetching ? 'spin' : ''} size={16} /> Atualizar
          </button>
        </div>
      </header>

      <section className="content pcat-page exercise-catalog-page combat-techniques-page">
        <div className="pcat-summary">
          <span><strong>{formatNumber(total)}</strong> neste filtro</span>
          <span><strong>{formatNumber(items.filter((item) => item.active).length)}</strong> disponíveis na página</span>
          <span><strong>{formatNumber(items.reduce((sum, item) => sum + item.inUseCount, 0))}</strong> usos na página</span>
        </div>

        <form className="exercise-catalog-filters" onSubmit={submitSearch}>
          <label className="pcat-field exercise-catalog-search"><span>Buscar</span><div><Search size={16} aria-hidden="true" /><input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Nome da técnica" /></div></label>
          <label className="pcat-field"><span>Disciplina</span><select value={discipline} onChange={(event) => applyFilter(() => setDiscipline(event.target.value))}><option value="all">Todas</option>{DISCIPLINES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label className="pcat-field"><span>Tipo</span><select value={techniqueType} onChange={(event) => applyFilter(() => setTechniqueType(event.target.value))}><option value="all">Todos</option><option value="attack">Ataque</option><option value="defense">Defesa</option></select></label>
          <label className="pcat-field"><span>Distância</span><select value={distance} onChange={(event) => applyFilter(() => setDistance(event.target.value))}><option value="all">Todas</option>{DISTANCES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label className="pcat-field"><span>Situação</span><select value={status} onChange={(event) => applyFilter(() => setStatus(event.target.value as typeof status))}><option value="all">Todas</option><option value="active">Disponíveis</option><option value="inactive">Fora da escolha</option></select></label>
          <button className="button secondary" type="submit"><Search size={16} /> Buscar</button>
        </form>

        {failure ? <p className="form-error" role="alert">{combatTechniqueErrorMessage(failure)}</p> : null}
        {query.isError ? <p className="form-error" role="alert">Não foi possível carregar as técnicas.</p> : null}

        <div className={draft ? 'pcat-workspace exercise-catalog-workspace has-editor' : 'pcat-workspace exercise-catalog-workspace'}>
          <div className="pcat-list-panel">
            {query.isLoading ? <div className="exercise-catalog-skeleton" aria-label="Carregando técnicas" aria-busy="true">{Array.from({ length: 6 }, (_, index) => <span key={index} />)}</div> : null}
            {!query.isLoading && items.length === 0 ? <div className="pcat-empty"><Swords size={26} /><strong>Nenhuma técnica neste filtro</strong></div> : null}
            {items.length > 0 ? (
              <ul className="pcat-list">
                {items.map((entry) => (
                  <li className={entry.active ? 'pcat-row exercise-catalog-row' : 'pcat-row exercise-catalog-row inactive'} key={entry.id}>
                    <span className="exercise-catalog-thumb">{entry.thumbUrl ? <img src={entry.thumbUrl} alt="" loading="lazy" /> : entry.techniqueType === 'defense' ? <Shield size={20} /> : <Swords size={20} />}</span>
                    <div className="pcat-row-main">
                      <div><strong>{entry.namePtbr}</strong><code>{entry.techniqueType === 'attack' ? 'Ataque' : 'Defesa'} · {distanceLabel(entry.distance)}</code></div>
                      <span className={entry.active ? 'pcat-status active' : 'pcat-status'}>{entry.active ? 'Disponível' : 'Fora'}</span>
                      <span className="pcat-muted">{entry.disciplines.map(disciplineLabel).join(' · ')} · {formatNumber(entry.inUseCount)} usos{entry.videoUrl ? ' · Vídeo' : ''}</span>
                    </div>
                    {canGovern ? <div className="pcat-row-actions">
                      <button className="button secondary compact" type="button" onClick={() => openEdit(entry)} disabled={busy}><Pencil size={14} /> Editar</button>
                      <button className={entry.active ? 'button danger compact' : 'button primary compact'} type="button" disabled={busy} onClick={() => setActive.mutate({ id: entry.id, active: !entry.active })}>{entry.active ? <X size={14} /> : <Check size={14} />}{entry.active ? 'Despublicar' : 'Publicar'}</button>
                    </div> : null}
                  </li>
                ))}
              </ul>
            ) : null}
            {total > 0 ? <footer className="exercise-catalog-pagination"><span>{formatNumber(first)}–{formatNumber(last)} de {formatNumber(total)}</span><div><button className="button secondary compact" type="button" disabled={page === 0} onClick={() => setPage((value) => value - 1)} aria-label="Página anterior"><ChevronLeft size={15} /></button><span>{page + 1} / {pageCount}</span><button className="button secondary compact" type="button" disabled={page + 1 >= pageCount} onClick={() => setPage((value) => value + 1)} aria-label="Próxima página"><ChevronRight size={15} /></button></div></footer> : null}
          </div>

          {draft ? <form className="pcat-editor exercise-catalog-editor" onSubmit={submit}>
            <h2 className="pcat-section-heading">{draft.id ? 'Editar técnica' : 'Nova técnica'}</h2>
            <section className="exercise-editor-section"><h3>Identificação</h3><label className="pcat-field"><span>Nome em português</span><input autoFocus required maxLength={120} value={draft.namePtbr} onChange={(event) => patch({ namePtbr: event.target.value })} /></label><div className="exercise-editor-grid"><label className="pcat-field"><span>Nome em inglês</span><input maxLength={120} value={draft.nameEn} onChange={(event) => patch({ nameEn: event.target.value })} /></label><label className="pcat-field"><span>Nome em espanhol</span><input maxLength={120} value={draft.nameEs} onChange={(event) => patch({ nameEs: event.target.value })} /></label></div><label className="pcat-field"><span>Descrição</span><textarea rows={4} maxLength={4000} value={draft.descriptionPtbr} onChange={(event) => patch({ descriptionPtbr: event.target.value })} /></label></section>
            <section className="exercise-editor-section"><h3>Classificação</h3><div className="exercise-editor-grid"><label className="pcat-field"><span>Tipo</span><select value={draft.techniqueType} onChange={(event) => patch({ techniqueType: event.target.value as CombatTechniqueInput['techniqueType'] })}><option value="attack">Ataque</option><option value="defense">Defesa</option></select></label><label className="pcat-field"><span>Distância</span><select value={draft.distance} onChange={(event) => patch({ distance: event.target.value as CombatTechniqueInput['distance'] })}>{DISTANCES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div><div className="pcat-field"><span>Disciplinas</span><div className="pcat-sport-picker combat-discipline-picker">{DISCIPLINES.map(([value, label]) => <button key={value} type="button" aria-pressed={draft.disciplines.includes(value)} className={draft.disciplines.includes(value) ? 'selected' : ''} onClick={() => toggleDiscipline(value)}>{label}</button>)}</div></div></section>
            <section className="exercise-editor-section"><h3>Mídia</h3><label className="pcat-field"><span>URL da miniatura</span><input type="url" inputMode="url" value={draft.thumbUrl} onChange={(event) => patch({ thumbUrl: event.target.value })} /></label><label className="pcat-field"><span>URL do vídeo</span><input type="url" inputMode="url" value={draft.videoUrl} onChange={(event) => patch({ videoUrl: event.target.value })} /></label>{draft.thumbUrl || draft.videoUrl ? <div className="exercise-media-preview">{draft.thumbUrl ? <img src={draft.thumbUrl} alt="Prévia da miniatura" /> : <span>Sem miniatura</span>}{draft.videoUrl ? <video src={draft.videoUrl} controls preload="metadata" /> : <span>Sem vídeo</span>}</div> : null}</section>
            <label className="pcat-choice-field"><input type="checkbox" checked={draft.active} onChange={(event) => patch({ active: event.target.checked })} /><span>Disponível para novas escolhas</span></label>
            <div className="pcat-editor-actions"><button className="button secondary" type="button" onClick={() => setDraft(null)} disabled={busy}>Cancelar</button><button className="button primary" type="submit" disabled={busy || !draft.namePtbr.trim() || draft.disciplines.length === 0}>{busy ? <RefreshCw className="spin" size={16} /> : <Save size={16} />} Salvar</button></div>
          </form> : null}
        </div>
      </section>
    </>
  );
}
