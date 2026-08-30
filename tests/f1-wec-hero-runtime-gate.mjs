import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const f1=fs.readFileSync(path.join(root,'f1-widget-flat-v1000.js'),'utf8');
const wec=fs.readFileSync(path.join(root,'wec-widget-flat-v1000.js'),'utf8');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'hero-assets.json'),'utf8'));

assert.match(f1,/v10\.0\.2-hardening/);
assert.match(wec,/v10\.0\.2-hardening/);
assert.match(f1,/motorsport-hero-v1000-crop2-/,'F1 must invalidate pre-crop2 Hero cache');
assert.match(wec,/motorsport-hero-v1000-crop2-/,'WEC must invalidate pre-crop2 Hero cache');
assert.match(f1,/function heroCropRect\(/);
assert.match(wec,/function heroCropRect\(/);

for(const token of [
 'f1-ferrari-hamilton-japan-fp1-2025',
 'f1-mclaren-piastri-japan-fp1-2025',
 'f1-mercedes-russell-japan-fp3-2025',
 '.2208995819091797',
 '.26781560480594635',
 '.24071915447711945'
]) assert.ok(f1.includes(token),`F1 accepted Hero token missing: ${token}`);
assert.doesNotMatch(f1,/SF-25_-_Thursday\.jpg|MCL39_-_Thursday\.jpg|W16_-_Thursday\.jpg/,'F1 static Thursday Hero shots must not return');
assert.doesNotMatch(f1,/Andrea_Kimi_Antonelli_2025_Italian_Grand_Prix_FP3\.jpg/,'F1 previous Antonelli Hero must not remain in runtime inventory');

for(const token of [
 'wec-toyota-no7-spa-2024',
 'wec-toyota-no8-spa-2024',
 '.2403848002354304',
 '.2236272970835368'
]) assert.ok(wec.includes(token),`WEC accepted Hero token missing: ${token}`);

const f1Assets=manifest.assets.filter(a=>a.category==='F1');
assert.deepEqual(new Set(f1Assets.map(a=>a.assetId)),new Set([
 'f1-ferrari-hamilton-japan-fp1-2025',
 'f1-mclaren-piastri-japan-fp1-2025',
 'f1-mercedes-russell-japan-fp3-2025'
]),'hero-assets F1 inventory must equal accepted Action set');
for(const a of f1Assets){
 assert.equal(a.author,'Liauzh');
 assert.equal(a.license,'CC BY-SA 4.0');
 assert.equal(a.modificationNoticeRequired,true);
 assert.equal(a.runtimeUrls.length,2,'each F1 Action Hero must expose 2048 + 1280 runtime fallback');
}

console.log('Motorsport Hub F1/WEC Hero runtime gate: PASS');
