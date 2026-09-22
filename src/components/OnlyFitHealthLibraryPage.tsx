import { BookOpen, Check, ChevronLeft, ChevronRight, Dumbbell, HeartPulse, Pencil, Plus, RefreshCw, Save, Search, Trash2, Utensils, X } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { useCurrentStaffRole } from '../hooks/useStaffManagement';
import { useExerciseCatalog } from '../hooks/useExerciseCatalog';
import { useOnlyFitHealthCatalog, useSaveDiet, useSaveProgram, useSaveWorkout, useSetLibraryActive } from '../hooks/useOnlyFitHealthLibrary';
import { useUnsavedWarning } from '../hooks/useUnsavedWarning';
import { libraryErrorMessage, type DietCatalogItem, type LibraryKind, type ProgramCatalogItem, type WorkoutCatalogItem } from '../lib/onlyfitHealthLibrary';
import { ProtocolCatalogPage } from './ProtocolCatalogPage';

type Tab = LibraryKind | 'protocols';
type Draft = { kind: LibraryKind; sourceId?: string; key:string; title:string; description:string; taxonomy:string; level:string;
  active:boolean; featured:boolean; sortOrder:number; goal:string; coverUrl:string; durationWeeks:number;
  weeklySessions:number|null; estMinutesPerWeek:number|null; equipment:string; calories:number|null; protein:number|null;
  carbs:number|null; fats:number|null; primaryJson:string; secondaryJson:string };

const tabs: Array<{id:Tab;label:string;description:string;icon:typeof Dumbbell}> = [
  {id:'workouts',label:'Treinos',description:'Todas as modalidades',icon:Dumbbell},
  {id:'programs',label:'Programas',description:'Semanas e sessões',icon:BookOpen},
  {id:'diets',label:'Nutrição e dietas',description:'Refeições e alimentos',icon:Utensils},
  {id:'protocols',label:'Protocolos',description:'Hábitos e rotinas',icon:HeartPulse},
];
const workoutModalities = [
  ['walking','Caminhada'],['cycling','Ciclismo'],['running','Corrida'],['crossfit','CrossFit'],['functional','Funcional'],
  ['hiit','HIIT'],['hyrox','Hyrox'],['martial_arts','Lutas'],['mobility','Mobilidade'],['strength','Musculação'],
  ['swimming','Natação'],['custom','Personalizado'],['pilates','Pilates'],['yoga','Yoga'],
] as const;
const programSports = [['cycling','Ciclismo'],['running','Corrida'],['crossfit','CrossFit'],['strength','Força'],['hyrox','Hyrox'],['martial_arts','Lutas'],['bodybuilding','Musculação'],['swimming','Natação'],['triathlon','Triathlon']] as const;
const levelOptions = [['beginner','Iniciante'],['intermediate','Intermediário'],['advanced','Avançado']] as const;
const pretty=(value:unknown)=>JSON.stringify(value,null,2);
const slug=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'').slice(0,100);
const parseJson=(value:string,label:string):unknown=>{ try{return JSON.parse(value);}catch{throw new Error(`${label}_json_invalid`);} };
const resizeProgramWeeks=(value:string,duration:number)=>{let weeks:Array<Record<string,unknown>>=[];try{const parsed=JSON.parse(value);if(Array.isArray(parsed))weeks=parsed;}catch{/* save validation handles malformed input */}return pretty(Array.from({length:duration},(_,index)=>({...weeks[index]??{phase:'base',target_minutes:null,target_tss:null,is_recovery:false},week:index+1})));};

