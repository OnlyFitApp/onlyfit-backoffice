import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const require = createRequire(import.meta.url);
function load(relative, resolve = require) {
  const source = readFileSync(new URL(relative, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020,
  } });
  const module = { exports: {} };
  new Function('require', 'module', 'exports', outputText)(resolve, module, module.exports);
  return module.exports;
}
const { requestPublicSystemStatus } = load('../src/api/publicSystemStatus.ts');
const available = { maintenance: false, message_key: null, started_at: null, retry_after_seconds: 60 };

test('public status uses canonical route without cookies or session token', async () => {
  let request;
  const result = await requestPublicSystemStatus('https://core.example/', 'public-test-key', async (url, init) => {
    request = { url, init };
    return Response.json(available);
  });
  assert.deepEqual(result, available);
  assert.equal(request.url, 'https://core.example/functions/v1/worker/app/status');
  assert.equal(request.init.credentials, 'omit');
  assert.equal(request.init.cache, 'no-store');
  assert.equal(request.init.headers.Authorization, undefined);
  assert.equal(request.init.headers.apikey, 'public-test-key');
  assert.ok(request.init.signal instanceof AbortSignal);
});

test('HTTP and malformed contracts cannot grant availability', async () => {
  for (const response of [new Response('', { status: 503 }), Response.json({}),
    Response.json({ ...available, maintenance: 'false' }),
    Response.json({ ...available, retry_after_seconds: 0 }),
    Response.json({ ...available, started_at: 'invalid' })]) {
    await assert.rejects(requestPublicSystemStatus('https://core.example', 'public', async () => response));
  }
});

test('stalled network is aborted after ten seconds and can be retried', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const pending = requestPublicSystemStatus('https://core.example', 'public', async (_url, init) =>
    new Promise((_resolve, reject) => init.signal.addEventListener('abort', () => reject(new Error('aborted')))));
  const rejected = assert.rejects(pending, /aborted/);
  t.mock.timers.tick(10_000);
  await rejected;
  assert.deepEqual(await requestPublicSystemStatus('https://core.example', 'public', async () => Response.json(available)), available);
});

function renderStatus(state) {
  const { PlatformStatusGate } = load('../src/components/PlatformStatusGate.tsx', (name) => {
    if (name === '@tanstack/react-query') return { useQuery: () => state };
    if (name === '../api/core') return { coreApi: {} };
    if (name === 'lucide-react') return { RefreshCw: () => React.createElement('svg') };
    return require(name);
  });
  return renderToStaticMarkup(React.createElement(PlatformStatusGate, null,
    React.createElement('div', { 'data-testid': 'application' }, 'Protected application')));
}
for (const [label, state, application, message] of [
  ['initial check', { isPending: true, isFetching: true }, true, null],
  ['initial failure', { isError: true }, false, 'Não foi possível conectar'],
  ['available', { data: available }, true, null],
  ['background check', { data: available, isFetching: true }, true, null],
  ['background failure', { data: available, isError: true }, true, 'Tentaremos novamente'],
  ['maintenance', { data: { ...available, maintenance: true } }, false, 'OnlyFit em manutenção'],
  ['failed maintenance recheck', { data: { ...available, maintenance: true }, isError: true }, false, 'Não foi possível conectar'],
]) {
  test(`gate renders correctly during ${label}`, () => {
    const html = renderStatus({ refetch: () => Promise.resolve(), ...state });
    assert.equal(html.includes('data-testid="application"'), application);
    assert.ok(!html.includes('Verificando disponibilidade'));
    if (message) assert.ok(html.includes(message));
    else assert.ok(!html.includes('login-shell'));
  });
}
