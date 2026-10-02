import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';

const gate = readFileSync(new URL('../src/components/PlatformStatusGate.tsx', import.meta.url), 'utf8');
const main = readFileSync(new URL('../src/main.tsx', import.meta.url), 'utf8');
test('startup uses the typed public Core status contract, never legacy routing', () => {
  assert.match(gate, /coreApi\.app\.systemStatus\(\)/u);
  assert.match(gate, /status\.data && !status\.data\.maintenance && !status\.isError/u);
  assert.match(gate, /refetchInterval: 60_000/u);
  assert.match(gate, /status\.refetch\(\)/u);
  assert.doesNotMatch(main, /initializeApiRouting|apiRouting/u);
  assert.ok(main.indexOf('<QueryClientProvider') < main.indexOf('<PlatformStatusGate>'));
  assert.equal(existsSync(new URL('../src/api/apiRouting.ts', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/api/onlyfit-api.gen', import.meta.url)), false);
});
