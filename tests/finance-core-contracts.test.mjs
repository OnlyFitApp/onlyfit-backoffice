import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

async function load(file) {
  const source = readFileSync(new URL(file, import.meta.url), 'utf8')
    .replace("import { coreApi } from '../api/core';", 'const coreApi = { staff: globalThis.__financeStaffApi };');
  const js = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
}

const calls = [];
globalThis.__financeStaffApi = {
  payoutAct: async (input) => {
    calls.push(['payoutAct', input]);
    return { id: input.payoutId, version: input.expectedVersion + 1 };
  },
  payoutProofUpload: async ({ upload }) => {
    calls.push(['payoutProofUpload', upload]);
    if (upload.action === 'prepare') {
      return {
        file_id: '00000000-0000-4000-8000-000000000001',
        status: 'pending',
        upload_url: 'https://upload.invalid/proof',
        upload_headers: { 'Content-Type': upload.mime, 'Content-Length': String(upload.bytes) },
        expires_in: 300,
      };
    }
    return { file_id: '00000000-0000-4000-8000-000000000001', status: 'ready' };
  },
};

const payouts = await load('../src/lib/payouts.ts');
const payout = {
  id: '00000000-0000-4000-8000-000000000010',
  version: 7,
};

test('payout transitions always carry the current optimistic version and an idempotency key', async () => {
  calls.length = 0;
  await payouts.approvePayout(payout);
  assert.equal(calls[0][0], 'payoutAct');
  assert.deepEqual(
    { action: calls[0][1].action, expectedVersion: calls[0][1].expectedVersion },
    { action: 'approve', expectedVersion: 7 },
  );
  assert.match(calls[0][1].idempotencyKey, /^[0-9a-f-]{36}$/);
});

test('manual payout evidence follows prepare, signed upload, complete and versioned record', async () => {
  calls.length = 0;
  const originalFetch = globalThis.fetch;
  const uploads = [];
  globalThis.fetch = async (url, options) => {
    uploads.push([url, options]);
    return new Response(null, { status: 200 });
  };
  try {
    const proof = new File(['proof'], 'receipt.pdf', { type: 'application/pdf' });
    await payouts.recordManualPayout({ payout, paymentReference: 'bank-123', proof });
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.equal(calls[0][1].action, 'prepare');
  assert.equal(uploads[0][0], 'https://upload.invalid/proof');
  assert.equal(uploads[0][1].method, 'PUT');
  assert.equal(calls[1][1].action, 'complete');
  assert.deepEqual(
    {
      action: calls[2][1].action,
      expectedVersion: calls[2][1].expectedVersion,
      paymentReference: calls[2][1].paymentReference,
      proofFileId: calls[2][1].proofFileId,
    },
    {
      action: 'record',
      expectedVersion: 7,
      paymentReference: 'bank-123',
      proofFileId: '00000000-0000-4000-8000-000000000001',
    },
  );
});

test('manual payout proof rejects unsupported files before requesting an upload', async () => {
  calls.length = 0;
  const proof = new File(['payload'], 'payload.txt', { type: 'text/plain' });
  await assert.rejects(
    payouts.recordManualPayout({ payout, paymentReference: 'bank-123', proof }),
    /PDF, PNG ou JPG/,
  );
  assert.deepEqual(calls, []);
});

test('native product editing uses the native product version, never the offering version', () => {
  const dialog = readFileSync(new URL('../src/components/NativeStoreProductsDialog.tsx', import.meta.url), 'utf8');
  assert.match(dialog, /current\?\.version \?\? null/);
  assert.doesNotMatch(dialog, /expected_version:\s*item\.version/);
});

test('native store management exposes Apple and Google without client-controlled access', () => {
  const dialog = readFileSync(new URL('../src/components/NativeStoreProductsDialog.tsx', import.meta.url), 'utf8');
  assert.match(dialog, /value="app_store"/);
  assert.match(dialog, /value="google_play"/);
  assert.match(dialog, /core.*confere a compra diretamente no Google Play/is);
  assert.doesNotMatch(dialog, /has_access|grantAccess|entitlement/i);
});
