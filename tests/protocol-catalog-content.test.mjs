import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const translations = (name, instruction = '') => [
  {locale:'pt-BR',name,category:'Categoria',description:'Descrição completa',instruction},
  {locale:'pt-PT',name,category:'Categoria',description:'Descrição completa',instruction},
  {locale:'en',name,category:'Category',description:'Complete description',instruction},
];

test('catalog sends translated steps to backend validation and preserves an unspecified clock', async () => {
  let sent;
  const exports = {};
  const source = readFileSync(new URL('../src/lib/protocolCatalog.ts', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.CommonJS}}).outputText;
  const core = {
    coreApi: {staff: {
      catalog: async () => ({items: []}),
      catalogSave: async (payload) => {
        sent = payload.item;
        return {kind:'protocol_templates',key:payload.item.key,active:true,version:1};
      },
      catalogActivate: async () => undefined,
      catalogDeactivate: async () => undefined,
    }},
  };
  const icons = {protocolIconKeys:['sun']};
  runInNewContext(compiled, {exports, require: (id) => id.includes('/api/core') ? core : icons});
  await exports.upsertProtocolCatalogEntry({id:'example',translations:translations('Example'),
    iconKey:'sun',flow:'generic',structureLocked:true,clinicalNotice:true,
    featured:false,sortOrder:0,active:true,defaultSteps:[
      {translations:translations('Named step','Complete instruction'),time:'',durationMinutes:null},
      {translations:translations('Second step','Must not disappear'),time:'08:00',durationMinutes:null},
    ]});
  assert.equal(sent.data.default_steps.length,2);
  assert.equal(sent.data.default_steps[0].translations[0].instruction,'Complete instruction');
  assert.equal('time' in sent.data.default_steps[0],true);
  assert.equal(sent.data.default_steps[0].time,null);
  assert.equal(sent.data.default_steps[1].translations[2].instruction,'Must not disappear');
  assert.deepEqual(sent.data.translations.map((item) => item.locale),['pt-BR','pt-PT','en']);
});
