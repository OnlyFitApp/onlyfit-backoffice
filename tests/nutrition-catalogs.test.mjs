import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const page = readFileSync(new URL('../src/components/NutritionCatalogsPage.tsx', import.meta.url), 'utf8');
const api = readFileSync(new URL('../src/lib/nutritionCatalogs.ts', import.meta.url), 'utf8');

test('exposes both nutrition catalogs through a navigable backoffice page', () => {
  assert.match(app, /nutrition-catalogs[^\n]+Catálogos nutricionais/);
  assert.match(app, /activeSection === 'nutrition-catalogs'/);
  assert.match(page, /Fontes de alimentos/);
  assert.match(page, /Nutrientes/);
});

test('uses only the generated discriminated catalog contracts', () => {
  for (const operation of ['catalog', 'catalogSave', 'catalogActivate', 'catalogDeactivate']) {
    assert.match(api, new RegExp(`coreApi\\.staff\\.${operation}`));
  }
  for (const type of ['StaffFoodSourceSave', 'StaffNutrientSave']) assert.ok(page.includes(type));
  for (const field of ['origin', 'display_name_key', 'license_name', 'license_url', 'attribution_text', 'homepage_url', 'verified_by_default', 'search_priority', 'unit']) {
    assert.ok(page.includes(field), `missing ${field}`);
  }
  assert.doesNotMatch(api + page, /\.from\(|\.rpc\(|functions\.invoke|Record<string,\s*unknown>|\sas\s/);
});
