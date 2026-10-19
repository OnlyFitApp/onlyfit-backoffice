import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const source = readFileSync(
  new URL("../src/lib/ambassadorRankingPage.ts", import.meta.url),
  "utf8",
);
const javascript = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
}).outputText;
const { buildRankingMembers, buildRankingPageHtml } = await import(
  `data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`
);

const brazil = {
  id: "membership-brazil-private",
  account_id: "account-private",
  display_name: "Pessoa de teste",
  username: "pessoa.teste",
  classification: "principal",
  affinity_group_label: "Corrida",
  country_code: "BR",
  state_code: null,
  city_name: null,
  follower_count: 10,
  status: "active",
  contract_reference: "contract-private",
};
const portugal = {
  ...brazil,
  id: "membership-portugal-private",
  country_code: "PT",
  classification: "associate",
};

function exportedData(html) {
  return JSON.parse(html.match(/var DATA = (.*);/)[1]);
}

function page(members, slug = "test-page") {
  return buildRankingPageHtml({
    slug,
    title: "Ranking de teste",
    generatedAt: "2026-10-19T12:00:00.000Z",
    members,
  });
}

test("keeps different memberships independently selectable for the same username", () => {
  const members = buildRankingMembers([brazil, portugal]);
  assert.equal(members.length, 2);
  assert.notEqual(members[0].key, members[1].key);
  assert.equal(members.filter((member) => member.key !== members[0].key)[0].place, "PT");
  const refreshed = buildRankingMembers([portugal, brazil]);
  assert.equal(refreshed[0].key, members[1].key);
});

test("exports distinct stable keys without exposing internal identifiers or extra fields", async () => {
  const members = buildRankingMembers([brazil, portugal]);
  members[0].privateExtra = "private-extra-field";
  const html = await page(members);
  const exported = exportedData(html).members;
  assert.equal(new Set(exported.map((member) => member.key)).size, 2);
  for (const member of exported) assert.match(member.key, /^[0-9a-f]{64}$/);
  for (const secret of [brazil.id, portugal.id, brazil.account_id, brazil.contract_reference, "private-extra-field"])
    assert.ok(!html.includes(secret));
  assert.equal(exported[0].hasContractReference, true);
  const reordered = exportedData(await page([...members].reverse())).members;
  assert.equal(reordered[1].key, exported[0].key);
  const anotherPage = exportedData(await page(members, "another-page")).members;
  assert.notEqual(anotherPage[0].key, exported[0].key);
});

test("excludes ended memberships from ranking candidates", () => {
  const members = buildRankingMembers([brazil, { ...portugal, status: "ended" }]);
  assert.equal(members.length, 1);
  assert.equal(members[0].place, "BR");
});

test("keeps member text inside the embedded data without closing the script", async () => {
  const maliciousText = '</script><img src=x onerror="alert(1)">';
  const html = await page(buildRankingMembers([{ ...brazil, display_name: maliciousText }]));
  assert.equal((html.match(/<script>/g) ?? []).length, 1);
  assert.equal((html.match(/<\/script>/g) ?? []).length, 1);
  assert.ok(!html.includes(maliciousText));
  assert.equal(exportedData(html).members[0].name, maliciousText);
});
