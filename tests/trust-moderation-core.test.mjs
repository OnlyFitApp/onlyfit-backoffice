import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const company = readFileSync(new URL('../src/lib/companyVerification.ts', import.meta.url), 'utf8');
const companyPage = readFileSync(new URL('../src/components/CompanyVerificationPage.tsx', import.meta.url), 'utf8');
const reviews = readFileSync(new URL('../src/lib/reviewModeration.ts', import.meta.url), 'utf8');
const reviewPage = readFileSync(new URL('../src/components/ReviewModerationPage.tsx', import.meta.url), 'utf8');
const credentials = readFileSync(new URL('../src/lib/credentialReset.ts', import.meta.url), 'utf8');
const communities = readFileSync(new URL('../src/lib/communityModeration.ts', import.meta.url), 'utf8');
const communityPage = readFileSync(new URL('../src/components/CommunityModerationPage.tsx', import.meta.url), 'utf8');

test('company verification uses only the typed Core contract', () => {
  assert.match(company, /coreApi\.staff\.businessVerifications/);
  assert.match(company, /coreApi\.staff\.businessVerificationAct/);
  assert.doesNotMatch(company, /control_(?:list|review)_company_verification/);
  assert.doesNotMatch(company, /\.rpc\(/);
});

test('company review reveals only the document suffix', () => {
  assert.match(company, /formatCompanyDocumentLast4/);
  assert.match(companyPage, /company_document_last4/);
  assert.doesNotMatch(companyPage, /company\.cnpj/);
});

test('review moderation uses only the typed Core contract', () => {
  assert.match(reviews, /coreApi\.staff\.reviewReports/);
  assert.match(reviews, /coreApi\.staff\.reviewReportAct/);
  assert.doesNotMatch(reviews, /control_(?:list|resolve)_review_report/);
  assert.doesNotMatch(reviews, /\.rpc\(/);
});

test('review moderation renders every reason accepted by the Core', () => {
  assert.match(reviewPage, /misinformation: 'Informação falsa'/);
});

test('credential reset uses the typed Core worker and never the legacy function', () => {
  assert.match(credentials, /coreApi\.staff\.credentialReset/);
  assert.doesNotMatch(credentials, /control-reset-user-credentials/);
  assert.doesNotMatch(credentials, /functions\.invoke/);
});

test('community moderation uses canonical Core states and typed operations', () => {
  assert.match(communities, /coreApi\.staff\.communities/);
  assert.match(communities, /coreApi\.staff\.communityAct/);
  assert.doesNotMatch(communities, /control_(?:list|moderate)_communities?_v2/);
  assert.doesNotMatch(communities, /\.rpc\(/);
  assert.match(communityPage, /entry_paused/);
  assert.match(communityPage, /community\.business_name/);
  assert.doesNotMatch(communityPage, /lifecycle_status|organization_name|discovery_visibility/);
  assert.doesNotMatch(communityPage, /window\.prompt/);
  assert.match(communityPage, /role="dialog"/);
});
