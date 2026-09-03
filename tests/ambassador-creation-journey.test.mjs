import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const page = readFileSync(new URL('../src/components/AmbassadorNetworkPage.tsx', import.meta.url), 'utf8');
const api = readFileSync(new URL('../src/lib/ambassadorNetwork.ts', import.meta.url), 'utf8');

test('finds members and explains professional preparation in the same journey', () => {
  assert.match(page, />Usuário</);
  assert.match(page, /candidate\.isProfessional \? 'Profissional' : 'Membro'/);
  assert.match(page, /Motivo da habilitação profissional/);
  assert.match(page, /Somente um superadministrador pode habilitá-lo/);
  assert.match(api, /control_prepare_ambassador_candidate/);
  assert.doesNotMatch(api, /service_role|VITE_.*SECRET/);
});

test('makes the normal path active and public without hiding critical state', () => {
  assert.match(page, /publicVisible: true/);
  assert.match(page, /role: 'principal'/);
  assert.match(page, /Principal representa a vertical no país/);
  assert.match(page, /Exibir no aplicativo assim que estiver ativo/);
  assert.match(page, /Criar e publicar/);
  assert.match(page, /Habilitar, criar e publicar/);
  assert.match(page, /Ativar e publicar/);
  assert.match(page, /Aprovar e publicar/);
  assert.match(page, /Ativo · oculto/);
  assert.match(page, /Este embaixador está ativo, mas oculto no aplicativo/);
});

test('keeps draft and review paths available as explicit alternatives', () => {
  assert.match(page, /Salvar rascunho/);
  assert.match(page, /Enviar para revisão/);
});
