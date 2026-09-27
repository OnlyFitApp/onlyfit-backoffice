import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const catalogFiles = [
  'src/lib/affinityGroups.ts',
  'src/lib/combatTechniques.ts',
  'src/lib/professionalSpecialties.ts',
  'src/lib/sessionTypes.ts',
  'src/lib/marketSettings.ts',
  'src/lib/offeringTypes.ts',
];

test('catalogs consume the generated discriminated union without generic row parsers', () => {
  assert.equal(existsSync(new URL('../src/lib/coreCatalog.ts', import.meta.url)), false);
  for (const file of catalogFiles) {
    const source = read(file);
    assert.match(source, /item\.kind/);
    assert.doesNotMatch(source, /Record<string, unknown>|as Record|objectFrom|recordFrom|numberFrom|parseCoreCatalogItem/);
  }
});

test('catalog views use only canonical nested data and impact fields', () => {
  for (const file of catalogFiles) {
    const source = read(file);
    assert.doesNotMatch(source, /row\.(?:label|icon|sports|distance|regulated|sort_order|in_use_count)/);
  }
  const affinity = read('src/lib/affinityGroups.ts');
  assert.doesNotMatch(affinity, /interested_users|organization_events|operation_cohorts|saved_preferences/);
});

test('payment policy uses only the dedicated closed Core operations', () => {
  const source = read('src/lib/paymentSettings.ts');
  assert.match(source, /coreApi\.staff\.paymentSettings\(\)/);
  assert.match(source, /coreApi\.staff\.paymentSettingsSave/);
  assert.doesNotMatch(source, /coreApi\.staff\.settings(?:Save)?\(|JsonObject|Record<string, unknown>|parseSettings|numberFrom/);
});

test('offer types are closed and expose every delivery supported by the contract', () => {
  const source = read('src/lib/offeringTypes.ts');
  const app = read('src/App.tsx');
  assert.match(source, /StaffOfferTypeItem/);
  assert.doesNotMatch(source, /raw: unknown|as Record|configured.*minimum_price|billing_interval.*\? \[/);
  assert.match(app, /value: 'advertising', label: 'Publicidade'/);
  assert.doesNotMatch(app, /event\.target\.value as (?:OfferDelivery|BillingType|BillingInterval)/);
});
