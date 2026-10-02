import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  HeartPulse,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  Utensils,
  X,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import type {
  NutritionDietItemInput,
  NutritionDietMealInput,
  ProfessionalWorkoutStepSaveInput,
  StaffHealthDietPayload,
  StaffHealthLibraryItem,
  StaffHealthProgramPayload,
  StaffHealthWorkout,
  StaffHealthWorkoutPayload,
  StrengthPrescription,
} from '../api/core.gen';
import { useExerciseCatalog } from '../hooks/useExerciseCatalog';
import {
  useOnlyFitHealthCatalog,
  useSaveDiet,
  useSaveProgram,
  useSaveWorkout,
  useSetLibraryActive,
} from '../hooks/useOnlyFitHealthLibrary';
import { useCurrentStaffRole } from '../hooks/useStaffManagement';
import { useUnsavedWarning } from '../hooks/useUnsavedWarning';
import { libraryErrorMessage, type LibraryKind } from '../lib/onlyfitHealthLibrary';
import { ProtocolCatalogPage } from './ProtocolCatalogPage';

type Tab = LibraryKind | 'protocols';
type EditorState =
  | { kind: 'workout'; id: string | null; expectedVersion: number | null; payload: StaffHealthWorkoutPayload }
  | { kind: 'diet'; id: string | null; expectedVersion: number | null; payload: StaffHealthDietPayload }
  | { kind: 'program'; id: string | null; expectedVersion: number | null; payload: StaffHealthProgramPayload };

const PAGE_SIZE = 25;
const commaSeparatedValues = (value: string): string[] =>
  [...new Set(value.split(',').map((item) => item.trim()).filter(Boolean))];

const tabs: Array<{ id: Tab; label: string; description: string; icon: typeof Dumbbell }> = [
  { id: 'workout', label: 'Treinos', description: 'Sessões e exercícios', icon: Dumbbell },
  { id: 'program', label: 'Programas', description: 'Semanas e dias', icon: BookOpen },
  { id: 'diet', label: 'Nutrição e dietas', description: 'Refeições e alimentos', icon: Utensils },
  { id: 'protocols', label: 'Protocolos', description: 'Hábitos e rotinas', icon: HeartPulse },
];

function newEditor(kind: LibraryKind): EditorState {
  if (kind === 'workout') return {
    kind,
    id: null,
    expectedVersion: null,
    payload: { kind, title: '', sport_id: 'strength', notes: '', steps: [] },
  };
  if (kind === 'diet') return {
    kind,
    id: null,
    expectedVersion: null,
    payload: { kind, title: '', objective: '', meals: [] },
  };
  return {
    kind,
    id: null,
    expectedVersion: null,
    payload: {
      kind,
      title: '',
      description: '',
      estimated_minutes_per_week: null,
      equipment: [],
      sport_id: 'strength',
      weeks: 4,
      days: [],
    },
  };
}

function editorFrom(item: StaffHealthLibraryItem): EditorState {
  if (item.kind === 'workout') return {
    kind: item.kind,
    id: item.id,
    expectedVersion: item.version,
    payload: {
      kind: item.kind,
      title: item.title,
      sport_id: item.sport_id,
      notes: item.detail.notes,
      steps: item.detail.steps.map((step) => ({
        id: step.id,
        exercise_id: step.exercise?.id ?? null,
        title: step.title,
        prescription: step.prescription,
      })),
    },
  };
  if (item.kind === 'diet') return {
    kind: item.kind,
    id: item.id,
    expectedVersion: item.version,
    payload: {
      kind: item.kind,
      title: item.title,
      objective: item.detail.objective,
      meals: item.detail.meals.map((meal) => ({
        id: meal.id,
        title: meal.title,
        time: meal.time,
        critical: meal.critical,
        items: meal.items.map((food) => ({
          id: food.id,
          food_id: food.food_id,
          name: food.name,
          quantity_g: food.quantity_g,
          quantity_value: food.quantity_value,
          unit: food.unit,
          kcal: food.kcal,
          protein_g: food.protein_g,
          carbs_g: food.carbs_g,
          fat_g: food.fat_g,
          fiber_g: food.fiber_g,
          notes: food.notes,
        })),
      })),
    },
  };
  return {
    kind: item.kind,
    id: item.id,
    expectedVersion: item.version,
    payload: {
      kind: item.kind,
      title: item.title,
      description: item.detail.description,
      estimated_minutes_per_week: item.detail.estimated_minutes_per_week,
      equipment: [...item.detail.equipment],
      sport_id: item.sport_id,
      weeks: item.detail.weeks,
      days: item.detail.days,
    },
  };
}

