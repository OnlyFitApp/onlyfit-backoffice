import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync(
  new URL("../src/components/AmbassadorNetworkPage.tsx", import.meta.url),
  "utf8",
);

test("edits every typed program and policy control", () => {
  for (const key of [
    "network_enabled",
    "onboarding_enabled",
    "allow_direct",
    "follower_threshold",
    "manual_choice_enabled",
    "automatic_principal_enabled",
    "published",
  ])
    assert.match(page, new RegExp(key));
  assert.match(page, /action: ["']setProgram["']/);
  assert.match(page, /action: ["']savePolicy["']/);
  assert.match(page, /Vincular associados sem Principal ao ativá-lo/);
  assert.doesNotMatch(page, /referral_code_enabled|moderation_enabled/);
});

test("edits the complete hierarchical region model with optimistic concurrency", () => {
  for (const key of [
    "scope_type",
    "country_code",
    "state_code",
    "city_name",
    "parent_id",
    "specificity",
    "priority",
    "expected_version",
  ])
    assert.match(page, new RegExp(key));
  for (const scope of ["global", "country", "state", "city", "custom"])
    assert.match(page, new RegExp(`["']${scope}["']`));
});

test("supports request routing and optimistic decisions", () => {
  assert.match(page, /action: ["']transferRequest["']/);
  assert.match(page, /decision: ["']approve["']/);
  assert.match(page, /decision: ["']reject["']/);
  assert.match(page, /expected_version: request\.version/);
});
