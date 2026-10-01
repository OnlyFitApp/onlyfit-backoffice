import { cpSync, existsSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const apiRepository = resolve(process.env.ONLYFIT_API_REPO || join(repositoryRoot, '..', 'onlyfit-api'));
const source = join(apiRepository, 'sdk', 'typescript');
const target = join(repositoryRoot, 'src', 'api', 'onlyfit-api.gen');
const checkOnly = process.argv.includes('--check');

function filesUnder(root) {
  const files = [];
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) visit(path);
      else files.push(relative(root, path));
    }
  };
  visit(root);
  return files.sort();
}

if (!existsSync(source) || !statSync(source).isDirectory()) {
  throw new Error(`SDK TypeScript da OnlyFit API não encontrado em ${source}`);
}

if (checkOnly) {
  if (!existsSync(target)) throw new Error(`Snapshot local não encontrado em ${target}`);
  const sourceFiles = filesUnder(source);
  const targetFiles = filesUnder(target);
  if (sourceFiles.join('\n') !== targetFiles.join('\n')) {
    throw new Error('A lista de arquivos do SDK local diverge do SDK canônico da OnlyFit API.');
  }
  for (const file of sourceFiles) {
    if (!readFileSync(join(source, file)).equals(readFileSync(join(target, file)))) {
      throw new Error(`SDK local divergente: ${file}`);
    }
  }
  console.log(`SDK da OnlyFit API confere: ${target}`);
} else {
  rmSync(target, { force: true, recursive: true });
  cpSync(source, target, { recursive: true });
  console.log(`SDK da OnlyFit API sincronizado em ${target}`);
}
