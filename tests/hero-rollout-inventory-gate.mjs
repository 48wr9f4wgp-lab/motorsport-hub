import assert from 'node:assert/strict';
import {buildHeroRolloutInventory} from '../tools/build-hero-rollout-inventory.mjs';

const r=buildHeroRolloutInventory();
assert.equal(r.summary.categoryCount,12,'Hero rollout must cover all 12 categories');
assert.equal(r.summary.analysisReadyCount,12,'Every category must have manifest Hero assets and rollout policy');
assert.equal(r.summary.runtimeMutationEnabledCount,1,'Only Dakar may mutate runtime during Phase 8 analysis-first rollout');
assert(r.summary.visualLockProtectedCount>=4,'Visual-lock/device-QA protected categories unexpectedly reduced');
assert.equal(r.pilotOrder.length,11,'Pilot order must contain all non-Dakar categories');
assert.equal(new Set(r.pilotOrder).size,11,'Pilot order contains duplicates');
assert(!r.pilotOrder.includes('DAKAR'),'Dakar is already baselined and must not be in Phase 8 pilot order');
for(const c of r.categories){
  assert(c.manifestAssetCount>0,`${c.id} has no audited Hero asset`);
  assert(c.rolloutState!=='MISSING_POLICY',`${c.id} missing rollout policy`);
  assert.equal(c.renderer.drawContext,true,`${c.id} renderer must use DrawContext before generated crop rollout`);
  if(c.visualLockProtected)assert.equal(c.runtimeMutation,false,`${c.id} protected visual lock cannot mutate runtime`);
}
const d=r.categories.find(c=>c.id==='DAKAR');
assert(d,'Dakar inventory missing');
assert.equal(d.rolloutState,'RUNTIME_BASELINE_ACTIVE');
assert.equal(d.renderer.generatedCropBaseline,true,'Dakar generated crop baseline missing');
const ids=new Set(r.categories.map(c=>c.id));
for(const id of r.pilotOrder)assert(ids.has(id),`Unknown Hero rollout pilot category ${id}`);
console.log('Motorsport Hub 12-category Hero rollout inventory gate: PASS');