function emptyDraft(kind:LibraryKind):Draft {
  if(kind==='workouts') return {kind,key:'',title:'',description:'',taxonomy:'strength',level:'beginner',active:true,featured:false,sortOrder:0,goal:'',coverUrl:'',durationWeeks:1,weeklySessions:null,estMinutesPerWeek:null,equipment:'',calories:null,protein:null,carbs:null,fats:null,
    primaryJson:pretty({schemaVersion:2,modality:'strength',session:{objective:''},blocks:[],steps:[]}),secondaryJson:'[]'};
  if(kind==='diets') return {kind,key:'',title:'',description:'',taxonomy:'',level:'beginner',active:true,featured:false,sortOrder:0,goal:'',coverUrl:'',durationWeeks:1,weeklySessions:null,estMinutesPerWeek:null,equipment:'',calories:null,protein:null,carbs:null,fats:null,
    primaryJson:pretty([{meal_type:'breakfast',title:'Café da manhã',target_time:'08:00',order_index:1,is_critical:false,items:[{custom_food_name:'',quantity_g:100,quantity_value:1,quantity_unit:'porção',order_index:1}]}]),secondaryJson:'[]'};
  return {kind,key:'',title:'',description:'',taxonomy:'running',level:'beginner',active:true,featured:false,sortOrder:0,goal:'',coverUrl:'',durationWeeks:4,weeklySessions:3,estMinutesPerWeek:null,equipment:'',calories:null,protein:null,carbs:null,fats:null,
    primaryJson:pretty(Array.from({length:4},(_,index)=>({week:index+1,phase:'base',target_minutes:null,target_tss:null,is_recovery:false}))),
    secondaryJson:pretty([{week:1,day:1,position:0,title:'Sessão 1',description:'',session_type:'easy',est_minutes:30,engine:'endurance',schema_version:1,contract_version:1,target:{}}])};
}
function draftFrom(item:WorkoutCatalogItem|DietCatalogItem|ProgramCatalogItem,kind:LibraryKind):Draft {
  if(kind==='workouts') { const row=item as WorkoutCatalogItem; return {...emptyDraft(kind),sourceId:row.id,key:row.catalogKey,title:row.title,description:row.description,taxonomy:row.modality,level:row.level,active:true,featured:row.featured,sortOrder:row.sortOrder,primaryJson:pretty(row.prescription),secondaryJson:pretty(row.exercises)}; }
  if(kind==='diets') { const row=item as DietCatalogItem; return {...emptyDraft(kind),sourceId:row.id,key:row.catalogKey,title:row.title||row.name,description:row.description,goal:row.objective,active:true,featured:row.featured,sortOrder:row.sortOrder,calories:row.targetCalories,protein:row.targetProteinG,carbs:row.targetCarbsG,fats:row.targetFatsG,primaryJson:pretty(row.meals)}; }
  const row=item as ProgramCatalogItem; return {...emptyDraft(kind),sourceId:row.id,key:row.slug,title:row.name,description:row.description,taxonomy:row.sport,level:row.level,active:true,sortOrder:row.sortOrder,goal:row.goal,coverUrl:row.coverUrl,durationWeeks:row.durationWeeks,weeklySessions:row.weeklySessions,estMinutesPerWeek:row.estMinutesPerWeek,equipment:row.equipment.join(', '),primaryJson:pretty(row.weeks),secondaryJson:pretty(row.sessions)};
}
function contentCount(item:WorkoutCatalogItem|DietCatalogItem|ProgramCatalogItem,kind:LibraryKind){
  if(kind==='workouts') return `${(item as WorkoutCatalogItem).exercises.length} exercício(s)`;
  if(kind==='diets') return `${(item as DietCatalogItem).meals.length} refeição(ões)`;
  const row=item as ProgramCatalogItem; return `${row.durationWeeks} semana(s) · ${row.sessions.length} sessão(ões)`;
}

