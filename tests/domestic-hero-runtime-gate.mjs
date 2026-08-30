import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const parse=(name,src)=>{try{new Function(src)}catch(e){throw new Error(`${name}: syntax error: ${e.message}`)}};

const modules={SUPERGT:read('supergt-widget-flat-v1000.js'),FDJ:read('fdj-widget-flat-v1000.js'),D1GP:read('d1gp-widget-flat-v1000.js')};
for(const [id,src] of Object.entries(modules)){
  parse(id,src);
  assert(src.includes("const V='10.0.3-hardening'"),`${id}: runtime version drift`);
  assert(src.includes('function heroCropRect('),`${id}: fixed normalized crop renderer missing`);
}
const sgt=modules.SUPERGT,fdj=modules.FDJ,d1=modules.D1GP;
assert(sgt.includes("heroAssetId=HERO.sources[0]?.assetId||'supergt'"),'SUPERGT: cache key must derive from current Hero assetId');
assert(sgt.includes("motorsport-hero-v1000-${small?'small':'medium'}-supergt-${heroAssetId}.jpg"),'SUPERGT: asset-aware Hero cache path missing');
assert(!sgt.includes('motorsport-hero-v1000-crop3-'),'SUPERGT: stale fixed crop3 cache namespace must not survive asset replacement');
assert(fdj.includes('motorsport-hero-v1000-crop3-'),'FDJ: accepted Hero cache namespace missing');
assert(d1.includes('motorsport-hero-v1000-crop3-'),'D1GP: accepted Hero cache namespace missing');
for(const token of ['supergt-motul-autech-z-fuji-2024','MOTUL%20AUTECH%20Z%202024%20rd.2%20FUJI.jpg?width=2048',"small:{x:.15955494097645323,y:0,w:.6665637542451374,h:1}","medium:{x:0,y:.18996898193473516,w:1,h:.6957595773674071}"])assert(sgt.includes(token),`SUPERGT Hero contract missing: ${token}`);
assert(!sgt.includes('Osaka%20Auto%20Messe%202025'),'SUPERGT superseded showroom Hero still reachable');
for(const token of ['fdj-drift-cc0','DRIFT-0ae1a2ba-2d7b-4d51-b082-b698f2fbb2f1.jpg?width=2048',"small:{x:.14733669779300687,y:.11229100644588468,w:.6106062036752701,h:.8141416049003601}","medium:{x:.09269440517425534,y:.31221205044195843,w:.67,h:.4142995169082126}"])assert(fdj.includes(token),`FDJ Hero contract missing: ${token}`);
for(const token of ['d1gp-rick-flores-2011','D1GP%20%285679098995%29.jpg?width=2048',"small:{x:.268100764952304,y:0,w:.665390138822403,h:1}","medium:{x:.08660469293751288,y:.23443056344985963,w:.8626684779689151,h:.6012685060501098}"])assert(d1.includes(token),`D1GP Hero contract missing: ${token}`);
assert(!d1.includes('King%20of%20Europe'),'D1GP unrelated King of Europe Hero still reachable');

const heroes=JSON.parse(read('hero-assets.json')),byCat=cat=>heroes.assets.filter(a=>a.category===cat);
assert.equal(byCat('SUPERGT').length,1);assert.equal(byCat('FDJ').length,1);assert.equal(byCat('D1GP').length,1);
const sgtAsset=byCat('SUPERGT')[0];assert.equal(sgtAsset.assetId,'supergt-motul-autech-z-fuji-2024');assert.equal(sgtAsset.author,'Abarabone1206');assert.equal(sgtAsset.license,'CC BY 4.0');assert.equal(sgtAsset.modificationNoticeRequired,true);assert.deepEqual(sgtAsset.runtimeUrls,['https://commons.wikimedia.org/wiki/Special:Redirect/file/MOTUL%20AUTECH%20Z%202024%20rd.2%20FUJI.jpg?width=2048','https://commons.wikimedia.org/wiki/Special:Redirect/file/MOTUL%20AUTECH%20Z%202024%20rd.2%20FUJI.jpg?width=1280']);
const fdjAsset=byCat('FDJ')[0];assert.equal(fdjAsset.assetId,'fdj-drift-cc0');assert.equal(fdjAsset.license,'CC0 1.0');
const d1Asset=byCat('D1GP')[0];assert.equal(d1Asset.assetId,'d1gp-rick-flores-2011');assert.equal(d1Asset.author,'Rick Flores (Flickr: Ricky Flores)');assert.equal(d1Asset.license,'CC BY 2.0');assert.equal(d1Asset.modificationNoticeRequired,true);assert.deepEqual(d1Asset.runtimeUrls,['https://commons.wikimedia.org/wiki/Special:Redirect/file/D1GP%20%285679098995%29.jpg?width=2048','https://commons.wikimedia.org/wiki/Special:Redirect/file/D1GP%20%285679098995%29.jpg?width=1280']);
const attr=read('ATTRIBUTION.md');for(const token of ['Scope: current v10.0.3 hardening build','Abarabone1206','MOTUL AUTECH Z 2024 rd.2 FUJI.jpg','Rick Flores','D1GP (5679098995).jpg','CC BY 2.0 Generic','accepted subject-aware Small/Medium crop'])assert(attr.includes(token),`Attribution contract missing: ${token}`);
assert(!attr.includes('Rowan Harrison'),'superseded D1GP attribution still presented as runtime');assert(!attr.includes('Tokumeigakarinoaoshima'),'superseded SUPER GT attribution still presented as runtime');
console.log('Motorsport Hub domestic Hero runtime gate: PASS');
