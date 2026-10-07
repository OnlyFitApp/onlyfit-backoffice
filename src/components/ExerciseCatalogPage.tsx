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
  Trash2,
  Video,
  X,
} from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { useSportsCatalog } from '../hooks/useSportsCatalog';
import type { StaffExercise, StaffSportItem, TrainingExerciseLocalization } from '../api/core.gen';
import {
  useExerciseCatalog,
  useSaveExerciseCatalogEntry,
  useSetExerciseCatalogActive,
  useUploadExerciseMedia,
} from '../hooks/useExerciseCatalog';
import { useCurrentStaffRole } from '../hooks/useStaffManagement';
import { exerciseCatalogErrorMessage } from '../lib/exerciseCatalog';
import { formatNumber } from '../lib/format';

const PAGE_SIZE = 40;
const localeOptions: ReadonlyArray<{ value: TrainingExerciseLocalization['locale']; label: string }> = [
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'en-US', label: 'Inglês (EUA)' },
  { value: 'es', label: 'Espanhol' },
];

type Draft = {
  exerciseId: string | null;
  expectedVersion: number | null;
  sportIds: string[];
  kind: StaffExercise['kind'];
  visibility: StaffExercise['visibility'];
  localizations: TrainingExerciseLocalization[];
  muscles: string[];
  equipment: string;
  videoFileId: string | null;
  thumbFileId: string | null;
  videoUrl: string | null;
  thumbUrl: string | null;
  videoReplacement: File | null;
  thumbReplacement: File | null;
};

function emptyDraft(sportId: string): Draft {
  return {
    exerciseId: null,
    expectedVersion: null,
    sportIds: sportId ? [sportId] : [],
    kind: 'exercise',
    visibility: 'public',
    localizations: [{ locale: 'pt-BR', name: '', instructions: null }],
    muscles: [],
    equipment: '',
    videoFileId: null,
    thumbFileId: null,
    videoUrl: null,
    thumbUrl: null,
    videoReplacement: null,
    thumbReplacement: null,
  };
}

function draftFrom(entry: StaffExercise): Draft {
  return {
    exerciseId: entry.id,
    expectedVersion: entry.version,
    sportIds: [...entry.sport_ids],
    kind: entry.kind,
    visibility: entry.visibility,
    localizations: entry.localizations.map((localization) => ({ ...localization })),
    muscles: [...entry.muscles],
    equipment: entry.equipment ?? '',
    videoFileId: entry.video_file_id,
    thumbFileId: entry.thumb_file_id,
    videoUrl: entry.video_url,
    thumbUrl: entry.thumb_url,
    videoReplacement: null,
    thumbReplacement: null,
  };
}

function commaSeparatedValues(value: string): string[] {
  return [...new Set(value.split(',').map((item) => item.trim()).filter(Boolean))];
}

function readKind(value: string): Draft['kind'] {
  return value === 'technique' ? 'technique' : 'exercise';
}

