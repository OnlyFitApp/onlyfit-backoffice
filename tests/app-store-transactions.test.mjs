import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

async function load(file) {
  const source = readFileSync(new URL(file, import.meta.url), 'utf8')
    .replace("import { api } from '../api';", 'const supabase = { rpc: (...args) => globalThis.__appleTransactionsRpc(...args) }; const api = new Proxy({}, { get: () => supabase });');
  const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
}
const apple = await load('../src/lib/appStoreTransactions.ts');
const payments = await load('../src/lib/paymentTransactions.ts');

test('Apple and free payments are never labeled Asaas; unknown providers stay unknown', async () => {
  globalThis.__appleTransactionsRpc = async () => ({ data: {total:4,items:['app_store','stripe','free','new_provider'].map(provider => ({ provider, payment_method: provider }))} });
  const result = await payments.listPaymentTransactions({});
  assert.deepEqual(result.items.map(row => payments.paymentProviderLabel(row.provider)), ['App Store','Stripe','Gratuito','Não identificado']);
  assert.equal(payments.paymentMethodLabel(result.items[0].payment_method), 'Compra no app');
});
test('Apple queries use server pagination and explicitly isolate Sandbox', async () => {
  let request;
  globalThis.__appleTransactionsRpc = async (...args) => { request=args; return {data:{total:0,items:[],limit:25,offset:50}}; };
  await apple.listAppStoreTransactions({environment:'Sandbox',search:'  buyer  ',status:'expired',page:2});
  assert.deepEqual(request,['control_list_app_store_transactions',{p_environment:'Sandbox',p_search:'buyer',p_status:'expired',p_limit:25,p_offset:50}]);
});
test('unknown financial amounts stay unknown, not zero', () => {
  assert.equal(apple.appleMoney(null,'BRL'),'—');
  assert.equal(apple.appleMoney(1.99,null),'—');
  assert.match(apple.appleMoney(1.99,'BRL'),/1,99/);
});
test('RPC errors are not silently rendered as an empty list', async () => {
  globalThis.__appleTransactionsRpc = async () => ({error:new Error('private database details')});
  await assert.rejects(apple.listAppStoreTransactions({environment:'Production',search:'',status:'',page:0}),/Não foi possível/);
});
