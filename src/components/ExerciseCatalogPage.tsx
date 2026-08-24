import {
  Check,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Image as ImageIcon,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Video,
  X,
} from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import {
  useExerciseCatalog,
  useSetExerciseCatalogActive,
  useUpsertExerciseCatalogEntry,
} from '../hooks/useExerciseCatalog';
import { useCurrentStaffRole } from '../hooks/useStaffManagement';
import {
  exerciseCatalogErrorMessage,
  type ExerciseCatalogEntry,
  type ExerciseCatalogInput,
} from '../lib/exerciseCatalog';
import { formatNumber } from '../lib/format';

const PAGE_SIZE = 40;
const SPORTS = [
  { key: 'bodybuilding', label: 'Força' },
  { key: 'crossfit', label: 'CrossFit' },
] as const;

const emptyDraft: ExerciseCatalogInput = {
  id: '',
  namePtbr: '',
  nameEn: '',
  nameEs: '',
  instructionsPtbr: '',
  instructionsEn: '',
  instructionsEs: '',
  category: '',
  equipment: '',
  primaryMuscles: [],
  secondaryMuscles: [],
  difficulty: '',
  force: '',
  mechanic: '',
  grips: [],
  videoUrl: '',
  thumbUrl: '',
  sports: ['bodybuilding', 'crossfit'],
  active: true,
};

function csv(value: string): string[] {
  return [...new Set(value.split(',').map((item) => item.trim()).filter(Boolean))];
}

function sourceLabel(source: string): string {
  return source === 'staff' ? 'OnlyFit' : source === 'musclewiki' ? 'MuscleWiki' : source;
}