function itemSummary(item: StaffHealthLibraryItem): string {
  if (item.kind === 'workout') return `${item.detail.steps.length} exercício(s) · ${item.sport_id}`;
  if (item.kind === 'diet') return `${item.detail.meals.length} refeição(ões)`;
  return `${item.detail.weeks} semana(s) · ${item.detail.days.length} dia(s)`;
}

function ManagedCatalog({ kind }: { kind: LibraryKind }) {
  const role = useCurrentStaffRole();
  const canGovern = role.data === 'admin' || role.data === 'super_admin';
  const [search, setSearch] = useState('');
  const [sport, setSport] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(0);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const query = useOnlyFitHealthCatalog(kind, search, sport, status, PAGE_SIZE, page * PAGE_SIZE);
  const workoutSave = useSaveWorkout();
  const dietSave = useSaveDiet();
  const programSave = useSaveProgram();
  const setActive = useSetLibraryActive();
  useUnsavedWarning(Boolean(editor));

  const mutation = kind === 'workout' ? workoutSave : kind === 'diet' ? dietSave : programSave;
  const busy = mutation.isPending || setActive.isPending;
  const items = (query.data?.items ?? []).filter((item) => item.kind === kind);
  const total = query.data?.total ?? 0;
  const remoteError = mutation.error ?? setActive.error;

  async function save(state: EditorState) {
    if (state.kind === 'workout') await workoutSave.mutateAsync({ id: state.id, expectedVersion: state.expectedVersion, payload: state.payload });
    else if (state.kind === 'diet') await dietSave.mutateAsync({ id: state.id, expectedVersion: state.expectedVersion, payload: state.payload });
    else await programSave.mutateAsync({ id: state.id, expectedVersion: state.expectedVersion, payload: state.payload });
    setEditor(null);
  }

  return (
    <section className="ohlib-catalog">
      <div className="ohlib-toolbar">
        <label className="ohlib-search"><Search size={17} /><input aria-label="Buscar" value={search} onChange={(event) => { setSearch(event.target.value); setPage(0); }} placeholder="Buscar por título" /></label>
        {kind !== 'diet' ? <input aria-label="Filtrar modalidade" value={sport} onChange={(event) => { setSport(event.target.value); setPage(0); }} placeholder="Modalidade" /> : null}
        <select aria-label="Filtrar situação" value={status} onChange={(event) => { const value = event.target.value; setStatus(value === 'active' || value === 'inactive' ? value : 'all'); setPage(0); }}><option value="all">Todos</option><option value="active">Publicados</option><option value="inactive">Inativos</option></select>
        <button className="button secondary" type="button" onClick={() => void query.refetch()} disabled={query.isFetching}><RefreshCw size={16} className={query.isFetching ? 'spin' : ''} />Atualizar</button>
        {canGovern ? <button className="button primary" type="button" onClick={() => setEditor(newEditor(kind))}><Plus size={16} />Novo</button> : null}
      </div>

      <div className="ohlib-metrics"><span><strong>{total}</strong> cadastrados</span><span><strong>{items.filter((item) => item.status === 'active').length}</strong> publicados nesta página</span><span>Alterações usam controle de versão</span></div>
      {remoteError ? <p className="form-error" role="alert">{libraryErrorMessage(remoteError)}</p> : null}
      {query.isError ? <p className="form-error" role="alert">Não foi possível carregar a biblioteca.</p> : null}

      <div className={editor ? 'ohlib-workspace editing' : 'ohlib-workspace'}>
        <div className="ohlib-list">
          {query.isLoading ? <div className="ohlib-empty"><RefreshCw className="spin" /></div> : null}
          {!query.isLoading && !items.length ? <div className="ohlib-empty"><BookOpen /><strong>Nenhum conteúdo encontrado</strong><span>Use “Novo” para criar a primeira publicação.</span></div> : null}
          {items.map((item) => <article className={item.status === 'active' ? 'ohlib-card' : 'ohlib-card inactive'} key={item.id}>
            <div className="ohlib-card-copy"><div className="ohlib-card-heading"><strong>{item.title}</strong><span>v{item.version}</span></div><p>{itemSummary(item)}</p><div className="ohlib-tags"><span>{item.status === 'active' ? 'Publicado' : 'Fora da biblioteca'}</span><span>Atualizado em {new Date(item.updated_at).toLocaleDateString('pt-BR')}</span></div></div>
            {canGovern ? <div className="ohlib-actions"><button className="button secondary compact" type="button" onClick={() => setEditor(editorFrom(item))} disabled={busy}><Pencil size={14} />Editar</button><button className={item.status === 'active' ? 'button danger compact' : 'button primary compact'} type="button" disabled={busy} onClick={() => setActive.mutate({ kind: item.kind, id: item.id, active: item.status !== 'active', expectedVersion: item.version })}>{item.status === 'active' ? <X size={14} /> : <Check size={14} />}{item.status === 'active' ? 'Retirar' : 'Publicar'}</button></div> : null}
          </article>)}
          {total > PAGE_SIZE ? <div className="ohlib-pagination"><button className="button secondary compact" type="button" disabled={page === 0 || query.isFetching} onClick={() => setPage((value) => Math.max(0, value - 1))}><ChevronLeft size={15} />Anterior</button><span>Página {page + 1} de {Math.ceil(total / PAGE_SIZE)}</span><button className="button secondary compact" type="button" disabled={(page + 1) * PAGE_SIZE >= total || query.isFetching} onClick={() => setPage((value) => value + 1)}>Próxima<ChevronRight size={15} /></button></div> : null}
        </div>
        {editor ? <LibraryEditor state={editor} busy={busy} onChange={setEditor} onCancel={() => setEditor(null)} onSave={save} /> : null}
      </div>
    </section>
  );
}

