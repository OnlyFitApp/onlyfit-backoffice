import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const ui = readFileSync(new URL('../src/components/AppStorePreparation.tsx', import.meta.url), 'utf8');
const dialog = readFileSync(new URL('../src/components/NativeStoreProductsDialog.tsx', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');

test('Apple panel uses the Core mode, not IDs or a local eligibility list', () => {
  assert.match(ui, /data\?\.management\?\.mode === 'advanced_commerce'/);
  assert.doesNotMatch(ui, /\.aca\.generic|endsWith\(|billing_type|standalone_diet/);
  assert.doesNotMatch(app, /nativeStoreMonetization/);
});

test('legacy Apple edits, metadata uploads and review submissions are absent', () => {
  const api = readFileSync(new URL('../src/lib/appStoreCatalog.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(api, /appStoreCatalogAct|appStoreReviewUpload|method: 'PUT'/);
  assert.doesNotMatch(ui, /useMutation|ReviewMetadata|prepare\.mutate|saveCatalogMetadata/);
  assert.match(dialog, /channel === 'google_play' && <GooglePlayProductForm/);
  assert.doesNotMatch(dialog, /com\.onlyfitapp\.app\.oferta|Aprovado pela Apple|Grupo de assinatura/);
});

test('mapping alone is not presented as Apple availability or financial success', () => {
  assert.match(ui, /não comprova a habilitação da Apple nem um pagamento confirmado/);
  assert.doesNotMatch(ui, /Produto aprovado|Produto exclusivo/);
});

test('consumable returned by the Core is labeled as an ACA one-time charge', async () => {
  const source = readFileSync(new URL('../src/lib/offeringMonetization.ts', import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: {
    target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext,
  } }).outputText;
  const { nativeStoreProductTypeLabel } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
  assert.equal(nativeStoreProductTypeLabel('consumable'), 'Compra única · Advanced Commerce');
});
