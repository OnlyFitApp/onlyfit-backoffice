import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import ts from 'typescript';
const read=(path)=>readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
function moduleWith(api) {
 const exports={};
 runInNewContext(ts.transpileModule(read('src/lib/feedSettings.ts'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,
  {exports,require:()=>({coreApi:api})});
 return exports;
}
const policy={video_seconds:300,story_seconds:60,total_video_seconds:600,media_count:10,ambassador:true};
const settings={version:42,selection_mode:'chronological_discovery',recommendation_interval:5,recommendation_window_days:7,publication_policy:policy};
test('loads the canonical interval, engagement window, version and publication policy',async()=>{
 const m=moduleWith({staff:{feedSettings:async()=>settings}});const r=await m.getFeedDistributionSettings();
 assert.equal(r.recommendationInterval,5);assert.equal(r.recommendationWindowDays,7);assert.equal(r.version,42);assert.equal(r.publicationPolicy,policy);
});
test('saves chronology through the existing typed facade and retains optimistic concurrency',async()=>{
 let sent;const m=moduleWith({staff:{feedSettingsSave:async(args)=>{sent=args;return {...settings,recommendation_interval:12};}}});
 const r=await m.updateFeedDistributionSettings({recommendationInterval:12,recommendationWindowDays:7,expectedVersion:42,ambassadorVideoSeconds:180});
 assert.equal(sent.followedSlots,12);assert.equal(sent.discoverySlots,7);assert.equal(sent.expectedVersion,42);
 assert.equal(sent.selectionMode,'chronological_discovery');assert.equal(sent.ambassadorVideoSeconds,180);assert.equal(r.recommendationInterval,12);
 assert.equal('ambassadorSlots' in sent,false);assert.equal('commonSlots' in sent,false);
});
test('does not hide an optimistic-concurrency rejection',async()=>{
 const m=moduleWith({staff:{feedSettingsSave:async()=>{throw new Error('staff.settings_changed');}}});
 await assert.rejects(m.updateFeedDistributionSettings({}),/staff.settings_changed/);
});
test('supports a response from the prior server during a coordinated deployment',async()=>{
 const m=moduleWith({staff:{feedSettings:async()=>({version:3,selection_mode:'global_groups',publication_policy:policy})}});
 const r=await m.getFeedDistributionSettings();assert.equal(r.recommendationInterval,5);assert.equal(r.recommendationWindowDays,7);
});
test('validates numeric bounds without turning blank, decimal or infinite input into a saved rule',()=>{
 const m=moduleWith({});
 for(const a of [['0','7','5'],['101','7','5'],['5','0','5'],['5','31','5'],['5','7','6'],['','7','5'],['NaN','7','5'],['1.5','7','5'],['5','7','1.001']]) assert.equal(m.parseFeedTuning(...a),null);
 const r=m.parseFeedTuning('5','7','3');assert.equal(r.recommendationInterval,5);assert.equal(r.recommendationWindowDays,7);assert.equal(r.ambassadorVideoSeconds,180);
 assert.ok(m.parseFeedTuning('100','30','5'));assert.equal(m.parseFeedTuning('5','7','1.5').ambassadorVideoSeconds,90);
});
test('keeps administrative editing and presents the same selection rules as Core',()=>{
 const app=read('src/App.tsx');assert.match(app,/currentRole === 'super_admin' \|\| currentRole === 'admin'/);
 assert.match(app,/if \(!canEdit \|\| !values \|\| !settings\)/);assert.match(app,/staff\.settings_changed/);
 assert.match(app,/Curtidas \+ comentários/);assert.match(app,/pessoas seguidas e publicações próprias/);
 assert.doesNotMatch(app,/<option value="global_groups"|Embaixadores a cada rodada|Você está em dia/);
 assert.doesNotMatch(read('src/lib/feedSettings.ts'),/\.from\(|control_get_feed/);
});
