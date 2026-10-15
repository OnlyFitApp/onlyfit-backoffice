import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const source = readFileSync(new URL('../src/components/AmbassadorCompensationPage.tsx', import.meta.url), 'utf8');

// Exercise the real component render trees and handlers, without a Core transport.
function editorHarness({ pending = false } = {}) {
  const calls = [];
  const mutation = (kind) => ({ isPending: pending, mutate: (input) => calls.push({ kind, input }) });
  const exports = {};
  const javascript = ts.transpileModule(`${source}\nexport { MatrixEditor, LifecycleEditor };`, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const dependencies = (name) => {
    if (name === 'react/jsx-runtime') return require(name);
    if (name === 'react') return { useState: (initial) => [typeof initial === 'function' ? initial() : initial, () => {}] };
    if (name === 'lucide-react') return new Proxy({}, { get: (_, key) => key });
    if (name.endsWith('/useAmbassadorCompensation')) return {
      useCompensationMatrixAction: () => mutation('matrix'),
      useChannelCostPolicyAction: () => mutation('cost'),
    };
    return {};
  };
  new Function('require', 'exports', javascript)(dependencies, exports);
  return { ...exports, calls };
}

function nodes(tree, predicate) {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap((child) => nodes(child, predicate));
  return [...(predicate(tree) ? [tree] : []), ...nodes(tree.props?.children, predicate)];
}

const matrix = { id: 'qa-matrix', version: 7, status: 'draft', scenarios: [{ scenario: 'direct_to_principal', professional_share: 70, associate_share: 0, principal_share: 10, platform_share: 20, rationale: 'QA' }] };

test('operator can inspect scenarios but cannot submit changes or access lifecycle controls', () => {
  const { MatrixEditor, LifecycleEditor, calls } = editorHarness();
  const tree = MatrixEditor({ matrix, canEdit: false, close() {} });
  assert.equal(nodes(tree, (node) => node.type === 'select').length, 1);
  const fields = nodes(tree, (node) => node.type === 'input' || node.type === 'textarea');
  assert.equal(fields.length, 5);
  assert.ok(fields.every((field) => field.props.readOnly));
  assert.equal(nodes(tree, (node) => node.type === 'button').length, 0);
  nodes(tree, (node) => node.type === 'form')[0].props.onSubmit({ preventDefault() {} });
  const lifecycle = nodes(tree, (node) => node.type === LifecycleEditor)[0];
  assert.equal(lifecycle.props.canEdit, false);
  for (const kind of ['matrix', 'cost']) {
    for (const status of ['draft', 'scheduled', 'active', 'retired']) {
      const buttons = nodes(LifecycleEditor({ kind, item: { ...matrix, status }, canEdit: false, close() {} }), (node) => node.type === 'button');
      assert.deepEqual(buttons.map((button) => button.props.children), ['Fechar']);
    }
  }
  assert.deepEqual(calls, []);
});

test('administrator retains scenario save and the matching lifecycle operations', () => {
  const { MatrixEditor, LifecycleEditor, calls } = editorHarness();
  const tree = MatrixEditor({ matrix, canEdit: true, close() {} });
  assert.ok(nodes(tree, (node) => node.type === 'input').every((field) => !field.props.readOnly));
  nodes(tree, (node) => node.type === 'form')[0].props.onSubmit({ preventDefault() {} });
  assert.equal(calls[0].input.action, 'saveScenario');
  assert.equal(calls[0].input.expectedVersion, 7);
  assert.equal(calls[0].input.data.professional_share, 70);
  for (const kind of ['matrix', 'cost']) {
    for (const [status, action, label] of [['draft', 'publish', 'Publicar'], ['scheduled', 'activate', 'Ativar'], ['active', 'retire', 'Encerrar']]) {
      const button = nodes(LifecycleEditor({ kind, item: { ...matrix, status }, canEdit: true, close() {} }), (node) => node.type === 'button' && node.props.children === label)[0];
      button.props.onClick();
      assert.equal(calls.at(-1).kind, kind);
      assert.equal(calls.at(-1).input.action, action);
      assert.equal(calls.at(-1).input.expectedVersion, 7);
    }
  }
});

test('pending edits block repeated handler execution, including direct calls', () => {
  const { MatrixEditor, LifecycleEditor, calls } = editorHarness({ pending: true });
  const tree = MatrixEditor({ matrix, canEdit: true, close() {} });
  nodes(tree, (node) => node.type === 'form')[0].props.onSubmit({ preventDefault() {} });
  assert.ok(nodes(tree, (node) => node.type === 'button').every((button) => button.props.disabled));
  for (const kind of ['matrix', 'cost']) {
    const buttons = nodes(LifecycleEditor({ kind, item: matrix, canEdit: true, close() {} }), (node) => node.type === 'button' && node.props.children !== 'Fechar');
    for (const button of buttons) { assert.equal(button.props.disabled, true); button.props.onClick(); }
  }
  assert.deepEqual(calls, []);
});
