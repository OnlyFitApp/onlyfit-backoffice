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
import { useQuery } from '@tanstack/react-query';
import { FormEvent, useMemo, useState } from 'react';
import { coreApi } from '../api/core';
import type { StaffExercise, StaffSportItem } from '../api/core.gen';
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

type Draft = {
  exerciseId: string | null;
  expectedVersion: number | null;
  sportId: string;
  kind: 'exercise' | 'technique';
  locale: string;
  name: string;
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
    sportId,
    kind: 'exercise',
    locale: 'pt-BR',
    name: '',
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
    sportId: entry.sport_id ?? '',
    kind: entry.kind,
    locale: entry.locale,
    name: entry.name,
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

function csv(value: string): string[] {
  return [...new Set(value.split(',').map((item) => item.trim()).filter(Boolean))];
}

function readKind(value: string): Draft['kind'] {
  return value === 'technique' ? 'technique' : 'exercise';
}

function useSportsCatalog() {
  return useQuery({
    queryKey: ['staff-catalog', 'sports'],
    queryFn: () => coreApi.staff.catalog({ kind: 'sports' }),
    staleTime: 60_000,
    select: (catalog) => catalog.items.filter((item): item is StaffSportItem => item.kind === 'sports'),
  });
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

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    setPage(0);
    setSearch(searchInput.trim());
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft || !canGovern || !draft.name.trim() || !draft.sportId.trim()) return;
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
        sportId: draft.sportId.trim(),
        kind: draft.kind,
        locale: draft.locale.trim(),
        name: draft.name.trim(),
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

  return <>
    <header className="page-header"><div><p className="section-label">Biblioteca da plataforma</p><h1>Exercícios</h1><p className="ohlib-lead">Catálogo oficial consumido pelos treinos do OnlyFit Core.</p></div><div className="pcat-row-actions">{canGovern ? <button className="button primary" type="button" onClick={() => setDraft(emptyDraft(defaultSport))} disabled={busy || !defaultSport}><Plus size={16} /> Novo exercício</button> : null}<button className="button secondary" type="button" onClick={() => void query.refetch()} disabled={query.isFetching}><RefreshCw className={query.isFetching ? 'spin' : ''} size={16} /> Atualizar</button></div></header>
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
          {items.length > 0 ? <ul className="pcat-list">{items.map((entry) => {
            const active = !entry.archived;
            return <li className={active ? 'pcat-row exercise-catalog-row' : 'pcat-row exercise-catalog-row inactive'} key={entry.id}>
              <span className="exercise-catalog-thumb">{entry.thumb_url ? <img src={entry.thumb_url} alt="" loading="lazy" /> : <Dumbbell size={20} />}</span>
              <div className="pcat-row-main"><div><strong>{entry.name}</strong><code>{entry.locale} · {entry.kind === 'technique' ? 'Técnica' : 'Exercício'}</code></div><span className={active ? 'pcat-status active' : 'pcat-status'}>{active ? 'Disponível' : 'Fora'}</span><span className="pcat-muted">{entry.sport_id ?? 'Sem modalidade'}{entry.equipment ? ` · ${entry.equipment}` : ''}{entry.muscles.length ? ` · ${entry.muscles.join(', ')}` : ''}</span>{(entry.thumb_url || entry.video_url) ? <span className="pcat-muted">{entry.thumb_url ? <><ImageIcon size={13} /> miniatura</> : null} {entry.video_url ? <><Video size={13} /> vídeo</> : null}</span> : null}</div>
              {canGovern && entry.version !== null ? <div className="pcat-row-actions"><button className="button secondary compact" type="button" disabled={busy} onClick={() => setDraft(draftFrom(entry))}><Pencil size={14} />Editar</button><button className={active ? 'button danger compact' : 'button primary compact'} type="button" disabled={busy} onClick={() => setActive.mutate({ exerciseId: entry.id, active: !active, expectedVersion: entry.version ?? 0 })}>{active ? <X size={14} /> : <Check size={14} />}{active ? 'Despublicar' : 'Publicar'}</button></div> : null}
            </li>;
          })}</ul> : null}
          {total > 0 ? <footer className="exercise-catalog-pagination"><span>{formatNumber(first)}–{formatNumber(last)} de {formatNumber(total)}</span><div><button className="button secondary compact" type="button" disabled={page === 0} onClick={() => setPage((value) => value - 1)} aria-label="Página anterior"><ChevronLeft size={15} /></button><span>{page + 1} / {pageCount}</span><button className="button secondary compact" type="button" disabled={page + 1 >= pageCount} onClick={() => setPage((value) => value + 1)} aria-label="Próxima página"><ChevronRight size={15} /></button></div></footer> : null}
        </div>
        {draft ? <form className="pcat-editor exercise-catalog-editor" onSubmit={submit}>
          <h2 className="pcat-section-heading">{draft.exerciseId ? 'Editar exercício oficial' : 'Novo exercício oficial'}</h2>
          <section className="exercise-editor-section"><h3>Identificação</h3><label className="pcat-field"><span>Nome</span><input autoFocus required maxLength={120} value={draft.name} onChange={(event) => patch({ name: event.target.value })} /></label><div className="exercise-editor-grid"><label className="pcat-field"><span>Idioma</span><input required value={draft.locale} onChange={(event) => patch({ locale: event.target.value })} /></label><label className="pcat-field"><span>Tipo</span><select value={draft.kind} onChange={(event) => patch({ kind: readKind(event.target.value) })}><option value="exercise">Exercício</option><option value="technique">Técnica</option></select></label></div></section>
          <section className="exercise-editor-section"><h3>Aplicação</h3><label className="pcat-field"><span>Modalidade</span><select required value={draft.sportId} onChange={(event) => patch({ sportId: event.target.value })}>{sports.data?.map((item) => <option value={item.key} key={item.key}>{item.data.label ?? item.name_key}{item.active ? '' : ' (inativa)'}</option>)}</select></label><label className="pcat-field"><span>Músculos</span><input value={draft.muscles.join(', ')} onChange={(event) => patch({ muscles: csv(event.target.value) })} placeholder="Separados por vírgula" /></label><label className="pcat-field"><span>Equipamento</span><input value={draft.equipment} onChange={(event) => patch({ equipment: event.target.value })} /></label></section>
          <section className="exercise-editor-section"><h3>Mídia</h3><MediaField kind="thumbnail" label="Miniatura" accept="image/jpeg,image/png,image/webp" url={draft.thumbUrl} replacement={draft.thumbReplacement} onSelect={(file) => patch({ thumbReplacement: file })} onRemove={() => patch({ thumbFileId: null, thumbUrl: null, thumbReplacement: null })} /><MediaField kind="video" label="Vídeo" accept="video/mp4,video/webm,video/quicktime" url={draft.videoUrl} replacement={draft.videoReplacement} onSelect={(file) => patch({ videoReplacement: file })} onRemove={() => patch({ videoFileId: null, videoUrl: null, videoReplacement: null })} /></section>
          <div className="pcat-editor-actions"><button className="button secondary" type="button" onClick={() => setDraft(null)} disabled={busy}>Cancelar</button><button className="button primary" type="submit" disabled={busy || !draft.name.trim() || !draft.sportId.trim()}>{busy ? <RefreshCw className="spin" size={16} /> : <Save size={16} />} Salvar</button></div>
        </form> : null}
      </div>
    </section>
  </>;
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
