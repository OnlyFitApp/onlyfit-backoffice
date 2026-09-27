import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const page = readFileSync(new URL('../src/components/OnlyFitHealthLibraryPage.tsx', import.meta.url), 'utf8');
const api = readFileSync(new URL('../src/lib/onlyfitHealthLibrary.ts', import.meta.url), 'utf8');
const exercisePage = readFileSync(new URL('../src/components/ExerciseCatalogPage.tsx', import.meta.url), 'utf8');
const exerciseApi = readFileSync(new URL('../src/lib/exerciseCatalog.ts', import.meta.url), 'utf8');

test('consolidates all user-facing OnlyFit Health content in one destination', () => {
  assert.match(app, /onlyfit-health-library[^\n]+OnlyFit Health/);
  assert.doesNotMatch(app, /id: 'protocol-catalog'/);
  for (const label of ['Treinos', 'Programas', 'Nutrição e dietas', 'Protocolos']) assert.ok(page.includes(label));
  assert.match(page, /<ProtocolCatalogPage embedded \/>/);
});

test('uses only the typed Core operations for both official libraries', () => {
  for (const operation of ['healthLibrary', 'healthLibrarySave', 'healthLibraryAct']) assert.match(api, new RegExp(`coreApi\\.staff\\.${operation}`));
  for (const operation of ['exerciseCatalog', 'exerciseCatalogSave', 'exerciseCatalogAct', 'exerciseMediaUpload']) assert.match(exerciseApi, new RegExp(`coreApi\\.staff\\.${operation}`));
  for (const source of [api, exerciseApi]) {
    assert.doesNotMatch(source, /\.rpc\(|\.from\(|functions\.invoke|control_/);
    assert.doesNotMatch(source, /Record<string,\s*unknown>|as\s+[A-Za-z{]/);
  }
});

test('edits workout, diet and program with generated typed builders instead of JSON', () => {
  for (const type of ['ProfessionalWorkoutStepSaveInput', 'NutritionDietMealInput', 'StaffHealthProgramPayload']) assert.ok(page.includes(type));
  for (const label of ['Exercícios', 'Refeições e alimentos', 'Dias do programa']) assert.ok(page.includes(label));
  assert.doesNotMatch(page, /JSON\.parse|JSON\.stringify|Record<string,\s*unknown>|JsonField|primaryJson|secondaryJson/);
});

test('preserves, replaces and explicitly removes exercise media through the inspected upload flow', () => {
  assert.match(exercisePage, /videoFileId:\s*entry\.video_file_id/);
  assert.match(exercisePage, /thumbFileId:\s*entry\.thumb_file_id/);
  assert.match(exercisePage, /videoFileId:\s*null,\s*videoUrl:\s*null/);
  assert.match(exercisePage, /thumbFileId:\s*null,\s*thumbUrl:\s*null/);
  assert.match(exercisePage, /Editar exercício oficial/);
  assert.match(exerciseApi, /action:\s*'prepare'/);
  assert.match(exerciseApi, /method:\s*'PUT'/);
  assert.match(exerciseApi, /action:\s*'complete'/);
  assert.match(exerciseApi, /pending\.file_id/);
});
