import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';

const app=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
const page=readFileSync(new URL('../src/components/OnlyFitHealthLibraryPage.tsx',import.meta.url),'utf8');
const api=readFileSync(new URL('../src/lib/onlyfitHealthLibrary.ts',import.meta.url),'utf8');

test('consolidates all user-facing OnlyFit Health content in one destination',()=>{
  assert.match(app,/onlyfit-health-library[^\n]+OnlyFit Health/);
  assert.doesNotMatch(app,/id: 'protocol-catalog'/);
  for(const label of ['Treinos','Programas','Nutrição e dietas','Protocolos']) assert.ok(page.includes(label));
  assert.match(page,/<ProtocolCatalogPage embedded\/>/);
});

test('uses staff RPCs and never accesses private catalog tables from the browser',()=>{
  for(const rpc of ['control_list_onlyfit_health_workouts','control_upsert_onlyfit_health_workout','control_set_onlyfit_health_workout_active','control_list_onlyfit_health_diets','control_upsert_onlyfit_health_diet','control_set_onlyfit_health_diet_active','control_list_onlyfit_health_programs','control_upsert_onlyfit_health_program','control_set_onlyfit_health_program_active']) assert.ok(api.includes(rpc));
  assert.doesNotMatch(api,/\.from\(['"](?:onlyfit_health|private)/);
  assert.doesNotMatch(api,/service_role|serviceRole|SUPABASE_SERVICE/);
});

test('publishes immutable versions with full workout, diet and program contracts',()=>{
  assert.match(page,/Nova versão/);
  assert.match(page,/Contrato da prescrição/);
  assert.match(page,/Refeições e alimentos/);
  assert.match(page,/Sessões do programa/);
  assert.match(page,/Selecione o treino oficial/);
  assert.match(page,/workout_id/);
  assert.match(page,/Estrutura válida/);
});
