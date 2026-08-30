import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildReport,loadJson} from '../tools/hero-selection-engine.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const manifest=loadJson(path.join(root,'hero-assets.json'));
const policy=loadJson(path.join(root,'hero-selection-policy.json'));

const a=buildReport(manifest,policy),b=buildReport(manifest,policy);
const normalize=x=>({...x,generatedAt:'<time>'});
assert.deepEqual(normalize(a),normalize(b),'Hero selection must be deterministic for identical inputs');
assert.equal(a.category,'DAKAR');
assert.equal(a.roles.length,3);
assert.deepEqual(a.roles.map(x=>x.role),['IDENTITY','ACTION','ENVIRONMENT']);
assert.equal(a.roles[0].status,'SELECTED');
assert.equal(a.roles[0].assetId,'dakar-dacia-sandrider-gims-2024');
assert.equal(a.roles[1].status,'SELECTED');
assert.equal(a.roles[1].assetId,'dakar-2021-stage05-action');
assert.equal(a.roles[2].status,'HOLD_LKG','Current H3 must not be newly promoted while the subject is too small');
assert.equal(a.roles[2].assetId,'dakar-2021-stage10-action');
const h3Reject=a.rejected.find(x=>x.role==='ENVIRONMENT'&&x.assetId==='dakar-2021-stage10-action');
assert(h3Reject,'H3 rejection evidence missing');
assert(h3Reject.reasons.includes('SMALL_SUBJECT_TOO_SMALL'));
assert(h3Reject.reasons.includes('MEDIUM_SUBJECT_TOO_SMALL'));

const manifestIds=new Set(manifest.assets.map(x=>x.assetId));
for(const role of a.roles)assert(manifestIds.has(role.assetId),`Selected/LKG asset is not in audited manifest: ${role.assetId}`);
assert.equal(new Set(a.roles.map(x=>x.assetId)).size,3,'Dakar Tap Action variants must remain distinct');

// Promotion proof: a future approved ENVIRONMENT image that meets the same measurable thresholds
// is promoted without changing selection code.
const improved=structuredClone(policy);
const h3=improved.observations.find(x=>x.assetId==='dakar-2021-stage10-action');
h3.subjectFraction.small=.18;h3.subjectFraction.medium=.13;h3.sourceYear=2026;
const promoted=buildReport(manifest,improved);
assert.equal(promoted.roles.find(x=>x.role==='ENVIRONMENT').status,'SELECTED');
assert.equal(promoted.roles.find(x=>x.role==='ENVIRONMENT').assetId,'dakar-2021-stage10-action');

// License gate proof: an unapproved license never enters automatic selection.
const badManifest=structuredClone(manifest);
badManifest.assets.find(x=>x.assetId==='dakar-2021-stage05-action').license='UNVERIFIED';
const licenseBlocked=buildReport(badManifest,policy);
assert.equal(licenseBlocked.roles.find(x=>x.role==='ACTION').status,'HOLD_LKG');
const licenseReject=licenseBlocked.rejected.find(x=>x.role==='ACTION'&&x.assetId==='dakar-2021-stage05-action');
assert(licenseReject.reasons.includes('LICENSE_NOT_ALLOWED'));

console.log('Motorsport Hub Hero selection gate: PASS');
