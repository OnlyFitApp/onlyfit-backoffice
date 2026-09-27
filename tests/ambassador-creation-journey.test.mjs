import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync(
  new URL("../src/components/AmbassadorNetworkPage.tsx", import.meta.url),
  "utf8",
);
test("creates and edits assignments with all canonical presentation fields", () => {
  for (const field of [
    "Profissional",
    "Classificação",
    "Região",
    "Principal",
    "Apresentação",
    "Referência contratual",
    "Ordem de exibição",
    "Início",
    "Fim",
    "Visível publicamente",
  ])
    assert.match(page, new RegExp(field));
  for (const key of [
    "public_visible",
    "display_order",
    "starts_at",
    "ends_at",
    "expected_version",
  ])
    assert.match(page, new RegExp(key));
});

test("offers every supported assignment transition", () => {
  for (const transition of [
    "submit",
    "activate",
    "suspend",
    "reactivate",
    "end",
  ])
    assert.match(page, new RegExp(`transition: ["']${transition}["']`));
  assert.match(page, /action: ["']transferAssociate["']/);
});
