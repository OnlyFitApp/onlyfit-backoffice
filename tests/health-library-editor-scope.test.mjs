import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import { test } from 'node:test';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const event = { preventDefault() {} };

// Run the actual component render functions and event handlers with deterministic
// hook frames. Hook/API boundaries are mocked; no browser or backend is claimed.
function harness({ healthItems = [], nutritionItems = [] } = {}) {
  const frames = new Map();
  let current;
  const writes = [];
  const reads = [];
  const react = {
    useState(initial) {
      const frame = current;
      const index = frame.index++;
      if (!(index in frame.values)) frame.values[index] = typeof initial === 'function' ? initial() : initial;
      return [frame.values[index], next => { frame.values[index] = typeof next === 'function' ? next(frame.values[index]) : next; }];
    },
    useMemo: operation => operation(),
  };
  const mutation = kind => ({ isPending: false, mutate: input => writes.push({ kind, input }),
    mutateAsync: async input => { writes.push({ kind, input }); return {}; }, reset() {} });
  const modules = {
    react,
    'lucide-react': new Proxy({}, { get: () => () => null }),
    '../hooks/useStaffManagement': { useCurrentStaffRole: () => ({ data: 'super_admin' }) },
    '../hooks/useOnlyFitHealthLibrary': {
      useOnlyFitHealthCatalog: (...args) => { reads.push(args); return { data: { items: healthItems.filter(item => item.kind === args[0]), total: healthItems.length }, refetch() {} }; },
      useSaveWorkout: () => mutation('workout'), useSaveDiet: () => mutation('diet'),
      useSaveProgram: () => mutation('program'), useSetLibraryActive: () => mutation('active'),
    },
    '../hooks/useExerciseCatalog': { useExerciseCatalog: () => ({ data: { items: [] } }) },
    '../hooks/useUnsavedWarning': { useUnsavedWarning() {} },
    '../lib/onlyfitHealthLibrary': { libraryErrorMessage: () => 'Erro' },
    '../hooks/useNutritionCatalogs': { useNutritionCatalog: () => ({ data: nutritionItems }), useSaveNutritionCatalogItem: () => mutation('nutrition'), useSetNutritionCatalogItemActive: () => mutation('nutrition-active') },
    '../lib/nutritionCatalogs': { nutritionCatalogErrorMessage: String },
    '../lib/nutritionCatalogPresentation': { foodSourceOriginLabel: String, nutritionCatalogLabel: value => value.data.display_name_key },
    '../hooks/useProtocolCatalog': { useProtocolCatalog: () => ({ data: [] }), useUpsertProtocolCatalogEntry: () => mutation('protocol'), useSetProtocolCatalogEntryActive: () => mutation('protocol-active') },
    '../lib/protocolIconCatalog': { protocolIcon: () => () => null, protocolIconKeys: [] },
    '../lib/protocolCatalog': { protocolLocales: [{ value: 'pt-BR', label: 'Português' }], protocolFlows: [], protocolTranslation: (value, locale) => value.translations.find(item => item.locale === locale), protocolStepTranslation: () => ({ name: '' }), protocolCatalogErrorMessage: String },
    './ProtocolCatalogPage': { ProtocolCatalogPage: () => null },
    '../hooks/useFirstContact': {
      useFirstContactSettings: () => ({ data: { reminder_hours: 24, alert_hours: 48, version: 7 } }),
      useSetFirstContactDeadlines: () => mutation('deadlines'),
      useContractsWithoutFirstContact: () => ({ data: { items: [], total: 0 }, refetch() {} }),
    },
    '../lib/firstContact': { deadlineErrorMessage: String, waitingLabel: String },
    '../lib/format': { formatNumber: String, formatDateTime: String },
  };
  function load(name) {
    const source = readFileSync(new URL(`../src/components/${name}.tsx`, import.meta.url), 'utf8');
    const compiled = ts.transpileModule(source, { compilerOptions: {
      target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX,
    } }).outputText;
    const exports = {};
    runInNewContext(compiled, { exports, require: id => modules[id] ?? require(id) });
    return exports;
  }
  function render(type, props = {}, key = type.name) {
    const frame = frames.get(key) ?? { values: [], index: 0 };
    frames.set(key, frame);
    frame.index = 0;
    current = frame;
    return type(props);
  }
  let catalogKey;
  function catalog(root) {
    const node = find(root, value => value.type?.name === 'ManagedCatalog');
    const nextKey = `catalog:${node.key ?? 'shared'}`;
    if (catalogKey && catalogKey !== nextKey) frames.delete(catalogKey);
    catalogKey = nextKey;
    return render(node.type, node.props, nextKey);
  }
  return { render, catalog, load, writes, reads };
}
function nodes(tree) {
  if (tree == null || typeof tree === 'boolean') return [];
  if (Array.isArray(tree)) return tree.flatMap(nodes);
  return [tree, ...(typeof tree === 'object' ? nodes(tree.props?.children) : [])];
}
function find(tree, predicate) {
  const result = nodes(tree).find(value => value && typeof value === 'object' && predicate(value));
  assert.ok(result, 'Expected component/control was rendered');
  return result;
}
function text(tree) { return nodes(tree).filter(value => typeof value === 'string' || typeof value === 'number').join(''); }
function button(tree, name) { return find(tree, value => value.type === 'button' && text(value).includes(name)); }
function inputInLabel(tree, name) {
  const label = find(tree, value => value.type === 'label' && text(value).includes(name));
  return find(label, value => value.type === 'input');
}

