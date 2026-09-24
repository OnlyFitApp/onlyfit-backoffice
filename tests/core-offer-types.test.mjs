import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');

test('administra tipos de oferta somente pelo contrato tipado do Core', () => {
  const source = read('src/lib/offeringTypes.ts');
  const generated = read('src/api/core.gen.ts');

  assert.match(source, /coreApi\.staff\.offerTypes\(\)/);
  assert.match(source, /coreApi\.staff\.offerTypeSave/);
  assert.match(source, /coreApi\.staff\.offerTypeAct/);
  assert.match(generated, /StaffOfferTypeSaveInput/);
  assert.match(generated, /staff_offer_type_save_v1/);
  assert.doesNotMatch(source, /\.from\(|\.loose\b|service_role/);
});

test('expõe criação, configuração completa e ciclo sem apagar catálogo', () => {
  const app = read('src/App.tsx');

  for (const field of [
    'Capacidade de entrega',
    'Preço mínimo',
    'Taxa fixa',
    'Máximo por negócio',
    'Exige grupo de afinidade',
    'Exige categoria de produto',
  ]) assert.match(app, new RegExp(field));
  assert.match(app, /Novo tipo/);
  assert.match(app, /item\.active \? 'Desativar' : 'Ativar'/);
  assert.match(app, /snapshot\?\.canEdit/);
  assert.doesNotMatch(app, /deleteOfferingType|Excluir tipo/);
});

test('falha fechado quando as identidades divergem e exige MFA nos dois projetos', () => {
  const core = read('src/api/core.ts');
  const auth = read('src/contexts/AuthContext.tsx');
  const mfa = read('src/components/MfaGate.tsx');

  assert.match(core, /legacy\.session\.user\.id !== core\.session\?\.user\.id/);
  assert.match(core, /await client\.auth\.signInWithPassword[\s\S]*await supabase\.auth\.signInWithPassword/);
  assert.match(core, /Promise\.allSettled/);
  assert.match(auth, /coreSessionMatches/);
  assert.match(auth, /acceptSession/);
  assert.match(mfa, /legacyAssurance\.data\.currentLevel === 'aal2'/);
  assert.match(mfa, /coreAssurance\.data\.currentLevel === 'aal2'/);
  assert.doesNotMatch(core, /service_role|SERVICE_ROLE/);
});
