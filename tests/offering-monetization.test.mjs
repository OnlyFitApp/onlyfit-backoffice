import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/lib/offeringMonetization.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const { nativeStoreMonetization, appleReviewStateLabel } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const offer = { type: 'standalone_workout', billing_type: 'one_time', price: 30 };

test('all digital categories use native products while services and physical goods stay external', () => {
  for (const type of ['standalone_workout', 'standalone_diet', 'courses', 'community_access', 'challenge']) {
    assert.equal(nativeStoreMonetization({ ...offer, type }).productType, 'non_consumable');
  }
  assert.equal(nativeStoreMonetization({ ...offer, type: 'premium_content', billing_type: 'recurring' }).productType, 'auto_renewable_subscription');
  for (const type of ['health_consultancy', 'physical_products', 'unknown']) {
    assert.equal(nativeStoreMonetization({ ...offer, type }).canPrepare, false);
  }
});

test('zero-price and free offers never prepare a paid native product', () => {
  for (const type of ['premium_content', 'standalone_workout', 'standalone_diet', 'courses', 'community_access', 'challenge']) {
    assert.equal(nativeStoreMonetization({ ...offer, type, price: 0 }).label, 'Gratuito');
    assert.equal(nativeStoreMonetization({ ...offer, type, billing_type: 'free' }).canPrepare, false);
  }
  assert.notEqual(nativeStoreMonetization({ ...offer, type: 'physical_products', price: 0 }).label, 'Gratuito');
});

test('unknown billing is not silently interpreted as permanent access', () => {
  assert.equal(nativeStoreMonetization({ ...offer, billing_type: 'unknown' }).canPrepare, false);
  assert.equal(nativeStoreMonetization({ ...offer, price: NaN }).canPrepare, false);
});

test('review labels distinguish submitted from approved and avoid exposing unknown provider text', () => {
  assert.equal(appleReviewStateLabel('WAITING_FOR_REVIEW'), 'Aguardando revisão');
  assert.equal(appleReviewStateLabel('APPROVED'), 'Aprovado');
  assert.equal(appleReviewStateLabel('unexpected-private-error'), 'Conferir estado na Apple');
});

test('financial catalog uses only the generated Core staff operation', () => {
  const text = readFileSync(new URL('../src/lib/offeringCatalog.ts', import.meta.url), 'utf8')
  assert.match(text, /coreApi\.staff\.financialOfferings/);
  assert.match(text, /coreApi\.staff\.nativeProductSave/);
  assert.doesNotMatch(text, /\.rpc\(|supabase|as Record/);
});