export function ExerciseCatalogPage() {
  const role = useCurrentStaffRole();
  const canGovern = role.data === 'admin' || role.data === 'super_admin';
  const sports = useSportsCatalog();
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [sport, setSport] = useState('');
  const [kind, setKind] = useState<'' | Draft['kind']>('');
  const [page, setPage] = useState(0);
  const [draft, setDraft] = useState<Draft | null>(null);

  const filters = useMemo(() => ({
    query: search || undefined,
    status,
    sport: sport || undefined,
    kind: kind || undefined,
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
  }), [kind, page, search, sport, status]);

  const query = useExerciseCatalog(filters);
  const save = useSaveExerciseCatalogEntry();
  const upload = useUploadExerciseMedia();
  const setActive = useSetExerciseCatalogActive();
  const items = query.data?.items ?? [];
  const total = query.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const busy = save.isPending || upload.isPending || setActive.isPending;
  const failure = save.error ?? upload.error ?? setActive.error;

  function patch(values: Partial<Draft>) {
    setDraft((current) => current ? { ...current, ...values } : current);
  }

  function toggleSport(sportId: string) {
    setDraft((current) => {
      if (!current) return current;
      const sportIds = current.sportIds.includes(sportId)
        ? current.sportIds.filter((id) => id !== sportId)
        : [...current.sportIds, sportId];
      return { ...current, sportIds };
    });
  }

  function updateLocalization(index: number, values: Partial<TrainingExerciseLocalization>) {
    setDraft((current) => current ? {
      ...current,
      localizations: current.localizations.map((item, position) =>
        position === index ? { ...item, ...values } : item),
    } : current);
  }

  function addLocalization() {
    setDraft((current) => {
      if (!current || current.localizations.length >= localeOptions.length) return current;
      const locale = localeOptions.find((option) =>
        !current.localizations.some((item) => item.locale === option.value))?.value;
      if (!locale) return current;
      return {
        ...current,
        localizations: [...current.localizations, { locale, name: '', instructions: null }],
      };
    });
  }

  function removeLocalization(index: number) {
    setDraft((current) => current && current.localizations.length > 1 ? {
      ...current,
      localizations: current.localizations.filter((_, position) => position !== index),
    } : current);
  }

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    setPage(0);
    setSearch(searchInput.trim());
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft || !canGovern || draft.sportIds.length === 0) return;
    const localizations = draft.localizations.map((item) => ({
      locale: item.locale,
      name: item.name.trim(),
      instructions: item.instructions?.trim() || null,
    }));
    if (localizations.some((item) => item.name.length < 2)) return;

    let videoFileId = draft.videoFileId;
    let thumbFileId = draft.thumbFileId;
    let videoUrl = draft.videoUrl;
    let thumbUrl = draft.thumbUrl;
    try {
      if (draft.videoReplacement) {
        const ready = await upload.mutateAsync({ file: draft.videoReplacement, kind: 'video' });
        videoFileId = ready.file_id;
        videoUrl = ready.public_url;
      }
      if (draft.thumbReplacement) {
        const ready = await upload.mutateAsync({ file: draft.thumbReplacement, kind: 'thumbnail' });
        thumbFileId = ready.file_id;
        thumbUrl = ready.public_url;
      }
      await save.mutateAsync({
        exerciseId: draft.exerciseId,
        sportIds: draft.sportIds,
        kind: draft.kind,
        localizations,
        muscles: draft.muscles,
        equipment: draft.equipment.trim() || null,
        videoFileId,
        thumbFileId,
        expectedVersion: draft.expectedVersion,
      });
      setDraft(null);
    } catch {
      setDraft((current) => current ? {
        ...current,
        videoFileId,
        thumbFileId,
        videoUrl,
        thumbUrl,
        videoReplacement: videoFileId !== draft.videoFileId ? null : current.videoReplacement,
        thumbReplacement: thumbFileId !== draft.thumbFileId ? null : current.thumbReplacement,
      } : current);
    }
  }

  const first = total === 0 ? 0 : page * PAGE_SIZE + 1;
  const last = Math.min(total, (page + 1) * PAGE_SIZE);
  const defaultSport = sports.data?.find((item) => item.active)?.key ?? '';
  const draftIsValid = Boolean(
    draft
      && draft.sportIds.length
      && draft.localizations.length
      && draft.sportIds.length <= 20
      && draft.localizations.every((item) => item.name.trim().length >= 2),
  );

  return <>
    <header className="page-header">
      <div><p className="section-label">Biblioteca da plataforma</p><h1>Exercícios</h1><p className="ohlib-lead">Catálogo oficial consumido pelos treinos do OnlyFit Core.</p></div>
      <div className="pcat-row-actions">{canGovern ? <button className="button primary" type="button" onClick={() => setDraft(emptyDraft(defaultSport))} disabled={busy || !defaultSport}><Plus size={16} /> Novo exercício</button> : null}<button className="button secondary" type="button" onClick={() => void query.refetch()} disabled={query.isFetching}><RefreshCw className={query.isFetching ? 'spin' : ''} size={16} /> Atualizar</button></div>
    </header>
    <section className="content pcat-page exercise-catalog-page">
      <div className="pcat-summary"><span><strong>{formatNumber(total)}</strong> neste filtro</span><span><strong>{formatNumber(items.filter((item) => !item.archived).length)}</strong> disponíveis nesta página</span></div>
      <form className="exercise-catalog-filters" onSubmit={submitSearch}>
        <label className="pcat-field exercise-catalog-search"><span>Buscar</span><div><Search size={16} aria-hidden="true" /><input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Nome, músculo ou equipamento" /></div></label>
        <label className="pcat-field"><span>Situação</span><select value={status} onChange={(event) => { const value = event.target.value; setStatus(value === 'active' || value === 'inactive' ? value : 'all'); setPage(0); }}><option value="all">Todos</option><option value="active">Disponíveis</option><option value="inactive">Fora da escolha</option></select></label>
        <label className="pcat-field"><span>Tipo</span><select value={kind} onChange={(event) => { const value = event.target.value; setKind(value === '' ? '' : readKind(value)); setPage(0); }}><option value="">Todos</option><option value="exercise">Exercícios</option><option value="technique">Técnicas</option></select></label>
        <label className="pcat-field"><span>Modalidade</span><select value={sport} onChange={(event) => { setSport(event.target.value); setPage(0); }}><option value="">Todas</option>{sports.data?.map((item) => <option value={item.key} key={item.key}>{item.data.label ?? item.name_key}</option>)}</select></label>
        <button className="button secondary" type="submit"><Search size={16} /> Buscar</button>
      </form>
      {failure ? <p className="form-error" role="alert">{exerciseCatalogErrorMessage(failure)}</p> : null}
      {query.isError || sports.isError ? <p className="form-error" role="alert">Não foi possível carregar a biblioteca de exercícios.</p> : null}
      <div className={draft ? 'pcat-workspace exercise-catalog-workspace has-editor' : 'pcat-workspace exercise-catalog-workspace'}>
        <div className="pcat-list-panel">
          {query.isLoading ? <div className="exercise-catalog-skeleton" aria-label="Carregando exercícios" aria-busy="true">{Array.from({ length: 6 }, (_, index) => <span key={index} />)}</div> : null}
          {!query.isLoading && items.length === 0 ? <div className="pcat-empty"><Dumbbell size={26} /><strong>Nenhum exercício neste filtro</strong></div> : null}
          {items.length > 0 ? <ul className="pcat-list">{items.map((entry) => <ExerciseRow key={entry.id} entry={entry} busy={busy} canGovern={canGovern} onEdit={() => setDraft(draftFrom(entry))} onSetActive={(active) => entry.version !== null && setActive.mutate({ exerciseId: entry.id, active, expectedVersion: entry.version })} />)}</ul> : null}
          {total > 0 ? <footer className="exercise-catalog-pagination"><span>{formatNumber(first)}–{formatNumber(last)} de {formatNumber(total)}</span><div><button className="button secondary compact" type="button" disabled={page === 0} onClick={() => setPage((value) => value - 1)} aria-label="Página anterior"><ChevronLeft size={15} /></button><span>{page + 1} / {pageCount}</span><button className="button secondary compact" type="button" disabled={page + 1 >= pageCount} onClick={() => setPage((value) => value + 1)} aria-label="Próxima página"><ChevronRight size={15} /></button></div></footer> : null}
        </div>
        {draft ? <ExerciseEditor draft={draft} sports={sports.data ?? []} busy={busy} valid={draftIsValid} onPatch={patch} onToggleSport={toggleSport} onUpdateLocalization={updateLocalization} onAddLocalization={addLocalization} onRemoveLocalization={removeLocalization} onCancel={() => setDraft(null)} onSubmit={submit} /> : null}
      </div>
    </section>
  </>;
}

