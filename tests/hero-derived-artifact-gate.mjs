import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const manifest=JSON.parse(fs.readFileSync(path.join(root,'hero-derived-manifest.json'),'utf8'));
const report=JSON.parse(fs.readFileSync(path.join(root,'hero-subject-report.json'),'utf8'));

assert.equal(manifest.schemaVersion,1);
assert.equal(manifest.category,'DAKAR');
assert.equal(manifest.publicationPolicy,'ANALYSIS_ONLY_NO_RUNTIME_MUTATION');
assert.equal(manifest.runtimeMutation,false);
assert.equal(report.summary.analyzed,3);
assert.equal(report.summary.subjectAwareDerivatives,2);
assert.equal(report.summary.sceneFallbackDerivatives,1);
assert.equal(manifest.assets.length,3);

const byId=new Map(manifest.assets.map(a=>[a.assetId,a]));
const identity=byId.get('dakar-dacia-sandrider-gims-2024');
const action=byId.get('dakar-2021-stage05-action');
const environment=byId.get('dakar-2021-stage10-action');
assert(identity&&action&&environment);
assert(identity.roleTags.includes('IDENTITY'));
assert.equal(identity.derivatives?.role,'IDENTITY');
assert(action.roleTags.includes('ACTION'));
assert.equal(action.derivatives?.role,'ACTION');
assert(environment.roleTags.includes('ENVIRONMENT'));
assert.equal(environment.environmentFallback?.role,'ENVIRONMENT');
assert.equal(environment.environmentFallback?.mode,'SCENE_FOCUS');
assert.equal(environment.environmentFallback?.publicationPolicy,'VISUAL_REVIEW_ONLY');

for(const asset of manifest.assets){
 assert.equal(asset.publicationEligible,false);
 const pair=asset.derivatives||asset.environmentFallback;
 assert(pair?.small&&pair?.medium,`${asset.assetId} missing Small/Medium derivatives`);
 for(const key of ['small','medium']){
  const item=pair[key];
  const file=path.resolve(root,item.path);
  assert(file.startsWith(root),`${asset.assetId} derivative escaped repo root`);
  assert(fs.existsSync(file),`${asset.assetId} ${key} derivative missing`);
  const size=fs.statSync(file).size;
  assert(size>10000,`${asset.assetId} ${key} derivative unexpectedly small`);
  assert.equal(item.width,key==='small'?720:1380);
  assert.equal(item.height,key==='small'?720:640);
  assert(item.crop.x>=0&&item.crop.y>=0);
  assert(item.crop.x+item.crop.w<=1.000001&&item.crop.y+item.crop.h<=1.000001);
 }
}
console.log('Hero derived artifact gate PASS');
