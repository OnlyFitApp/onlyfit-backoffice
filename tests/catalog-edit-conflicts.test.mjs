import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { test } from 'node:test';
import ts from 'typescript';

function load(file, staff) {
  const source = readFileSync(new URL(`../src/lib/${file}.ts`, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
  const exports = {};
  runInNewContext(compiled, {exports, require: (id) => id.includes('/api/core')
    ? {coreApi:{staff}}
    : id === './protocolIconCatalog' ? {protocolIconKeys:['sun']} : load(id.replace('./',''),staff)});
  return exports;
}
const translations = ['pt-BR','pt-PT','en'].map(locale => ({locale,name:'Viewed title',category:'Example',description:'Temporary example'}));
const impact = {accounts:2,total_links:3,offers:0,professionals:0,approved_credentials:0,pending_credentials:0};
const scenarios = [
  {file:'protocolCatalog',kind:'protocol_templates',list:'listProtocolCatalog',save:'upsertProtocolCatalogEntry',data:{label:'Viewed title',translations,flow:'generic',icon_key:'sun',structure_locked:false,clinical_notice:false,featured:false,default_steps:[]},
    input:item=>({...item,expectedVersion:item.version})},
  {file:'sessionTypes',kind:'session_types',list:'listSessionTypes',save:'upsertSessionType',data:{label:'Viewed title',icon_key:'activity',sports:['running']},
    input:item=>({...item,expectedVersion:item.version})},
  {file:'combatTechniques',kind:'fight_techniques',list:'listCombatTechniques',listArgs:{search:'',active:null,discipline:null,techniqueType:null,distance:null,limit:10,offset:0},save:'upsertCombatTechnique',data:{label:'Viewed title',name_en:null,name_es:null,description_ptbr:null,technique_type:'attack',distance:'mid',disciplines:['generic'],video_url:null,thumb_url:null},
    input:item=>({...item,expectedVersion:item.version})},
  {file:'affinityGroups',kind:'affinity_groups',list:'listAffinityGroups',save:'updateAffinityGroup',data:{label:'Viewed title',icon:'Dumbbell',accent:'from-blue-500/30',aliases:[]},
    input:item=>({...item,expectedToken:item.token})},
  {file:'professionalSpecialties',kind:'professional_specialties',list:'listProfessionalSpecialties',save:'updateProfessionalSpecialty',data:{label:'Viewed title',council:'CREF',regulated:true},
    input:item=>({...item,expectedVersion:item.version})},
  {file:'marketSettings',kind:'product_categories',list:'listProductCategories',save:'saveProductCategory',data:{label:'Viewed title',icon:'package'},input:item=>item},
];
for (const scenario of scenarios) {
  test(`${scenario.kind}: a stale editor cannot overwrite another session`, async () => {
    let current={kind:scenario.kind,key:'fixture_item',name_key:`${scenario.kind}.fixture_item`,version:1,active:true,public:true,position:10,data:scenario.data,impact};
    let sent, writes=0;
    const api=load(scenario.file,{
      catalog:async()=>({items:[current]}),
      catalogSave:async ({item})=>{
        sent=item;
        if (item.expected_version!==current.version) throw new Error('staff.catalog_changed');
        writes++;
        return {...current,version:current.version+1};
      },
    });
    const list=await api[scenario.list](scenario.listArgs);
    const viewed=(list.items??list)[0];
    const draft=scenario.input(viewed);
    current={...current,version:2,data:{...current.data,label:'Saved by another session'}};
    await assert.rejects(api[scenario.save](draft),/staff.catalog_changed/);
    assert.equal(sent.expected_version,1);
    assert.equal(writes,0);
    assert.equal(current.data.label,'Saved by another session');
    const refreshed=await api[scenario.list](scenario.listArgs);
    const reloaded=(refreshed.items??refreshed)[0];
    assert.equal(reloaded.version??Number(reloaded.token),2);
  });
}

test('a new protocol draft cannot adopt and overwrite a newly occupied key', async()=>{
  let sent;
  const api=load('protocolCatalog',{
    catalog:async()=>({items:[{kind:'protocol_templates',key:'example',version:4}]}),
    catalogSave:async ({item})=>{sent=item;if(item.expected_version===null)throw new Error('staff.catalog_changed');return {kind:'protocol_templates',key:'example',active:true,version:5};},
  });
  await assert.rejects(api.upsertProtocolCatalogEntry({id:'example',expectedVersion:null,translations,flow:'generic',iconKey:'sun',structureLocked:false,clinicalNotice:false,featured:false,defaultSteps:[],sortOrder:10,active:true}),/staff.catalog_changed/);
  assert.equal(sent.expected_version,null);
});

test('protocol use displays linked routines rather than unique owners', async()=>{
  const api=load('protocolCatalog',{catalog:async()=>({items:[{kind:'protocol_templates',key:'example',version:1,active:true,position:10,data:scenarios[0].data,impact}]})});
  assert.equal((await api.listProtocolCatalog())[0].inUseCount,3);
});

test('session options come from canonical sports rather than affinity groups',()=>{
  const page=readFileSync(new URL('../src/components/SessionTypesPage.tsx',import.meta.url),'utf8');
  const hook=readFileSync(new URL('../src/hooks/useSportsCatalog.ts',import.meta.url),'utf8');
  assert.doesNotMatch(page,/useAffinityGroups/);
  assert.match(page,/sport\.active/);
  assert.match(hook,/staff\.catalog\(\{ kind: 'sports' \}\)/);
  const api=load('sportsCatalog',{});
  assert.equal(api.staffSportLabel({key:'strength',name_key:'sport.strength',data:{}}),'Musculação');
  assert.equal(api.staffSportLabel({key:'future_sport',name_key:'sport.future_sport',data:{label:'Configured name'}}),'Configured name');
});
