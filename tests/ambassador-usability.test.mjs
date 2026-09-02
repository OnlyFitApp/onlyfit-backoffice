import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const network = readFileSync(new URL('../src/components/AmbassadorNetworkPage.tsx', import.meta.url), 'utf8');
const compensation = readFileSync(new URL('../src/components/AmbassadorCompensationPage.tsx', import.meta.url), 'utf8');
const ui = readFileSync(new URL('../src/components/AmbassadorUi.tsx', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');

test('uses accessible tabs and dialogs without native prompts', () => {
  assert.match(ui, /aria-controls/);
  assert.match(ui, /aria-modal="true"/);
  assert.match(ui, /role="dialog"/);
  assert.match(ui, /ArrowLeft/);
  assert.match(ui, /Escape/);
  assert.doesNotMatch(network, /window\.(?:confirm|prompt)/);
  assert.doesNotMatch(compensation, /window\.(?:confirm|prompt)/);
});

test('preserves drafts on failed writes and warns before discarding', () => {
  assert.match(network, /if \(succeeded\) discardEditor\(\)/);
  assert.match(network, /if \(succeeded\) discard\(\)/);
  assert.match(compensation, /useUnsavedWarning/);
  assert.match(network, /Alterações não salvas/);
  assert.match(compensation, /Alterações não salvas/);
});

test('keeps technical legacy tools restricted and uses plain operational labels', () => {
  assert.match(network, /canSeeTechnical = role\.data === 'super_admin'/);
  assert.match(network, /Ferramentas técnicas/);
  assert.doesNotMatch(network, />Destaque editorial</);
  assert.match(compensation, /label: 'Percentuais'/);
  assert.match(compensation, /label: 'Taxas'/);
});

test('loads ambassador areas on demand', () => {
  assert.match(app, /lazy\(\(\) => import\('\.\/components\/AmbassadorNetworkPage'\)/);
  assert.match(app, /lazy\(\(\) => import\('\.\/components\/AmbassadorCompensationPage'\)/);
  assert.match(app, /<Suspense/);
});
