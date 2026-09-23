// F1: toda chamada ao backend passa por api.<domínio>, e cada operação é
// chamada pelo domínio dono dela no contrato (src/api/contract.gen.ts, gerado
// por onlyfit-supabase/contract/sync.mjs).
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
    return relative(SRC, full) === join('lib', 'supabase.ts') ? [] : [full];
  });
}

const files = sourceFiles(SRC).map((file) => ({ rel: relative(SRC, file), text: readFileSync(file, 'utf8') }));
const contract = readFileSync(join(SRC, 'api', 'contract.gen.ts'), 'utf8');
const owner = Object.fromEntries([...contract.matchAll(/"([a-z]+:[\w\-:./]+)": "(\w+)"/g)].map((m) => [m[1], m[2]]));

const GAP = String.raw`(?:\s|//[^\n]*\n|/\*[\s\S]*?\*/)*`;
const DIRECT = new RegExp(String.raw`(?<![\w.$])supabase${GAP}\.${GAP}(from|rpc|channel|functions|storage)\b|\(\s*supabase(\s*\.\s*\w+)?\s+as\s+`, 'g');
const CALL = /\bapi\s*\.\s*(\w+)\s*\.\s*(loose\s*\.\s*from|loose\s*\.\s*rpc|from|rpc|functions\s*\.\s*invoke|storage\s*\.\s*from)\s*(?:<[\s\S]*?>(?=\s*\())?\s*\(\s*(['"`])([\w\-:./]+)\3/g;

const kindOf = (method) => {
  const m = method.replace(/\s+/g, '');
  if (m.endsWith('from') && !m.startsWith('storage')) return 'table';
  if (m.endsWith('rpc')) return 'rpc';
  if (m === 'functions.invoke') return 'edge';
  return 'bucket';
};

test('nenhuma tela chama o Supabase direto', () => {
  const offenders = files.flatMap(({ rel, text }) =>
    [...text.matchAll(DIRECT)].map((m) => `${rel}:${text.slice(0, m.index).split('\n').length}`),
  );
  assert.deepEqual(offenders, []);
});

test('cada operação é chamada pelo domínio dono dela', () => {
  const problems = [];
  for (const { rel, text } of files) {
    for (const m of text.matchAll(CALL)) {
      const [, domain, method, , name] = m;
      const key = `${kindOf(method)}:${name}`;
      const line = text.slice(0, m.index).split('\n').length;
      if (!owner[key]) problems.push(`${rel}:${line}: ${key} fora do contrato`);
      else if (owner[key] !== domain) problems.push(`${rel}:${line}: ${key} é de ${owner[key]}, chamado por api.${domain}`);
    }
  }
  assert.deepEqual(problems, []);
});
