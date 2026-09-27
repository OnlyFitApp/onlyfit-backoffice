import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = fileURLToPath(new URL('../src', import.meta.url));

function sourceFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return entry === 'api' ? [] : sourceFiles(full);
    if (!/\.(ts|tsx)$/.test(entry) || /\.d\.ts$/.test(entry)) return [];
    return [full];
  });
}

const files = sourceFiles(SRC).map((file) => ({
  rel: relative(SRC, file),
  text: readFileSync(file, 'utf8'),
}));
const directSupabase = /(?<![\w.$])supabase\s*\.(?:from|rpc|channel|functions|storage)\b/;
const legacyGateway = /(?:from\s+['"][^'"]*(?:api\/domain|api\/index|lib\/supabase)['"]|\bapi\s*\.\s*\w+\s*\.\s*(?:from|rpc|functions|storage)\b)/;

test('aplicação acessa dados somente pelo SDK tipado do Core', () => {
  const offenders = files
    .filter(({ text }) => directSupabase.test(text) || legacyGateway.test(text))
    .map(({ rel }) => rel);
  assert.deepEqual(offenders, []);
});
