import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const network = readFileSync(
  new URL("../src/components/AmbassadorNetworkPage.tsx", import.meta.url),
  "utf8",
);
const compensation = readFileSync(
  new URL("../src/components/AmbassadorCompensationPage.tsx", import.meta.url),
  "utf8",
);
const ui = readFileSync(
  new URL("../src/components/AmbassadorUi.tsx", import.meta.url),
  "utf8",
);
const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");

test("uses accessible shared tabs and no native prompts", () => {
  assert.match(ui, /aria-controls/);
  assert.doesNotMatch(network, /window\.(?:confirm|prompt)/);
  assert.doesNotMatch(compensation, /window\.(?:confirm|prompt)/);
});

test("gates writes to canonical administrative roles and preserves drafts on failure", () => {
  assert.match(
    network,
    /role\.data === ["']admin["'] \|\| role\.data === ["']super_admin["']/,
  );
  assert.match(network, /if \(ok\)/);
  assert.match(network, /ambassadorErrorMessage/);
});

test("loads ambassador areas on demand", () => {
  assert.match(
    app,
    /lazy\(\(\) => import\('\.\/components\/AmbassadorNetworkPage'\)/,
  );
  assert.match(
    app,
    /lazy\(\(\) => import\('\.\/components\/AmbassadorCompensationPage'\)/,
  );
  assert.match(app, /<Suspense/);
});