function LibraryEditor({ state, busy, onChange, onCancel, onSave }: {
  state: EditorState;
  busy: boolean;
  onChange: (state: EditorState) => void;
  onCancel: () => void;
  onSave: (state: EditorState) => Promise<void>;
}) {
  const [error, setError] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (state.payload.title.trim().length < 3) { setError('Informe um título com pelo menos 3 caracteres.'); return; }
    if (state.kind === 'diet' && state.payload.meals.some((meal) => meal.items.length === 0)) { setError('Cada refeição precisa ter ao menos um alimento.'); return; }
    if (state.kind === 'program' && state.payload.days.some((day) => day.week < 1 || day.week > state.payload.weeks || day.weekday < 1 || day.weekday > 7)) { setError('Revise a semana e o dia das sessões.'); return; }
    setError('');
    try { await onSave(state); } catch { /* A mutação mantém o erro remoto visível. */ }
  }
  return <form className="ohlib-editor" onSubmit={submit}>
    <div className="ohlib-editor-title"><div><span>{state.id ? 'Editar conteúdo' : 'Novo conteúdo'}</span><h2>{state.kind === 'workout' ? 'Treino' : state.kind === 'diet' ? 'Dieta' : 'Programa'}</h2></div><button className="icon-button" type="button" aria-label="Fechar" onClick={onCancel}><X size={18} /></button></div>
    {error ? <p className="form-error" role="alert">{error}</p> : null}
    {state.kind === 'workout' ? <WorkoutFields state={state} onChange={onChange} /> : state.kind === 'diet' ? <DietFields state={state} onChange={onChange} /> : <ProgramFields state={state} onChange={onChange} />}
    <div className="ohlib-editor-footer"><button className="button secondary" type="button" onClick={onCancel} disabled={busy}>Cancelar</button><button className="button primary" type="submit" disabled={busy}><Save size={16} />{busy ? 'Salvando…' : 'Salvar'}</button></div>
  </form>;
}

