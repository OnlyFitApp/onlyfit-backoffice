import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('active backoffice queries refresh after focus and reconnect', () => {
  const source = readFileSync(new URL('../src/main.tsx', import.meta.url), 'utf8');

  assert.match(source, /refetchOnWindowFocus:\s*['"]always['"]/);
  assert.match(source, /refetchOnReconnect:\s*['"]always['"]/);
});
