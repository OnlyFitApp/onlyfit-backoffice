import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

test('catalog sends every step to backend validation and preserves an unspecified clock', async () => {
  let sent;
  const exports = {};
  const source = readFileSync(new URL('../src/lib/protocolCatalog.ts', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.CommonJS}}).outputText;
  const supabase = {rpc: async (_name, payload) => {
    sent = payload;
    return {data: {id: payload.p_id}, error: null};
  }};
  runInNewContext(compiled, {exports, require: () => ({supabase, api: new Proxy({}, {get: () => supabase})})});
  await exports.upsertProtocolCatalogEntry({id:'onlyfit_health_example',name:'Example',category:'Recovery',
    description:'Source instructions',iconKey:'sun',flow:'generic',structureLocked:true,clinicalNotice:true,
    featured:false,sortOrder:0,active:true,defaultSteps:[
      {name:'Named step',instruction:'Complete instruction',time:'',durationMinutes:null},
      {name:'',instruction:'Must not disappear',time:'08:00',durationMinutes:null},
    ]});
  assert.equal(sent.p_default_steps.length,2);
  assert.equal(sent.p_default_steps[0].instruction,'Complete instruction');
  assert.equal('time' in sent.p_default_steps[0],false);
  assert.equal(sent.p_default_steps[1].instruction,'Must not disappear');
});
