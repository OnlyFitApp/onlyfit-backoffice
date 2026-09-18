import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/lib/offeringMonetization.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const { offeringMonetization, appleReviewStateLabel } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const offer = { offering_type: 'standalone_workout', billing_type: 'one_time', price: 30, settings: {} };

test('the six active categories distinguish digital purchases from services and physical goods', () => {
  for (const offering_type of ['standalone_workout', 'standalone_diet', 'courses']) {
    assert.equal(offeringMonetization({ ...offer, offering_type }).productType, 'non_consumable');
  }
  assert.equal(offeringMonetization({ ...offer, offering_type: 'premium_content', billing_type: 'recurring' }).productType, 'auto_renewable_subscription');
  for (const offering_type of ['health_consultancy', 'physical_products', 'community_access', 'challenge', 'unknown']) {
    assert.equal(offeringMonetization({ ...offer, offering_type }).canPrepare, false);
  }
});

test('zero-price and free offers never prepare a paid Apple product', () => {
  for (const offering_type of ['premium_content', 'standalone_workout', 'standalone_diet', 'courses']) {
    assert.equal(offeringMonetization({ ...offer, offering_type, price: 0 }).label, 'Gratuito');
    assert.equal(offeringMonetization({ ...offer, offering_type, billing_type: 'free' }).canPrepare, false);
  }
  assert.notEqual(offeringMonetization({ ...offer, offering_type: 'physical_products', price: 0 }).label, 'Gratuito');
});

test('fixed-term courses are non-renewing, while perpetual and recurring products retain their types', () => {
  const course = { ...offer, offering_type: 'courses', settings: { access_duration: 'custom', access_duration_days: 90 } };
  assert.equal(offeringMonetization(course).productType, 'non_renewing_subscription');
  assert.match(offeringMonetization(course).reason, /90 dias/);
  assert.equal(offeringMonetization({ ...course, settings: { access_duration: 'lifetime' } }).productType, 'non_consumable');
  assert.equal(offeringMonetization({ ...course, billing_type: 'recurring' }).productType, 'auto_renewable_subscription');
});

test('invalid duration or unknown billing is not silently interpreted as permanent access', () => {
  for (const access_duration_days of [undefined, 0, -1, 1.5, '90', 2147483648]) {
    assert.equal(offeringMonetization({ ...offer, settings: { access_duration: 'custom', access_duration_days } }).canPrepare, false);
  }
  assert.equal(offeringMonetization({ ...offer, billing_type: 'unknown' }).canPrepare, false);
  assert.equal(offeringMonetization({ ...offer, price: NaN }).canPrepare, false);
});

test('review labels distinguish submitted from approved and avoid exposing unknown provider text', () => {
  assert.equal(appleReviewStateLabel('WAITING_FOR_REVIEW'), 'Aguardando revisão');
  assert.equal(appleReviewStateLabel('APPROVED'), 'Aprovado');
  assert.equal(appleReviewStateLabel('unexpected-private-error'), 'Conferir estado na Apple');
});

test('catalog hydration preserves non-renewing products returned by the server', async () => {
  const text = readFileSync(new URL('../src/lib/offeringCatalog.ts', import.meta.url), 'utf8')
    .replace("import { supabase } from './supabase';", `const supabase = { rpc: async name => ({ data: name === 'control_list_financial_offering_catalog'
      ? {items:[{business_offering_id:'offer',settings:{},offering_type:'courses'}]}
      : name === 'control_get_app_store_products' ? {offer:{product_type:'non_renewing_subscription'}} : {} }) };`);
  const mod = ts.transpileModule(text, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
  const { listOfferingCatalog } = await import(`data:text/javascript;base64,${Buffer.from(mod).toString('base64')}`);
  assert.equal((await listOfferingCatalog({})).items[0].app_store_product_type, 'non_renewing_subscription');
});
