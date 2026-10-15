import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const source = readFileSync(new URL('../src/lib/purchasePresentation.ts', import.meta.url), 'utf8');
const javascript = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { purchaseStatusLabel } = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString('base64')}`);

test('administrative purchase labels describe state without asserting delivery or access', () => {
  for (const [status, label] of Object.entries({ pending: 'Pendente', confirmed: 'Confirmada', failed: 'Falhou', cancelled: 'Cancelada', refunded: 'Reembolsada' })) {
    assert.equal(purchaseStatusLabel(status), label);
  }
  assert.equal(purchaseStatusLabel('internal-state-unknown'), 'Estado não identificado');
  assert.equal(purchaseStatusLabel(''), 'Estado não identificado');
});