for (const destination of ['Nutrição e dietas', 'Programas']) {
  test(`keeps a workout draft intact until Cancelar before opening ${destination}`, () => {
    const app = harness();
    const { OnlyFitHealthLibraryPage: Page } = app.load('OnlyFitHealthLibraryPage');
    let root = app.render(Page);
    button(app.catalog(root), 'Novo').props.onClick();
    root = app.render(Page);
    let catalog = app.catalog(root);
    let editor = find(catalog, value => value.type?.name === 'LibraryEditor');
    const editorTree = app.render(editor.type, editor.props);
    const fields = find(editorTree, value => value.type?.name === 'WorkoutFields');
    const fieldsTree = app.render(fields.type, fields.props);
    inputInLabel(fieldsTree, 'Título').props.onChange({ target: { value: 'QA rascunho preservado' } });
    root = app.render(Page);
    const target = button(root, destination);
    assert.equal(target.props.disabled, true);
    // The handler also refuses a stale activation independently of disabled UI.
    target.props.onClick();
    root = app.render(Page);
    assert.equal(button(root, 'Treinos').props.className, 'active');
    catalog = app.catalog(root);
    editor = find(catalog, value => value.type?.name === 'LibraryEditor');
    assert.equal(editor.props.state.kind, 'workout');
    assert.equal(editor.props.state.payload.title, 'QA rascunho preservado');
    assert.equal(app.writes.length, 0);
    button(app.render(editor.type, editor.props), 'Cancelar').props.onClick();
    root = app.render(Page);
    assert.equal(button(root, destination).props.disabled, false);
    button(root, destination).props.onClick();
    root = app.render(Page);
    catalog = app.catalog(root);
    assert.equal(nodes(catalog).some(value => value?.type?.name === 'LibraryEditor'), false);
    assert.equal(button(root, destination).props.className, 'active');
  });
}

test('a type change starts with its own filters and first page instead of carrying the previous catalog', () => {
  const app = harness();
  const { OnlyFitHealthLibraryPage: Page } = app.load('OnlyFitHealthLibraryPage');
  let root = app.render(Page);
  const original = app.catalog(root);
  find(original, value => value.type === 'input' && value.props['aria-label'] === 'Buscar').props.onChange({ target: { value: 'QA treino' } });
  app.catalog(app.render(Page));
  assert.equal(app.reads.at(-1)[1], 'QA treino');
  button(root, 'Nutrição e dietas').props.onClick();
  root = app.render(Page);
  app.catalog(root);
  assert.deepEqual(app.reads.at(-1), ['diet', '', '', 'all', 25, 0]);
  button(root, 'Treinos').props.onClick();
  app.catalog(app.render(Page));
  assert.deepEqual(app.reads.at(-1), ['workout', '', '', 'all', 25, 0]);
  assert.equal(app.writes.length, 0);
});

