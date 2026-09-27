import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
const page = readFileSync(
  new URL("../src/components/AmbassadorNetworkPage.tsx", import.meta.url),
  "utf8",
);
const api = readFileSync(
  new URL("../src/lib/ambassadorNetwork.ts", import.meta.url),
  "utf8",
);

test("keeps the reachable ambassador network journey on typed Core contracts", () => {
  assert.match(app, /id: 'ambassador-network', label: 'Rede de Embaixadores'/);
  assert.match(app, /activeSection === 'ambassador-network'/);
  assert.match(api, /coreApi\.staff\.ambassadorNetwork\(filters\)/);
  assert.match(api, /coreApi\.staff\.ambassadorNetworkAct\(input\)/);
  assert.doesNotMatch(
    api,
    /api\.staff\.rpc|control_|\.from\(|service_role|VITE_.*SECRET/,
  );
});

test("exposes canonical areas without legacy rollout tools", () => {
  for (const label of [
    "Rede",
    "Países e regiões",
    "Regras",
    "Solicitações",
    "Histórico",
  ])
    assert.match(page, new RegExp(label));
  assert.doesNotMatch(
    page,
    /Ferramentas técnicas|Piloto e rollout|Migração controlada|legacy_membership/,
  );
});

test("keeps commercial classification separate from authorization", () => {
  assert.match(
    page,
    /Classificação comercial não concede acesso administrativo/,
  );
  assert.match(page, /["']principal["'] \| ["']associate["']/);
  assert.match(
    page,
    /role\.data === ["']admin["'] \|\| role\.data === ["']super_admin["']/,
  );
});
