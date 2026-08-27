import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const baseline=JSON.parse(fs.readFileSync(path.join(root,'hero-runtime-baselines/wrc-motogp-v1.json'),'utf8'));
const wrc=fs.readFileSync(path.join(root,'wrc-widget-flat-v1000.js'),'utf8');
const moto=fs.readFileSync(path.join(root,'motogp-widget-flat-v1000.js'),'utf8');

assert.equal(baseline.status,'VISUAL_REVIEW_ACCEPTED');
assert.equal(baseline.sourceRunId,33121664709);
for(const src of [wrc,moto]){
  assert.match(src,/function heroCropRect\(img,W,H,c\)/,'accepted crop transform missing');
  assert.match(src,/motorsport-hero-v1000-crop1-/,'Hero cache must invalidate pre-pilot renders');
  assert.doesNotMatch(src,/HERO\.focus|preset\.focus/,'runtime must not fall back to legacy focus crop');
}
assert.match(wrc,/HERO\.sources/);
assert.match(wrc,/source\.crop/);
assert.match(moto,/preset\.crop/);

for(const n of [0.18171806255976364,0.2921072355906169,0.19653893629709884,0.26584787438313173,0.30434782608695654,0.28471313476562504,0.2841728782653809,0.6956521739130435]){
  assert(wrc.includes(String(n))||moto.includes(String(n)),`accepted crop scalar missing: ${n}`);
}

const fnSource=wrc.match(/function heroCropRect\(img,W,H,c\)\{[^\n]+\}/)?.[0];
assert(fnSource,'cannot extract heroCropRect');
class Rect{constructor(x,y,width,height){this.x=x;this.y=y;this.width=width;this.height=height}}
const ctx={Math,Rect};
vm.createContext(ctx);
vm.runInContext(`${fnSource};globalThis.__crop=heroCropRect`,ctx);

for(const assets of Object.values(baseline.categories)){
  for(const a of assets){
    for(const family of ['small','medium']){
      const [iw,ih]=a.sourceSize;
      const c=a[family];
      const W=family==='small'?360:690;
      const H=family==='small'?360:320;
      const r=ctx.__crop({size:{width:iw,height:ih}},W,H,c);
      assert(Math.abs(r.width/iw-r.height/ih)<1e-9,`${a.assetId}/${family}: aspect ratio distorted`);
      const s=r.width/iw;
      const cropLeft=r.x+iw*c.x*s;
      const cropTop=r.y+ih*c.y*s;
      const cropRight=r.x+iw*(c.x+c.w)*s;
      const cropBottom=r.y+ih*(c.y+c.h)*s;
      assert(cropLeft<=1e-6&&cropTop<=1e-6&&cropRight>=W-1e-6&&cropBottom>=H-1e-6,`${a.assetId}/${family}: accepted crop does not cover viewport`);
    }
  }
}

assert(baseline.categories.MOTOGP.some(a=>a.mode==='RIDER_FALLBACK'&&a.assetId.includes('bagnaia')),'Bagnaia rider fallback acceptance missing');
console.log('Motorsport Hub Hero runtime crop gate: PASS');