export function ExerciseCatalogPage() {
  const role = useCurrentStaffRole();
  const canGovern = role.data === 'admin' || role.data === 'super_admin';
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [sport, setSport] = useState<'all' | 'bodybuilding' | 'crossfit'>('all');
  const [page, setPage] = useState(0);
  const [draft, setDraft] = useState<ExerciseCatalogInput | null>(null);

  const filters = useMemo(() => ({
    search,
    active: status === 'all' ? null : status === 'active',
    sport: sport === 'all' ? null : sport,
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
  }), [page, search, sport, status]);

  const query = useExerciseCatalog(filters);
  const upsert = useUpsertExerciseCatalogEntry();
  const setActive = useSetExerciseCatalogActive();
  const items = query.data?.items ?? [];
  const total = query.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const busy = upsert.isPending || setActive.isPending;
  const failure = upsert.error ?? setActive.error;

  function openNew() {
    setDraft({ ...emptyDraft, sports: [...emptyDraft.sports] });
    upsert.reset();
    setActive.reset();
  }

  function openEdit(entry: ExerciseCatalogEntry) {
    setDraft({
      id: entry.id,
      namePtbr: entry.namePtbr,
      nameEn: entry.nameEn,
      nameEs: entry.nameEs,
      instructionsPtbr: entry.instructionsPtbr,
      instructionsEn: entry.instructionsEn,
      instructionsEs: entry.instructionsEs,
      category: entry.category,
      equipment: entry.equipment,
      primaryMuscles: [...entry.primaryMuscles],
      secondaryMuscles: [...entry.secondaryMuscles],
      difficulty: entry.difficulty,
      force: entry.force,
      mechanic: entry.mechanic,
      grips: [...entry.grips],
      videoUrl: entry.videoUrl,
      thumbUrl: entry.thumbUrl,
      sports: [...entry.sports],
      active: entry.active,
    });
    upsert.reset();
    setActive.reset();
  }

  function patch(values: Partial<ExerciseCatalogInput>) {
    setDraft((current) => current ? { ...current, ...values } : current);
  }

  function toggleSport(key: string) {
    setDraft((current) => {
      if (!current) return current;
      const sports = current.sports.includes(key)
        ? current.sports.filter((item) => item !== key)
        : [...current.sports, key];
      return { ...current, sports };
    });
  }

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    setPage(0);
    setSearch(searchInput.trim());
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft || !canGovern || !draft.namePtbr.trim() || !draft.nameEn.trim() || draft.sports.length === 0) return;
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
          <h1>Exercícios</h1>
        </div>
        <div className="pcat-row-actions">
          {canGovern ? (
            <button className="button primary" type="button" onClick={openNew} disabled={busy}>
              <Plus size={16} /> Novo exercício
            </button>
          ) : null}
          <button className="button secondary" type="button" onClick={() => void query.refetch()} disabled={query.isFetching}>
            <RefreshCw className={query.isFetching ? 'spin' : ''} size={16} /> Atualizar
          </button>
        </div>
      </header>

      <section className="content pcat-page exercise-catalog-page">
        <div className="pcat-summary">
          <span><strong>{formatNumber(total)}</strong> neste filtro</span>
          <span><strong>{formatNumber(items.filter((item) => item.active).length)}</strong> disponíveis na página</span>
          <span><strong>{formatNumber(items.reduce((sum, item) => sum + item.inUseCount, 0))}</strong> usos na página</span>
        </div>

        <form className="exercise-catalog-filters" onSubmit={submitSearch}>
          <label className="pcat-field exercise-catalog-search">
            <span>Buscar</span>
            <div>
              <Search size={16} aria-hidden="true" />
              <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Nome, equipamento ou origem" />
            </div>
          </label>
          <label className="pcat-field">
            <span>Situação</span>
            <select value={status} onChange={(event) => { setStatus(event.target.value as typeof status); setPage(0); }}>
              <option value="all">Todos</option>
              <option value="active">Disponíveis</option>
              <option value="inactive">Fora da escolha</option>
            </select>
          </label>
          <label className="pcat-field">
            <span>Modalidade</span>
            <select value={sport} onChange={(event) => { setSport(event.target.value as typeof sport); setPage(0); }}>
              <option value="all">Todas</option>
              <option value="bodybuilding">Força</option>
              <option value="crossfit">CrossFit</option>
            </select>
          </label>
          <button className="button secondary" type="submit"><Search size={16} /> Buscar</button>
        </form>

        {failure ? <p className="form-error" role="alert">{exerciseCatalogErrorMessage(failure)}</p> : null}
        {query.isError ? <p className="form-error" role="alert">Não foi possível carregar a biblioteca de exercícios.</p> : null}

        <div className={draft ? 'pcat-workspace exercise-catalog-workspace has-editor' : 'pcat-workspace exercise-catalog-workspace'}>
          <div className="pcat-list-panel">
            {query.isLoading ? (
              <div className="exercise-catalog-skeleton" aria-label="Carregando exercícios" aria-busy="true">
                {Array.from({ length: 6 }, (_, index) => <span key={index} />)}
              </div>
            ) : null}

            {!query.isLoading && items.length === 0 ? (
              <div className="pcat-empty">
                <Dumbbell size={26} />
                <strong>Nenhum exercício neste filtro</strong>
              </div>
            ) : null}

            {items.length > 0 ? (
              <ul className="pcat-list">
                {items.map((entry) => (
                  <li className={entry.active ? 'pcat-row exercise-catalog-row' : 'pcat-row exercise-catalog-row inactive'} key={entry.id}>
                    <span className="exercise-catalog-thumb">
                      {entry.thumbUrl ? <img src={entry.thumbUrl} alt="" loading="lazy" /> : <Dumbbell size={20} />}
                    </span>
                    <div className="pcat-row-main">
                      <div>
                        <strong>{entry.namePtbr}</strong>
                        <code>{sourceLabel(entry.source)} · {entry.sourceId}</code>
                      </div>
                      <span className={entry.active ? 'pcat-status active' : 'pcat-status'}>
                        {entry.active ? 'Disponível' : 'Fora'}
                      </span>
                      <span className="pcat-muted">
                        {entry.sports.map((key) => SPORTS.find((item) => item.key === key)?.label ?? key).join(' · ')}
                        {entry.category ? ` · ${entry.category}` : ''}
                        {entry.equipment ? ` · ${entry.equipment}` : ''}
                        {` · ${formatNumber(entry.inUseCount)} usos`}
                      </span>
                    </div>
                    {canGovern ? (
                      <div className="pcat-row-actions">
                        <button className="button secondary compact" type="button" onClick={() => openEdit(entry)} disabled={busy}>
                          <Pencil size={14} /> Editar
                        </button>
                        <button
                          className={entry.active ? 'button danger compact' : 'button primary compact'}
                          type="button"
                          disabled={busy}
                          onClick={() => setActive.mutate({ id: entry.id, active: !entry.active })}
                        >
                          {entry.active ? <X size={14} /> : <Check size={14} />}
                          {entry.active ? 'Despublicar' : 'Publicar'}
                        </button>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}

            {total > 0 ? (
              <footer className="exercise-catalog-pagination">
                <span>{formatNumber(first)}–{formatNumber(last)} de {formatNumber(total)}</span>
                <div>
                  <button className="button secondary compact" type="button" disabled={page === 0} onClick={() => setPage((value) => value - 1)} aria-label="Página anterior"><ChevronLeft size={15} /></button>
                  <span>{page + 1} / {pageCount}</span>
                  <button className="button secondary compact" type="button" disabled={page + 1 >= pageCount} onClick={() => setPage((value) => value + 1)} aria-label="Próxima página"><ChevronRight size={15} /></button>
                </div>
              </footer>
            ) : null}
          </div>

          {draft ? (
            <form className="pcat-editor exercise-catalog-editor" onSubmit={submit}>
              <h2 className="pcat-section-heading">{draft.id ? 'Editar exercício' : 'Novo exercício'}</h2>

              <section className="exercise-editor-section">
                <h3>Identificação</h3>
                <label className="pcat-field"><span>Nome em português</span><input autoFocus required maxLength={120} value={draft.namePtbr} onChange={(event) => patch({ namePtbr: event.target.value })} /></label>
                <label className="pcat-field"><span>Nome em inglês</span><input required maxLength={120} value={draft.nameEn} onChange={(event) => patch({ nameEn: event.target.value })} /></label>
                <label className="pcat-field"><span>Nome em espanhol</span><input maxLength={120} value={draft.nameEs} onChange={(event) => patch({ nameEs: event.target.value })} /></label>
              </section>

              <section className="exercise-editor-section">
                <h3>Aplicação</h3>
                <div className="pcat-field">
                  <span>Modalidades</span>
                  <div className="pcat-sport-picker">
                    {SPORTS.map((option) => (
                      <button key={option.key} type="button" aria-pressed={draft.sports.includes(option.key)} className={draft.sports.includes(option.key) ? 'selected' : ''} onClick={() => toggleSport(option.key)}>{option.label}</button>
                    ))}
                  </div>
                </div>
                <div className="exercise-editor-grid">
                  <label className="pcat-field"><span>Categoria</span><input value={draft.category} onChange={(event) => patch({ category: event.target.value })} /></label>
                  <label className="pcat-field"><span>Equipamento</span><input value={draft.equipment} onChange={(event) => patch({ equipment: event.target.value })} /></label>
                </div>
                <label className="pcat-field"><span>Músculos principais</span><input value={draft.primaryMuscles.join(', ')} onChange={(event) => patch({ primaryMuscles: csv(event.target.value) })} /></label>
                <label className="pcat-field"><span>Músculos secundários</span><input value={draft.secondaryMuscles.join(', ')} onChange={(event) => patch({ secondaryMuscles: csv(event.target.value) })} /></label>
              </section>

              <section className="exercise-editor-section">
                <h3>Instruções</h3>
                <label className="pcat-field"><span>Português</span><textarea rows={4} maxLength={10000} value={draft.instructionsPtbr} onChange={(event) => patch({ instructionsPtbr: event.target.value })} /></label>
                <label className="pcat-field"><span>Inglês</span><textarea rows={4} maxLength={10000} value={draft.instructionsEn} onChange={(event) => patch({ instructionsEn: event.target.value })} /></label>
                <label className="pcat-field"><span>Espanhol</span><textarea rows={4} maxLength={10000} value={draft.instructionsEs} onChange={(event) => patch({ instructionsEs: event.target.value })} /></label>
              </section>

              <section className="exercise-editor-section">
                <h3>Mídia</h3>
                <label className="pcat-field"><span>URL da miniatura</span><input type="url" inputMode="url" value={draft.thumbUrl} onChange={(event) => patch({ thumbUrl: event.target.value })} /></label>
                <label className="pcat-field"><span>URL do vídeo</span><input type="url" inputMode="url" value={draft.videoUrl} onChange={(event) => patch({ videoUrl: event.target.value })} /></label>
                {draft.thumbUrl || draft.videoUrl ? (
                  <div className="exercise-media-preview">
                    {draft.thumbUrl ? <img src={draft.thumbUrl} alt="Prévia da miniatura" /> : <span><ImageIcon size={20} /> Sem miniatura</span>}
                    {draft.videoUrl ? <video src={draft.videoUrl} controls preload="metadata" /> : <span><Video size={20} /> Sem vídeo</span>}
                  </div>
                ) : null}
              </section>

              <section className="exercise-editor-section">
                <h3>Biomecânica</h3>
                <div className="exercise-editor-grid">
                  <label className="pcat-field"><span>Dificuldade</span><input value={draft.difficulty} onChange={(event) => patch({ difficulty: event.target.value })} /></label>
                  <label className="pcat-field"><span>Força</span><input value={draft.force} onChange={(event) => patch({ force: event.target.value })} /></label>
                  <label className="pcat-field"><span>Mecânica</span><input value={draft.mechanic} onChange={(event) => patch({ mechanic: event.target.value })} /></label>
                  <label className="pcat-field"><span>Pegadas</span><input value={draft.grips.join(', ')} onChange={(event) => patch({ grips: csv(event.target.value) })} /></label>
                </div>
              </section>

              <label className="pcat-choice-field"><input type="checkbox" checked={draft.active} onChange={(event) => patch({ active: event.target.checked })} /><span>Disponível para novas escolhas</span></label>

              <div className="pcat-editor-actions">
                <button className="button secondary" type="button" onClick={() => setDraft(null)} disabled={busy}>Cancelar</button>
                <button className="button primary" type="submit" disabled={busy || !draft.namePtbr.trim() || !draft.nameEn.trim() || draft.sports.length === 0}>
                  {busy ? <RefreshCw className="spin" size={16} /> : <Save size={16} />} Salvar
                </button>
              </div>
            </form>
          ) : null}
        </div>
      </section>
    </>
  );
}
