import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');

test('configura a proporção do feed somente pelo contrato tipado do Core', () => {
  const source = read('src/lib/feedSettings.ts');
  const generated = read('src/api/core.gen.ts');

  assert.match(source, /coreApi\.staff\.feedSettings\(\)/);
  assert.match(source, /coreApi\.staff\.feedSettingsSave/);
  assert.match(source, /expectedVersion: input\.expectedVersion/);
  assert.match(generated, /staff_feed_settings_v1/);
  assert.match(generated, /staff_feed_settings_save_v1/);
  assert.doesNotMatch(source, /control_get_feed_algorithm_settings|control_update_feed_distribution_v1|\.from\(/);
});

test('mantém edição administrativa, limites explícitos e conflito visível', () => {
  const app = read('src/App.tsx');

  assert.match(app, /currentRole === 'super_admin' \|\| currentRole === 'admin'/);
  assert.match(app, /followedCount >= 1 && followedCount <= 100/);
  assert.match(app, /discoveryCount >= 1 && discoveryCount <= 100/);
  assert.match(app, /expectedVersion: settings\.version/);
  assert.match(app, /staff\.settings_changed/);
});