function ExerciseRow({ entry, busy, canGovern, onEdit, onSetActive }: {
  entry: StaffExercise;
  busy: boolean;
  canGovern: boolean;
  onEdit: () => void;
  onSetActive: (active: boolean) => void;
}) {
  const active = !entry.archived;
  return <li className={active ? 'pcat-row exercise-catalog-row' : 'pcat-row exercise-catalog-row inactive'}>
    <span className="exercise-catalog-thumb">{entry.thumb_url ? <img src={entry.thumb_url} alt="" loading="lazy" /> : <Dumbbell size={20} />}</span>
    <div className="pcat-row-main"><div><strong>{entry.name}</strong><code>{entry.localizations.map((item) => item.locale).join(' · ')} · {entry.kind === 'technique' ? 'Técnica' : 'Exercício'}</code></div><span className={active ? 'pcat-status active' : 'pcat-status'}>{active ? 'Disponível' : 'Fora'}</span><span className="pcat-muted">{entry.sport_ids.length ? entry.sport_ids.join(' · ') : 'Sem modalidade'}{entry.equipment ? ` · ${entry.equipment}` : ''}{entry.muscles.length ? ` · ${entry.muscles.join(', ')}` : ''}</span><span className="pcat-muted">Visibilidade: {entry.visibility === 'public' ? 'pública' : entry.visibility}</span>{(entry.thumb_url || entry.video_url) ? <span className="pcat-muted">{entry.thumb_url ? <><ImageIcon size={13} /> miniatura</> : null} {entry.video_url ? <><Video size={13} /> vídeo</> : null}</span> : null}</div>
    {canGovern && entry.version !== null ? <div className="pcat-row-actions"><button className="button secondary compact" type="button" disabled={busy} onClick={onEdit}><Pencil size={14} />Editar</button><button className={active ? 'button danger compact' : 'button primary compact'} type="button" disabled={busy} onClick={() => onSetActive(!active)}>{active ? <X size={14} /> : <Check size={14} />}{active ? 'Despublicar' : 'Publicar'}</button></div> : null}
  </li>;
}

