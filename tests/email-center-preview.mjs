import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';

const fixture = fileURLToPath(new URL('./fixtures/email-center-preview.tsx', import.meta.url));
const server = await createServer({
  plugins: [{ name: 'isolated-email-preview', enforce: 'pre', resolveId(source, importer) {
    if (importer?.endsWith('/src/components/EmailCenter.tsx') && /hooks\/use(EmailCenter|OutboundEmail)$/.test(source)) return fixture;
    if (source === '../api/core' && importer?.includes('/src/lib/')) return fixture;
  } }],
  server: { host: '127.0.0.1', port: 4179, strictPort: true },
});
await server.listen();
console.log('Isolated preview: http://127.0.0.1:4179/tests/fixtures/email-center.html');