test('refuses a mismatched editor payload before issuing any typed save', async () => {
  const app = harness();
  const { OnlyFitHealthLibraryPage: Page } = app.load('OnlyFitHealthLibraryPage');
  let root = app.render(Page);
  button(root, 'Nutrição e dietas').props.onClick();
  root = app.render(Page);
  button(app.catalog(root), 'Novo').props.onClick();
  const editor = find(app.catalog(app.render(Page)), value => value.type?.name === 'LibraryEditor');
  await assert.rejects(editor.props.onSave({ kind: 'workout', id: null, expectedVersion: null,
    payload: { kind: 'workout', title: 'QA tipo incorreto', sport_id: 'strength', steps: [] } }), /library\.editor_scope_changed/);
  assert.equal(app.writes.length, 0);
});

test('protocol editor also locks type tabs until explicitly cancelled', () => {
  const app = harness();
  const { OnlyFitHealthLibraryPage: Page } = app.load('OnlyFitHealthLibraryPage');
  const { ProtocolCatalogPage: Protocols } = app.load('ProtocolCatalogPage');
  let root = app.render(Page);
  button(root, 'Protocolos').props.onClick();
  root = app.render(Page);
  let embedded = find(root, value => value.type?.name === 'ProtocolCatalogPage');
  let protocol = app.render(Protocols, embedded.props);
  button(protocol, 'Novo protocolo').props.onClick();
  root = app.render(Page);
  assert.equal(button(root, 'Treinos').props.disabled, true);
  embedded = find(root, value => value.type?.name === 'ProtocolCatalogPage');
  protocol = app.render(Protocols, embedded.props);
  inputInLabel(protocol, 'Nome').props.onChange({ target: { value: 'QA Protocolo preservado' } });
  protocol = app.render(Protocols, embedded.props);
  assert.equal(button(protocol, 'Novo protocolo').props.disabled, true);
  button(protocol, 'Novo protocolo').props.onClick();
  protocol = app.render(Protocols, embedded.props);
  assert.equal(inputInLabel(protocol, 'Nome').props.value, 'QA Protocolo preservado');
  button(protocol, 'Cancelar').props.onClick();
  root = app.render(Page);
  assert.equal(button(root, 'Treinos').props.disabled, false);
  assert.equal(app.writes.length, 0);
});

test('food-source draft survives a nutrient-tab activation until Cancelar', () => {
  const app = harness();
  const { NutritionCatalogsPage: Page } = app.load('NutritionCatalogsPage');
  let root = app.render(Page);
  button(root, 'Novo item').props.onClick();
  root = app.render(Page);
  let editor = find(root, value => value.type?.name === 'CatalogEditor');
  inputInLabel(app.render(editor.type, editor.props), 'Chave').props.onChange({ target: { value: 'qa_fonte_nao_salva' } });
  root = app.render(Page);
  const nutrients = button(root, 'Nutrientes');
  assert.equal(nutrients.props.disabled, true);
  nutrients.props.onClick();
  root = app.render(Page);
  editor = find(root, value => value.type?.name === 'CatalogEditor');
  assert.equal(editor.props.draft.kind, 'food_sources');
  assert.equal(editor.props.draft.key, 'qa_fonte_nao_salva');
  button(app.render(editor.type, editor.props), 'Cancelar').props.onClick();
  root = app.render(Page);
  button(root, 'Nutrientes').props.onClick();
  root = app.render(Page);
  assert.equal(button(root, 'Nutrientes').props.className, 'active');
  assert.equal(nodes(root).some(value => value?.type?.name === 'CatalogEditor'), false);
  assert.equal(app.writes.length, 0);
});