function WorkoutFields({ state, onChange }: { state: Extract<EditorState, { kind: 'workout' }>; onChange: (state: EditorState) => void }) {
  const [search, setSearch] = useState('');
  const catalog = useExerciseCatalog({ query: search || undefined, sport: state.payload.sport_id, status: 'active', limit: 50, offset: 0 });
  const patch = (values: Partial<StaffHealthWorkoutPayload>) => onChange({ ...state, payload: { ...state.payload, ...values } });
  const addStep = (exerciseId: string) => {
    const exercise = catalog.data?.items.find((item) => item.id === exerciseId);
    if (!exercise) return;
    const prescription: StrengthPrescription = { engine: 'strength', sets: 3, reps: 10, rest_s: 60 };
    const step: ProfessionalWorkoutStepSaveInput = { id: crypto.randomUUID(), exercise_id: exercise.id, title: exercise.name, prescription };
    patch({ steps: [...state.payload.steps, step] });
  };
  const updateStep = (index: number, step: ProfessionalWorkoutStepSaveInput) => patch({ steps: state.payload.steps.map((current, position) => position === index ? step : current) });
  const removeStep = (index: number) => patch({ steps: state.payload.steps.filter((_, position) => position !== index) });
  return <div className="ohlib-form-grid">
    <label className="wide"><span>Título</span><input autoFocus required maxLength={120} value={state.payload.title} onChange={(event) => patch({ title: event.target.value })} /></label>
    <label><span>Modalidade</span><input required value={state.payload.sport_id} onChange={(event) => patch({ sport_id: event.target.value })} /></label>
    <label className="wide"><span>Observações</span><textarea rows={3} value={state.payload.notes} onChange={(event) => patch({ notes: event.target.value })} /></label>
    <div className="wide ohlib-exercises"><div className="ohlib-subheading"><div><strong>Exercícios</strong><small>O treino é salvo como uma estrutura tipada do Core.</small></div><span>{state.payload.steps.length}</span></div>
      <div className="ohlib-exercise-picker"><label className="ohlib-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar exercício" /></label><select value="" onChange={(event) => addStep(event.target.value)}><option value="">Adicionar exercício…</option>{catalog.data?.items.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></div>
      <div className="ohlib-exercise-list">{state.payload.steps.map((step, index) => <WorkoutStepRow key={step.id ?? index} step={step} onChange={(next) => updateStep(index, next)} onRemove={() => removeStep(index)} />)}</div>
    </div>
  </div>;
}

function WorkoutStepRow({ step, onChange, onRemove }: { step: ProfessionalWorkoutStepSaveInput; onChange: (step: ProfessionalWorkoutStepSaveInput) => void; onRemove: () => void }) {
  const prescription = step.prescription;
  return <div className="ohlib-exercise-row"><label><span>Nome</span><input value={step.title} onChange={(event) => onChange({ ...step, title: event.target.value })} /></label>
    {prescription.engine === 'strength' ? <><label><span>Séries</span><input type="number" min={1} value={prescription.sets} onChange={(event) => onChange({ ...step, prescription: { ...prescription, sets: Number(event.target.value) } })} /></label><label><span>Repetições</span><input value={prescription.reps ?? ''} onChange={(event) => onChange({ ...step, prescription: { ...prescription, reps: event.target.value } })} /></label><label><span>Descanso (s)</span><input type="number" min={0} value={prescription.rest_s ?? ''} onChange={(event) => onChange({ ...step, prescription: { ...prescription, rest_s: Number(event.target.value) } })} /></label></> : <span className="pcat-muted">Prescrição {prescription.engine} preservada pelo contrato.</span>}
    <button className="icon-button" type="button" aria-label={`Remover ${step.title}`} onClick={onRemove}><Trash2 size={15} /></button>
  </div>;
}

function DietFields({ state, onChange }: { state: Extract<EditorState, { kind: 'diet' }>; onChange: (state: EditorState) => void }) {
  const patch = (values: Partial<StaffHealthDietPayload>) => onChange({ ...state, payload: { ...state.payload, ...values } });
  const updateMeal = (index: number, meal: NutritionDietMealInput) => patch({ meals: state.payload.meals.map((current, position) => position === index ? meal : current) });
  const removeMeal = (index: number) => patch({ meals: state.payload.meals.filter((_, position) => position !== index) });
  const addMeal = () => patch({ meals: [...state.payload.meals, { id: crypto.randomUUID(), title: 'Nova refeição', time: null, critical: false, items: [] }] });
  return <div className="ohlib-form-grid"><label className="wide"><span>Título</span><input autoFocus required maxLength={120} value={state.payload.title} onChange={(event) => patch({ title: event.target.value })} /></label><label className="wide"><span>Objetivo</span><textarea rows={3} value={state.payload.objective} onChange={(event) => patch({ objective: event.target.value })} /></label>
    <div className="wide ohlib-meals"><div className="ohlib-subheading"><div><strong>Refeições e alimentos</strong><small>Quantidades e nutrientes seguem o contrato nutricional do Core.</small></div><button className="button secondary compact" type="button" onClick={addMeal}><Plus size={14} />Refeição</button></div><div className="ohlib-meal-list">{state.payload.meals.map((meal, index) => <DietMealRow key={meal.id ?? index} meal={meal} onChange={(next) => updateMeal(index, next)} onRemove={() => removeMeal(index)} />)}</div></div>
  </div>;
}

function DietMealRow({ meal, onChange, onRemove }: { meal: NutritionDietMealInput; onChange: (meal: NutritionDietMealInput) => void; onRemove: () => void }) {
  const updateItem = (index: number, item: NutritionDietItemInput) => onChange({ ...meal, items: meal.items.map((current, position) => position === index ? item : current) });
  const removeItem = (index: number) => onChange({ ...meal, items: meal.items.filter((_, position) => position !== index) });
  const addItem = () => onChange({ ...meal, items: [...meal.items, { id: crypto.randomUUID(), name: '', quantity_g: 100, quantity_value: 1, unit: 'porção' }] });
  return <section className="ohlib-meal-card"><div className="ohlib-meal-head"><input value={meal.title} maxLength={120} placeholder="Nome da refeição" onChange={(event) => onChange({ ...meal, title: event.target.value })} /><input type="time" value={meal.time ?? ''} onChange={(event) => onChange({ ...meal, time: event.target.value || null })} /><label className="ohlib-check compact"><input type="checkbox" checked={meal.critical} onChange={(event) => onChange({ ...meal, critical: event.target.checked })} /><span>Essencial</span></label><button className="icon-button" type="button" aria-label="Remover refeição" onClick={onRemove}><Trash2 size={15} /></button></div>
    <div className="ohlib-food-list">{meal.items.map((item, index) => <div className="ohlib-food-row" key={item.id ?? index}><input className="food-name" value={item.name} placeholder="Nome do alimento" onChange={(event) => updateItem(index, { ...item, name: event.target.value, food_id: null })} /><input type="number" min={0} step="0.1" value={item.quantity_value ?? item.quantity_g} aria-label="Quantidade" onChange={(event) => updateItem(index, { ...item, quantity_value: Number(event.target.value) })} /><input value={item.unit} aria-label="Unidade" onChange={(event) => updateItem(index, { ...item, unit: event.target.value })} /><button className="icon-button" type="button" aria-label={`Remover ${item.name || 'alimento'}`} onClick={() => removeItem(index)}><Trash2 size={14} /></button></div>)}</div>
    <button className="button secondary compact" type="button" onClick={addItem}><Plus size={13} />Alimento</button>
  </section>;
}

function ProgramFields({ state, onChange }: { state: Extract<EditorState, { kind: 'program' }>; onChange: (state: EditorState) => void }) {
  const patch = (values: Partial<StaffHealthProgramPayload>) => onChange({ ...state, payload: { ...state.payload, ...values } });
  const workouts = useOnlyFitHealthCatalog('workout', '', state.payload.sport_id, 'active', 100, 0);
  const workoutItems = workouts.data?.items.filter((item): item is StaffHealthWorkout => item.kind === 'workout') ?? [];
  const addDay = () => { const first = workoutItems[0]; if (!first) return; patch({ days: [...state.payload.days, { week: 1, weekday: 1, workout_id: first.id, order_index: state.payload.days.length }] }); };
  return <div className="ohlib-form-grid"><label className="wide"><span>Título</span><input autoFocus required maxLength={120} value={state.payload.title} onChange={(event) => patch({ title: event.target.value })} /></label><label className="wide"><span>Descrição</span><textarea required rows={3} maxLength={2000} value={state.payload.description} onChange={(event) => patch({ description: event.target.value })} /></label><label><span>Modalidade</span><input required value={state.payload.sport_id} onChange={(event) => patch({ sport_id: event.target.value })} /></label><label><span>Duração (semanas)</span><input type="number" min={1} max={52} value={state.payload.weeks} onChange={(event) => patch({ weeks: Number(event.target.value) })} /></label><label><span>Minutos estimados por semana</span><input type="number" min={1} max={10080} value={state.payload.estimated_minutes_per_week ?? ''} onChange={(event) => patch({ estimated_minutes_per_week: event.target.value === '' ? null : Number(event.target.value) })} /></label><label className="wide"><span>Equipamentos</span><input value={state.payload.equipment.join(', ')} onChange={(event) => patch({ equipment: commaSeparatedValues(event.target.value) })} placeholder="Separados por vírgula" /></label>
    <div className="wide ohlib-exercises"><div className="ohlib-subheading"><div><strong>Dias do programa</strong><small>Cada dia aponta para um treino oficial ativo.</small></div><button className="button secondary compact" type="button" disabled={!workoutItems.length} onClick={addDay}><Plus size={14} />Dia</button></div>{!workoutItems.length ? <div className="ohlib-inline-empty">Cadastre um treino publicado nesta modalidade antes de montar o programa.</div> : null}<div className="ohlib-exercise-list">{state.payload.days.map((day, index) => <div className="ohlib-exercise-row" key={`${day.workout_id}-${index}`}><label><span>Semana</span><input type="number" min={1} max={state.payload.weeks} value={day.week} onChange={(event) => patch({ days: state.payload.days.map((current, position) => position === index ? { ...current, week: Number(event.target.value) } : current) })} /></label><label><span>Dia</span><input type="number" min={1} max={7} value={day.weekday} onChange={(event) => patch({ days: state.payload.days.map((current, position) => position === index ? { ...current, weekday: Number(event.target.value) } : current) })} /></label><label><span>Treino</span><select value={day.workout_id} onChange={(event) => patch({ days: state.payload.days.map((current, position) => position === index ? { ...current, workout_id: event.target.value } : current) })}>{workoutItems.map((workout) => <option value={workout.id} key={workout.id}>{workout.title}</option>)}</select></label><button className="icon-button" type="button" aria-label="Remover dia" onClick={() => patch({ days: state.payload.days.filter((_, position) => position !== index).map((current, position) => ({ ...current, order_index: position })) })}><Trash2 size={15} /></button></div>)}</div></div>
  </div>;
}

export function OnlyFitHealthLibraryPage() {
  const [tab, setTab] = useState<Tab>('workout');
  return <><header className="page-header"><div><p className="section-label">Biblioteca da plataforma</p><h1>Biblioteca OnlyFit Health</h1><p className="ohlib-lead">Conteúdo oficial servido pelo OnlyFit Core.</p></div></header><section className="content ohlib-page"><nav className="ohlib-tabs" aria-label="Tipos de conteúdo">{tabs.map(({ id, label, description, icon: Icon }) => <button type="button" key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}><Icon size={19} /><span><strong>{label}</strong><small>{description}</small></span></button>)}</nav>{tab === 'protocols' ? <ProtocolCatalogPage embedded /> : <ManagedCatalog kind={tab} />}</section></>;
}
