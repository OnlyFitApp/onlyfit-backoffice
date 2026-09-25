import { copyFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const source = resolve(process.cwd(), '../onlyfit-core/sdk/ts/api.gen.ts');
const target = resolve(process.cwd(), 'src/api/core.gen.ts');
const sourceContents = await readFile(source, 'utf8');

if (!sourceContents.startsWith('// GERADO por scripts/contract.mjs')) {
  throw new Error(`Arquivo inesperado em ${source}`);
}

if (process.argv.includes('--check')) {
  const targetContents = await readFile(target, 'utf8');
  if (targetContents !== sourceContents) {
    throw new Error('SDK TypeScript do Core desatualizado. Rode npm run core:sync-sdk.');
  }
  console.log('SDK TypeScript do Core está sincronizado.');
} else {
  await copyFile(source, target);
  console.log(`SDK TypeScript do Core sincronizado em ${target}`);
}