test('Novo and card Editar cannot replace the current workout draft before closing it', () => {
  const model = { id: 'qa-model', kind: 'workout', title: 'QA Modelo', sport_id: 'strength',
    version: 1, status: 'active', updated_at: '2026-10-15T00:00:00Z', detail: { notes: '', steps: [] } };
  const app = harness({ healthItems: [model] });
  const { OnlyFitHealthLibraryPage: Page } = app.load('OnlyFitHealthLibraryPage');
  let root = app.render(Page);
  button(app.catalog(root), 'Novo').props.onClick();
  root = app.render(Page);
  let catalog = app.catalog(root);
  let editor = find(catalog, value => value.type?.name === 'LibraryEditor');
  const fields = find(app.render(editor.type, editor.props), value => value.type?.name === 'WorkoutFields');
  inputInLabel(app.render(fields.type, fields.props), 'Título').props.onChange({ target: { value: 'QA rascunho protegido' } });
  catalog = app.catalog(app.render(Page));
  for (const name of ['Novo', 'Editar']) {
    const control = button(catalog, name);
    assert.equal(control.props.disabled, true);
    control.props.onClick();
  }
  catalog = app.catalog(app.render(Page));
  editor = find(catalog, value => value.type?.name === 'LibraryEditor');
  assert.equal(editor.props.state.id, null);
  assert.equal(editor.props.state.payload.title, 'QA rascunho protegido');
  button(app.render(editor.type, editor.props), 'Cancelar').props.onClick();
  catalog = app.catalog(app.render(Page));
  button(catalog, 'Editar').props.onClick();
  editor = find(app.catalog(app.render(Page)), value => value.type?.name === 'LibraryEditor');
  assert.equal(editor.props.state.id, model.id);
  assert.equal(app.writes.length, 0);
});

test('Novo item and Editar cannot discard a source draft until explicit cancellation', () => {
  const model = { key: 'qa_model', kind: 'food_sources', version: 1, position: 0, active: true, public: true,
    data: { display_name_key: 'QA Modelo', origin: 'brand', search_priority: 0 } };
  const app = harness({ nutritionItems: [model] });
  const { NutritionCatalogsPage: Page } = app.load('NutritionCatalogsPage');
  let root = app.render(Page);
  button(root, 'Novo item').props.onClick();
  root = app.render(Page);
  let editor = find(root, value => value.type?.name === 'CatalogEditor');
  inputInLabel(app.render(editor.type, editor.props), 'Chave').props.onChange({ target: { value: 'qa_draft_preservado' } });
  root = app.render(Page);
  const create = button(root, 'Novo item');
  assert.equal(create.props.disabled, true);
  create.props.onClick();
  const row = find(root, value => value.type?.name === 'CatalogRow');
  const edit = button(app.render(row.type, row.props), 'Editar');
  assert.equal(edit.props.disabled, true);
  edit.props.onClick();
  editor = find(app.render(Page), value => value.type?.name === 'CatalogEditor');
  assert.equal(editor.props.draft.expected_version, null);
  assert.equal(editor.props.draft.key, 'qa_draft_preservado');
  assert.equal(app.writes.length, 0);
});

test('blank first-contact fields are required and cannot reach the mutation even through the submit handler', () => {
  const app = harness();
  const { FirstContactPage: Page } = app.load('FirstContact');
  let root = app.render(Page);
  for (const label of ['Lembrete ao profissional', 'Alerta ao cliente']) {
    const input = inputInLabel(root, label);
    assert.equal(input.props.required, true);
    input.props.onChange({ target: { value: '' } });
  }
  root = app.render(Page);
  assert.equal(button(root, 'Salvar prazos').props.disabled, true);
  find(root, value => value.type === 'form').props.onSubmit(event);
  assert.equal(app.writes.length, 0);
  assert.ok(text(app.render(Page)).includes('Preencha os dois prazos.'));
});

test('keeps integer validation and existing zero handling delegated rather than inventing a new policy', () => {
  const app = harness();
  const { FirstContactPage: Page } = app.load('FirstContact');
  let root = app.render(Page);
  inputInLabel(root, 'Lembrete ao profissional').props.onChange({ target: { value: '1.5' } });
  root = app.render(Page);
  find(root, value => value.type === 'form').props.onSubmit(event);
  assert.equal(app.writes.length, 0);
  assert.ok(text(app.render(Page)).includes('Os prazos são em horas inteiras.'));
  inputInLabel(root, 'Lembrete ao profissional').props.onChange({ target: { value: '0' } });
  root = app.render(Page);
  const input = inputInLabel(root, 'Lembrete ao profissional');
  assert.equal(input.props.min, 1); // Existing native input policy is untouched.
  assert.equal(input.props.max, 720);
  find(root, value => value.type === 'form').props.onSubmit(event);
  assert.equal(app.writes.length, 1); // Mock only: any server policy is preserved.
  assert.equal(app.writes[0].input.reminderHours, 0);
  assert.equal(app.writes[0].input.expectedVersion, 7);
});