function ExerciseEditor({ draft, sports, busy, valid, onPatch, onToggleSport, onUpdateLocalization, onAddLocalization, onRemoveLocalization, onCancel, onSubmit }: {
  draft: Draft;
  sports: StaffSportItem[];
  busy: boolean;
  valid: boolean;
  onPatch: (values: Partial<Draft>) => void;
  onToggleSport: (sportId: string) => void;
  onUpdateLocalization: (index: number, values: Partial<TrainingExerciseLocalization>) => void;
  onAddLocalization: () => void;
  onRemoveLocalization: (index: number) => void;
  onCancel: () => void;
  onSubmit: (event: FormEvent) => Promise<void>;
}) {
  return <form className="pcat-editor exercise-catalog-editor" onSubmit={onSubmit}>
    <h2 className="pcat-section-heading">{draft.exerciseId ? 'Editar exercício oficial' : 'Novo exercício oficial'}</h2>
    <section className="exercise-editor-section"><h3>Identificação</h3><label className="pcat-field"><span>Tipo</span><select value={draft.kind} onChange={(event) => onPatch({ kind: readKind(event.target.value) })}><option value="exercise">Exercício</option><option value="technique">Técnica</option></select></label><label className="pcat-field"><span>Visibilidade</span><input value={draft.visibility === 'public' ? 'Pública' : draft.visibility} readOnly /><small>Conteúdo oficial é público por definição do contrato.</small></label>{draft.localizations.map((localization, index) => <div className="exercise-localization" key={localization.locale}><div className="exercise-editor-grid"><label className="pcat-field"><span>Idioma</span><select value={localization.locale} onChange={(event) => onUpdateLocalization(index, { locale: event.target.value === 'en-US' ? 'en-US' : event.target.value === 'es' ? 'es' : 'pt-BR' })}>{localeOptions.map((option) => <option key={option.value} value={option.value} disabled={draft.localizations.some((item, position) => position !== index && item.locale === option.value)}>{option.label}</option>)}</select></label><label className="pcat-field"><span>Nome</span><input autoFocus={index === 0} required minLength={2} maxLength={120} value={localization.name} onChange={(event) => onUpdateLocalization(index, { name: event.target.value })} /></label></div><label className="pcat-field"><span>Instruções</span><textarea rows={4} maxLength={20000} value={localization.instructions ?? ''} onChange={(event) => onUpdateLocalization(index, { instructions: event.target.value || null })} /></label><button className="button danger compact" type="button" disabled={draft.localizations.length === 1} onClick={() => onRemoveLocalization(index)}><Trash2 size={14} />Remover idioma</button></div>)}<button className="button secondary compact" type="button" disabled={draft.localizations.length >= localeOptions.length} onClick={onAddLocalization}><Plus size={14} />Idioma</button></section>
    <section className="exercise-editor-section"><h3>Aplicação</h3><fieldset className="pcat-field"><legend>Modalidades</legend><div className="exercise-sports">{sports.map((item) => <label className="ohlib-check compact" key={item.key}><input type="checkbox" checked={draft.sportIds.includes(item.key)} disabled={(!item.active || draft.sportIds.length >= 20) && !draft.sportIds.includes(item.key)} onChange={() => onToggleSport(item.key)} /><span>{item.data.label ?? item.name_key}{item.active ? '' : ' (inativa)'}</span></label>)}</div></fieldset><label className="pcat-field"><span>Músculos</span><input value={draft.muscles.join(', ')} onChange={(event) => onPatch({ muscles: commaSeparatedValues(event.target.value) })} placeholder="Separados por vírgula" /></label><label className="pcat-field"><span>Equipamento</span><input value={draft.equipment} onChange={(event) => onPatch({ equipment: event.target.value })} /></label></section>
    <section className="exercise-editor-section"><h3>Mídia</h3><MediaField kind="thumbnail" label="Miniatura" accept="image/jpeg,image/png,image/webp" url={draft.thumbUrl} replacement={draft.thumbReplacement} onSelect={(file) => onPatch({ thumbReplacement: file })} onRemove={() => onPatch({ thumbFileId: null, thumbUrl: null, thumbReplacement: null })} /><MediaField kind="video" label="Vídeo" accept="video/mp4,video/webm,video/quicktime" url={draft.videoUrl} replacement={draft.videoReplacement} onSelect={(file) => onPatch({ videoReplacement: file })} onRemove={() => onPatch({ videoFileId: null, videoUrl: null, videoReplacement: null })} /></section>
    <div className="pcat-editor-actions"><button className="button secondary" type="button" onClick={onCancel} disabled={busy}>Cancelar</button><button className="button primary" type="submit" disabled={busy || !valid}>{busy ? <RefreshCw className="spin" size={16} /> : <Save size={16} />} Salvar</button></div>
  </form>;
}

function MediaField({ kind, label, accept, url, replacement, onSelect, onRemove }: {
  kind: 'video' | 'thumbnail';
  label: string;
  accept: string;
  url: string | null;
  replacement: File | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
}) {
  return <div className="pcat-field"><span>{label}</span>{url ? kind === 'video' ? <video src={url} controls preload="metadata" /> : <img src={url} alt="Miniatura atual" /> : <small>Sem arquivo atual</small>}{replacement ? <small>Novo arquivo: {replacement.name}</small> : null}<input type="file" accept={accept} onChange={(event) => { const file = event.target.files?.[0]; if (file) onSelect(file); }} /><button className="button danger compact" type="button" disabled={!url && !replacement} onClick={onRemove}><Trash2 size={14} />Remover {label.toLowerCase()}</button></div>;
}