function ManagedCatalog({kind}:{kind:LibraryKind}) {
  const role=useCurrentStaffRole(); const canGovern=role.data==='admin'||role.data==='super_admin';
  const pageSize=25; const [search,setSearch]=useState(''); const [filter,setFilter]=useState(''); const [page,setPage]=useState(0); const [draft,setDraft]=useState<Draft|null>(null); const [localError,setLocalError]=useState('');
  const query=useOnlyFitHealthCatalog(kind,search,filter,pageSize,page*pageSize); const workoutSave=useSaveWorkout(); const dietSave=useSaveDiet(); const programSave=useSaveProgram(); const setActive=useSetLibraryActive();
  useUnsavedWarning(Boolean(draft));
  const mutation=kind==='workouts'?workoutSave:kind==='diets'?dietSave:programSave; const busy=mutation.isPending||setActive.isPending;
  const items=query.data?.items??[]; const activeCount=items.filter((item)=>item.active).length;
  const options=kind==='workouts'?workoutModalities:kind==='programs'?programSports:[];
  function openNew(){setDraft(emptyDraft(kind));setLocalError('');mutation.reset();}
  function openEdit(item:WorkoutCatalogItem|DietCatalogItem|ProgramCatalogItem){setDraft(draftFrom(item,kind));setLocalError('');mutation.reset();}
  function patch(values:Partial<Draft>){setDraft((current)=>current?{...current,...values}:current);}
  async function submit(event:FormEvent){
    event.preventDefault(); if(!draft||!canGovern)return; setLocalError('');
    try {
      const key=slug(draft.key||draft.title); if(!key||draft.title.trim().length<3) throw new Error('required_fields');
      const primary=parseJson(draft.primaryJson,kind==='workouts'?'prescription':kind==='diets'?'meals':'weeks');
      const secondary=kind==='diets'?[]:parseJson(draft.secondaryJson,kind==='workouts'?'exercises':'sessions');
      if(kind==='workouts') { if(!primary||Array.isArray(primary)||typeof primary!=='object') throw new Error('invalid_workout'); if(draft.taxonomy==='strength'&&(!Array.isArray(secondary)||secondary.length===0)) throw new Error('strength_exercises_required'); await workoutSave.mutateAsync({sourceId:draft.sourceId,catalogKey:key,title:draft.title.trim(),description:draft.description.trim(),modality:draft.taxonomy,level:draft.level,active:draft.active,featured:draft.featured,sortOrder:draft.sortOrder,prescription:{...(primary as Record<string,unknown>),modality:draft.taxonomy},exercises:secondary as Array<Record<string,unknown>>}); }
      else if(kind==='diets') { const meals=primary as Array<Record<string,unknown>>; if(!Array.isArray(meals)||!meals.length||meals.some((meal)=>!Array.isArray(meal.items)||(meal.items as unknown[]).length===0)) throw new Error('diet_meals_required'); await dietSave.mutateAsync({sourceId:draft.sourceId,catalogKey:key,name:draft.title.trim(),title:draft.title.trim(),description:draft.description.trim(),objective:draft.goal.trim(),targetCalories:draft.calories,targetProteinG:draft.protein,targetCarbsG:draft.carbs,targetFatsG:draft.fats,active:draft.active,featured:draft.featured,sortOrder:draft.sortOrder,meals}); }
      else { const weeks=primary as Array<Record<string,unknown>>, sessions=secondary as Array<Record<string,unknown>>; if(!Array.isArray(weeks)||weeks.length!==draft.durationWeeks) throw new Error('program_weeks_required'); if(!Array.isArray(sessions)||!sessions.length) throw new Error('program_sessions_required'); if(['strength','bodybuilding','crossfit','hyrox'].includes(draft.taxonomy)&&sessions.some((session)=>!session.workout_id)) throw new Error('program_workout_required'); await programSave.mutateAsync({sourceId:draft.sourceId,slug:key,sport:draft.taxonomy,name:draft.title.trim(),goal:draft.goal.trim(),level:draft.level,durationWeeks:draft.durationWeeks,coverUrl:draft.coverUrl.trim(),description:draft.description.trim(),weeklySessions:draft.weeklySessions,estMinutesPerWeek:draft.estMinutesPerWeek,equipment:draft.equipment.split(',').map((value)=>value.trim()).filter(Boolean),sortOrder:draft.sortOrder,active:draft.active,weeks,sessions}); }
      setDraft(null);
    } catch(error) { const message=(error as Error).message; const local:Record<string,string>={required_fields:'Informe a chave e o título.',invalid_workout:'A prescrição do treino precisa ser um objeto válido.',strength_exercises_required:'Adicione pelo menos um exercício ao treino de musculação.',diet_meals_required:'Adicione ao menos uma refeição e um alimento em cada refeição.',program_weeks_required:'O programa precisa ter exatamente uma configuração para cada semana.',program_sessions_required:'Adicione ao menos uma sessão ao programa.',program_workout_required:'Vincule cada sessão a um treino oficial ativo e compatível.'}; setLocalError(message.endsWith('_json_invalid')?'O conteúdo estruturado contém JSON inválido.':local[message]??libraryErrorMessage(error)); }
  }
  const remoteError=mutation.error??setActive.error;
  return <section className="ohlib-catalog">
    <div className="ohlib-toolbar">
      <label className="ohlib-search"><Search size={17}/><input aria-label="Buscar" value={search} onChange={(e)=>{setSearch(e.target.value);setPage(0);}} placeholder="Buscar por nome ou descrição"/></label>
      {options.length?<select aria-label="Filtrar modalidade" value={filter} onChange={(e)=>{setFilter(e.target.value);setPage(0);}}><option value="">Todas as modalidades</option>{options.map(([value,label])=><option value={value} key={value}>{label}</option>)}</select>:null}
      <button className="button secondary" type="button" onClick={()=>void query.refetch()} disabled={query.isFetching}><RefreshCw size={16} className={query.isFetching?'spin':''}/>Atualizar</button>
      {canGovern?<button className="button primary" type="button" onClick={openNew}><Plus size={16}/>Novo</button>:null}
    </div>
    <div className="ohlib-metrics"><span><strong>{query.data?.total??0}</strong> cadastrados</span><span><strong>{activeCount}</strong> nesta página publicados</span><span>Alterações publicadas criam uma nova versão</span></div>
    {localError?<p className="form-error" role="alert">{localError}</p>:null}{remoteError?<p className="form-error" role="alert">{libraryErrorMessage(remoteError)}</p>:null}
    <div className={draft?'ohlib-workspace editing':'ohlib-workspace'}>
      <div className="ohlib-list">
        {query.isLoading?<div className="ohlib-empty"><RefreshCw className="spin"/></div>:null}
        {!query.isLoading&&!items.length?<div className="ohlib-empty"><BookOpen/><strong>Nenhum conteúdo encontrado</strong><span>Use “Novo” para criar a primeira publicação.</span></div>:null}
        {items.map((item)=><article className={item.active?'ohlib-card':'ohlib-card inactive'} key={item.id}>
          <div className="ohlib-card-copy"><div className="ohlib-card-heading"><strong>{'title'in item?item.title:item.name}</strong><span>v{item.version}</span></div>
            <p>{item.description||('goal'in item?item.goal:'Sem descrição')}</p><div className="ohlib-tags"><span>{kind==='workouts'?(item as WorkoutCatalogItem).modality:kind==='programs'?(item as ProgramCatalogItem).sport:'Nutrição'}</span><span>{contentCount(item,kind)}</span><span>{item.active?'Publicado':'Fora da biblioteca'}</span></div></div>
          {canGovern?<div className="ohlib-actions"><button className="button secondary compact" type="button" onClick={()=>openEdit(item)} disabled={busy}><Pencil size={14}/>Nova versão</button><button className={item.active?'button danger compact':'button primary compact'} type="button" disabled={busy} onClick={()=>void setActive.mutateAsync({kind,id:item.id,active:!item.active})}>{item.active?<X size={14}/>:<Check size={14}/>} {item.active?'Retirar':'Publicar'}</button></div>:null}
        </article>)}
        {(query.data?.total??0)>pageSize?<div className="ohlib-pagination"><button className="button secondary compact" type="button" disabled={page===0||query.isFetching} onClick={()=>setPage((value)=>Math.max(0,value-1))}><ChevronLeft size={15}/>Anterior</button><span>Página {page+1} de {Math.ceil((query.data?.total??0)/pageSize)}</span><button className="button secondary compact" type="button" disabled={(page+1)*pageSize>=(query.data?.total??0)||query.isFetching} onClick={()=>setPage((value)=>value+1)}>Próxima<ChevronRight size={15}/></button></div>:null}
      </div>
      {draft?<form className="ohlib-editor" onSubmit={submit}><div className="ohlib-editor-title"><div><span>{draft.sourceId?'Nova versão':'Novo conteúdo'}</span><h2>{kind==='workouts'?'Treino':kind==='programs'?'Programa':'Dieta'}</h2></div><button className="icon-button" type="button" aria-label="Fechar" onClick={()=>setDraft(null)}><X size={18}/></button></div>
        <div className="ohlib-form-grid"><label className="wide"><span>Título</span><input autoFocus maxLength={120} value={draft.title} onChange={(e)=>patch({title:e.target.value,key:draft.key||slug(e.target.value)})}/></label><label className="wide"><span>Chave permanente</span><input maxLength={120} value={draft.key} disabled={Boolean(draft.sourceId)} onChange={(e)=>patch({key:slug(e.target.value)})}/><small>Une as versões deste conteúdo.</small></label>
        {kind!=='diets'?<><label><span>{kind==='workouts'?'Modalidade':'Esporte'}</span><select value={draft.taxonomy} onChange={(e)=>patch({taxonomy:e.target.value})}>{options.map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></label><label><span>Nível</span><select value={draft.level} onChange={(e)=>patch({level:e.target.value})}>{levelOptions.map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></label></>:null}
        <label className="wide"><span>Descrição</span><textarea rows={3} maxLength={kind==='programs'?2000:1000} value={draft.description} onChange={(e)=>patch({description:e.target.value})}/></label>
        {kind!=='workouts'?<label className="wide"><span>Objetivo</span><textarea rows={2} maxLength={500} value={draft.goal} onChange={(e)=>patch({goal:e.target.value})}/></label>:null}
        {kind==='diets'?<><NumberField label="Calorias" value={draft.calories} onChange={(calories)=>patch({calories})}/><NumberField label="Proteína (g)" value={draft.protein} onChange={(protein)=>patch({protein})}/><NumberField label="Carboidratos (g)" value={draft.carbs} onChange={(carbs)=>patch({carbs})}/><NumberField label="Gorduras (g)" value={draft.fats} onChange={(fats)=>patch({fats})}/></>:null}
        {kind==='programs'?<><NumberField label="Duração (semanas)" value={draft.durationWeeks} min={1} max={52} onChange={(durationWeeks)=>{const next=durationWeeks??1;patch({durationWeeks:next,primaryJson:resizeProgramWeeks(draft.primaryJson,next)});}}/><NumberField label="Sessões por semana" value={draft.weeklySessions} min={1} max={14} onChange={(weeklySessions)=>patch({weeklySessions})}/><NumberField label="Minutos por semana" value={draft.estMinutesPerWeek} min={1} onChange={(estMinutesPerWeek)=>patch({estMinutesPerWeek})}/><label><span>Equipamentos</span><input value={draft.equipment} onChange={(e)=>patch({equipment:e.target.value})} placeholder="Separados por vírgula"/></label><label className="wide"><span>URL da capa</span><input type="url" value={draft.coverUrl} onChange={(e)=>patch({coverUrl:e.target.value})}/></label></>:null}
        <NumberField label="Ordem na biblioteca" value={draft.sortOrder} onChange={(sortOrder)=>patch({sortOrder:sortOrder??0})}/><label className="ohlib-check"><input type="checkbox" checked={draft.active} onChange={(e)=>patch({active:e.target.checked})}/><span>Publicar após salvar</span></label>{kind!=='programs'?<label className="ohlib-check"><input type="checkbox" checked={draft.featured} onChange={(e)=>patch({featured:e.target.checked})}/><span>Destacar</span></label>:null}
        {kind==='diets'?<DietMealBuilder value={draft.primaryJson} onChange={(primaryJson)=>patch({primaryJson})}/>:kind==='programs'?<ProgramWeekBuilder value={draft.primaryJson} onChange={(primaryJson)=>patch({primaryJson})}/>:<WorkoutPrescriptionBuilder modality={draft.taxonomy} value={draft.primaryJson} onChange={(primaryJson)=>patch({primaryJson})}/>}
        {kind==='workouts'&&draft.taxonomy==='strength'?<WorkoutExerciseBuilder value={draft.secondaryJson} onChange={(secondaryJson)=>patch({secondaryJson})}/>:null}
        {kind==='programs'?<ProgramSessionBuilder sport={draft.taxonomy} value={draft.secondaryJson} onChange={(secondaryJson)=>patch({secondaryJson})}/>:null}</div>
        <div className="ohlib-editor-footer"><button className="button secondary" type="button" onClick={()=>setDraft(null)}>Cancelar</button><button className="button primary" type="submit" disabled={busy}><Save size={16}/>{busy?'Salvando…':draft.sourceId?'Publicar nova versão':'Criar e publicar'}</button></div>
      </form>:null}
    </div>
  </section>;
}
function NumberField({label,value,onChange,min,max}:{label:string;value:number|null;onChange:(value:number|null)=>void;min?:number;max?:number}){return <label><span>{label}</span><input type="number" value={value??''} min={min} max={max} onChange={(e)=>onChange(e.target.value===''?null:Number(e.target.value))}/></label>}
function JsonField({label,hint,value,onChange}:{label:string;hint:string;value:string;onChange:(value:string)=>void}){const valid=useMemo(()=>{try{JSON.parse(value);return true}catch{return false}},[value]);return <label className="wide ohlib-json"><span>{label}<em className={valid?'valid':'invalid'}>{valid?'Estrutura válida':'Revise a estrutura'}</em></span><small>{hint}</small><textarea spellCheck={false} rows={12} value={value} onChange={(e)=>onChange(e.target.value)}/></label>}

function WorkoutPrescriptionBuilder({modality,value,onChange}:{modality:string;value:string;onChange:(value:string)=>void}) {
  const contract=useMemo(()=>{try{const parsed=JSON.parse(value);return parsed&&typeof parsed==='object'&&!Array.isArray(parsed)?parsed as Record<string,unknown>:{};}catch{return {};}},[value]);
  const session=contract.session&&typeof contract.session==='object'&&!Array.isArray(contract.session)?contract.session as Record<string,unknown>:{};
  const patchSession=(values:Record<string,unknown>)=>onChange(pretty({...contract,schemaVersion:Number(contract.schemaVersion)||2,modality,session:{...session,...values},blocks:Array.isArray(contract.blocks)?contract.blocks:[],steps:Array.isArray(contract.steps)?contract.steps:[]}));
  return <div className="wide ohlib-exercises"><div className="ohlib-subheading"><div><strong>Prescrição</strong><small>Defina a finalidade da sessão. Blocos e intervalos específicos continuam disponíveis no modo avançado.</small></div></div><label><span>Objetivo da sessão</span><input maxLength={240} value={String(session.objective??'')} onChange={(e)=>patchSession({objective:e.target.value})}/></label><details className="ohlib-json"><summary>Estrutura avançada da modalidade</summary><JsonField label="Contrato da prescrição" hint="Use para etapas, intervalos e blocos específicos." value={value} onChange={onChange}/></details></div>;
}

function ProgramWeekBuilder({value,onChange}:{value:string;onChange:(value:string)=>void}) {
  const weeks=useMemo(()=>{try{const parsed=JSON.parse(value);return Array.isArray(parsed)?parsed as Array<Record<string,unknown>>:[]}catch{return []}},[value]);
  const patchWeek=(index:number,values:Record<string,unknown>)=>onChange(pretty(weeks.map((week,position)=>position===index?{...week,...values}:week)));
  return <div className="wide ohlib-exercises"><div className="ohlib-subheading"><div><strong>Planejamento semanal</strong><small>Fases, volume e recuperação são sincronizados com a duração.</small></div><span>{weeks.length}</span></div><div className="ohlib-exercise-list">{weeks.map((week,index)=><div className="ohlib-exercise-row" key={index}><strong>Semana {index+1}</strong><label><span>Fase</span><input maxLength={60} value={String(week.phase??'base')} onChange={(e)=>patchWeek(index,{phase:e.target.value})}/></label><label><span>Minutos</span><input type="number" min={0} value={week.target_minutes==null?'':Number(week.target_minutes)} onChange={(e)=>patchWeek(index,{target_minutes:e.target.value===''?null:Number(e.target.value)})}/></label><label><span>TSS</span><input type="number" min={0} value={week.target_tss==null?'':Number(week.target_tss)} onChange={(e)=>patchWeek(index,{target_tss:e.target.value===''?null:Number(e.target.value)})}/></label><label className="ohlib-check compact"><input type="checkbox" checked={Boolean(week.is_recovery)} onChange={(e)=>patchWeek(index,{is_recovery:e.target.checked})}/><span>Recuperação</span></label></div>)}</div></div>;
}

function ProgramSessionBuilder({sport,value,onChange}:{sport:string;value:string;onChange:(value:string)=>void}) {
  const modality=sport==='bodybuilding'||sport==='strength'?'strength':sport;
  const needsWorkout=['strength','crossfit','hyrox'].includes(modality);
  const catalog=useOnlyFitHealthCatalog('workouts','',modality,100,0);
  const sessions=useMemo(()=>{try{const parsed=JSON.parse(value);return Array.isArray(parsed)?parsed as Array<Record<string,unknown>>:[]}catch{return []}},[value]);
  const workouts=(catalog.data?.items??[]).filter((item):item is WorkoutCatalogItem=>'modality'in item&&item.active&&item.modality===modality);
  const update=(next:Array<Record<string,unknown>>)=>onChange(pretty(next.map((session,index)=>({...session,position:index}))));
  const patch=(index:number,values:Record<string,unknown>)=>update(sessions.map((session,position)=>position===index?{...session,...values}:session));
  return <div className="wide ohlib-exercises"><div className="ohlib-subheading"><div><strong>Sessões do programa</strong><small>{needsWorkout?'Cada sessão publicada precisa apontar para um treino oficial ativo da mesma modalidade.':'Configure semana, dia, tipo, engine e duração.'}</small></div><button className="button secondary compact" type="button" onClick={()=>update([...sessions,{week:1,day:1,title:`Sessão ${sessions.length+1}`,description:'',session_type:'easy',est_minutes:30,engine:'endurance',schema_version:1,contract_version:1,target:{}}])}><Plus size={14}/>Sessão</button></div>
    <div className="ohlib-exercise-list">{sessions.map((session,index)=><div className="ohlib-exercise-row" key={index}><label><span>Semana</span><input type="number" min={1} max={52} value={Number(session.week)||1} onChange={(e)=>patch(index,{week:Number(e.target.value)})}/></label><label><span>Dia</span><input type="number" min={1} max={7} value={Number(session.day)||1} onChange={(e)=>patch(index,{day:Number(e.target.value)})}/></label><label><span>Título</span><input maxLength={120} value={String(session.title??'')} onChange={(e)=>patch(index,{title:e.target.value})}/></label><label><span>Tipo</span><input maxLength={60} value={String(session.session_type??'easy')} onChange={(e)=>patch(index,{session_type:e.target.value})}/></label><label><span>Minutos</span><input type="number" min={1} value={Number(session.est_minutes)||30} onChange={(e)=>patch(index,{est_minutes:Number(e.target.value)})}/></label>{needsWorkout?<label><span>Treino oficial</span><select value={String(session.workout_id??'')} onChange={(event)=>patch(index,{workout_id:event.target.value||null})}><option value="">Selecione o treino oficial…</option>{workouts.map((workout)=><option value={workout.id} key={workout.id}>{workout.title} · v{workout.version}</option>)}</select></label>:null}<button className="icon-button" type="button" aria-label="Remover sessão" onClick={()=>update(sessions.filter((_,position)=>position!==index))}><Trash2 size={15}/></button></div>)}</div>
    <details className="ohlib-json"><summary>Campos técnicos avançados</summary><JsonField label="Contrato completo das sessões" hint="Use apenas para targets e campos específicos da modalidade." value={value} onChange={onChange}/></details>
  </div>;
}

function WorkoutExerciseBuilder({value,onChange}:{value:string;onChange:(value:string)=>void}) {
  const [search,setSearch]=useState('');
  const catalog=useExerciseCatalog({search,active:true,sport:'bodybuilding',limit:50,offset:0});
  const exercises=useMemo(()=>{try{const parsed=JSON.parse(value);return Array.isArray(parsed)?parsed as Array<Record<string,unknown>>:[]}catch{return []}},[value]);
  const update=(next:Array<Record<string,unknown>>)=>onChange(pretty(next.map((item,index)=>({...item,position:index+1}))));
  const patchExercise=(index:number,values:Record<string,unknown>)=>update(exercises.map((item,position)=>position===index?{...item,...values}:item));
  return <div className="wide ohlib-exercises"><div className="ohlib-subheading"><div><strong>Exercícios</strong><small>Selecione da biblioteca global e configure a prescrição.</small></div><span>{exercises.length}</span></div>
    <div className="ohlib-exercise-picker"><label className="ohlib-search"><Search size={15}/><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Buscar exercício"/></label><select defaultValue="" onChange={(e)=>{const item=catalog.data?.items.find((entry)=>entry.id===e.target.value);if(item)update([...exercises,{exercise_id:item.id,exercise_name:item.namePtbr||item.nameEn,sets:3,reps:'10',rest_seconds:60,position:exercises.length+1}]);e.target.value='';}}><option value="">Adicionar exercício…</option>{catalog.data?.items.map((item)=><option value={item.id} key={item.id}>{item.namePtbr||item.nameEn}</option>)}</select></div>
    {!exercises.length?<div className="ohlib-inline-empty">Adicione pelo menos um exercício ao treino de musculação.</div>:null}
    <div className="ohlib-exercise-list">{exercises.map((exercise,index)=><div className="ohlib-exercise-row" key={`${String(exercise.exercise_id)}-${index}`}><strong>{String(exercise.exercise_name||'Exercício')}</strong><label><span>Séries</span><input type="number" min={1} max={30} value={Number(exercise.sets)||1} onChange={(e)=>patchExercise(index,{sets:Number(e.target.value)})}/></label><label><span>Repetições</span><input maxLength={40} value={String(exercise.reps??'')} onChange={(e)=>patchExercise(index,{reps:e.target.value})}/></label><label><span>Descanso (s)</span><input type="number" min={0} max={3600} value={Number(exercise.rest_seconds)||0} onChange={(e)=>patchExercise(index,{rest_seconds:Number(e.target.value)})}/></label><label><span>RPE</span><input type="number" min={0} max={10} step="0.5" value={exercise.target_rpe==null?'':Number(exercise.target_rpe)} onChange={(e)=>patchExercise(index,{target_rpe:e.target.value===''?null:Number(e.target.value)})}/></label><button className="icon-button" type="button" aria-label={`Remover ${String(exercise.exercise_name||'exercício')}`} onClick={()=>update(exercises.filter((_,position)=>position!==index))}><Trash2 size={15}/></button></div>)}</div>
  </div>;
}

const mealTypes=[['breakfast','Café da manhã'],['lunch','Almoço'],['dinner','Jantar'],['snack','Lanche ou ceia'],['pre_workout','Pré-treino'],['post_workout','Pós-treino']] as const;
function DietMealBuilder({value,onChange}:{value:string;onChange:(value:string)=>void}) {
  const meals=useMemo(()=>{try{const parsed=JSON.parse(value);return Array.isArray(parsed)?parsed as Array<Record<string,unknown>>:[]}catch{return []}},[value]);
  const update=(next:Array<Record<string,unknown>>)=>onChange(pretty(next.map((meal,index)=>({...meal,order_index:index+1}))));
  const patchMeal=(index:number,values:Record<string,unknown>)=>update(meals.map((meal,position)=>position===index?{...meal,...values}:meal));
  const items=(meal:Record<string,unknown>)=>Array.isArray(meal.items)?meal.items as Array<Record<string,unknown>>:[];
  const patchItem=(mealIndex:number,itemIndex:number,values:Record<string,unknown>)=>{const meal=meals[mealIndex];const nextItems=items(meal).map((item,position)=>position===itemIndex?{...item,...values}:item);patchMeal(mealIndex,{items:nextItems.map((item,index)=>({...item,order_index:index+1}))});};
  return <div className="wide ohlib-meals"><div className="ohlib-subheading"><div><strong>Refeições e alimentos</strong><small>Configure horários, quantidades e informações nutricionais.</small></div><button className="button secondary compact" type="button" onClick={()=>update([...meals,{meal_type:'snack',title:'Nova refeição',target_time:'12:00',is_critical:false,items:[{custom_food_name:'',quantity_g:100,quantity_value:1,quantity_unit:'porção',order_index:1}]}])}><Plus size={14}/>Refeição</button></div>
    <div className="ohlib-meal-list">{meals.map((meal,mealIndex)=><section className="ohlib-meal-card" key={mealIndex}><div className="ohlib-meal-head"><select value={String(meal.meal_type||'snack')} onChange={(e)=>patchMeal(mealIndex,{meal_type:e.target.value})}>{mealTypes.map(([key,label])=><option key={key} value={key}>{label}</option>)}</select><input value={String(meal.title??'')} maxLength={120} placeholder="Nome da refeição" onChange={(e)=>patchMeal(mealIndex,{title:e.target.value})}/><input type="time" value={String(meal.target_time??'')} onChange={(e)=>patchMeal(mealIndex,{target_time:e.target.value})}/><label className="ohlib-check compact"><input type="checkbox" checked={Boolean(meal.is_critical)} onChange={(e)=>patchMeal(mealIndex,{is_critical:e.target.checked})}/><span>Essencial</span></label><button className="icon-button" type="button" aria-label="Remover refeição" onClick={()=>update(meals.filter((_,position)=>position!==mealIndex))}><Trash2 size={15}/></button></div>
      <div className="ohlib-food-list">{items(meal).map((item,itemIndex)=><div className="ohlib-food-row" key={itemIndex}><input className="food-name" value={String(item.custom_food_name??'')} placeholder={item.food_id?'Alimento da base':'Nome do alimento'} onChange={(e)=>patchItem(mealIndex,itemIndex,{custom_food_name:e.target.value,food_id:null})}/><input type="number" min={0} step="0.1" value={Number(item.quantity_value??item.quantity_g??0)} aria-label="Quantidade" onChange={(e)=>patchItem(mealIndex,itemIndex,{quantity_value:Number(e.target.value),quantity_g:Number(e.target.value)})}/><input value={String(item.quantity_unit??'g')} aria-label="Unidade" maxLength={30} onChange={(e)=>patchItem(mealIndex,itemIndex,{quantity_unit:e.target.value})}/>{(['kcal','protein_g','carbs_g','fat_g'] as const).map((key)=><input key={key} type="number" min={0} step="0.1" value={item[key]==null?'':Number(item[key])} aria-label={key} placeholder={key==='kcal'?'kcal':key.replace('_g',' g')} onChange={(e)=>patchItem(mealIndex,itemIndex,{[key]:e.target.value===''?null:Number(e.target.value)})}/>) }<button className="icon-button" type="button" aria-label="Remover alimento" onClick={()=>patchMeal(mealIndex,{items:items(meal).filter((_,position)=>position!==itemIndex)})}><Trash2 size={14}/></button></div>)}</div>
      <button className="button secondary compact" type="button" onClick={()=>patchMeal(mealIndex,{items:[...items(meal),{custom_food_name:'',quantity_g:100,quantity_value:1,quantity_unit:'porção',order_index:items(meal).length+1}]})}><Plus size={13}/>Alimento</button></section>)}</div>
  </div>;
}

export function OnlyFitHealthLibraryPage(){
  const [tab,setTab]=useState<Tab>('workouts');
  return <><header className="page-header"><div><p className="section-label">Biblioteca da plataforma</p><h1>Biblioteca OnlyFit Health</h1><p className="ohlib-lead">Conteúdo oficial que aparece para os usuários com a fonte OnlyFit Health.</p></div></header>
    <section className="content ohlib-page"><nav className="ohlib-tabs" aria-label="Tipos de conteúdo">{tabs.map(({id,label,description,icon:Icon})=><button type="button" key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}><Icon size={19}/><span><strong>{label}</strong><small>{description}</small></span></button>)}</nav>
      {tab==='protocols'?<ProtocolCatalogPage embedded/>:<ManagedCatalog kind={tab}/>}</section></>;
}
